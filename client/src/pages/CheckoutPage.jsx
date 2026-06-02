import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLock, FaCreditCard, FaCalendarAlt, FaUser, FaSpinner, FaCheckCircle, FaShieldAlt, FaMobileAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user, token } = useContext(AuthContext);
    const { cart, clearCart } = useContext(CartContext);

    const [step, setStep] = useState('selection'); // 'selection', 'card', 'upi', 'pin', 'ready', 'dispensing'
    const [method, setMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);

    // Payment Details
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: user?.name || '' });
    const [upiId, setUpiId] = useState('');
    const [pin, setPin] = useState('');
    const [paidOrder, setPaidOrder] = useState(null);

    const total = state?.total || 0;

    useEffect(() => {
        if (!total || cart.length === 0) {
            navigate('/cart');
        }
    }, [total, cart, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'number') {
            // Remove all non-digits, limit to 16
            const raw = value.replace(/\D/g, '').slice(0, 16);
            // Add space after every 4 digits
            const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
            setCardDetails({ ...cardDetails, [name]: formatted });
        } else if (name === 'expiry') {
            // Remove non-digits, limit to 4
            const raw = value.replace(/\D/g, '').slice(0, 4);
            // Add slash after 2 digits
            let formatted = raw;
            if (raw.length >= 2) {
                formatted = raw.slice(0, 2) + '/' + raw.slice(2);
            }
            setCardDetails({ ...cardDetails, [name]: formatted });
        } else if (name === 'cvv') {
            // Numbers only, max 3
            setCardDetails({ ...cardDetails, [name]: value.replace(/\D/g, '').slice(0, 3) });
        } else if (name === 'name') {
            setCardDetails({ ...cardDetails, [name]: value });
        }
    };

    const handleMethodSelect = (m) => {
        setMethod(m);
        setStep(m === 'card' ? 'card' : 'upi');
    };

    const validateCard = () => {
        const { number, expiry, cvv, name } = cardDetails;
        if (!name.trim()) return "Cardholder name is required";
        if (!/^\d{16}$/.test(number.replace(/\s/g, ''))) return "Card number must be exactly 16 digits";

        // Expiry Logic
        if (!/^\d{2}\/\d{2}$/.test(expiry)) return "Expiry must be in MM/YY format";
        const [mm, yy] = expiry.split('/').map(Number);
        if (mm < 1 || mm > 12) return "Invalid Month (01-12)";
        if (yy < 25) return "Card has expired (Year must be 25+)";

        if (!/^\d{3}$/.test(cvv)) return "CVV must be 3 digits";
        return null;
    };

    const validateUPI = () => {
        const upiRegex = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{3,}$/;
        if (!upiRegex.test(upiId)) return "Invalid UPI ID (e.g. user@oksbi)";
        return null;
    };

    const handleCardSubmit = (e) => {
        e.preventDefault();
        const error = validateCard();
        if (error) {
            toast.error(error);
            return;
        }
        setStep('pin');
    };

    const handleUpiSubmit = (e) => {
        e.preventDefault();
        const error = validateUPI();
        if (error) {
            toast.error(error);
            return;
        }
        setStep('pin');
    };

    const handlePinSubmit = (e) => {
        e.preventDefault();
        if (!pin || pin.length < 4) {
            toast.error('Enter valid 4-digit PIN');
            return;
        }
        processCheckout();
    };

    const processCheckout = async () => {
        setIsProcessing(true);

        try {
            // 1. Create Order
            const orderRes = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    items: cart.map(i => ({
                        product: i._id,
                        name: i.name,
                        price: i.price,
                        qty: i.qty,
                        type: i.type || 'product'
                    })),
                    totalAmount: total,
                    paymentMethod: method.toUpperCase()
                })
            });

            if (!orderRes.ok) {
                const errData = await orderRes.json();
                throw new Error(errData.message || 'Order creation failed');
            }

            const order = await orderRes.json();

            // 2. Mark as Paid
            const payRes = await fetch(`http://localhost:5000/api/orders/${order._id}/pay`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!payRes.ok) {
                throw new Error('Payment verification failed');
            }

            // Success Path
            setPaidOrder(order);
            setStep('dispensing'); // Only start animation ON SUCCESS
            clearCart();

            setTimeout(() => {
                navigate('/receipt', {
                    state: {
                        order: order,
                        userEmail: user?.email || 'guest@jusvend.com',
                        paymentDate: new Date().toISOString()
                    }
                });
            }, 3000);

        } catch (err) {
            setIsProcessing(false);
            console.error('Checkout Error:', err);
            toast.error(err.message || 'Transaction Failed. Please try again.');
            // Do NOT redirect or fake success on error
        }
    };

    return (
        <Layout>
            <div style={containerStyle}>
                <div style={gridStyle}>
                    {/* Main Interaction Area */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <AnimatePresence mode="wait">
                            {step === 'selection' && (
                                <motion.div
                                    key="selection"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="glass-panel"
                                    style={formPanelStyle}
                                >
                                    <div style={headerStyle}>
                                        <FaShieldAlt size={24} color="var(--primary)" />
                                        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Select Payment</h2>
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Choose your preferred payment method</p>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        <button
                                            onClick={() => handleMethodSelect('card')}
                                            style={methodButtonStyle}
                                            className="method-card"
                                        >
                                            <div style={methodIconStyle}><FaCreditCard /></div>
                                            <div style={{ textAlign: 'left' }}>
                                                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Credit / Debit Card</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Visa, Mastercard, RuPay</div>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => handleMethodSelect('upi')}
                                            style={methodButtonStyle}
                                            className="method-card"
                                        >
                                            <div style={{ ...methodIconStyle, background: 'rgba(34, 197, 94, 0.1)', color: '#16a34a' }}><FaMobileAlt /></div>
                                            <div style={{ textAlign: 'left' }}>
                                                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>UPI / Google Pay</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>GPay, PhonePe, Paytm, Any UPI ID</div>
                                            </div>
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 'card' && (
                                <motion.div
                                    key="card"
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    className="glass-panel"
                                    style={formPanelStyle}
                                >
                                    <div style={headerStyle}>
                                        <FaCreditCard size={24} color="var(--primary)" />
                                        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Card Details</h2>
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Enter any card details for demo payment</p>

                                    <form onSubmit={handleCardSubmit}>
                                        <div style={inputGroupStyle}>
                                            <label style={labelStyle}><FaUser size={12} /> CARDHOLDER NAME</label>
                                            <input
                                                type="text" name="name" placeholder="Cardholder Name"
                                                value={cardDetails.name} onChange={handleInputChange} required
                                                style={inputStyle}
                                            />
                                        </div>
                                        <div style={inputGroupStyle}>
                                            <label style={labelStyle}><FaCreditCard size={12} /> CARD NUMBER</label>
                                            <input
                                                type="text" name="number" placeholder="4242 4242 4242 4242"
                                                value={cardDetails.number} onChange={handleInputChange} required
                                                style={inputStyle}
                                            />
                                        </div>
<div
    style={{
        display: 'flex',
        flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
        gap: '1rem',
        marginBottom: '2rem'
    }}
>                                            <div style={{ flex: 1 }}>
                                                <label style={labelStyle}><FaCalendarAlt size={12} /> EXPIRY</label>
                                                <input type="text" name="expiry" placeholder="12/28" value={cardDetails.expiry} onChange={handleInputChange} required style={inputStyle} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label style={labelStyle}><FaLock size={12} /> CVV</label>
                                                <input type="text" name="cvv" placeholder="123" value={cardDetails.cvv} onChange={handleInputChange} required style={inputStyle} />
                                            </div>
                                        </div>
<div
    style={{
        display: 'flex',
        flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
        gap: '1rem'
    }}
>                                            <button type="button" onClick={() => setStep('selection')} style={{ ...payButtonStyle, flex: 0.5, background: 'rgba(0,0,0,0.05)', color: 'var(--text-main)', border: 'none' }}>BACK</button>
                                            <button type="submit" disabled={isProcessing} className="btn-primary" style={{ ...payButtonStyle, flex: 1 }}>
                                                {isProcessing ? <><FaSpinner className="spin" /> AUTHORIZING...</> : <>COMPLETE PAYMENT</>}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {step === 'upi' && (
                                <motion.div
                                    key="upi"
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    className="glass-panel"
                                    style={formPanelStyle}
                                >
                                    <div style={headerStyle}>
                                        <FaMobileAlt size={24} color="#16a34a" />
                                        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>UPI Payment</h2>
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Enter any UPI ID for demo payment</p>

                                    <form onSubmit={handleUpiSubmit}>
                                        <div style={inputGroupStyle}>
                                            <label style={labelStyle}>UPI ID (VPA)</label>
                                            <input
                                                type="text"
                                                placeholder="user@pay"
                                                value={upiId}
                                                onChange={(e) => setUpiId(e.target.value)}
                                                required
                                                style={{ ...inputStyle, fontSize: '1.2rem' }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                            <button type="button" onClick={() => setStep('selection')} style={{ ...payButtonStyle, flex: 0.5, background: 'rgba(0,0,0,0.05)', color: 'var(--text-main)', border: 'none' }}>BACK</button>
                                            <button type="submit" disabled={isProcessing} className="btn-primary" style={{ ...payButtonStyle, flex: 1, background: '#16a34a', borderColor: '#16a34a' }}>
                                                {isProcessing ? <><FaSpinner className="spin" /> AUTHORIZING...</> : <>COMPLETE PAYMENT</>}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {step === 'pin' && (
                                <motion.div
                                    key="pin"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: 20, opacity: 0 }}
                                    className="glass-panel"
                                    style={formPanelStyle}
                                >
                                    <div style={headerStyle}>
                                        <FaLock size={24} color="var(--primary)" />
                                        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Secure PIN</h2>
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Enter your security PIN to authorize the {method === 'upi' ? 'UPI' : 'Card'} transaction</p>

                                    <form onSubmit={handlePinSubmit}>
                                        <div style={inputGroupStyle}>
                                            <input
                                                type="password"
                                                value={pin}
                                                onChange={(e) => setPin(e.target.value.slice(0, 8))}
                                                placeholder="••••"
                                                autoFocus
                                                required
                                                style={{ ...inputStyle, textAlign: 'center', fontSize: '2.5rem', letterSpacing: '0.4em' }}
                                            />
                                        </div>
                                        <button type="submit" disabled={isProcessing} className="btn-primary" style={{ ...payButtonStyle, marginTop: '1rem' }}>
                                            {isProcessing ? <><FaSpinner className="spin" /> AUTHORIZING...</> : <>AUTHORIZE PAYMENT</>}
                                        </button>
                                        <button type="button" onClick={() => setStep(method === 'card' ? 'card' : 'upi')} style={{ ...payButtonStyle, background: 'transparent', color: 'var(--text-muted)', border: 'none', border: 'none', marginTop: '0.5rem', fontSize: '0.9rem' }}>BACK</button>
                                    </form>
                                </motion.div>
                            )}

                            {step === 'dispensing' && (
                                <motion.div
                                    key="dispensing"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="glass-panel"
                                    style={{ ...formPanelStyle, textAlign: 'center', padding: '4rem 2rem' }}
                                >
                                    <div style={{ position: 'relative', height: '350px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                        {/* Dispense Mechanism */}
                                        <div style={dispenseHeader}>
                                            <FaCheckCircle size={30} color="#22c55e" />
                                            <span style={{ fontWeight: 800 }}>PAYMENT VERIFIED</span>
                                        </div>

                                        <div style={vendingVisualArea}>
                                            <AnimatePresence>
                                                {cart.slice(0, 5).map((item, i) => (
                                                    <motion.div
                                                        key={`fall-${i}`}
                                                        initial={{ y: -100, opacity: 0, rotate: -45 }}
                                                        animate={{ y: 220, opacity: 1, rotate: 0 }}
                                                        transition={{ delay: 0.5 + (i * 0.4), type: 'spring', damping: 10, stiffness: 100 }}
                                                        style={fallingItemStyle}
                                                    >
                                                        {item.type === 'service' ? '📄' : '📦'}
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>

                                            <div style={vendingTray}>
                                                <div style={trayShadow} />
                                                <div style={trayInside} />
                                            </div>
                                        </div>
                                    </div>

                                    <h2 style={{ fontSize: '2rem', fontWeight: 950, marginBottom: '0.5rem', color: '#1e293b' }}>Dispensing Now...</h2>
                                    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 500 }}>The mechanical tray is releasing your items.</p>

                                    <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                                            <FaSpinner color="var(--primary)" />
                                        </motion.div>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b' }}>UPDATING STATION INVENTORY...</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary Card */}
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        style={summaryPanelStyle}
                    >
                        <div className="glass-panel" style={{ padding: '2rem', height: '100%' }}>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 800 }}>Order Summary</h3>
                            <div style={itemsListStyle}>
                                {cart.map((item, idx) => (
                                    <div key={idx} style={itemRowStyle}>
                                        <span style={{ fontSize: '0.9rem' }}>{item.qty}x {item.name}</span>
                                        <span style={{ fontWeight: 700 }}>₹{(item.price * item.qty).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={dividerStyle} />
                            <div style={totalRowStyle}>
                                <span>Total Payable</span>
                                <span style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>₹{total.toLocaleString()}</span>
                            </div>

                            <div style={{ ...badgeStyle, background: 'rgba(0,123,255,0.05)', color: 'var(--primary)', border: '1px solid rgba(0,123,255,0.1)' }}>
                                <FaShieldAlt />
                                <span>Secure Checkout Active</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
};

// New styles
const methodButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '1.5rem',
    borderRadius: '16px',
    border: '1px solid var(--glass-border)',
    background: 'rgba(0,0,0,0.02)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    width: '100%'
};
const methodIconStyle = {
    width: '50px',
    height: '50px',
    borderRadius: '12px',
    background: 'rgba(0,123,255,0.1)',
    color: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem'
};


// Styles
const containerStyle = {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem'
};
const gridStyle = {
    display: 'grid',
    gridTemplateColumns: window.innerWidth <= 768
        ? '1fr'
        : '1.2fr 1fr',
    gap: '1rem',
    width: '100%',
    maxWidth: '1000px'
};
const formPanelStyle = {
    padding: window.innerWidth <= 768 ? '1.25rem' : '3rem',
    position: 'relative',
    overflow: 'hidden'
};
const summaryPanelStyle = { display: 'flex', flexDirection: 'column' };
const headerStyle = { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.5rem' };
const inputGroupStyle = { marginBottom: '1.5rem' };
const labelStyle = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.05em' };
const inputStyle = { width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.02)', fontSize: '1rem', fontWeight: 600 };
const payButtonStyle = { width: '100%', padding: '1.2rem', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 800, justifyContent: 'center', gap: '10px' };
const footerNoteStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2rem', fontWeight: 700 };
const itemsListStyle = { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '2rem', maxHeight: '300px', overflowY: 'auto' };
const itemRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const dividerStyle = { height: '1px', background: 'var(--glass-border)', margin: '1.5rem 0' };
const totalRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontWeight: 800 };
const badgeStyle = { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.1)', color: '#16a34a', fontSize: '0.85rem', fontWeight: 700, marginTop: '2rem' };

// Dispense Animation Styles
const dispenseHeader = { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', background: 'rgba(34, 197, 94, 0.05)', padding: '8px 16px', borderRadius: '50px', color: '#16a34a', fontSize: '0.8rem' };
const vendingVisualArea = { position: 'relative', width: '280px', height: '240px', background: 'rgba(0,0,0,0.02)', borderRadius: '24px', border: '2px dashed rgba(0,0,0,0.05)', marginBottom: '2rem' };
const fallingItemStyle = { position: 'absolute', top: 0, left: '45%', fontSize: '3.5rem', zIndex: 2, filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' };
const vendingTray = { position: 'absolute', bottom: '20px', left: '20px', right: '20px', height: '60px', zIndex: 1 };
const trayShadow = { position: 'absolute', bottom: '-5px', left: '10%', right: '10%', height: '10px', background: 'rgba(0,0,0,0.1)', filter: 'blur(8px)', borderRadius: '50%' };
const trayInside = { width: '100%', height: '100%', background: '#334155', borderRadius: '12px 12px 4px 4px', border: '3px solid #1e293b', boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.3)' };

export default CheckoutPage;
