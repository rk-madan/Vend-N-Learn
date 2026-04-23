const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
// DB Connection
// DB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jusvend_mern')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const printRoutes = require('./routes/printRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Add Admin Routes

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/print', printRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes); // Use Admin Routes

// Temp Seed Route
app.get('/api/seed', async (req, res) => {
    try {
        const Product = require('./models/Product');
        const products = [
            { sku: "pen-blue", name: "Hauser XO - Blue", price: 10, description: "0.7mm Smooth Writing", image: "/images/pen.png", category: "Writing", stock: 5 },
            { sku: "pen-black", name: "Hauser XO - Black", price: 10, description: "0.7mm Smooth Writing", image: "/images/blackpen.png", category: "Writing", stock: 5 },
            { sku: "gel-pen", name: "Octane Gel Pen", price: 10, description: "Smooth waterproof gel ink", image: "/images/gelpen.png", category: "Writing", stock: 5 },
            { sku: "pencil-hb", name: "Apsara Platinum", price: 5, description: "Extra Dark Pencil", image: "/images/pencil.png", category: "Writing", stock: 5 },
            { sku: "pencil-pack7", name: "Drawing Pencils", price: 44, description: "Pack of 7 Art Pencils", image: "/images/drawingpencils.png", category: "Arts", stock: 5 },
            { sku: "eraser-small", name: "Apsara Eraser", price: 5, description: "Dust-free non-toxic", image: "/images/eraser.png", category: "Stationery", stock: 5 },
            { sku: "sharpener", name: "Apsara Sharpener", price: 5, description: "Long point sharpener", image: "/images/sharpener.png", category: "Stationery", stock: 5 },
            { sku: "notebook-180", name: "Classmate 6-subject Notebook", price: 185, description: "300 pages (single lined), Spiral", image: "/images/6_Subject.png", category: "Notebooks", stock: 5 },
            { sku: "notebook-long-172", name: "Classmate Long Book", price: 75, description: "172 pages, Soft Cover", image: "/images/172_Page.png", category: "Notebooks", stock: 5 },
            { sku: "notebook-long-72", name: "Classmate Long Book", price: 40, description: "72 pages, Soft Cover", image: "/images/72_Page.png", category: "Notebooks", stock: 5 },
            { sku: "correction-pen", name: "Faber Castell Whitener", price: 15, description: "Correction Pen, Quick dry", image: "/images/correction_pen.png", category: "Stationery", stock: 5 },
            { sku: "scale-15", name: "15cm Scale", price: 10, description: "15cm Plastic Rule", image: "/images/15_Scale.png", category: "Geometry", stock: 5 },
            { sku: "scale-30", name: "30cm Scale", price: 20, description: "30cm Plastic Rule", image: "/images/30_Scale.png", category: "Geometry", stock: 5 },
            { sku: "glue", name: "Fevi Stick", price: 25, description: "5gm Glue Stick, Non-messy", image: "/images/Fevi_Stick.png", category: "Adhesives", stock: 5 },
            { sku: "square-set", name: "Square Sets", price: 180, description: "Pack of 2 (8 x 10) Set Squares", image: "/images/Square_Set.png", category: "Geometry", stock: 5 },
            { sku: "calculator", name: "Scientific Calculator", price: 1600, description: "Casio FX-991CW Classwiz", image: "/images/calculator.png", category: "Electronics", stock: 5 },
            { sku: "stapler-small", name: "Stapler", price: 130, description: "Kangaro HD 10D, Durable", image: "/images/Stapler.png", category: "Office", stock: 5 },
            { sku: "staple-pins", name: "Staple Pins", price: 40, description: "Kangaro 23/8-H Pins", image: "/images/Stapler_Pins.png", category: "Office", stock: 5 },
            { sku: "sticky-notes", name: "Sticky Notes", price: 170, description: "Pocket Size Spiral Pad, Multi-color", image: "/images/Sticky_Notes.png", category: "Office", stock: 5 },
            { sku: "whiteboard-marker", name: "Whiteboard Marker", price: 25, description: "Cello Black Marker, Refillable", image: "/images/Whiteboard_Marker.png", category: "Office", stock: 5 }
        ];

        await Product.deleteMany({});
        await Product.insertMany(products);
        res.send('Seeding Successful');
    } catch (err) {
        console.error(err);
        res.status(500).send('Seeding Failed: ' + err.message);
    }
});

// Emergency Admin Route
app.get('/api/emergency-admin', async (req, res) => {
    try {
        const User = require('./models/User');
        // Make ALL users admins for now (since it's a dev/demo env)
        // or just the latest one
        const result = await User.updateMany({}, { isAdmin: true });
        res.send(`Success: Updated ${result.modifiedCount} users to Admin. You can now access the dashboard.`);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
