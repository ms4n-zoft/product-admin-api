const express = require("express");
const healthRoutes = require("./routes/health-routes");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", healthRoutes);

module.exports = app;
