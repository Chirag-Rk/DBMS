// backend/src/routes/users.js
const express = require("express");
const router = express.Router();
const { getPool } = require("../db");
const bcrypt = require("bcrypt");
const { authenticate, authorize } = require("../middlewares/auth");

/* ============================================================
   1️⃣ UNIVERSAL GET USERS
   Supports:
     /users
     /users?role=guide
============================================================ */
router.get("/", async (req, res) => {
  try {
    const { role } = req.query;
    const pool = getPool();

    let sql = `
      SELECT user_id, full_name, email, role, status, created_at
      FROM users
    `;
    const params = [];

    if (role) {
      sql += " WHERE role = ?";
      params.push(role);
    }

    sql += " ORDER BY created_at DESC";

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error("Fetch Users Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ============================================================
   2️⃣ ALIAS ROUTE — `/users/role/guide`
============================================================ */
router.get("/role/:role", async (req, res) => {
  try {
    const pool = getPool();
    const { role } = req.params;

    const [rows] = await pool.query(
      "SELECT user_id, full_name, email FROM users WHERE role = ?",
      [role]
    );

    return res.json({ users: rows });
  } catch (err) {
    console.error("GET /users/role/:role error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ============================================================
   3️⃣ OLD ROUTE `/users/guide` — Return in correct format
============================================================ */
router.get("/guide", async (req, res) => {
  try {
    const pool = getPool();

    const [rows] = await pool.query(
      "SELECT user_id, full_name, email FROM users WHERE role = 'guide'"
    );

    return res.json({ users: rows });
  } catch (err) {
    console.error("GET /users/guide error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ============================================================
   4️⃣ CREATE USER (Admin only)
============================================================ */
router.post(
  "/create",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const { full_name, email, password, role } = req.body;

      if (!full_name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const pool = getPool();

      const [exists] = await pool.query(
        "SELECT user_id FROM users WHERE email = ?",
        [email]
      );
      if (exists.length > 0)
        return res.status(400).json({ message: "Email already taken" });

      const hashed = await bcrypt.hash(password, 10);

      const [result] = await pool.query(
        `INSERT INTO users (full_name, email, password, role, status)
         VALUES (?, ?, ?, ?, 'Active')`,
        [full_name, email, hashed, role]
      );

      res.json({ message: "User created", user_id: result.insertId });
    } catch (err) {
      console.error("Create User Error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
