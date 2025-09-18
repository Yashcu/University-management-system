import axios from 'axios';
import { logout } from '../redux/authSlice';

const axiosWrapper = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const setupInterceptors = (store) => {
  axiosWrapper.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        store.dispatch(logout());
      }
      return Promise.reject(error);
    }
  );
};

export default axiosWrapper;
