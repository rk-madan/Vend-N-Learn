const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product'); // Ensure Product model is registered
const { protect } = require('../middleware/authMiddleware');

// Toggle Wishlist Item
router.put('/wishlist/:productId', protect, async (req, res) => {
    try {
        const { productId } = req.params;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isWishlisted = user.wishlist.some(id => id.toString() === productId);

        if (isWishlisted) {
            // Remove
            user.wishlist.pull(productId);
        } else {
            // Add
            user.wishlist.push(productId);
        }

        await user.save();

        console.log(`Wishlist updated for user ${user._id}. Count: ${user.wishlist.length}`);
        // Return raw wishlist (array of IDs) for simpler frontend handling
        res.json(user.wishlist);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating wishlist' });
    }
});

// Get Wishlist
router.get('/wishlist', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('wishlist');
        res.json(user.wishlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching wishlist' });
    }
});

module.exports = router;
