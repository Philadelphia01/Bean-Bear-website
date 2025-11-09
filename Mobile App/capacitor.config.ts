import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.coffee.coffeeemporium',
  appName: 'coffee-emporium',
  webDir: 'dist',
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
  android: {
    // Firebase Cloud Messaging configuration
    // Note: Place your google-services.json file in android/app/google-services.json
    // The file will be automatically used by Capacitor during the build process
  },
  // Firebase configuration
  // Note: The sender ID (904070401127) is already in your Firebase config
  // It will be automatically used by the Push Notifications plugin
};

export default config;
