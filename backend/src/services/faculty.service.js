const facultyDetails = require('../models/faculty.model');
const resetPassword = require('../models/reset-password.model');
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
        throw new ApiError(404, 'Faculty not found with this email');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid credentials');
    }

    const payload = { userId: user._id, role: USER_ROLES.FACULTY };
    return jwt.sign(payload, config.jwtSecret, { expiresIn: JWT_EXPIRATION });
};

const registerFaculty = async (facultyData, file) => {
    const { email, phone } = facultyData;
    await checkIfExists(
        facultyDetails,
        { $or: [{ phone }, { email }] },
        'Faculty with this email or phone number already exists'
    );

    const employeeId = Math.floor(100000 + Math.random() * 900000);
    const profileUrl = file ? file.path : null;

    const faculty = await facultyDetails.create({
        ...facultyData,
        profile: profileUrl,
        password: facultyData.password || 'faculty123',
        employeeId,
    });

    return facultyDetails.findById(faculty._id).populate('branchId', 'name code').select('-__v -password');
};

const updateFaculty = async (facultyId, facultyData, file) => {
    const { email, phone, password } = facultyData;

    if (phone) await checkIfExists(facultyDetails, { _id: { $ne: facultyId }, phone }, 'Phone number already in use');
    if (email) await checkIfExists(facultyDetails, { _id: { $ne: facultyId }, email }, 'Email already in use');

    if (password) {
        facultyData.password = await bcrypt.hash(password, 10);
    }
    if (file) {
        facultyData.profile = file.path;
    }

    const updatedFaculty = await facultyDetails
        .findByIdAndUpdate(facultyId, facultyData, { new: true })
        .populate('branchId', 'name code')
        .select('-__v -password');

    if (!updatedFaculty) {
        throw new ApiError(404, 'Faculty not found');
    }
    return updatedFaculty;
};

const getAllFaculty = async () => {
    const faculty = await facultyDetails
        .find()
        .populate('branchId', 'name code')
        .select('-__v -password')
        .sort({ createdAt: -1 });
    if (!faculty.length) {
        throw new ApiError(404, 'No Faculty Found');
    }
    return faculty;
};

const getMyFacultyDetails = async (userId) => {
    const faculty = await facultyDetails
        .findById(userId)
        .populate('branchId', 'name code')
        .select('-__v -password');

    if (!faculty) {
        throw new ApiError(404, 'Faculty not found');
    }
    return faculty;
};

const deleteFaculty = async (facultyId) => {
    const faculty = await facultyDetails.findByIdAndDelete(facultyId);
    if (!faculty) {
        throw new ApiError(404, 'Faculty not found');
    }
    return { message: 'Faculty deleted successfully' };
};

const sendFacultyResetPasswordEmail = async (email) => {
    const user = await facultyDetails.findOne({ email });
    if (!user) throw new ApiError(404, 'Faculty not found with this email');

    const token = jwt.sign({ _id: user._id }, config.jwtSecret, { expiresIn: '10m' });

    await resetPassword.deleteMany({ userId: user._id, type: 'FacultyDetail' });
    const reset = await resetPassword.create({
        resetToken: token,
        type: 'FacultyDetail',
        userId: user._id,
    });

    await sendResetMail(user.email, reset._id, 'faculty');
};

const updateFacultyPassword = async (resetId, password) => {
    const reset = await resetPassword.findById(resetId);
    if (!reset) throw new ApiError(404, 'Invalid or expired reset link');

    const decoded = jwt.verify(reset.resetToken, config.jwtSecret);
    const hashedPassword = await bcrypt.hash(password, 10);

    await facultyDetails.findByIdAndUpdate(decoded._id, { password: hashedPassword });
    await resetPassword.deleteMany({ userId: decoded._id });
};

const updateLoggedInPassword = async (userId, currentPassword, newPassword) => {
    const user = await facultyDetails.findById(userId);
    if (!user) throw new ApiError(404, 'Faculty not found');

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new ApiError(401, 'Incorrect current password');

    user.password = newPassword;
    await user.save();
};

module.exports = {
  registerFaculty,
  updateFaculty,
  getAllFaculty,
  getMyFacultyDetails,
  deleteFaculty,
  loginFaculty,
  sendFacultyResetPasswordEmail,
  updateFacultyPassword,
  updateLoggedInPassword,
};
