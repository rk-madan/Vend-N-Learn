import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // Import Toaster
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import PrintPage from './pages/PrintPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OrdersPage from './pages/OrdersPage';
import HelpPage from './pages/HelpPage';
import WishlistPage from './pages/WishlistPage';
import ReceiptPage from './pages/ReceiptPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import AdminDashboard from './pages/AdminDashboard'; // Import Home
import AdminLoginPage from './pages/AdminLoginPage';
import CheckoutPage from './pages/CheckoutPage';

import AnnouncementBar from './components/AnnouncementBar';

function App() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} /> {/* centralized toaster */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/print" element={<PrintPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/receipt" element={<ReceiptPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/help" element={<HelpPage />} />
      </Routes>
    </>
  );
}

export default App;
