import React from 'react';
import { useSite } from '../context/SiteContext';
import { ArrowDown, Sparkles } from 'lucide-react';

export default function HeroSection() {
  const { content, scrollToSection } = useSite();

  const greeting = content.hero_greeting || 'HEY THERE!';
  const name = content.hero_name || "I'M SADEEPA";
  const subtitle = content.hero_subtitle || 'In Web Development, UI/UX Design, Graphic Design and Video Editing';
  const heroImage = content.hero_image || '/images/sadeep_hero.png';

  return (
    <section className="snap-section relative w-full h-screen min-h-[680px] bg-white flex flex-col justify-between items-center pt-20 pb-10 px-6 sm:px-12 overflow-hidden">
      {/* Top subtle blue ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 bg-gradient-to-b from-sonez-blue/15 to-transparent pointer-events-none rounded-b-[100px] blur-2xl" />

      {/* Main Title & Subtitle */}
      <div className="relative z-10 text-center max-w-3xl pt-2 sm:pt-4">
        <span className="font-futuristic text-xs sm:text-sm md:text-base font-bold tracking-[0.25em] text-gray-800 block mb-2 sm:mb-3">
          {greeting}
        </span>
        <h1 className="font-futuristic text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-black leading-none uppercase">
          {name}
        </h1>
        <p className="font-sans text-xs sm:text-sm md:text-base text-gray-600 font-medium tracking-wide mt-3 max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Hero Cutout Portrait */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center">
        <div className="relative group">
          {/* Subtle geometric backdrop ring */}
          <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-sonez-blue/20 to-blue-100 blur-xl opacity-70 group-hover:opacity-100 transition-opacity" />

          {/* Profile cutout image of Sadeepa */}
          <div className="relative w-44 sm:w-56 md:w-64 h-52 sm:h-68 md:h-76 flex items-end justify-center overflow-visible">
            <img
              src={heroImage}
              alt="Sadeepa - SONEZ"
              className="max-h-full max-w-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)] transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Creative floating pill */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/90 backdrop-blur-md border border-gray-700 text-white text-[11px] font-semibold tracking-wider uppercase rounded-full shadow-lg flex items-center gap-1.5 whitespace-nowrap">
            <Sparkles className="w-3 h-3 text-sonez-blue animate-pulse" />
            <span>Creative Developer</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Scroll Indicator (Fixed socials sit permanently at bottom-left) */}
      <div className="relative z-10 w-full max-w-6xl flex items-center justify-end pt-2 pr-2 sm:pr-8">
        <button
          onClick={() => scrollToSection(1)}
          className="group flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-black transition-colors focus:outline-none"
        >
          <span className="hidden sm:inline-block tracking-wider uppercase">Scroll Down</span>
          <div className="w-7 h-7 rounded-full border border-gray-300 group-hover:border-black flex items-center justify-center transition-colors">
            <ArrowDown className="w-3.5 h-3.5 animate-bounce group-hover:text-sonez-blue" />
          </div>
        </button>
      </div>
    </section>
  );
}
