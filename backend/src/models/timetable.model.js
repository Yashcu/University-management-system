const mongoose = require('mongoose');

const TimeTable = new mongoose.Schema(
  {
    link: {
      type: String,
      required: true,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

TimeTable.index({ branch: 1, semester: 1 }, { unique: true });

module.exports = mongoose.model('Timetable', TimeTable);
