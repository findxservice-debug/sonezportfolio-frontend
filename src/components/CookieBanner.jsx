import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { ShieldCheck, Cookie, X } from 'lucide-react';

export default function CookieBanner() {
  const { cookieConsent, setCookieConsent, currentPage } = useSite();
  const [showPreferences, setShowPreferences] = useState(false);

  if (currentPage !== 'portfolio' && currentPage !== 'store') return null;

  // If visitor already decided and modal is closed, show minimal center bottom button
  if (cookieConsent && !showPreferences) {
    return (
      <div className="fixed bottom-1 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
        <button
          onClick={() => setShowPreferences(true)}
          className="text-[10px] font-mono text-gray-400 hover:text-black bg-white/80 hover:bg-white backdrop-blur-md px-2.5 py-0.5 rounded-full border border-gray-200/60 transition-colors shadow-xs"
          title="Manage privacy and chat storage preferences"
        >
          Privacy & Cookies
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl animate-in slide-in-from-bottom duration-300">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Description */}
        <div className="flex items-start gap-3">
          <div className="p-2 bg-sonez-blue/10 rounded-xl text-sonez-blue shrink-0 mt-0.5">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            <span className="font-bold text-black block mb-0.5">Privacy & Chat History Preference</span>
            We respect your privacy. Would you like to preserve your chat conversation history across your future visits to SONEZ? Essential website functionality remains fully active regardless of your choice.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end">
          <button
            onClick={() => {
              setCookieConsent('declined');
              setShowPreferences(false);
            }}
            className="flex-1 md:flex-none px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            Decline (Session Only)
          </button>

          <button
            onClick={() => {
              setCookieConsent('accepted');
              setShowPreferences(false);
            }}
            className="flex-1 md:flex-none px-5 py-2 text-xs font-bold text-white bg-black hover:bg-gray-800 rounded-full transition-all shadow-sm"
          >
            Accept & Save Chat History
          </button>

          {showPreferences && (
            <button
              onClick={() => setShowPreferences(false)}
              className="p-1 text-gray-400 hover:text-black rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
