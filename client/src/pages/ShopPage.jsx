import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { FaSearch, FaPlus, FaCheck, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaStar } from 'react-icons/fa';

const ShopPage = () => {
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('All');

    const { addToCart, cart } = useCart();
    const { user, token } = useContext(AuthContext);
    const [addedId, setAddedId] = useState(null);
    const [wishlist, setWishlist] = useState([]);

    // Filter Buttons
    const filters = ['All', 'Pen', 'Pencil', 'Notebook', 'Scale', 'Eraser', 'Other'];

    // Fetch Products and Wishlist from Backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/products');
                const data = await res.json();
                setProducts(data);
                setFiltered(data);

                if (user && token) {
                    const wishRes = await fetch('http://localhost:5000/api/users/wishlist', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (wishRes.ok) {
                        const wishData = await wishRes.json();
                        setWishlist(wishData.map(item => item && typeof item === 'object' ? item._id : item));
                    }
                }
            } catch (err) {
                toast.error('Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, token]);

    const toggleWishlist = async (productId) => {
        if (!user) {
            toast.error('Please login to save items');
            return;
        }
        try {
            const res = await fetch(`http://localhost:5000/api/users/wishlist/${productId}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const updatedWishlist = await res.json();
                const idList = updatedWishlist.map(item => item && typeof item === 'object' ? item._id : item);
                setWishlist(idList);
                const isAdded = idList.includes(productId);
                toast.success(isAdded ? 'Added to wishlist' : 'Removed from wishlist');
            }
        } catch (err) {
            toast.error('Error updating wishlist');
        }
    };

    useEffect(() => {
        let result = products;

        if (search) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.description.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (filterType !== 'All') {
            if (filterType === 'Other') {
                result = result.filter(p => {
                    const n = p.name.toLowerCase();
                    const isKnown = n.includes(' pen ') || n.includes('pencil') || n.includes('notebook') || n.includes('book') || n.includes('scale') || n.includes('eraser');
                    return !isKnown;
                });
            } else if (filterType === 'Pen') {
                result = result.filter(p => {
                    const n = " " + p.name.toLowerCase() + " ";
                    return n.includes(" pen ");
                });
            } else {
                result = result.filter(p =>
                    p.name.toLowerCase().includes(filterType.toLowerCase()) ||
                    (filterType === 'Notebook' && p.name.toLowerCase().includes('book'))
                );
            }
        }

        setFiltered(result);
    }, [search, filterType, products]);

    const getStock = (product) => {
        const qtyInCart = cart.reduce((total, item) => {
            if (item.sku === product.sku) {
                return total + item.qty;
            }
            return total;
        }, 0);
        return product.stock - qtyInCart;
    };

    const handleAdd = (product) => {
        const currentStock = getStock(product);
        if (currentStock > 0) {
            addToCart(product);
            setAddedId(product._id);
            toast.success(`${product.name} added to cart!`);
            setTimeout(() => setAddedId(null), 1000);
        }
    };

    if (loading) return <Layout><div style={{ textAlign: 'center', marginTop: '100px' }}>Loading...</div></Layout>;

    return (
        <Layout>
            <div className="container" style={{ padding: '2rem 1rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <motion.h1
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        style={{ fontSize: '3rem', margin: '0 0 1rem', background: 'linear-gradient(to right, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                    >
                        Stationery Shop
                    </motion.h1>
                </div>

                {/* Search & Filter */}
                <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <FaSearch color="var(--text-muted)" />
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ border: 'none', background: 'transparent', fontSize: '1.1rem', flex: 1 }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                        {filters.map(f => (
                            <button
                                key={f}
                                onClick={() => setFilterType(f)}
                                className={filterType === f ? 'btn-primary' : 'btn-secondary'}
                                style={{ padding: '0.5rem 1.2rem', borderRadius: '2rem', fontSize: '0.9rem' }}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}

<div
    className="product-grid"
    style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1rem'
    }}
>                    {filtered.map((p) => {
                        const currentStock = getStock(p);
                        return (
                            <motion.div
    layout
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    key={p._id}
    className="glass-panel product-card"
    style={{
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column'
    }}
>
                                <Link to={`/product/${p._id}`}>
                                    <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', background: '#fff', borderRadius: '1rem', padding: '10px', position: 'relative' }}>
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '10px',
                                            left: '10px',
                                            background: '#ffffff',
                                            padding: '6px 10px',
                                            borderRadius: '20px',
                                            fontSize: '0.85rem',
                                            fontWeight: 'bold',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                            zIndex: 100,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}
                                    
                                    >
                                        <FaStar color="#f59e0b" />

                                        {
                                            p.numReviews > 0
                                                ? p.averageRating.toFixed(1)
                                                : 'No Rating'
                                        }
                                    </div>
                                        <img src={p.image} alt={p.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toggleWishlist(p._id);
                                            }}
                                            style={{
                                                position: 'absolute', top: 10, right: 10,
                                                background: 'white', padding: '10px',
                                                borderRadius: '50%', color: wishlist.includes(p._id) ? '#ec4899' : '#cbd5e1',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transition: 'all 0.2s', zIndex: 50,
                                                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}
                                        >
                                            {wishlist.includes(p._id) ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
                                        </button>
                                    </div>
                                </Link>

                                <div style={{ flex: 1 }}>
                                    <Link to={`/product/${p._id}`}>
                                        <h3 style={{ fontSize: '0.95rem', margin: '0 0 0.5rem', color: 'var(--text-main)' }}>{p.name}</h3>
                                    </Link>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{p.description}</p>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', position: 'relative' }}>
                                    {/* Premium Gold New Year Deal Badge */}
                                    <div style={{
                                        position: 'absolute', top: '-205px', left: '-28px',
                                        background: 'linear-gradient(135deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)',
                                        color: '#1e293b', padding: '4px 35px', fontSize: '0.6rem', fontWeight: 900,
                                        transform: 'rotate(-45deg)', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                        border: '1px solid rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1px'
                                    }}>
                                        5% OFF
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'line-through' }}>₹{p.price}</span>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--primary)' }}>₹{Math.floor(p.price * 0.95)}</div>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 'bold', marginTop: '4px', color: currentStock > 0 ? '#16a34a' : '#dc2626' }}>
                                            {currentStock > 0 ? `In Stock: ${currentStock}` : 'Out of Stock'}
                                        </div>
                                    </div>

                                    <button
                                        className="btn-primary"
                                        disabled={currentStock <= 0}
                                        onClick={() => handleAdd(p)}
                                        style={{
                                            padding: '0.6rem 1.2rem', borderRadius: '0.8rem',
                                            background: currentStock <= 0 ? '#e2e8f0' : (addedId === p._id ? '#10b981' : undefined),
                                            color: currentStock <= 0 ? '#94a3b8' : 'white',
                                            cursor: currentStock <= 0 ? 'not-allowed' : 'pointer',
                                            border: 'none', fontWeight: 600,
                                            boxShadow: currentStock > 0 ? '0 4px 14px rgba(0,0,0,0.1)' : 'none'
                                        }}
                                    >
                                        {currentStock <= 0 ? 'Sold Out' : (addedId === p._id ? <><FaCheck /> Added</> : <><FaPlus /> Add</>)}
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {filtered.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        <h3>No items match your filter.</h3>
                    </div>
                )}
            </div>
            <style>{`
@media (max-width:768px){

    .product-grid{
        grid-template-columns:repeat(2,1fr)!important;
        gap:10px!important;
    }

    .product-card{
        padding:10px!important;
    }

    .product-card img{
        max-height:120px!important;
    }

    .container{
        padding:1rem 0.5rem!important;
    }
}
`}</style>
        </Layout>
    );
};

export default ShopPage;
