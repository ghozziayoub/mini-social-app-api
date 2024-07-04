const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const hpp = require("hpp");
const { errorHandler } = require("./middleware/errorHandler");
const userRoutes = require("./features/users/users.routes");
const postRoutes = require("./features/posts/posts.routes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(hpp());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
