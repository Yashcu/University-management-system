const express = require('express');
const router = express.Router();
const { upload, handleMulterError } = require('../middlewares/multer.middleware');
const auth = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const {
  addMaterialSchema,
  updateMaterialSchema,
  deleteMaterialSchema,
} = require('../validators/material.validator');
const {
  getMaterialsController,
  addMaterialController,
  updateMaterialController,
  deleteMaterialController,
} = require('../controllers/material.controller');

router.get('/', auth, getMaterialsController);

router.post(
  '/',
  auth,
  upload.single('file'),
  handleMulterError,
  validate(addMaterialSchema),
  addMaterialController
);
router.put(
  '/:id',
  auth,
  upload.single('file'),
  handleMulterError,
  validate(updateMaterialSchema),
  updateMaterialController
);
router.delete(
  '/:id',
  auth,
  validate(deleteMaterialSchema),
  deleteMaterialController
);

module.exports = router;
