import React from 'react';
import { SiteProvider, useSite } from './context/SiteContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import NavigationDots from './components/NavigationDots';
import HamburgerMenu from './components/HamburgerMenu';
import FixedSocials from './components/FixedSocials';
import WhatsAppButton from './components/WhatsAppButton';
import Chatbot from './components/Chatbot';
import CookieBanner from './components/CookieBanner';
import PortfolioHome from './pages/PortfolioHome';
import StorePage from './pages/StorePage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function MainContent() {
  const { currentPage } = useSite();

  return (
    <div className="relative w-full h-full min-h-screen bg-white">
      {/* Header is fixed and visible across portfolio and store */}
      {(currentPage === 'portfolio' || currentPage === 'store') && <Header />}

      {/* Navigation dots fixed on right side */}
      {currentPage === 'portfolio' && <NavigationDots />}

      {/* Permanent Fixed Social Media Icons on bottom-left */}
      {(currentPage === 'portfolio' || currentPage === 'store') && <FixedSocials />}

      {/* Hamburger menu slide-over drawer */}
      <HamburgerMenu />

      {/* Page Views */}
      {currentPage === 'portfolio' && <PortfolioHome />}
      {currentPage === 'store' && <StorePage />}
      {currentPage === 'admin-login' && <AdminLogin />}
      {currentPage === 'admin-dashboard' && <AdminDashboard />}

      {/* Global Interactive Floating Controls on public pages */}
      {(currentPage === 'portfolio' || currentPage === 'store') && (
        <>
          {/* Chatbot icon placed to the left of WhatsApp */}
          <Chatbot />
          {/* WhatsApp icon placed at bottom-right */}
          <WhatsAppButton />
          {/* Cookie banner / preference */}
          <CookieBanner />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SiteProvider>
        <MainContent />
      </SiteProvider>
    </AuthProvider>
  );
}
