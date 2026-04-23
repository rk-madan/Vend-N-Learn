const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        const adminEmail = 'rkmadan.cs24@bmsce.ac.in';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        const adminUser = {
            name: 'RK Madan Admin',
            email: adminEmail,
            password: hashedPassword,
            isAdmin: true
        };

        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            await User.updateOne({ email: adminEmail }, adminUser);
            console.log('Admin user updated successfully');
        } else {
            const newUser = new User(adminUser);
            await newUser.save();
            console.log('Admin user created successfully');
        }

        process.exit();
    } catch (err) {
        console.error('Error seeding admin:', err);
        process.exit(1);
    }
};

seedAdmin();
