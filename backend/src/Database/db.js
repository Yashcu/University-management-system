const mongoose = require('mongoose');
const config = require('../config');
const logger = require('../utils/logger');

const connectToMongo = () => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  mongoose
    .connect(config.mongodbUri, options)
    .then(() => {
      logger.info('Connected to MongoDB Successfully');
    })
    .catch((error) => {
      logger.error('Error connecting to MongoDB', error);
      // Exit process with failure
      process.exit(1);
    });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB connection disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB connection reconnected');
  });
};

module.exports = connectToMongo;
