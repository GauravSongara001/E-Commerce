const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    paymentDate: {
        type: Date,
        default: new Date(),
    },
    paymentMethod: {
        type: String
    },
    paymentStatus: {
        type: String
    },
    products: [
        {
            productID: {
                type: mongoose.Types.ObjectId,
                ref: "Product",
            },
            quantity: {
                type: Number,
            },
            orderStatus: {
                type: String
            }
        }
    ],
}, {timestamps: true})

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;