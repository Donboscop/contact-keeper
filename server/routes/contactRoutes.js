const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const {
  getContacts,
  createContact,
  getContactById,
  updateContact,
  deleteContact
} = require('../controllers/contactController');

// Protect all contact routes
router.use(protect);

// @route   GET /api/contacts
// @desc    Get all contacts for logged-in user (supports search, category, favorite filters)
// @access  Private
// @route   POST /api/contacts
// @desc    Create a new contact
// @access  Private
router.route('/')
  .get(getContacts)
  .post(
    [
      check('name', 'Name is required').not().isEmpty(),
      check('phone', 'Phone number is required').not().isEmpty()
    ],
    createContact
  );

// @route   GET /api/contacts/:id
// @desc    Get contact details
// @access  Private
// @route   PUT /api/contacts/:id
// @desc    Update contact details
// @access  Private
// @route   DELETE /api/contacts/:id
// @desc    Remove contact
// @access  Private
router.route('/:id')
  .get(getContactById)
  .put(
    [
      check('name', 'Name is required').optional().not().isEmpty(),
      check('phone', 'Phone number is required').optional().not().isEmpty()
    ],
    updateContact
  )
  .delete(deleteContact);

module.exports = router;
