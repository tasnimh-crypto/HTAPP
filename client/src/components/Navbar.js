import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-htapp-dark/50 border-b border-htapp-purple/30 backdrop-blur-lg sticky top-0 z-40">
      <div className="px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-htapp-pink to-htapp-purple"></div>
          <span className="font-bold text-lg">HTAPP</span>
        </Link>

        <div className="flex-1 mx-6">
          <input
            type="text"
            placeholder="Search..."
            className="w-full max-w-md bg-htapp-dark/50 border border-htapp-purple/50 rounded-lg px-4 py-2 focus:outline-none focus:border-htapp-pink text-white text-sm"
          />
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">Welcome, {user?.display_name}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 rounded-lg text-red-400 text-sm font-semibold transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
