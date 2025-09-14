const { z } = require('zod');
const ApiResponse = require('../utils/ApiResponse');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errorMessages = err.errors.map((e) => e.message).join(', ');
      return ApiResponse.badRequest(`Validation error: ${errorMessages}`).send(
        res
      );
    }
    return ApiResponse.internalServerError('Something went wrong').send(res);
  }
};

module.exports = validate;
