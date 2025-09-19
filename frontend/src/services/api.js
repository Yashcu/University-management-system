import axiosWrapper from '../lib/AxiosWrapper';

const getAuthHeaders = (isMultipart = false) => {
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

export const createCrudService = (endpoint) => ({
  search: (params) =>
    axiosWrapper.get(`/${endpoint}`, { headers: getAuthHeaders(), params }),
  getById: (id) =>
    axiosWrapper.get(`/${endpoint}/${id}`, { headers: getAuthHeaders() }),
  add: (data, path = '') =>
    axiosWrapper.post(`/${endpoint}${path}`, data, {
      headers: getAuthHeaders(data instanceof FormData),
    }),
  update: (id, data) =>
    axiosWrapper.patch(`/${endpoint}/${id}`, data, {
      headers: getAuthHeaders(data instanceof FormData),
    }),
  delete: (id) =>
    axiosWrapper.delete(`/${endpoint}/${id}`, { headers: getAuthHeaders() }),
});

export const adminService = createCrudService('admin');
export const branchService = createCrudService('branch');
export const examService = createCrudService('exam');
export const facultyService = createCrudService('faculty');
export const materialService = createCrudService('material');
export const noticeService = createCrudService('notice');
export const studentService = createCrudService('student');
export const subjectService = createCrudService('subject');
export const timetableService = createCrudService('timetable');
