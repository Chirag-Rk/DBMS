const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

// Generate JWT Token
function generateToken(user) {
  return jwt.sign(
    {
      user_id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// Format response without password
function cleanUser(user) {
  if (!user) return null;

  const { password, ...safeUser } = user;
  return safeUser;
}

// Standard API success response
function success(message, data = null) {
  return { success: true, message, data };
}

// Standard API error response
function error(message) {
  return { success: false, message };
}

module.exports = {
  generateToken,
  cleanUser,
  success,
  error,
};
