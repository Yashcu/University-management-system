const ApiResponse = require('../utils/ApiResponse');
const logger = require('../utils/logger');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  if (statusCode === 500) {
    logger.error('SERVER ERROR:', err.stack);
  }

  return ApiResponse.error(message, statusCode).send(res);
};

module.exports = errorHandler;
