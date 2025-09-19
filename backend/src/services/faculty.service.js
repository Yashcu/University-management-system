const facultyDetails = require('../models/faculty.model');
const resetToken = require('../models/reset-password.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendResetMail = require('../utils/SendMail');
const config = require('../config');
const { USER_ROLES, JWT_EXPIRATION } = require('../utils/constants');
const ApiError = require('../utils/ApiError');
const { checkIfExists } = require('../utils/user.utils');

const loginFaculty = async (loginData) => {
  const { email, password } = loginData;
  const user = await facultyDetails.findOne({ email });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid password');
  }

  const payload = { userId: user._id, role: USER_ROLES.FACULTY };

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: JWT_EXPIRATION,
  });
};

const getAllFaculty = async () => {
  const users = await facultyDetails.find().select('-__v -password');
  if (!users) {
    return [];
  }
  return users;
};

const registerFaculty = async (facultyData, file) => {
  const { email, phone } = facultyData;

  await checkIfExists(
    facultyDetails,
    { $or: [{ phone }, { email }] },
    'Faculty with this email or phone number already exists'
  );

  const employeeId = Math.floor(100000 + Math.random() * 900000);

  const user = await facultyDetails.create({
    ...facultyData,
    employeeId,
    profile: file.filename,
    password: 'faculty123',
  });

  return await facultyDetails.findById(user._id).select('-__v -password');
};

const updateFaculty = async (facultyId, facultyData, file) => {
  const { email, phone, password } = facultyData;

  if (email) {
    await checkIfExists(
      facultyDetails,
      { _id: { $ne: facultyId }, email },
      'Email already in use'
    );
  }

  if (phone) {
    await checkIfExists(
      facultyDetails,
      { _id: { $ne: facultyId }, phone },
      'Phone number already in use'
    );
  }

  if (password) {
    const salt = await bcrypt.genSalt(10);
    facultyData.password = await bcrypt.hash(password, salt);
  }

  if (file) {
    facultyData.profile = file.filename;
  }

  if (facultyData.dob) facultyData.dob = new Date(facultyData.dob);
  if (facultyData.joiningDate)
    facultyData.joiningDate = new Date(facultyData.joiningDate);

  const updatedUser = await facultyDetails
    .findByIdAndUpdate(facultyId, facultyData, { new: true })
    .select('-__v -password');

  if (!updatedUser) {
    throw new ApiError(404, 'Faculty not found');
  }
  return updatedUser;
};

const deleteFaculty = async (facultyId) => {
  if (!facultyId) {
    throw new ApiError(400, 'Faculty ID is required');
  }

  const user = await facultyDetails.findByIdAndDelete(facultyId);
  if (!user) {
    throw new ApiError(404, 'No Faculty Found');
  }
};

const getMyFacultyDetails = async (userId) => {
  const user = await facultyDetails.findById(userId).select('-__v -password');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

const sendFacultyResetPasswordEmail = async (email) => {
  if (!email) {
    throw new ApiError(400, 'Email is required');
  }

  const user = await facultyDetails.findOne({ email });
  if (!user) {
    throw new ApiError(404, 'No Faculty Found');
  }

  const resetTkn = jwt.sign({ _id: user._id }, config.jwtSecret, {
    expiresIn: '10m',
  });

  await resetToken.deleteMany({ type: 'FacultyDetails', userId: user._id });

  const resetId = await resetToken.create({
    resetToken: resetTkn,
    type: 'FacultyDetails',
    userId: user._id,
  });

  await sendResetMail(user.email, resetId._id, 'faculty');
};

const updateFacultyPassword = async (resetId, password) => {
  if (!resetId || !password) {
    throw new ApiError(400, 'Password and ResetId are required');
  }

  const resetTkn = await resetToken.findById(resetId);
  if (!resetTkn) {
    throw new ApiError(404, 'No Reset Request Found');
  }

  const verifyToken = jwt.verify(resetTkn.resetToken, config.jwtSecret);
  if (!verifyToken) {
    throw new ApiError(401, 'Token Expired or Invalid');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await facultyDetails.findByIdAndUpdate(verifyToken._id, {
    password: hashedPassword,
  });

  await resetToken.deleteMany({
    type: 'FacultyDetails',
    userId: verifyToken._id,
  });
};

const updateLoggedInPassword = async (userId, currentPassword, newPassword) => {
  if (!currentPassword || !newPassword) {
    throw new ApiError(400, 'Current password and new password are required');
  }

  if (newPassword.length < 8) {
    throw new ApiError(400, 'New password must be at least 8 characters long');
  }

  const user = await facultyDetails.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await facultyDetails.findByIdAndUpdate(userId, {
    password: hashedPassword,
  });
};

module.exports = {
  loginFaculty,
  getAllFaculty,
  registerFaculty,
  updateFaculty,
  deleteFaculty,
  getMyFacultyDetails,
  sendFacultyResetPasswordEmail,
  updateFacultyPassword,
  updateLoggedInPassword,
};
