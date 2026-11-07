import React from 'react';
import { Gamepad2, Wrench, ShieldCheck, Zap, Sparkles, ChevronDown, Award } from 'lucide-react';
import { PlayStationSymbolsRow, PsTriangle, PsCircle, PsCross, PsSquare } from './PlayStationSymbols';

export default function Hero({ onScrollToSection, onOpenFullCatalog }) {
  return (
    <section id="hero" className="relative pt-6 pb-12 sm:pt-12 sm:pb-20 overflow-hidden">
      {/* Background Glows & Ambient lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-ps-blue/15 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-ps-neon/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Floating PlayStation Symbols in Background */}
      <div className="absolute left-6 top-20 opacity-20 pointer-events-none hidden lg:block animate-float">
        <PsTriangle className="w-16 h-16" />
      </div>
      <div className="absolute right-12 top-28 opacity-20 pointer-events-none hidden lg:block animate-float [animation-delay:1.5s]">
        <PsCircle className="w-14 h-14" />
      </div>
      <div className="absolute left-20 bottom-12 opacity-15 pointer-events-none hidden lg:block animate-float [animation-delay:3s]">
        <PsCross className="w-12 h-12" />
      </div>
      <div className="absolute right-24 bottom-16 opacity-20 pointer-events-none hidden lg:block animate-float [animation-delay:4.5s]">
        <PsSquare className="w-16 h-16" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Top badge */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-ps-surface border border-ps-neon/30 text-[11px] sm:text-sm text-slate-200 mb-4 sm:mb-6 shadow-ps-glow">
          <PlayStationSymbolsRow size="w-3 h-3 sm:w-3.5 sm:h-3.5" spacing="space-x-1" />
          <span className="text-ps-neon font-semibold tracking-wide">Aguilares, Tucumán</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300">Servicio Especializado PS3 & PS4</span>
        </div>

        {/* Main Title */}
        <h1 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight font-gaming">
          TU TEMPLO GAMER Y TALLER TÉCNICO EN{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-ps-blueLight via-ps-neon to-white">
            AGUILARES
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-3 sm:mt-5 text-xs sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Consolas garantizadas, los mejores juegos físicos y digitales, mandos DualShock y servicio técnico de alta precisión con limpieza ultrasónica y pasta térmica Arctic MX-4.
        </p>

        {/* CTAs */}
        <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto sm:max-w-none">
          <button
            onClick={() => onOpenFullCatalog ? onOpenFullCatalog() : onScrollToSection('catalogo')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-ps-blue to-ps-blueDark hover:from-ps-blueLight hover:to-ps-blue text-white font-bold text-xs sm:text-sm tracking-wide shadow-ps-glow transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer active:scale-98"
          >
            <Gamepad2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>VER CATÁLOGO COMPLETO</span>
          </button>

          <button
            onClick={() => onScrollToSection('servicios')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-ps-surface border border-ps-border hover:border-ps-neon text-white font-bold text-xs sm:text-sm tracking-wide hover:shadow-ps-glow transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer active:scale-98"
          >
            <Wrench className="w-5 h-5 text-ps-neon group-hover:rotate-45 transition-transform" />
            <span>SERVICIO TÉCNICO & PRECIOS</span>
          </button>

          <button
            onClick={() => onScrollToSection('tracking')}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Seguimiento por DNI</span>
          </button>
        </div>

        {/* Trust Badges Bar */}
        <div className="mt-8 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 max-w-4xl mx-auto">
          <div className="p-2.5 sm:p-4 rounded-xl bg-ps-surface/80 border border-ps-border/70 flex items-center gap-2.5 sm:gap-3 text-left">
            <div className="p-1.5 sm:p-2 rounded-lg bg-ps-blue/20 text-ps-neon shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Garantía Escrita</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-400">90 días de respaldo</p>
            </div>
          </div>

          <div className="p-2.5 sm:p-4 rounded-xl bg-ps-surface/80 border border-ps-border/70 flex items-center gap-2.5 sm:gap-3 text-left">
            <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Turnos Rápidos</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-400">24 a 48 hs hábiles</p>
            </div>
          </div>

          <div className="p-2.5 sm:p-4 rounded-xl bg-ps-surface/80 border border-ps-border/70 flex items-center gap-2.5 sm:gap-3 text-left">
            <div className="p-1.5 sm:p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
              <Award className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Repuestos Top</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-400">Packs Arctic MX-4</p>
            </div>
          </div>

          <div className="p-2.5 sm:p-4 rounded-xl bg-ps-surface/80 border border-ps-border/70 flex items-center gap-2.5 sm:gap-3 text-left">
            <div className="p-1.5 sm:p-2 rounded-lg bg-purple-500/20 text-purple-400 shrink-0">
              <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Consolas y HEN</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-400">Listas para jugar</p>
            </div>
          </div>
        </div>

        {/* Scroll down indicator */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => onScrollToSection('catalogo')}
            className="text-slate-500 hover:text-ps-neon transition-colors p-2"
            aria-label="Ir al catálogo"
          >
            <ChevronDown className="w-6 h-6 animate-bounce" />
          </button>
        </div>

      </div>
    </section>
  );
}
