const jwt = require("jsonwebtoken");
const { jwtConfig, validateCredentials } = require("../../config/auth-config");

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
        code: "MISSING_CREDENTIALS",
      });
    }

    const validation = await validateCredentials(email, password);

    if (!validation.isValid) {
      // Generic error prevents email enumeration attacks
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
        code: "INVALID_CREDENTIALS",
      });
    }

    const tokenPayload = {
      email: email.toLowerCase().trim(),
      loginAt: new Date().toISOString(),
    };

    const token = jwt.sign(tokenPayload, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
      algorithm: jwtConfig.algorithm,
    });

    const expiresIn = jwtConfig.expiresIn;
    const expiresAt = new Date();
    if (expiresIn.endsWith("h")) {
      expiresAt.setHours(expiresAt.getHours() + parseInt(expiresIn));
    } else if (expiresIn.endsWith("d")) {
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiresIn));
    } else if (expiresIn.endsWith("m")) {
      expiresAt.setMinutes(expiresAt.getMinutes() + parseInt(expiresIn));
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        tokenType: "Bearer",
        expiresIn,
        expiresAt: expiresAt.toISOString(),
        user: {
          email: email.toLowerCase().trim(),
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      error: "An error occurred during login",
      code: "LOGIN_ERROR",
    });
  }
};

// Middleware already verified token, just confirm it's still valid
const verifyTokenController = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Token is valid",
    data: {
      user: req.user,
      isValid: true,
    },
  });
};

// Return current authenticated user info from token
const getMeController = (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      email: req.user.email,
      loginAt: req.user.loginAt,
    },
  });
};

module.exports = {
  loginController,
  verifyTokenController,
  getMeController,
};
