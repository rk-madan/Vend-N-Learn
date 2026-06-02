const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String },
    stock: { type: Number, default: 5 },

    averageRating: {
        type: Number,
        default: 0
    },

    numReviews: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

productSchema.virtual('isStockAvailable').get(function () {
    return this.stock > 0;
});

module.exports = mongoose.model('Product', productSchema);