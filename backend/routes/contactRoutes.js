const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// @desc    Get all contacts
// @route   GET /contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add a new contact
// @route   POST /contacts
router.post('/', async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'Please provide all fields' });
  }

  try {
    const contactExists = await Contact.findOne({ email });
    if (contactExists) {
      return res.status(400).json({ message: 'Contact with this email already exists' });
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
    });

    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a contact
// @route   PUT /contacts/:id
router.put('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a contact
// @route   DELETE /contacts/:id
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    await contact.deleteOne();
    res.json({ message: 'Contact removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
