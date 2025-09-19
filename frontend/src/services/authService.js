import axiosWrapper from '../utils/AxiosWrapper';

const login = (credentials) => {
  return axiosWrapper.post(`/${credentials.userType}/login`, credentials);
};

const forgetPassword = (emailData) => {
  const userType = emailData.userType || 'student';
  return axiosWrapper.post(`/${userType}/forget-password`, emailData);
};

const updatePassword = (token, type, passwordData) => {
  return axiosWrapper.post(`/${type}/update-password/${token}`, {
    password: passwordData.newPassword,
  });
};

const updateLoggedInPassword = (passwordData) => {
  const userToken = localStorage.getItem('userToken');
  const userType = localStorage.getItem('userType');
  return axiosWrapper.post(`/${userType}/change-password`, passwordData, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
};

export const authService = {
  login,
  forgetPassword,
  updatePassword,
  updateLoggedInPassword,
};
