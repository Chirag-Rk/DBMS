require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { Server } = require("socket.io");
const cron = require("node-cron");

const { initDb } = require("./src/db");
const routes = require("./src/routes"); // <-- correct
const { sendDeadlineNotifications, sendOverdueNotifications } = require("./src/cron_jobs");

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:3000",
  "http://127.0.0.1:8080",
  "http://172.20.10.2:8080",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy: origin not allowed"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// remove app.options("*", cors()) — cors middleware handles it automatically

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";
app.use("/uploads", express.static(path.join(__dirname, UPLOAD_DIR)));
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// DB init
initDb().catch((err) => {
  console.error("❌ Database Connection Failed:", err);
  process.exit(1);
});

// 🔥 MOUNT API ROUTES HERE
app.use("/api", routes);

// Socket.IO
const io = new Server(server, { cors: { origin: "*" } });
app.set("io", io);

// Cron jobs
cron.schedule("0 8 * * *", async () => {
  console.log("⏰ Running daily notifications...");
  await sendDeadlineNotifications(io);
  await sendOverdueNotifications(io);
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 Backend running @ http://localhost:${PORT}`));
