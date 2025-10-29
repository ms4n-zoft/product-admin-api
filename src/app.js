require("dotenv").config();
const express = require("express");
const healthRoutes = require("./routes/health-routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", healthRoutes);

module.exports = app;
