import React from 'react';
import { CheckCircle, Clock, Package, Truck, MapPin } from 'lucide-react';

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

interface TrackingStage {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  completed: boolean;
  current: boolean;
  time?: string;
}

interface OrderTrackingTimelineProps {
  orderStatus: OrderStatus;
  orderDate: string;
  estimatedDelivery?: string;
  showMap?: boolean;
}

const OrderTrackingTimeline: React.FC<OrderTrackingTimelineProps> = ({
  orderStatus,
  orderDate,
  estimatedDelivery,
  showMap = false
}) => {
  const getStages = (status: OrderStatus): TrackingStage[] => {
    const baseStages = [
      {
        id: 'received',
        title: 'Order Received',
        description: 'Your order has been received and confirmed',
        icon: CheckCircle,
        completed: true,
        current: false,
        time: new Date(orderDate).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })
      },
      {
        id: 'preparing',
        title: 'Preparing',
        description: 'Your coffee is being prepared with care',
        icon: Package,
        completed: ['preparing', 'ready', 'delivered'].includes(status),
        current: status === 'preparing',
        time: status === 'preparing' || status === 'ready' || status === 'delivered'
          ? new Date(Date.now() + 5 * 60 * 1000).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })
          : undefined
      },
      {
        id: 'ready',
        title: 'Ready for Pickup',
        description: 'Your order is ready for delivery',
        icon: Truck,
        completed: ['ready', 'delivered'].includes(status),
        current: status === 'ready',
        time: status === 'ready' || status === 'delivered'
          ? new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })
          : undefined
      },
      {
        id: 'delivered',
        title: 'Delivered',
        description: 'Order has been delivered successfully',
        icon: MapPin,
        completed: status === 'delivered',
        current: status === 'delivered',
        time: status === 'delivered'
          ? new Date(Date.now() + 25 * 60 * 1000).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })
          : estimatedDelivery
      }
    ];

    return baseStages;
  };

  const stages = getStages(orderStatus);

  return (
    <div className="space-y-6">
      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-600"></div>

        <div className="space-y-8">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const isLast = index === stages.length - 1;

            return (
              <div key={stage.id} className="relative flex items-start">
                {/* Timeline Circle */}
                <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                  stage.completed
                    ? 'bg-green-500 border-green-500'
                    : stage.current
                    ? 'bg-primary border-primary animate-pulse'
                    : 'bg-gray-600 border-gray-600'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    stage.completed || stage.current ? 'text-white' : 'text-gray-400'
                  }`} />

                  {/* Pulse animation for current stage */}
                  {stage.current && (
                    <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20"></div>
                  )}
                </div>

                {/* Content */}
                <div className="ml-6 flex-1 pb-8">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-lg font-semibold ${
                      stage.completed || stage.current ? 'text-white' : 'text-gray-400'
                    }`}>
                      {stage.title}
                    </h3>
                    {stage.time && (
                      <span className={`text-sm ${
                        stage.completed || stage.current ? 'text-primary' : 'text-gray-500'
                      }`}>
                        {stage.time}
                      </span>
                    )}
                  </div>

                  <p className={`text-sm ${
                    stage.completed || stage.current ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {stage.description}
                  </p>

                  {/* Progress indicator for current stage */}
                  {stage.current && (
                    <div className="mt-3">
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                      </div>
                      <p className="text-xs text-primary mt-1">In progress...</p>
                    </div>
                  )}

                  {/* Estimated delivery for last stage */}
                  {stage.id === 'delivered' && !stage.completed && estimatedDelivery && (
                    <div className="mt-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-sm text-primary">
                        Estimated delivery: {estimatedDelivery}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Map Section */}
      {showMap && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-white mb-4">Delivery Tracking</h3>
          <div className="bg-dark-light rounded-lg p-6">
            <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                <h4 className="text-white font-semibold mb-2">Live Tracking</h4>
                <p className="text-gray-400 text-sm mb-4">
                  Your delivery driver is on the way!
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-300">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Driver location</span>
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span>Your location</span>
                </div>
              </div>
            </div>

            {/* Driver Info */}
            <div className="mt-4 p-4 bg-dark rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Truck className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">Driver: Alex M.</h4>
                  <p className="text-gray-400 text-sm">Vehicle: White Toyota Corolla (CA 123-456)</p>
                  <p className="text-primary text-sm">ETA: 15 minutes</p>
                </div>
                <button className="px-4 py-2 bg-primary text-dark rounded-lg hover:bg-primary-dark transition-colors">
                  Call Driver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingTimeline;
