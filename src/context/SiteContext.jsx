import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { api } from '../services/api';

const SiteContext = createContext();

export function SiteProvider({ children }) {
  const [content, setContent] = useState({});
  const [loadingContent, setLoadingContent] = useState(true);
  const [activeSection, setActiveSection] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMode, setChatMode] = useState('auto'); // 'auto' | 'sonez'
  const [currentPage, setCurrentPage] = useState('portfolio'); // 'portfolio' | 'store' | 'admin-login' | 'admin-dashboard'
  
  // Cookie Consent: 'accepted' | 'declined' | null
  const [cookieConsent, setCookieConsent] = useState(() => {
    return localStorage.getItem('sonez_cookie_consent') || null;
  });

  // Visitor ID: generate persistent ID if consent accepted, else temporary session ID
  const [visitorId] = useState(() => {
    const saved = localStorage.getItem('sonez_visitor_id');
    if (saved) return saved;
    const newId = 'vis_' + Math.random().toString(36).substring(2, 12);
    return newId;
  });

  const scrollContainerRef = useRef(null);
  const lastTrackedSectionRef = useRef(-1); // prevent analytics spam

  // Load Content from API
  const refreshContent = async () => {
    try {
      const res = await api.getContent();
      if (res.success && res.settings) {
        setContent(res.settings);
      }
    } catch (err) {
      console.error('Failed to load site content:', err);
    } finally {
      setLoadingContent(false);
    }
  };

  useEffect(() => {
    refreshContent();
  }, []);

  // Handle Cookie consent change
  const handleSetCookieConsent = (consent) => {
    setCookieConsent(consent);
    if (consent === 'accepted') {
      localStorage.setItem('sonez_cookie_consent', 'accepted');
      localStorage.setItem('sonez_visitor_id', visitorId);
    } else {
      localStorage.setItem('sonez_cookie_consent', 'declined');
      localStorage.removeItem('sonez_visitor_id');
      localStorage.removeItem('sonez_chat_session');
    }
  };

  // Section names map
  const sectionNames = [
    'Home',
    'Technologies',
    'About Me',
    'Projects',
    'Things My Team Created',
    'Client Reviews',
    'Get In Touch'
  ];

  // Smooth scroll to section by index
  const scrollToSection = (index) => {
    if (currentPage !== 'portfolio') {
      setCurrentPage('portfolio');
      setTimeout(() => {
        doScroll(index);
      }, 100);
    } else {
      doScroll(index);
    }
  };

  const doScroll = (index) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const sections = container.querySelectorAll('.snap-section');
    if (sections[index]) {
      sections[index].scrollIntoView({ behavior: 'smooth' });
      setActiveSection(index);
      // Track analytics only when section actually changes (prevent spam)
      if (lastTrackedSectionRef.current !== index) {
        lastTrackedSectionRef.current = index;
        api.trackVisit(visitorId, window.location.pathname, sectionNames[index]);
      }
    }
  };

  return (
    <SiteContext.Provider value={{
      content,
      loadingContent,
      refreshContent,
      activeSection,
      setActiveSection,
      sectionNames,
      scrollToSection,
      scrollContainerRef,
      isMenuOpen,
      setIsMenuOpen,
      isChatOpen,
      setIsChatOpen,
      chatMode,
      setChatMode,
      currentPage,
      setCurrentPage,
      cookieConsent,
      setCookieConsent: handleSetCookieConsent,
      visitorId
    }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  return useContext(SiteContext);
}
