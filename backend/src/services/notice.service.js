const Notice = require('../models/notice.model');
const ApiError = require('../utils/ApiError');

const getAllNotices = async () => {
  const notices = await Notice.find();
  if (!notices || notices.length === 0) {
    throw new ApiError(404, 'No Notices Found');
  }
  return notices;
};

const addNotice = async (noticeData) => {
  return await Notice.create(noticeData);
};

const updateNotice = async (noticeId, noticeData) => {
  if (Object.keys(noticeData).length === 0) {
    throw new ApiError(400, 'No fields provided for update');
  }
  const notice = await Notice.findByIdAndUpdate(noticeId, noticeData, {
    new: true,
  });

  if (!notice) {
    throw new ApiError(404, 'Notice Not Found!');
  }
  return notice;
};

const deleteNotice = async (noticeId) => {
  const notice = await Notice.findByIdAndDelete(noticeId);
  if (!notice) {
    throw new ApiError(404, 'Notice Not Found!');
  }
  return notice;
};

module.exports = {
  getAllNotices,
  addNotice,
  updateNotice,
  deleteNotice,
};
