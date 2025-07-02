const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  description: String,
  category: {
    type: String,
    enum: ["televisions", "vehicules", "home appliances", "mobile & tablets", "health & sports", "electronics"],
    required: true,
  },
  imgs: {
    type: [String],
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
