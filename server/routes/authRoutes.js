const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        // Password hashing is typically done in the model pre-save middleware, 
        // but since the model provided is simple, we hash here.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        // Create Token
        const payload = { user: { id: user.id } };

        jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' }, (err, token) => {
            if (err) throw err;
            res.json({
                token,
                user: {
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin
                }
            });
        });

    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({ message: 'Server Error: ' + err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check User
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Return Token
        const payload = { user: { id: user.id } };

        jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' }, (err, token) => {
            if (err) throw err;
            res.json({
                token,
                user: {
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin
                }
            });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
