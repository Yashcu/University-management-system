import axiosWrapper from '../utils/AxiosWrapper';

const getMaterialsBySubject = (subjectId) => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.get(`/material/subject/${subjectId}`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
};

const addMaterial = (formData) => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.post('/material', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${userToken}`,
    },
  });
};

const deleteMaterial = (materialId) => {
  const userToken = localStorage.getItem('userToken');
  return axiosWrapper.delete(`/material/${materialId}`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
};

export const materialService = {
  getMaterialsBySubject,
  addMaterial,
  deleteMaterial,
};
