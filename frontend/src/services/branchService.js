import axiosWrapper from '../utils/AxiosWrapper';

const search = (params) => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.get('/branch', {
    headers: { Authorization: `Bearer ${userToken}` },
    params,
  });
};

const add = (branchData) => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.post('/branch', branchData, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
};

const update = (branchId, branchData) => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.patch(`/branch/${branchId}`, branchData, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
};

const del = (branchId) => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.delete(`/branch/${branchId}`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
};

export const branchService = {
  search,
  add,
  update,
  delete: del,
};
