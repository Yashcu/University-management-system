export const getAuthHeaders = (isMultipart = false) => {
  const userToken = localStorage.getItem('userToken');
  const headers = {};
  if (userToken) headers.Authorization = `Bearer ${userToken}`;
  if (isMultipart) headers['Content-Type'] = 'multipart/form-data';
  return headers;
};
