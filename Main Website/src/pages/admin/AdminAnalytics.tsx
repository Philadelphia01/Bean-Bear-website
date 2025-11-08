import React, { useState, useEffect } from 'react';
import { analyticsService, AnalyticsData } from '../../services/analyticsService';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, DollarSign, ShoppingCart, Users, Calendar } from 'lucide-react';

const AdminAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('month');

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      let data: AnalyticsData;

      switch (dateRange) {
        case 'today':
          data = await analyticsService.getTodayAnalytics();
          break;
        case 'week':
          data = await analyticsService.getWeekAnalytics();
          break;
        case 'month':
          data = await analyticsService.getMonthAnalytics();
          break;
        default:
          data = await analyticsService.getAnalytics();
      }

      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#D4A76A', '#8B6914', '#F5D99C', '#A67C52', '#6B4E3D'];

  const statusData = analytics
    ? Object.entries(analytics.ordersByStatus).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count,
      }))
    : [];

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-6">
        <p className="text-white">Failed to load analytics</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
        <div className="flex gap-2">
          {(['today', 'week', 'month', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                dateRange === range
                  ? 'bg-primary text-dark'
                  : 'bg-dark-light text-gray-400 hover:text-white'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-dark-light rounded-lg p-6 border" style={{ borderColor: '#D4A76A40' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Revenue</span>
            <DollarSign className="w-5 h-5" style={{ color: '#D4A76A' }} />
          </div>
          <p className="text-2xl font-bold text-white">R {analytics.totalRevenue.toFixed(2)}</p>
        </div>

        <div className="bg-dark-light rounded-lg p-6 border" style={{ borderColor: '#D4A76A40' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Orders</span>
            <ShoppingCart className="w-5 h-5" style={{ color: '#D4A76A' }} />
          </div>
          <p className="text-2xl font-bold text-white">{analytics.totalOrders}</p>
        </div>

        <div className="bg-dark-light rounded-lg p-6 border" style={{ borderColor: '#D4A76A40' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Avg Order Value</span>
            <TrendingUp className="w-5 h-5" style={{ color: '#D4A76A' }} />
          </div>
          <p className="text-2xl font-bold text-white">R {analytics.averageOrderValue.toFixed(2)}</p>
        </div>

        <div className="bg-dark-light rounded-lg p-6 border" style={{ borderColor: '#D4A76A40' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Customers</span>
            <Users className="w-5 h-5" style={{ color: '#D4A76A' }} />
          </div>
          <p className="text-2xl font-bold text-white">{analytics.customerCount}</p>
          <p className="text-xs text-gray-500 mt-1">
            {((analytics.repeatCustomerRate || 0) * 100).toFixed(1)}% repeat rate
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue by Day */}
        <div className="bg-dark-light rounded-lg p-6 border" style={{ borderColor: '#D4A76A40' }}>
          <h3 className="text-lg font-bold text-white mb-4">Revenue by Day</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.revenueByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E1E1E',
                  border: '1px solid #D4A76A40',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#D4A76A"
                strokeWidth={2}
                name="Revenue (R)"
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#8B6914"
                strokeWidth={2}
                name="Orders"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by Status */}
        <div className="bg-dark-light rounded-lg p-6 border" style={{ borderColor: '#D4A76A40' }}>
          <h3 className="text-lg font-bold text-white mb-4">Orders by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E1E1E',
                  border: '1px solid #D4A76A40',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Popular Items */}
      <div className="bg-dark-light rounded-lg p-6 border" style={{ borderColor: '#D4A76A40' }}>
        <h3 className="text-lg font-bold text-white mb-4">Top 10 Popular Items</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={analytics.popularItems.slice(0, 10)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="title" stroke="#999" angle={-45} textAnchor="end" height={100} />
            <YAxis stroke="#999" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E1E1E',
                border: '1px solid #D4A76A40',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="quantity" fill="#D4A76A" name="Quantity Sold" />
            <Bar dataKey="revenue" fill="#8B6914" name="Revenue (R)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminAnalytics;

