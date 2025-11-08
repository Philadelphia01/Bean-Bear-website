# Bear & Bean Coffee Shop - Full Stack Application

A comprehensive coffee shop management system with a mobile app and web-based admin dashboard. Built with React, TypeScript, Firebase, and Capacitor.

## 📱 Project Overview

This project consists of two main applications:

1. **Mobile App** - Customer-facing mobile application for ordering coffee and food items
2. **Main Website** - Web-based admin dashboard for managing orders, menu, and users

Both applications share the same Firebase backend for real-time data synchronization.

---

## 👥 Team Members

This project was developed by the following team members:

- **Cynthia Panzu** – (ST10174327)
- **Philadelphia Lotricia Nkuna** – (ST10304249)
- **Mendes Sithole** – (ST10332172)
- **Phathisa Ndaliso** – (ST10241408)

---

## 🏗️ Architecture

### Tech Stack

- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.2
- **Styling**: Tailwind CSS 3.4.1
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Mobile**: Capacitor 7.4.4 (Android)
- **Routing**: React Router DOM 6.22.1
- **UI Components**: Lucide React, Heroicons
- **Notifications**: React Hot Toast 2.4.1
- **Animations**: Framer Motion 12.23.24

---

## 📦 Dependencies

### Mobile App Dependencies

```json
{
  "@capacitor/android": "^7.4.4",
  "@capacitor/push-notifications": "^7.0.1",
  "@heroicons/react": "^2.1.1",
  "@stripe/stripe-js": "^4.8.0",
  "firebase": "^12.5.0",
  "framer-motion": "^12.23.24",
  "lucide-react": "^0.344.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-hot-toast": "^2.4.1",
  "react-router-dom": "^6.22.1",
  "recharts": "^2.12.7"
}
```

### Main Website Dependencies

```json
{
  "@heroicons/react": "^2.1.1",
  "firebase": "^12.5.0",
  "lucide-react": "^0.344.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-hot-toast": "^2.4.1",
  "react-router-dom": "^6.22.1",
  "recharts": "^2.12.7"
}
```

### Development Dependencies (Both Apps)

```json
{
  "@eslint/js": "^9.9.1",
  "@types/react": "^18.3.5",
  "@types/react-dom": "^18.3.0",
  "@vitejs/plugin-react": "^4.3.1",
  "autoprefixer": "^10.4.18",
  "eslint": "^9.9.1",
  "eslint-plugin-react-hooks": "^5.1.0-rc.0",
  "eslint-plugin-react-refresh": "^0.4.11",
  "globals": "^15.9.0",
  "postcss": "^8.4.35",
  "tailwindcss": "^3.4.1",
  "typescript": "^5.5.3",
  "typescript-eslint": "^8.3.0",
  "vite": "^5.4.2"
}
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account and project
- Android Studio (for mobile app development)
- Java JDK (for Android builds)

### Installation

1. **Clone the repository**
   ```bash
   git clone <https://github.com/Philadelphia01/Bean-Bear-website.git>
   cd "Bear n Bean"
   ```

2. **Install dependencies for Mobile App**
   ```bash
   cd "Mobile App"
   npm install
   ```

3. **Install dependencies for Main Website**
   ```bash
   cd "../Main Website"
   npm install
   ```

### Firebase Configuration

Both applications use the same Firebase project. The configuration is already set up in:
- `Mobile App/src/firebase/config.ts`
- `Main Website/src/firebase/config.ts`

**Firebase Services Used:**
- Authentication (Email/Password)
- Firestore Database
- Storage (for images)

**Firebase Project Details:**
- Project ID: `bear-n-bean-coffeeshop`
- Auth Domain: `bear-n-bean-coffeeshop.firebaseapp.com`

---

## 🏃 Running the Applications

### Mobile App

1. **Development Mode**
   ```bash
   cd "Mobile App"
   npm run dev
   ```
   The app will be available at `http://localhost:5173` (or the port Vite assigns)

2. **Build for Production**
   ```bash
   npm run build
   ```

3. **Build for Android**
   ```bash
   npm run build
   npx cap sync android
   npx cap open android
   ```
   This will open Android Studio where you can run the app on an emulator or device.

### Main Website

1. **Development Mode**
   ```bash
   cd "Main Website"
   npm run dev
   ```
   The website will be available at `http://localhost:5173` (or the port Vite assigns)

2. **Build for Production**
   ```bash
   npm run build
   ```

3. **Preview Production Build**
   ```bash
   npm run preview
   ```

---

## 📱 Mobile App Features

### Customer Features

1. **Authentication**
   - User registration and login
   - Customer account management
   - Secure authentication with Firebase

2. **Menu Browsing**
   - Browse menu items by category
   - View item details with images
   - Search functionality
   - Filter by categories (Breakfast, Pastries, Hot Beverages, Cold Drinks)

3. **Item Customization**
   - Size selection (Regular/Large)
   - Milk options
   - Sugar and ice preferences
   - Add-ons selection
   - Special instructions

4. **Shopping Cart**
   - Add items to cart with success notifications
   - Customize items before adding
   - Update quantities
   - Remove items
   - Real-time cart synchronization with Firebase
   - Cart persists across sessions

5. **Ordering**
   - Delivery or Pickup options
   - Address management (save multiple addresses)
   - Pickup time selection (9 AM - 6 PM, today only)
   - Payment method selection
   - Order placement with order confirmation

6. **Order Tracking**
   - View order history
   - Track order status in real-time
   - Order timeline visualization
   - Contact delivery person (for delivery orders)

7. **Profile Management**
   - View and edit profile
   - Manage saved addresses
   - Manage payment methods
   - Add new cards
   - Add new addresses with geolocation

8. **Additional Features**
   - Splash screens
   - Bottom navigation
   - Responsive design
   - Toast notifications for user actions

### Pages Structure

- **HomePage** - Main landing page with featured items
- **MenuPage** - Browse all menu items
- **FoodItemDetail** - Item details with customization options
- **OrderPage** - Shopping cart and checkout
- **CheckoutPage** - Order placement (delivery/pickup)
- **OrderTrackingPage** - Track active orders
- **OrderHistoryPage** - View past orders
- **AddressesPage** - Manage delivery addresses
- **NewAddressPage** - Add new address
- **PaymentMethodsPage** - Manage payment methods
- **AddCardPage** - Add new payment card
- **CustomerLoginPage** - Customer authentication
- **RegisterPage** - Customer registration
- **ContactPage** - Contact form

---

## 💻 Main Website Features

### Admin Dashboard Features

1. **Authentication**
   - Admin login with role-based access
   - Multiple admin roles (Owner, Manager, Supervisor, Waiter)

2. **Dashboard Overview**
   - Order statistics
   - Revenue tracking
   - Recent orders
   - Quick actions

3. **Order Management**
   - View all orders
   - Filter orders by status (Pending, Preparing, Ready, Out for Delivery, Delivered, Cancelled)
   - Update order status
   - Update pickup times
   - Assign delivery persons
   - View order details
   - Order search functionality

4. **Menu Management**
   - Add new menu items
   - Edit existing items
   - Delete items
   - Upload item images
   - Set prices and categories
   - Add descriptions and allergens

5. **User Management**
   - View all users
   - Add new admin users
   - Edit user roles
   - Delete users
   - Manage user permissions

6. **Customer Orders (Web)**
   - Browse menu items
   - Add items to cart
   - Place orders
   - View order history

### Pages Structure

- **HomePage** - Landing page
- **LoginPage** - Admin login
- **MenuPage** - Browse menu (customer view)
- **OrderPage** - Place orders (customer view)
- **AboutPage** - About the coffee shop
- **ContactPage** - Contact information
- **DownloadAppPage** - Mobile app download information
- **AdminDashboard** - Main admin dashboard
- **AdminOrders** - Order management
- **AdminMenu** - Menu management
- **AdminUsers** - User management

---

## 🔧 Key Functionalities

### Cart System

- **Real-time Sync**: Cart data is synchronized with Firebase Firestore
- **Persistent Cart**: Cart persists across sessions for logged-in users
- **Customizations**: Support for item customizations (size, milk, add-ons, etc.)
- **Price Calculation**: Automatic price calculation including customizations
- **Success Notifications**: Toast notifications when items are added to cart

### Order System

- **Order Types**: Support for both delivery and pickup orders
- **Status Tracking**: Real-time order status updates
- **Pickup Time Selection**: Time slots from 9 AM to 6 PM (today only)
- **Delivery Management**: Assign delivery persons to orders
- **Order History**: Complete order history for customers

### Authentication System

- **Firebase Auth**: Secure authentication using Firebase
- **Role-Based Access**: Different roles for customers and admins
- **Protected Routes**: Route protection for authenticated users
- **Session Management**: Persistent login sessions

### Payment System

- **Multiple Payment Methods**: Card and cash options
- **Saved Payment Methods**: Save cards for future use
- **Payment Validation**: Card number and expiry validation

### Address Management

- **Multiple Addresses**: Save multiple delivery addresses
- **Geolocation**: Automatic address detection using browser geolocation
- **Address Validation**: Form validation for addresses

---

## 📁 Project Structure

```
Bear n Bean/
├── Mobile App/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── contexts/          # React contexts (Auth, Cart)
│   │   ├── firebase/          # Firebase configuration and services
│   │   ├── pages/             # Page components
│   │   ├── App.tsx            # Main app component
│   │   └── main.tsx           # Entry point
│   ├── android/               # Android native project
│   ├── public/                # Static assets
│   ├── package.json
│   └── vite.config.ts
│
├── Main Website/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── contexts/          # React contexts (Auth, Cart)
│   │   ├── firebase/          # Firebase configuration and services
│   │   ├── pages/             # Page components
│   │   ├── services/          # Additional services (Cloudinary)
│   │   ├── App.tsx            # Main app component
│   │   └── main.tsx           # Entry point
│   ├── public/                # Static assets
│   ├── package.json
│   └── vite.config.ts
│
├── setup_admin_users.js       # Script to set up admin users
├── migrate_menu.js            # Script to migrate menu data
├── migrate_orders.js          # Script to migrate order data
└── README.md                  # This file
```

---

## 🔐 Admin User Setup

To set up admin users, run the setup script:

```bash
node setup_admin_users.js
```

This will create the following admin users:
- **Owner**: owner@coffee.com / owner123
- **Manager**: manager@coffee.com / manager123
- **Supervisor**: supervisor@coffee.com / supervisor123
- **Waiter**: waiter@coffee.com / waiter123

---

## 🗄️ Firebase Collections

### Firestore Collections

1. **users** - User profiles and authentication data
2. **menu** - Menu items with details
3. **orders** - Customer orders
4. **carts** - User shopping carts
5. **addresses** - User saved addresses
6. **paymentMethods** - User saved payment methods

---

## 🎨 Styling

Both applications use **Tailwind CSS** for styling with a custom dark theme:
- Primary Color: `#D4A76A` (Gold)
- Background: `#1E1E1E` (Dark)
- Text: White and gray shades
- Borders: `#D4A76A40` (Gold with opacity)

---

## 📱 Mobile App Build & Deployment

### Android Build

1. **Build the web app**
   ```bash
   cd "Mobile App"
   npm run build
   ```

2. **Sync with Capacitor**
   ```bash
   npx cap sync android
   ```

3. **Open in Android Studio**
   ```bash
   npx cap open android
   ```

4. **Build APK/AAB**
   - In Android Studio, go to Build > Generate Signed Bundle/APK
   - Follow the wizard to create a release build

### iOS Build (if configured)

```bash
npx cap sync ios
npx cap open ios
```

---

## 🌐 Website Deployment

### Build for Production

```bash
cd "Main Website"
npm run build
```

The built files will be in the `dist/` directory. Deploy these files to:
- Netlify
- Vercel
- Firebase Hosting
- Any static hosting service

### Firebase Hosting

```bash
firebase init hosting
firebase deploy --only hosting
```

---

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Connection Errors**
   - Verify Firebase configuration in `firebase/config.ts`
   - Check Firebase project settings
   - Ensure Firestore rules allow read/write access

2. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version (should be v16+)
   - Clear build cache: `npm run build -- --force`

3. **Android Build Issues**
   - Ensure Android Studio is properly installed
   - Check Java JDK version
   - Sync Capacitor: `npx cap sync android`

4. **Port Already in Use**
   - Change port in `vite.config.ts` or kill the process using the port

---

## 📝 Scripts

### Available Scripts (Both Apps)

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

---

## 🔄 Data Migration

### Menu Migration

To migrate menu data to Firestore:
```bash
node migrate_menu.js
```

### Orders Migration

To migrate order data:
```bash
node migrate_orders.js
```

---

## 📄 License

This project is proprietary software for Bear & Bean Coffee Shop.

---

## 👥 Support

For issues or questions, please contact the development team.

---

## ✨ Implemented Enhancements

### 1. Push Notifications for Order Updates
- Real-time push notifications when order status changes
- Firebase Cloud Messaging (FCM) integration
- Capacitor Push Notifications plugin
- Automatic token management
- **Service**: `Mobile App/src/services/notificationService.ts`
- **Setup**: See `ENHANCEMENTS_INTEGRATION.md`

### 2. In-App Payment Processing
- Stripe payment integration
- Secure card payment processing
- Payment intent creation and confirmation
- Support for saved payment methods
- **Service**: `Mobile App/src/services/paymentService.ts`
- **Dependencies**: `@stripe/stripe-js`

### 3. Loyalty Program Integration
- Points earning system (1 point per R1 spent)
- Points redemption (100 points = R1 discount)
- Tier system (Bronze, Silver, Gold, Platinum)
- Transaction history tracking
- **Service**: `Mobile App/src/services/loyaltyService.ts`
- **Page**: `Mobile App/src/pages/LoyaltyPage.tsx`

### 4. Advanced Analytics Dashboard
- Revenue and order analytics
- Popular items tracking
- Customer metrics
- Revenue by day charts
- Order status distribution
- **Service**: `Main Website/src/services/analyticsService.ts`
- **Page**: `Main Website/src/pages/admin/AdminAnalytics.tsx`
- **Dependencies**: `recharts` for charts

---

## 🎯 Future Enhancements

- Multi-language support
- iOS app support
- Real-time chat support
- Advanced reporting features

---

**Last Updated**: 2025

