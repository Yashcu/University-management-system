const express = require('express');
const router = express.Router();
const { upload, handleMulterError } = require('../middlewares/multer.middleware');
const auth = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const {
  loginFacultySchema,
  registerFacultySchema,
  updateFacultySchema,
  forgetPasswordSchema,
  updatePasswordSchema,
  changePasswordSchema,
  deleteFacultySchema,
} = require('../validators/faculty.validator');

const {
  loginFacultyController,
  registerFacultyController,
  updateFacultyController,
  deleteFacultyController,
  getAllFacultyController,
  getMyFacultyDetailsController,
  sendFacultyResetPasswordEmail,
  updateFacultyPasswordHandler,
  updateLoggedInPasswordController,
} = require('../controllers/faculty.controller');

router.post(
  '/register',
  upload.single('file'),
  handleMulterError,
  validate(registerFacultySchema),
  registerFacultyController
);
router.post('/login', validate(loginFacultySchema), loginFacultyController);
router.get('/my-details', auth, getMyFacultyDetailsController);

router.get('/', auth, getAllFacultyController);

router.patch(
  '/:id',
  auth,
  upload.single('file'),
  handleMulterError,
  validate(updateFacultySchema),
  updateFacultyController
);
router.delete(
  '/:id',
  auth,
  validate(deleteFacultySchema),
  deleteFacultyController
);
router.post(
  '/forget-password',
  validate(forgetPasswordSchema),
  sendFacultyResetPasswordEmail
);
router.post(
  '/update-password/:resetId',
  validate(updatePasswordSchema),
  updateFacultyPasswordHandler
);
router.post(
  '/change-password',
  auth,
  validate(changePasswordSchema),
  updateLoggedInPasswordController
);

module.exports = router;
