import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import toast from 'react-hot-toast';
import ImageComponent from './ImageComponent';

const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);

    const handleAdd = () => {
        addToCart(product);
        toast.success(`${product.name} added to cart!`);
    };

    const discountedPrice = Math.floor(product.price * 0.95);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            className="glass-panel"
            style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}
        >
            {/* Premium Gold New Year Deal Badge */}
            <div style={{
                position: 'absolute',
                top: '15px',
                left: '-32px',
                background: 'linear-gradient(135deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)',
                color: '#1e293b',
                padding: '6px 40px',
                fontSize: '0.65rem',
                fontWeight: 900,
                transform: 'rotate(-45deg)',
                zIndex: 10,
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.3)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textShadow: '0 1px 0 rgba(255,255,255,0.4)'
            }}>
                5% Save
            </div>

            <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                <ImageComponent
                    src={product.image}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button className="icon-btn" style={{
                    position: 'absolute', top: 10, right: 10,
                    background: 'white', padding: '8px', borderRadius: '50%',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <FaHeart color="#ef4444" />
                </button>
            </div>

            <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: 'auto' }}>
                    <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: 700 }}>{product.name}</h3>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{product.description}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through' }}>₹{product.price}</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>₹{discountedPrice}</span>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAdd}
                        className="btn-primary"
                        style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}
                    >
                        <FaShoppingCart /> Add
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
