const mysql = require("mysql2/promise");

let pool;

async function initDb() {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "",
      database: process.env.DB_NAME || "pmes",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();

    console.log("✅ MySQL Database Connected Successfully");
  } catch (error) {
    console.error("❌ MySQL Connection Failed:", error);
    process.exit(1);
  }
}

function getPool() {
  if (!pool) {
    throw new Error("⛔ Database pool not initialized. Call initDb() first.");
  }
  return pool;
}

module.exports = { initDb, getPool };
