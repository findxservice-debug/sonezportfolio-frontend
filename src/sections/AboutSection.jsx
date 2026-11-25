import React from 'react';
import { useSite } from '../context/SiteContext';
import { Check, Sparkles } from 'lucide-react';

export default function AboutSection() {
  const { content } = useSite();

  const whoTitle = content.about_who_title || 'Who is SONEZ ?';
  const whoText = content.about_who_text || "I'm Sadeepa Sithumina Amarasiriwardhana known as Sonez, an A/L student from Kurunegala District, Sri Lanka. And I am a freelancer in Web Development and video editing.";
  const journeyTitle = content.about_journey_title || 'My Journey :';
  const journeyText = content.about_journey_text || "I started web development less than a 2 year ago and I'm currently focused on learning and building my skills.";
  const approachTitle = content.about_approach_title || 'Learning Approach :';
  const approachText = content.about_approach_text || "I'm focused about my current learning process";
  const workingOnTitle = content.about_working_on_title || "What I'm Working On :";
  const workingOnItems = Array.isArray(content.about_working_on_items)
    ? content.about_working_on_items
    : [
        'Personal website development',
        'Practice web applications',
        'Learning new technologies',
        'Building strong foundation in web development'
      ];
  const passionText = content.about_passion_text || "I'm passionate about web development and committed to continuous learning. Every project is an opportunity to grow and improve my skills !";
  const techStackDesc = content.tech_stack_desc || "I naturally explore a diverse range of programming languages and frameworks, and developer tools that empower me to build robust, scalable, and high-performing applications. With a strong command of HTML, CSS, and JavaScript, I create visually appealing and responsive web interfaces that enhance user engagement. My expertise extends to modern frameworks like React, Tailwind CSS, and Spline, enabling me to develop interactive, efficient, and maintainable frontend architectures.";
  const coreServices = Array.isArray(content.core_services) ? content.core_services : [];

  return (
    <section className="snap-section relative w-full h-screen min-h-[680px] bg-white flex flex-col justify-between items-center pt-20 pb-10 px-6 sm:px-12 overflow-hidden">
      {/* Title */}
      <div className="relative z-10 text-center max-w-3xl pt-2">
        <h2 className="font-futuristic text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-black uppercase">
          ABOUT ME
        </h2>
        <div className="w-12 h-1 bg-sonez-blue mx-auto mt-2 rounded-full" />
      </div>

      {/* Main Content Area - Scrollable Container */}
      <div className="relative z-10 w-full max-w-5xl my-auto py-2 overflow-y-auto max-h-[65vh] pr-2 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Who is SONEZ & Journey */}
          <div className="lg:col-span-6 space-y-4">
            {/* Who is SONEZ Card */}
            <div className="p-6 bg-gray-50/80 rounded-2xl border border-gray-200 shadow-sm hover:border-black transition-all">
              <h3 className="font-bold-display text-lg font-bold text-black flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-sonez-blue"></span>
                {whoTitle}
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
                {whoText}
              </p>
            </div>

            {/* Journey & Approach */}
            <div className="p-6 bg-gray-50/80 rounded-2xl border border-gray-200 shadow-sm hover:border-black transition-all space-y-3">
              <div>
                <h4 className="font-bold-display text-sm font-bold text-black mb-1">
                  {journeyTitle}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {journeyText}
                </p>
              </div>

              <div className="pt-2 border-t border-gray-200/60">
                <h4 className="font-bold-display text-sm font-bold text-black mb-1">
                  {approachTitle}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {approachText}
                </p>
              </div>
            </div>

            {/* What I'm Working On */}
            <div className="p-6 bg-black text-white rounded-2xl shadow-md space-y-3">
              <h4 className="font-bold-display text-sm font-bold tracking-wide uppercase text-sonez-blue flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                {workingOnTitle}
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-300">
                {workingOnItems.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-sonez-blue shrink-0"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-400 italic pt-2 border-t border-gray-800">
                "{passionText}"
              </p>
            </div>
          </div>

          {/* Right Column: Tech Stack & Core Services */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:border-black transition-all">
              <h3 className="font-futuristic text-sm font-extrabold text-black tracking-wider uppercase mb-2">
                TECH STACK PHILOSOPHY
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-sans mb-4">
                {techStackDesc}
              </p>

              <h4 className="font-bold-display text-xs font-bold text-gray-900 tracking-wider uppercase mb-3">
                Core Technologies & Services :
              </h4>
              <div className="space-y-2.5">
                {coreServices.map((svc, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-2.5 hover:bg-gray-100/80 transition-colors">
                    <Check className="w-4 h-4 text-sonez-blue shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold-display text-xs font-bold text-black block">
                        {svc.title}
                      </span>
                      <span className="text-[11px] text-gray-600 leading-tight block mt-0.5">
                        {svc.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom info label */}
      <div className="relative z-10 w-full max-w-6xl flex items-center justify-end pt-2 pr-2 sm:pr-8">
        <span className="text-xs text-gray-400 font-mono hidden sm:inline-block">
          SADEEPA SITHUMINA • SONEZ
        </span>
      </div>
    </section>
  );
}
