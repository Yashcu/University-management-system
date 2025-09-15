import axiosWrapper from '../utils/AxiosWrapper';

const search = (searchParams) => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.get('/subject', {
    headers: { Authorization: `Bearer ${userToken}` },
    params: searchParams,
  });
};

const add = (subjectData) => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.post('/subject', subjectData, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
};

const update = (subjectId, subjectData) => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.patch(`/subject/${subjectId}`, subjectData, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
};

const del = (subjectId) => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.delete(`/subject/${subjectId}`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
};

export const subjectService = {
  search,
  add,
  update,
  delete: del,
};
