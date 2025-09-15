const mongoose = require('mongoose');

const Material = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
      index: true,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FacultyDetail',
      required: true,
      index: true,
    },
    file: {
      type: String,
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['notes', 'assignment', 'syllabus', 'other'],
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Material', Material);
