module.exports = (req, res) => {
  res.status(200).json({
    message: "Isolation test passed",
    env: process.env.NODE_ENV,
    time: new Date().toISOString()
  });
};
