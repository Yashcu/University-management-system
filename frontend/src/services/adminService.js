import axiosWrapper from '../utils/AxiosWrapper';

const search = (searchParams) => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.post('/admin/search', searchParams, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
};

const add = (adminData) => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.post('/admin/register', adminData, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
};

const update = (adminId, adminData) => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.patch(`/admin/${adminId}`, adminData, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
};

const del = (adminId) => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.delete(`/admin/${adminId}`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
};

export const adminService = {
  search,
  add,
  update,
  delete: del,
};
