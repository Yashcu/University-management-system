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

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: JWT_EXPIRATION,
  });
};

const getAllDetails = async () => {
  const users = await studentDetails
    .find()
    .select('-__v -password')
    .populate('branchId');

  if (!users || users.length === 0) {
    throw new ApiError(404, 'No Student Found');
  }
  return users;
};

const registerStudent = async (studentData, file) => {
  const profile = file.filename;
  const enrollmentNo = Math.floor(100000 + Math.random() * 900000);
  const email = `${enrollmentNo}@gmail.com`;

  const user = await studentDetails.create({
    ...studentData,
    profile,
    password: 'student123',
    email,
    enrollmentNo,
  });

  return await studentDetails.findById(user._id).select('-__v -password');
};

const getMyDetails = async (userId) => {
  const user = await studentDetails
    .findById(userId)
    .select('-password -__v')
    .populate('branchId');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

const updateDetails = async (studentId, studentData, file) => {
  const { email, phone, password, enrollmentNo } = studentData;

  if (phone) {
    const existingStudent = await studentDetails.findOne({
      _id: { $ne: studentId },
      phone: phone,
    });

    if (existingStudent) {
      throw new ApiError(409, 'Phone number already in use');
    }
  }

  if (email) {
    const existingStudent = await studentDetails.findOne({
      _id: { $ne: studentId },
      email: email,
    });

    if (existingStudent) {
      throw new ApiError(409, 'Email already in use');
    }
  }

  if (enrollmentNo) {
    const existingStudent = await studentDetails.findOne({
      _id: { $ne: studentId },
      enrollmentNo: enrollmentNo,
    });

    if (existingStudent) {
      throw new ApiError(409, 'Enrollment number already in use');
    }
  }

  if (password) {
    const salt = await bcrypt.genSalt(10);
    studentData.password = await bcrypt.hash(password, salt);
  }

  if (file) {
    studentData.profile = file.filename;
  }

  if (studentData.dob) {
    studentData.dob = new Date(studentData.dob);
  }
  if (studentData.joiningDate) {
    studentData.joiningDate = new Date(studentData.joiningDate);
  }

  const updatedUser = await studentDetails
    .findByIdAndUpdate(studentId, studentData, { new: true }) // { new: true } returns the updated document
    .select('-__v -password');

  if (!updatedUser) {
    throw new ApiError(404, 'Student not found');
  }

  return updatedUser;
};

const deleteDetails = async (studentId) => {
  if (!studentId) {
    throw new ApiError(400, 'Student ID is required');
  }

  const user = await studentDetails.findById(studentId);

  if (!user) {
    throw new ApiError(404, 'No Student Found');
  }

  await studentDetails.findByIdAndDelete(studentId);
};

const sendForgetPasswordEmail = async (email) => {
  if (!email) {
    throw new ApiError(400, 'Email is required');
  }

  const user = await studentDetails.findOne({ email });

  if (!user) {
    throw new ApiError(404, 'No Student Found');
  }
  const resetTkn = jwt.sign(
    {
      _id: user._id,
    },
    config.JWT_SECRET,
    {
      expiresIn: '10m',
    }
  );

  await resetToken.deleteMany({
    type: 'StudentDetails',
    userId: user._id,
  });

  const resetId = await resetToken.create({
    resetToken: resetTkn,
    type: 'StudentDetails',
    userId: user._id,
  });

  await sendResetMail(user.email, resetId._id, 'student');
};

const updatePassword = async (resetId, password) => {
  if (!resetId || !password) {
    throw new ApiError(400, 'Password and ResetId is Required');
  }

  const resetTkn = await resetToken.findById(resetId);

  if (!resetTkn) {
    throw new ApiError(404, 'No Reset Request Found');
  }

  const verifyToken = await jwt.verify(
    resetTkn.resetToken,
    process.env.JWT_SECRET
  );

  if (!verifyToken) {
    throw new ApiError(401, 'Token Expired');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await studentDetails.findByIdAndUpdate(verifyToken._id, {
    password: hashedPassword,
  });

  await resetToken.deleteMany({
    type: 'StudentDetails',
    userId: verifyToken._id,
  });
};

const searchStudents = async (searchData) => {
  const { enrollmentNo, name, semester, branch } = searchData;
  let query = {};

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

  const students = await studentDetails
    .find(query)
    .select('-password -__v')
    .populate('branchId')
    .sort({ enrollmentNo: 1 });

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

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await studentDetails.findByIdAndUpdate(userId, {
    password: hashedPassword,
  });
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
