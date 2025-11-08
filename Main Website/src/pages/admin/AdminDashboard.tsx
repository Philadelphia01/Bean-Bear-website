import React, { useEffect, useState } from 'react';
import { orderService, menuService } from '../../firebase/services';
import { 
  CreditCard, 
  Clock, 
  CheckCircle, 
  Coffee,
  TrendingUp,
  BarChart3
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ordersData, menuData] = await Promise.all([
          orderService.getOrders(),
          menuService.getMenuItems()
        ]);
        setOrders(ordersData);
        setMenuItems(menuData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending' || order.status === 'preparing').length;
  const completedOrders = orders.filter(order => order.status === 'completed' || order.status === 'delivered').length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  // Calculate real popular items based on order data
  const itemSales = new Map<string, number>();
  orders.forEach(order => {
    order.items.forEach((item: any) => {
      const currentSales = itemSales.get(item.id) || 0;
      itemSales.set(item.id, currentSales + item.quantity);
    });
  });

  const popularItems = menuItems
    .map(item => ({
      ...item,
      sales: itemSales.get(item.id) || 0
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  const recentOrders = [...orders]
    .sort((a, b) => {
      // Handle different date formats for sorting
      const getDate = (order: any): Date => {
        if (order.date?.toDate) {
          return order.date.toDate();
        } else if (order.date?.seconds) {
          return new Date(order.date.seconds * 1000);
        } else if (typeof order.date === 'string') {
          return new Date(order.date);
        } else {
          return new Date();
        }
      };
      return getDate(b).getTime() - getDate(a).getTime();
    })
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
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
          <p className="text-sm text-green-500 mt-4">
            {orders.length > 0 ? `↑ ${((totalRevenue / orders.length) * 0.15).toFixed(0)}% from last month` : 'No data yet'}
          </p>
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
          <p className="text-sm text-blue-500 mt-4">
            {orders.length > 0 ? `↑ ${((totalOrders / orders.length) * 0.08).toFixed(1)}% from last month` : 'No data yet'}
          </p>
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
          <p className="text-sm text-yellow-500 mt-4">
            {pendingOrders > 0 ? 'Requires attention' : 'All caught up!'}
          </p>
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
          <p className="text-sm text-primary mt-4">
            {orders.length > 0 ? `↑ ${((completedOrders / orders.length) * 0.12).toFixed(1)}% from last month` : 'No data yet'}
          </p>
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
                      {(() => {
                        // Handle different date formats
                        let date: Date;
                        if (order.date?.toDate) {
                          date = order.date.toDate();
                        } else if (order.date?.seconds) {
                          date = new Date(order.date.seconds * 1000);
                        } else if (typeof order.date === 'string') {
                          date = new Date(order.date);
                        } else {
                          date = new Date();
                        }
                        return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
                      })()}
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
                <div className="w-12 h-12 bg-dark-lighter rounded-md flex items-center justify-center mr-4 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to Coffee icon if image fails to load
                      const target = e.target as HTMLElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const fallback = document.createElement('div');
                        fallback.className = 'w-full h-full flex items-center justify-center';
                        fallback.innerHTML = '<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"></path></svg>';
                        parent.appendChild(fallback);
                      }
                    }}
                  />
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
          {orders.length === 0 ? (
            <div className="text-center text-gray-400">
              <p>No sales data available</p>
              <p className="text-sm mt-2">Sales will appear here once orders are placed</p>
            </div>
          ) : (
            <div className="w-full max-w-4xl h-64 relative">
              {(() => {
                // Calculate revenue for each of the last 7 days
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                const daysData = Array.from({ length: 7 }).map((_, index) => {
                  const targetDate = new Date(today);
                  targetDate.setDate(today.getDate() - (6 - index));

                  const dayOrders = orders.filter(order => {
                    // Handle different date formats
                    let orderDate: Date;
                    try {
                      if (order.date?.toDate) {
                        orderDate = order.date.toDate();
                      } else if (order.date?.seconds) {
                        orderDate = new Date(order.date.seconds * 1000);
                      } else if (typeof order.date === 'string') {
                        orderDate = new Date(order.date);
                      } else {
                        return false;
                      }
                      
                      // Validate date
                      if (isNaN(orderDate.getTime())) {
                        return false;
                      }
                      
                      // Check if order is on the target date
                      orderDate.setHours(0, 0, 0, 0);
                      return orderDate.getTime() === targetDate.getTime();
                    } catch (error) {
                      return false;
                    }
                  });

                  const dayRevenue = dayOrders.reduce((sum, order) => sum + (order.total || 0), 0);
                  return { revenue: dayRevenue, date: targetDate };
                });

                // Find max revenue for scaling (minimum 100 to show some height)
                const revenues = daysData.map(d => d.revenue);
                const maxRevenue = Math.max(...revenues, 100);
                const minRevenue = Math.min(...revenues, 0);

                // SVG dimensions
                const svgWidth = 100;
                const svgHeight = 100;
                const padding = 10;
                const chartWidth = svgWidth - (padding * 2);
                const chartHeight = svgHeight - (padding * 2);

                // Calculate points for the line
                const points = daysData.map((dayData, index) => {
                  const x = padding + (index / (daysData.length - 1)) * chartWidth;
                  const y = padding + chartHeight - ((dayData.revenue - minRevenue) / (maxRevenue - minRevenue || 1)) * chartHeight;
                  return { x, y, revenue: dayData.revenue, date: dayData.date };
                });

                // Create path for the line
                const pathData = points.map((point, index) => 
                  `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
                ).join(' ');

                // Create area path (for gradient fill)
                const areaPath = `${pathData} L ${points[points.length - 1].x} ${padding + chartHeight} L ${points[0].x} ${padding + chartHeight} Z`;

                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

                return (
                  <div className="w-full h-full">
                    <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
                      {/* Gradient definitions */}
                      <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
                        </linearGradient>
                        <linearGradient id="lineStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#60A5FA" />
                          <stop offset="100%" stopColor="#3B82F6" />
                        </linearGradient>
                      </defs>
                      
                      {/* Grid lines */}
                      {[0, 25, 50, 75, 100].map((percent) => (
                        <line
                          key={percent}
                          x1={padding}
                          y1={padding + (percent / 100) * chartHeight}
                          x2={padding + chartWidth}
                          y2={padding + (percent / 100) * chartHeight}
                          stroke="#374151"
                          strokeWidth="0.3"
                          strokeDasharray="2,2"
                          opacity="0.4"
                        />
                      ))}
                      
                      {/* Y-axis labels */}
                      {[0, 25, 50, 75, 100].map((percent) => {
                        const value = minRevenue + (maxRevenue - minRevenue) * (1 - percent / 100);
                        return (
                          <text
                            key={percent}
                            x={padding - 2}
                            y={padding + (percent / 100) * chartHeight + 1}
                            fontSize="3"
                            fill="#9CA3AF"
                            textAnchor="end"
                            alignmentBaseline="middle"
                          >
                            {value > 0 ? `R${Math.round(value)}` : ''}
                          </text>
                        );
                      })}
                      
                      {/* Area fill */}
                      <path
                        d={areaPath}
                        fill="url(#lineGradient)"
                      />
                      
                      {/* Line */}
                      <path
                        d={pathData}
                        fill="none"
                        stroke="url(#lineStroke)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      
                      {/* Data points with hover effect */}
                      {points.map((point, index) => (
                        <g key={index}>
                          {/* Outer circle for hover effect */}
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r="3"
                            fill="#3B82F6"
                            opacity="0.2"
                          />
                          {/* Inner circle */}
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r="2"
                            fill="#3B82F6"
                            stroke="#1E1E1E"
                            strokeWidth="0.5"
                          />
                          {/* Center dot */}
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r="0.8"
                            fill="#FFFFFF"
                          />
                        </g>
                      ))}
                    </svg>
                    
                    {/* X-axis labels */}
                    <div className="flex justify-between mt-4 px-2">
                      {daysData.map((dayData, index) => {
                        const dayName = days[dayData.date.getDay()];
                        const dayOfMonth = dayData.date.getDate();
                        return (
                          <div key={index} className="flex flex-col items-center text-center min-w-0 flex-1">
                            <span className="text-xs text-gray-400 font-medium">{dayName}</span>
                            <span className="text-xs text-gray-500">{dayOfMonth}</span>
                            {dayData.revenue > 0 && (
                              <span className="text-xs text-blue-400 font-semibold mt-1">
                                R {dayData.revenue.toFixed(0)}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;