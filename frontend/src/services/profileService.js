import axiosWrapper from '../lib/AxiosWrapper';
import { getAuthHeaders } from '../lib/apiHelpers';

const getMyProfile = () => {
  const userType = localStorage.getItem('userType');
  return axiosWrapper.get(`/${userType}/my-details`, {
    headers: getAuthHeaders(),
  });
};
const updateMyProfile = (id, data) => {
  const userType = localStorage.getItem('userType');
  return axiosWrapper.patch(`/${userType}/${id}`, data, {
    headers: getAuthHeaders(data instanceof FormData),
  });
};
export const profileService = {
  getMyProfile,
  updateMyProfile,
};
