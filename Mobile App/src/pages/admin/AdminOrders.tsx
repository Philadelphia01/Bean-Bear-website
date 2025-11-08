import React, { useState, useEffect } from 'react';
import { orderService } from '../../firebase/services';
import { CheckCircle, XCircle, Clock, TruckIcon, Search } from 'lucide-react';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const ordersData = await orderService.getOrders();
        setOrders(ordersData);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    // Filter by status
    if (filter !== 'all' && order.status !== filter) {
      return false;
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.id.toLowerCase().includes(searchLower) ||
        order.customer.toLowerCase().includes(searchLower) ||
        order.address.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'delivered':
        return <TruckIcon className="w-5 h-5 text-green-500" />;
      case 'pending':
      case 'preparing':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      // Update the order status in the database
      await orderService.updateOrder(orderId, { status: newStatus });
      
      // Update local state optimistically
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
      // Optionally show an error message to the user
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-bold font-serif">Order Management</h1>
        <div className="text-sm text-gray-400">
          {filteredOrders.length} orders found
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-dark-light rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark border border-dark-lighter rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Orders' },
              { key: 'pending', label: 'Pending' },
              { key: 'preparing', label: 'Preparing' },
              { key: 'completed', label: 'Completed' },
              { key: 'delivered', label: 'Delivered' },
              { key: 'cancelled', label: 'Cancelled' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-2 rounded-md text-sm transition-colors ${
                  filter === key
                    ? 'bg-primary text-dark'
                    : 'bg-dark hover:bg-dark-lighter text-gray-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table - Mobile Cards */}
      <div className="block md:hidden space-y-4 mb-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-dark-light rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-bold text-lg">#{order.id}</p>
                <p className="text-sm text-gray-400">
                  {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
                </p>
              </div>
              <div className="flex items-center">
                {getStatusIcon(order.status)}
                <span className="ml-2 capitalize text-sm">{order.status}</span>
              </div>
            </div>

            <div className="mb-3">
              <p className="font-medium">{order.customer}</p>
              <p className="text-sm text-gray-400">{order.address}</p>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-primary font-bold text-lg">R {order.total.toFixed(2)}</span>
              <div className="flex gap-2">
                <select
                  className="bg-dark rounded px-2 py-1 text-xs"
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="completed">Completed</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button className="text-primary text-xs hover:underline">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-dark-light rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-dark-lighter">
              <tr>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-lighter">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-dark-lighter">
                  <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">{order.customer}</div>
                      <div className="text-sm text-gray-400">{order.address}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(order.date).toLocaleDateString()}
                    <div className="text-sm text-gray-400">
                      {new Date(order.date).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    R {order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(order.status)}
                      <span className="ml-2 capitalize">{order.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      className="bg-dark rounded px-3 py-1 text-sm"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="completed">Completed</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button className="ml-2 text-primary text-sm hover:underline">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            No orders found
          </div>
        )}
      </div>

      {/* Order Details (could be a modal in a real app) */}
      <div className="mt-8">
        <h2 className="text-lg md:text-xl font-bold mb-4">Order Details</h2>

        <div className="bg-dark-light rounded-lg p-4 md:p-6">
          <p className="text-gray-400 mb-4">Select an order to view details</p>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;