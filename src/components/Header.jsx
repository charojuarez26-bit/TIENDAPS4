import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Lock, ShieldCheck, Wrench, Menu, X, MapPin, Grid, Crown } from 'lucide-react';
import { PlayStationSymbolsRow } from './PlayStationSymbols';

export default function Header({
  currentView = 'home',
  onNavigateView,
  onOpenAdmin,
  onScrollToSection
}) {
  const { config, cartCount, setIsCartOpen, isAdmin, logoutAdmin, products } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogoClick = () => {
    setMobileMenuOpen(false);
    if (onNavigateView) onNavigateView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoFullCatalog = () => {
    setMobileMenuOpen(false);
    if (onNavigateView) onNavigateView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    if (currentView !== 'home' && onNavigateView) {
      onNavigateView('home');
      setTimeout(() => {
        if (onScrollToSection) onScrollToSection(sectionId);
      }, 100);
    } else {
      if (onScrollToSection) {
        onScrollToSection(sectionId);
      } else {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-ps-bg/90 backdrop-blur-md border-b border-ps-border transition-all">
      {/* Top micro-bar */}
      <div className="bg-gradient-to-r from-ps-blueDark/40 via-ps-blue/20 to-ps-neon/10 text-xs py-1 px-4 text-slate-300 border-b border-ps-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-400">Local Abierto</span>
            <span className="text-slate-400 hidden sm:inline">• {config.address}</span>
          </div>

          <div className="flex items-center gap-4">
            <PlayStationSymbolsRow size="w-3 h-3" spacing="space-x-1.5" />
            <span className="text-[11px] text-slate-400 hidden md:inline">Taller Especializado PlayStation</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none" onClick={handleLogoClick}>
            <div className="relative group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-ps-blue via-ps-blueDark to-slate-900 flex items-center justify-center shadow-ps-glow border border-ps-neon/40 group-hover:scale-105 transition-transform">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-ps-neon rounded-full border-2 border-ps-bg flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-ps-bg rounded-full animate-ping"></div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-gaming text-xl sm:text-2xl font-black tracking-wider text-white">
                  EL REY
                </span>
                <span className="font-gaming text-lg sm:text-xl font-black text-ps-neon tracking-wide">
                  PLAY
                </span>
              </div>
              <div className="text-[10px] text-slate-400 tracking-wider flex items-center gap-1 uppercase font-semibold">
                <span className="text-ps-blueLight font-bold">Servicio Técnico</span>
                <span className="text-slate-600">•</span>
                <span>Gaming & Consolas</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => {
                if (currentView !== 'home' && onNavigateView) onNavigateView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`text-sm font-medium transition-colors py-1 cursor-pointer ${
                currentView === 'home' ? 'text-ps-neon font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Inicio
            </button>

            {/* Exclusive Full Catalog Link */}
            <button
              onClick={handleGoFullCatalog}
              className={`relative text-sm font-bold transition-all py-1 flex items-center gap-1.5 px-3 rounded-lg cursor-pointer ${
                currentView === 'catalog'
                  ? 'bg-ps-blue/30 text-ps-neon border border-ps-neon/50 shadow-ps-glow'
                  : 'text-slate-200 hover:text-white bg-slate-900/60 border border-slate-800 hover:border-ps-neon/40'
              }`}
            >
              <Grid className="w-3.5 h-3.5 text-ps-neon" />
              <span>Catálogo Completo</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-ps-blue text-white font-mono font-black shadow">
                +{products.length}
              </span>
            </button>

            <button
              onClick={() => handleNavClick('servicios')}
              className="text-sm font-medium text-slate-300 hover:text-white hover:text-ps-neon transition-colors py-1 cursor-pointer"
            >
              Servicio Técnico
            </button>

            <button
              onClick={() => handleNavClick('tracking')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ps-surface border border-ps-border hover:border-ps-neon text-sm font-semibold text-ps-neon hover:shadow-ps-glow transition-all cursor-pointer"
            >
              <Wrench className="w-4 h-4" />
              <span>Consultar Reparación</span>
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-ps-surface border border-ps-border hover:border-ps-blue text-slate-200 hover:text-white hover:shadow-ps-glow transition-all cursor-pointer"
              aria-label="Abrir Carrito"
            >
              <ShoppingBag className="w-5 h-5 text-ps-neon" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-gradient-to-r from-ps-blue to-ps-neon text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-ps-bg animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Discreet Button */}
            {isAdmin ? (
              <div className="flex items-center gap-1.5 bg-emerald-950/70 border border-emerald-500/40 rounded-xl px-2.5 py-1.5">
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 cursor-pointer"
                  title="Panel de Control Activo"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">Panel Admin</span>
                </button>
                <button
                  onClick={logoutAdmin}
                  className="text-xs text-slate-400 hover:text-rose-400 ml-1 pl-1 border-l border-emerald-800 cursor-pointer"
                  title="Cerrar sesión admin"
                >
                  Salir
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdmin}
                className="p-2.5 rounded-xl bg-ps-surface/50 border border-ps-border hover:border-slate-600 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                title="Acceso Administración (PIN)"
                aria-label="Acceso Administración"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-ps-surface border border-ps-border text-slate-300 hover:text-white cursor-pointer"
              aria-label="Menú móvil"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-ps-surface border-b border-ps-border px-4 py-4 space-y-3 animate-fadeIn">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (onNavigateView) onNavigateView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-slate-200 hover:bg-slate-800 text-sm font-medium"
          >
            🏠 Inicio
          </button>

          <button
            onClick={handleGoFullCatalog}
            className="w-full text-left py-2.5 px-3 rounded-lg bg-ps-blue/25 border border-ps-neon/40 text-ps-neon text-sm font-bold flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Grid className="w-4 h-4" />
              Catálogo Completo Exclusivo
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-ps-blue text-white font-mono">
              +{products.length} Juegos
            </span>
          </button>

          <button
            onClick={() => handleNavClick('servicios')}
            className="w-full text-left py-2 px-3 rounded-lg text-slate-200 hover:bg-slate-800 text-sm font-medium"
          >
            🛠️ Servicios Técnicos y Precios
          </button>

          <button
            onClick={() => handleNavClick('tracking')}
            className="w-full text-left py-2 px-3 rounded-lg bg-slate-900 border border-ps-border text-ps-neon text-sm font-semibold flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Consultar Estado de Reparación
            </span>
            <span className="text-xs text-slate-400">Por DNI</span>
          </button>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-ps-neon" /> {config.address || 'Atención al Público'}
            </span>
            <span className="text-emerald-400 font-medium">Abierto hoy</span>
          </div>
        </div>
      )}
    </header>
  );
}
