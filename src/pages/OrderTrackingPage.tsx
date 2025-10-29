import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, MoreVertical } from 'lucide-react';
import OrderTrackingTimeline from '../components/OrderTrackingTimeline';
import BottomNav from '../components/BottomNav';

const OrderTrackingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    navigate('/order-history');
    return null;
  }

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Header */}
      <div className="px-4 py-6 bg-gray-900/20">
        <div className="relative">
          <button
            onClick={() => navigate('/order-history')}
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

        {/* Order Status Section */}
        <div className="rounded-2xl p-5 backdrop-blur-sm shadow-lg" style={{ backgroundColor: '#1E1E1E', border: '1px solid #D4A76A40' }}>
          <h3 className="text-lg font-bold text-white mb-4">Order Status</h3>
          
          <OrderTrackingTimeline
            orderStatus={order.status}
            orderDate={order.date}
            estimatedDelivery={order.status === 'ready' ? '2:30 PM' : undefined}
            showMap={false}
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
