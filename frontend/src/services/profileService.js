import axiosWrapper from '../utils/AxiosWrapper';

const getHeaders = (isMultipart = false) => {
  const userToken = localStorage.getItem('userToken');
  const headers = {};
  if (userToken) {
    headers.Authorization = `Bearer ${userToken}`;
  }
  if (isMultipart) {
    headers['Content-Type'] = 'multipart/form-data';
  }
  return headers;
};

const getMyProfile = () => {
  const userType = localStorage.getItem('userType');
  return axiosWrapper.get(`/${userType}/my-details`, { headers: getHeaders() });
};

const updateMyProfile = (id, data) => {
  const userType = localStorage.getItem('userType');
  return axiosWrapper.patch(`/${userType}/${id}`, data, {
    headers: getHeaders(data instanceof FormData),
  });
};

export const profileService = {
  getMyProfile,
  updateMyProfile,
};
