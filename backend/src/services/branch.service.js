const Branch = require('../models/branch.model');
const ApiError = require('../utils/ApiError');

async function getAllBranches(search = '') {
  return Branch.find({
    $or: [
      { name: { $regex: search, $options: 'i' } },
      { branchId: { $regex: search, $options: 'i' } },
    ],
  });
}

async function addBranch(data) {
  const { name, branchId } = data;
  const existing = await Branch.findOne({ $or: [{ name }, { branchId }] });
  if (existing) {
    throw new ApiError(409, 'Branch with this name or ID already exists!');
  }
  return Branch.create(data);
}

async function updateBranch(id, data) {
  const { name, branchId } = data;
  if (name || branchId) {
    const existing = await Branch.findOne({
      _id: { $ne: id },
      $or: [name ? { name } : {}, branchId ? { branchId } : {}],
    });
    if (existing) {
      throw new ApiError(409, 'Branch with this name or ID already exists!');
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
