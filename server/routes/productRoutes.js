const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Review = require('../models/Review');
const { protect } = require('../middleware/authMiddleware');

// @route GET /api/products
// @desc Get all products with filtering
router.get('/', async (req, res) => {
    try {
        const { keyword, category, minPrice, maxPrice } = req.query;
        let query = {};

        if (keyword) {
            query.name = { $regex: keyword, $options: 'i' };
        }
        if (category) {
            query.category = category;
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const products = await Product.find(query);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const reviews = await Review.find({ product: req.params.id }).sort({ createdAt: -1 });
        res.json({ ...product._doc, reviews });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route POST /api/products/:id/reviews
// @desc Create a new review
router.post('/:id/reviews', protect, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const alreadyReviewed = await Review.findOne({ user: req.user.id, product: req.params.id });
        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Product already reviewed' });
        }

        const review = new Review({
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user.id,
            product: req.params.id,
            userName: req.user.name // Use name from token (added to req.user by protect middleware)
        });

        await review.save();
        const reviews = await Review.find({ product: req.params.id });

        const avg =
            reviews.reduce((sum, item) => sum + item.rating, 0) /
            reviews.length;

        product.averageRating = avg;
        product.numReviews = reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
