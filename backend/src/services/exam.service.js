const Exam = require('../models/exam.model');
const ApiError = require('../utils/ApiError');

const getAllExams = async (queryParams) => {
  const { examType = '', semester = '' } = queryParams;

  let query = {};

  if (semester) query.semester = semester;
  if (examType) query.examType = examType;

  const exams = await Exam.find(query);

  if (!exams || exams.length === 0) {
    throw new ApiError(404, 'No Exams Found');
  }
  return exams;
};

const addExam = async (examData, file) => {
  if (file) {
    examData.timetableLink = file.filename;
  }
  return await Exam.create(examData);
};

const updateExam = async (examId, examData, file) => {
  if (file) {
    examData.timetableLink = file.filename;
  }
  const exam = await Exam.findByIdAndUpdate(examId, examData, {
    new: true,
  });
  if (!exam) {
    throw new ApiError(404, 'Exam Not Found!');
  }
  return exam;
};

const deleteExam = async (examId) => {
  const exam = await Exam.findByIdAndDelete(examId);
  if (!exam) {
    throw new ApiError(404, 'Exam Not Found!');
  }
  return exam;
};

module.exports = {
  getAllExams,
  addExam,
  updateExam,
  deleteExam,
};
