import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaStar, FaShoppingCart, FaPlus, FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const { user, token } = useContext(AuthContext);
    console.log("USER =", user);
    console.log("TOKEN =", token);
    const { addToCart, getCountForProduct } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [added, setAdded] = useState(false);

    // Review states
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    const fetchData = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/products/${id}`);
            if (res.ok) {
                const data = await res.json();
                setProduct(data);
            } else {
                toast.error('Product not found');
            }
        } catch (err) {
            toast.error('Error loading product');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleAddToCart = () => {
        const available = product.stock - getCountForProduct(product.sku);
        if (available > 0) {
            addToCart(product);
            setAdded(true);
            toast.success('Added to cart');
            setTimeout(() => setAdded(false), 2000);
        } else {
            toast.error('Out of stock');
        }
    };

    const submitReview = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to review');
            return;
        }
        setSubmittingReview(true);
        try {
            const res = await fetch(`http://localhost:5000/api/products/${id}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ rating, comment })
            });
            if (res.ok) {
                toast.success('Review submitted!');
                setComment('');
                setRating(5);
                fetchData(); // Refresh reviews
            } else {
                const data = await res.json();
                toast.error(data.message || 'Failed to submit review');
            }
        } catch (err) {
            toast.error('Error submitting review');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) return <Layout><div style={{ textAlign: 'center', marginTop: '100px' }}>Loading...</div></Layout>;
    if (!product) return <Layout><div style={{ textAlign: 'center', marginTop: '100px' }}>Product not found</div></Layout>;

    return (
        <Layout>
            <div className="container" style={{ padding: '2rem 1rem' }}>
                <Link to="/shop" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    <FaChevronLeft /> Back to Shop
                </Link>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '4rem' }}>
                    {/* Left: Product Image */}
                    <motion.div
                        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                        className="glass-panel"
style={{
    height: 'auto',
    minHeight: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#fff',
    padding: '2rem'
}}                    >
                        <img src={product.image} alt={product.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                    </motion.div>

                    {/* Right: Info */}
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <div className="badge badge-stock" style={{ marginBottom: '1rem' }}>{product.category || 'Stationery'}</div>
                        <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)', marginBottom: '1rem' }}>
  {product.name}
</h1>

                        <div
    style={{
        display: 'flex',
        gap: '5px',
        color: '#f59e0b',
        marginBottom: '1.5rem',
        alignItems: 'center'
    }}
>
    {[1, 2, 3, 4, 5].map(star => (
        <FaStar
            key={star}
            color={
                star <= Math.round(product.averageRating || 0)
                    ? '#f59e0b'
                    : '#d1d5db'
            }
        />
    ))}

    <span
        style={{
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
            marginLeft: '10px'
        }}
    >
        {
            product.numReviews > 0
                ? `${product.averageRating.toFixed(1)} (${product.numReviews} reviews)`
                : 'No Ratings Yet'
        }
    </span>
</div>

                        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2rem' }}>
                            {product.description}
                        </p>

                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ fontSize: '1.2rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                                ₹{product.price}
                            </div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                ₹{Math.floor(product.price * 0.95)}
                                <span style={{
                                    fontSize: '0.8rem',
                                    background: 'linear-gradient(135deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)',
                                    color: '#1e293b',
                                    padding: '6px 16px',
                                    borderRadius: '50px',
                                    fontWeight: 900,
                                    border: '1px solid rgba(255,255,255,0.4)',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                    letterSpacing: '1px'
                                }}>NEW YEAR EXCLUSIVE</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <button
                                className="btn-primary"
                                style={{ padding: '1.2rem 3rem', fontSize: '1.1rem', background: added ? '#10b981' : undefined }}
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0}
                            >
                                {added ? <><FaCheck /> Added</> : <><FaShoppingCart /> Add to Cart</>}
                            </button>
                            {product.stock <= 0 && <span style={{ color: 'crimson', fontWeight: 600 }}>Out of Stock</span>}
                            {product.stock > 0 && <span style={{ color: '#15803d' }}>{product.stock} in stock</span>}
                        </div>
                    </motion.div>
                </div>

                {/* Reviews Section */}
                <div className="glass-panel" style={{ padding: '3rem' }}>
                    <h2 style={{ marginBottom: '2rem' }}>Customer Reviews</h2>

<div
  style={{
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '2rem'
  }}
  className="reviews-grid"
>                        {/* List */}
                        <div>
                            {product.reviews && product.reviews.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {product.reviews.map((rev, idx) => (
                                        <div key={idx} style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <strong>{rev.userName}</strong>
                                                <div style={{ display: 'flex', gap: '2px' }}>
                                                    {[1, 2, 3, 4, 5].map(s => <FaStar key={s} size={12} color={s <= rev.rating ? '#f59e0b' : '#d1d5db'} />)}
                                                </div>
                                            </div>
                                            <p style={{ margin: 0, color: 'var(--text-muted)' }}>{rev.comment}</p>
                                            <small style={{ color: 'var(--text-light)' }}>{new Date(rev.createdAt).toLocaleDateString()}</small>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first to share your experience!</p>
                            )}
                        </div>

                        {/* Form */}
                        <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content', border: '1px solid var(--primary-light)' }}>
                            <h3>Write a Review</h3>
                            <form onSubmit={submitReview} style={{ marginTop: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Rating</label>
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star} type="button"
                                            onClick={() => setRating(star)}
                                            style={{ background: 'none', cursor: 'pointer' }}
                                        >
                                            <FaStar size={24} color={star <= rating ? '#f59e0b' : '#d1d5db'} />
                                        </button>
                                    ))}
                                </div>

                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Your Comment</label>
                                <textarea
                                    required
                                    rows="4"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Tell us what you think..."
                                    style={{ marginBottom: '1.5rem' }}
                                />

                                <button
                                    type="submit"
                                    className="btn-primary"
                                    style={{ width: '100%' }}
                                    disabled={submittingReview}
                                >
                                    {submittingReview ? 'Submitting...' : 'Post Review'}
                                </button>
                                {!user && <p style={{ fontSize: '0.8rem', color: 'crimson', marginTop: '10px', textAlign: 'center' }}>Please login to review</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProductDetailsPage;
