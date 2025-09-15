require('dotenv').config();
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer.middleware');
const auth = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorize.middleware');
const { USER_ROLES } = require('../utils/constants');
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
  authorize([USER_ROLES.ADMIN]),
  validate(addTimetableSchema),
  addTimetableController
);

router.put(
  '/:id',
  auth,
  authorize([USER_ROLES.ADMIN]),
  upload.single('file'),
  validate(updateTimetableSchema),
  updateTimetableController
);

router.delete(
  '/:id',
  auth,
  authorize([USER_ROLES.ADMIN]),
  validate(deleteTimetableSchema),
  deleteTimetableController
);

module.exports = router;
