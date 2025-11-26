const express = require("express");
const multer = require("multer");
const path = require("path");
const { getPool } = require("../db");
const { authenticate, authorize } = require("../middlewares/auth");

const router = express.Router();

/* --------------------------- File Upload Config --------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || "uploads");
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

/* -------------------------- Upload Submission ----------------------------- */
router.post(
  "/upload",
  authenticate,
  authorize("student"),
  upload.single("file"),
  async (req, res) => {
    try {
      const { milestone_id, team_id } = req.body;
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });

      const file_path = `/uploads/${req.file.filename}`;

      const pool = getPool();

      const [milestone] = await pool.query(
        "SELECT due_date FROM milestones WHERE milestone_id = ?",
        [milestone_id]
      );

      if (milestone.length === 0)
        return res.status(400).json({ error: "Invalid milestone" });

      const today = new Date();
      const deadline = new Date(milestone[0].due_date);
      if (today > deadline) {
        return res.status(403).json({ error: "Deadline passed" });
      }

      const [previous] = await pool.query(
        `SELECT COUNT(*) AS versions FROM submissions WHERE milestone_id = ? AND team_id = ?`,
        [milestone_id, team_id]
      );

      const version =
        previous[0] && previous[0].versions
          ? previous[0].versions + 1
          : 1;

      const [insertRes] = await pool.query(
        `INSERT INTO submissions (milestone_id, team_id, uploaded_by, file_path, version, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [milestone_id, team_id, req.user.user_id, file_path, version, "Pending Review"]
      );

      res.json({
        message: "File uploaded successfully",
        submission_id: insertRes.insertId,
      });
    } catch (err) {
      console.error("Upload Error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

/* ---------------------- GET Submissions for Guide ------------------------- */
router.get(
  "/guide",
  authenticate,
  authorize("guide"),
  async (req, res) => {
    try {
      const pool = getPool();

      // GUIDE MUST SEE ONLY SUBMISSIONS OF THEIR TEAMS  
      const [rows] = await pool.query(
        `SELECT 
            s.submission_id,
            s.milestone_id,
            s.team_id,
            s.upload_time,
            s.status,
            t.team_name,
            m.title AS milestone_name,
            u.full_name AS uploaded_by_name
         FROM submissions s
         LEFT JOIN teams t ON s.team_id = t.team_id
         LEFT JOIN milestones m ON s.milestone_id = m.milestone_id
         LEFT JOIN users u ON s.uploaded_by = u.user_id
         WHERE t.guide_id = ?
         ORDER BY s.upload_time DESC`,
        [req.user.user_id]
      );

      res.json({ submissions: rows });
    } catch (err) {
      console.error("Guide Submissions Error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

/* ---------------------- GET All Submissions (Admin) ----------------------- */
router.get(
  "/list",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const pool = getPool();

      const [rows] = await pool.query(
        `SELECT 
            s.*,
            t.team_name,
            m.title AS milestone_name,
            u.full_name AS uploaded_by_name
         FROM submissions s
         LEFT JOIN teams t ON s.team_id = t.team_id
         LEFT JOIN milestones m ON s.milestone_id = m.milestone_id
         LEFT JOIN users u ON s.uploaded_by = u.user_id
         ORDER BY s.upload_time DESC
         LIMIT 200`
      );

      res.json({ submissions: rows });
    } catch (err) {
      console.error("Admin Submissions Error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

/* --------------------- GET My Submissions (Student) ----------------------- */
router.get(
  "/my",
  authenticate,
  authorize("student"),
  async (req, res) => {
    try {
      const pool = getPool();

      const [rows] = await pool.query(
        `SELECT 
            s.*,
            t.team_name,
            m.title AS milestone_name
         FROM submissions s
         LEFT JOIN teams t ON s.team_id = t.team_id
         LEFT JOIN milestones m ON s.milestone_id = m.milestone_id
         WHERE s.uploaded_by = ?
         ORDER BY s.upload_time DESC`,
        [req.user.user_id]
      );

      res.json({ submissions: rows });
    } catch (err) {
      console.error("My Submissions Error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

/* ---------------------- Evaluate Submission ------------------------------- */
router.put(
  "/evaluate",
  authenticate,
  authorize("guide", "admin"),
  async (req, res) => {
    try {
      const { submission_id, status, notes } = req.body;

      if (!submission_id || !status)
        return res.status(400).json({ error: "Missing fields" });

      const pool = getPool();

      await pool.query(
        `UPDATE submissions 
         SET status = ?, evaluation_notes = ?, evaluated_by = ?, evaluated_at = NOW() 
         WHERE submission_id = ?`,
        [status, notes || null, req.user.user_id, submission_id]
      );

      res.json({ message: "Submission evaluated" });
    } catch (err) {
      console.error("Evaluate Error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;


