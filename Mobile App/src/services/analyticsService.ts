// Analytics Service
import { db } from '../firebase/config';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  Timestamp,
  startAt,
  endAt,
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
  // Get analytics data for date range
  async getAnalytics(dateRange?: DateRange): Promise<AnalyticsData> {
    try {
      const ordersQuery = dateRange
        ? query(
            collection(db, 'orders'),
            where('date', '>=', Timestamp.fromDate(dateRange.start)),
            where('date', '<=', Timestamp.fromDate(dateRange.end)),
            orderBy('date', 'desc')
          )
        : query(collection(db, 'orders'), orderBy('date', 'desc'));

      const ordersSnapshot = await getDocs(ordersQuery);
      const orders = ordersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

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
        const orderDate = order.date?.toDate
          ? order.date.toDate()
          : order.date?.seconds
          ? new Date(order.date.seconds * 1000)
          : new Date(order.date || Date.now());
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

      // Repeat customers (customers with more than 1 order)
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
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.getAnalytics({ start: today, end: tomorrow });
  }

  // Get analytics for this week
  async getWeekAnalytics(): Promise<AnalyticsData> {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    weekStart.setHours(0, 0, 0, 0);

    return this.getAnalytics({ start: weekStart, end: today });
  }

  // Get analytics for this month
  async getMonthAnalytics(): Promise<AnalyticsData> {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    monthStart.setHours(0, 0, 0, 0);

    return this.getAnalytics({ start: monthStart, end: today });
  }

  // Track event (for custom analytics)
  async trackEvent(eventName: string, eventData?: Record<string, any>): Promise<void> {
    try {
      // In production, you might want to use Firebase Analytics
      // For now, we'll store in Firestore
      const eventsRef = collection(db, 'analyticsEvents');
      await getDocs(eventsRef); // This is just to import the function
      
      // You can add custom event tracking here
      console.log('Event tracked:', eventName, eventData);
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }
}

export const analyticsService = new AnalyticsService();

