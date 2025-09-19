import axiosWrapper from '../lib/AxiosWrapper';
import { getAuthHeaders } from '../lib/apiHelpers';

const getStudentsForMarksEntry = (params) =>
  axiosWrapper.get('/marks/students', { headers: getAuthHeaders(), params });
const addBulkMarks = (marksData) =>
  axiosWrapper.post('/marks/bulk', marksData, { headers: getAuthHeaders() });
const getStudentMarks = (params) =>
  axiosWrapper.get('/marks/student', { headers: getAuthHeaders(), params });

export const marksService = {
  getStudentsForMarksEntry,
  addBulkMarks,
  getStudentMarks,
};
