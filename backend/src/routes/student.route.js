const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer.middleware');
const auth = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const {
  loginStudentSchema,
  registerStudentSchema,
  updateDetailsSchema,
  forgetPasswordSchema,
  updatePasswordSchema,
  changePasswordSchema,
  searchStudentsSchema,
  deleteStudentSchema,
} = require('../validators/student.validator');

const {
  loginStudentController,
  getAllDetailsController,
  registerStudentController,
  updateDetailsController,
  deleteDetailsController,
  getMyDetailsController,
  sendForgetPasswordEmail,
  updatePasswordHandler,
  updateLoggedInPasswordController,
} = require('../controllers/student.controller');

router.post(
  '/register',
  upload.single('file'),
  validate(registerStudentSchema),
  registerStudentController
);
router.post('/login', validate(loginStudentSchema), loginStudentController);
router.get('/my-details', auth, getMyDetailsController);

// This route now handles both getting all students and searching
router.get('/', auth, validate(searchStudentsSchema), getAllDetailsController);

router.patch(
  '/:id',
  auth,
  upload.single('file'),
  validate(updateDetailsSchema),
  updateDetailsController
);
router.delete(
  '/:id',
  auth,
  validate(deleteStudentSchema),
  deleteDetailsController
);
router.post(
  '/forget-password',
  validate(forgetPasswordSchema),
  sendForgetPasswordEmail
);
router.post(
  '/update-password/:resetId',
  validate(updatePasswordSchema),
  updatePasswordHandler
);
router.post(
  '/change-password',
  auth,
  validate(changePasswordSchema),
  updateLoggedInPasswordController
);

module.exports = router;
