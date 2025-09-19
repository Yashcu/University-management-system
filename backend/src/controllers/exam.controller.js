const examService = require('../services/exam.service');
const ApiResponse = require('../utils/ApiResponse');
const { USER_ROLES } = require('../utils/constants');

const getAllExamsController = async (req, res, next) => {
  try {
    const exams = await examService.getAllExams(req.query);
    ApiResponse.success(exams, 'Exams retrieved successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const addExamController = async (req, res, next) => {
  try {
    if (req.user.role !== USER_ROLES.ADMIN) {
      return ApiResponse.forbidden(
        'Access denied. Only admins can create exams.'
      ).send(res);
    }

    const exam = await examService.addExam(req.body, req.file);
    ApiResponse.success(exam, 'Exam created successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const updateExamController = async (req, res, next) => {
  try {
    if (req.user.role !== USER_ROLES.ADMIN) {
      return ApiResponse.forbidden(
        'Access denied. Only admins can update exams.'
      ).send(res);
    }

    const exam = await examService.updateExam(
      req.params.id,
      req.body,
      req.file
    );
    ApiResponse.success(exam, 'Exam updated successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const deleteExamController = async (req, res, next) => {
  try {
    const exam = await examService.deleteExam(req.params.id);
    ApiResponse.success(exam, 'Exam deleted successfully').send(res);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllExamsController,
  addExamController,
  updateExamController,
  deleteExamController,
};
