const express = require("express");
const router = express.Router();

// Import all route modules
const authRoutes = require("./auth");
const userRoutes = require("./users");
const adminRoutes = require("./admin");
const teamRoutes = require("./teams");
const milestoneRoutes = require("./milestones");
const submissionRoutes = require("./submissions");
const evaluationRoutes = require("./evaluations");
const notificationRoutes = require("./notifications");

// -----------------------
// ORDER MATTERS — FIXED
// -----------------------

// Auth first
router.use("/auth", authRoutes);

// Users
router.use("/users", userRoutes);

// Admin
router.use("/admin", adminRoutes);

// Admin sub-routes
router.use("/admin/teams", teamRoutes);
router.use("/admin/milestones", milestoneRoutes);

// Evaluations  ✅ IMPORTANT
router.use("/evaluations", evaluationRoutes);

// Submissions
router.use("/submissions", submissionRoutes);

// Notifications
router.use("/notifications", notificationRoutes);

// Root API response
router.get("/", (req, res) => {
  res.json({ message: "PMES Backend API is running..." });
});

module.exports = router;
