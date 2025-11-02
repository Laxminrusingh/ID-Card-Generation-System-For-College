import React, { useState } from 'react';
import gietLogo from '../assets/gietLogo.png';

const NavBar = ({ onMenuToggle }) => {
  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-blue-50 shadow z-50 flex items-center border-b border-blue-100">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-4 md:px-6">
        {/* Left: Menu button + Logo and Title */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-md hover:bg-blue-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <img 
            src={ gietLogo } 
            alt="Giet Logo" 
            className="h-10 w-10 object-contain"
          />
          <div className="flex flex-col">
            <span className="text-sm md:text-lg font-bold text-gray-800 tracking-wide select-none">
              <span className="hidden md:inline">Gandhi Institute For Education and Technology</span>
              <span className="md:hidden">GIET Baniatangi</span>
            </span>
            <span className="text-xs md:text-sm text-gray-600 select-none">
              <span className="hidden md:inline"></span>
              <span className="md:hidden"></span>
            </span>
          </div>
        </div>
        {/* Center: Page Title */}
        <span
          className="absolute left-1/2 transform -translate-x-1/2 text-sm md:text-xl font-bold text-blue-800 tracking-wide select-none"
        >
          <span className="hidden md:inline">Online Form for I-Cards</span>
          
        </span>
        {/* Right: IT Centre + Logo */}
        <div className="flex items-center gap-2">
          <span className="hidden md:block text-sm text-blue-700 italic select-none font-medium">
            Developed by GIET Students
          </span>
          <span className="inline-flex items-center justify-center h-8 w-8 md:h-9 md:w-9 rounded-full bg-blue-100 border border-blue-300">
            <img 
              src={gietLogo} 
              alt="GIET Logo" 
              className="h-6 w-6 md:h-7 md:w-7 object-contain"
            />
          </span>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
