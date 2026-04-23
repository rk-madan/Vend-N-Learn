const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Optional for print jobs
        name: { type: String }, // Store name snapshot
        quantity: { type: Number },
        price: { type: Number },
        type: { type: String, enum: ['product', 'print'], default: 'product' },
        printDetails: { // Only for print jobs
            fileName: String,
            pages: Number,
            color: String, // 'BW' or 'Color'
            copies: Number
        }
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'Processing' },
    paymentStatus: { type: String, default: 'Pending' },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    paymentMethod: { type: String, default: 'Credit Card' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
