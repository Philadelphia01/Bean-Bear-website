import React, { useState } from 'react';
import { orders } from '../../data/orders';
import { CheckCircle, XCircle, Clock, TruckIcon, Filter } from 'lucide-react';

type Order = typeof orders[0];

const AdminOrders: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
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

  const handleStatusChange = (orderId: string, newStatus: string) => {
    // In a real app, this would update the database
    console.log(`Changing order ${orderId} status to ${newStatus}`);
    // For demo purposes, we're just logging this
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 font-serif">Order Management</h1>
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-primary text-dark' : 'bg-dark-light'}`}
          >
            All Orders
          </button>
          <button 
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-md ${filter === 'pending' ? 'bg-primary text-dark' : 'bg-dark-light'}`}
          >
            Pending
          </button>
          <button 
            onClick={() => setFilter('preparing')}
            className={`px-4 py-2 rounded-md ${filter === 'preparing' ? 'bg-primary text-dark' : 'bg-dark-light'}`}
          >
            Preparing
          </button>
          <button 
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-md ${filter === 'completed' ? 'bg-primary text-dark' : 'bg-dark-light'}`}
          >
            Completed
          </button>
          <button 
            onClick={() => setFilter('delivered')}
            className={`px-4 py-2 rounded-md ${filter === 'delivered' ? 'bg-primary text-dark' : 'bg-dark-light'}`}
          >
            Delivered
          </button>
          <button 
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 rounded-md ${filter === 'cancelled' ? 'bg-primary text-dark' : 'bg-dark-light'}`}
          >
            Cancelled
          </button>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 px-4 py-2 bg-dark-light rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      
      {/* Orders Table */}
      <div className="bg-dark-light rounded-lg overflow-hidden">
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
        <h2 className="text-xl font-bold mb-4">Order Details</h2>
        
        <div className="bg-dark-light rounded-lg p-6">
          <p className="text-gray-400 mb-4">Select an order to view details</p>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;