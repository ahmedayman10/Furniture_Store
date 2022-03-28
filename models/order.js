const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderItems:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
        required: true
    }],
    shippingAddress:{
        type: String
    },
    phone:{
        type: Number,
        required: true
    },
    status:{
        type: String,
        required: true,
        default: 'pending'
    },
    totalPrice:{
        type: Number
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dateOrdered:{
        type: Date,
        default:Date.now
    }
});


const Order = mongoose.model('Order',orderSchema);

module.exports.Order = Order;