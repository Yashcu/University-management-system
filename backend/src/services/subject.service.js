const Subject = require('../models/subject.model');
const ApiError = require('../utils/ApiError');

const getSubjects = async (queryParams) => {
  const { branch, semester } = queryParams;
  let query = {};
  if (branch) query.branch = branch;
  if (semester) query.semester = semester;
  const subjects = await Subject.find(query).populate('branch');
  if (!subjects) {
    return [];
  }
  return subjects;
};

const addSubject = async (subjectData) => {
  const { code } = subjectData;
  let subject = await Subject.findOne({ code });
  if (subject) {
    throw new ApiError(409, 'Subject Already Exists');
  }
  return await Subject.create(subjectData);
};

const updateSubject = async (subjectId, subjectData) => {
  if (Object.keys(subjectData).length === 0) {
    throw new ApiError(400, 'No fields provided for update');
  }

  const subject = await Subject.findByIdAndUpdate(subjectId, subjectData, {
    new: true,
  });

  if (!subject) {
    throw new ApiError(404, 'Subject Not Found!');
  }
  return subject;
};

const deleteSubject = async (subjectId) => {
  const subject = await Subject.findByIdAndDelete(subjectId);
  if (!subject) {
    throw new ApiError(404, 'Subject Not Found!');
  }
  return subject;
};

module.exports = {
  getSubjects,
  addSubject,
  updateSubject,
  deleteSubject,
};
