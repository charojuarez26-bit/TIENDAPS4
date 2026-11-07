import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatARS } from '../utils/formatters';
import { Wrench, CheckCircle, Clock, ShieldCheck, Fan, Cpu, Gamepad2, Tv2, Plus, Sparkles, Check } from 'lucide-react';
import { PlayStationSymbolsRow } from './PlayStationSymbols';

const SERVICE_ICONS = {
  Fan: Fan,
  Cpu: Cpu,
  Gamepad2: Gamepad2,
  Tv2: Tv2,
};

export default function ServicesSection() {
  const { services, addToCart } = useApp();
  const [addedIds, setAddedIds] = useState({});

  const handleAddService = (service) => {
    addToCart(service, true);
    setAddedIds(prev => ({ ...prev, [service.id]: true }));
    setTimeout(() => {
      setAddedIds(prev => ({ ...prev, [service.id]: false }));
    }, 1500);
  };

  return (
    <section id="servicios" className="py-12 md:py-20 bg-gradient-to-b from-ps-bg via-ps-surface/40 to-ps-bg relative border-t border-ps-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <PlayStationSymbolsRow size="w-3.5 h-3.5" />
            <span className="text-xs uppercase font-bold text-ps-neon tracking-wider">Laboratorio Técnico Aguilares</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-gaming tracking-wide">
            SERVICIO TÉCNICO ESPECIALIZADO
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-300">
            Diagnóstico preciso en banco de trabajo, insumos térmicos importados de alta gama y garantía escrita en cada trabajo realizado.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => {
            const Icon = SERVICE_ICONS[service.icon] || Wrench;
            const isAdded = addedIds[service.id];

            return (
              <div
                key={service.id}
                className="group flex flex-col justify-between rounded-2xl bg-ps-surface border border-ps-border hover:border-ps-neon/60 hover:shadow-ps-glow transition-all duration-300 p-6 relative overflow-hidden"
              >
                {/* Glow accent */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-ps-blue/10 rounded-full blur-xl group-hover:bg-ps-neon/20 transition-all pointer-events-none" />

                <div>
                  {/* Top Bar with Icon & Turnaround */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="p-3 rounded-xl bg-ps-blue/20 text-ps-neon border border-ps-blue/30 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-[11px] font-semibold text-slate-300 border border-slate-700">
                      <Clock className="w-3 h-3 text-ps-neon" />
                      <span>{service.turnaround || '24 a 48 hs'}</span>
                    </div>
                  </div>

                  {/* Platform badge */}
                  {service.platform && (
                    <span className="text-[10px] font-bold text-ps-blueLight uppercase tracking-wider block mb-1">
                      {service.platform}
                    </span>
                  )}

                  {/* Title & Subtitle */}
                  <h3 className="text-lg font-bold text-white group-hover:text-ps-neon transition-colors leading-snug">
                    {service.title}
                  </h3>

                  {service.subtitle && (
                    <p className="text-xs text-slate-400 mt-1 font-medium">
                      {service.subtitle}
                    </p>
                  )}

                  {/* Highlights banner */}
                  {service.highlight && (
                    <div className="mt-3 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span>{service.highlight}</span>
                    </div>
                  )}

                  {/* Checklist of what's included */}
                  {Array.isArray(service.includes) && service.includes.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-ps-border/70 space-y-2">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                        Incluye:
                      </div>
                      {service.includes.map((inc, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-tight">{inc}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Footer Price & Button */}
                <div className="mt-6 pt-4 border-t border-ps-border/70">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-slate-400">Precio base desde:</span>
                    <span className="text-xl font-extrabold text-white font-gaming text-ps-neon">
                      {formatARS(service.price)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddService(service)}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 ${
                      isAdded
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'bg-ps-surfaceLight hover:bg-ps-blue border border-ps-border hover:border-ps-neon text-white shadow-sm hover:shadow-ps-glow'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>¡Servicio Agregado!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-ps-neon" />
                        <span>Solicitar Turno / Agregar</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Extra Service Guarantee Card */}
        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-ps-surface via-slate-900 to-ps-surface border border-ps-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">¿Tenés otra falla o consulta técnica?</h4>
              <p className="text-xs sm:text-sm text-slate-400">
                Traé tu consola al local en el centro de Aguilares para presupuesto sin cargo. También reparamos fuentes, lectores y HDMI.
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/5493865000000?text=%C2%A1Hola!%20Tengo%20una%20consulta%20t%C3%A9cnica%20sobre%20mi%20consola"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-ps-blue/20 hover:bg-ps-blue border border-ps-blue/40 text-ps-neon hover:text-white font-semibold text-xs transition-all whitespace-nowrap shadow-sm"
          >
            Consultar al Técnico por WhatsApp
          </a>
        </div>

      </div>
    </section>
  );
}
