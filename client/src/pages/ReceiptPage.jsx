import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { FaPrint, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ReceiptPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const order = state?.order;

    if (!order) {
        return (
            <Layout>
                <div className="container" style={{ textAlign: 'center', padding: '10rem 0' }}>
                    <div style={{ fontSize: '5rem', marginBottom: '2rem' }}>📄</div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Electronic Receipt Not Found</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>It seems this link has expired or the order record is missing.</p>
                    <button onClick={() => navigate('/shop')} className="btn-primary" style={{ padding: '1rem 2rem', borderRadius: '12px' }}>
                        Browse Gallery
                    </button>
                </div>
            </Layout>
        );
    }

    const handlePrint = () => {
        window.print();
    };

    return (
        <Layout>
            <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '4rem 1rem' }}>
                <div className="container" style={{ maxWidth: '850px' }}>

                    {/* Status Banner */}
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        style={statusBannerStyle}
                        className="no-print"
                    >
                        <FaCheckCircle size={20} />
                        <span>Payment Confirmed & Digital Bill Generated</span>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        style={invoiceCardStyle}
                        className="glass-panel"
                    >
                        {/* Receipt Header */}
                        <div style={invoiceHeaderStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={logoBoxStyle}>JV</div>
                                <div>
                                    <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.02em' }}>JusVend Stationers</h1>
                                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Official Digital Invoice</p>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={statusLabelStyle}>PAID</div>
                                <p style={{ margin: '8px 0 0', fontWeight: 800, color: 'var(--text-main)' }}>INV#{order._id.slice(-12).toUpperCase()}</p>
                            </div>
                        </div>

                        {/* Metadata Grid */}
                        <div style={metadataGridStyle}>
                            <div>
                                <h4 style={metaLabelStyle}>CUSTOMER NAME/EMAIL</h4>
                                <p style={metaValueStyle}>{state?.userEmail || 'Valued Customer'}</p>
                            </div>
                            <div>
                                <h4 style={metaLabelStyle}>INVOICE DATE</h4>
                                <p style={metaValueStyle}>{new Date(state?.paymentDate || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                            <div>
                                <h4 style={metaLabelStyle}>PAYMENT SOURCE</h4>
                                <p style={metaValueStyle}>{order.paymentMethod === 'UPI' ? 'Authenticated UPI' : 'Verified Card Payment'}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <h4 style={metaLabelStyle}>TRANSACTION ID</h4>
                                <p style={{ ...metaValueStyle, color: 'var(--primary)' }}>TXN-{order._id.slice(-6).toUpperCase()}</p>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div style={{ marginBottom: '3rem' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={tableHeaderRowStyle}>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>DESCRIPTION</th>
                                        <th style={{ padding: '1rem', textAlign: 'center' }}>QTY</th>
                                        <th style={{ padding: '1rem', textAlign: 'right' }}>UNIT PRICE</th>
                                        <th style={{ padding: '1rem', textAlign: 'right' }}>TOTAL (₹)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item, index) => (
                                        <tr key={index} style={tableRowStyle}>
                                            <td style={{ padding: '1.2rem 1rem' }}>
                                                <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{item.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>CODE: JV-{item._id?.slice(-4).toUpperCase() || 'PROD'}</div>
                                            </td>
                                            <td style={{ padding: '1.2rem 1rem', textAlign: 'center', fontWeight: 600 }}>{item.quantity}</td>
                                            <td style={{ padding: '1.2rem 1rem', textAlign: 'right', color: 'var(--text-muted)' }}>₹{item.price.toLocaleString()}</td>
                                            <td style={{ padding: '1.2rem 1rem', textAlign: 'right', fontWeight: 800 }}>₹{(item.price * item.quantity).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals Summary */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div style={{ width: '100%', maxWidth: '300px' }}>
                                <div style={subtotalRowStyle}>
                                    <span>SUBTOTAL BTC</span>
                                    <span>₹{(order.totalAmount - Math.round(order.totalAmount * 0.05)).toLocaleString()}</span>
                                </div>
                                <div style={subtotalRowStyle}>
                                    <span>GST (Taxes 5%)</span>
                                    <span>₹{Math.round(order.totalAmount * 0.05).toLocaleString()}</span>
                                </div>
                                <div style={{ height: '1px', background: '#e2e8f0', margin: '1rem 0' }}></div>
                                <div style={totalDisplayRowStyle}>
                                    <span>NET TOTAL</span>
                                    <span>₹{order.totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Signature/Watermark */}
                        <div style={watermarkStyle}>
                            THIS IS A COMPUTER GENERATED BILL - VALID WITHOUT SIGNATURE
                        </div>
                    </motion.div>

                    {/* Actions */}
                    <div className="no-print" style={actionContainerStyle}>
                        <button onClick={() => navigate('/shop')} style={backButtonStyle}>
                            <FaArrowLeft /> Back to Shop
                        </button>
                        <button onClick={handlePrint} className="btn-primary" style={printButtonStyle}>
                            <FaPrint /> Download Bill as PDF
                        </button>
                    </div>

                    <style>{`
                        @media print {
                            .no-print, nav, footer, .announcement-bar { display: none !important; }
                            body { background: white !important; margin: 0; padding: 0; }
                            .glass-panel { box-shadow: none !important; border: 1px solid #e2e8f0 !important; background: white !important; }
                            .container { padding: 0 !important; max-width: 100% !important; margin: 0 !important; }
                            @page { margin: 1cm; }
                        }
                    `}</style>
                </div>
            </div>
        </Layout>
    );
};

// Invoice Styles
const invoiceCardStyle = { background: 'white', padding: '4rem', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.05)', position: 'relative', overflow: 'hidden' };
const invoiceHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4rem' };
const logoBoxStyle = { width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--secondary), var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '1.5rem', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' };
const statusLabelStyle = { padding: '5px 15px', borderRadius: '20px', background: 'rgba(22, 163, 74, 0.1)', color: '#16a34a', fontWeight: 900, fontSize: '0.8rem', letterSpacing: '0.1em', display: 'inline-block' };
const metadataGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', padding: '2rem', background: '#f8fafc', borderRadius: '16px', marginBottom: '3.5rem' };
const metaLabelStyle = { margin: '0 0 6px', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.05em' };
const metaValueStyle = { margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' };
const tableHeaderRowStyle = { borderBottom: '2px solid #f1f5f9', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.05em' };
const tableRowStyle = { borderBottom: '1px solid #f8fafc' };
const subtotalRowStyle = { display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.8rem' };
const totalDisplayRowStyle = { display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary)' };
const watermarkStyle = { textAlign: 'center', marginTop: '5rem', fontSize: '0.7rem', color: '#cbd5e1', fontWeight: 700, letterSpacing: '0.1em' };
const statusBannerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px', background: '#dcfce7', color: '#166534', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.5rem' };
const actionContainerStyle = { display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '3rem' };
const backButtonStyle = { background: 'white', border: '1px solid #e2e8f0', padding: '1rem 2rem', borderRadius: '14px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' };
const printButtonStyle = { display: 'flex', alignItems: 'center', gap: '10px', padding: '1rem 2.5rem', borderRadius: '14px', fontSize: '1rem' };

export default ReceiptPage;
