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
const router = express.Router();
const validate = require('../middlewares/validation.middleware');
const {
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

router.post('/', auth, addMarksController);
router.post(
  '/bulk',
  auth,
  validate(addBulkMarksSchema),
  addBulkMarksController
);
router.delete('/:id', auth, validate(deleteMarksSchema), deleteMarksController);

module.exports = router;
