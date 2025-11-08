// Push Notification Service
// Note: Requires @capacitor/push-notifications package
// Install: npm install @capacitor/push-notifications

import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { db } from '../firebase/config';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

export interface NotificationToken {
  token: string;
  userId: string;
  platform: 'android' | 'ios' | 'web';
  createdAt: Date;
}

class NotificationService {
  private isInitialized = false;

  // Initialize push notifications (only on native platforms)
  async initialize(userId: string): Promise<void> {
    // Check if we're on a native platform (Android/iOS)
    // Push notifications don't work on web
    const platform = Capacitor.getPlatform();
    
    if (platform === 'web') {
      console.log('Push notifications are not available on web platform');
      return;
    }

    if (this.isInitialized) return;

    try {
      // Request permission
      const permission = await PushNotifications.requestPermissions();
      
      if (permission.receive === 'granted') {
        // Register for push notifications
        await PushNotifications.register();

        // Listen for registration
        PushNotifications.addListener('registration', async (token) => {
          console.log('Push registration success, token: ' + token.value);
          await this.saveToken(userId, token.value);
        });

        // Listen for registration errors
        PushNotifications.addListener('registrationError', (error) => {
          console.error('Error on registration: ' + JSON.stringify(error));
        });

        // Listen for push notifications
        PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('Push notification received: ', notification);
          // Handle notification when app is in foreground
          this.handleNotification(notification);
        });

        // Listen for notification actions
        PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
          console.log('Push notification action performed', action);
          // Handle notification tap
          this.handleNotificationAction(action);
        });

        this.isInitialized = true;
      } else {
        console.warn('Push notification permission denied');
      }
    } catch (error) {
      console.error('Error initializing push notifications:', error);
      // Don't throw - gracefully handle errors
    }
  }

  // Save FCM token to Firestore
  private async saveToken(userId: string, token: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      const tokens = userDoc.exists() ? (userDoc.data().notificationTokens || []) : [];
      
      // Check if token already exists
      if (!tokens.includes(token)) {
        tokens.push(token);
        await updateDoc(userRef, {
          notificationTokens: tokens,
          lastTokenUpdate: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error saving notification token:', error);
    }
  }

  // Handle notification received
  private handleNotification(notification: any): void {
    // You can show a toast or update UI here
    // For now, we'll just log it
    console.log('Notification received:', notification);
  }

  // Handle notification action (tap)
  private handleNotificationAction(action: any): void {
    // Navigate to relevant page based on notification data
    const data = action.notification.data;
    if (data?.orderId) {
      // Navigate to order details
      window.location.href = `/home/order-tracking?orderId=${data.orderId}`;
    }
  }

  // Send notification (called from backend/Cloud Functions)
  // This is a placeholder - actual sending should be done via Firebase Cloud Functions
  static async sendOrderUpdateNotification(
    userId: string,
    orderId: string,
    status: string,
    message: string
  ): Promise<void> {
    // This would typically be handled by Firebase Cloud Functions
    // The function would:
    // 1. Get user's notification tokens from Firestore
    // 2. Send FCM message to each token
    // 3. Include orderId and status in notification data
    
    console.log(`Would send notification to user ${userId}: ${message}`);
    
    // For now, we'll use a simple approach with Firestore triggers
    // In production, use Firebase Cloud Functions
  }
}

export const notificationService = new NotificationService();

