// backend/routes/teams.js
const express = require("express");
const { getPool } = require("../db");
const { authenticate, authorize } = require("../middlewares/auth");

const router = express.Router();

// helper to emit
function emitIO(req, event, payload) {
  try {
    const io = req.app.get("io");
    if (io) io.emit(event, payload);
  } catch (e) {}
}

// CREATE TEAM (Admin only)
router.post("/create", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { team_name, project_name, guide_id } = req.body;
    if (!team_name || !project_name)
      return res.status(400).json({ error: "Missing required fields" });

    const pool = getPool();
    const [result] = await pool.query(
      "INSERT INTO teams (team_name, project_name, guide_id) VALUES (?, ?, ?)",
      [team_name, project_name, guide_id || null]
    );

    const newTeamId = result.insertId;
    // notify
    emitIO(req, "teams:update", { action: "created", team_id: newTeamId });
    res.json({ message: "Team created successfully", team_id: newTeamId });
  } catch (err) {
    console.error("Create Team Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ADD MEMBER (Admin)
router.post("/add-member", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { team_id, student_id } = req.body;
    if (!team_id || !student_id) return res.status(400).json({ error: "Missing fields" });

    const pool = getPool();
    // prevent duplicate
    const [exists] = await pool.query(
      "SELECT * FROM team_members WHERE team_id = ? AND student_id = ?",
      [team_id, student_id]
    );
    if (exists.length > 0) return res.status(400).json({ error: "Student already in team" });

    await pool.query(
      "INSERT INTO team_members (team_id, student_id) VALUES (?, ?)",
      [team_id, student_id]
    );

    emitIO(req, "teams:update", { action: "member_added", team_id, student_id });
    res.json({ message: "Member added to team" });
  } catch (err) {
    console.error("Add Member Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ASSIGN GUIDE (Admin or Guide)
router.put("/assign-guide", authenticate, authorize("admin", "guide"), async (req, res) => {
  try {
    const { team_id, guide_id } = req.body;
    if (!team_id) return res.status(400).json({ error: "team_id required" });

    const pool = getPool();
    await pool.query("UPDATE teams SET guide_id = ? WHERE team_id = ?", [guide_id || null, team_id]);

    emitIO(req, "teams:update", { action: "guide_assigned", team_id, guide_id });
    res.json({ message: "Guide assigned successfully" });
  } catch (err) {
    console.error("Assign Guide Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET ALL TEAMS (Admin)
router.get("/all", authenticate, authorize("admin"), async (req, res) => {
  try {
    const pool = getPool();
    const [teams] = await pool.query(
      `SELECT t.*, u.full_name AS guide_name
       FROM teams t
       LEFT JOIN users u ON t.guide_id = u.user_id`
    );
    res.json({ teams });
  } catch (err) {
    console.error("Fetch Teams Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET TEAMS FOR GUIDE
router.get("/guide", authenticate, authorize("guide"), async (req, res) => {
  try {
    const pool = getPool();
    const [teams] = await pool.query(`SELECT * FROM teams WHERE guide_id = ?`, [req.user.user_id]);
    res.json({ teams });
  } catch (err) {
    console.error("Guide Teams Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET TEAM FOR STUDENT
router.get("/student", authenticate, authorize("student"), async (req, res) => {
  try {
    const pool = getPool();
    const [team] = await pool.query(
      `SELECT t.* FROM teams t
       JOIN team_members m ON t.team_id = m.team_id
       WHERE m.student_id = ?`,
      [req.user.user_id]
    );
    res.json({ team: team[0] || null });
  } catch (err) {
    console.error("Student Team Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

