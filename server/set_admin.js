const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const grantAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOneAndUpdate(
            { email: 'rkmadan.cs24@bmsce.ac.in' },
            { isAdmin: true },
            { new: true }
        );
        console.log('Admin rights granted to:', user ? user.email : 'No user found');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

grantAdmin();
