import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, Truck, MapPin, Eye, EyeOff } from 'lucide-react';
import OrderTrackingTimeline from '../components/OrderTrackingTimeline';
import DeliveryMap from '../components/DeliveryMap';

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
  const [showTracking, setShowTracking] = useState<string | null>(null);
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
    <div className="pt-20 pb-16 min-h-screen bg-dark">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-primary hover:text-primary-dark transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </button>
            <h1 className="text-3xl font-bold text-white">Order History</h1>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {orders.map(order => {
              const statusInfo = statusConfig[order.status as OrderStatus];
              const StatusIcon = statusInfo.icon;

              return (
                <div key={order.id} className="bg-dark-light rounded-lg p-6">
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">Order #{order.id}</h3>
                      <p className="text-gray-400 text-sm">{formatDate(order.date)}</p>
                    </div>
                    <div className={`flex items-center ${statusInfo.color}`}>
                      <StatusIcon className="w-5 h-5 mr-2" />
                      <span className="font-medium">{statusInfo.label}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-4">
                    <p className="text-gray-400 text-sm mb-2">
                      {getTotalItems(order.items)} items • {order.customer}
                    </p>
                    <div className="space-y-2">
                      {order.items.slice(0, 2).map((item: any) => (
                        <div key={item.id} className="text-sm text-gray-300">
                          {item.quantity}x {item.title}
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="text-sm text-gray-400">
                          +{order.items.length - 2} more items
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-dark-lighter">
                    <div className="flex items-center text-gray-400">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{order.address}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">Total</p>
                      <p className="text-primary font-bold">R {order.total.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Order Tracking Timeline */}
                  {showTracking === order.id && (
                    <div className="mt-6 pt-6 border-t border-dark-lighter">
                      <OrderTrackingTimeline
                        orderStatus={order.status}
                        orderDate={order.date}
                        estimatedDelivery={order.status === 'ready' ? '2:30 PM' : undefined}
                        showMap={true}
                      />
                    </div>
                  )}

                  {/* Expandable Details */}
                  {selectedOrder === order.id && (
                    <div className="mt-6 pt-6 border-t border-dark-lighter">
                      <h4 className="font-bold text-white mb-4">Order Details</h4>

                      {/* All Items */}
                      <div className="space-y-3 mb-6">
                        {order.items.map((item: any) => (
                          <div key={item.id} className="flex items-center justify-between bg-dark p-3 rounded-md">
                            <div>
                              <h5 className="font-medium text-white">{item.title}</h5>
                              <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                            </div>
                            <span className="text-primary font-bold">R {(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Delivery Info */}
                      <div className="bg-dark p-4 rounded-md">
                        <h5 className="font-medium text-white mb-2">Delivery Information</h5>
                        <div className="space-y-1 text-sm text-gray-300">
                          <p><strong>Customer:</strong> {order.customer}</p>
                          <p><strong>Address:</strong> {order.address}</p>
                          <p><strong>Order Date:</strong> {formatDate(order.date)}</p>
                          <p><strong>Status:</strong> {statusInfo.label}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Toggle Details Button */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                      className="text-primary hover:text-primary-dark transition-colors text-sm"
                    >
                      {selectedOrder === order.id ? 'Hide Details' : 'View Details'}
                    </button>
                    {order.status !== 'cancelled' && order.status !== 'delivered' && (
                      <button
                        onClick={() => setShowTracking(showTracking === order.id ? null : order.id)}
                        className="text-green-500 hover:text-green-400 transition-colors text-sm flex items-center"
                      >
                        <Truck className="w-4 h-4 mr-1" />
                        {showTracking === order.id ? 'Hide Tracking' : 'Track Order'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {orders.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-20 h-20 text-gray-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-4 text-white">No orders yet</h2>
              <p className="text-gray-400 mb-8">
                You haven't placed any orders yet. Start by adding items to your cart!
              </p>
              <button
                onClick={() => navigate('/menu')}
                className="bg-primary text-dark px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
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
