const studentDetails = require('../models/details/student-details.model');
const resetToken = require('../models/reset-password.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendResetMail = require('../utils/SendMail');
const config = require('../config');
const { USER_ROLES, JWT_EXPIRATION } = require('../utils/constants');

const loginStudent = async (loginData) => {
  const { email, password } = loginData;

  const user = await studentDetails.findOne({ email });

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
    const err = new Error('No Student Found');
    err.status = 404;
    throw err;
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
    const err = new Error('User not found');
    err.status = 404;
    throw err;
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
      const err = new Error('Phone number already in use');
      err.status = 409;
      throw err;
    }
  }

  if (email) {
    const existingStudent = await studentDetails.findOne({
      _id: { $ne: studentId },
      email: email,
    });

    if (existingStudent) {
      const err = new Error('Email already in use');
      err.status = 409;
      throw err;
    }
  }

  if (enrollmentNo) {
    const existingStudent = await studentDetails.findOne({
      _id: { $ne: studentId },
      enrollmentNo: enrollmentNo,
    });

    if (existingStudent) {
      const err = new Error('Enrollment number already in use');
      err.status = 409;
      throw err;
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
    const err = new Error('Student not found');
    err.status = 404;
    throw err;
  }

  return updatedUser;
};

const deleteDetails = async (studentId) => {
  if (!studentId) {
    const err = new Error('Student ID is required');
    err.status = 400;
    throw err;
  }

  const user = await studentDetails.findById(studentId);

  if (!user) {
    const err = new Error('No Student Found');
    err.status = 404;
    throw err;
  }

  await studentDetails.findByIdAndDelete(studentId);
};

const sendForgetPasswordEmail = async (email) => {
  if (!email) {
    const err = new Error('Email is required');
    err.status = 400;
    throw err;
  }

  const user = await studentDetails.findOne({ email });

  if (!user) {
    const err = new Error('No Student Found');
    err.status = 404;
    throw err;
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
    const err = new Error('Password and ResetId is Required');
    err.status = 400;
    throw err;
  }

  const resetTkn = await resetToken.findById(resetId);

  if (!resetTkn) {
    const err = new Error('No Reset Request Found');
    err.status = 404;
    throw err;
  }

  const verifyToken = await jwt.verify(
    resetTkn.resetToken,
    process.env.JWT_SECRET
  );

  if (!verifyToken) {
    const err = new Error('Token Expired');
    err.status = 401;
    throw err;
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
    const err = new Error('No students found');
    err.status = 404;
    throw err;
  }
  return students;
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

  const user = await studentDetails.findById(userId);
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
