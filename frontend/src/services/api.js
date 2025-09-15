import axiosWrapper from '../utils/AxiosWrapper';

export const createCrudService = (endpoint) => {
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

  return {
    search: (params) =>
      axiosWrapper.get(`/${endpoint}`, { headers: getHeaders(), params }),
    add: (data) =>
      axiosWrapper.post(`/${endpoint}/register`, data, {
        headers: getHeaders(data instanceof FormData),
      }),
    update: (id, data) =>
      axiosWrapper.patch(`/${endpoint}/${id}`, data, {
        headers: getHeaders(data instanceof FormData),
      }),
    delete: (id) =>
      axiosWrapper.delete(`/${endpoint}/${id}`, { headers: getHeaders() }),
  };
};
