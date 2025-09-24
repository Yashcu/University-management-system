const express = require('express');
const {
  getNoticeController,
  addNoticeController,
  updateNoticeController,
  deleteNoticeController,
} = require('../controllers/notice.controller');
const auth = require('../middlewares/auth.middleware');
const router = express.Router();
const validate = require('../middlewares/validation.middleware');
const {
  addNoticeSchema,
  updateNoticeSchema,
  deleteNoticeSchema,
} = require('../validators/notice.validator');

router.get('/', auth, getNoticeController);
router.post('/', auth, validate(addNoticeSchema), addNoticeController);
router.put('/:id', auth, validate(updateNoticeSchema), updateNoticeController);
router.delete(
  '/:id',
  auth,
  validate(deleteNoticeSchema),
  deleteNoticeController
);

module.exports = router;
