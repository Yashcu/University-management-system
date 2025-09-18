const studentDetails = require('../models/details/student-details.model');
const resetToken = require('../models/reset-password.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendResetMail = require('../utils/SendMail');
const config = require('../config');
const { USER_ROLES, JWT_EXPIRATION } = require('../utils/constants');
const ApiError = require('../utils/ApiError');

const loginStudent = async (loginData) => {
  const { email, password } = loginData;
  const user = await studentDetails.findOne({ email });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid password');
  }

  const payload = { userId: user._id, role: USER_ROLES.STUDENT };
  return jwt.sign(payload, config.jwtSecret, { expiresIn: JWT_EXPIRATION });
};

const getAllDetails = async () => {
  return studentDetails.find().select('-__v -password').populate('branchId').lean();
};

const registerStudent = async (studentData, file) => {
  const enrollmentNo = Math.floor(100000 + Math.random() * 900000);
  const email = `${enrollmentNo}@gmail.com`;

  const user = await studentDetails.create({
    ...studentData,
    profile: file.path,
    password: 'student123',
    email,
    enrollmentNo,
  });

  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

const getMyDetails = async (userId) => {
  const user = await studentDetails.findById(userId).select('-password -__v').populate('branchId');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

const checkForExistingStudent = async (query, errorMessage) => {
  const existingStudent = await studentDetails.findOne(query);
  if (existingStudent) {
    throw new ApiError(409, errorMessage);
  }
};

const updateDetails = async (studentId, studentData, file) => {
  const { email, phone, password, enrollmentNo } = studentData;

  if (phone) await checkForExistingStudent({ _id: { $ne: studentId }, phone }, 'Phone number already in use');
  if (email) await checkForExistingStudent({ _id: { $ne: studentId }, email }, 'Email already in use');
  if (enrollmentNo) await checkForExistingStudent({ _id: { $ne: studentId }, enrollmentNo }, 'Enrollment number already in use');

  if (password) {
    studentData.password = await bcrypt.hash(password, 10);
  }

  if (file) {
    studentData.profile = file.path;
  }

  if (studentData.dob) studentData.dob = new Date(studentData.dob);

  const updatedUser = await studentDetails
    .findByIdAndUpdate(studentId, studentData, { new: true })
    .select('-__v -password');

  if (!updatedUser) {
    throw new ApiError(404, 'Student not found');
  }

  return updatedUser;
};

const deleteDetails = async (studentId) => {
  const user = await studentDetails.findByIdAndDelete(studentId);
  if (!user) {
    throw new ApiError(404, 'No Student Found');
  }
};

const sendForgetPasswordEmail = async (email) => {
  const user = await studentDetails.findOne({ email });
  if (!user) {
    throw new ApiError(404, 'No Student Found with that email');
  }

  const resetTkn = jwt.sign({ _id: user._id }, config.jwtSecret, { expiresIn: '10m' });

  await resetToken.deleteMany({ type: 'StudentDetails', userId: user._id });
  const resetId = await resetToken.create({ resetToken: resetTkn, type: 'StudentDetails', userId: user._id });

  await sendResetMail(user.email, resetId._id, 'student');
};

const updatePassword = async (resetId, password) => {
  const resetTkn = await resetToken.findById(resetId);
  if (!resetTkn) {
    throw new ApiError(404, 'Invalid or expired password reset link.');
  }

  const decodedToken = jwt.verify(resetTkn.resetToken, config.jwtSecret);
  if (!decodedToken) {
    throw new ApiError(401, 'Token expired or invalid.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await studentDetails.findByIdAndUpdate(decodedToken._id, { password: hashedPassword });
  await resetToken.findByIdAndDelete(resetId);
};

const searchStudents = async (searchData) => {
  const { enrollmentNo, name, semester, branch } = searchData;
  const query = {};

  if (enrollmentNo) query.enrollmentNo = enrollmentNo;
  if (name) {
    query.$or = [
      { firstName: { $regex: name, $options: 'i' } },
      { middleName: { $regex: name, $options: 'i' } },
      { lastName: { $regex: name, $options: 'i' } },
    ];
  }
  if (semester) query.semester = semester;
  if (branch) query.branchId = branch;

  const students = await studentDetails.find(query).select('-password -__v').populate('branchId').sort({ enrollmentNo: 1 });
  if (!students || students.length === 0) {
    throw new ApiError(404, 'No students found');
  }
  return students;
};

const updateLoggedInPassword = async (userId, currentPassword, newPassword) => {
  if (!currentPassword || !newPassword) {
    throw new ApiError(400, 'Current password and new password are required');
  }
  if (newPassword.length < 8) {
    throw new ApiError(400, 'New password must be at least 8 characters long');
  }

  const user = await studentDetails.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();
};

module.exports = {
  loginStudent,
  getAllDetails,
  registerStudent,
  getMyDetails,
  updateDetails,
  deleteDetails,
  sendForgetPasswordEmail,
  updatePassword,
  searchStudents,
  updateLoggedInPassword,
};
