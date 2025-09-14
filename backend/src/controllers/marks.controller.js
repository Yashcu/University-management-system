const marksService = require('../services/marks.service');
const ApiResponse = require('../utils/ApiResponse');
const { USER_ROLES } = require('../utils/constants');

const getMarksController = async (req, res, next) => {
  try {
    const marks = await marksService.getMarks(req.query);
    // Note: This controller has a custom success response structure
    res.json({
      success: true,
      message: 'Marks retrieved successfully',
      data: marks,
    });
  } catch (error) {
    next(error);
  }
};

const addMarksController = async (req, res, next) => {
  try {
    const existingMarks = await marksService.addMarks(req.body);
    res.json({
      success: true,
      message: 'Marks updated successfully',
      data: existingMarks,
    });
  } catch (error) {
    next(error);
  }
};

const deleteMarksController = async (req, res, next) => {
  try {
    await marksService.deleteMarks(req.params.id);
    res.json({
      success: true,
      message: 'Marks deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const addBulkMarksController = async (req, res, next) => {
  try {
    if (req.user.role !== USER_ROLES.FACULTY) {
      return ApiResponse.forbidden(
        'Access denied. Only faculty can submit marks.'
      ).send(res);
    }
    const results = await marksService.addBulkMarks(req.body);
    return ApiResponse.success(results, 'Marks submitted successfully').send(
      res
    );
  } catch (error) {
    next(error);
  }
};

const getStudentsWithMarksController = async (req, res, next) => {
  try {
    const studentsWithMarks = await marksService.getStudentsWithMarks(
      req.query
    );
    res.json({
      success: true,
      message: 'Students retrieved successfully with marks',
      data: studentsWithMarks,
    });
  } catch (error) {
    next(error);
  }
};

const getStudentMarksController = async (req, res, next) => {
  try {
    const marks = await marksService.getStudentMarks(req.query, req.userId);
    res.json({
      success: true,
      message: 'Marks retrieved successfully',
      data: marks,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMarksController,
  addMarksController,
  deleteMarksController,
  addBulkMarksController,
  getStudentsWithMarksController,
  getStudentMarksController,
};
