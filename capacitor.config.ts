import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'coffee-emporium',
  webDir: 'dist',
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
  android: {
    // Firebase Cloud Messaging Sender ID
    // This is your FCM Sender ID from Firebase Console
    googleServicesFile: './google-services.json',
  },
  // Firebase configuration
  // Note: The sender ID (904070401127) is already in your Firebase config
  // It will be automatically used by the Push Notifications plugin
};

export default config;
