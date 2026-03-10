import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit, Trash2, X, Check, Loader2, Users } from 'lucide-react';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/contacts');
      setContacts(response.data);
    } catch (err) {
      setError('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await axios.delete(`http://localhost:5000/contacts/${id}`);
        setContacts(contacts.filter((c) => c._id !== id));
      } catch (err) {
        alert('Failed to delete contact');
      }
    }
  };

  const startEditing = (contact) => {
    setEditingId(contact._id);
    setEditForm({ name: contact.name, email: contact.email, phone: contact.phone });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ name: '', email: '', phone: '' });
  };

  const handleUpdate = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/contacts/${id}`, editForm);
      setContacts(contacts.map((c) => (c._id === id ? response.data : c)));
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update contact');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-600 mb-2" size={40} />
        <p className="text-gray-500 font-medium">Loading contacts...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <div className="flex items-center space-x-2 mb-6 text-blue-600">
        <Users size={24} />
        <h2 className="text-2xl font-bold">Contact List</h2>
      </div>

      {error && <div className="p-3 mb-4 bg-red-100 text-red-700 rounded">{error}</div>}

      {contacts.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No contacts found. Add some!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-3 font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Email</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Phone</th>
                <th className="px-4 py-3 font-semibold text-gray-700 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact._id} className="border-b hover:bg-gray-50 transition">
                  {editingId === contact._id ? (
                    <>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                      </td>
                      <td className="px-4 py-2 flex justify-center space-x-2">
                        <button
                          onClick={() => handleUpdate(contact._id)}
                          className="p-1 text-green-600 hover:bg-green-100 rounded transition"
                        >
                          <Check size={20} />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="p-1 text-red-600 hover:bg-red-100 rounded transition"
                        >
                          <X size={20} />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 text-gray-800">{contact.name}</td>
                      <td className="px-4 py-3 text-gray-600">{contact.email}</td>
                      <td className="px-4 py-3 text-gray-600">{contact.phone}</td>
                      <td className="px-4 py-3 flex justify-center space-x-2">
                        <button
                          onClick={() => startEditing(contact)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded transition"
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(contact._id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded transition"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ContactList;
