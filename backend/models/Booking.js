const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  buyer: {
    name: { type: String, required: true },
    whatsapp: { type: String, required: true },
    email: { type: String},
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "canceled"],
    default: "pending",
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Booking", BookingSchema);
