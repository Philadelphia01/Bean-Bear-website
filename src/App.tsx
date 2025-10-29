import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import OrderPage from './pages/OrderPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import CustomerLoginPage from './pages/CustomerLoginPage';
import RegisterPage from './pages/RegisterPage';
import FoodItemDetail from './pages/FoodItemDetail';
import AddCardPage from './pages/AddCardPage';
import PaymentMethodsPage from './pages/PaymentMethodsPage';
import AddressesPage from './pages/AddressesPage';
import NewAddressPage from './pages/NewAddressPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminMenu from './pages/admin/AdminMenu';
import AdminUsers from './pages/admin/AdminUsers';
import ProtectedRoute from './components/auth/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="item/:id" element={<FoodItemDetail />} />
        <Route path="order" element={<OrderPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="order-history" element={<OrderHistoryPage />} />
        <Route path="profile" element={<ProfilePage />} />
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
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="menu" element={<AdminMenu />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;