const timetableService = require('../services/timetable.service');
const ApiResponse = require('../utils/ApiResponse');
const { USER_ROLES } = require('../utils/constants');

const getTimetableController = async (req, res, next) => {
  try {
    const timetables = await timetableService.getTimetables(req.query);
    return ApiResponse.success(timetables,'Timetables retrieved successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const addTimetableController = async (req, res, next) => {
  try {
    if (req.user.role !== USER_ROLES.ADMIN) {
      return ApiResponse.forbidden(
        'Access denied. Only admins can add timetables.'
      ).send(res);
    }
    const timetable = await timetableService.addTimetable(req.body, req.file);
    return ApiResponse.created(timetable, 'Timetable created successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const updateTimetableController = async (req, res, next) => {
  try {
    if (req.user.role !== USER_ROLES.ADMIN) {
      return ApiResponse.forbidden(
        'Access denied. Only admins can update timetables.'
      ).send(res);
    }

    const timetable = await timetableService.updateTimetable(
      req.params.id,
      req.body,
      req.file
    );
    return ApiResponse.success(timetable,'Timetable updated successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const deleteTimetableController = async (req, res, next) => {
  try {
    if (req.user.role !== USER_ROLES.ADMIN) {
      return ApiResponse.forbidden(
        'Access denied. Only admins can delete timetables.'
      ).send(res);
    }
    await timetableService.deleteTimetable(req.params.id);
    return ApiResponse.success(null, 'Timetable deleted successfully').send(res);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTimetableController,
  addTimetableController,
  updateTimetableController,
  deleteTimetableController,
};
