// models/Customer.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the user
        ref: 'User', // This refers to the User model
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
