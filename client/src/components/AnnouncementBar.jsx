import React from 'react';
import { motion } from 'framer-motion';

const AnnouncementBar = () => {
    const announcementText = "✨ Wishing you a Prosperous & Happy New Year 2026 from JusVend! ✨ | 🎁 Special New Year Offer: 5% OFF on all items! | 🚀 Experience the future of stationery dispensing 🚀";

    return (
        <div style={{
            background: 'linear-gradient(90deg, #1d1d1f, #334155, #1d1d1f)',
            color: '#f5f5f7',
            padding: '12px 0',
            fontSize: '14px',
            position: 'sticky',
            top: 0,
            zIndex: 2000,
            fontWeight: 600,
            overflow: 'hidden',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}>
            <motion.div
                animate={{
                    x: [1000, -2000],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
                style={{
                    whiteSpace: 'nowrap',
                    display: 'inline-block',
                    paddingLeft: '100%',
                }}
            >
                {announcementText}
            </motion.div>
        </div>
    );
};

export default AnnouncementBar;
