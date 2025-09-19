const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const errorHandler = require('./middlewares/errorHandler.middleware');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const apiRoutes = require('./routes');
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: config.frontendApiLink,
  credentials: true,
}));

app.get('/', (req, res) => {
  res.send('Hello 👋 I am Working Fine 🚀');
});

app.use('/api', apiRoutes);

app.use(errorHandler);

module.exports = app;
