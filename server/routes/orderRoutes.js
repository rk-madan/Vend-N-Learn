const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');

// Create Order (Checkout) - Protected Route
router.post('/', protect, async (req, res) => {
    try {
        const { items, totalAmount, paymentMethod } = req.body;

        const userId = req.user.id;

        // Check stock and deduct
        for (const item of items) {
            if (item.type === 'product' || !item.type) {
                if (item.product) {
                    const product = await Product.findById(item.product);
                    if (product) {
                        if (product.stock < item.qty) {
                            return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
                        }
                        product.stock -= item.qty;
                        await product.save();
                    }
                }
            }
        }

        const orderItems = items.map(i => ({
            product: i.product,
            name: i.name,
            quantity: i.qty,
            price: i.price,
            type: i.type || 'product',
            printDetails: i.printDetails || null
        }));

        const newOrder = new Order({
            user: userId,
            items: orderItems,
            totalAmount,
            paymentStatus: 'Pending',
            paymentMethod: paymentMethod || 'Credit Card'
        });

        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Order Error:', error);
        res.status(500).json({ message: 'Server error creating order: ' + error.message });
    }
});

// Mark Order as Paid - Protected Route
router.put('/:id/pay', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        // Check if user owns the order
        if (order.user.toString() !== req.user.id) {
            console.warn(`Payment Auth Failure: OrderUser(${order.user}) !== ReqUser(${req.user.id})`);
            return res.status(401).json({ message: 'Operation Unauthorized' });
        }

        order.paymentStatus = 'Paid';
        order.isPaid = true;
        order.paidAt = Date.now();
        order.status = 'Completed';
        await order.save();

        res.json(order);
    } catch (error) {
        console.error('Payment Update Error:', error);
        res.status(500).json({ message: 'Server error updating payment' });
    }
});

// Get User Orders - Protected Route
router.get('/', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching orders' });
    }
});

module.exports = router;
