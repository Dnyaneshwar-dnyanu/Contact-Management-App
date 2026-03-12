/**
 * Tool definitions for the LLM to understand available contact operations.
 * These tools now consume the existing API endpoints instead of direct DB access.
 */

const axios = require('axios');

// Internal base URL for API calls
const PORT = process.env.PORT || 5000;
const API_BASE_URL = `http://localhost:${PORT}/contacts`;

const TOOLS = [
  {
    name: 'add_contact',
    description: 'Add a new contact to the contact list. Requires name, email, and phone.',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'The name of the contact' },
        email: { type: 'string', description: 'The email address of the contact' },
        phone: { type: 'string', description: 'The phone number of the contact' }
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
        name: { type: 'string', description: 'The name of the contact to delete' }
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
        name: { type: 'string', description: 'The name of the contact to update' },
        email: { type: 'string', description: 'New email address (optional)' },
        phone: { type: 'string', description: 'New phone number (optional)' }
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
    // Return the message from the API if available, otherwise the axios error
    const message = error.response?.data?.message || error.message;
    return { error: message, success: false };
  }
}

async function addContact(contactData) {
  const response = await axios.post(API_BASE_URL, contactData);
  return {
    success: true,
    message: `Contact "${contactData.name}" added successfully!`,
    contact: response.data
  };
}

async function getContacts() {
  const response = await axios.get(API_BASE_URL);
  const contacts = response.data;
  
  return {
    success: true,
    message: contacts.length > 0 ? `Found ${contacts.length} contact(s)` : 'Your contact list is empty.',
    contacts: contacts.map(c => ({ name: c.name, email: c.email, phone: c.phone }))
  };
}

async function deleteContact({ name }) {
  // The API requires an ID, so we first find the contact by name
  const allContacts = (await axios.get(API_BASE_URL)).data;
  const contact = allContacts.find(c => c.name.toLowerCase().includes(name.toLowerCase()));

  if (!contact) {
    return { error: `Contact named "${name}" not found` };
  }

  await axios.delete(`${API_BASE_URL}/${contact._id}`);
  return {
    success: true,
    message: `Contact "${contact.name}" has been deleted successfully!`
  };
}

async function updateContact({ name, ...updateData }) {
  // The API requires an ID, so we first find the contact by name
  const allContacts = (await axios.get(API_BASE_URL)).data;
  const contact = allContacts.find(c => c.name.toLowerCase().includes(name.toLowerCase()));

  if (!contact) {
    return { error: `Contact named "${name}" not found` };
  }

  const response = await axios.put(`${API_BASE_URL}/${contact._id}`, updateData);
  return {
    success: true,
    message: `Contact "${contact.name}" updated successfully!`,
    contact: response.data
  };
}

module.exports = {
  TOOLS,
  executeTool
};
