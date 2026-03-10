import nlp from 'compromise';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/contacts';

/**
 * Chatbot states:
 * {
 *   intent: null, // 'add', 'delete', 'update', 'show'
 *   step: null,   // 'ask_name', 'ask_email', 'ask_phone', 'confirm_delete', 'ask_update_field', 'ask_new_value'
 *   data: {},     // temp data for current operation
 *   targetId: null // id of contact being updated/deleted
 * }
 */

export const processInput = async (input, state, setMessages) => {
  const text = input.toLowerCase().trim();
  const doc = nlp(text);

  // Helper to add bot message
  const addBotMessage = (msg) => {
    setMessages((prev) => [...prev, { sender: 'bot', text: msg }]);
    speak(msg);
  };

  const speak = (msg) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(msg);
      window.speechSynthesis.speak(utterance);
    }
  };

  // If we are in the middle of a flow
  if (state.intent) {
    return handleFlow(text, state, addBotMessage, setMessages);
  }

  // Detect New Intent
  if (text.includes('add') || text.includes('create') || text.includes('save')) {
    state.intent = 'add';
    state.step = 'ask_name';
    addBotMessage("Sure! Let's add a new contact. What's the name?");
    return { ...state };
  }

  if (text.includes('show') || text.includes('list') || text.includes('view')) {
    try {
      const res = await axios.get(API_BASE);
      const names = res.data.map(c => c.name).join(', ');
      addBotMessage(names ? `You have: ${names}` : "Your contact list is empty.");
    } catch (err) {
      addBotMessage("Sorry, I couldn't fetch the contacts.");
    }
    return { intent: null, step: null, data: {} };
  }

  if (text.includes('delete') || text.includes('remove')) {
    // Try to extract name
    const person = doc.people().text() || text.split('delete ')[1] || text.split('remove ')[1];
    if (person) {
      try {
        const res = await axios.get(API_BASE);
        const contact = res.data.find(c => c.name.toLowerCase().includes(person.toLowerCase()));
        if (contact) {
          state.intent = 'delete';
          state.targetId = contact._id;
          state.data.name = contact.name;
          state.step = 'confirm_delete';
          addBotMessage(`Are you sure you want to delete ${contact.name}? (Yes/No)`);
          return { ...state };
        } else {
          addBotMessage(`I couldn't find a contact named ${person}.`);
        }
      } catch (err) {
        addBotMessage("Error searching for contact.");
      }
    } else {
      addBotMessage("Who would you like to delete?");
      state.intent = 'delete_search';
      return { ...state };
    }
    return { intent: null, step: null, data: {} };
  }

  if (text.includes('update') || text.includes('change') || text.includes('edit')) {
    const person = doc.people().text() || text.split('update ')[1]?.split("'s")[0];
    if (person) {
      try {
        const res = await axios.get(API_BASE);
        const contact = res.data.find(c => c.name.toLowerCase().includes(person.toLowerCase()));
        if (contact) {
          state.intent = 'update';
          state.targetId = contact._id;
          state.data.name = contact.name;
          state.step = 'ask_update_field';
          addBotMessage(`What would you like to update for ${contact.name}? (Name, Email, or Phone)`);
          return { ...state };
        } else {
          addBotMessage(`I couldn't find ${person}.`);
        }
      } catch (err) {
        addBotMessage("Error searching for contact.");
      }
    } else {
      addBotMessage("Which contact would you like to update?");
      state.intent = 'update_search';
      return { ...state };
    }
    return { intent: null, step: null, data: {} };
  }

  addBotMessage("I'm not sure how to help with that. You can say 'Add contact', 'Show contacts', 'Delete John', or 'Update John'.");
  return { intent: null, step: null, data: {} };
};

const handleFlow = async (text, state, addBotMessage, setMessages) => {
  // ADD FLOW
  if (state.intent === 'add') {
    if (state.step === 'ask_name') {
      state.data.name = text;
      state.step = 'ask_email';
      addBotMessage(`Got it, ${text}. What's their email?`);
      return { ...state };
    }
    if (state.step === 'ask_email') {
      state.data.email = text.replace(/\s+/g, "").toLowerCase();
      state.step = 'ask_phone';
      addBotMessage("And the phone number?");
      return { ...state };
    }
    if (state.step === 'ask_phone') {
      state.data.phone = text;
      try {
        await axios.post(API_BASE, state.data);
        addBotMessage(`Contact ${state.data.name} added successfully!`);
      } catch (err) {
        addBotMessage("Failed to add contact. " + (err.response?.data?.message || ""));
      }
      return { intent: null, step: null, data: {} };
    }
  }

  // DELETE FLOW
  if (state.intent === 'delete' && state.step === 'confirm_delete') {
    if (text.includes('yes') || text.includes('sure')) {
      try {
        await axios.delete(`${API_BASE}/${state.targetId}`);
        addBotMessage(`Deleted ${state.data.name}.`);
      } catch (err) {
        addBotMessage("Failed to delete.");
      }
    } else {
      addBotMessage("Okay, cancelled.");
    }
    return { intent: null, step: null, data: {} };
  }

  if (state.intent === 'delete_search') {
      try {
        const res = await axios.get(API_BASE);
        const contact = res.data.find(c => c.name.toLowerCase().includes(text.toLowerCase()));
        if (contact) {
          state.intent = 'delete';
          state.targetId = contact._id;
          state.data.name = contact.name;
          state.step = 'confirm_delete';
          addBotMessage(`Are you sure you want to delete ${contact.name}?`);
          return { ...state };
        } else {
          addBotMessage(`No contact found for ${text}.`);
          return { intent: null, step: null, data: {} };
        }
      } catch (err) { addBotMessage("Error."); return { intent: null, step: null, data: {} }; }
  }

  // UPDATE FLOW
  if (state.intent === 'update_search') {
      try {
        const res = await axios.get(API_BASE);
        const contact = res.data.find(c => c.name.toLowerCase().includes(text.toLowerCase()));
        if (contact) {
          state.intent = 'update';
          state.targetId = contact._id;
          state.data.name = contact.name;
          state.step = 'ask_update_field';
          addBotMessage(`What to update for ${contact.name}? (Name, Email, or Phone)`);
          return { ...state };
        } else {
          addBotMessage(`No contact found for ${text}.`);
          return { intent: null, step: null, data: {} };
        }
      } catch (err) { addBotMessage("Error."); return { intent: null, step: null, data: {} }; }
  }

  if (state.intent === 'update') {
    if (state.step === 'ask_update_field') {
      if (text.includes('name')) state.data.field = 'name';
      else if (text.includes('email')) state.data.field = 'email';
      else if (text.includes('phone') || text.includes('number')) state.data.field = 'phone';
      else {
          addBotMessage("Please say Name, Email, or Phone.");
          return { ...state };
      }
      state.step = 'ask_new_value';
      addBotMessage(`What's the new ${state.data.field}?`);
      return { ...state };
    }
    if (state.step === 'ask_new_value') {
      try {
        let value = text;
        if (state.data.field === 'email') {
          value = text.replace(/\s+/g, "").toLowerCase();
        }
        const updateData = { [state.data.field]: value };
        await axios.put(`${API_BASE}/${state.targetId}`, updateData);
        addBotMessage("Updated successfully!");
      } catch (err) {
        addBotMessage("Update failed.");
      }
      return { intent: null, step: null, data: {} };
    }
  }

  return { intent: null, step: null, data: {} };
};
