import React, { useState, useEffect } from 'react';
import { orderService } from '../../firebase/services';
import { CheckCircle, XCircle, Clock, Truck, Filter, X, Package, RefreshCw, User } from 'lucide-react';
import toast from 'react-hot-toast';

type Order = {
  id: string;
  customer: string;
  customerId?: string;
  items: any[];
  total: number;
  status: string;
  date: any;
  address?: string;
  paymentMethod?: string;
  orderType?: string;
  pickupTime?: string;
  deliveryPerson?: {
    id: string;
    name: string;
    phone: string;
    vehicleId?: string;
    avatar?: string;
  };
};

// Delivery persons list
const deliveryPersons = [
  { id: 'dp-001', name: 'Samuel Jack', phone: '+27123456789', vehicleId: 'GF 3688', avatar: '' },
  { id: 'dp-002', name: 'Michael Johnson', phone: '+27123456790', vehicleId: 'GF 3689', avatar: '' },
  { id: 'dp-003', name: 'David Williams', phone: '+27123456791', vehicleId: 'GF 3690', avatar: '' },
  { id: 'dp-004', name: 'James Brown', phone: '+27123456792', vehicleId: 'GF 3691', avatar: '' },
  { id: 'dp-005', name: 'Robert Davis', phone: '+27123456793', vehicleId: 'GF 3692', avatar: '' }
];

const AdminOrders: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await orderService.getOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showDetailsModal) {
        setShowDetailsModal(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showDetailsModal]);

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
        return <Truck className="w-5 h-5 text-green-500" />;
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
      await orderService.updateOrderStatus(orderId, newStatus);
      // Update local state
      setOrders((prevOrders: Order[]) =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      // Update selected order if it's the one being changed
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handlePickupTimeChange = async (orderId: string, newPickupTime: string) => {
    try {
      if (!newPickupTime || !newPickupTime.trim()) {
        toast.error('Please select a valid pickup time');
        return;
      }

      await orderService.updatePickupTime(orderId, newPickupTime);
      
      // Update local state
      setOrders((prevOrders: Order[]) =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, pickupTime: newPickupTime } : order
        )
      );
      
      // Update selected order if it's the one being changed
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, pickupTime: newPickupTime });
      }
      
      toast.success('Pickup time updated successfully');
    } catch (error) {
      console.error('Error updating pickup time:', error);
      toast.error('Failed to update pickup time');
    }
  };

  const handleDeliveryPersonChange = async (orderId: string, deliveryPersonId: string) => {
    try {
      if (!deliveryPersonId) {
        // Remove delivery person
        await orderService.updateDeliveryPerson(orderId, null);
        
        // Update local state
        setOrders((prevOrders: Order[]) =>
          prevOrders.map(order =>
            order.id === orderId ? { ...order, deliveryPerson: undefined } : order
          )
        );
        
        // Update selected order if it's the one being changed
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, deliveryPerson: undefined });
        }
        
        toast.success('Delivery person removed');
        return;
      }

      const selectedPerson = deliveryPersons.find(dp => dp.id === deliveryPersonId);
      if (!selectedPerson) {
        toast.error('Delivery person not found');
        return;
      }

      const deliveryPerson = {
        id: selectedPerson.id,
        name: selectedPerson.name,
        phone: selectedPerson.phone,
        vehicleId: selectedPerson.vehicleId,
        avatar: selectedPerson.avatar
      };

      await orderService.updateDeliveryPerson(orderId, deliveryPerson);
      
      // Update local state
      setOrders((prevOrders: Order[]) =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, deliveryPerson } : order
        )
      );
      
      // Update selected order if it's the one being changed
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, deliveryPerson });
      }
      
      toast.success(`Delivery person assigned: ${selectedPerson.name}`);
    } catch (error) {
      console.error('Error updating delivery person:', error);
      toast.error('Failed to assign delivery person');
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const formatDate = (date: any): string => {
    let dateObj: Date;
    if (date?.toDate) {
      dateObj = date.toDate();
    } else if (date?.seconds) {
      dateObj = new Date(date.seconds * 1000);
    } else if (typeof date === 'string') {
      dateObj = new Date(date);
    } else {
      dateObj = new Date();
    }
    return dateObj.toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-400">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-serif">Order Management</h1>
        <button
          onClick={loadOrders}
          disabled={loading}
          className="px-4 py-2 bg-dark-light hover:bg-dark-lighter rounded-md flex items-center gap-2 transition-colors disabled:opacity-50"
          title="Refresh orders"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>
      
      {/* Order Count */}
      {!loading && (
        <div className="mb-4 text-sm text-gray-400">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      )}

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
        <div className="overflow-x-auto max-w-full">
          <table className="w-full text-left min-w-[800px]">
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
                      <div className="font-medium">{order.customer || 'N/A'}</div>
                      <div className="text-sm text-gray-400">{order.address || 'No address'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                      return (
                        <>
                          {date.toLocaleDateString()}
                          <div className="text-sm text-gray-400">
                            {date.toLocaleTimeString()}
                          </div>
                        </>
                      );
                    })()}
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
                    <button
                      className="ml-2 text-primary text-sm hover:underline"
                      onClick={() => handleViewOrder(order)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredOrders.length === 0 && !loading && (
          <div className="p-8 text-center text-gray-400">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No orders found</p>
            <p className="text-sm">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your filters or search term' 
                : 'No orders have been placed yet'}
            </p>
          </div>
        )}
      </div>
      
      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDetailsModal(false);
            }
          }}
        >
          <div 
            className="bg-dark-light rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-dark-light border-b border-dark-lighter p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Order Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Order ID</p>
                  <p className="font-medium">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Status</p>
                  <div className="flex items-center">
                    {getStatusIcon(selectedOrder.status)}
                    <span className="ml-2 capitalize">{selectedOrder.status}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Date</p>
                  <p className="font-medium">{formatDate(selectedOrder.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total</p>
                  <p className="font-bold text-primary text-xl">R {selectedOrder.total.toFixed(2)}</p>
                </div>
              </div>

              {/* Customer Information */}
              <div className="border-t border-dark-lighter pt-4">
                <h3 className="text-lg font-bold mb-4">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Name</p>
                    <p className="font-medium">{selectedOrder.customer || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Order Type</p>
                    <p className="font-medium capitalize">{selectedOrder.orderType || 'delivery'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-400 mb-1">Address</p>
                    <p className="font-medium">{selectedOrder.address || 'No address provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Payment Method</p>
                    <p className="font-medium capitalize">{selectedOrder.paymentMethod || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t border-dark-lighter pt-4">
                <h3 className="text-lg font-bold mb-4">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item: any, index: number) => (
                      <div key={index} className="bg-dark p-4 rounded-lg flex items-center justify-between">
                        <div className="flex items-center flex-1">
                          <div className="w-16 h-16 bg-dark-lighter rounded-md flex items-center justify-center mr-4 overflow-hidden">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <Package className="w-6 h-6 text-primary" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                            {item.customizations && (
                              <div className="text-xs text-gray-500 mt-1">
                                {item.customizations.size && `Size: ${item.customizations.size}`}
                                {item.customizations.addons && item.customizations.addons.length > 0 && (
                                  <span>, Add-ons: {item.customizations.addons.join(', ')}</span>
                                )}
                                {item.customizations.specialInstructions && (
                                  <span>, Note: {item.customizations.specialInstructions}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">R {(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-gray-400">R {item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-center py-4">No items found</p>
                  )}
                </div>
              </div>

              {/* Delivery Person Assignment */}
              {(selectedOrder.orderType === 'delivery' || !selectedOrder.orderType) && (
                <div className="border-t border-dark-lighter pt-4">
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Assign Delivery Person
                  </h3>
                  
                  {/* Determine if delivery person can be assigned */}
                  {(() => {
                    const canAssign = selectedOrder.status === 'preparing';
                    const isCompleted = selectedOrder.status === 'completed' || selectedOrder.status === 'delivered' || selectedOrder.status === 'cancelled';
                    const isPending = selectedOrder.status === 'pending';
                    
                    return (
                      <>
                        {/* Warning message for statuses that don't allow assignment */}
                        {!canAssign && (
                          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                            <p className="text-yellow-400 text-sm">
                              {isPending 
                                ? 'Delivery person can be assigned after order status is changed to "Preparing".'
                                : isCompleted
                                ? 'Delivery person cannot be changed for completed/delivered/cancelled orders.'
                                : 'Delivery person can only be assigned when order status is "Preparing".'
                              }
                            </p>
                          </div>
                        )}

                        {/* Show assigned delivery person */}
                        {selectedOrder.deliveryPerson && (
                          <div className="bg-dark p-4 rounded-lg mb-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{selectedOrder.deliveryPerson.name}</p>
                                <p className="text-sm text-gray-400">
                                  {selectedOrder.deliveryPerson.vehicleId && `Vehicle: ${selectedOrder.deliveryPerson.vehicleId}`}
                                  {selectedOrder.deliveryPerson.phone && ` • ${selectedOrder.deliveryPerson.phone}`}
                                </p>
                              </div>
                              {canAssign && (
                                <button
                                  onClick={() => handleDeliveryPersonChange(selectedOrder.id, '')}
                                  className="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded hover:bg-red-500/10"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Delivery person selection dropdown */}
                        {canAssign ? (
                          <select
                            className="bg-dark border border-primary/30 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary w-full"
                            value={selectedOrder.deliveryPerson?.id || ''}
                            onChange={(e) => {
                              if (e.target.value) {
                                handleDeliveryPersonChange(selectedOrder.id, e.target.value);
                              }
                            }}
                          >
                            <option value="">Select a delivery person...</option>
                            {deliveryPersons.map((person) => (
                              <option key={person.id} value={person.id}>
                                {person.name} {person.vehicleId && `(${person.vehicleId})`}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <select
                            className="bg-dark border border-gray-600 rounded-md px-4 py-2 text-gray-500 w-full cursor-not-allowed"
                            disabled
                          >
                            <option value="">
                              {isPending 
                                ? 'Change status to "Preparing" to assign delivery person'
                                : isCompleted
                                ? 'Cannot assign delivery person to completed orders'
                                : 'Delivery person assignment unavailable'
                              }
                            </option>
                          </select>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Update Status */}
              <div className="border-t border-dark-lighter pt-4">
                <h3 className="text-lg font-bold mb-4">Update Status</h3>
                <select
                  className="bg-dark border border-primary/30 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="completed">Completed</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;