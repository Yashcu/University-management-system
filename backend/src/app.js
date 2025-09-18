const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const errorHandler = require('./middlewares/errorHandler.middleware');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: config.frontendApiLink,
  credentials: true,
}));

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
app.use(errorHandler);

module.exports = app;
