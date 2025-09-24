const express = require('express');
const {
  getMarksController,
  addMarksController,
  deleteMarksController,
  addBulkMarksController,
  getStudentsWithMarksController,
  getStudentMarksController,
} = require('../controllers/marks.controller');
const auth = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorize.middleware');
const { USER_ROLES } = require('../utils/constants');
const router = express.Router();
const validate = require('../middlewares/validation.middleware');
const {
  addOrUpdateMarksSchema,
  addBulkMarksSchema,
  getStudentsWithMarksSchema,
  getStudentMarksSchema,
  deleteMarksSchema,
} = require('../validators/marks.validator');

router.get('/', auth, getMarksController);

router.get(
  '/students',
  auth,
  validate(getStudentsWithMarksSchema),
  getStudentsWithMarksController
);

router.get(
  '/student',
  auth,
  validate(getStudentMarksSchema),
  getStudentMarksController
);

router.post(
  '/',
  auth,
  authorize([USER_ROLES.FACULTY]),
  validate(addOrUpdateMarksSchema),
  addMarksController
);

router.post(
  '/bulk',
  auth,
  authorize([USER_ROLES.FACULTY]),
  validate(addBulkMarksSchema),
  addBulkMarksController
);

router.delete(
  '/:id',
  auth,
  authorize([USER_ROLES.FACULTY]),
  validate(deleteMarksSchema),
  deleteMarksController
);

module.exports = router;
