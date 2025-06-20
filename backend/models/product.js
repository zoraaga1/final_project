const mongoose = require("mongoose");

const productShema = new mongoose.Schema({
    title: String,
    price: Number,
    discountedPrice: Number,
    imgs: Object
})

module.exports = mongoose.model("product", productShema);
