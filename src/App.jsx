import React, { useState } from 'react';
import { useApp, AppProvider } from './context/AppContext';
import Header from './components/Header';
import Hero from './components/Hero';
import CatalogSection from './components/CatalogSection';
import FullCatalogPage from './components/FullCatalogPage';
import ServicesSection from './components/ServicesSection';
import RepairTrackerSection from './components/RepairTrackerSection';
import CartDrawer from './components/CartDrawer';
import AdminModal from './components/AdminModal';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import ToastNotification from './components/ToastNotification';

function MainLayout() {
  const { isAdmin, setIsAdminModalOpen } = useApp();
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'catalog'
  const [catalogInitialCategory, setCatalogInitialCategory] = useState('all');

  const handleOpenAdmin = () => {
    if (isAdmin) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminDashboardOpen(true);
  };

  const handleScrollToSection = (sectionId) => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleOpenFullCatalog = (category = 'all') => {
    setCatalogInitialCategory(category);
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-ps-bg text-slate-100 flex flex-col selection:bg-ps-blue selection:text-white">
      {/* Header */}
      <Header
        currentView={currentView}
        onNavigateView={(view) => {
          if (view === 'catalog') handleOpenFullCatalog();
          else handleBackToHome();
        }}
        onOpenAdmin={handleOpenAdmin}
        onScrollToSection={handleScrollToSection}
      />

      {/* Main Public Content */}
      <main className="flex-1">
        {currentView === 'catalog' ? (
          <FullCatalogPage
            onBackToHome={handleBackToHome}
            initialCategory={catalogInitialCategory}
          />
        ) : (
          <>
            <Hero
              onScrollToSection={handleScrollToSection}
              onOpenFullCatalog={() => handleOpenFullCatalog()}
            />
            <CatalogSection onOpenFullCatalog={handleOpenFullCatalog} />
            <ServicesSection />
            <RepairTrackerSection />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenAdmin={handleOpenAdmin}
        onScrollToSection={handleScrollToSection}
        onOpenFullCatalog={() => handleOpenFullCatalog()}
      />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Admin Login Modal (PIN check) */}
      <AdminModal onLoginSuccess={handleLoginSuccess} />

      {/* Admin Private Dashboard Full View */}
      {isAdmin && isAdminDashboardOpen && (
        <AdminDashboard onClose={() => setIsAdminDashboardOpen(false)} />
      )}

      {/* Toast Notifications */}
      <ToastNotification />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
