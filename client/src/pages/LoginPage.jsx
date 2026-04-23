import React, { useState, useContext } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
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
                toast.success('Login Successful!');
                navigate('/');
            } else {
                toast.error(res.message);
            }
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>

                    <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Welcome Back</h2>

                    <form onSubmit={handleLogin}>
                        {/* Email */}
                        <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Email</label>
                            <div style={{ position: 'relative' }}>
                                <FaEnvelope style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="email"
                                    placeholder="student@college.edu"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{ paddingLeft: '45px', width: '100%' }}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <FaLock style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{ paddingLeft: '45px', width: '100%' }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ width: '100%' }}
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)' }}>
                        Don't have an account? <a href="/signup" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Sign Up</a>
                    </p>

                    <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                        <a href="/admin-login" style={{
                            fontSize: '0.85rem', color: 'var(--text-muted)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                            textDecoration: 'none', transition: 'color 0.3s'
                        }}
                            onMouseEnter={(e) => e.target.style.color = 'var(--secondary)'}
                            onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
                        >
                            Staff Portal Access →
                        </a>
                    </div>

                </div>
            </div>
        </Layout>
    );
};

export default LoginPage;
