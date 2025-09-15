import axiosWrapper from '../utils/AxiosWrapper';

const search = (searchParams) => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.post('/faculty/search', searchParams, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
};

const add = (formData) => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.post('/faculty/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${userToken}`,
    },
  });
};

const update = (facultyId, formData) => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.patch(`/faculty/${facultyId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${userToken}`,
    },
  });
};

const del = (facultyId) => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.delete(`/faculty/${facultyId}`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
};

export const facultyService = {
  search,
  add,
  update,
  delete: del,
};
