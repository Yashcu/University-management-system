const adminDetails = require('../models/admin.model');
const resetPassword = require('../models/reset-password.model');
const bcrypt = require('bcryptjs');
const jwt =('jsonwebtoken');
const sendResetMail = require('../utils/SendMail');
const config = require('../config');
const { USER_ROLES, JWT_EXPIRATION } = require('../utils/constants');
const ApiError = require('../utils/ApiError');
const { checkIfExists } = require('../utils/user.utils');

const loginAdmin = async (loginData) => {
  const { email, password } = loginData;
  const user = await adminDetails.findOne({ email });

  if (!user) {
    throw new ApiError(404, 'Admin not found with this email');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const payload = { userId: user._id, role: USER_ROLES.ADMIN };

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: JWT_EXPIRATION,
  });
};

const getAllDetails = async () => {
  const users = await adminDetails.find().select('-__v -password');
  if (!users.length) {
    throw new ApiError(404, 'No Admins Found');
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

  const profileUrl = file ? file.path : null;

  const user = await adminDetails.create({
    ...adminData,
    employeeId,
    profile: profileUrl,
    password: 'admin123',
  });

  return adminDetails.findById(user._id).select('-__v -password');
};

const getMyDetails = async (userId) => {
  const user = await adminDetails.findById(userId).select('-password -__v');
  if (!user) {
    throw new ApiError(404, 'Admin not found');
  }
  return user;
};

const updateDetails = async (adminId, adminData, file) => {
  const { email, phone, password } = adminData;

  if (phone) {
    await checkIfExists(
      adminDetails,
      { _id: { $ne: adminId }, phone },
      'Phone number already in use'
    );
  }

  if (email) {
    await checkIfExists(
      adminDetails,
      { _id: { $ne: adminId }, email },
      'Email already in use'
    );
  }

  if (password) {
    adminData.password = await bcrypt.hash(password, 10);
  }

  if (file) {
    adminData.profile = file.path;
  }

  if (adminData['emergencyContact.name']) {
    adminData.emergencyContact = {
      name: adminData['emergencyContact.name'],
      relationship: adminData['emergencyContact.relationship'],
      phone: adminData['emergencyContact.phone'],
    };
    delete adminData['emergencyContact.name'];
    delete adminData['emergencyContact.relationship'];
    delete adminData['emergencyContact.phone'];
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
  const user = await adminDetails.findByIdAndDelete(adminId);
  if (!user) {
    throw new ApiError(404, 'Admin not found');
  }
  return { message: 'Admin deleted successfully' };
};

const sendForgetPasswordEmail = async (email) => {
  const user = await adminDetails.findOne({ email });
  if (!user) {
    throw new ApiError(404, 'Admin not found with this email');
  }

  const token = jwt.sign({ _id: user._id }, config.jwtSecret, { expiresIn: '10m' });

  await resetPassword.deleteMany({ userId: user._id, type: 'AdminDetail' });
    const reset = await resetPassword.create({
        resetToken: token,
        type: 'AdminDetail',
        userId: user._id,
    });

  await sendResetMail(user.email, reset._id, 'admin');
};

const updatePassword = async (resetId, password) => {
    const reset = await resetPassword.findById(resetId);
    if (!reset) {
        throw new ApiError(404, 'Invalid or expired reset link');
    }

    const decoded = jwt.verify(reset.resetToken, config.jwtSecret);
    const hashedPassword = await bcrypt.hash(password, 10);

    await adminDetails.findByIdAndUpdate(decoded._id, { password: hashedPassword });
    await resetPassword.deleteMany({ userId: decoded._id });
};

const updateLoggedInPassword = async (userId, currentPassword, newPassword) => {
    const user = await adminDetails.findById(userId);
    if (!user) {
        throw new ApiError(404, 'Admin not found');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        throw new ApiError(401, 'Incorrect current password');
    }

    user.password = newPassword;
    await user.save();
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
