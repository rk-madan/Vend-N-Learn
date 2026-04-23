import React, { useState } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { FaChevronDown, FaEnvelope, FaPhone } from 'react-icons/fa';

const HelpPage = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        { q: "How do I collect my printouts?", a: "Once you upload and pay, the printing starts immediately. Collect your papers from the output tray below the screen." },
        { q: "What happens if an item gets stuck?", a: "Our sensors detect jams. Alternatively, call our support number for an immediate refund." },
        { q: "Can I cancel an order?", a: "Orders cannot be cancelled once dispensing starts. Please check your selection carefully." },
        { q: "Do you accept UPI?", a: "Yes, we accept all UPI apps (GPay, PhonePe, Paytm) and Credit/Debit cards." },
        { q: "Is the paper quality good?", a: "We use premium A4 75GSM paper for all standard prints." }
    ];

    return (
        <Layout>
            <div className="container" style={{ padding: '3rem 1rem', maxWidth: '800px' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                        style={{ fontSize: '3rem', marginBottom: '1rem' }}
                    >
                        How can we help?
                    </motion.h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Frequently asked questions and support channels.</p>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem' }}>
                    {faqs.map((faq, i) => (
                        <div key={i} style={{ borderBottom: i === faqs.length - 1 ? 'none' : '1px solid #e2e8f0', padding: '1.5rem 0' }}>
                            <div
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: '600', fontSize: '1.1rem' }}
                            >
                                {faq.q}
                                <FaChevronDown style={{ transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }} color="var(--primary)" />
                            </div>
                            <motion.div
                                initial={false}
                                animate={{ height: openIndex === i ? 'auto' : 0, opacity: openIndex === i ? 1 : 0 }}
                                style={{ overflow: 'hidden', color: 'var(--text-muted)', lineHeight: '1.6' }}
                            >
                                <div style={{ paddingTop: '1rem' }}>{faq.a}</div>
                            </motion.div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ width: '50px', height: '50px', background: '#dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '1.5rem' }}>
                            <FaPhone />
                        </div>
                        <div>
                            <h3 style={{ margin: '0 0 0.2rem' }}>Call Support</h3>
                            <p style={{ margin: 0, color: 'var(--text-muted)' }}>+91 6361975215</p>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ width: '50px', height: '50px', background: '#fce7f3', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)', fontSize: '1.5rem' }}>
                            <FaEnvelope />
                        </div>
                        <div>
                            <h3 style={{ margin: '0 0 0.2rem' }}>Email Us</h3>
                            <p style={{ margin: 0, color: 'var(--text-muted)' }}>vendmachine@jusvend.com</p>
                        </div>
                    </div>
                </div>

            </div>
        </Layout>
    );
};

export default HelpPage;
