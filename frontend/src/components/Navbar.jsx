import React from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Users size={24} />
            <span className="font-bold text-xl">Contact Manager</span>
          </Link>
          <div className="flex space-x-4">
            <Link to="/" className="flex items-center space-x-1 hover:text-blue-200 transition">
              <Users size={18} />
              <span>Contacts</span>
            </Link>
            <Link to="/add" className="flex items-center space-x-1 hover:text-blue-200 transition">
              <UserPlus size={18} />
              <span>Add Contact</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
