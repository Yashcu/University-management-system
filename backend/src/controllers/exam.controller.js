const examService = require('../services/exam.service');
const ApiResponse = require('../utils/ApiResponse');
const { USER_ROLES } = require('../utils/constants');

const getAllExamsController = async (req, res, next) => {
  try {
    const exams = await examService.getAllExams(req.query);
    return ApiResponse.success(exams, 'All Exams Loaded!').send(res);
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
    return ApiResponse.success(exam, 'Exam Added Successfully!').send(res);
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
    return ApiResponse.success(exam, 'Exam Updated Successfully!').send(res);
  } catch (error) {
    next(error);
  }
};

const deleteExamController = async (req, res, next) => {
  try {
    const exam = await examService.deleteExam(req.params.id);
    return ApiResponse.success(exam, 'Exam Deleted Successfully!').send(res);
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
