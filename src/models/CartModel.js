const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    productID: {
        type: mongoose.Types.ObjectId,
        ref: "Product"
    },
    userID: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    quantity: {
        type: Number,
    }
})

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;