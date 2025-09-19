const subjectService = require('../services/subject.service');
const ApiResponse = require('../utils/ApiResponse');

const getSubjectController = async (req, res, next) => {
  try {
    const subjects = await subjectService.getSubjects(req.query);
    return ApiResponse.success(subjects, 'Subjects retrieved successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const addSubjectController = async (req, res, next) => {
  try {
    const newSubject = await subjectService.addSubject(req.body);
    return ApiResponse.created(newSubject, 'Subject created successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const updateSubjectController = async (req, res, next) => {
  try {
    const subject = await subjectService.updateSubject(req.params.id, req.body);
    return ApiResponse.success(subject, 'Subject updated successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const deleteSubjectController = async (req, res, next) => {
  try {
    await subjectService.deleteSubject(req.params.id);
    return ApiResponse.success(null, 'Subject deleted successfully').send(res);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSubjectController,
  addSubjectController,
  deleteSubjectController,
  updateSubjectController,
};
