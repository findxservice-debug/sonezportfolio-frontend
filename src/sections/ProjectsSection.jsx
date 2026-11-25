import React, { useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { api } from '../services/api';
import { ExternalLink, Github, FolderCheck, Laptop, Briefcase, Clock, Users, Lock, X } from 'lucide-react';

export default function ProjectsSection() {
  const { content } = useSite();
  const [projects, setProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [totalVisitors, setTotalVisitors] = useState(142);
  const [lockedProject, setLockedProject] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getProjects();
        if (res.success && res.projects) {
          setProjects(res.projects);
        }
        // Fetch real analytics visitor count if available
        const statsRes = await api.getAnalyticsStats().catch(() => null);
        if (statsRes?.metrics?.totalVisitors) {
          setTotalVisitors(statsRes.metrics.totalVisitors);
        }
      } catch (err) {
        console.error('Failed to load projects:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = ['All', 'Personal', 'Freelance'];

  const filteredProjects = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.category.toLowerCase() === activeFilter.toLowerCase());

  const stats = [
    { label: 'All Projects Completed', count: '8+', icon: FolderCheck },
    { label: 'Personal Projects', count: '1', icon: Laptop },
    { label: 'Freelance Projects', count: '3', icon: Briefcase },
    { label: 'Still in Development', count: '2', icon: Clock }
];

  return (
    <section className="snap-section relative w-full h-screen min-h-[680px] bg-white flex flex-col justify-between items-center pt-20 pb-10 px-6 sm:px-12 overflow-hidden">
      {/* Title */}
      <div className="relative z-10 text-center max-w-3xl pt-2">
        <h2 className="font-futuristic text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-black uppercase">
          PROJECTS
        </h2>
        <div className="w-12 h-1 bg-sonez-blue mx-auto mt-2 rounded-full" />
      </div>

      {/* Main Content Area: Stats Cards + Filterable Project Grid */}
      <div className="relative z-10 w-full max-w-6xl my-auto py-2 overflow-y-auto max-h-[65vh] pr-2 space-y-5">
        {/* Metric Counters Grid matching Canva reference */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="p-3 sm:p-4 bg-gray-50/80 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center hover:border-black transition-colors"
              >
                <Icon className="w-4 h-4 text-sonez-blue mb-1" />
                <span className="font-futuristic text-lg sm:text-xl font-black text-black">
                  {s.count}
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium text-gray-500 uppercase tracking-tight mt-0.5">
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  activeFilter === cat
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <span className="text-xs font-mono text-gray-400">
            Showing {filteredProjects.length} Projects
          </span>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className="group bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:border-black"
            >
              <div>
                {/* Project Image Preview */}
                <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 right-2 px-2.5 py-0.5 bg-black/80 backdrop-blur-md text-white text-[10px] font-mono uppercase tracking-wider rounded-full">
                    {p.category}
                  </span>

                  {p.is_locked ? (
                    <span className="absolute top-2 left-2 px-2.5 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center gap-1 shadow-md">
                      <Lock className="w-3 h-3" /> LOCKED
                    </span>
                  ) : null}
                </div>

                {/* Details */}
                <div className="p-4 sm:p-5">
                  <h3 className="font-bold-display text-base sm:text-lg font-bold text-black group-hover:text-sonez-blue transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {p.technologies?.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-medium rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Links */}
              <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-gray-100 flex items-center justify-between">
                {p.github_url ? (
                  <a
                    href={p.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-black transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>Source</span>
                  </a>
                ) : <span />}

                {p.is_locked ? (
                  <button
                    onClick={() => setLockedProject(p)}
                    className="flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Locked</span>
                  </button>
                ) : (
                p.demo_url && (
                  <a
                    href={p.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold text-sonez-blue hover:text-blue-700 transition-colors"
                  >
                    <span>Live Demo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom info label */}
      <div className="relative z-10 w-full max-w-6xl flex items-center justify-end pt-2 pr-2 sm:pr-8">
        <span className="text-xs text-gray-400 font-mono hidden sm:inline-block">
          FEATURED PROJECTS • SONEZ
        </span>
      </div>

      {lockedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setLockedProject(null)}
        >
          <div
            className="relative w-full max-w-sm bg-white rounded-3xl p-8 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLockedProject(null)}
              aria-label="Close"
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="font-bold-display text-lg font-bold text-black">
              {lockedProject.title}
            </h3>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">
              This project is temporarily locked due to ongoing development or updates.
            </p>
            <button
                onClick={() => setLockedProject(null)}
                className="mt-6 px-6 py-2.5 bg-black hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider rounded-full"
            >
              Got it
            </button>
          </div>
        </div>
      )}


    </section>
  );
}
