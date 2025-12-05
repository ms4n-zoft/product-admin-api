const bcrypt = require("bcryptjs");

// Store JWT settings separately for token verification across app
const jwtConfig = {
  secret:
    process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production",
  expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  algorithm: "HS256",
};

const ALLOWED_EMAIL_DOMAIN = "@zoftwarehub.com";

// Future feature: specific email whitelisting on top of domain check
const WHITELISTED_EMAILS = [
  // "admin@zoftwarehub.com",
];

const validateEmail = (email) => {
  if (!email || typeof email !== "string") {
    return { isValid: false, message: "Email is required" };
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Enforce corporate email domain
  if (!normalizedEmail.endsWith(ALLOWED_EMAIL_DOMAIN)) {
    return {
      isValid: false,
      message: `Only ${ALLOWED_EMAIL_DOMAIN} emails are allowed`,
    };
  }

  // Support fine-grained access control if needed
  if (WHITELISTED_EMAILS.length > 0) {
    const isWhitelisted = WHITELISTED_EMAILS.some(
      (whitelistedEmail) => whitelistedEmail.toLowerCase() === normalizedEmail
    );

    if (!isWhitelisted) {
      return {
        isValid: false,
        message: "This email is not authorized to access the system",
      };
    }
  }

  return { isValid: true, message: "Email is valid" };
};

const getAdminPassword = () => {
  return process.env.ADMIN_PASSWORD || "admin123";
};

// Validate domain + shared password
const validateCredentials = async (email, password) => {
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    return emailValidation;
  }

  if (password !== getAdminPassword()) {
    return { isValid: false, message: "Invalid credentials" };
  }

  return { isValid: true, message: "Credentials valid" };
};

module.exports = {
  jwtConfig,
  ALLOWED_EMAIL_DOMAIN,
  WHITELISTED_EMAILS,
  validateEmail,
  validateCredentials,
  getAdminPassword,
};
