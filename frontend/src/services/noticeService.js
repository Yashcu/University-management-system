import axiosWrapper from '../utils/AxiosWrapper';

const getAllNotices = () => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.get('/notice', {
    headers: { Authorization: `Bearer ${userToken}` },
  });
};

const addNotice = (noticeData) => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.post('/notice', noticeData, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
};

export const noticeService = {
  getAllNotices,
  addNotice,
};
