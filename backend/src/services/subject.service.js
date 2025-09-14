const Subject = require('../models/subject.model');

const getSubjects = async (queryParams) => {
  const { branch, semester } = queryParams;
  let query = {};
  if (branch) query.branch = branch;
  if (semester) query.semester = semester;
  const subjects = await Subject.find(query).populate('branch');
  if (!subjects || subjects.length === 0) {
    const err = new Error('No Subjects Found');
    err.status = 404;
    throw err;
  }
  return subjects;
};

const addSubject = async (subjectData) => {
  const { code } = subjectData;
  let subject = await Subject.findOne({ code });
  if (subject) {
    const err = new Error('Subject Already Exists');
    err.status = 409;
    throw err;
  }
  return await Subject.create(subjectData);
};

const updateSubject = async (subjectId, subjectData) => {
  if (Object.keys(subjectData).length === 0) {
    const err = new Error('No fields provided for update');
    err.status = 400;
    throw err;
  }

  const subject = await Subject.findByIdAndUpdate(subjectId, subjectData, {
    new: true,
  });

  if (!subject) {
    const err = new Error('Subject Not Found!');
    err.status = 404;
    throw err;
  }
  return subject;
};

const deleteSubject = async (subjectId) => {
  const subject = await Subject.findByIdAndDelete(subjectId);
  if (!subject) {
    const err = new Error('Subject Not Found!');
    err.status = 404;
    throw err;
  }
  return subject;
};

module.exports = {
  getSubjects,
  addSubject,
  updateSubject,
  deleteSubject,
};
