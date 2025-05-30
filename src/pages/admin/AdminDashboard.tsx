import React from 'react';
import { orders } from '../../data/orders';
import { menuItems } from '../../data/menuItems';
import { 
  CreditCard, 
  Clock, 
  CheckCircle, 
  Coffee,
  TrendingUp,
  BarChart3
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  // Calculate stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending' || order.status === 'preparing').length;
  const completedOrders = orders.filter(order => order.status === 'completed' || order.status === 'delivered').length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  
  const popularItems = [...menuItems]
    .sort(() => 0.5 - Math.random())  // Simple random sort for demo
    .slice(0, 5)
    .map(item => ({
      ...item,
      sales: Math.floor(Math.random() * 100) + 1  // Random sales number for demo
    }));
  
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 font-serif">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-dark-light p-6 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 mb-1">Total Revenue</p>
              <h3 className="text-2xl font-bold">R {totalRevenue.toFixed(2)}</h3>
            </div>
            <div className="p-3 bg-green-500/10 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <p className="text-sm text-green-500 mt-4">↑ 15% from last month</p>
        </div>
        
        <div className="bg-dark-light p-6 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 mb-1">Total Orders</p>
              <h3 className="text-2xl font-bold">{totalOrders}</h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-full">
              <CreditCard className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <p className="text-sm text-blue-500 mt-4">↑ 8% from last month</p>
        </div>
        
        <div className="bg-dark-light p-6 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 mb-1">Pending Orders</p>
              <h3 className="text-2xl font-bold">{pendingOrders}</h3>
            </div>
            <div className="p-3 bg-yellow-500/10 rounded-full">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          <p className="text-sm text-yellow-500 mt-4">Requires attention</p>
        </div>
        
        <div className="bg-dark-light p-6 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 mb-1">Completed Orders</p>
              <h3 className="text-2xl font-bold">{completedOrders}</h3>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <CheckCircle className="w-6 h-6 text-primary" />
            </div>
          </div>
          <p className="text-sm text-primary mt-4">↑ 12% from last month</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Orders */}
        <div className="bg-dark-light p-6 rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Orders</h2>
            <a href="/admin/orders" className="text-primary text-sm hover:underline">View All</a>
          </div>
          
          <div className="space-y-4">
            {recentOrders.map(order => (
              <div key={order.id} className="bg-dark p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">{order.customer}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-primary font-bold">R {order.total.toFixed(2)}</span>
                    <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                      order.status === 'completed' || order.status === 'delivered' 
                        ? 'bg-green-500/20 text-green-500' 
                        : order.status === 'cancelled' 
                          ? 'bg-red-500/20 text-red-500'
                          : 'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Popular Items */}
        <div className="bg-dark-light p-6 rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Popular Items</h2>
            <a href="/admin/menu" className="text-primary text-sm hover:underline">View Menu</a>
          </div>
          
          <div className="space-y-4">
            {popularItems.map(item => (
              <div key={item.id} className="bg-dark p-4 rounded-lg flex items-center">
                <div className="w-12 h-12 bg-dark-lighter rounded-md flex items-center justify-center mr-4">
                  <Coffee className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-bold">{item.title}</p>
                  <p className="text-sm text-gray-400">{item.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">R {item.price}</p>
                  <p className="text-sm text-gray-400">{item.sales} sales</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Sales Chart */}
      <div className="bg-dark-light p-6 rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Sales Overview</h2>
          <div className="flex space-x-2">
            <button className="text-xs px-3 py-1 bg-primary text-dark rounded-full">Weekly</button>
            <button className="text-xs px-3 py-1 bg-dark-lighter text-gray-400 rounded-full">Monthly</button>
            <button className="text-xs px-3 py-1 bg-dark-lighter text-gray-400 rounded-full">Yearly</button>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="flex items-end space-x-8 h-48">
            {/* Simulated chart bars */}
            {Array.from({ length: 7 }).map((_, index) => {
              const height = 30 + Math.random() * 100;
              const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
              return (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-8 bg-gradient-to-t from-primary-dark to-primary rounded-t"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs mt-2 text-gray-400">{days[index]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;