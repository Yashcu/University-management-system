const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const errorHandler = require('./middlewares/errorHandler.middleware');
const helmet = require('helmet');

const app = express();
app.use(helmet());
app.use(cors({ origin: config.frontendApiLink }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- STATIC ASSETS ---
// Serve files from the 'media' directory, which is one level above 'src'
app.use('/media', express.static(path.join(__dirname, '../media')));

// --- API ROUTES ---
app.get('/', (req, res) => {
  res.send('Hello 👋 I am Working Fine 🚀');
});

app.use('/api/admin', require('./routes/details/admin-details.route'));
app.use('/api/faculty', require('./routes/details/faculty-details.route'));
app.use('/api/student', require('./routes/details/student-details.route'));
app.use('/api/branch', require('./routes/branch.route'));
app.use('/api/subject', require('./routes/subject.route'));
app.use('/api/notice', require('./routes/notice.route'));
app.use('/api/timetable', require('./routes/timetable.route'));
app.use('/api/material', require('./routes/material.route'));
app.use('/api/exam', require('./routes/exam.route'));
app.use('/api/marks', require('./routes/marks.route'));

// --- GLOBAL ERROR HANDLER ---
// This must be the last app.use() call
app.use(errorHandler);

module.exports = app;
