const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String, required: true }, // URL or path from old frontend
    category: { type: String },
    stock: { type: Number, default: 5 }, // Default 5 as requested
}, { timestamps: true });

// Virtual for checking availability
productSchema.virtual('isStockAvailable').get(function () {
    return this.stock > 0;
});

module.exports = mongoose.model('Product', productSchema);
