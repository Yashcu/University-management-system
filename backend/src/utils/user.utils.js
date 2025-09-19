const ApiError = require('./ApiError');

const checkIfExists = async (model, query, errorMessage) => {
  const existingDoc = await model.findOne(query);
  if (existingDoc) {
    throw new ApiError(409, errorMessage);
  }
};

module.exports = { checkIfExists };
