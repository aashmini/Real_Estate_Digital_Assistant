const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = "secretkey"; // You can later move this to .env

// ✅ Register Route
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email, role });
    if (existingUser) {
      return res.status(400).json({ error: `A ${role} with this email already exists` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword, role });

    res.status(201).json({ message: "User registered", user: newUser });
  } catch (err) {
    console.error("❌ Registration Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Login Route
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email, role }); // Ensure role matches
    if (!user) {
      return res.status(400).json({ error: "Invalid email, password, or role" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
