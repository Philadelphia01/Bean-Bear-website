import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { notificationService } from '../services/notificationService';

/**
 * Component to initialize push notifications when user is logged in
 * This should be placed inside the AuthProvider context
 */
const NotificationInitializer: React.FC = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      // Initialize push notifications in background (non-blocking)
      // Use setTimeout to defer initialization and not block app startup
      const initTimer = setTimeout(() => {
        notificationService.initialize(user.id).catch((error) => {
          console.error('Failed to initialize notifications:', error);
        });
      }, 1000); // Delay by 1 second to let app render first

      return () => clearTimeout(initTimer);
    }
  }, [user?.id]);

  // This component doesn't render anything
  return null;
};

export default NotificationInitializer;

