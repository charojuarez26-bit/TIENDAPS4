import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Phone, Clock, MessageSquare, ShieldCheck, Heart, Lock } from 'lucide-react';
import { PlayStationSymbolsRow } from './PlayStationSymbols';

export default function Footer({ onOpenAdmin, onScrollToSection, onOpenFullCatalog }) {
  const { config, isAdmin } = useApp();

  return (
    <footer className="bg-slate-950 border-t border-ps-border relative overflow-hidden text-slate-400 text-xs">
      {/* Top PlayStation gradient accent line */}
      <div className="h-1 bg-gradient-to-r from-ps-blueDark via-ps-neon to-ps-blue" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-ps-blue flex items-center justify-center font-bold text-white text-base shadow-ps-glow font-gaming">
                PS
              </div>
              <div>
                <span className="font-gaming text-lg font-bold text-white tracking-wider block">
                  {config.businessName}
                </span>
                <span className="text-[10px] text-ps-neon tracking-wide">Gaming & Servicio Técnico Especializado</span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              El punto de encuentro para gamers de Aguilares y el sur de Tucumán. Especialistas en consolas PlayStation 3 y PlayStation 4 con repuestos certificados.
            </p>

            <div className="pt-1">
              <PlayStationSymbolsRow size="w-3.5 h-3.5" spacing="space-x-2" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-gaming text-sm font-bold uppercase tracking-wider">
              Navegación Rápida
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onOpenFullCatalog ? onOpenFullCatalog() : onScrollToSection('catalogo')}
                  className="hover:text-ps-neon transition-colors font-bold text-ps-blueLight flex items-center gap-1 cursor-pointer"
                >
                  <span>✨ Catálogo Completo Exclusivo</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('catalogo')}
                  className="hover:text-ps-neon transition-colors cursor-pointer"
                >
                  🎮 Juegos Destacados y Consolas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('servicios')}
                  className="hover:text-ps-neon transition-colors cursor-pointer"
                >
                  🛠️ Mantenimiento y Servicio Técnico
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('tracking')}
                  className="hover:text-ps-neon transition-colors cursor-pointer"
                >
                  🔍 Seguimiento de Reparación por DNI
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Lock className="w-3 h-3" /> Panel de Control Taller (PIN)
                </button>
              </li>
            </ul>
          </div>

          {/* Local Aguilares info */}
          <div className="space-y-3">
            <h4 className="text-white font-gaming text-sm font-bold uppercase tracking-wider">
              Ubicación & Local
            </h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-ps-neon shrink-0 mt-0.5" />
                <span className="text-slate-300">{config.address}</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">{config.businessHours || 'Lunes a Sábado de 09:30 a 13:00 y 17:30 a 21:30'}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Garantía escrita de 90 días en todos los trabajos</span>
              </div>
            </div>
          </div>

          {/* WhatsApp Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-gaming text-sm font-bold uppercase tracking-wider">
              Atención Directa
            </h4>
            <p className="text-slate-400 text-xs">
              Escribinos por WhatsApp para cotizaciones, presupuestos o dudas sobre tu pedido.
            </p>
            <a
              href={`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(`¡Hola ${config.businessName || 'El Rey Play'}! Quiero hacer una consulta.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chatear por WhatsApp</span>
            </a>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>
            © {new Date().getFullYear()} {config.businessName}. Todos los derechos reservados. Aguilares, Tucumán, Argentina.
          </p>

          <p className="flex items-center gap-1">
            <span>Desarrollado para la comunidad gamer de Aguilares</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
