const facultyDetailsService = require('../services/faculty.service');
const ApiResponse = require('../utils/ApiResponse');

const loginFacultyController = async (req, res, next) => {
  try {
    const token = await facultyDetailsService.loginFaculty(req.body);
    return ApiResponse.success({ token }, 'Login successful').send(res);
  } catch (error) {
    next(error);
  }
};

const getAllFacultyController = async (req, res, next) => {
  try {
    const users = await facultyDetailsService.getAllFaculty();
    return ApiResponse.success(users, 'Faculty retrieved successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const registerFacultyController = async (req, res, next) => {
  try {
    const sanitizedUser = await facultyDetailsService.registerFaculty(
      req.body,
      req.file
    );
    return ApiResponse.created(sanitizedUser,'Faculty registered successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const updateFacultyController = async (req, res, next) => {
  try {
    const updatedUser = await facultyDetailsService.updateFaculty(
      req.params.id,
      req.body,
      req.file
    );
    return ApiResponse.success(updatedUser, 'Faculty updated successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const deleteFacultyController = async (req, res, next) => {
  try {
    await facultyDetailsService.deleteFaculty(req.params.id);
    return ApiResponse.success(null, 'Faculty deleted successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const getMyFacultyDetailsController = async (req, res, next) => {
  try {
    const user = await facultyDetailsService.getMyFacultyDetails(req.userId);
    return ApiResponse.success(user, 'Faculty details retrieved successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const sendFacultyResetPasswordEmail = async (req, res, next) => {
  try {
    await facultyDetailsService.sendFacultyResetPasswordEmail(req.body.email);
    return ApiResponse.success(null, 'Reset email sent successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const updateFacultyPasswordHandler = async (req, res, next) => {
  try {
    await facultyDetailsService.updateFacultyPassword(
      req.params.resetId,
      req.body.password
    );
    return ApiResponse.success(null, 'Password updated successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const updateLoggedInPasswordController = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await facultyDetailsService.updateLoggedInPassword(
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
  loginFacultyController,
  registerFacultyController,
  updateFacultyController,
  deleteFacultyController,
  getAllFacultyController,
  getMyFacultyDetailsController,
  sendFacultyResetPasswordEmail,
  updateFacultyPasswordHandler,
  updateLoggedInPasswordController,
};
