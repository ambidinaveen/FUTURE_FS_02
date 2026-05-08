const express = require('express');
const { body, param } = require('express-validator');
const leadController = require('../controllers/leadController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

const leadValidators = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('A valid email is required'),
  body('phone').optional().isString().withMessage('Phone must be text'),
  body('source')
    .optional()
    .isIn(['Website', 'LinkedIn', 'Referral', 'Other'])
    .withMessage('Invalid source'),
  body('status')
    .optional()
    .isIn(['new', 'contacted', 'converted'])
    .withMessage('Invalid status'),
  body('notes').optional().isString().withMessage('Notes must be text')
];

router.get('/', protect, leadController.getLeads);

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('A valid email is required'),
    body('phone').optional().trim().isString(),
    body('source')
      .optional()
      .isIn(['Website', 'LinkedIn', 'Referral', 'Other'])
      .withMessage('Invalid source'),
    body('status').optional().isIn(['new', 'contacted', 'converted']).withMessage('Invalid status'),
    body('notes').optional().trim().isString()
  ],
  validateRequest,
  leadController.createLead
);

router.put(
  '/:id',
  protect,
  [
    param('id').isMongoId().withMessage('Invalid lead id'),
    ...leadValidators
  ],
  validateRequest,
  leadController.updateLead
);

router.delete(
  '/:id',
  protect,
  [param('id').isMongoId().withMessage('Invalid lead id')],
  validateRequest,
  leadController.deleteLead
);

module.exports = router;
