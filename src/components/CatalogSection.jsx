import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/seedData';
import { formatARS } from '../utils/formatters';
import { Search, ShoppingBag, Check, SlidersHorizontal, Disc3, Gamepad, Tv, Cpu, Headphones, Sparkles, AlertCircle, Info, ArrowRight } from 'lucide-react';
import { PlayStationSymbolsRow } from './PlayStationSymbols';
import PhysicalGameBox from './PhysicalGameBox';

const ICON_MAP = {
  Disc3: Disc3,
  Gamepad: Gamepad,
  Tv: Tv,
  Cpu: Cpu,
  Headphones: Headphones
};

export default function CatalogSection({ onOpenFullCatalog }) {
  const { products, addToCart } = useApp();
  const [activeCategory, setActiveCategory] = useState('juegos_ps4');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubfilter, setSelectedSubfilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [addedIds, setAddedIds] = useState({});

  const isGameCategory = activeCategory === 'juegos_ps4' || activeCategory === 'juegos_ps3';

  // Dynamic subfilters based on category
  const dynamicFilters = useMemo(() => {
    if (isGameCategory) {
      return [
        { id: 'all', label: 'Todos' },
        { id: 'usado', label: '💿 Usados' },
        { id: 'nuevo', label: '✨ Sellados' },
      ];
    }

    switch (activeCategory) {
      case 'consolas_ps4':
        return [
          { id: 'all', label: 'Todas' },
          { id: 'slim', label: 'PS4 Slim' },
          { id: 'pro', label: 'PS4 Pro 4K' },
        ];
      case 'consolas_ps3':
        return [
          { id: 'all', label: 'Todas' },
          { id: 'hen', label: '🪄 Con HEN' },
          { id: 'original', label: '💿 Original' },
        ];
      case 'accesorios':
        return [
          { id: 'all', label: 'Todos' },
          { id: 'sony', label: '🎮 Sony' },
          { id: 'alternativo', label: '🕹️ AAA' },
        ];
      default:
        return [{ id: 'all', label: 'Todos' }];
    }
  }, [activeCategory, isGameCategory]);

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setSelectedSubfilter('all');
  };

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return products
      .filter(item => {
        // Category match
        if (item.category !== activeCategory) return false;

        // Search text match
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = item.name.toLowerCase().includes(q);
          const matchesDesc = (item.description || '').toLowerCase().includes(q);
          const matchesTag = (item.tag || '').toLowerCase().includes(q);
          const matchesCond = (item.condition || '').toLowerCase().includes(q);
          if (!matchesName && !matchesDesc && !matchesTag && !matchesCond) return false;
        }

        // Subfilter match
        if (selectedSubfilter === 'all') return true;

        const tag = (item.tag || '').toLowerCase();
        const format = (item.format || '').toLowerCase();
        const condition = (item.condition || '').toLowerCase();
        const model = (item.model || '').toLowerCase();
        const type = (item.type || '').toLowerCase();
        const systemStatus = (item.systemStatus || '').toLowerCase();

        if (selectedSubfilter === 'usado') {
          return format.includes('usado') || tag.includes('usado') || condition.includes('usado');
        }
        if (selectedSubfilter === 'nuevo') {
          return format.includes('nuevo') || format.includes('sellado') || tag.includes('nuevo') || condition.includes('nuevo');
        }
        if (selectedSubfilter === 'slim') {
          return model.includes('slim') && !model.includes('super');
        }
        if (selectedSubfilter === 'pro') {
          return model.includes('pro');
        }
        if (selectedSubfilter === 'hen') {
          return systemStatus.includes('hen') || tag.includes('hen');
        }
        if (selectedSubfilter === 'original') {
          return systemStatus.includes('original') || tag.includes('original');
        }
        if (selectedSubfilter === 'sony') {
          return type.includes('sony') || tag.includes('sony') || tag.includes('original');
        }
        if (selectedSubfilter === 'alternativo') {
          return type.includes('alternativo') || tag.includes('alternativo');
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'featured') {
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        }
        return 0;
      });
  }, [products, activeCategory, searchQuery, selectedSubfilter, sortBy]);

  const handleAddWideProduct = (product) => {
    addToCart(product, false);
    setAddedIds(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds(prev => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  return (
    <section id="catalogo" className="py-8 sm:py-12 md:py-20 bg-ps-bg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <PlayStationSymbolsRow size="w-3.5 h-3.5" />
              <span className="text-[11px] sm:text-xs uppercase font-bold text-ps-neon tracking-wider">
                Catálogo Físico & Consolas
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-gaming tracking-wide">
              {isGameCategory ? 'JUEGOS FÍSICOS DESTACADOS' : 'CONSOLAS & ACCESORIOS'}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              {isGameCategory 
                ? 'Estuches Blu-ray originales con discos testeados en taller de Aguilares. ¡Precios de folleto retail!'
                : 'Consolas con mantenimiento preventivo, joysticks testeados y garantía escrita de 90 días.'
              }
            </p>
          </div>

          {/* Quick Search */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar título, consola o joystick..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-ps-surface border border-ps-border focus:border-ps-neon text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-ps-neon transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* 5 Category Navigation Tabs (Mobile swipeable / Desktop grid) */}
        <div className="flex items-stretch gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 lg:grid-cols-5 scrollbar-none sm:overflow-visible mb-6">
          {CATEGORIES.map(cat => {
            const Icon = ICON_MAP[cat.icon] || Disc3;
            const isActive = activeCategory === cat.id;
            const totalInCat = products.filter(p => p.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex items-center gap-2 p-2.5 sm:p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-200 text-left shrink-0 sm:shrink min-w-[155px] sm:min-w-0 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-ps-blue/30 to-ps-surfaceLight border-ps-neon text-white shadow-ps-glow'
                    : 'bg-ps-surface/80 border-ps-border text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className={`p-1.5 sm:p-2 rounded-lg shrink-0 ${isActive ? 'bg-ps-blue text-white shadow-ps-glow' : 'bg-slate-800 text-slate-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="leading-tight font-bold text-xs sm:text-sm truncate">{cat.label}</div>
                  <span className="text-[10px] text-slate-500 font-normal">
                    {totalInCat} en stock
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Filters & Sorting bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-ps-surface/50 border border-ps-border mb-6">
          {/* Subfilter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-400 flex items-center gap-1 pl-1 shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Estado:
            </span>
            {dynamicFilters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setSelectedSubfilter(filter.id)}
                className={`text-[11px] sm:text-xs px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedSubfilter === filter.id
                    ? 'bg-ps-blue text-white font-bold shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Sorter Dropdown */}
          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-slate-400">
            <span>Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-ps-surface border border-ps-border text-xs rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-ps-neon cursor-pointer"
            >
              <option value="featured">Destacados</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
            </select>
          </div>
        </div>

        {/* Informative Header Banner for Games */}
        {isGameCategory && (
          <div className="mb-6 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-[#0070d1]/15 via-ps-surface to-slate-900 border border-[#0070d1]/40 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#0070d1] text-white flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 font-gaming shadow-md">
                {activeCategory === 'juegos_ps4' ? 'PS4' : 'PS3'}
              </div>
              <div className="text-xs sm:text-sm text-slate-200 leading-snug">
                <span className="font-bold text-white">Selección Destacada</span> • {Math.min(6, filteredProducts.length)} de {filteredProducts.length} títulos en local.
              </div>
            </div>
            
            <button
              onClick={() => onOpenFullCatalog && onOpenFullCatalog(activeCategory)}
              className="text-xs font-bold text-ps-neon hover:text-white flex items-center gap-1.5 self-start xs:self-auto px-3 py-1.5 rounded-lg bg-ps-blue/20 border border-ps-neon/40 hover:bg-ps-blue/40 transition-colors cursor-pointer"
            >
              <span>Ver Catálogo Completo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* PRODUCTS RENDER */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-ps-surface/40 border border-ps-border">
            <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base sm:text-lg font-bold text-white font-gaming">No se encontraron productos</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm mx-auto">
              Prueba cambiando el filtro de estado o la búsqueda de texto.
            </p>
            <button
              onClick={() => { setSelectedSubfilter('all'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 rounded-lg bg-ps-blue/30 text-ps-neon border border-ps-blue/50 text-xs font-semibold hover:bg-ps-blue/50 transition-colors cursor-pointer"
            >
              Restablecer filtros
            </button>
          </div>
        ) : isGameCategory ? (
          /* ======================================================== */
          /* 1. DENSE GRID OF PHYSICAL BLU-RAY BOXES (Top 6 on Home)  */
          /* ======================================================== */
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4 animate-fadeIn">
              {filteredProducts.slice(0, 6).map(product => (
                <PhysicalGameBox
                  key={product.id}
                  product={product}
                  onAddToCart={(prod) => addToCart(prod, false)}
                />
              ))}
            </div>

            {/* Mobile-Friendly CTA to Full Catalog */}
            <div className="mt-8 p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-ps-surface via-slate-900 to-ps-surface border border-ps-blue/40 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5">
              <div className="relative z-10 text-left">
                <div className="inline-flex items-center gap-1.5 text-ps-neon text-xs font-bold uppercase tracking-wider mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-ps-neon animate-spin-slow" />
                  <span>Catálogo Extendido Disponible</span>
                </div>
                <h3 className="text-lg sm:text-2xl font-bold font-gaming text-white">
                  ¿QUERÉS VER TODOS LOS JUEGOS?
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
                  En nuestra página exclusiva de Catálogo Completo podés buscar entre más de {products.length} videojuegos físicos de PS4 y PS3, consolas selladas y accesorios con stock en vivo.
                </p>
              </div>

              <button
                onClick={() => onOpenFullCatalog && onOpenFullCatalog(activeCategory)}
                className="shrink-0 w-full md:w-auto px-6 py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-ps-blue to-ps-blueLight text-white font-extrabold text-xs sm:text-sm shadow-ps-glow hover:shadow-ps-glowLg hover:scale-105 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>VER CATÁLOGO COMPLETO ({products.length} ÍTEMS)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </>
        ) : (
          /* ======================================================== */
          /* 2. WIDE CARDS FOR CONSOLES AND ACCESSORIES              */
          /* ======================================================== */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-fadeIn">
            {filteredProducts.map(product => {
              const hasStock = product.stock > 0;
              const isAdded = addedIds[product.id];

              return (
                <div
                  key={product.id}
                  className="group flex flex-col justify-between rounded-2xl bg-ps-surface border border-ps-border hover:border-ps-neon/50 hover:shadow-ps-glow transition-all duration-300 overflow-hidden"
                >
                  {/* Photo Container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ps-surface via-transparent to-transparent opacity-90" />

                    {/* Badge top-left */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-ps-bg/90 border border-ps-neon/40 text-ps-neon backdrop-blur-sm shadow-md">
                        {product.tag || product.model || 'Garantía 90 Días'}
                      </span>
                    </div>

                    {/* Stock badge top-right */}
                    <div className="absolute top-2.5 right-2.5">
                      {hasStock ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 backdrop-blur-sm">
                          Stock: {product.stock}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 backdrop-blur-sm">
                          Agotado
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content with Specs */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Specifications Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-2">
                        {product.model && (
                          <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-ps-neon font-semibold border border-slate-700">
                            Modelo: {product.model}
                          </span>
                        )}
                        {product.capacity && (
                          <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 font-semibold border border-slate-700">
                            💾 {product.capacity}
                          </span>
                        )}
                        {product.systemStatus && (
                          <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md bg-emerald-950/60 text-emerald-300 font-semibold border border-emerald-500/30">
                            ⚙️ {product.systemStatus}
                          </span>
                        )}
                        {product.type && (
                          <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                            {product.type}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-ps-neon transition-colors leading-snug">
                        {product.name}
                      </h3>

                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    {/* Price and Cart Footer */}
                    <div className="mt-4 pt-3 border-t border-ps-border/70 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-slate-500 block">PRECIO CONTADO</span>
                        <div className="text-lg sm:text-xl font-extrabold text-white font-gaming text-ps-neon">
                          {formatARS(product.price)}
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddWideProduct(product)}
                        disabled={!hasStock}
                        className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                          !hasStock
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : isAdded
                            ? 'bg-emerald-500 text-slate-950 font-extrabold'
                            : 'bg-ps-blue hover:bg-ps-blueLight text-white shadow-ps-glow active:scale-95'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>¡Listo!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4" />
                            <span>{hasStock ? 'Comprar' : 'Agotado'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
