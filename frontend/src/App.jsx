import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import AIAssistant from './components/AIAssistant.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Products from './pages/Products.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Offers from './pages/Offers.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Payment from './pages/Payment.jsx';
import CustomCake from './pages/CustomCake.jsx';
import Reviews from './pages/Reviews.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Account from './pages/Account.jsx';
import OrderHistory from './pages/OrderHistory.jsx';
import OrderDetails from './pages/OrderDetails.jsx';
import Addresses from './pages/Addresses.jsx';
import MyPurchases from './pages/MyPurchases.jsx';
import NotFound from './pages/NotFound.jsx';

import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminProducts from './pages/AdminProducts.jsx';
import AdminCategories from './pages/AdminCategories.jsx';
import AdminOrders from './pages/AdminOrders.jsx';
import AdminReviews from './pages/AdminReviews.jsx';
import AdminAnalytics from './pages/AdminAnalytics.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function CustomerLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <AIAssistant />
    </>
  );
}

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Customer-facing routes */}
        <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
        <Route path="/about" element={<CustomerLayout><About /></CustomerLayout>} />
        <Route path="/products" element={<CustomerLayout><Products /></CustomerLayout>} />
        <Route path="/products/:id" element={<CustomerLayout><ProductDetails /></CustomerLayout>} />
        <Route path="/offers" element={<CustomerLayout><Offers /></CustomerLayout>} />
        <Route path="/cart" element={<CustomerLayout><ProtectedRoute><Cart /></ProtectedRoute></CustomerLayout>} />
        <Route path="/checkout" element={<CustomerLayout><ProtectedRoute><Checkout /></ProtectedRoute></CustomerLayout>} />
        <Route path="/payment" element={<CustomerLayout><ProtectedRoute><Payment /></ProtectedRoute></CustomerLayout>} />
        <Route path="/custom-cake" element={<CustomerLayout><CustomCake /></CustomerLayout>} />
        <Route path="/reviews" element={<CustomerLayout><Reviews /></CustomerLayout>} />
        <Route path="/contact" element={<CustomerLayout><Contact /></CustomerLayout>} />
        <Route path="/login" element={<CustomerLayout><Login /></CustomerLayout>} />
        <Route path="/register" element={<CustomerLayout><Register /></CustomerLayout>} />
        <Route path="/account" element={<CustomerLayout><ProtectedRoute><Account /></ProtectedRoute></CustomerLayout>} />
        <Route path="/account/orders" element={<CustomerLayout><ProtectedRoute><OrderHistory /></ProtectedRoute></CustomerLayout>} />
        <Route path="/account/orders/:id" element={<CustomerLayout><ProtectedRoute><OrderDetails /></ProtectedRoute></CustomerLayout>} />
        <Route path="/account/addresses" element={<CustomerLayout><ProtectedRoute><Addresses /></ProtectedRoute></CustomerLayout>} />
        <Route path="/account/purchases" element={<CustomerLayout><ProtectedRoute><MyPurchases /></ProtectedRoute></CustomerLayout>} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute admin><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute admin><AdminProducts /></ProtectedRoute>} />
        <Route path="/admin/categories" element={<ProtectedRoute admin><AdminCategories /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute admin><AdminOrders /></ProtectedRoute>} />
        <Route path="/admin/reviews" element={<ProtectedRoute admin><AdminReviews /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute admin><AdminAnalytics /></ProtectedRoute>} />

        <Route path="*" element={<CustomerLayout><NotFound /></CustomerLayout>} />
      </Routes>
    </>
  );
}
