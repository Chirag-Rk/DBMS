const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

// 🔐 Middleware: Authenticate User
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ error: "Authorization header missing" });

  const token = authHeader.split(" ")[1]; // "Bearer token"

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach user payload to request
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// 🔐 Middleware: Role-Based Access
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ error: "User not authenticated" });

    if (!allowedRoles.includes(req.user.role))
      return res.status(403).json({ error: "Access denied" });

    next();
  };
}

module.exports = {
  authenticate,
  authorize,
};
