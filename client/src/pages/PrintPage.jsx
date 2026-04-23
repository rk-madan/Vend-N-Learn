import React, { useState } from 'react';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCloudUploadAlt, FaFilePdf, FaCheckCircle, FaPrint, FaFileWord, FaFileImage, FaCopy, FaPalette, FaExpand, FaCog, FaTimes } from 'react-icons/fa';

// --- Assets & Components ---

// 1. Realistic 3D Document Component
const RealisticDoc = ({ type, color, rotate, x, y, delay }) => (
    <motion.div
        initial={{ y: y + 100, opacity: 0, rotate: rotate, x: x }}
        animate={{
            y: [y, y - 20, y],
            rotate: [rotate, rotate + 5, rotate],
            opacity: 0.8
        }}
        transition={{
            duration: 6,
            delay: delay,
            repeat: Infinity,
            ease: "easeInOut"
        }}
        style={{
            position: 'absolute',
            width: '160px', height: '220px',
            background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
            borderRadius: '12px',
            boxShadow: '0 20px 50px -10px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)',
            zIndex: 0,
            overflow: 'hidden',
            perspective: '1000px',
            transformStyle: 'preserve-3d'
        }}
    >
        {/* Color Header */}
        <div style={{ height: '60px', background: `${color}15`, borderBottom: `4px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ background: color, color: 'white', padding: '4px 12px', borderRadius: '20px', fontWeight: 900, fontSize: '0.9rem', boxShadow: `0 4px 10px ${color}60` }}>
                {type}
            </span>
        </div>

        {/* Mock Lines */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', opacity: 0.6 }}>
            <div style={{ width: '100%', height: '8px', background: 'currentColor', borderRadius: '4px', color: '#cbd5e1' }} />
            <div style={{ width: '80%', height: '6px', background: '#e2e8f0', borderRadius: '4px' }} />
            <div style={{ width: '90%', height: '6px', background: '#e2e8f0', borderRadius: '4px' }} />
            {type === 'IMG' && (
                <div style={{ width: '100%', height: '60px', background: '#f1f5f9', borderRadius: '8px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaFileImage size={24} color="#cbd5e1" />
                </div>
            )}
        </div>

        {/* Folded Corner */}
        <div style={{
            position: 'absolute', top: 0, right: 0,
            borderWidth: '0 20px 20px 0',
            borderStyle: 'solid',
            borderColor: '#f8fafc #fff #fff #cbd5e140',
            boxShadow: '-2px 2px 5px rgba(0,0,0,0.05)'
        }} />
    </motion.div>
);

// 2. Animated Printer
const GraphicalPrinter = () => (
    <motion.div
        initial={{ opacity: 0, x: 200 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{ position: 'absolute', right: '5%', top: '20%', pointerEvents: 'none', zIndex: 0, opacity: 0.8 }}
    >
        <div style={{ width: '200px', height: '120px', background: 'white', borderRadius: '20px 20px 4px 4px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', position: 'relative', border: '1px solid white' }}>
            {/* Paper Feeding */}
            <motion.div
                animate={{ y: [-20, 100], opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', left: '50%', marginLeft: '-40px', width: '80px', height: '100px', background: 'white', border: '1px solid #e2e8f0', zIndex: -1, top: '20px' }}
            />
            {/* Status Light */}
            <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 0.8, repeat: Infinity }} style={{ position: 'absolute', right: '20px', top: '20px', width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 10px #22c55e' }} />
        </div>
    </motion.div>
);

const PrintPage = () => {
    const [file, setFile] = useState(null);
    const [options, setOptions] = useState({
        color: 'Color', // Default to Color to match vibrant theme
        size: 'A4',
        copies: 1,
        sides: 'Single'
    });
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            setUploadSuccess(false);
        }
    };

    const clearFile = (e) => {
        e.stopPropagation();
        setFile(null);
        setUploadSuccess(false);
    };

    const calculateTotal = () => {
        let basePrice = options.color === 'BW' ? 2 : 5;
        if (options.sides === 'Double') basePrice *= 1.8;
        return Math.ceil(basePrice * options.copies);
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        // Simulate upload
        setTimeout(() => {
            setUploading(false);
            setUploadSuccess(true);
        }, 1500);
    };

    return (
        <Layout>
            <div style={{ position: 'relative', minHeight: '92vh', overflow: 'hidden', background: '#0f172a', fontFamily: "'Outfit', sans-serif" }}>

                {/* --- VIBRANT MESH BACKGROUND --- */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                    <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '70%', height: '70%', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.4), transparent 60%)', filter: 'blur(80px)', animation: 'float 20s infinite alternate' }} />
                    <div style={{ position: 'absolute', top: '20%', right: '-10%', width: '60%', height: '80%', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4), transparent 60%)', filter: 'blur(90px)', animation: 'float 25s infinite alternate-reverse' }} />
                    <div style={{ position: 'absolute', bottom: '-20%', left: '30%', width: '50%', height: '60%', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent 60%)', filter: 'blur(100px)', animation: 'float 15s infinite alternate' }} />
                </div>

                {/* --- 3D FLOATING ELEMENTS --- */}
                <RealisticDoc type="PDF" color="#ef4444" rotate={-15} x="10%" y="15%" delay={0} />
                <RealisticDoc type="DOC" color="#2563eb" rotate={10} x="85%" y="20%" delay={2} />
                <RealisticDoc type="IMG" color="#16a34a" rotate={-5} x="15%" y="65%" delay={4} />
                <GraphicalPrinter />

                <div className="container" style={{ position: 'relative', zIndex: 10, padding: '4rem 1rem', maxWidth: '1100px' }}>

                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <motion.span
                            initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                            style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '30px', color: '#fed7aa', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.2)' }}
                        >
                            🚀 Instant Cloud Printing
                        </motion.span>
                        <motion.h1
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            style={{ fontSize: '4rem', fontWeight: 800, color: 'white', lineHeight: 1.1, marginBottom: '1.5rem', textShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                        >
                            Bring your <span style={{ color: '#60a5fa' }}>ideas</span> to paper.
                        </motion.h1>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                            style={{ fontSize: '1.2rem', color: '#cbd5e1', maxWidth: '600px', margin: '0 auto' }}
                        >
                            Premium quality printing for your assignments, documents, and photos. Upload, configure, and collect.
                        </motion.p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1.2fr) minmax(320px, 0.8fr)', gap: '2rem', alignItems: 'start' }}>

                        {/* --- UPLOAD CARD with TILT & GLOW --- */}
                        <motion.div
                            initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                            style={{
                                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(59, 130, 246, 0.15))',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '32px',
                                border: '1px solid rgba(147, 197, 253, 0.15)',
                                padding: '12px',
                                boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.15), inset 0 0 30px rgba(59, 130, 246, 0.05)'
                            }}
                        >
                            <div
                                onClick={() => !file && document.getElementById('file-upload').click()}
                                style={{
                                    border: '2px dashed', borderColor: file ? '#4ade80' : 'rgba(148, 163, 184, 0.3)',
                                    borderRadius: '24px',
                                    minHeight: '450px',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    background: file ? 'rgba(74, 222, 128, 0.05)' : 'rgba(30, 41, 59, 0.4)',
                                    cursor: file ? 'default' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                className="upload-zone"
                            >
                                {/* Grid Pattern Texture */}
                                <div style={{
                                    position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.05,
                                    backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                                    backgroundSize: '20px 20px'
                                }} />

                                <input type="file" id="file-upload" style={{ display: 'none' }} onChange={handleFileChange} accept=".pdf,.doc,.docx,.jpg,.png" />

                                <AnimatePresence mode="wait">
                                    {file ? (
                                        <motion.div
                                            key="file-loaded"
                                            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                            style={{ textAlign: 'center', width: '100%', position: 'relative', zIndex: 1 }}
                                        >
                                            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 1.5rem' }}>
                                                <div style={{ position: 'absolute', inset: 0, background: '#4ade80', borderRadius: '50%', filter: 'blur(20px)', opacity: 0.2 }} />
                                                <div style={{ position: 'relative', width: '100%', height: '100%', background: '#1e293b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #4ade80' }}>
                                                    <FaCheckCircle size={50} color="#4ade80" />
                                                </div>
                                            </div>

                                            <h3 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '0.5rem' }}>{file.name}</h3>
                                            <p style={{ color: '#4ade80', fontWeight: 600 }}>Ready to Print</p>
                                            <button onClick={clearFile} style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', margin: '2rem auto 0' }}><FaTimes /> Change File</button>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="empty" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>

                                            {/* Gradient Icon from Reference */}
                                            <div style={{
                                                width: '100px', height: '100px',
                                                background: 'linear-gradient(180deg, #3b82f6 0%, #8b5cf6 100%)',
                                                borderRadius: '28px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                margin: '0 auto 2rem',
                                                boxShadow: '0 20px 40px -10px rgba(59, 130, 246, 0.5), inset 0 2px 4px rgba(255,255,255,0.2)'
                                            }}>
                                                <FaCloudUploadAlt size={48} color="white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} />
                                            </div>

                                            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: '0.8rem', letterSpacing: '-0.02em' }}>Upload File</h3>
                                            <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '2.5rem', fontWeight: 500 }}>PDF, DOCX, or Images</p>

                                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                                <div style={tagStyle}><FaFilePdf /> PDF</div>
                                                <div style={tagStyle}><FaFileWord /> Word</div>
                                                <div style={tagStyle}><FaFileImage /> Img</div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>

                        {/* --- CONTROLS PANEL --- */}
                        <motion.div
                            initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                            style={{ background: 'white', padding: '2.5rem', borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)' }}
                        >
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ width: '36px', height: '36px', background: '#eff6ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}><FaCog /></span> Create Order
                            </h3>

                            {/* Color Selection */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={controlLabel}>Color Mode</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <ColorOption
                                        active={options.color === 'BW'} onClick={() => setOptions({ ...options, color: 'BW' })}
                                        label="B&W" price="₹2" color="#1e293b"
                                    />
                                    <ColorOption
                                        active={options.color === 'Color'} onClick={() => setOptions({ ...options, color: 'Color' })}
                                        label="Color" price="₹5"
                                        gradient="linear-gradient(135deg, #f472b6, #a855f7)"
                                    />
                                </div>
                            </div>

                            {/* Grid Options */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                                <div>
                                    <label style={controlLabel}>Paper</label>
                                    <select
                                        value={options.size} onChange={(e) => setOptions({ ...options, size: e.target.value })}
                                        className="modern-select"
                                    >
                                        <option value="A4">A4 (Std)</option>
                                        <option value="A3">A3 (Lrg)</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={controlLabel}>Sides</label>
                                    <select
                                        value={options.sides} onChange={(e) => setOptions({ ...options, sides: e.target.value })}
                                        className="modern-select"
                                    >
                                        <option value="Single">Single</option>
                                        <option value="Double">Double</option>
                                    </select>
                                </div>
                            </div>

                            {/* Copies Counter */}
                            <div style={{ marginBottom: '2.5rem' }}>
                                <label style={controlLabel}>Copies</label>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '8px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                    <button onClick={() => setOptions({ ...options, copies: Math.max(1, options.copies - 1) })} style={roundBtn}>-</button>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>{options.copies}</span>
                                    <button onClick={() => setOptions({ ...options, copies: options.copies + 1 })} style={roundBtn}>+</button>
                                </div>
                            </div>

                            {/* Total & Action */}
                            <div style={{ borderTop: '2px solid #f1f5f9', paddingTop: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                                    <span style={{ color: '#64748b', fontWeight: 600 }}>Total Cost</span>
                                    <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>₹{calculateTotal()}</span>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                    disabled={!file || uploading || uploadSuccess}
                                    onClick={handleUpload}
                                    style={{
                                        width: '100%', padding: '1.2rem', borderRadius: '16px',
                                        background: uploadSuccess ? '#22c55e' : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                        color: 'white', border: 'none', fontSize: '1.1rem', fontWeight: 700,
                                        cursor: (!file || uploading || uploadSuccess) ? 'not-allowed' : 'pointer',
                                        opacity: (!file || uploading || uploadSuccess) ? 0.6 : 1,
                                        boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.4)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                                    }}
                                >
                                    {uploading ? 'Processing...' : uploadSuccess ? <>Prepared <FaCheckCircle /></> : <>Print Now <FaPrint /></>}
                                </motion.button>
                            </div>

                        </motion.div>
                    </div>

                </div>

                <style>{`
                    @keyframes float {
                        0% { transform: translate(0, 0); }
                        100% { transform: translate(20px, 40px); }
                    }
                    .modern-select {
                        width: 100%; padding: 12px; border-radius: 12px;
                        border: 1px solid #e2e8f0; background: #f8fafc;
                        font-family: inherit; font-weight: 600; color: #334155;
                        outline: none; cursor: pointer;
                    }
                    .modern-select:focus { border-color: #3b82f6; background: white; }
                    .upload-zone:hover { border-color: #60a5fa !important; background-color: rgba(30, 41, 59, 0.6) !important; }
                `}</style>
            </div>
        </Layout>
    );
};

const ColorOption = ({ active, onClick, label, price, color, gradient }) => (
    <div
        onClick={onClick}
        style={{
            padding: '12px', borderRadius: '12px', cursor: 'pointer',
            border: active ? '2px solid #3b82f6' : '1px solid #e2e8f0',
            background: active ? '#eff6ff' : 'white',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
            transition: 'all 0.2s'
        }}
    >
        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: gradient || color, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }} />
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: active ? '#1e293b' : '#64748b' }}>{label}</span>
        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{price}/pg</span>
    </div>
);

const controlLabel = { display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' };
const tagStyle = { background: 'rgba(255,255,255,0.08)', padding: '8px 16px', borderRadius: '12px', color: '#e2e8f0', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(255,255,255,0.1)' };
const roundBtn = { width: '40px', height: '40px', borderRadius: '12px', background: 'white', border: 'none', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', cursor: 'pointer', fontSize: '1.2rem', color: '#3b82f6', fontWeight: 700 };

export default PrintPage;
