const express = require("express");
const router = express.Router();
const { getPool } = require("../db");
const { authenticate, authorize } = require("../middlewares/auth");

// =============================================================
// GET ALL EVALUATIONS  (ADMIN + GUIDE)
// =============================================================
router.get(
  "/",
  authenticate,
  authorize("admin", "guide"),
  async (req, res) => {
    try {
      const pool = getPool();

      const [records] = await pool.query(
        `SELECT 
            e.evaluation_id,
            e.submission_id,
            e.guide_id,
            e.score,
            e.feedback,
            e.evaluated_at,
            e.created_at,
            s.team_id,
            s.milestone_id,
            s.version,
            u.full_name AS guide_name
         FROM evaluations e
         JOIN submissions s ON e.submission_id = s.submission_id
         JOIN users u ON e.guide_id = u.user_id
         ORDER BY e.created_at DESC`
      );

      res.json(records);
    } catch (err) {
      console.error("All Evaluations Error:", err);
      res.status(500).json({ error: "Server error loading evaluations" });
    }
  }
);

// =============================================================
// ADD EVALUATION (Guide Only)
// =============================================================
router.post(
  "/add",
  authenticate,
  authorize("guide", "admin"),
  async (req, res) => {
    try {
      const { submission_id, score, feedback } = req.body;

      if (!submission_id || score === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const pool = getPool();

      // Insert evaluation
      await pool.query(
        `INSERT INTO evaluations 
           (submission_id, guide_id, score, feedback)
         VALUES (?, ?, ?, ?)`,
        [submission_id, req.user.user_id, score, feedback || null]
      );

      // Update submission status
      await pool.query(
        `UPDATE submissions 
         SET status = 'Evaluated' 
         WHERE submission_id = ?`,
        [submission_id]
      );

      res.json({ message: "Evaluation saved successfully!" });
    } catch (err) {
      console.error("Create Evaluation Error:", err);
      res.status(500).json({ error: "Server error creating evaluation" });
    }
  }
);

// =============================================================
// GET EVALUATION FOR SPECIFIC SUBMISSION
// =============================================================
router.get(
  "/submission/:id",
  authenticate,
  async (req, res) => {
    try {
      const pool = getPool();

      const [results] = await pool.query(
        `SELECT 
            e.*, 
            u.full_name AS evaluated_by
         FROM evaluations e
         JOIN users u ON e.guide_id = u.user_id
         WHERE e.submission_id = ?`,
        [req.params.id]
      );

      res.json(results[0] || null);
    } catch (err) {
      console.error("Fetch Evaluation Error:", err);
      res.status(500).json({ error: "Server error fetching evaluation" });
    }
  }
);

module.exports = router;
