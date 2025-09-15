import axiosWrapper from '../utils/AxiosWrapper';

const search = (searchParams) => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.get('/exam', {
    headers: { Authorization: `Bearer ${userToken}` },
    params: searchParams,
  });
};

const add = (examData) => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.post('/exam', examData, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
};

const update = (examId, examData) => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.patch(`/exam/${examId}`, examData, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
};

const del = (examId) => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.delete(`/exam/${examId}`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
};

export const examService = {
  search,
  add,
  update,
  delete: del,
};
