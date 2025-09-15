import axiosWrapper from '../utils/AxiosWrapper';

const getMarksByExamAndSubject = (examId, subjectId) => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.get(`/marks/exam/${examId}/subject/${subjectId}`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
};

const addOrUpdateMarks = (marksData) => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.post('/marks', marksData, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
};

const getStudentMarks = () => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.get('/marks/student', {
    headers: { Authorization: `Bearer ${userToken}` },
  });
};

export const marksService = {
  getMarksByExamAndSubject,
  addOrUpdateMarks,
  getStudentMarks,
};
