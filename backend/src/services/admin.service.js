const adminDetails = require('../models/admin.model');
const resetToken = require('../models/reset-password.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendResetMail = require('../utils/SendMail');
const config = require('../config');
const { USER_ROLES, JWT_EXPIRATION } = require('../utils/constants');
const ApiError = require('../utils/ApiError');
const { checkIfExists } = require('../utils/user.utils');

const loginAdmin = async (loginData) => {
  const { email, password } = loginData;
  const user = await adminDetails.findOne({ email });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid password');
  }

  const payload = { userId: user._id, role: USER_ROLES.ADMIN };

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: JWT_EXPIRATION,
  });
};

const getAllDetails = async () => {
  const users = await adminDetails.find().select('-__v -password');

  if (!users || users.length === 0) {
    throw new ApiError(404, 'No Admin Found');
  }
  return users;
};

const registerAdmin = async (adminData, file) => {
  const { email, phone } = adminData;

  await checkIfExists(
    adminDetails,
    { $or: [{ phone }, { email }] },
    'Admin with this email or phone number already exists'
  );

  const employeeId = Math.floor(100000 + Math.random() * 900000);

  const user = await adminDetails.create({
    ...adminData,
    employeeId,
    profile: file.filename,
    password: 'admin123',
  });

  return await adminDetails.findById(user._id).select('-__v -password');
};

const getMyDetails = async (userId) => {
  const user = await adminDetails.findById(userId).select('-password -__v');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

const updateDetails = async (adminId, adminData, file) => {
  const { email, phone, password } = adminData;

  if (phone) {
    await checkIfExists(
      adminDetails,
      { _id: { $ne: adminId }, phone: phone },
      'Phone number already in use'
    );
  }

  if (email) {
    await checkIfExists(
      adminDetails,
      { _id: { $ne: adminId }, email: email },
      'Email already in use'
    );
  }

  if (password) {
    const salt = await bcrypt.genSalt(10);
    adminData.password = await bcrypt.hash(password, salt);
  }

  if (file) {
    adminData.profile = file.filename;
  }

  if (adminData.dob) {
    adminData.dob = new Date(adminData.dob);
  }
  if (adminData.joiningDate) {
    adminData.joiningDate = new Date(adminData.joiningDate);
  }

  const updatedUser = await adminDetails
    .findByIdAndUpdate(adminId, adminData, { new: true })
    .select('-__v -password');

  if (!updatedUser) {
    throw new ApiError(404, 'Admin not found');
  }
  return updatedUser;
};

const deleteDetails = async (adminId) => {
  if (!adminId) {
    throw new ApiError(400, 'Admin ID is required');
  }

  const user = await adminDetails.findById(adminId);

  if (!user) {
    throw new ApiError(404, 'No Admin Found');
  }

  await adminDetails.findByIdAndDelete(adminId);
};

const sendForgetPasswordEmail = async (email) => {
  if (!email) {
    throw new ApiError(400, 'Email is required');
  }

  const user = await adminDetails.findOne({ email });

  if (!user) {
    throw new ApiError(404, 'No Admin Found');
  }
  const resetTkn = jwt.sign(
    {
      _id: user._id,
    },
    config.jwtSecret,
    {
      expiresIn: '10m',
    }
  );

  await resetToken.deleteMany({
    type: 'AdminDetails',
    userId: user._id,
  });

  const resetId = await resetToken.create({
    resetToken: resetTkn,
    type: 'AdminDetails',
    userId: user._id,
  });

  await sendResetMail(user.email, resetId._id, 'admin');
};

const updatePassword = async (resetId, password) => {
  if (!resetId || !password) {
    throw new ApiError(400, 'Password and ResetId is Required');
  }

  const resetTkn = await resetToken.findById(resetId);

  if (!resetTkn) {
    throw new ApiError(404, 'No Reset Request Found');
  }

  const verifyToken = await jwt.verify(resetTkn.resetToken, config.jwtSecret);

  if (!verifyToken) {
    throw new ApiError(401, 'Token Expired');
  }

  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(password, salt);

  await adminDetails.findByIdAndUpdate(verifyToken._id, {
    password: hashedPassword,
  });

  await resetToken.deleteMany({
    type: 'AdminDetails',
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

  const user = await adminDetails.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await adminDetails.findByIdAndUpdate(userId, {
    password: hashedPassword,
  });
};

module.exports = {
  loginAdmin,
  getAllDetails,
  registerAdmin,
  getMyDetails,
  updateDetails,
  deleteDetails,
  sendForgetPasswordEmail,
  updatePassword,
  updateLoggedInPassword,
};
