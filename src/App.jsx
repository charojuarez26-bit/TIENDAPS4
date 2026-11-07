import React, { useState } from 'react';
import { useApp, AppProvider } from './context/AppContext';
import Header from './components/Header';
import Hero from './components/Hero';
import CatalogSection from './components/CatalogSection';
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
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-ps-bg text-slate-100 flex flex-col selection:bg-ps-blue selection:text-white">
      {/* Header */}
      <Header
        onOpenAdmin={handleOpenAdmin}
        onScrollToSection={handleScrollToSection}
      />

      {/* Main Public Content */}
      <main className="flex-1">
        <Hero onScrollToSection={handleScrollToSection} />
        <CatalogSection />
        <ServicesSection />
        <RepairTrackerSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenAdmin={handleOpenAdmin}
        onScrollToSection={handleScrollToSection}
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
