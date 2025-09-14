const Marks = require('../models/marks.model');
const Student = require('../models/details/student-details.model');

const getMarks = async (queryParams) => {
  const { studentId, semester, examId } = queryParams;

  const query = { student: studentId };
  if (semester) {
    query.semester = semester;
  }

  if (examId) {
    query.examId = examId;
  }

  const marks = await Marks.find(query)
    .populate('branch', 'name')
    .populate('marks.subject', 'name')
    .populate('student', 'firstName lastName enrollmentNo');

  if (!marks || marks.length === 0) {
    return [];
  }

  return marks;
};

const addMarks = async (marksData) => {
  const { studentId, semester, branch, marks } = marksData;

  if (!studentId || !semester || !branch || !marks || !Array.isArray(marks)) {
    const err = new Error('Invalid input data');
    err.status = 400;
    throw err;
  }

  const student = await Student.findById(studentId);
  if (!student) {
    const err = new Error('Student not found');
    err.status = 404;
    throw err;
  }

  let existingMarks = await Marks.findOne({ student: studentId, semester });

  if (existingMarks) {
    existingMarks.marks = marks;
    await existingMarks.save();
    return existingMarks;
  } else {
    return await Marks.create({
      student: studentId,
      semester,
      branch,
      marks,
    });
  }
};

const deleteMarks = async (marksId) => {
  const deletedMarks = await Marks.findByIdAndDelete(marksId);

  if (!deletedMarks) {
    const err = new Error('Marks not found');
    err.status = 404;
    throw err;
  }
  return deletedMarks;
};

const addBulkMarks = async (bulkMarksData) => {
  const { marks, examId, subjectId, semester } = bulkMarksData;

  const results = [];
  for (const markData of marks) {
    const existingMark = await Marks.findOne({
      studentId: markData.studentId,
      examId,
      subjectId,
      semester,
    });

    if (existingMark) {
      existingMark.marksObtained = markData.obtainedMarks;
      await existingMark.save();
      results.push(existingMark);
    } else {
      const newMark = await Marks.create({
        studentId: markData.studentId,
        examId,
        subjectId,
        semester,
        marksObtained: markData.obtainedMarks,
      });
      results.push(newMark);
    }
  }
  return results;
};

const getStudentsWithMarks = async (queryParams) => {
  const { branch, subject, semester, examId } = queryParams;

  const students = await Student.find({
    branchId: branch,
    semester: Number(semester),
  }).select('_id enrollmentNo firstName lastName');

  if (!students || students.length === 0) {
    return [];
  }

  const marks = await Marks.find({
    studentId: { $in: students.map((s) => s._id) },
    examId,
    subjectId: subject,
    semester: Number(semester),
  });

  return students.map((student) => {
    const studentMarks = marks.find(
      (m) => m.studentId.toString() === student._id.toString()
    );
    return {
      ...student.toObject(),
      obtainedMarks: studentMarks ? studentMarks.marksObtained : 0,
    };
  });
};

const getStudentMarks = async (queryParams, userId) => {
  const { semester } = queryParams;
  const studentId = userId;

  const marks = await Marks.find({
    studentId,
    semester: Number(semester),
  })
    .populate('subjectId', 'name')
    .populate('examId', 'name examType totalMarks');

  if (!marks || marks.length === 0) {
    return [];
  }

  return marks;
};

module.exports = {
  getMarks,
  addMarks,
  deleteMarks,
  addBulkMarks,
  getStudentsWithMarks,
  getStudentMarks,
};
