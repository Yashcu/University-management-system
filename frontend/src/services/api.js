import axiosWrapper from '../utils/AxiosWrapper';

export const createCrudService = (endpoint) => {
  const userToken = localStorage.getItem('userToken');
  const headers = { Authorization: `Bearer ${userToken}` };
  const multipartHeaders = {
    ...headers,
    'Content-Type': 'multipart/form-data',
  };

  return {
    search: (params) =>
      axiosWrapper.get(`/${endpoint}/search`, { headers, params }),
    add: (data) =>
      axiosWrapper.post(`/${endpoint}/register`, data, {
        headers:
          data instanceof FormData ? multipartHeaders : headers,
      }),
    update: (id, data) =>
      axiosWrapper.patch(`${endpoint}/${id}`, data, {
        headers:
          data instanceof FormData ? multipartHeaders : headers,
      }),
    delete: (id) => axiosWrapper.delete(`${endpoint}/${id}`, { headers }),
  };
};
