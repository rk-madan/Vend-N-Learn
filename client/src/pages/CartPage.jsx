import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaCreditCard, FaArrowRight, FaSpinner, FaLock, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const CartPage = () => {
    const { cart, updateQty, removeFromCart, getCount } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    const gst = Math.round(subtotal * 0.05);
    const total = subtotal + gst;

    const initiateCheckout = () => {
        if (!user) {
            toast.error('Please login to checkout');
            navigate('/login');
            return;
        }
        navigate('/checkout', { state: { total } });
    };

    if (cart.length === 0) {
        return (
            <Layout>
                <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</motion.div>
                    <h2>Your cart is empty</h2>
                    <button onClick={() => navigate('/shop')} className="btn-primary" style={{ marginTop: '20px' }}>
                        Go Shopping
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container" style={{ padding: '2rem 1rem' }}>
                <h1 style={{ marginBottom: '2rem' }}>Shopping Cart ({getCount()} items)</h1>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {/* Cart Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <AnimatePresence>
                            {cart.map(item => (
                                <motion.div
                                    key={item.sku || item._id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="glass-panel"
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '1.5rem', borderRadius: '1rem'
                                    }}
                                >
                                    <div>
                                        <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem' }}>{item.name}</h4>
                                        <div style={{ color: 'var(--primary)', fontWeight: 700 }}>₹{item.price}</div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f1f5f9', borderRadius: '0.5rem', padding: '0.2rem' }}>
                                            <button onClick={() => updateQty(item.sku, -1)} style={{ padding: '0.5rem 1rem', background: 'white', borderRadius: '0.3rem', border: 'none', cursor: 'pointer' }}>-</button>
                                            <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 600 }}>{item.qty}</span>
                                            <button onClick={() => updateQty(item.sku, 1)} style={{ padding: '0.5rem 1rem', background: 'white', borderRadius: '0.3rem', border: 'none', cursor: 'pointer' }}>+</button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.sku)} style={{ color: '#ef4444', background: '#fee2e2', padding: '0.8rem', borderRadius: '50%', border: 'none', cursor: 'pointer' }}>
                                            <FaTrash />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Checkout Summary */}
                    <div>
                        <motion.div
                            initial={{ y: 20 }} animate={{ y: 0 }}
                            className="glass-panel"
                            style={{ padding: '2rem', position: 'sticky', top: '100px' }}
                        >
                            <h3 style={{ margin: '0 0 1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FaCreditCard /> Order Summary
                            </h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                                <strong>₹{subtotal}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#16a34a', fontWeight: 600 }}>
                                <span>New Year Offer (5% OFF)</span>
                                <span>Applied ✨</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>GST (5%)</span>
                                <strong>₹{gst}</strong>
                            </div>
                            <div style={{ borderTop: '2px dashed #e2e8f0', margin: '1rem 0' }}></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 800 }}>
                                <span>Total</span>
                                <span style={{ color: 'var(--primary)' }}>₹{total}</span>
                            </div>

                            <button onClick={initiateCheckout} className="btn-primary" style={{ width: '100%', fontSize: '1.2rem', justifyContent: 'center' }}>
                                Proceed to Checkout <FaArrowRight style={{ marginLeft: '10px' }} />
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CartPage;
