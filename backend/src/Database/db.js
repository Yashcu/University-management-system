const mongoose = require('mongoose');
const config = require('../config');
const logger = require('../utils/logger');

const connectToMongo = () => {
  mongoose
    .connect(config.mongodbUri)
    .then(() => {
      logger.info('Connected to MongoDB Successfully');
    })
    .catch((error) => {
      logger.error('Error connecting to MongoDB', error);
    });
};

module.exports = connectToMongo;
