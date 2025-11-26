const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/admin", require("./admin"));
router.use("/users", require("./users"));
router.use("/teams", require("./teams"));
router.use("/milestones", require("./milestones"));
router.use("/submissions", require("./submissions")); // IMPORTANT
router.use("/notifications", require("./notifications"));
router.use("/evaluations", require("./evaluations")); // IMPORTANT

router.get("/", (req, res) => {
  res.json({ message: "PMES Backend API running..." });
});

module.exports = router;
