const Timetable = require('../models/timetable.model');

const getTimetables = async (queryParams) => {
  const { semester, branch } = queryParams;
  let query = {};

  if (semester) query.semester = semester;
  if (branch) query.branch = branch;

  const timetables = await Timetable.find(query)
    .populate('branch')
    .sort({ createdAt: -1 });

  if (!timetables || timetables.length === 0) {
    const err = new Error('No timetables found');
    err.status = 404;
    throw err;
  }
  return timetables;
};

const addTimetable = async (timetableData, file) => {
  const { semester, branch } = timetableData;

  if (!file) {
    const err = new Error('Timetable file is required');
    err.status = 400;
    throw err;
  }

  let timetable = await Timetable.findOne({ semester, branch });

  if (timetable) {
    return await Timetable.findByIdAndUpdate(
      timetable._id,
      {
        semester,
        branch,
        link: file.filename,
      },
      { new: true }
    );
  }

  return await Timetable.create({
    semester,
    branch,
    link: file.filename,
  });
};

const updateTimetable = async (timetableId, timetableData, file) => {
  const { semester, branch } = timetableData;
  const timetable = await Timetable.findByIdAndUpdate(
    timetableId,
    {
      semester,
      branch,
      link: file ? file.filename : undefined,
    },
    { new: true }
  );

  if (!timetable) {
    const err = new Error('Timetable not found');
    err.status = 404;
    throw err;
  }
  return timetable;
};

const deleteTimetable = async (timetableId) => {
  const timetable = await Timetable.findByIdAndDelete(timetableId);

  if (!timetable) {
    const err = new Error('Timetable not found');
    err.status = 404;
    throw err;
  }
  return timetable;
};

module.exports = {
  getTimetables,
  addTimetable,
  updateTimetable,
  deleteTimetable,
};
