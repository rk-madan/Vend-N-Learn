import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeartBroken, FaShoppingCart, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const WishlistPage = () => {
    const { token } = useContext(AuthContext);
    const { addToCart } = useCart();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchWishlist = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/wishlist`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setWishlist(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, [token]);

    const removeFromWishlist = async (productId) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/wishlist/${productId}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const updatedList = await res.json();
                setWishlist(updatedList);
                toast.success('Removed from wishlist');
            }
        } catch (err) {
            toast.error('Failed to update wishlist');
        }
    };

    if (loading) return <Layout><div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div></Layout>;

    return (
        <Layout>
            <div className="container" style={{ padding: '2rem 1rem' }}>
                <h1 style={{ marginBottom: '2rem' }}>My Wishlist</h1>

                {wishlist.length === 0 ? (
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem' }}>
                        <FaHeartBroken size={50} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                        <h3>Your wishlist is empty.</h3>
                        <p>Go explore the shop and save items you like!</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
                        <AnimatePresence>
                            {wishlist.map(item => (
                                <motion.div
                                    key={item._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    className="glass-panel"
                                    style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', position: 'relative' }}
                                >
                                    <button
                                        onClick={() => removeFromWishlist(item._id)}
                                        style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(255,0,0,0.1)', color: 'crimson', padding: '8px', borderRadius: '50%' }}
                                    >
                                        <FaTrash size={14} />
                                    </button>

                                    <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', background: '#fff', borderRadius: '1rem', padding: '10px' }}>
                                        <img src={item.image} alt={item.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                                    </div>

                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{item.name}</h3>
                                    <div style={{ fontWeight: 800, color: 'var(--primary)', marginBottom: '1rem' }}>₹{item.price}</div>

                                    <button
                                        className="btn-primary"
                                        onClick={() => addToCart(item)}
                                        style={{ marginTop: 'auto', width: '100%' }}
                                    >
                                        <FaShoppingCart /> Add to Cart
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default WishlistPage;
