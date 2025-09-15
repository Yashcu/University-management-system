const Timetable = require('../models/timetable.model');
const ApiError = require('../utils/ApiError');

const getTimetables = async (queryParams) => {
  const { semester, branch } = queryParams;
  let query = {};

  if (semester) query.semester = semester;
  if (branch) query.branch = branch;

  const timetables = await Timetable.find(query)
    .populate('branch')
    .sort({ createdAt: -1 });

  if (!timetables || timetables.length === 0) {
    throw new ApiError(404, 'No timetables found');
  }
  return timetables;
};

const addTimetable = async (timetableData, file) => {
  const { semester, branch } = timetableData;

  if (!file) {
    throw new ApiError(400, 'Timetable file is required');
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
    throw new ApiError(404, 'Timetable not found');
  }
  return timetable;
};

const deleteTimetable = async (timetableId) => {
  const timetable = await Timetable.findByIdAndDelete(timetableId);

  if (!timetable) {
    throw new ApiError(404, 'Timetable not found');
  }
  return timetable;
};

module.exports = {
  getTimetables,
  addTimetable,
  updateTimetable,
  deleteTimetable,
};
