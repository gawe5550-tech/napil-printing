import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ShopProvider } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPaymentPage } from './pages/CheckoutPaymentPage';
import { OrderStatusPage } from './pages/OrderStatusPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminPaymentValidation } from './pages/admin/AdminPaymentValidation';
import { AdminOrderManagement } from './pages/admin/AdminOrderManagement';
import { AdminSalesReport } from './pages/admin/AdminSalesReport';

// Route Protection Component for Admin Pages
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (currentUser.role !== 'admin') {
    // User is not admin, protect admin route
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Route Protection Component for User-Specific Checkout
const UserRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (currentUser && currentUser.role === 'admin') {
    // Admins are redirected to admin dashboard
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-orange-500 selection:text-white">
      <Navbar />
      <ToastContainer />
      <main className="flex-1">
        <Routes>
          {/* User & Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route
            path="/cart"
            element={
              <UserRoute>
                <CartPage />
              </UserRoute>
            }
          />
          <Route
            path="/payment/:orderId"
            element={
              <UserRoute>
                <CheckoutPaymentPage />
              </UserRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <UserRoute>
                <OrderStatusPage />
              </UserRoute>
            }
          />

          {/* Authentication */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <AdminRoute>
                <AdminPaymentValidation />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminOrderManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <AdminRoute>
                <AdminSalesReport />
              </AdminRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ShopProvider>
          <AppRoutes />
        </ShopProvider>
      </AuthProvider>
    </Router>
  );
}
