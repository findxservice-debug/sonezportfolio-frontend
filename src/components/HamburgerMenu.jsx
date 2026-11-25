import React, { useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { useAuth } from '../context/AuthContext';
import { X, Lock, ExternalLink, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function HamburgerMenu() {
  const { 
    isMenuOpen, 
    setIsMenuOpen, 
    scrollToSection, 
    sectionNames, 
    currentPage, 
    setCurrentPage,
    content 
  } = useSite();

  const { isAuthenticated } = useAuth();

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen, setIsMenuOpen]);

  if (!isMenuOpen) return null;

  const handleNavClick = (index) => {
    setIsMenuOpen(false);
    scrollToSection(index);
  };

  const handleStoreClick = () => {
    setIsMenuOpen(false);
    setCurrentPage('store');
  };

  const handleAdminClick = () => {
    setIsMenuOpen(false);
    if (isAuthenticated) {
      setCurrentPage('admin-dashboard');
    } else {
      setCurrentPage('admin-login');
    }
  };

  const socials = content.social_links || {};

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={() => setIsMenuOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Drawer Panel */}
      <nav 
        aria-label="Site menu"
        className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-8 sm:p-12 overflow-y-auto transform transition-transform duration-300"
      >
        {/* Header inside drawer */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-6">
          <div className="flex items-center gap-2">
            <span className="font-futuristic text-2xl font-black tracking-wider text-black">
              SONEZ
            </span>
            <span className="w-2 h-2 rounded-full bg-sonez-blue"></span>
          </div>

          <button
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Section Links */}
        <div className="py-8 space-y-4">
          {sectionNames.map((name, index) => (
            <button
              key={name}
              onClick={() => handleNavClick(index)}
              className="block w-full text-left font-bold-display text-xl sm:text-2xl font-bold tracking-tight text-gray-800 hover:text-sonez-blue hover:translate-x-2 transition-all duration-200"
            >
              <span className="text-xs font-mono text-gray-400 mr-3">0{index + 1}</span>
              {name}
            </button>
          ))}

          {/* SONEZ Store Link */}
          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={handleStoreClick}
              className={`flex items-center justify-between w-full p-4 rounded-xl font-bold-display text-lg font-bold transition-all ${
                currentPage === 'store'
                  ? 'bg-sonez-blue text-white shadow-md'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-blue-300" />
                <span>SONEZ Digital Store</span>
              </div>
              <span className="text-xs px-2.5 py-1 bg-white/20 rounded-full font-mono uppercase">
                Browse
              </span>
            </button>
          </div>
        </div>

        {/* Footer of Menu: Admin Link at bottom-left and Socials */}
        <div className="border-t border-gray-100 pt-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            {/* Small Admin Login Link at bottom-left as requested */}
            <button
              onClick={handleAdminClick}
              className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-sonez-blue transition-colors group"
            >
              {isAuthenticated ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 font-bold">Admin Dashboard</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  <span>Admin Login</span>
                </>
              )}
            </button>

            {/* Copyright */}
            <span className="text-xs text-gray-400 font-mono">
              © {new Date().getFullYear()} SONEZ
            </span>
          </div>

          {/* Social Icons row */}
          <div className="flex items-center gap-4 text-gray-600 pt-2">
            {socials.github && (
              <a href={socials.github} target="_blank" rel="noreferrer" className="hover:text-black transition-colors text-xs font-mono">
                GitHub
              </a>
            )}
            {socials.linkedin && (
              <a href={socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-sonez-blue transition-colors text-xs font-mono">
                LinkedIn
              </a>
            )}
            {socials.discord && (
              <a href={socials.discord} target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition-colors text-xs font-mono">
                Discord
              </a>
            )}
            {socials.tiktok && (
              <a href={socials.tiktok} target="_blank" rel="noreferrer" className="hover:text-pink-600 transition-colors text-xs font-mono">
                TikTok
              </a>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
