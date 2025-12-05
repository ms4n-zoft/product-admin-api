const { getDB } = require("../../config/db-config");

const COLLECTION_NAME = "login_audit_logs";

const logLoginAttempt = async ({ email, success, ip, userAgent, reason }) => {
  try {
    const db = getDB();
    const collection = db.collection(COLLECTION_NAME);

    await collection.insertOne({
      email: email?.toLowerCase()?.trim() || "unknown",
      success: Boolean(success),
      reason: reason || null,
      ip: ip || null,
      userAgent: userAgent || null,
      timestamp: new Date(),
    });
  } catch (error) {
    // Log to console but don't block the login flow
    console.error("Failed to log login attempt:", error.message);
  }
};

module.exports = { logLoginAttempt };
