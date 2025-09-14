const jwt = require('jsonwebtoken');
const ApiResponse = require('../utils/ApiResponse');
const config = require('../config');
const logger = require('../utils/logger');

const auth = async (req, res, next) => {
  try {
    let token = req.header('Authorization');

    if (!token || !token.startsWith('Bearer ')) {
      return ApiResponse.unauthorized('Authentication token required').send(
        res
      );
    }

    token = token.split(' ')[1];

    try {
      const decoded = jwt.verify(token, config.jwtSecret);

      req.user = decoded;

      req.userId = decoded.userId;

      next();
    } catch (jwtError) {
      logger.error('JWT Error:', jwtError);
      return ApiResponse.unauthorized('Invalid or expired token').send(res);
    }
  } catch (error) {
    logger.error('Auth Middleware Error:', error);
    next(error);
  }
};

module.exports = auth;
