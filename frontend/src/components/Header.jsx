import React from 'react';

const Header = () => {
  return (
    <header className="bg-gray-50 text-black shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand Section */}
          <div className="flex items-center space-x-3">
            {/* Site Icon */}
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <img 
                className='w-10 h-10' 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                src="../../public/logo-7402580_1920.png" 
                alt="site logo missing" 
              />
            </div>
            
            {/* Brand Text */}
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-black tracking-tight">
                DeepsMinds Research Lab
              </h1>
              <span className="text-xs text-black font-medium tracking-wide">
                (DMRLAb)
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="click:">
              <a
                href="#"
                className="text-black hover:text-blue transition-colors duration-200 font-medium text-sm tracking-wide relative group"
              >
                Lobby
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>
            <a 
              href="#" 
              className="text-black hover:text-black transition-colors duration-200 font-medium text-sm tracking-wide relative group"
            >
              Members
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a 
              href="#" 
              className="text-black hover:text-black transition-colors duration-200 font-medium text-sm tracking-wide relative group"
            >
              Projects
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              className="text-black hover:text-black transition-colors duration-200 p-2"
              aria-label="Open menu"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;