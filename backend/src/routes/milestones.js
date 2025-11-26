// backend/src/routes/milestones.js
const express = require("express");
const { getPool } = require("../db");
const { authenticate, authorize } = require("../middlewares/auth");
const router = express.Router();

// create milestone (admin or guide)
router.post("/create", authenticate, authorize("admin", "guide"), async (req, res) => {
  try {
    const { title, description, due_date, team_id } = req.body;
    if (!title || !due_date) return res.status(400).json({ error: "Missing fields" });

    const pool = getPool();
    const [result] = await pool.query(
      "INSERT INTO milestones (title, description, due_date, team_id) VALUES (?, ?, ?, ?)",
      [title, description || null, due_date, team_id || null]
    );

    const milestone = { milestone_id: result.insertId, title, description, due_date, team_id: team_id || null };
    const io = req.app.get("io");
    if (io) io.emit("milestone:created", milestone);

    res.json({ message: "Milestone created", milestone });
  } catch (err) {
    console.error("Create Milestone Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/all", authenticate, authorize("admin", "guide"), async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query("SELECT * FROM milestones ORDER BY due_date DESC");
    res.json({ milestones: rows });
  } catch (err) {
    console.error("Fetch Milestones Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
