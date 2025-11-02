import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = ({ onClose }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check login state from localStorage
    setIsLoggedIn(!!localStorage.getItem('isLoggedIn'));
    // Listen for login/logout events (optional, for cross-tab sync)
    const handleStorage = () => setIsLoggedIn(!!localStorage.getItem('isLoggedIn'));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <div className="fixed md:static top-16 md:top-0 left-0 h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] w-60 bg-white text-gray-700 z-40 shadow-lg border-r border-gray-200">
      <nav className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-center text-blue-600 border-b pb-2 flex-1">Menu</h2>
          {onClose && (
            <button onClick={onClose} className="md:hidden p-1 hover:bg-gray-100 rounded">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <ul className="space-y-1">
          <li>
            <Link to="/" onClick={handleLinkClick} className="flex items-center px-3 py-2 rounded hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <span className="mr-3">🏠</span> Home
            </Link>
          </li>
          <li>
            <Link to="/apply-ng" onClick={handleLinkClick} className="flex items-center px-3 py-2 rounded hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <span className="mr-3">🎓</span> Apply Student ID Card
            </Link>
          </li>
          <li>
            <Link to="/apply-gaz" onClick={handleLinkClick} className="flex items-center px-3 py-2 rounded hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <span className="mr-3">👨‍🏫</span> Apply Faculty ID Card
            </Link>
          </li>
          <li>
            <Link to="/status" onClick={handleLinkClick} className="flex items-center px-3 py-2 rounded hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <span className="mr-3">🔍</span> Check Status
            </Link>
          </li>
          {isLoggedIn && (
            <>
              <li className="mt-4 pt-4 border-t border-gray-200">
                <Link to="/admin" onClick={handleLinkClick} className="flex items-center px-3 py-2 rounded hover:bg-green-50 hover:text-green-600 font-medium transition-colors">
                  <span className="mr-3">⚙️</span> Admin Panel
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="flex items-center w-full px-3 py-2 rounded hover:bg-red-50 hover:text-red-600 font-medium transition-colors">
                  <span className="mr-3">🚪</span> Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;