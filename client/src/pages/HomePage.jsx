import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBagShopping, FaPrint, FaClockRotateLeft, FaCircleQuestion, FaArrowRight, FaRocket, FaShieldHalved, FaMicrochip } from 'react-icons/fa6';
import { FaPlus, FaCheck, FaSpinner } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusIndex, setStatusIndex] = useState(0);
    const { token } = useContext(AuthContext);
    const { addToCart } = useCart();
    const [addedId, setAddedId] = useState(null);

    // Dynamic Time-of-Day Theming
    const getInitialTheme = () => {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 17) return 'day';
        if (hour >= 17 && hour < 20) return 'evening';
        return 'night';
    };
    const [theme, setTheme] = useState(getInitialTheme());

    const themes = {
        day: {
            mesh: 'radial-gradient(at 10% 20%, rgba(99, 102, 241, 0.15) 0px, transparent 50%), radial-gradient(at 90% 10%, rgba(236, 72, 153, 0.15) 0px, transparent 50%)',
            accent: '#4f46e5',
            bg: '#fcfcfe'
        },
        evening: {
            mesh: 'radial-gradient(at 10% 20%, rgba(245, 158, 11, 0.2) 0px, transparent 50%), radial-gradient(at 90% 10%, rgba(236, 72, 153, 0.2) 0px, transparent 50%)',
            accent: '#f59e0b',
            bg: '#fff7ed'
        },
        night: {
            mesh: 'radial-gradient(at 10% 20%, rgba(79, 70, 229, 0.3) 0px, transparent 50%), radial-gradient(at 90% 10%, rgba(139, 92, 246, 0.3) 0px, transparent 50%)',
            accent: '#8b5cf6',
            bg: '#0f172a'
        }
    };

    const statuses = [
        "📦 RECENTLY VENDED: Blue Ink Pen",
        "⚡ AVG. PICKUP TIME: 35 SECONDS",
        "🔥 POPULAR: Classmate Longbook",
        "🕒 24/7 INSTANT DISPENSING"
    ];

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/products');
                const data = await res.json();
                setFeaturedProducts(data.slice(0, 4));
            } catch (err) {
                console.error('Featured Load Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();

        const timer = setInterval(() => {
            setStatusIndex(prev => (prev + 1) % statuses.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const handleQuickAdd = (product) => {
        addToCart(product);
        setAddedId(product._id);
        toast.success(`${product.name} added!`);
        setTimeout(() => setAddedId(null), 1000);
    };

    const currentTheme = themes[theme];

    return (
        <Layout>
            <div style={{ ...pageWrapperStyle, background: currentTheme.bg }}>

                {/* 1. HERO SECTION */}
                <section style={heroSectionStyle}>
                    <div style={{ ...meshGradientStyle, background: currentTheme.mesh }} />

                    {/* Floating Decorative Elements */}
                    <div style={floatingContainerStyle}>
                        <motion.div animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 4 }} style={{ ...floatIconStyle, top: '15%', left: '10%' }}>✒️</motion.div>
                        <motion.div animate={{ y: [0, 25, 0], rotate: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 5 }} style={{ ...floatIconStyle, top: '25%', right: '15%' }}>📘</motion.div>
                        <motion.div animate={{ y: [0, -15, 0], rotate: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 3 }} style={{ ...floatIconStyle, bottom: '20%', left: '20%' }}>📏</motion.div>
                    </div>

                    {/* Theme Preview Toggle */}
                    <div style={themeToggleContainer}>
                        {['day', 'evening', 'night'].map(t => (
                            <button
                                key={t}
                                onClick={() => setTheme(t)}
                                style={{ ...themeToggleBtn, background: theme === t ? currentTheme.accent : 'white', color: theme === t ? 'white' : '#64748b' }}
                            >
                                {t.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4rem', marginBottom: '6rem' }}>
                            <div style={{ flex: 1.2, textAlign: 'left' }}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={liveStatBadge}
                                >
                                    <span style={dotStyle} />
                                    <div style={{ width: '220px', textAlign: 'left', overflow: 'hidden' }}>
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={statusIndex}
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: -20, opacity: 0 }}
                                                transition={{ duration: 0.4 }}
                                                style={{ fontSize: '0.75rem', fontWeight: 800, color: theme === 'night' ? '#cbd5e1' : '#64748b' }}
                                            >
                                                {statuses[statusIndex]}
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    style={{ ...heroTitleStyle, color: theme === 'night' ? 'white' : '#0f172a' }}
                                >
                                    The Future of <br />
                                    <span style={gradientTitleStyle}>Stationeries</span> is Here.
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    viewport={{ once: true }}
                                    style={{ ...heroSubStyle, color: theme === 'night' ? '#94a3b8' : '#64748b' }}
                                >
                                    Effortless procurement. Instant dispensing. Premium quality. <br />
                                    Experience the smartest stationery station in your campus.
                                </motion.p>

                                <Link to="/shop" style={{ textDecoration: 'none' }}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                        style={{ ...heroCta, background: currentTheme.accent }}
                                    >
                                        Start Your Tray <FaArrowRight size={14} />
                                    </motion.button>
                                </Link>
                            </div>

                            {/* REALISTIC 3D VENDING MACHINE VISUAL */}
                            <div style={{ flex: 1.2, display: 'flex', justifyContent: 'center', position: 'relative' }}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                    whileHover={{ rotateY: -10, rotateX: 5, scale: 1.05 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    style={{
                                        width: '100%',
                                        maxWidth: '500px',
                                        perspective: '1500px',
                                        filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.15))'
                                    }}
                                >
                                    <img
                                        src="/images/Vending machine.jpg"
                                        alt="JusVend Premium Vending Machine"
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            display: 'block',
                                            transformStyle: 'preserve-3d'
                                        }}
                                    />

                                    {/* Website Display Dialog Highlight */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1, duration: 0.5 }}
                                        style={{
                                            position: 'absolute',
                                            top: '20%',
                                            right: '-30px',
                                            background: 'rgba(255, 255, 255, 0.95)',
                                            backdropFilter: 'blur(10px)',
                                            padding: '12px 20px',
                                            borderRadius: '16px',
                                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                            border: '1px solid rgba(255,255,255,0.3)',
                                            zIndex: 5,
                                            maxWidth: '180px'
                                        }}
                                    >
                                        <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>
                                            Interactive UI on every machine.
                                        </p>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>

                        {/* 2. MAIN NAVIGATION CARDS */}
                        <div style={cardGridStyle}>
                            {[
                                { to: "/shop", icon: <FaBagShopping />, label: "Stationery Shop", desc: "Browse 50+ premium essentials.", bg: '#6366f1', color: 'rgba(99, 102, 241, 0.1)' },
                                { to: "/print", icon: <FaPrint />, label: "Quick Print", desc: "Instant cloud printing station.", bg: '#ec4899', color: 'rgba(236, 72, 153, 0.1)' },
                                { to: "/orders", icon: <FaClockRotateLeft />, label: "Orders", desc: "Track history.", bg: '#22c55e', color: 'rgba(34, 197, 94, 0.1)', small: true },
                                { to: "/help", icon: <FaCircleQuestion />, label: "Support", desc: "FAQs & help.", bg: '#f59e0b', color: 'rgba(245, 158, 11, 0.1)', small: true }
                            ].map((card, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -10 }}
                                >
                                    <Link to={card.to} style={{ textDecoration: 'none' }}>
                                        <div className="glass-panel shine-hover" style={{
                                            ...(card.small ? { ...mainCardStyle, padding: '2rem' } : mainCardStyle),
                                            background: theme === 'night' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255,255,255,0.7)',
                                            borderColor: theme === 'night' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)'
                                        }}>
                                            <div style={{ ...iconBoxStyle, width: card.small ? '50px' : '64px', height: card.small ? '50px' : '64px', background: card.color, color: card.bg }}>
                                                {card.icon}
                                            </div>
                                            <h3 style={{ ...(card.small ? { ...cardTitleStyle, fontSize: '1.2rem' } : cardTitleStyle), color: theme === 'night' ? 'white' : '#1e293b' }}>{card.label}</h3>
                                            <p style={{ ...(card.small ? { ...cardDescStyle, fontSize: '0.8rem' } : cardDescStyle), color: theme === 'night' ? '#94a3b8' : '#64748b' }}>{card.desc}</p>
                                            {!card.small && <div style={{ ...cardFooterStyle, color: currentTheme.accent }}><FaArrowRight /></div>}
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 3. HOW IT WORKS */}
                <section style={{ ...howItWorksStyle, background: theme === 'night' ? '#0f172a' : 'white' }}>
                    <div className="container">
                        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                            <motion.h2
                                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                                style={{ ...sectionTitleCenterStyle, color: theme === 'night' ? 'white' : '#0f172a' }}
                            >
                                The JusVend Cycle
                            </motion.h2>
                            <p style={{ color: theme === 'night' ? '#94a3b8' : 'var(--text-muted)', fontWeight: 600 }}>Get what you need in under 60 seconds.</p>
                        </div>
                        <div style={stepGridStyle}>
                            {[
                                { num: "01", title: "Select Items", desc: "Browse catalog and add to tray." },
                                { num: "02", title: "Secure Pay", desc: "Pay via UPI or Encrypted Card." },
                                { num: "03", title: "Instant Pick", desc: "Collect items from dispenser slot." }
                            ].map((s, i) => (
                                <React.Fragment key={i}>
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.2 }} viewport={{ once: true }}
                                        style={stepItemStyle}
                                    >
                                        <div style={{ ...stepNumberStyle, color: theme === 'night' ? '#1e293b' : '#f1f5f9' }}>{s.num}</div>
                                        <h4 style={{ ...stepTitleStyle, color: theme === 'night' ? 'white' : '#1e293b' }}>{s.title}</h4>
                                        <p style={{ ...stepDescStyle, color: theme === 'night' ? '#94a3b8' : '#64748b' }}>{s.desc}</p>
                                    </motion.div>
                                    {i < 2 && <div style={stepDividerStyle} />}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4. FEATURED PRODUCTS */}
                <section style={featuredSectionStyle}>
                    <div className="container">
                        <div style={sectionHeaderStyle}>
                            <h2 style={{ ...sectionTitleStyle, color: theme === 'night' ? 'white' : '#0f172a' }}>Trending Near You</h2>
                            <Link to="/shop" style={{ ...viewAllStyle, color: currentTheme.accent }}>View All <FaArrowRight size={12} /></Link>
                        </div>

                        {loading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><FaSpinner className="spin" size={30} color={currentTheme.accent} /></div>
                        ) : (
                            <div style={featuredGridStyle}>
                                {featuredProducts.map((p, i) => (
                                    <motion.div
                                        key={p._id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        viewport={{ once: true }}
                                        whileHover={{ y: -5 }}
                                        style={{ ...productBriefStyle, background: theme === 'night' ? '#1e293b' : 'white', borderColor: theme === 'night' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                                        className="glass-panel"
                                    >
                                        <div style={productImageWrapper}>
                                            <img src={p.image} alt={p.name} style={productImgStyle} />
                                            {/* Premium Gold Tag */}
                                            <div style={{
                                                position: 'absolute',
                                                top: '15px',
                                                right: '15px',
                                                background: 'linear-gradient(135deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)',
                                                color: '#1e293b',
                                                padding: '4px 12px',
                                                borderRadius: '6px',
                                                fontSize: '0.65rem',
                                                fontWeight: 900,
                                                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                                                border: '1px solid rgba(255,255,255,0.4)',
                                                letterSpacing: '1px'
                                            }}>
                                                5% SAVE
                                            </div>
                                        </div>
                                        <div style={{ padding: '1.5rem' }}>
                                            <h4 style={{ ...prodBriefName, color: theme === 'night' ? 'white' : '#1e293b' }}>{p.name}</h4>
                                            <div style={prodBriefFooter}>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through' }}>₹{p.price}</span>
                                                    <span style={{ ...prodBriefPrice, color: currentTheme.accent }}>₹{Math.floor(p.price * 0.95)}</span>
                                                </div>
                                                <button onClick={() => handleQuickAdd(p)} style={{ ...quickAddButtonStyle, background: currentTheme.accent }}>
                                                    {addedId === p._id ? <FaCheck /> : <FaPlus />}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* 5. TRUST */}
                <section style={{ ...trustSectionStyle, background: theme === 'night' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' }}>
                    <div className="container" style={trustContainerStyle}>
                        {[
                            { icon: <FaShieldHalved />, title: "Secure Payments", desc: "UPI, Cards & Encrypted PIN." },
                            { icon: <FaRocket />, title: "Instant Dispense", desc: "Zero contact, 5-second pickup." },
                            { icon: <div style={certifiedDot} />, title: "Certified Quality", desc: "Verified high-quality brands." }
                        ].map((t, i) => (
                            <div key={i} style={trustItemStyle}>
                                <div style={{ color: currentTheme.accent, fontSize: '1.5rem' }}>{t.icon}</div>
                                <div>
                                    <h5 style={{ ...trustTitle, color: theme === 'night' ? 'white' : '#0f172a' }}>{t.title}</h5>
                                    <p style={{ ...trustDesc, color: theme === 'night' ? '#94a3b8' : '#64748b' }}>{t.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <style>{`
                    .shine-hover { position: relative; overflow: hidden; }
                    .shine-hover::after {
                        content: '';
                        position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
                        background: linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent);
                        transform: rotate(45deg);
                        transition: 0.6s;
                        opacity: 0;
                    }
                    .shine-hover:hover::after { left: 100%; opacity: 1; }
                `}</style>

            </div>
        </Layout>
    );
};

// --- STYLES ---
const pageWrapperStyle = { minHeight: '100vh', paddingBottom: '4rem', transition: 'background 1s ease' };
const heroSectionStyle = { position: 'relative', paddingTop: '8rem', paddingBottom: '10rem', overflow: 'hidden' };
const meshGradientStyle = { position: 'absolute', top: '-10%', left: '-5%', width: '110%', height: '110%', filter: 'blur(100px)', zIndex: 1, transition: 'background 1s ease' };
const floatingContainerStyle = { position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, pointerEvents: 'none', zIndex: 1 };
const floatIconStyle = { position: 'absolute', fontSize: '2.5rem', opacity: 0.4, filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' };
const themeToggleContainer = { position: 'absolute', top: '100px', right: '5%', zIndex: 10, display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.5)', padding: '4px', borderRadius: '12px', backdropFilter: 'blur(5px)' };
const themeToggleBtn = { padding: '6px 12px', borderRadius: '8px', border: 'none', fontSize: '0.65rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.3s' };
const heroContentStyle = { position: 'relative' };
const liveStatBadge = { display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '10px 24px', borderRadius: '50px', background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(0,0,0,0.05)', marginBottom: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', height: '44px' };
const dotStyle = { width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' };
const heroTitleStyle = { fontSize: '4.8rem', fontWeight: 950, lineHeight: 1, margin: '0 0 1.5rem', letterSpacing: '-0.05em' };
const gradientTitleStyle = { background: 'linear-gradient(135deg, #4f46e5, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' };
const heroSubStyle = { fontSize: '1.3rem', maxWidth: '750px', lineHeight: 1.7, fontWeight: 500, marginBottom: '2.5rem' };
const heroCta = { display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '16px 32px', borderRadius: '50px', color: 'white', border: 'none', fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 25px rgba(79, 70, 229, 0.3)' };

const cardGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', maxWidth: '1100px', margin: '0 auto' };
const mainCardStyle = { padding: '3.5rem 2.5rem', height: '100%', cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', backdropFilter: 'blur(20px)', border: '1px solid', borderRadius: '32px' };
const iconBoxStyle = { width: '64px', height: '64px', borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' };
const cardTitleStyle = { fontSize: '1.6rem', fontWeight: 900, margin: '0 0 0.6rem' };
const cardDescStyle = { fontSize: '1rem', lineHeight: 1.5, margin: 0 };
const cardFooterStyle = { marginTop: '2.5rem', fontSize: '1.3rem', display: 'flex', justifyContent: 'flex-end' };

const howItWorksStyle = { padding: '10rem 0', transition: 'background 1s ease' };
const sectionTitleCenterStyle = { fontSize: '3rem', fontWeight: 950, letterSpacing: '-0.03em', marginBottom: '0.8rem' };
const stepGridStyle = { display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center', maxWidth: '1000px', margin: '0 auto' };
const stepItemStyle = { flex: 1, textAlign: 'center', padding: '3rem 2rem', position: 'relative' };
const stepNumberStyle = { fontSize: '5rem', fontWeight: 950, marginBottom: '-2rem', position: 'relative', zIndex: 0 };
const stepTitleStyle = { fontSize: '1.4rem', fontWeight: 900, margin: '0 0 1rem', position: 'relative', zIndex: 1 };
const stepDescStyle = { fontSize: '1rem', lineHeight: 1.7, fontWeight: 500 };
const stepDividerStyle = { width: '100px', height: '1px', background: 'linear-gradient(to right, transparent, #cbd5e1, transparent)' };

const featuredSectionStyle = { padding: '8rem 0' };
const sectionHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem' };
const sectionTitleStyle = { fontSize: '2.5rem', fontWeight: 950, margin: 0, letterSpacing: '-0.03em' };
const viewAllStyle = { textDecoration: 'none', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' };
const featuredGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' };
const productBriefStyle = { overflow: 'hidden', borderRadius: '28px', border: '1px solid', transition: 'all 0.3s ease' };
const productImageWrapper = { height: '200px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' };
const productImgStyle = { maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' };
const prodBriefName = { margin: '0 0 1.2rem', fontSize: '1.1rem', fontWeight: 800 };
const prodBriefFooter = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const prodBriefPrice = { fontSize: '1.3rem', fontWeight: 900 };
const quickAddButtonStyle = { width: '42px', height: '42px', borderRadius: '14px', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' };

const trustSectionStyle = { padding: '6rem 0', borderTop: '1px solid rgba(0,0,0,0.03)', transition: 'background 1s ease' };
const trustContainerStyle = { display: 'flex', justifyContent: 'space-between', gap: '3rem' };
const trustItemStyle = { display: 'flex', gap: '20px', alignItems: 'center', flex: 1 };
const trustTitle = { margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 900 };
const trustDesc = { margin: 0, fontSize: '0.9rem', fontWeight: 500 };
const certifiedDot = { width: '12px', height: '12px', borderRadius: '50%', background: '#ec4899', border: '3px solid white', boxShadow: '0 0 15px rgba(236,72,153,0.5)' };

export default HomePage;
