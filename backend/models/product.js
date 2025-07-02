const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  description: String,
  category: {
    type: String,
    enum: ["Televisions", "vehicules", "home appliances", "Mobile & Tablets", "Health & Sports"],
    required: true,
  },
  imgs: Object,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
