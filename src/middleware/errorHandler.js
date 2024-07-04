// Custom error class
class AppError extends Error {
  constructor(message, statusCode, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handling middleware
const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  const response = {
    status,
    message: err.message,
  };

  if (err.errors && err.errors.length > 0) {
    response.errors = err.errors;
  }

  res.status(statusCode).json(response);
};

module.exports = { errorHandler, AppError };
