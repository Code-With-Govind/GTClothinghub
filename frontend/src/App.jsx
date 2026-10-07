import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SettingsProvider } from './context/SettingsContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CartDrawer from './components/cart/CartDrawer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import Home from './pages/public/Home';
import Shop from './pages/public/Shop';
import ProductDetail from './pages/public/ProductDetail';
import Categories from './pages/public/Categories';
import CartPage from './pages/public/CartPage';
import CheckoutPage from './pages/public/CheckoutPage';
import OrderSuccessPage from './pages/public/OrderSuccessPage';
import OrderTrackingPage from './pages/public/OrderTrackingPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import FAQPage from './pages/public/FAQPage';
import SizeGuidePage from './pages/public/SizeGuidePage';
import ShippingPolicyPage from './pages/public/ShippingPolicyPage';
import ReturnPolicyPage from './pages/public/ReturnPolicyPage';
import PrivacyPolicyPage from './pages/public/PrivacyPolicyPage';
import TermsPage from './pages/public/TermsPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';
import ResetPasswordPage from './pages/public/ResetPasswordPage';
import NotFoundPage from './pages/public/NotFoundPage';


// User Account Pages
import MyAccount from './pages/user/MyAccount';
import MyOrders from './pages/user/MyOrders';
import OrderDetail from './pages/user/OrderDetail';
import ProfileSettings from './pages/user/ProfileSettings';
import ChangePassword from './pages/user/ChangePassword';

// Admin Dashboard Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductList from './pages/admin/ProductList';
import ProductAdd from './pages/admin/ProductAdd';
import ProductEdit from './pages/admin/ProductEdit';
import OrderList from './pages/admin/OrderList';
import PODList from './pages/admin/PODList';
import CustomerList from './pages/admin/CustomerList';
import CouponList from './pages/admin/CouponList';
import CategoryList from './pages/admin/CategoryList';
import Analytics from './pages/admin/Analytics';
import AuditLogsPage from './pages/admin/AuditLogsPage';
import WebsiteSettingsPage from './pages/admin/WebsiteSettingsPage';

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <SettingsProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen text-[#171717] bg-[#F7F5F0]">
            {!isAdminRoute && <Navbar />}
            <CartDrawer />

            <main className="flex-grow">
              <Routes>
                {/* PUBLIC ROUTES */}
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-success" element={<OrderSuccessPage />} />
                <Route path="/order-tracking" element={<OrderTrackingPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/size-guide" element={<SizeGuidePage />} />
                <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
                <Route path="/return-policy" element={<ReturnPolicyPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:resetToken" element={<ResetPasswordPage />} />

                {/* USER ACCOUNT PROTECTED ROUTES */}
                <Route path="/account" element={<ProtectedRoute><MyAccount /></ProtectedRoute>} />
                <Route path="/account/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
                <Route path="/account/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
                <Route path="/account/profile" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
                <Route path="/account/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />

                {/* ADMIN PROTECTED ROUTES */}
                <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/products" element={<ProtectedRoute requireAdmin={true}><ProductList /></ProtectedRoute>} />
                <Route path="/admin/products/add" element={<ProtectedRoute requireAdmin={true}><ProductAdd /></ProtectedRoute>} />
                <Route path="/admin/products/edit/:id" element={<ProtectedRoute requireAdmin={true}><ProductEdit /></ProtectedRoute>} />
                <Route path="/admin/orders" element={<ProtectedRoute requireAdmin={true}><OrderList /></ProtectedRoute>} />
                <Route path="/admin/pod" element={<ProtectedRoute requireAdmin={true}><PODList /></ProtectedRoute>} />
                <Route path="/admin/customers" element={<ProtectedRoute requireAdmin={true}><CustomerList /></ProtectedRoute>} />
                <Route path="/admin/coupons" element={<ProtectedRoute requireAdmin={true}><CouponList /></ProtectedRoute>} />
                <Route path="/admin/categories" element={<ProtectedRoute requireAdmin={true}><CategoryList /></ProtectedRoute>} />
                <Route path="/admin/analytics" element={<ProtectedRoute requireAdmin={true}><Analytics /></ProtectedRoute>} />
                <Route path="/admin/audit-logs" element={<ProtectedRoute requireAdmin={true}><AuditLogsPage /></ProtectedRoute>} />
                <Route path="/admin/settings" element={<ProtectedRoute requireAdmin={true}><WebsiteSettingsPage /></ProtectedRoute>} />

                {/* CATCH-ALL 404 NOT FOUND */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>

            </main>

            {!isAdminRoute && <Footer />}
          </div>
        </CartProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
