const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer.middleware');
const auth = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const {
  loginAdminSchema,
  registerAdminSchema,
  updateDetailsSchema,
  forgetPasswordSchema,
  updatePasswordSchema,
  changePasswordSchema,
  deleteAdminSchema,
} = require('../validators/admin.validator');

const {
  getAllDetailsController,
  registerAdminController,
  updateDetailsController,
  deleteDetailsController,
  loginAdminController,
  getMyDetailsController,
  sendForgetPasswordEmail,
  updatePasswordHandler,
  updateLoggedInPasswordController,
} = require('../controllers/admin.controller');

router.post(
  '/register',
  upload.single('file'),
  validate(registerAdminSchema),
  registerAdminController
);
router.post('/login', validate(loginAdminSchema), loginAdminController);
router.get('/my-details', auth, getMyDetailsController);

router.get('/', auth, getAllDetailsController);
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
  validate(deleteAdminSchema),
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
