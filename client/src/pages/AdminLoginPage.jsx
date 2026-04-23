import React, { useState, useContext } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaEnvelope, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await login(email, password);
            if (res.success) {
                toast.success('Access Granted. Welcome, Admin.');
                navigate('/admin');
            } else {
                toast.error(res.message);
            }
        } catch (err) {
            toast.error('Authentication error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div style={{
                minHeight: '85vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'radial-gradient(circle at top right, var(--secondary-light), transparent), radial-gradient(circle at bottom left, var(--primary-light), transparent)',
                padding: '1rem'
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="glass-panel"
                    style={{
                        padding: '3.5rem 2.5rem',
                        width: '100%',
                        maxWidth: '450px',
                        textAlign: 'center',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        border: '1px solid var(--glass-border)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {/* Decorative element */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '4px',
                        background: 'linear-gradient(90deg, var(--primary), var(--secondary))'
                    }} />

                    <div style={{
                        width: '72px', height: '72px', borderRadius: '20px',
                        background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 2rem', color: 'white',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                    }}>
                        <FaShieldAlt size={36} />
                    </div>

                    <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Secure Access</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>Enter your administrator credentials</p>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>Admin Email</label>
                            <div style={{ position: 'relative' }}>
                                <FaEnvelope style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="email"
                                    placeholder="admin@jusvend.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{
                                        padding: '1rem 1rem 1rem 3.5rem',
                                        width: '100%',
                                        borderRadius: '12px',
                                        border: '1px solid var(--glass-border)',
                                        background: 'rgba(255,255,255,0.05)',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <FaLock style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{
                                        padding: '1rem 1rem 1rem 3.5rem',
                                        width: '100%',
                                        borderRadius: '12px',
                                        border: '1px solid var(--glass-border)',
                                        background: 'rgba(255,255,255,0.05)',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="btn-secondary"
                            style={{
                                width: '100%',
                                padding: '1.1rem',
                                borderRadius: '12px',
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                marginTop: '1rem',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                            }}
                            disabled={loading}
                        >
                            {loading ? 'Authenticating...' : 'Enter Console'}
                        </motion.button>
                    </form>

                    <div style={{ marginTop: '2.5rem', fontSize: '0.9rem' }}>
                        <a href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <span>←</span> Back to public site
                        </a>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
};

export default AdminLoginPage;
