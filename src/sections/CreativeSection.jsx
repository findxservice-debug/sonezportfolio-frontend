import React, { useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { api } from '../services/api';
import { ExternalLink, X, MessageCircle } from 'lucide-react';

// TODO: Replace these example names/numbers with real ones
const TEAM_CONTACTS = {
  'Graphic Design': { name: 'Neranjana', role: 'Graphic Designer', whatsapp: '94763960436' },
  'Video Editing': { name: 'Sadeepa (SONEZ)', role: 'Video Editor', whatsapp: '94704483130' },
};

export default function CreativeSection() {
  const { content } = useSite();
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWork, setSelectedWork] = useState(null);
  const ownerWa = (content.whatsapp_number || '94704483130');

  const getContact = (category) =>
    TEAM_CONTACTS[category] || { name: 'Sadeepa (SONEZ)', role: 'UI/UX & Web Designer', whatsapp: ownerWa };

  useEffect(() => {
    async function loadWorks() {
      try {
        const res = await api.getCreativeWorks();
        if (res.success && res.works) {
          setWorks(res.works);
        }
      } catch (err) {
        console.error('Failed to load creative works:', err);
      } finally {
        setLoading(false);
      }
    }
    loadWorks();
  }, []);

  return (
    <section className="snap-section relative w-full h-screen min-h-[680px] bg-white flex flex-col justify-between items-center pt-20 pb-10 px-6 sm:px-12 overflow-hidden">
      {/* Title */}
      <div className="relative z-10 text-center max-w-3xl pt-2">
        <h2 className="font-futuristic text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-black uppercase">
          THINGS MY TEAM CREATED
        </h2>
        <div className="w-12 h-1 bg-sonez-blue mx-auto mt-2 rounded-full" />
        <p className="text-xs sm:text-sm text-gray-500 mt-2 font-medium">
          A showcase of UI/UX concepts, graphic design branding, and video motion art.
        </p>
      </div>

      {/* 6-Card Gallery Grid matching Canva reference */}
      <div className="relative z-10 w-full max-w-5xl my-auto py-2 overflow-y-auto max-h-[62vh] pr-2">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
          {works.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedWork(item)}
              className="group relative bg-gray-100 rounded-2xl overflow-hidden aspect-[4/3] border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-black"
            >
              {/* Background Image */}
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Gradient Dark Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Category Pill Top Left */}
              <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-black/70 backdrop-blur-md text-white text-[10px] font-mono uppercase tracking-wider rounded-full">
                {item.category}
              </span>

              {/* Bottom Card Bar: Title & External Link Icon (matching reference) */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 flex items-center justify-between">
                <span className="font-bold-display text-xs sm:text-sm font-bold text-white truncate max-w-[80%]">
                  {item.title}
                </span>

                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all duration-200 shrink-0">
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox / Preview Modal for Selected Creative Work */}
      {selectedWork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setSelectedWork(null)}
              aria-label="Close preview"
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-video w-full bg-gray-900 overflow-hidden">
              <img
                src={selectedWork.image_url}
                alt={selectedWork.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 bg-sonez-blue/10 text-sonez-blue text-xs font-mono font-bold uppercase rounded-full">
                  {selectedWork.category}
                </span>
              </div>
              <h3 className="font-bold-display text-xl font-bold text-black">
                {selectedWork.title}
              </h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                {selectedWork.description || 'Creative asset created by Sadeepa (SONEZ) combining clean visual aesthetics and functional design.'}
              </p>

              {(() => {
                const c = getContact(selectedWork.category);
                const waNum = c.whatsapp.replace(/[^0-9]/g, '');
                const msg = `Hi ${c.name}! I saw "${selectedWork.title}" on the SONEZ portfolio and I'd like to talk about a project.`;
                  return (
                    <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">
                          Created by
                        </span>
                        <span className="text-sm font-bold text-black block">{c.name}</span>
                        <span className="text-xs text-gray-500">{c.role}</span>
                      </div>

                      <a
                        href={`https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-emerald-600 text-white text-xs font-bold rounded-full transition-all shadow-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Contact on WhatsApp</span>
                      </a>
                    </div>
                  );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Bottom info label */}
      <div className="relative z-10 w-full max-w-6xl flex items-center justify-end pt-2 pr-2 sm:pr-8">
        <span className="text-xs text-gray-400 font-mono hidden sm:inline-block">
          CREATIVE LABS • SONEZ
        </span>
      </div>
    </section>
  );
}
