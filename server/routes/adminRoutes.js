const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');

// Dashboard Stats
router.get('/stats', protect, admin, async (req, res) => {
    try {
        const productCount = await Product.countDocuments();
        const orderCount = await Order.countDocuments();
        const userCount = await User.countDocuments();
        const totalSales = await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        res.json({
            productCount,
            orderCount,
            userCount,
            totalSales: totalSales[0] ? totalSales[0].total : 0
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all products (raw) for management
router.get('/products', protect, admin, async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create Product
router.post('/products', protect, admin, async (req, res) => {
    try {
        const { sku, name, description, price, image, category, stock } = req.body;
        const product = new Product({ sku, name, description, price, image, category, stock });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update Product
router.put('/products/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete Product
router.delete('/products/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product removed' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Increment Product Stock
router.put('/products/:id/stock', protect, admin, async (req, res) => {
    try {
        const { quantity } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        product.stock += Number(quantity);
        await product.save();
        res.json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all users
router.get('/users', protect, admin, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all orders
router.get('/orders', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('items.product', 'name price')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update order status
router.put('/orders/:id/status', protect, admin, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET Recent Activity
router.get('/activity', protect, admin, async (req, res) => {
    try {
        const recentOrders = await Order.find()
            .populate('user', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        const recentProducts = await Product.find()
            .sort({ updatedAt: -1 })
            .limit(5);

        const activity = [
            ...recentOrders.map(o => ({ type: 'order', text: `New order: ${o.user?.name || 'Guest'}`, date: o.createdAt, id: o._id })),
            ...recentProducts.map(p => ({ type: 'product', text: `Stock updated: ${p.name}`, date: p.updatedAt, id: p._id }))
        ].sort((a, b) => b.date - a.date);

        res.json(activity);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET Sales Trends
router.get('/trends', protect, admin, async (req, res) => {
    try {
        // In a real app, this would use aggregation to group by date
        // For now, providing some structure for the UI to consumption
        const trends = [
            { day: 'Mon', sales: 400 },
            { day: 'Tue', sales: 300 },
            { day: 'Wed', sales: 600 },
            { day: 'Thu', sales: 800 },
            { day: 'Fri', sales: 500 },
            { day: 'Sat', sales: 900 },
            { day: 'Sun', sales: 700 }
        ];
        res.json(trends);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
