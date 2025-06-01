// Global error handler middleware
const errorHandler = (error, req, res, next) => {
  console.error("Error occurred:", {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    user: req.user?.uid || "anonymous",
  });

  // Mongoose validation error
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((err) => err.message);
    return res.status(400).json({
      error: "Validation Error",
      message: "Invalid input data",
      details: messages,
    });
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    return res.status(409).json({
      error: "Duplicate Error",
      message: "Resource already exists",
      field: Object.keys(error.keyValue)[0],
    });
  }

  // JWT errors
  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid authentication token",
    });
  }

  if (error.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Authentication token expired",
    });
  }

  // Stripe errors
  if (error.type && error.type.startsWith("Stripe")) {
    return res.status(400).json({
      error: "Payment Error",
      message: error.message,
      type: error.type,
    });
  }

  // Firebase errors
  if (error.code && error.code.startsWith("auth/")) {
    return res.status(401).json({
      error: "Authentication Error",
      message: error.message,
      code: error.code,
    });
  }

  // Rate limiting error
  if (error.status === 429) {
    return res.status(429).json({
      error: "Too Many Requests",
      message: "Rate limit exceeded. Please try again later.",
      retryAfter: error.retryAfter,
    });
  }

  // File upload errors
  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      error: "File Too Large",
      message: "File size exceeds the allowed limit",
      maxSize: "10MB",
    });
  }

  if (error.code === "LIMIT_FILE_COUNT") {
    return res.status(413).json({
      error: "Too Many Files",
      message: "Number of files exceeds the allowed limit",
    });
  }

  // OpenAI/AI service errors
  if (error.type === "insufficient_quota") {
    return res.status(503).json({
      error: "Service Unavailable",
      message: "AI service temporarily unavailable. Please try again later.",
      retryAfter: 300, // 5 minutes
    });
  }

  // Default error response
  const statusCode = error.statusCode || error.status || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : error.message;

  res.status(statusCode).json({
    error: statusCode >= 500 ? "Internal Server Error" : "Bad Request",
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: error.stack,
      details: error,
    }),
  });
};

// Async error wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Not found handler
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = {
  errorHandler,
  asyncHandler,
  notFound,
};
