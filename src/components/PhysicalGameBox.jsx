import React, { useState } from 'react';
import { formatARS } from '../utils/formatters';
import { ShoppingBag, Check, Sparkles, Disc, ShieldCheck } from 'lucide-react';
import { PsTriangle, PsCircle, PsCross, PsSquare } from './PlayStationSymbols';

export default function PhysicalGameBox({ product, onAddToCart }) {
  const [isAdded, setIsAdded] = useState(false);
  const isPS4 = product.category === 'juegos_ps4';
  const hasStock = product.stock > 0;

  const handleAdd = () => {
    if (!hasStock) return;
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  // Determine condition badge color
  const getConditionBadge = () => {
    const text = product.format || product.condition || product.tag || 'Físico Usado';
    const isNew = text.toLowerCase().includes('nuevo') || text.toLowerCase().includes('sellado');
    const isImpeccable = text.toLowerCase().includes('impecable') || text.toLowerCase().includes('10/10');
    
    if (isNew) {
      return {
        label: 'NUEVO SELLADO',
        color: 'bg-emerald-500 text-slate-950 font-extrabold border-emerald-400'
      };
    }
    if (isImpeccable) {
      return {
        label: product.condition || 'FÍSICO IMPECABLE',
        color: 'bg-ps-neon text-slate-950 font-extrabold border-cyan-300'
      };
    }
    return {
      label: product.condition ? `USADO • ${product.condition.toUpperCase()}` : 'FÍSICO USADO',
      color: 'bg-slate-800/90 text-amber-300 font-bold border-amber-500/40'
    };
  };

  const conditionBadge = getConditionBadge();

  return (
    <div className="group flex flex-col justify-between rounded-xl bg-ps-surface border border-ps-border hover:border-ps-neon/60 hover:shadow-ps-glow transition-all duration-300 overflow-hidden relative">
      
      {/* 1. PHYSICAL BLU-RAY CASE SHELL */}
      <div className="relative p-1.5 sm:p-2 bg-gradient-to-b from-slate-900 to-ps-surface">
        
        {/* Outer Blu-ray Case Frame with glossy plastic feel */}
        <div className={`relative rounded-lg overflow-hidden border-2 ${
          isPS4 
            ? 'border-[#0070d1]/60 shadow-[0_0_15px_rgba(0,112,209,0.3)]' 
            : 'border-red-900/60 shadow-[0_0_15px_rgba(185,28,28,0.2)]'
        } bg-slate-950`}>
          
          {/* A. Official Tape Banner (Cinta Superior Oficial) */}
          {isPS4 ? (
            <div className="bg-[#0070d1] text-white px-2 py-1 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-[12px] sm:text-sm tracking-wider font-gaming">PS4</span>
                <span className="text-[9px] uppercase tracking-tighter opacity-80 hidden xs:inline font-sans">PlayStation 4</span>
              </div>
              <div className="flex items-center gap-1 opacity-90">
                <Disc className="w-3 h-3 animate-spin-slow" />
                <span className="text-[8px] font-bold tracking-widest uppercase">Blu-ray</span>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-red-700 text-white px-2 py-1 flex items-center justify-between shadow-md border-b border-red-500/30">
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-[12px] sm:text-sm tracking-wider font-gaming text-red-100">PS3</span>
                <span className="text-[9px] uppercase tracking-tighter opacity-80 hidden xs:inline font-sans">PlayStation 3</span>
              </div>
              <div className="flex items-center gap-1 text-red-200">
                <Disc className="w-3 h-3" />
                <span className="text-[8px] font-bold tracking-widest uppercase">Blu-ray</span>
              </div>
            </div>
          )}

          {/* B. Cover Image Container (aspect-[3/4]) */}
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />

            {/* Left Plastic Spine Sheen (Efecto brillo plástico del lomo de la caja) */}
            <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-white/30 via-white/10 to-transparent pointer-events-none z-10" />
            <div className="absolute inset-y-0 left-2 w-px bg-black/40 pointer-events-none z-10" />

            {/* Top Condition Badge */}
            <div className="absolute top-2 left-2 z-20">
              <span className={`text-[9px] sm:text-[10px] uppercase tracking-wider px-2 py-0.5 rounded shadow-md border ${conditionBadge.color}`}>
                {conditionBadge.label}
              </span>
            </div>

            {/* Stock indicator badge top-right */}
            <div className="absolute top-2 right-2 z-20">
              {hasStock ? (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-900/90 text-emerald-400 border border-emerald-500/50 backdrop-blur-sm shadow">
                  Stock: {product.stock}
                </span>
              ) : (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-900/90 text-rose-300 border border-rose-500/50 backdrop-blur-sm shadow">
                  Agotado
                </span>
              )}
            </div>

            {/* C. RETAIL FLYER OFFER SPLASH / BADGE (Estilo Folleto MediaMarkt / Carrefour) */}
            <div className="absolute bottom-1.5 right-1.5 z-20 animate-bounce-subtle">
              <div className="bg-[#ffe600] text-neutral-950 px-2 sm:px-2.5 py-1 rounded-lg shadow-2xl border-2 border-black rotate-[-2deg] group-hover:rotate-0 transition-transform">
                <div className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider leading-none text-red-700">
                  OFERTA FÍSICA
                </div>
                <div className="text-sm sm:text-base font-extrabold font-gaming leading-tight tracking-tight text-neutral-950">
                  {formatARS(product.price)}
                </div>
              </div>
            </div>

            {/* Subtle bottom shadow overlay */}
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
          </div>

        </div>
      </div>

      {/* 2. CARD FOOTER WITH TITLE & ACTION BUTTON */}
      <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between bg-ps-surface">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-ps-neon transition-colors line-clamp-1 leading-snug" title={product.name}>
            {product.name}
          </h3>
          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
            {product.condition ? `Caja • ${product.condition}` : 'Formato disco físico'}
          </p>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAdd}
          disabled={!hasStock}
          className={`mt-2.5 w-full py-2 px-2 sm:px-3 rounded-lg font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all duration-200 ${
            !hasStock
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : isAdded
              ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
              : 'bg-gradient-to-r from-ps-blue to-ps-blueDark hover:from-ps-blueLight hover:to-ps-blue text-white shadow-ps-glow active:scale-95'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>¡Agregado!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{hasStock ? 'Agregar al Pedido' : 'Sin Stock'}</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
