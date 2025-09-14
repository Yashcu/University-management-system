const Notice = require('../models/notice.model');

const getAllNotices = async () => {
  const notices = await Notice.find();
  if (!notices || notices.length === 0) {
    const err = new Error('No Notices Found');
    err.status = 404;
    throw err;
  }
  return notices;
};

const addNotice = async (noticeData) => {
  return await Notice.create(noticeData);
};

const updateNotice = async (noticeId, noticeData) => {
  if (Object.keys(noticeData).length === 0) {
    const err = new Error('No fields provided for update');
    err.status = 400;
    throw err;
  }
  const notice = await Notice.findByIdAndUpdate(noticeId, noticeData, {
    new: true,
  });

  if (!notice) {
    const err = new Error('Notice Not Found!');
    err.status = 404;
    throw err;
  }
  return notice;
};

const deleteNotice = async (noticeId) => {
  const notice = await Notice.findByIdAndDelete(noticeId);
  if (!notice) {
    const err = new Error('Notice Not Found!');
    err.status = 404;
    throw err;
  }
  return notice;
};

module.exports = {
  getAllNotices,
  addNotice,
  updateNotice,
  deleteNotice,
};
