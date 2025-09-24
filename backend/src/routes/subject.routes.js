const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorize.middleware');
const validate = require('../middlewares/validation.middleware');
const { USER_ROLES } = require('../utils/constants');
const {
  addSubjectSchema,
  updateSubjectSchema,
  deleteSubjectSchema,
} = require('../validators/subject.validator');
const {
  getSubjectController,
  addSubjectController,
  deleteSubjectController,
  updateSubjectController,
} = require('../controllers/subject.controller');

router.get('/', auth, getSubjectController);

router.post(
  '/',
  auth,
  authorize([USER_ROLES.ADMIN]),
  validate(addSubjectSchema),
  addSubjectController
);
router.put(
  '/:id',
  auth,
  authorize([USER_ROLES.ADMIN]),
  validate(updateSubjectSchema),
  updateSubjectController
);
router.delete(
  '/:id',
  auth,
  authorize([USER_ROLES.ADMIN]),
  validate(deleteSubjectSchema),
  deleteSubjectController
);

module.exports = router;
