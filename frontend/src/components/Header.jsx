// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Ripple animation function
  const createRipple = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    // Removing existing ripples
    const existingRipples = button.querySelectorAll('.ripple');
    existingRipples.forEach(ripple => ripple.remove());
    
    // A Ripple Animation
    const ripple = document.createElement('span');
    ripple.className = 'ripple ripple-animate';
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgb(85, 85, 85);
      transform: scale(0);
      animation: ripple-animation 0.6s linear;
      pointer-events: none;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
    `;
    
    button.appendChild(ripple);
    
    // Removing ripple after animation
    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <style>
          {`
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
      
            .ripple {
              position: absolute;
              border-radius: 50%;
              pointer-events: none;
              z-index: 1;
            }
          `}
        </style>
      
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <a href="/" className="flex items-center space-x-3 nav-link hover:font-medium transition-all duration-200" onClick={createRipple}>
                {/* Site Icon */}
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <img
                    className='w-10 h-10'
                    src="/logo-7402580_1920.png"
                    alt="Logo"
                  />
                </div>
                {/* Brand Text */}
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                    DeepsMinds Research Lab
                  </h1>
                  <span className="text-xs text-gray-600 font-medium tracking-wide">
                    (DMRLAb)
                  </span>
                </div>
              </a>
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <a
                  href="#"
                  className="nav-link text-gray-700 transition-all duration-200 font-normal text-base py-2 px-3 relative group active:scale-95 transform rounded-md"
                  onClick={createRipple}
                >
                  Lobby
                  <span className="absolute bottom-0 left-0 w-0 h-0.9 transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a
                  href="#"
                  className="nav-link text-gray-700 transition-all duration-200 font-normal text-base py-2 px-3 relative group active:scale-95 transform rounded-md"
                  onClick={createRipple}
                >
                  Members
                  <span className="absolute bottom-0 left-0 w-0 h-0.9 transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a
                  href="#"
                  className="nav-link text-gray-700 transition-all duration-200 font-normal text-base py-2 px-3 relative group active:scale-95 transform rounded-md"
                  onClick={createRipple}
                >
                  Projects
                  <span className="absolute bottom-0 left-0 w-0 h-0.9 transition-all duration-300 group-hover:w-full"></span>
                </a>
              </nav>
              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={(e) => {
                    createRipple(e);
                    setIsMenuOpen(!isMenuOpen);
                  }}
                  className="nav-link text-gray-700 transition-colors duration-200 p-2 -mr-2 active:scale-95 transform rounded-md"
                  aria-label="Toggle menu"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {isMenuOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
              <div className="px-4 py-2 space-y-1">
                <a
                  href="#"
                  className="nav-link block px-3 py-3 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-normal text-base rounded-md active:scale-95 transform"
                  onClick={(e) => {
                    createRipple(e);
                    setIsMenuOpen(false);
                  }}
                >
                  Lobby
                </a>
                <a
                  href="#"
                  className="nav-link block px-3 py-3 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-normal text-base rounded-md active:scale-95 transform"
                  onClick={(e) => {
                    createRipple(e);
                    setIsMenuOpen(false);
                  }}
                >
                  Members
                </a>
                <a
                  href="#"
                  className="nav-link block px-3 py-3 text-gray-700 hover:text-black-600 hover:bg-gray-50 transition-all duration-200 font-normal text-base rounded-md active:scale-95 transform"
                  onClick={(e) => {
                    createRipple(e);
                    setIsMenuOpen(false);
                  }}
                >
                  Projects
                </a>
              </div>
            </div>
          )}
        </header>
      </motion.div>
    </AnimatePresence>
  );
};

export default Header;