const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const errorHandler = require('./middlewares/errorHandler.middleware');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const apiRoutes = require('./routes');
const logger = require('./utils/logger');
const app = express();

app.use(helmet());
app.use(
  cors({
    origin: config.frontendApiLink,
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

app.use(express.static(path.join(__dirname, 'public')));

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'College Management System API is up and running!',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// API routes
app.use('/api', apiRoutes);

// Error handler
app.use(errorHandler);

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

module.exports = app;
