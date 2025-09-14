const facultyDetails = require('../models/details/faculty-details.model');
const resetToken = require('../models/reset-password.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendResetMail = require('../utils/SendMail');
const config = require('../config');
const { USER_ROLES, JWT_EXPIRATION } = require('../utils/constants');

const loginFaculty = async (loginData) => {
  const { email, password } = loginData;
  const user = await facultyDetails.findOne({ email });

  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const err = new Error('Invalid password');
    err.status = 401;
    throw err;
  }

  const payload = { userId: user._id, role: USER_ROLES.FACULTY };

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: JWT_EXPIRATION,
  });
};

const getAllFaculty = async () => {
  const users = await facultyDetails.find().select('-__v -password');
  if (!users || users.length === 0) {
    const err = new Error('No Faculty Found');
    err.status = 404;
    throw err;
  }
  return users;
};

const registerFaculty = async (facultyData, file) => {
  const { email, phone } = facultyData;

  const existing = await facultyDetails.findOne({
    $or: [{ phone }, { email }],
  });
  if (existing) {
    const err = new Error('Faculty with these details already exists');
    err.status = 409;
    throw err;
  }

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
    const existing = await facultyDetails.findOne({
      _id: { $ne: facultyId },
      email,
    });
    if (existing) {
      const err = new Error('Email already in use');
      err.status = 409;
      throw err;
    }
  }

  if (phone) {
    const existing = await facultyDetails.findOne({
      _id: { $ne: facultyId },
      phone,
    });
    if (existing) {
      const err = new Error('Phone number already in use');
      err.status = 409;
      throw err;
    }
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
    const err = new Error('Faculty not found');
    err.status = 404;
    throw err;
  }
  return updatedUser;
};

const deleteFaculty = async (facultyId) => {
  if (!facultyId) {
    const err = new Error('Faculty ID is required');
    err.status = 400;
    throw err;
  }

  const user = await facultyDetails.findByIdAndDelete(facultyId);
  if (!user) {
    const err = new Error('No Faculty Found');
    err.status = 404;
    throw err;
  }
};

const getMyFacultyDetails = async (userId) => {
  const user = await facultyDetails.findById(userId).select('-__v -password');
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  return user;
};

const sendFacultyResetPasswordEmail = async (email) => {
  if (!email) {
    const err = new Error('Email is required');
    err.status = 400;
    throw err;
  }

  const user = await facultyDetails.findOne({ email });
  if (!user) {
    const err = new Error('No Faculty Found');
    err.status = 404;
    throw err;
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
    const err = new Error('Password and ResetId are required');
    err.status = 400;
    throw err;
  }

  const resetTkn = await resetToken.findById(resetId);
  if (!resetTkn) {
    const err = new Error('No Reset Request Found');
    err.status = 404;
    throw err;
  }

  const verifyToken = jwt.verify(resetTkn.resetToken, config.jwtSecret);
  if (!verifyToken) {
    const err = new Error('Token Expired or Invalid');
    err.status = 401;
    throw err;
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
    const err = new Error('Current password and new password are required');
    err.status = 400;
    throw err;
  }

  if (newPassword.length < 8) {
    const err = new Error('New password must be at least 8 characters long');
    err.status = 400;
    throw err;
  }

  const user = await facultyDetails.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    const err = new Error('Current password is incorrect');
    err.status = 401;
    throw err;
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
