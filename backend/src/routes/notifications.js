const express = require("express");
const { getPool } = require("../db");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

// 🟦 GET NOTIFICATIONS OF LOGGED-IN USER
router.get("/", authenticate, async (req, res) => {
  try {
    const pool = getPool();

    const [notifications] = await pool.query(
      `SELECT * FROM notifications 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [req.user.user_id]
    );

    res.json({ notifications });
  } catch (err) {
    console.error("Fetch Notifications Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🟩 MARK AS READ
router.put("/read/:id", authenticate, async (req, res) => {
  try {
    const pool = getPool();

    await pool.query(
      `UPDATE notifications 
       SET is_read = TRUE 
       WHERE notification_id = ?`,
      [req.params.id]
    );

    res.json({ message: "Notification marked as read" });
  } catch (err) {
    console.error("Mark Read Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🟥 MARK ALL AS READ
router.put("/read-all", authenticate, async (req, res) => {
  try {
    const pool = getPool();

    await pool.query(
      `UPDATE notifications 
       SET is_read = TRUE 
       WHERE user_id = ?`,
      [req.user.user_id]
    );

    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error("Mark All Read Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🟧 DELETE NOTIFICATION
router.delete("/delete/:id", authenticate, async (req, res) => {
  try {
    const pool = getPool();

    await pool.query(
      `DELETE FROM notifications 
       WHERE notification_id = ?`,
      [req.params.id]
    );

    res.json({ message: "Notification deleted" });
  } catch (err) {
    console.error("Delete Notification Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
