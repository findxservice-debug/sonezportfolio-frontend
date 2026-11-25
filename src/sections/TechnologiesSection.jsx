import React, { useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { api } from '../services/api';
import TechIcon from '../components/TechIcon';

export default function TechnologiesSection() {
  const { content } = useSite();
  const [technologies, setTechnologies] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTech() {
      try {
        const res = await api.getTechnologies();
        if (res.success && res.technologies) {
          setTechnologies(res.technologies);
        }
      } catch (err) {
        console.error('Failed to load technologies:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTech();
  }, []);

  const categories = ['All', 'Frontend', 'Backend', 'Database', 'Tools'];

  const filteredTechs = activeFilter === 'All'
    ? technologies
    : technologies.filter(t => t.category.toLowerCase() === activeFilter.toLowerCase());

  return (
    <section className="snap-section relative w-full h-screen min-h-[680px] bg-white flex flex-col justify-between items-center pt-20 pb-10 px-6 sm:px-12 overflow-hidden">
      {/* Section Title */}
      <div className="relative z-10 text-center max-w-3xl pt-2">
        <h2 className="font-futuristic text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-black uppercase">
          TECHNOLOGIES LEVEL
        </h2>
        <div className="w-12 h-1 bg-sonez-blue mx-auto mt-2 rounded-full" />

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 sm:mt-5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide transition-all ${
                activeFilter === cat
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Technology Cards Grid */}
      <div className="relative z-10 w-full max-w-5xl my-auto py-2 overflow-y-auto max-h-[62vh] pr-1">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {filteredTechs.map((tech) => (
            <div
              key={tech.id}
              className="group p-4 bg-white border border-gray-200/80 rounded-2xl shadow-sm hover:shadow-lg hover:border-black transition-all duration-300 flex flex-col items-center text-center transform hover:-translate-y-1"
            >
              {/* Genuine SVG Logo */}
              <div className="w-12 h-12 mb-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <TechIcon iconKey={tech.icon_key} className="w-10 h-10 object-contain" />
              </div>

              {/* Technology Name */}
              <span className="font-bold-display text-sm font-bold text-gray-900 group-hover:text-sonez-blue transition-colors">
                {tech.name}
              </span>

              {/* Category tag */}
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 mt-0.5">
                {tech.category}
              </span>

              {/* Proficiency Level Bar & Percentage */}
              <div className="w-full mt-3">
                <div className="flex items-center justify-between text-[11px] font-bold text-gray-700 mb-1">
                  <span>Level</span>
                  <span className="font-mono text-sonez-blue">{tech.proficiency}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black group-hover:bg-sonez-blue transition-all duration-500 rounded-full"
                    style={{ width: `${tech.proficiency}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom info label */}
      <div className="relative z-10 w-full max-w-6xl flex items-center justify-end pt-2 pr-2 sm:pr-8">
        <span className="text-xs text-gray-400 font-mono hidden sm:inline-block">
          14 CORE TECHNOLOGIES & TOOLS • SONEZ
        </span>
      </div>
    </section>
  );
}
