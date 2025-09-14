const branchService = require('../services/branch.service');
const ApiResponse = require('../utils/ApiResponse');

const getBranchController = async (req, res, next) => {
  try {
    const { search = '' } = req.query;
    const branches = await branchService.getAllBranches(search);
    return ApiResponse.success(branches, 'All Branches Loaded!').send(res);
  } catch (err) {
    next(err);
  }
};

const addBranchController = async (req, res, next) => {
  try {
    const branch = await branchService.addBranch(req.body);
    return ApiResponse.created(branch, 'Branch Added Successfully!').send(res);
  } catch (err) {
    next(err);
  }
};

const updateBranchController = async (req, res, next) => {
  try {
    const branch = await branchService.updateBranch(req.params.id, req.body);
    return ApiResponse.success(branch, 'Branch Updated Successfully!').send(
      res
    );
  } catch (err) {
    next(err);
  }
};

const deleteBranchController = async (req, res, next) => {
  try {
    await branchService.deleteBranch(req.params.id);
    return ApiResponse.success(null, 'Branch Deleted Successfully!').send(res);
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
