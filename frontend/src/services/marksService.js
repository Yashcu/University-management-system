import axiosWrapper from '../utils/AxiosWrapper';

const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('userToken')}`,
});

const getStudentsForMarksEntry = (params) => {
    return axiosWrapper.get('/marks/students', { headers: getHeaders(), params });
};

const addBulkMarks = (marksData) => {
    return axiosWrapper.post('/marks/bulk', marksData, { headers: getHeaders() });
};

const getStudentMarks = (params) => {
    return axiosWrapper.get('/marks/student', { headers: getHeaders(), params });
};

export const marksService = {
    getStudentsForMarksEntry,
    addBulkMarks,
    getStudentMarks,
};
