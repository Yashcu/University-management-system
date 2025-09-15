import axiosWrapper from '../utils/AxiosWrapper';

const getTimetableByBranch = (branchId) => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.get(`/timetable/branch/${branchId}`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
};

const addTimetable = (formData) => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.post('/timetable', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${userToken}`,
    },
  });
};

const deleteTimetable = (timetableId) => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.delete(`/timetable/${timetableId}`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
};

export const timetableService = {
  getTimetableByBranch,
  addTimetable,
  deleteTimetable,
};
