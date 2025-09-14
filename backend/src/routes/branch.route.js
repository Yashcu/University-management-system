const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorize.middleware');
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
  '/',
  auth,
  authorize(['admin']),
  validate(addBranchSchema),
  addBranchController
);
router.patch(
  '/:id',
  auth,
  authorize(['admin']),
  validate(updateBranchSchema),
  updateBranchController
);
router.delete(
  '/:id',
  auth,
  authorize(['admin']),
  validate(deleteBranchSchema),
  deleteBranchController
);

module.exports = router;
