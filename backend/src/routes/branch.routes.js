const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorize.middleware');
const { USER_ROLES } = require('../utils/constants');
const validate = require('../middlewares/validation.middleware');
const {
  addBranchSchema,
  updateBranchSchema,
  deleteBranchSchema,
} = require('../validators/branch.validator');

const {
  getBranchController,
  addBranchController,
  updateBranchController,
  deleteBranchController,
} = require('../controllers/branch.controller');

router.get('/', auth, getBranchController);

router.post(
  '/register',
  auth,
  authorize([USER_ROLES.ADMIN]),
  validate(addBranchSchema),
  addBranchController
);
router.patch(
  '/:id',
  auth,
  authorize([USER_ROLES.ADMIN]),
  validate(updateBranchSchema),
  updateBranchController
);
router.delete(
  '/:id',
  auth,
  authorize([USER_ROLES.ADMIN]),
  validate(deleteBranchSchema),
  deleteBranchController
);

module.exports = router;
