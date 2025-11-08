import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, MoreVertical, Phone, MessageCircle, User } from 'lucide-react';
import OrderTrackingTimeline from '../components/OrderTrackingTimeline';
import BottomNav from '../components/BottomNav';
import { orderService } from '../firebase/services';
import { useAuth } from '../contexts/AuthContext';

const OrderTrackingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const initialOrder = location.state?.order;
  const [order, setOrder] = useState<any>(initialOrder);
  const [loading, setLoading] = useState(!initialOrder);
  const previousStatusRef = useRef<string | null>(initialOrder?.status || null);
  
  // Check if user is admin (owner, manager, supervisor, or waiter)
  const isAdmin = user && ['owner', 'manager', 'supervisor', 'waiter'].includes(user.role);

  useEffect(() => {
    // If we have an order ID, subscribe to real-time updates
    if (initialOrder?.id) {
      setLoading(true);
      const unsubscribe = orderService.subscribeToOrder(initialOrder.id, (updatedOrder) => {
        if (updatedOrder) {
          // Check if status changed to delivered or completed
          const previousStatus = previousStatusRef.current;
          const newStatus = updatedOrder.status;
          
          // Update the ref with the new status
          previousStatusRef.current = newStatus;
          
          // If status changed to delivered or completed, navigate away
          if ((newStatus === 'delivered' || newStatus === 'completed') && 
              previousStatus !== 'delivered' && previousStatus !== 'completed') {
            // If admin is viewing, navigate back to admin orders page
            // Otherwise, navigate to order history
            if (isAdmin) {
              navigate('/admin/orders', { 
                state: { 
                  orderId: updatedOrder.id
                } 
              });
            } else {
              // Navigate to order history with order ID to auto-expand details
              navigate('/home/order-history', { 
                state: { 
                  autoExpandOrderId: updatedOrder.id,
                  order: updatedOrder 
                } 
              });
            }
            return; // Exit early to prevent setting state
          }
          
          setOrder(updatedOrder);
        } else {
          // Order not found, redirect based on user role
          if (isAdmin) {
            navigate('/admin/orders');
          } else {
            navigate('/home/order-history');
          }
        }
        setLoading(false);
      });

      return () => {
        unsubscribe();
      };
    } else if (!initialOrder) {
      // No order provided, redirect based on user role
      if (isAdmin) {
        navigate('/admin/orders');
      } else {
        navigate('/home/order-history');
      }
    }
  }, [initialOrder?.id, navigate, isAdmin]);

  if (!order || loading) {
    return (
      <div className="min-h-screen bg-black pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Header */}
      <div className="px-4 py-6 bg-gray-900/20">
        <div className="relative">
          <button
            onClick={() => isAdmin ? navigate('/admin/orders') : navigate('/home/order-history')}
            className="absolute left-0 top-0 flex items-center p-2 rounded-xl transition-all duration-200"
            style={{ color: '#D4A76A' }}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div className="pt-8 flex items-center justify-center">
            <h1 className="text-title text-white">Track Your Order</h1>
          </div>

          <button className="absolute right-0 top-0 flex items-center transition-colors p-2" style={{ color: '#D4A76A' }}>
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Map Section */}
        <div className="rounded-2xl overflow-hidden mb-6 shadow-lg" style={{ border: '1px solid #D4A76A40' }}>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3582.714352417745!2d28.058333400000002!3d-26.1082416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e95732cb5a3d97b%3A0xde6336359d73b224!2s1st%20Floor%2C%20Nutun%2C%20115%20West%20St%2C%20Sandown%2C%20Sandton%2C%202031!5e0!3m2!1sen!2sza!4v1761775093158!5m2!1sen!2sza" 
            width="100%" 
            height="300" 
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Order Location Map"
          />
        </div>

        {/* Order Info Card */}
        <div className="rounded-2xl p-5 mb-6 backdrop-blur-sm shadow-lg" style={{ backgroundColor: '#1E1E1E', border: '1px solid #D4A76A40' }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Order #{order.id.slice(-8)}</h3>
              <p className="text-gray-400 text-sm">{order.customer}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-xs mb-1">Total</p>
              <p className="font-bold text-lg" style={{ color: '#D4A76A' }}>R {order.total.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="pt-3 mt-3" style={{ borderTop: '1px solid #D4A76A20' }}>
            <p className="text-gray-400 text-xs mb-1">Delivery Address</p>
            <p className="text-white text-sm">{order.address}</p>
          </div>
        </div>

        {/* Delivery Person Card */}
        {order.deliveryPerson && (
          <div className="rounded-2xl p-5 mb-6 backdrop-blur-sm shadow-lg" style={{ backgroundColor: '#1E1E1E', border: '1px solid #D4A76A40' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mr-4" style={{ backgroundColor: '#D4A76A20' }}>
                  {order.deliveryPerson.avatar ? (
                    <img 
                      src={order.deliveryPerson.avatar} 
                      alt={order.deliveryPerson.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-7 h-7" style={{ color: '#D4A76A' }} />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{order.deliveryPerson.name}</h3>
                  <p className="text-gray-400 text-sm">
                    {order.deliveryPerson.vehicleId && `Driver - ${order.deliveryPerson.vehicleId}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
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

        {/* Order Status Section */}
        <div className="rounded-2xl p-5 backdrop-blur-sm shadow-lg" style={{ backgroundColor: '#1E1E1E', border: '1px solid #D4A76A40' }}>
          <h3 className="text-lg font-bold text-white mb-4">Order Status</h3>
          
          <OrderTrackingTimeline
            orderStatus={order.status}
            orderDate={order.date}
            estimatedDelivery={order.status === 'ready' ? '2:30 PM' : undefined}
            showMap={false}
            orderItems={order.items || []}
          />
        </div>

        {/* Estimated Time */}
        {order.status !== 'delivered' && order.status !== 'cancelled' && (
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm mb-2">Estimated Delivery Time</p>
            <p className="text-2xl font-bold" style={{ color: '#D4A76A' }}>20-25 minutes</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default OrderTrackingPage;
