const mongoose = require('mongoose');
const uri = "mongodb+srv://JusVend:JusVend123@jusvend.xqwokj0.mongodb.net/jusvend_mern?retryWrites=true&w=majority&appName=JusVend";

console.log('Attempting to connect...');
mongoose.connect(uri)
    .then(() => {
        console.log('SUCCESS: Connected to MongoDB!');
        process.exit(0);
    })
    .catch(err => {
        console.error('FAILURE: Could not connect:', err.message);
        process.exit(1);
    });
