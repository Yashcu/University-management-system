import axiosWrapper from '../utils/AxiosWrapper';

const getProfile = () => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.get('/profile', {
    headers: { Authorization: `Bearer ${userToken}` },
  });
};

const updateProfile = (formData) => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.patch('/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${userToken}`,
    },
  });
};

export const profileService = {
  getProfile,
  updateProfile,
};
