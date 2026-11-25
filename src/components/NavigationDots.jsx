import React from 'react';
import { useSite } from '../context/SiteContext';

export default function NavigationDots() {
  const { activeSection, scrollToSection, sectionNames, currentPage } = useSite();

  if (currentPage !== 'portfolio') return null;

  return (
    <aside 
      aria-label="Section navigation"
      className="fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-4 pointer-events-auto"
    >
      {sectionNames.map((name, index) => {
        const isActive = activeSection === index;
        return (
          <button
            key={name}
            onClick={() => scrollToSection(index)}
            aria-label={`Navigate to ${name}`}
            className="group relative flex items-center justify-end p-2 focus:outline-none"
          >
            {/* Hover Tooltip */}
            <span className="absolute right-7 px-3 py-1 bg-black/90 backdrop-blur-md text-white text-xs font-semibold rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-lg translate-x-2 group-hover:translate-x-0">
              {name}
            </span>

            {/* Dot Outer Ring / Circle */}
            <div className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${
              isActive
                ? 'w-5 h-5 bg-black/10'
                : 'w-4 h-4 bg-transparent hover:scale-125'
            }`}>
              {/* Dot Center */}
              <div className={`rounded-full transition-all duration-300 ${
                isActive
                  ? 'w-3 h-3 bg-black shadow-md scale-110'
                  : 'w-2.5 h-2.5 bg-gray-300 group-hover:bg-sonez-blue'
              }`} />
            </div>
          </button>
        );
      })}
    </aside>
  );
}
