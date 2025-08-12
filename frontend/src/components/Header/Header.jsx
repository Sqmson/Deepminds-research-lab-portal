import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Logo from './Logo';
import NavLinks from './NavLinks';
import MobileMenuButton from './MobileMenuButton';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();

  const createRipple = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const existingRipples = button.querySelectorAll('.ripple');
    existingRipples.forEach(ripple => ripple.remove());

    const ripple = document.createElement('span');
    ripple.className = 'ripple ripple-animate';
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(85, 85, 85, 0.4);
      transform: scale(0);
      animation: ripple-animation 0.6s linear;
      pointer-events: none;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      z-index: 1;
    `;

    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <AnimatePresence>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <style>{`
          @keyframes ripple-animation {
            0% {
              transform: scale(0);
              opacity: 0.6;
            }
            100% {
              transform: scale(2);
              opacity: 0;
            }
          }
          .nav-link {
            position: relative;
            overflow: hidden;
          }
        `}</style>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo createRipple={createRipple} />
            
            <div className="flex items-center space-x-8">
              <nav className="hidden md:flex items-center space-x-8">
                <NavLinks createRipple={createRipple} />
              </nav>

              {/* Authentication Section */}
              <div className="hidden md:flex items-center space-x-4">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        {user.firstName} {user.lastName}
                      </span>
                      <ChevronDown size={16} className={`transform transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {/* User Dropdown Menu */}
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        <div className="px-4 py-2 border-b border-gray-200">
                          <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                        </div>
                        
                        {(user.role === 'admin' || user.role === 'professor') && (
                          <Link
                            to="/admin"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <Settings size={16} className="mr-2" />
                            Admin Dashboard
                          </Link>
                        )}
                        
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <User size={16} className="mr-2" />
                          Profile
                        </Link>
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <LogOut size={16} className="mr-2" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link
                      to="/login"
                      className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/login"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>

              <div className="md:hidden">
                <MobileMenuButton
                  isMenuOpen={isMenuOpen}
                  toggleMenu={() => setIsMenuOpen(!isMenuOpen)}
                  createRipple={createRipple}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-2 space-y-1">
              <NavLinks createRipple={createRipple} isMobile onLinkClick={() => setIsMenuOpen(false)} />
              
              {/* Mobile Authentication */}
              <div className="border-t border-gray-200 pt-2 mt-2">
                {user ? (
                  <div className="space-y-1">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                    
                    {(user.role === 'admin' || user.role === 'professor') && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 text-base rounded-md transition"
                      >
                        <Settings size={16} className="mr-2" />
                        Admin Dashboard
                      </Link>
                    )}
                    
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 text-base rounded-md transition"
                    >
                      <User size={16} className="mr-2" />
                      Profile
                    </Link>
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-gray-50 text-base rounded-md transition"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-2 text-gray-700 hover:bg-gray-50 text-base rounded-md transition"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-2 bg-blue-600 text-white rounded-md text-base font-medium hover:bg-blue-700 transition-colors"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </AnimatePresence>
  );
};

export default Header;
