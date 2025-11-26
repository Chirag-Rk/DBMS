// src/routes/auth.js
const express = require("express");
const router = express.Router();
const { getPool } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  const { full_name, email, password, role } = req.body;
  if (!full_name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const db = getPool();
    const [exists] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (exists.length > 0) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      `INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)`,
      [full_name, email, hashed, role]
    );

    const user_id = result.insertId;
    const token = jwt.sign({ user_id, email, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.json({
      message: "Registration success",
      token,
      user: { user_id, full_name, email, role },
      role,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const db = getPool();
    const [rows] = await db.query("SELECT * FROM users WHERE email = ? AND role = ?", [email, role]);
    if (rows.length === 0) return res.status(400).json({ message: "User not found" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign({ user_id: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Do NOT send hashed password to client
    delete user.password;

    return res.json({
      message: "Login success",
      token,
      user,
      role: user.role,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;


