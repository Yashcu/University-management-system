import axiosWrapper from '../utils/AxiosWrapper';

const search = (searchParams) => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.post('/student/search', searchParams, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
};

const add = (formData) => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.post('/student/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${userToken}`,
    },
  });
};

const update = (studentId, formData) => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.patch(`/student/${studentId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${userToken}`,
    },
  });
};

const del = (studentId) => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.delete(`/student/${studentId}`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
};

export const studentService = {
  search,
  add,
  update,
  delete: del,
};
