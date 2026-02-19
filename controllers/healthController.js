// @desc    Health check
// @route   GET /
// @access  Public
const healthCheck = (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Strocter API is running 🚀",
        timestamp: new Date().toISOString(),
    });
};

module.exports = { healthCheck };
