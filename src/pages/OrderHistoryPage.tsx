import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { orderService } from '../firebase/services';
import { ChevronLeft, Package, Clock, CheckCircle, XCircle, Truck, MapPin, MoreVertical, Phone, MessageCircle, User } from 'lucide-react';

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

const statusConfig: Record<string, { color: string; icon: React.ComponentType<{ className?: string }>; label: string }> = {
  pending: { color: 'text-yellow-500', icon: Clock, label: 'Order Received' },
  preparing: { color: 'text-blue-500', icon: Package, label: 'Preparing' },
  ready: { color: 'text-green-500', icon: CheckCircle, label: 'Ready for Pickup' },
  completed: { color: 'text-green-500', icon: CheckCircle, label: 'Completed' },
  delivered: { color: 'text-green-600', icon: Truck, label: 'Delivered' },
  cancelled: { color: 'text-red-500', icon: XCircle, label: 'Cancelled' }
};

// Default status for unknown statuses
const defaultStatus = { color: 'text-gray-500', icon: Clock, label: 'Unknown' };

const OrderHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Subscribe to real-time order updates
    const unsubscribe = orderService.subscribeToUserOrders(user.id, (userOrders) => {
      setOrders(userOrders);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  // Auto-expand order if coming from tracking page with delivered status
  useEffect(() => {
    const autoExpandOrderId = location.state?.autoExpandOrderId;
    if (autoExpandOrderId && orders.length > 0) {
      // Wait a bit for DOM to update, then expand
      const timer = setTimeout(() => {
        setSelectedOrder(autoExpandOrderId);
        // Scroll to the order if possible
        setTimeout(() => {
          const orderElement = document.getElementById(`order-${autoExpandOrderId}`);
          if (orderElement) {
            orderElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [location.state, orders]);

  const formatDate = (dateString: string | any) => {
    // Handle Firestore timestamp objects or ISO strings
    let date: Date;
    if (dateString?.toDate) {
      date = dateString.toDate();
    } else if (dateString?.seconds) {
      date = new Date(dateString.seconds * 1000);
    } else if (typeof dateString === 'string') {
      date = new Date(dateString);
    } else {
      date = new Date();
    }
    
    return date.toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalItems = (items: {quantity: number}[]) => {
    return items.reduce((total: number, item) => total + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Header */}
      <div className="px-4 py-6 bg-gray-900/20">
        <div className="relative">
          <button
            onClick={() => navigate('/')}
            className="absolute left-0 top-0 flex items-center p-2 rounded-xl transition-all duration-200"
            style={{ color: '#D4A76A' }}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div className="pt-8 flex items-center justify-center">
            <h1 className="text-title text-white">Order History</h1>
          </div>

          <button className="absolute right-0 top-0 flex items-center transition-colors p-2" style={{ color: '#D4A76A' }}>
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        <div className="max-w-4xl mx-auto">

          {/* Orders List */}
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="text-gray-400">Loading orders...</div>
              </div>
            ) : orders.map(order => {
              // Get status info with fallback for unknown statuses
              const statusInfo = statusConfig[order.status as OrderStatus] || defaultStatus;
              const StatusIcon = statusInfo.icon;
              
              // Safety check: ensure order has required fields
              if (!order || !order.id) {
                return null;
              }
              
              // Ensure items array exists
              const orderItems = Array.isArray(order.items) ? order.items : [];

              return (
                <div key={order.id} id={`order-${order.id}`} className="rounded-2xl p-6 backdrop-blur-sm shadow-lg" style={{ backgroundColor: '#1E1E1E', border: '1px solid #D4A76A40' }}>
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-4 pb-4" style={{ borderBottom: '1px solid #D4A76A20' }}>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">Order #{order.id.slice(-8)}</h3>
                      <p className="text-gray-400 text-sm">{formatDate(order.date)}</p>
                    </div>
                    <div className={`flex items-center ${statusInfo.color} px-3 py-1.5 rounded-full`} style={{ backgroundColor: 'rgba(212, 167, 106, 0.1)' }}>
                      <StatusIcon className="w-4 h-4 mr-1.5" />
                      <span className="font-medium text-xs">{statusInfo.label}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-4">
                    <p className="text-gray-400 text-sm mb-3 font-medium">
                      {getTotalItems(orderItems)} {getTotalItems(orderItems) === 1 ? 'item' : 'items'} • {order.customer || 'N/A'}
                    </p>
                    <div className="space-y-2.5">
                      {orderItems.length > 0 ? (
                        <>
                          {orderItems.slice(0, 2).map((item: any, idx: number) => (
                            <div key={item.id || `item-${idx}`} className="flex items-center justify-between">
                              <span className="text-sm text-gray-300">
                                <span className="text-primary font-medium">{item.quantity || 1}x</span> {item.title || 'Unknown Item'}
                              </span>
                              <span className="text-sm" style={{ color: '#D4A76A' }}>
                                R {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                              </span>
                            </div>
                          ))}
                          {orderItems.length > 2 && (
                            <div className="text-sm text-gray-400 italic">
                              +{orderItems.length - 2} more {orderItems.length - 2 === 1 ? 'item' : 'items'}
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-gray-400">No items found</p>
                      )}
                    </div>
                  </div>

                  {/* Delivery Person (if assigned) */}
                  {order.deliveryPerson && (
                    <div className="mb-4 pt-4" style={{ borderTop: '1px solid #D4A76A20' }}>
                      <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: '#0A0A0A' }}>
                        <div className="flex items-center flex-1">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#D4A76A20' }}>
                            {order.deliveryPerson.avatar ? (
                              <img 
                                src={order.deliveryPerson.avatar} 
                                alt={order.deliveryPerson.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <User className="w-5 h-5" style={{ color: '#D4A76A' }} />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">{order.deliveryPerson.name}</p>
                            <p className="text-gray-400 text-xs">
                              {order.deliveryPerson.vehicleId && `Driver - ${order.deliveryPerson.vehicleId}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${order.deliveryPerson.phone}`}
                            className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                            style={{ backgroundColor: '#D4A76A', color: '#000' }}
                            title="Call driver"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                          <a
                            href={`sms:${order.deliveryPerson.phone}`}
                            className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                            style={{ backgroundColor: '#D4A76A', color: '#000' }}
                            title="Text driver"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Order Footer */}
                  <div className="flex items-start justify-between pt-4 mt-4" style={{ borderTop: '1px solid #D4A76A20' }}>
                    <div className="flex items-start text-gray-400 flex-1 mr-4">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: '#D4A76A' }} />
                      <span className="text-xs leading-relaxed">{order.address || 'No address provided'}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs mb-1">Total</p>
                      <p className="font-bold text-lg" style={{ color: '#D4A76A' }}>R {(order.total || 0).toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Expandable Details */}
                  {selectedOrder === order.id && (
                    <div className="mt-6 pt-6 border-t border-dark-lighter">
                      <h4 className="font-bold text-white mb-4">Order Details</h4>

                      {/* All Items */}
                      <div className="space-y-3 mb-6">
                        {orderItems.length > 0 ? (
                          orderItems.map((item: any, idx: number) => (
                            <div key={item.id || `item-${idx}`} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: '#0A0A0A' }}>
                              <div>
                                <h5 className="font-medium text-white mb-1">{item.title || 'Unknown Item'}</h5>
                                <p className="text-gray-400 text-xs">Qty: {item.quantity || 1} × R {(item.price || 0).toFixed(2)}</p>
                              </div>
                              <span className="font-bold" style={{ color: '#D4A76A' }}>
                                R {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400 text-center py-4">No items found</p>
                        )}
                      </div>

                      {/* Delivery Info */}
                      <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: '#0A0A0A' }}>
                        <h5 className="font-medium text-white mb-3">Delivery Information</h5>
                        <div className="space-y-2 text-sm text-gray-300">
                          <p><strong className="text-gray-400">Customer:</strong> <span className="text-white">{order.customer || 'N/A'}</span></p>
                          <p><strong className="text-gray-400">Address:</strong> <span className="text-white">{order.address || 'No address provided'}</span></p>
                          <p><strong className="text-gray-400">Order Date:</strong> <span className="text-white">{formatDate(order.date)}</span></p>
                          <p><strong className="text-gray-400">Status:</strong> <span style={{ color: '#D4A76A' }}>{statusInfo.label}</span></p>
                        </div>
                      </div>

                      {/* Delivery Person Details */}
                      {order.deliveryPerson && (
                        <div className="p-4 rounded-xl" style={{ backgroundColor: '#0A0A0A' }}>
                          <h5 className="font-medium text-white mb-3">Delivery Person</h5>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center flex-1">
                              <div className="w-12 h-12 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#D4A76A20' }}>
                                {order.deliveryPerson.avatar ? (
                                  <img 
                                    src={order.deliveryPerson.avatar} 
                                    alt={order.deliveryPerson.name}
                                    className="w-full h-full rounded-full object-cover"
                                  />
                                ) : (
                                  <User className="w-6 h-6" style={{ color: '#D4A76A' }} />
                                )}
                              </div>
                              <div>
                                <p className="text-white font-medium">{order.deliveryPerson.name}</p>
                                <p className="text-gray-400 text-xs">
                                  {order.deliveryPerson.vehicleId && `Vehicle: ${order.deliveryPerson.vehicleId}`}
                                </p>
                                <p className="text-gray-400 text-xs">{order.deliveryPerson.phone}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <a
                                href={`tel:${order.deliveryPerson.phone}`}
                                className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
                                style={{ backgroundColor: '#D4A76A', color: '#000' }}
                                title="Call driver"
                              >
                                <Phone className="w-5 h-5" />
                              </a>
                              <a
                                href={`sms:${order.deliveryPerson.phone}`}
                                className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
                                style={{ backgroundColor: '#D4A76A', color: '#000' }}
                                title="Text driver"
                              >
                                <MessageCircle className="w-5 h-5" />
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Toggle Details Button */}
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                      className="transition-colors text-sm font-medium"
                      style={{ color: '#D4A76A' }}
                    >
                      {selectedOrder === order.id ? '▼ Hide Details' : '▶ View Details'}
                    </button>
                    {order.status !== 'cancelled' && order.status !== 'delivered' && (
                      <button
                        onClick={() => navigate('/order-tracking', { state: { order } })}
                        className="text-green-500 hover:text-green-400 transition-colors text-sm flex items-center font-medium"
                      >
                        <Truck className="w-4 h-4 mr-1" />
                        Track Order
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {orders.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-20 h-20 mx-auto mb-6" style={{ color: '#D4A76A40' }} />
              <h2 className="text-2xl font-bold mb-4 text-white">No orders yet</h2>
              <p className="text-gray-400 mb-8">
                You haven't placed any orders yet. Start by adding items to your cart!
              </p>
              <button
                onClick={() => navigate('/menu')}
                className="px-8 py-3 rounded-2xl font-bold transition-colors"
                style={{ backgroundColor: '#D4A76A', color: '#000000' }}
              >
                Browse Menu
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
