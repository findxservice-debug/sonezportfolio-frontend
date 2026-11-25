import React, { useEffect, useRef, useCallback } from 'react';
import { useSite } from '../context/SiteContext';
import HeroSection from '../sections/HeroSection';
import TechnologiesSection from '../sections/TechnologiesSection';
import AboutSection from '../sections/AboutSection';
import ProjectsSection from '../sections/ProjectsSection';
import CreativeSection from '../sections/CreativeSection';
import ReviewsSection from '../sections/ReviewsSection';
import ContactSection from '../sections/ContactSection';

const WHEEL_THRESHOLD = 80;  // "hard scroll" strength needed at the edge
const WHEEL_PAUSE = 250;     // ms of no wheel input = a new gesture
const SWIPE_THRESHOLD = 60;  // px swipe needed at the edge

export default function PortfolioHome() {
  const { activeSection, setActiveSection, scrollContainerRef, sectionNames } = useSite();

  const isLockedRef = useRef(false);
  const currentSectionRef = useRef(activeSection);
  currentSectionRef.current = activeSection;

  const goToSection = useCallback((targetIndex) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const sections = container.querySelectorAll('.snap-section');
    if (sections[targetIndex]) {
      isLockedRef.current = true;
      sections[targetIndex].scrollIntoView({ behavior: 'smooth' });
      setActiveSection(targetIndex);
      setTimeout(() => { isLockedRef.current = false; }, 800);
    }
  }, [scrollContainerRef, setActiveSection]);

  // Find the nearest scrollable inner box (the max-h overflow-y-auto div)
  const findScroller = (target, container) => {
    let el = target;
    while (el && el !== container) {
      if (el.classList?.contains('overflow-y-auto') && el.scrollHeight > el.clientHeight + 2) return el;
      el = el.parentElement;
    }
    return null;
  };

  const isAtEdge = (scroller, dir) => {
    if (!scroller) return true; // nothing to scroll inside the section
    return dir > 0
      ? scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 4
      : scroller.scrollTop <= 4;
  };

  // Mouse wheel / trackpad
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const g = { last: 0, startedAtEdge: false, acc: 0 };

    const handleWheel = (e) => {
      if (e.target.closest?.('.fixed')) return; // popups / modals scroll normally
      const dir = e.deltaY > 0 ? 1 : -1;
      const scroller = findScroller(e.target, container);
      const now = performance.now();

      // Still scrolling inside the section -> let it scroll normally
      if (scroller && !isAtEdge(scroller, dir)) {
        g.last = now; g.startedAtEdge = false; g.acc = 0;
        return;
      }

      e.preventDefault();

      // A new gesture (after a short pause) that begins at the edge = "hard scroll"
      if (now - g.last > WHEEL_PAUSE) { g.startedAtEdge = true; g.acc = 0; }
      g.last = now;

      if (!g.startedAtEdge || isLockedRef.current) return;

      g.acc += Math.abs(e.deltaY);
      if (g.acc >= WHEEL_THRESHOLD) {
        const cur = currentSectionRef.current;
        const next = cur + dir;
        g.acc = 0; g.startedAtEdge = false;
        if (next >= 0 && next < sectionNames.length) goToSection(next);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [goToSection, scrollContainerRef, sectionNames.length]);

  // Touch swipe (mobile / tablet)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const t = { y: 0, scroller: null, atTop: true, atBottom: true, modal: false };

    const onStart = (e) => {
      t.modal = !!e.target.closest?.('.fixed');
      t.y = e.touches[0].clientY;
      t.scroller = findScroller(e.target, container);
      t.atTop = isAtEdge(t.scroller, -1);
      t.atBottom = isAtEdge(t.scroller, 1);
    };

    const onEnd = (e) => {
      if (t.modal || isLockedRef.current) return;
      const delta = t.y - e.changedTouches[0].clientY; // >0 = swipe up (go down)
      if (Math.abs(delta) < SWIPE_THRESHOLD) return;
      const dir = delta > 0 ? 1 : -1;
      const startedAtEdge = dir > 0 ? t.atBottom : t.atTop;
      if (!startedAtEdge) return; // was scrolling inside the section

      const next = currentSectionRef.current + dir;
      if (next >= 0 && next < sectionNames.length) goToSection(next);
    };

    container.addEventListener('touchstart', onStart, { passive: true });
    container.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      container.removeEventListener('touchstart', onStart);
      container.removeEventListener('touchend', onEnd);
    };
  }, [goToSection, scrollContainerRef, sectionNames.length]);

  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      const cur = currentSectionRef.current;
      const max = sectionNames.length - 1;
      if ((e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') && cur < max) {
        e.preventDefault(); goToSection(cur + 1);
      } else if ((e.key === 'ArrowUp' || e.key === 'PageUp') && cur > 0) {
        e.preventDefault(); goToSection(cur - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goToSection, sectionNames.length]);

  // Keep active section in sync
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const sections = container.querySelectorAll('.snap-section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const index = Array.from(sections).indexOf(entry.target);
            if (index !== -1 && !isLockedRef.current) setActiveSection(index);
          }
        });
      },
      { root: container, threshold: 0.5 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [scrollContainerRef, setActiveSection]);

  return (
    <div
      ref={scrollContainerRef}
      className="snap-scroll-container w-full h-screen overflow-y-hidden relative"
    >
      <HeroSection />
      <TechnologiesSection />
      <AboutSection />
      <ProjectsSection />
      <CreativeSection />
      <ReviewsSection />
      <ContactSection />
    </div>
  );
}