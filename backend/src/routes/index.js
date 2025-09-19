// src/routes/index.js

const express = require('express');
const router = express.Router();

// Import routes
const adminRoutes = require('./admin.route');
const facultyRoutes = require('./faculty.route');
const studentRoutes = require('./student.route');
const branchRoutes = require('./branch.route');
const subjectRoutes = require('./subject.route');
const noticeRoutes = require('./notice.route');
const timetableRoutes = require('./timetable.route');
const materialRoutes = require('./material.route');
const examRoutes = require('./exam.route');
const marksRoutes = require('./marks.route');

// Use routes
router.use('/admin', adminRoutes);
router.use('/faculty', facultyRoutes);
router.use('/student', studentRoutes);
router.use('/branch', branchRoutes);
router.use('/subject', subjectRoutes);
router.use('/notice', noticeRoutes);
router.use('/timetable', timetableRoutes);
router.use('/material', materialRoutes);
router.use('/exam', examRoutes);
router.use('/marks', marksRoutes);

module.exports = router;
