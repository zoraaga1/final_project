const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

//User schema
const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true,
    },
    password: String,
    role: {type: String, enum:["buyer", "seller", "expert", "admin"], default:"buyer"}
});

//hash password
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
userSchema.methods.matchPassword = function (password) {
    return bcrypt.compare(password, this.password);
  };

module.exports = mongoose.model("User", userSchema);