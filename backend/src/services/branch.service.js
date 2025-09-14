const Branch = require('../models/branch.model');

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
    const err = new Error('Branch with this name or ID already exists!');
    err.status = 409;
    throw err;
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
      const err = new Error('Branch with this name or ID already exists!');
      err.status = 409;
      throw err;
    }
  }
  const updated = await Branch.findByIdAndUpdate(id, data, { new: true });
  if (!updated) {
    const err = new Error('Branch Not Found!');
    err.status = 404;
    throw err;
  }
  return updated;
}

async function deleteBranch(id) {
  const branch = await Branch.findByIdAndDelete(id);
  if (!branch) {
    const err = new Error('Branch Not Found!');
    err.status = 404;
    throw err;
  }
  return branch;
}

module.exports = {
  getAllBranches,
  addBranch,
  updateBranch,
  deleteBranch,
};
