const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorize.middleware');
const { USER_ROLES } = require('../utils/constants');
const { upload, handleMulterError } = require('../middlewares/multer.middleware');
const validate = require('../middlewares/validation.middleware');
const {
  addExamSchema,
  updateExamSchema,
  deleteExamSchema,
} = require('../validators/exam.validator');
const {
  getAllExamsController,
  addExamController,
  updateExamController,
  deleteExamController,
} = require('../controllers/exam.controller');

router.get('/', auth, getAllExamsController);

router.post(
  '/',
  auth,
  authorize([USER_ROLES.ADMIN]),
  upload.single('file'),
  handleMulterError,
  validate(addExamSchema),
  addExamController
);
router.patch(
  '/:id',
  auth,
  authorize([USER_ROLES.ADMIN]),
  upload.single('file'),
  handleMulterError,
  validate(updateExamSchema),
  updateExamController
);

router.delete(
  '/:id',
  auth,
  authorize([USER_ROLES.ADMIN]),
  validate(deleteExamSchema),
  deleteExamController
);

module.exports = router;
