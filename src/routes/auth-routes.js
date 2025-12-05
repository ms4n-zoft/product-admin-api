const express = require("express");
const {
  loginController,
  verifyTokenController,
  getMeController,
} = require("../controllers/auth-controller");
const { authenticateToken } = require("../middleware/auth-middleware");

const router = express.Router();

router.post("/login", loginController);
router.get("/verify", authenticateToken, verifyTokenController);
router.get("/me", authenticateToken, getMeController);

module.exports = router;
