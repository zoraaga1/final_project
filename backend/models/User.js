const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//User schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["buyer", "seller", "expert"],
      default: "buyer",
    },
    cin: {
      type: String,
      required: function () {
        return this.role === "seller" || this.role === "expert";
      },
    },
    diploma: {
      type: String,
      required: function () {
        return this.role === "expert";
      },
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

// Prevent password from being returned in queries
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
});

// Hash password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
userSchema.methods.matchPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
