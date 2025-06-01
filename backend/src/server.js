const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Import route handlers
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const stripeRoutes = require("./routes/stripe");
const optimizeRoutes = require("./routes/optimize");

// Import middleware
const { authenticateToken } = require("./middleware/auth");
const { errorHandler } = require("./middleware/errorHandler");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
});
app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.CORS_ORIGINS?.split(",") || [
      "http://localhost:5173",
    ];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));

// Middleware
app.use(compression());
app.use(morgan("combined"));
app.use(cookieParser());

// Body parsing middleware
app.use("/api/stripe/webhook", express.raw({ type: "application/json" })); // Raw body for Stripe webhooks
app.use(express.json({ limit: "10mb" })); // Increased limit for code uploads
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: "1.0.0",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", authenticateToken, userRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/optimize", authenticateToken, optimizeRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      "GET /health",
      "POST /api/auth/login",
      "POST /api/auth/register",
      "GET /api/user/profile",
      "POST /api/stripe/create-checkout-session",
      "POST /api/optimize/code",
    ],
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 OptimizeCode.ai Backend Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 CORS enabled for: ${process.env.CORS_ORIGINS}`);
  console.log(`🔥 Firebase Project: ${process.env.FIREBASE_PROJECT_ID}`);
  console.log(
    `💳 Stripe configured: ${process.env.STRIPE_SECRET_KEY ? "Yes" : "No"}`,
  );
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  process.exit(0);
});

module.exports = app;
