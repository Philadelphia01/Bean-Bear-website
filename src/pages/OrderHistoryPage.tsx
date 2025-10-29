import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Package, Clock, CheckCircle, XCircle, Truck, MapPin, MoreVertical } from 'lucide-react';

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

const statusConfig = {
  pending: { color: 'text-yellow-500', icon: Clock, label: 'Order Received' },
  preparing: { color: 'text-blue-500', icon: Package, label: 'Preparing' },
  ready: { color: 'text-green-500', icon: CheckCircle, label: 'Ready for Pickup' },
  delivered: { color: 'text-green-600', icon: Truck, label: 'Delivered' },
  cancelled: { color: 'text-red-500', icon: XCircle, label: 'Cancelled' }
};

const OrderHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = localStorage.getItem('userOrders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
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
            {orders.map(order => {
              const statusInfo = statusConfig[order.status as OrderStatus];
              const StatusIcon = statusInfo.icon;

              return (
                <div key={order.id} className="rounded-2xl p-6 backdrop-blur-sm shadow-lg" style={{ backgroundColor: '#1E1E1E', border: '1px solid #D4A76A40' }}>
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
                      {getTotalItems(order.items)} {getTotalItems(order.items) === 1 ? 'item' : 'items'} • {order.customer}
                    </p>
                    <div className="space-y-2.5">
                      {order.items.slice(0, 2).map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">
                            <span className="text-primary font-medium">{item.quantity}x</span> {item.title}
                          </span>
                          <span className="text-sm" style={{ color: '#D4A76A' }}>R {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="text-sm text-gray-400 italic">
                          +{order.items.length - 2} more {order.items.length - 2 === 1 ? 'item' : 'items'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="flex items-start justify-between pt-4 mt-4" style={{ borderTop: '1px solid #D4A76A20' }}>
                    <div className="flex items-start text-gray-400 flex-1 mr-4">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: '#D4A76A' }} />
                      <span className="text-xs leading-relaxed">{order.address}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs mb-1">Total</p>
                      <p className="font-bold text-lg" style={{ color: '#D4A76A' }}>R {order.total.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Expandable Details */}
                  {selectedOrder === order.id && (
                    <div className="mt-6 pt-6 border-t border-dark-lighter">
                      <h4 className="font-bold text-white mb-4">Order Details</h4>

                      {/* All Items */}
                      <div className="space-y-3 mb-6">
                        {order.items.map((item: any) => (
                          <div key={item.id} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: '#0A0A0A' }}>
                            <div>
                              <h5 className="font-medium text-white mb-1">{item.title}</h5>
                              <p className="text-gray-400 text-xs">Qty: {item.quantity} × R {item.price.toFixed(2)}</p>
                            </div>
                            <span className="font-bold" style={{ color: '#D4A76A' }}>R {(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Delivery Info */}
                      <div className="p-4 rounded-xl" style={{ backgroundColor: '#0A0A0A' }}>
                        <h5 className="font-medium text-white mb-3">Delivery Information</h5>
                        <div className="space-y-2 text-sm text-gray-300">
                          <p><strong className="text-gray-400">Customer:</strong> <span className="text-white">{order.customer}</span></p>
                          <p><strong className="text-gray-400">Address:</strong> <span className="text-white">{order.address}</span></p>
                          <p><strong className="text-gray-400">Order Date:</strong> <span className="text-white">{formatDate(order.date)}</span></p>
                          <p><strong className="text-gray-400">Status:</strong> <span style={{ color: '#D4A76A' }}>{statusInfo.label}</span></p>
                        </div>
                      </div>
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
