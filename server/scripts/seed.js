const mongoose = require('mongoose');
const Product = require('../models/Product');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: '../.env' });

if (!process.env.MONGO_URI) {
    process.env.MONGO_URI = "mongodb+srv://JusVend:JusVend123@jusvend.xqwokj0.mongodb.net/jusvend_mern?retryWrites=true&w=majority&appName=JusVend";
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

const products = [
    { sku: "pen-blue", name: "Hauser XO - Blue Pen", description: "0.7mm", price: 10, image: "/images/pen.png", stock: 20 },
    { sku: "pen-black", name: "Hauser XO - Black Pen", description: "0.7mm", price: 10, image: "/images/blackpen.png", stock: 20 },
    { sku: "gel-pen", name: "Octane Gel Pen", description: "Smooth writing", price: 10, image: "/images/gelpen.png", stock: 20 },
    { sku: "pencil-hb", name: "Apsara Platinum Pencil", description: "Pack of 1", price: 5, image: "/images/pencil.png", stock: 15 },
    { sku: "pencil-pack7", name: "Drawing Pencils", description: "Pack of 7", price: 44, image: "/images/drawingpencils.png", stock: 10 },
    { sku: "eraser-small", name: "Apsara Eraser", description: "Dust-free", price: 5, image: "/images/eraser.png", stock: 25 },
    { sku: "sharpener", name: "Apsara Sharpener", description: "Single blade", price: 5, image: "/images/sharpener.png", stock: 20 },
    { sku: "notebook-180", name: "Classmate 6-subject Notebook", description: "300 pages", price: 185, image: "/images/6_Subject.png", stock: 15 },
    { sku: "notebook-long", name: "Classmate Long Book", description: "172 pages", price: 75, image: "/images/172_Page.png", stock: 15 },
    { sku: "notebook-short", name: "Classmate Long Book", description: "72 pages", price: 40, image: "/images/72_Page.png", stock: 15 },
    { sku: "correction-pen", name: "Whitener", description: "Correction pen", price: 15, image: "/images/correction_pen.png", stock: 15 },
    { sku: "scale-15", name: "15cm Scale", description: "Faber-Castell", price: 10, image: "/images/15_Scale.png", stock: 25 },
    { sku: "scale-30", name: "30cm Scale", description: "Faber-Castell", price: 20, image: "/images/30_Scale.png", stock: 25 },
    { sku: "glue", name: "Fevi Stick", description: "5gm", price: 25, image: "/images/Fevi_Stick.png", stock: 15 },
    { sku: "square-set", name: "Square Set", description: "Pack of 2", price: 180, image: "/images/Square_Set.png", stock: 10 },
    { sku: "calculator", name: "Scientific Calculator", description: "Casio FX-991CW", price: 1600, image: "/images/Calculator.png", stock: 10 },
    { sku: "stapler", name: "Stapler", description: "Kangaro HD 10D", price: 130, image: "/images/stapler.png", stock: 10 },
    { sku: "staple-pins", name: "Staple Pins", description: "23/8-H", price: 40, image: "/images/Stapler_Pins.png", stock: 15 },
    { sku: "sticky-notes", name: "Sticky Notes", description: "Pocket size", price: 170, image: "/images/Sticky_Notes.png", stock: 10 },
    { sku: "whiteboard-marker", name: "Whiteboard Marker", description: "Cello Black", price: 25, image: "/images/Whiteboard_Marker.png", stock: 20 }
];

const seedDB = async () => {
    try {
        await Product.deleteMany({});
        console.log('Cleared existing products');

        await Product.insertMany(products);
        console.log('Seeded products successfully');

        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
