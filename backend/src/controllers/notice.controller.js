const noticeService = require('../services/notice.service');
const ApiResponse = require('../utils/ApiResponse');

const getNoticeController = async (req, res, next) => {
  try {
    const notices = await noticeService.getAllNotices();
    return ApiResponse.success(notices, 'Notices retrieved successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const addNoticeController = async (req, res, next) => {
  try {
    const notice = await noticeService.addNotice(req.body);
     return ApiResponse.created(notice, 'Notice created successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const updateNoticeController = async (req, res, next) => {
  try {
    const notice = await noticeService.updateNotice(req.params.id, req.body);
     return ApiResponse.success(notice, 'Notice updated successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const deleteNoticeController = async (req, res, next) => {
  try {
    await noticeService.deleteNotice(req.params.id);
    return ApiResponse.success(null, 'Notice deleted successfully').send(res);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNoticeController,
  addNoticeController,
  updateNoticeController,
  deleteNoticeController,
};
