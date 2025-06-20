const product = require("../models/product")

const getAllProducts = async (req, res) => {
    try {
        const Product = await product.find();
        console.log(Product)
        res.json(Product)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = {getAllProducts}
