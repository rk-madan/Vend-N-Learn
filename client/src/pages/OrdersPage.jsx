import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBoxOpen, FaCalendarAlt, FaChevronDown, FaChevronUp, FaShoppingBag, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const OrdersPage = () => {
    const { token } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/orders', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                } else {
                    toast.error('Failed to fetch orders');
                }
            } catch (err) {
                console.error(err);
                toast.error('Error loading history');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [token]);

    const toggleExpand = (id) => {
        setExpandedOrder(expandedOrder === id ? null : id);
    };

    if (loading) {
        return (
            <Layout>
                <div style={{ textAlign: 'center', marginTop: '100px' }}>
                    <div className="spin" style={{ fontSize: '2rem', color: 'var(--primary)' }}><FaBoxOpen /></div>
                    <p>Loading History...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container" style={{ padding: '2rem 1rem' }}>
                <h1 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaShoppingBag color="var(--primary)" /> Your Orders
                </h1>

                {orders.length === 0 ? (
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem' }}>
                        <h3>No orders found.</h3>
                        <p style={{ color: 'var(--text-muted)' }}>It looks like you haven't bought anything yet.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {orders.map((order) => (
                            <motion.div
                                key={order._id}
                                layout
                                className="glass-panel"
                                style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--glass-border)' }}
                            >
                                {/* Header Row */}
                                <div
                                    onClick={() => toggleExpand(order._id)}
                                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Order #{order._id.slice(-6).toUpperCase()}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <FaCalendarAlt size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 800, color: 'var(--primary)' }}>₹{order.totalAmount}</div>
                                            <div style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '5px',
                                                padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700,
                                                background: order.isPaid ? '#ecfdf5' : '#fffbeb',
                                                color: order.isPaid ? '#047857' : '#b45309'
                                            }}>
                                                {order.isPaid ? <FaCheckCircle size={12} /> : null}
                                                {order.isPaid ? 'Payment Successful' : 'Pending Payment'}
                                            </div>
                                        </div>
                                        <div>
                                            {expandedOrder === order._id ? <FaChevronUp /> : <FaChevronDown />}
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                <AnimatePresence>
                                    {expandedOrder === order._id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            style={{ overflow: 'hidden' }}
                                        >
                                            <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '1rem', paddingTop: '1rem' }}>
                                                <h4 style={{ marginBottom: '0.5rem' }}>Items</h4>
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', fontSize: '0.95rem' }}>
                                                        <span>{item.name} <span style={{ color: 'var(--text-muted)' }}>x {item.quantity}</span></span>
                                                        <span>₹{item.price * item.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default OrdersPage;
