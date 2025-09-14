const ApiResponse = require('../utils/ApiResponse');

const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return ApiResponse.forbidden(
        'Access denied. User role not specified.'
      ).send(res);
    }

    const userRole = req.user.role;

    if (allowedRoles.includes(userRole)) {
      next();
    } else {
      return ApiResponse.forbidden(
        'Access denied. You do not have permission to perform this action.'
      ).send(res);
    }
  };
};

module.exports = authorize;
