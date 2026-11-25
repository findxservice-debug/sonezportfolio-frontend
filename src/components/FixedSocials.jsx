import React from 'react';
import { useSite } from '../context/SiteContext';
import { Github, Linkedin, MessageSquare, Instagram, Video } from 'lucide-react';

export default function FixedSocials() {
  const { content, currentPage } = useSite();

  // Show only on portfolio and store pages
  if (currentPage !== 'portfolio' && currentPage !== 'store') return null;

  const socials = content.social_links || {};

  const socialLinks = [
    {
      name: 'TikTok',
      url: socials.tiktok || 'https://tiktok.com/@sonez',
      icon: Video,
      hoverColor: 'hover:bg-black hover:text-white',
    },
    {
      name: 'GitHub',
      url: socials.github || 'https://github.com/sadeepa-sonez',
      icon: Github,
      hoverColor: 'hover:bg-black hover:text-white',
    },
    {
      name: 'LinkedIn',
      url: socials.linkedin || 'https://linkedin.com/in/sadeepa-amarasiriwardhana',
      icon: Linkedin,
      hoverColor: 'hover:bg-[#0A66C2] hover:text-white',
    },
    {
      name: 'Discord',
      url: socials.discord || 'https://discord.gg/Wmt28MxZJ',
      icon: MessageSquare,
      hoverColor: 'hover:bg-[#5865F2] hover:text-white',
    },
    {
      name: 'Instagram',
      url: socials.instagram || 'https://instagram.com/sonez.official',
      icon: Instagram,
      hoverColor: 'hover:bg-gradient-to-tr hover:from-amber-500 hover:to-pink-500 hover:text-white',
    },
  ];

  return (
    <aside
      aria-label="Social media profiles"
      className="fixed bottom-6 left-6 sm:left-10 z-30 pointer-events-auto flex items-center gap-2.5 sm:gap-3"
    >
      {socialLinks.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.name}
            className={`group relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 backdrop-blur-md border border-gray-200/90 text-gray-700 shadow-sm flex items-center justify-center transition-all duration-300 transform hover:scale-115 hover:shadow-md ${item.hoverColor}`}
          >
            {/* Hover Tooltip */}
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/90 backdrop-blur-md text-white text-[10px] font-semibold rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
              {item.name}
            </span>

            <Icon className="w-4 h-4 transition-transform group-hover:scale-105" />
          </a>
        );
      })}
    </aside>
  );
}
