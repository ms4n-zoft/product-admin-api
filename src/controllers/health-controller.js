const getHealthStatus = (req, res) => {
  const healthData = {
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: "product-admin-api",
    version: "1.0.0",
  };

  res.status(200).json(healthData);
};

module.exports = {
  getHealthStatus,
};
