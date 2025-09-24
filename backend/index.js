const app = require('./src/app');
const connectToMongo = require('./src/database/db');
const config = require('./src/config');
const logger = require('./src/utils/logger');
const mongoose = require('mongoose');

// Connect to MongoDB
connectToMongo();

const port = config.port;

const server = app.listen(port, () => {
  logger.info(`🚀 Server Listening On http://localhost:${port}`);
});

// Graceful Shutdown
const shutdown = (signal) => {
  logger.info(`${signal} received: closing HTTP server`);
  server.close(() => {
    logger.info('HTTP server closed');
    mongoose.connection.close(false, () => {
      logger.info('MongoDb connection closed');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Unhandled Rejection and Uncaught Exception Handling
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception thrown', error);
  process.exit(1);
});
