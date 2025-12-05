const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../../config/auth-config");

// Verify JWT from Authorization header and attach user to request
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Access denied. No token provided.",
      code: "NO_TOKEN",
    });
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Token has expired. Please login again.",
        code: "TOKEN_EXPIRED",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: "Invalid token.",
        code: "INVALID_TOKEN",
      });
    }

    return res.status(401).json({
      success: false,
      error: "Token verification failed.",
      code: "TOKEN_VERIFICATION_FAILED",
    });
  }
};

// Allow request through if token exists and is valid, but don't block if missing
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    req.user = decoded;
  } catch (error) {
    // Continue without user info - token was invalid but not required
  }

  next();
};

module.exports = {
  authenticateToken,
  optionalAuth,
};
