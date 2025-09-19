const branchService = require('../services/branch.service');
const ApiResponse = require('../utils/ApiResponse');

const getBranchController = async (req, res, next) => {
  try {
    const { search = '' } = req.query;
    const branches = await branchService.getAllBranches(search);
    ApiResponse.success(branches, 'Branches retrieved successfully').send(res);
  } catch (err) {
    next(err);
  }
};

const addBranchController = async (req, res, next) => {
  try {
    const branch = await branchService.addBranch(req.body);
    ApiResponse.created(branch, 'Branch created successfully').send(res);
  } catch (err) {
    next(err);
  }
};

const updateBranchController = async (req, res, next) => {
  try {
    const branch = await branchService.updateBranch(req.params.id, req.body);
    ApiResponse.success(branch, 'Branch updated successfully').send(res);
  } catch (err) {
    next(err);
  }
};

const deleteBranchController = async (req, res, next) => {
  try {
    await branchService.deleteBranch(req.params.id);
    ApiResponse.success(null, 'Branch deleted successfully').send(res);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBranchController,
  addBranchController,
  updateBranchController,
  deleteBranchController,
};
