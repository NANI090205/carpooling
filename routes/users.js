const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || "secret123";

// Generate a random 5-digit code
const generateUserCode = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

// Signup route
router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    console.log("Signup payload:", req.body);
  
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use." });
      }
  
      const uniqueCode = Math.floor(10000 + Math.random() * 90000);
  
      const newUser = new User({
        username,
        email,
        password,
        uniqueCode,
      });
  
      await newUser.save();
      res.status(200).json({ message: "Signup successful" });
  
    } catch (err) {
      console.error("Signup Error:", err);
      res.status(500).json({ message: "Server error during signup." });
    }
  });
  
// Login route
router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
  
      if (!user || user.password !== password) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      res.status(200).json({
        username: user.username,
        email: user.email,
        uniqueCode: user.uniqueCode,
        message: "Login successful"
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  

module.exports = router;
