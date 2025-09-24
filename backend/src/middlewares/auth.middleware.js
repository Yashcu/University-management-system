const jwt = require('jsonwebtoken');
const ApiResponse = require('../utils/ApiResponse');
const config = require('../config');
const logger = require('../utils/logger');
const { USER_ROLES } = require('../utils/constants');

const auth = (requiredRole = null) => async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return ApiResponse.unauthorized('No token provided').send(res);
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      req.user = decoded;
      req.userId = decoded.userId;

      if (requiredRole && req.user.role !== requiredRole) {
        return ApiResponse.forbidden('You do not have permission to perform this action.').send(res);
      }

      next();
    } catch (jwtError) {
      logger.error('JWT Error:', jwtError);
      if (jwtError.name === 'TokenExpiredError') {
        return ApiResponse.unauthorized('Token has expired').send(res);
      }
      return ApiResponse.unauthorized('Invalid token').send(res);
    }
  } catch (error) {
    logger.error('Auth Middleware Error:', error);
    next(error);
  }
};

module.exports = auth;
