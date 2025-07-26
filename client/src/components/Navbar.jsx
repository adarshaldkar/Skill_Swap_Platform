// src/components/Navbar.jsx - NAVIGATION BAR
import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold hover:text-blue-200 transition-colors">
              SkillSwap
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link 
                  to="/browse" 
                  className={`hover:text-blue-200 transition-colors px-3 py-2 rounded-md ${
                    isActive('/browse') ? 'bg-blue-700' : ''
                  }`}
                >
                  Browse Users
                </Link>
                
                <Link 
                  to="/dashboard" 
                  className={`hover:text-blue-200 transition-colors px-3 py-2 rounded-md ${
                    isActive('/dashboard') ? 'bg-blue-700' : ''
                  }`}
                >
                  My Swaps
                </Link>
                
                <Link 
                  to="/profile" 
                  className={`hover:text-blue-200 transition-colors px-3 py-2 rounded-md ${
                    isActive('/profile') ? 'bg-blue-700' : ''
                  }`}
                >
                  My Profile
                </Link>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold">
                          {user.name?.charAt(0)}
                        </span>
                      </div>
                    )}
                    <span className="text-sm font-medium">
                      {user.name}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/" 
                  className={`hover:text-blue-200 transition-colors px-3 py-2 rounded-md ${
                    isActive('/') ? 'bg-blue-700' : ''
                  }`}
                >
                  Home
                </Link>
                
                <Link 
                  to="/login" 
                  className={`hover:text-blue-200 transition-colors px-3 py-2 rounded-md ${
                    isActive('/login') ? 'bg-blue-700' : ''
                  }`}
                >
                  Login
                </Link>
                
                <Link 
                  to="/signup" 
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button className="text-white hover:text-blue-200 focus:outline-none focus:text-blue-200">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-700">
          {user ? (
            <>
              <Link
                to="/browse"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800 transition-colors"
              >
                Browse Users
              </Link>
              <Link
                to="/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800 transition-colors"
              >
                My Swaps
              </Link>
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800 transition-colors"
              >
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
