const express = require('express');
const router = express.Router();

const adminRoutes = require('./admin.routes');
const facultyRoutes = require('./faculty.routes');
const studentRoutes = require('./student.routes');
const branchRoutes = require('./branch.routes');
const subjectRoutes = require('./subject.routes');
const noticeRoutes = require('./notice.routes');
const timetableRoutes = require('./timetable.routes');
const materialRoutes = require('./material.routes');
const examRoutes = require('./exam.routes');
const marksRoutes = require('./marks.routes');

router.use('/v1/admins', adminRoutes);
router.use('/v1/faculty', facultyRoutes);
router.use('/v1/students', studentRoutes);
router.use('/v1/branches', branchRoutes);
router.use('/v1/subjects', subjectRoutes);
router.use('/v1/notices', noticeRoutes);
router.use('/v1/timetables', timetableRoutes);
router.use('/v1/materials', materialRoutes);
router.use('/v1/exams', examRoutes);
router.use('/v1/marks', marksRoutes);

module.exports = router;
