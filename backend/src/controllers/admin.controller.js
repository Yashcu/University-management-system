const adminDetailsService = require('../services/admin.service');
const ApiResponse = require('../utils/ApiResponse');

const loginAdminController = async (req, res, next) => {
  try {
    const token = await adminDetailsService.loginAdmin(req.body);
    return ApiResponse.success({ token }, 'Login successful').send(res);
  } catch (error) {
    next(error);
  }
};

const getAllDetailsController = async (req, res, next) => {
  try {
    const users = await adminDetailsService.getAllDetails();
    ApiResponse.success(users, 'Admins retrieved successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const registerAdminController = async (req, res, next) => {
  try {
    const sanitizedUser = await adminDetailsService.registerAdmin(
      req.body,
      req.file
    );
    ApiResponse.created(sanitizedUser, 'Admin registered successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const getMyDetailsController = async (req, res, next) => {
  try {
    const user = await adminDetailsService.getMyDetails(req.userId);
    ApiResponse.success(user, 'Admin details retrieved successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const updateDetailsController = async (req, res, next) => {
  try {
    const updatedUser = await adminDetailsService.updateDetails(
      req.params.id,
      req.body,
      req.file
    );
    ApiResponse.success(updatedUser, 'Admin updated successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const deleteDetailsController = async (req, res, next) => {
  try {
    await adminDetailsService.deleteDetails(req.params.id);
    ApiResponse.success(null, 'Admin deleted successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const sendForgetPasswordEmail = async (req, res, next) => {
  try {
    await adminDetailsService.sendForgetPasswordEmail(req.body.email);
    ApiResponse.success(null, 'Reset email sent successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const updatePasswordHandler = async (req, res, next) => {
  try {
    await adminDetailsService.updatePassword(
      req.params.resetId,
      req.body.password
    );
    ApiResponse.success(null, 'Password updated successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const updateLoggedInPasswordController = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await adminDetailsService.updateLoggedInPassword(
      req.userId,
      currentPassword,
      newPassword
    );
    return ApiResponse.success(null, 'Password updated successfully').send(res);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginAdminController,
  getAllDetailsController,
  registerAdminController,
  updateDetailsController,
  deleteDetailsController,
  getMyDetailsController,
  sendForgetPasswordEmail,
  updatePasswordHandler,
  updateLoggedInPasswordController,
};
