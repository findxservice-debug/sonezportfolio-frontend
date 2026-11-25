import React, { useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const { content } = useSite();
  const [visible, setVisible] = useState(false);

  // Appears a few seconds after the page loads as requested
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const rawNumber = content.whatsapp_number || '94704483130';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
  const greeting = encodeURIComponent("Hi Sadeepa! I was exploring your SONEZ portfolio website and would like to connect.");
  const waUrl = `https://wa.me/${cleanNumber}?text=${greeting}`;

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-30 flex items-center gap-3">
      {/* Tooltip on hover */}
      <span className="hidden sm:inline-block px-3 py-1.5 bg-black/90 backdrop-blur-md text-white text-xs font-medium rounded-full shadow-lg opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        Chat on WhatsApp
      </span>

      {/* WhatsApp Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct message Sadeepa on WhatsApp"
        className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-white/80"
      >
        {/* Pulsing ring animation */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" />

        {/* WhatsApp Icon */}
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current relative z-10">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.84a8.188 8.188 0 0 1-5.83 2.41c-1.46 0-2.88-.39-4.13-1.12l-.3-.18-3.12.82.83-3.04-.19-.31a8.18 8.18 0 0 1-1.25-4.42c0-4.54 3.7-8.24 8.25-8.24zm4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.25-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.18-.47-.3z"/>
        </svg>

        {/* Small badge */}
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full"></span>
      </a>
    </div>
  );
}
