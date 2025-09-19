const studentDetailsService = require('../services/student.service');
const ApiResponse = require('../utils/ApiResponse');
const config = require('../config');

const loginStudentController = async (req, res, next) => {
  try {
    const token = await studentDetailsService.loginStudent(req.body);
    return ApiResponse.success({ token }, 'Login successful').send(res);
  } catch (error) {
    next(error);
  }
};

const getAllDetailsController = async (req, res, next) => {
  try {
    let users;
    if (Object.keys(req.query).length > 0) {
      users = await studentDetailsService.searchStudents(req.query);
    } else {
      users = await studentDetailsService.getAllDetails();
    }
    return ApiResponse.success(users, 'Students retrieved successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const registerStudentController = async (req, res, next) => {
  try {
    const sanitizedUser = await studentDetailsService.registerStudent(
      req.body,
      req.file
    );
    return ApiResponse.created(sanitizedUser, 'Student registered successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const getMyDetailsController = async (req, res, next) => {
  try {
    const user = await studentDetailsService.getMyDetails(req.userId);
    return ApiResponse.success(user, 'Student details retrieved successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const updateDetailsController = async (req, res, next) => {
  try {
    const updatedUser = await studentDetailsService.updateDetails(
      req.params.id,
      req.body,
      req.file
    );
    return ApiResponse.success(updatedUser, 'Student updated successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const deleteDetailsController = async (req, res, next) => {
  try {
    await studentDetailsService.deleteDetails(req.params.id);
    return ApiResponse.success(null, 'Student deleted successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const sendForgetPasswordEmail = async (req, res, next) => {
  try {
    await studentDetailsService.sendForgetPasswordEmail(req.body.email);
    return ApiResponse.success(null, 'Reset email sent successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const updatePasswordHandler = async (req, res, next) => {
  try {
    await studentDetailsService.updatePassword(
      req.params.resetId,
      req.body.password
    );
    return ApiResponse.success(null, 'Password Updated!').send(res);
  } catch (error) {
    next(error);
  }
};


const updateLoggedInPasswordController = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await studentDetailsService.updateLoggedInPassword(
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
  loginStudentController,
  getAllDetailsController,
  registerStudentController,
  updateDetailsController,
  deleteDetailsController,
  getMyDetailsController,
  sendForgetPasswordEmail,
  updatePasswordHandler,
  updateLoggedInPasswordController,
};
