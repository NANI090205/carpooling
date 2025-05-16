const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  uniqueCode: Number,
});

module.exports = mongoose.model("User", UserSchema);
