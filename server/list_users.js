const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({}, 'email name');
        console.log('Registered Users:', users);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

listUsers();
