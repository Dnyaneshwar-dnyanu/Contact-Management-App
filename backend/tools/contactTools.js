/**
 * Tool definitions for the LLM to understand available contact operations
 * These tools define what the LLM can invoke via function calling
 */

const Contact = require('../models/Contact');

const TOOLS = [
  {
    name: 'add_contact',
    description: 'Add a new contact to the contact list. Requires name, email, and phone.',
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'The name of the contact'
        },
        email: {
          type: 'string',
          description: 'The email address of the contact'
        },
        phone: {
          type: 'string',
          description: 'The phone number of the contact'
        }
      },
      required: ['name', 'email', 'phone']
    }
  },
  {
    name: 'get_contacts',
    description: 'Retrieve all contacts from the contact list',
    parameters: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'delete_contact',
    description: 'Delete a contact by name',
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'The name of the contact to delete'
        }
      },
      required: ['name']
    }
  },
  {
    name: 'update_contact',
    description: 'Update a contact\'s information by name',
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'The name of the contact to update'
        },
        email: {
          type: 'string',
          description: 'New email address (optional)'
        },
        phone: {
          type: 'string',
          description: 'New phone number (optional)'
        }
      },
      required: ['name']
    }
  }
];

/**
 * Execute a tool based on its name and arguments
 */
async function executeTool(toolName, args) {
  try {
    switch (toolName) {
      case 'add_contact':
        return await addContact(args);
      case 'get_contacts':
        return await getContacts();
      case 'delete_contact':
        return await deleteContact(args);
      case 'update_contact':
        return await updateContact(args);
      default:
        return { error: `Unknown tool: ${toolName}` };
    }
  } catch (error) {
    return { error: error.message };
  }
}

async function addContact({ name, email, phone }) {
  // Check if contact already exists
  const existingContact = await Contact.findOne({ email });
  if (existingContact) {
    return { error: `Contact with email ${email} already exists` };
  }

  const contact = await Contact.create({
    name,
    email,
    phone
  });

  return {
    success: true,
    message: `Contact "${name}" added successfully!`,
    contact: contact
  };
}

async function getContacts() {
  const contacts = await Contact.find();
  if (contacts.length === 0) {
    return {
      success: true,
      message: 'Your contact list is empty.',
      contacts: []
    };
  }

  const formattedContacts = contacts.map(c => ({
    name: c.name,
    email: c.email,
    phone: c.phone
  }));

  return {
    success: true,
    message: `Found ${contacts.length} contact(s)`,
    contacts: formattedContacts
  };
}

async function deleteContact({ name }) {
  const contact = await Contact.findOne({
    name: { $regex: name, $options: 'i' }
  });

  if (!contact) {
    return { error: `Contact named "${name}" not found` };
  }

  await Contact.deleteOne({ _id: contact._id });

  return {
    success: true,
    message: `Contact "${contact.name}" has been deleted successfully!`
  };
}

async function updateContact({ name, email, phone }) {
  const contact = await Contact.findOne({
    name: { $regex: name, $options: 'i' }
  });

  if (!contact) {
    return { error: `Contact named "${name}" not found` };
  }

  const updateData = {};
  if (email) updateData.email = email;
  if (phone) updateData.phone = phone;

  if (Object.keys(updateData).length === 0) {
    return { error: 'Please provide at least one field to update (email or phone)' };
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    contact._id,
    updateData,
    { new: true, runValidators: true }
  );

  return {
    success: true,
    message: `Contact "${contact.name}" updated successfully!`,
    contact: updatedContact
  };
}

module.exports = {
  TOOLS,
  executeTool
};
