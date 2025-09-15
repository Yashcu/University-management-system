class ApiError extends Error {
  constructor(statusCode, message = 'Something went wrong', success = false) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = success;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
