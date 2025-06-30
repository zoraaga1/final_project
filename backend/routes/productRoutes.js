const express = require("express")
const {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");
const protect = require("../middlewares/auth");

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProduct);
router.post("/", protect, createProduct);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;