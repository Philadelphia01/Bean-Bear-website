import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './components/layout/Layout';
import SplashScreenFlow from './components/SplashScreenFlow';
import ProtectedRoute from './components/auth/ProtectedRoute';
import NotificationInitializer from './components/NotificationInitializer';

// Lazy load pages for better initial load performance
const HomePage = lazy(() => import('./pages/HomePage'));
const MenuPage = lazy(() => import('./pages/MenuPage'));
const OrderPage = lazy(() => import('./pages/OrderPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderHistoryPage = lazy(() => import('./pages/OrderHistoryPage'));
const OrderTrackingPage = lazy(() => import('./pages/OrderTrackingPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const CustomerLoginPage = lazy(() => import('./pages/CustomerLoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const FoodItemDetail = lazy(() => import('./pages/FoodItemDetail'));
const AddCardPage = lazy(() => import('./pages/AddCardPage'));
const PaymentMethodsPage = lazy(() => import('./pages/PaymentMethodsPage'));
const AddressesPage = lazy(() => import('./pages/AddressesPage'));
const NewAddressPage = lazy(() => import('./pages/NewAddressPage'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminMenu = lazy(() => import('./pages/admin/AdminMenu'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const LoyaltyPage = lazy(() => import('./pages/LoyaltyPage'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-dark">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-gray-400">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <>
      <NotificationInitializer />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<SplashScreenFlow />} />
          <Route path="/home" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="item/:id" element={<FoodItemDetail />} />
            <Route path="order" element={<OrderPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="order-history" element={<OrderHistoryPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="loyalty" element={<LoyaltyPage />} />
          </Route>

          {/* Payment and delivery routes - full screen without layout */}
          <Route path="payment-methods" element={<PaymentMethodsPage />} />
          <Route path="add-card" element={<AddCardPage />} />
          <Route path="addresses" element={<AddressesPage />} />
          <Route path="new-address" element={<NewAddressPage />} />
          <Route path="order-tracking" element={<OrderTrackingPage />} />

          <Route path="/login" element={<CustomerLoginPage />} />
          <Route path="/admin-login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/admin" element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <AdminLayout />
              </Suspense>
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="menu" element={<AdminMenu />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;