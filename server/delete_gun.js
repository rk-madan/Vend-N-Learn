const mongoose = require('mongoose');
const Product = require('./models/Product');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        try {
            const res = await Product.deleteMany({ name: { $regex: 'gun', $options: 'i' } });
            console.log(`Deleted ${res.deletedCount} items containing 'gun'`);
        } catch (err) {
            console.error(err);
        } finally {
            mongoose.disconnect();
            process.exit(0);
        }
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
