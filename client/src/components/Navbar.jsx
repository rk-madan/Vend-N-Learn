import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { FaShoppingBag, FaUserCircle, FaPrint, FaHome, FaQuestionCircle, FaSun, FaMoon, FaHeart } from 'react-icons/fa';

const Navbar = () => {
    const { getCount } = useContext(CartContext);
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    const navLinks = [
        { name: 'Home', path: '/', icon: <FaHome /> },
        { name: 'Shop', path: '/shop', icon: <FaShoppingBag /> },
        { name: 'Print', path: '/print', icon: <FaPrint /> },
        { name: 'Wishlist', path: '/wishlist', icon: <FaHeart /> },
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '1rem 5%', position: 'sticky', top: 0,
                background: 'var(--glass)', backdropFilter: 'blur(12px)',
                zIndex: 100, borderBottom: '1px solid var(--glass-border)'
            }}
        >
            <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Vend N Learn
            </Link>

            <div style={{ display: 'flex', gap: '2rem' }}>
                {navLinks.map(link => (
                    <Link
                        key={link.name}
                        to={link.path}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600,
                            color: location.pathname === link.path ? 'var(--primary)' : 'var(--text-main)'
                        }}
                    >
                        {link.icon} {link.name}
                    </Link>
                ))}
                {user && user.isAdmin && (
                    <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--text-main)' }}>
                        <FaUserCircle /> Admin
                    </Link>
                )}
                <Link to="/help" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--text-main)' }}>
                    <FaQuestionCircle /> Help
                </Link>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button
                    onClick={toggleTheme}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                    {theme === 'light' ? <FaMoon size={20} color="var(--text-main)" /> : <FaSun size={20} color="#fcd34d" />}
                </button>

                <Link to="/cart" style={{ position: 'relative' }}>
                    <div style={{ padding: '8px', background: 'var(--background)', borderRadius: '50%' }}>
                        <FaShoppingBag size={20} />
                    </div>
                    {getCount() > 0 && (
                        <motion.span
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            style={{
                                position: 'absolute', top: -5, right: -5,
                                background: 'var(--secondary)', color: 'white',
                                fontSize: '0.7rem', fontWeight: 700,
                                width: '18px', height: '18px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                        >
                            {getCount()}
                        </motion.span>
                    )}
                </Link>

                {user ? (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Link to="/orders" style={{ fontWeight: 600, color: 'var(--text-main)' }}>My Orders</Link>
                        <button onClick={logout} className="btn-secondary" style={{ padding: '0.4rem 1rem' }}>Logout</button>
                    </div>
                ) : (
                    <Link to="/login">
                        <button className="btn-primary" style={{ padding: '0.5rem 1.2rem' }}>Login</button>
                    </Link>
                )}
            </div>
        </motion.nav>
    );
};

export default Navbar;
