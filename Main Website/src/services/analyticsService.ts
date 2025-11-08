// Analytics Service (Main Website)
import { db } from '../firebase/config';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
} from 'firebase/firestore';

export interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  popularItems: Array<{ id: string; title: string; quantity: number; revenue: number }>;
  ordersByStatus: Record<string, number>;
  revenueByDay: Array<{ date: string; revenue: number; orders: number }>;
  customerCount: number;
  repeatCustomerRate: number;
}

export interface DateRange {
  start: Date;
  end: Date;
}

class AnalyticsService {
  // Helper function to normalize date from various formats
  private normalizeDate(dateValue: any): Date {
    if (!dateValue) return new Date();
    
    // If it's a Firestore Timestamp
    if (dateValue.toDate && typeof dateValue.toDate === 'function') {
      return dateValue.toDate();
    }
    
    // If it has seconds property (Firestore Timestamp)
    if (dateValue.seconds) {
      return new Date(dateValue.seconds * 1000);
    }
    
    // If it's already a Date
    if (dateValue instanceof Date) {
      return dateValue;
    }
    
    // If it's an ISO string
    if (typeof dateValue === 'string') {
      return new Date(dateValue);
    }
    
    return new Date();
  }

  // Get analytics data for date range
  async getAnalytics(dateRange?: DateRange): Promise<AnalyticsData> {
    try {
      let orders: any[] = [];
      
      // Try to get all orders first, then filter client-side to avoid index issues
      try {
        const allOrdersQuery = query(collection(db, 'orders'), orderBy('date', 'desc'));
        const allOrdersSnapshot = await getDocs(allOrdersQuery);
        orders = allOrdersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error: any) {
        // If orderBy fails, try without it
        if (error.code === 'failed-precondition' || error.code === 'unavailable') {
          console.warn('OrderBy query failed, fetching all orders without sorting');
          const allOrdersSnapshot = await getDocs(collection(db, 'orders'));
          orders = allOrdersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        } else {
          throw error;
        }
      }

      // Filter by date range client-side if provided
      if (dateRange) {
        const startTime = dateRange.start.getTime();
        const endTime = dateRange.end.getTime();
        
        orders = orders.filter((order: any) => {
          const orderDate = this.normalizeDate(order.date);
          const orderTime = orderDate.getTime();
          return orderTime >= startTime && orderTime <= endTime;
        });
      }

      // Calculate metrics
      const totalRevenue = orders.reduce((sum, order: any) => sum + (order.total || 0), 0);
      const totalOrders = orders.length;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Popular items
      const itemCounts: Record<string, { title: string; quantity: number; revenue: number }> = {};
      orders.forEach((order: any) => {
        if (order.items) {
          order.items.forEach((item: any) => {
            const itemId = item.id || item.title;
            if (!itemCounts[itemId]) {
              itemCounts[itemId] = {
                id: itemId,
                title: item.title || itemId,
                quantity: 0,
                revenue: 0,
              };
            }
            itemCounts[itemId].quantity += item.quantity || 1;
            itemCounts[itemId].revenue += (item.price || 0) * (item.quantity || 1);
          });
        }
      });

      const popularItems = Object.values(itemCounts)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 10);

      // Orders by status
      const ordersByStatus: Record<string, number> = {};
      orders.forEach((order: any) => {
        const status = order.status || 'unknown';
        ordersByStatus[status] = (ordersByStatus[status] || 0) + 1;
      });

      // Revenue by day
      const revenueByDayMap: Record<string, { revenue: number; orders: number }> = {};
      orders.forEach((order: any) => {
        const orderDate = this.normalizeDate(order.date);
        const dateKey = orderDate.toISOString().split('T')[0];

        if (!revenueByDayMap[dateKey]) {
          revenueByDayMap[dateKey] = { revenue: 0, orders: 0 };
        }
        revenueByDayMap[dateKey].revenue += order.total || 0;
        revenueByDayMap[dateKey].orders += 1;
      });

      const revenueByDay = Object.entries(revenueByDayMap)
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Customer metrics
      const uniqueCustomers = new Set(orders.map((order: any) => order.customerId || order.userId));
      const customerCount = uniqueCustomers.size;

      // Repeat customers
      const customerOrderCounts: Record<string, number> = {};
      orders.forEach((order: any) => {
        const customerId = order.customerId || order.userId;
        if (customerId) {
          customerOrderCounts[customerId] = (customerOrderCounts[customerId] || 0) + 1;
        }
      });

      const repeatCustomers = Object.values(customerOrderCounts).filter((count) => count > 1).length;
      const repeatCustomerRate = customerCount > 0 ? repeatCustomers / customerCount : 0;

      return {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        popularItems,
        ordersByStatus,
        revenueByDay,
        customerCount,
        repeatCustomerRate,
      };
    } catch (error) {
      console.error('Error getting analytics:', error);
      return {
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        popularItems: [],
        ordersByStatus: {},
        revenueByDay: [],
        customerCount: 0,
        repeatCustomerRate: 0,
      };
    }
  }

  // Get analytics for today
  async getTodayAnalytics(): Promise<AnalyticsData> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    return this.getAnalytics({ start: today, end: endOfToday });
  }

  // Get analytics for this week
  async getWeekAnalytics(): Promise<AnalyticsData> {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    weekStart.setHours(0, 0, 0, 0);
    
    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    return this.getAnalytics({ start: weekStart, end: endOfToday });
  }

  // Get analytics for this month
  async getMonthAnalytics(): Promise<AnalyticsData> {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    monthStart.setHours(0, 0, 0, 0);
    
    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    return this.getAnalytics({ start: monthStart, end: endOfToday });
  }
}

export const analyticsService = new AnalyticsService();

