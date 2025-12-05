require("dotenv").config();
const express = require("express");
const cors = require("cors");
const healthRoutes = require("./routes/health-routes");
const productRoutes = require("./routes/product-routes");
const authRoutes = require("./routes/auth-routes");
const { authenticateToken } = require("./middleware/auth-middleware");

const app = express();

// Enable CORS for all origins (POC)
app.use(cors({ origin: "*" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public routes (no authentication required)
app.use("/", healthRoutes);
app.use("/auth", authRoutes);

// Protected routes (authentication required)
app.use("/products", authenticateToken, productRoutes);

module.exports = app;
