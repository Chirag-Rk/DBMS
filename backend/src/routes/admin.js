const express = require("express");
const router = express.Router();
const { getPool } = require("../db");

// ADMIN DASHBOARD STATS
router.get("/stats", async (req, res) => {
  try {
    const db = getPool();

    const [[students]] = await db.query("SELECT COUNT(*) AS count FROM users WHERE role='student'");
    const [[guides]] = await db.query("SELECT COUNT(*) AS count FROM users WHERE role='guide'");
    const [[teams]] = await db.query("SELECT COUNT(*) AS count FROM teams");
    const [[projects]] = await db.query("SELECT COUNT(*) AS count FROM submissions");

    return res.json({
      students: students.count,
      guides: guides.count,
      teams: teams.count,
      projects: projects.count,
    });
  } catch (err) {
    console.error("ADMIN STATS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// CREATE USER (Student / Guide)
router.post("/create", async (req, res) => {
  const { full_name, email, password, role } = req.body;

  if (!full_name || !email || !password || !role)
    return res.status(400).json({ message: "All fields required" });

  try {
    const db = getPool();

    const [exists] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (exists.length > 0)
      return res.status(400).json({ message: "Email already exists" });

    const [result] = await db.query(
      `INSERT INTO users (full_name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      [full_name, email, password, role]
    );

    return res.json({ message: "User created", user_id: result.insertId });
  } catch (err) {
    console.error("ADMIN CREATE USER ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
