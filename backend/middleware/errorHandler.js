/**
 * Async handler — wraps async route handlers so thrown errors
 * are automatically forwarded to Express's error middleware.
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Global error handling middleware.
 * - Catches any error passed via next(err)
 * - Returns a consistent JSON response
 * - Hides the stack trace in production
 */
const errorHandler = (err, _req, res, _next) => {
    const statusCode = err.status || err.statusCode || 500;

    const response = {
        success: false,
        message: err.message || "Internal Server Error",
    };

    // Only include stack trace in development
    if (process.env.NODE_ENV !== "production") {
        response.stack = err.stack;
    }

    console.error(`❌ [${statusCode}] ${err.message}`);

    res.status(statusCode).json(response);
};

module.exports = { asyncHandler, errorHandler };
