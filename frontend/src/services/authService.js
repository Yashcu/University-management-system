import axiosWrapper from '../utils/AxiosWrapper';

const login = (credentials) => {
  return axiosWrapper.post(`/${credentials.userType}/login`, credentials);
};

const forgetPassword = (emailData) => {
  return axiosWrapper.post('/forget-password', emailData);
};

const updatePassword = (token, type, passwordData) => {
  return axiosWrapper.patch(`/${type}/update-password/${token}`, passwordData);
};

const updateLoggedInPassword = (passwordData) => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.patch('/update-password', passwordData, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
};

export const authService = {
  login,
  forgetPassword,
  updatePassword,
  updateLoggedInPassword,
};
