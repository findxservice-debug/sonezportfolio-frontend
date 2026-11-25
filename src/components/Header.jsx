import React from 'react';
import { useSite } from '../context/SiteContext';
import { ShoppingBag } from 'lucide-react';

export default function Header() {
  const { 
    activeSection, 
    scrollToSection, 
    setIsMenuOpen, 
    currentPage, 
    setCurrentPage 
  } = useSite();

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (currentPage !== 'portfolio') {
      setCurrentPage('portfolio');
      setTimeout(() => scrollToSection(0), 100);
    } else {
      scrollToSection(0);
    }
  };

  const handleStoreClick = () => {
    if (currentPage === 'store') {
      setCurrentPage('portfolio');
    } else {
      setCurrentPage('store');
    }
  };

  // Check if we are at hero section or store
  const isHero = activeSection === 0 && currentPage === 'portfolio';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 px-6 sm:px-12 py-4 flex items-center justify-between">
      {/* Background layer */}
      <div className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${
        isHero 
          ? 'bg-sonez-blue/10 backdrop-blur-sm' 
          : 'bg-white/80 backdrop-blur-md border-b border-gray-100'
      }`} />

      {/* Brand Logo */}
      <div className="relative z-10">
        <button 
          onClick={handleLogoClick}
          className="group flex items-center gap-2 focus:outline-none"
        >
          <span className="font-futuristic text-2xl sm:text-3xl font-extrabold tracking-wider text-black group-hover:text-sonez-blue transition-colors">
            SONEZ
          </span>
          <span className="w-2 h-2 rounded-full bg-sonez-blue animate-pulse"></span>
        </button>
      </div>

      {/* Right Controls: Store Button & Hamburger Menu */}
      <div className="relative z-10 flex items-center gap-4 sm:gap-6">
        {/* Store Pill Capsule Button */}
        <button
          onClick={handleStoreClick}
          aria-label="Open SONEZ Store"
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 transform active:scale-95 shadow-sm hover:shadow-md ${
            currentPage === 'store'
              ? 'bg-sonez-blue text-white ring-2 ring-sonez-blue ring-offset-2'
              : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{currentPage === 'store' ? 'Portfolio' : 'Store'}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
        </button>

        {/* Hamburger Toggle Button */}
        <button
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open Navigation Menu"
          className="p-2 -mr-2 text-black hover:text-sonez-blue focus:outline-none group flex flex-col justify-center items-end gap-1.5 transition-colors"
        >
          <span className="w-7 h-[2.5px] bg-black group-hover:bg-sonez-blue transition-all duration-200"></span>
          <span className="w-5 h-[2.5px] bg-black group-hover:bg-sonez-blue transition-all duration-200 group-hover:w-7"></span>
          <span className="w-7 h-[2.5px] bg-black group-hover:bg-sonez-blue transition-all duration-200"></span>
        </button>
      </div>
    </header>
  );
}
