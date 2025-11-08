# Firebase Cloud Messaging (FCM) Setup Guide

## ✅ Completed Steps

1. ✅ Firebase Cloud Messaging API (V1) enabled
2. ✅ Sender ID: `904070401127`
3. ✅ Dependencies installed: `@capacitor/push-notifications`
4. ✅ Capacitor configuration updated

## 📱 Next Steps for Android

### 1. Download google-services.json

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `bear-n-bean-coffeeshop`
3. Click the gear icon ⚙️ > Project Settings
4. Scroll down to "Your apps" section
5. Click on your Android app (or create one if it doesn't exist)
6. Download `google-services.json`
7. Place it in: `Mobile App/android/app/google-services.json`

**Important**: The file must be at `android/app/google-services.json` for Android builds.

### 2. Update Android Build Files

The `google-services.json` file will be automatically used by Capacitor. However, you may need to ensure your `android/app/build.gradle` includes:

```gradle
apply plugin: 'com.google.gms.google-services'
```

And in `android/build.gradle`:

```gradle
dependencies {
    classpath 'com.google.gms:google-services:4.4.0'
}
```

### 3. Sync Capacitor

After adding `google-services.json`, run:

```bash
cd "Mobile App"
npx cap sync android
```

### 4. Test Push Notifications

1. Build and run the app on a physical Android device (push notifications don't work on emulators)
2. The app will request notification permissions on first launch
3. Check that the FCM token is registered in Firebase Console

## 🔔 How It Works

1. **App Initialization**: When a user logs in, `notificationService.initialize()` is called
2. **Token Registration**: The app registers with FCM and gets a unique token
3. **Token Storage**: The token is saved to Firestore under the user's document
4. **Notifications**: When order status changes, Firebase Cloud Functions (or your backend) sends notifications using the stored tokens

## 📝 Testing

To test push notifications:

1. **Manual Test**: Use Firebase Console > Cloud Messaging > Send test message
2. **Programmatic**: Use Firebase Admin SDK or Cloud Functions to send notifications
3. **Order Status**: Update an order status in the admin panel (this should trigger a notification)

## 🔧 Troubleshooting

### Token Not Registering
- Check that `google-services.json` is in the correct location
- Verify Android app is properly configured in Firebase Console
- Check device logs for FCM errors

### Notifications Not Received
- Ensure app has notification permissions
- Check that device is connected to internet
- Verify FCM token is stored in Firestore
- Test with Firebase Console's test message feature

### Build Errors
- Make sure `google-services.json` is present before building
- Run `npx cap sync android` after adding the file
- Clean and rebuild: `cd android && ./gradlew clean`

## 📚 Additional Resources

- [Capacitor Push Notifications Docs](https://capacitorjs.com/docs/apis/push-notifications)
- [Firebase Cloud Messaging Docs](https://firebase.google.com/docs/cloud-messaging)
- [FCM Setup Guide](https://firebase.google.com/docs/cloud-messaging/android/client)

---

**Note**: Push notifications require a physical device for testing. Android emulators cannot receive FCM notifications.

