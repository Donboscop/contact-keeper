const Contact = require('../models/Contact');
const { validationResult } = require('express-validator');

// @desc    Get all user's contacts
// @route   GET /api/contacts
// @access  Private
const getContacts = async (req, res) => {
  try {
    const { search, category, favorite } = req.query;
    let query = { userId: req.user.id };

    // Search query matches name, phone, or email
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { phone: searchRegex },
        { email: searchRegex }
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Favorite filter
    if (favorite !== undefined) {
      query.favorite = favorite === 'true';
    }

    // Fetch and sort by newest first
    const contacts = await Contact.find(query).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.error('Error getting contacts:', error.message);
    res.status(500).json({ message: 'Server error retrieving contacts' });
  }
};

// @desc    Create a contact
// @route   POST /api/contacts
// @access  Private
const createContact = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, phone, email, address, company, category, notes, favorite } = req.body;

  try {
    const newContact = new Contact({
      userId: req.user.id,
      name,
      phone,
      email,
      address,
      company,
      category: category || 'Others',
      notes,
      favorite: favorite || false
    });

    const contact = await newContact.save();
    res.status(201).json(contact);
  } catch (error) {
    console.error('Error creating contact:', error.message);
    res.status(500).json({ message: 'Server error saving contact' });
  }
};

// @desc    Get a contact by ID
// @route   GET /api/contacts/:id
// @access  Private
const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Check owner match
    if (contact.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to access this contact' });
    }

    res.json(contact);
  } catch (error) {
    console.error('Error getting contact by ID:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(500).json({ message: 'Server error retrieving contact' });
  }
};

// @desc    Update a contact
// @route   PUT /api/contacts/:id
// @access  Private
const updateContact = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, phone, email, address, company, category, notes, favorite } = req.body;

  try {
    let contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Check owner match
    if (contact.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this contact' });
    }

    // Update values
    contact.name = name !== undefined ? name : contact.name;
    contact.phone = phone !== undefined ? phone : contact.phone;
    contact.email = email !== undefined ? email : contact.email;
    contact.address = address !== undefined ? address : contact.address;
    contact.company = company !== undefined ? company : contact.company;
    contact.category = category !== undefined ? category : contact.category;
    contact.notes = notes !== undefined ? notes : contact.notes;
    contact.favorite = favorite !== undefined ? favorite : contact.favorite;

    const updatedContact = await contact.save();
    res.json(updatedContact);
  } catch (error) {
    console.error('Error updating contact:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(500).json({ message: 'Server error updating contact' });
  }
};

// @desc    Delete a contact
// @route   DELETE /api/contacts/:id
// @access  Private
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Check owner match
    if (contact.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this contact' });
    }

    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact removed successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(500).json({ message: 'Server error deleting contact' });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Run count queries in parallel
    const [
      total,
      favorites,
      family,
      friends,
      work,
      college,
      others
    ] = await Promise.all([
      Contact.countDocuments({ userId }),
      Contact.countDocuments({ userId, favorite: true }),
      Contact.countDocuments({ userId, category: 'Family' }),
      Contact.countDocuments({ userId, category: 'Friends' }),
      Contact.countDocuments({ userId, category: 'Work' }),
      Contact.countDocuments({ userId, category: 'College' }),
      Contact.countDocuments({ userId, category: 'Others' })
    ]);

    res.json({
      total,
      favorites,
      categories: {
        Family: family,
        Friends: friends,
        Work: work,
        College: college,
        Others: others
      }
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error.message);
    res.status(500).json({ message: 'Server error loading dashboard stats' });
  }
};

module.exports = {
  getContacts,
  createContact,
  getContactById,
  updateContact,
  deleteContact,
  getDashboardStats
};
