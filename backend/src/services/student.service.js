const studentDetails = require('../models/student.model');
const resetPassword = require('../models/reset-password.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendResetMail = require('../utils/SendMail');
const config = require('../config');
const { USER_ROLES, JWT_EXPIRATION } = require('../utils/constants');
const ApiError = require('../utils/ApiError');
const { checkIfExists } = require('../utils/user.utils');

const loginStudent = async (loginData) => {
  const { email, password } = loginData;
  const user = await studentDetails.findOne({ email });

  if (!user) {
    throw new ApiError(404, 'Student not found with email');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const payload = { userId: user._id, role: USER_ROLES.STUDENT };
  return jwt.sign(payload, config.jwtSecret, { expiresIn: JWT_EXPIRATION });
};

const registerStudent = async (studentData, file) => {
  const { phone } = studentData;

  await checkIfExists(
    studentDetails,
    { phone },
    'A student with this phone number already exists'
  );

  const enrollmentNo = Math.floor(100000 + Math.random() * 900000);
  const email = `${enrollmentNo}@${config.appDomain || 'college.com'}`; // Use a configurable domain
  const profileUrl = file ? file.path : null;

  const user = await studentDetails.create({
    ...studentData,
    profile: profileUrl,
    password: studentData.password || 'student123',
    email,
    enrollmentNo,
  });

  return studentDetails
    .findById(user._id)
    .populate('branchId', 'name code')
    .select('-__v -password');
};

const updateDetails = async (studentId, studentData, file) => {
  const { email, phone, password, enrollmentNo } = studentData;

  if (phone)
    await checkIfExists(
      studentDetails,
      { _id: { $ne: studentId }, phone },
      'Phone number already in use'
    );
  if (email)
    await checkIfExists(
      studentDetails,
      { _id: { $ne: studentId }, email },
      'Email already in use'
    );
  if (enrollmentNo)
    await checkIfExists(
      studentDetails,
      { _id: { $ne: studentId }, enrollmentNo },
      'Enrollment number already in use'
    );

  if (password) {
    studentData.password = await bcrypt.hash(password, 10);
  }

  if (file) {
    studentData.profile = file.path;
  }

  const updatedUser = await studentDetails
    .findByIdAndUpdate(studentId, studentData, { new: true })
    .populate('branchId', 'name code')
    .select('-__v -password');

  if (!updatedUser) {
    throw new ApiError(404, 'Student not found');
  }
  return updatedUser;
};

const getAllDetails = async () => {
  const students = await studentDetails
    .find()
    .populate('branchId', 'name code')
    .select('-__v -password')
    .sort({ createdAt: -1 });

  if (!students.length) {
    throw new ApiError(404, 'No Students Found');
  }
  return students;
};

const searchStudents = async (query) => {
  const searchConditions = [];
  Object.keys(query).forEach((key) => {
    if (query[key]) {
      if (['enrollmentNo', 'semester'].includes(key)) {
        searchConditions.push({ [key]: parseInt(query[key]) });
      } else {
        searchConditions.push({ [key]: new RegExp(query[key], 'i') });
      }
    }
  });
  const students = await studentDetails
    .find(searchConditions.length > 0 ? { $or: searchConditions } : {})
    .populate('branchId', 'name code')
    .select('-__v -password')
    .sort({ createdAt: -1 });

  return students;
};

const getMyDetails = async (userId) => {
  const user = await studentDetails
    .findById(userId)
    .populate('branchId', 'name code')
    .select('-__v -password');

  if (!user) {
    throw new ApiError(404, 'Student not found');
  }
  return user;
};

const deleteDetails = async (studentId) => {
  const student = await studentDetails.findByIdAndDelete(studentId);
  if (!student) {
    throw new ApiError(404, 'Student not found');
  }
  return { message: 'Student deleted successfully' };
};

const sendForgetPasswordEmail = async (email) => {
  const user = await studentDetails.findOne({ email });
  if (!user) throw new ApiError(404, 'Student not found with this email');

  const token = jwt.sign({ _id: user._id }, config.jwtSecret, { expiresIn: '10m' });

  await resetPassword.deleteMany({ userId: user._id, type: 'StudentDetail' });
  const reset = await resetPassword.create({
    resetToken: token,
    type: 'StudentDetail',
    userId: user._id,
  });

  await sendResetMail(user.email, reset._id, 'student');
};

const updatePassword = async (resetId, password) => {
  const reset = await resetPassword.findById(resetId);
  if (!reset) throw new ApiError(404, 'Invalid or expired reset link');

  const decoded = jwt.verify(reset.resetToken, config.jwtSecret);
  const hashedPassword = await bcrypt.hash(password, 10);

  await studentDetails.findByIdAndUpdate(decoded._id, { password: hashedPassword });
  await resetPassword.deleteMany({ userId: decoded._id });
};

const updateLoggedInPassword = async (userId, currentPassword, newPassword) => {
  const user = await studentDetails.findById(userId);
  if (!user) throw new ApiError(404, 'Student not found');

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new ApiError(401, 'Incorrect current password');

  user.password = newPassword;
  await user.save();
};

module.exports = {
  registerStudent,
  updateDetails,
  getAllDetails,
  searchStudents,
  getMyDetails,
  deleteDetails,
  loginStudent,
  sendForgetPasswordEmail,
  updatePassword,
  updateLoggedInPassword,
};
