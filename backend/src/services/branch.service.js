const Branch = require('../models/branch.model');
const ApiError = require('../utils/ApiError');

async function getAllBranches(search = '') {
  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } },
        ],
      }
    : {};
  return Branch.find(query);
}

async function addBranch(data) {
  const { name, code } = data;
  const existing = await Branch.findOne({ $or: [{ name }, { code }] });
  if (existing) {
    throw new ApiError(409, 'Branch with this name or code already exists!');
  }
  return Branch.create(data);
}

async function updateBranch(id, data) {
  const { name, code } = data;

  const orConditions = [];
  if(name){
    orConditions.push({name});
  }
  if(code){
    orConditions.push({code});
  }
  if (orConditions.length > 0) {
    const existing = await Branch.findOne({
      _id: { $ne: id },
      $or: orConditions,
    });

    if (existing) {
      throw new ApiError(409, 'Branch with this name or code already exists!');
    }
  }
  const updated = await Branch.findByIdAndUpdate(id, data, { new: true });
  if (!updated) {
    throw new ApiError(404, 'Branch Not Found!');
  }
  return updated;
}

async function deleteBranch(id) {
  const branch = await Branch.findByIdAndDelete(id);
  if (!branch) {
    throw new ApiError(404, 'Branch Not Found!');
  }
  return branch;
}

module.exports = {
  getAllBranches,
  addBranch,
  updateBranch,
  deleteBranch,
};
