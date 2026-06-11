import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Sidebar() {
  const { user } = useSelector(state => state.auth);

  const navItems = [
    { icon: '🏠', label: 'Home', path: '/' },
    { icon: '🔍', label: 'Explore', path: '/explore' },
    { icon: '💬', label: 'Messages', path: '/messages' },
    { icon: '📖', label: 'Stories', path: '/stories' },
    { icon: '🤖', label: 'AI Bots', path: '/bots' },
  ];

  return (
    <aside className="w-64 bg-htapp-dark/70 border-r border-htapp-purple/30 backdrop-blur-lg p-6 h-screen flex flex-col overflow-y-auto">
      {/* Profile Section */}
      <Link to={`/profile/${user?.id}`} className="mb-8">
        <div className="bg-htapp-dark/50 border border-htapp-purple/30 rounded-lg p-4 hover:border-htapp-pink transition-colors">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-htapp-purple to-htapp-pink mb-3"></div>
          <p className="font-semibold">{user?.display_name}</p>
          <p className="text-sm text-gray-400">@{user?.username}</p>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-3">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-htapp-purple/20 transition-colors text-gray-300 hover:text-white"
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
