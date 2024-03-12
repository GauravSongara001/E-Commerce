const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    price: {
        type: Number,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
    },
    image: {
        type: String,
    },
    rating: {
        type: Object,
    }
})

const Product = mongoose.model("Product", productSchema);

module.exports = Product;