require('dotenv').config();
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer.middleware');
const auth = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const {
  addTimetableSchema,
  updateTimetableSchema,
  deleteTimetableSchema,
} = require('../validators/timetable.validator');
const {
  getTimetableController,
  addTimetableController,
  updateTimetableController,
  deleteTimetableController,
} = require('../controllers/timetable.controller');

router.get('/', auth, getTimetableController);

router.post(
  '/',
  auth,
  upload.single('file'),
  validate(addTimetableSchema),
  addTimetableController
);

router.put(
  '/:id',
  auth,
  upload.single('file'),
  validate(updateTimetableSchema),
  updateTimetableController
);

router.delete(
  '/:id',
  auth,
  validate(deleteTimetableSchema),
  deleteTimetableController
);

module.exports = router;
