import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/seedData';
import { formatARS } from '../utils/formatters';
import { Search, ShoppingBag, Check, SlidersHorizontal, Disc3, Gamepad, Tv, Cpu, Headphones, Sparkles, AlertCircle } from 'lucide-react';
import { PlayStationSymbolsRow, PsTriangle, PsCircle, PsCross, PsSquare } from './PlayStationSymbols';

const ICON_MAP = {
  Disc3: Disc3,
  Gamepad: Gamepad,
  Tv: Tv,
  Cpu: Cpu,
  Headphones: Headphones
};

export default function CatalogSection() {
  const { products, addToCart } = useApp();
  const [activeCategory, setActiveCategory] = useState('juegos_ps4');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubfilter, setSelectedSubfilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [addedIds, setAddedIds] = useState({});

  // Dynamic subfilters based on category
  const dynamicFilters = useMemo(() => {
    switch (activeCategory) {
      case 'juegos_ps4':
      case 'juegos_ps3':
        return [
          { id: 'all', label: 'Todos los formatos' },
          { id: 'fisico', label: '💿 Formato Físico' },
          { id: 'digital', label: '⚡ Formato Digital' },
        ];
      case 'consolas_ps4':
        return [
          { id: 'all', label: 'Todas las PS4' },
          { id: 'slim', label: 'PS4 Slim' },
          { id: 'pro', label: 'PS4 Pro 4K' },
          { id: 'sellada', label: 'Selladas / Originales' },
        ];
      case 'consolas_ps3':
        return [
          { id: 'all', label: 'Todas las PS3' },
          { id: 'hen', label: '🪄 Con HEN / Juegos' },
          { id: 'superslim', label: 'Super Slim' },
          { id: 'slim', label: 'PS3 Slim' },
        ];
      case 'accesorios':
        return [
          { id: 'all', label: 'Todos los mandos' },
          { id: 'sony', label: '🎮 Original Sony' },
          { id: 'alternativo', label: '🕹️ Alternativo AAA' },
        ];
      default:
        return [{ id: 'all', label: 'Todos' }];
    }
  }, [activeCategory]);

  // Reset subfilter when category changes
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
          if (!matchesName && !matchesDesc && !matchesTag) return false;
        }

        // Subfilter match
        if (selectedSubfilter === 'all') return true;

        const tag = (item.tag || '').toLowerCase();
        const format = (item.format || '').toLowerCase();
        const model = (item.model || '').toLowerCase();
        const type = (item.type || '').toLowerCase();
        const systemStatus = (item.systemStatus || '').toLowerCase();

        if (selectedSubfilter === 'fisico') {
          return format.includes('físico') || format.includes('fisico') || tag.includes('físico') || tag.includes('fisico');
        }
        if (selectedSubfilter === 'digital') {
          return format.includes('digital') || tag.includes('digital');
        }
        if (selectedSubfilter === 'slim') {
          return model.includes('slim') && !model.includes('super');
        }
        if (selectedSubfilter === 'pro') {
          return model.includes('pro');
        }
        if (selectedSubfilter === 'sellada') {
          return systemStatus.includes('sellada') || tag.includes('sellada');
        }
        if (selectedSubfilter === 'hen') {
          return systemStatus.includes('hen') || tag.includes('hen') || format.includes('hen');
        }
        if (selectedSubfilter === 'superslim') {
          return model.includes('super');
        }
        if (selectedSubfilter === 'sony') {
          return type.includes('sony') || tag.includes('sony') || item.name.toLowerCase().includes('sony');
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

  const handleAddWithFeedback = (product) => {
    addToCart(product, false);
    setAddedIds(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds(prev => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <section id="catalogo" className="py-12 md:py-20 bg-ps-bg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <PlayStationSymbolsRow size="w-3.5 h-3.5" />
              <span className="text-xs uppercase font-bold text-ps-neon tracking-wider">Catálogo Disponible</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-gaming tracking-wide">
              JUEGOS, CONSOLAS & MANDOS
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Stock verificado en Aguilares para retiro inmediato o entrega a domicilio.
            </p>
          </div>

          {/* Quick Search */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar juego, consola o accesorio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-ps-surface border border-ps-border focus:border-ps-neon text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-ps-neon transition-all"
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

        {/* 5 Category Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-6">
          {CATEGORIES.map(cat => {
            const Icon = ICON_MAP[cat.icon] || Disc3;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-sm font-semibold transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-ps-blue/30 to-ps-surfaceLight border-ps-neon text-white shadow-ps-glow'
                    : 'bg-ps-surface/80 border-ps-border text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className={`p-2 rounded-lg ${isActive ? 'bg-ps-blue text-white shadow-ps-glow' : 'bg-slate-800 text-slate-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="leading-tight">{cat.label}</div>
                  <span className="text-[10px] text-slate-500 font-normal">
                    {products.filter(p => p.category === cat.id).length} ítems
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Filters & Sorting bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-ps-surface/50 border border-ps-border mb-8">
          {/* Subfilter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 pl-1 shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filtros:
            </span>
            {dynamicFilters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setSelectedSubfilter(filter.id)}
                className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                  selectedSubfilter === filter.id
                    ? 'bg-ps-blue text-white shadow-sm font-semibold'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <span className="text-xs text-slate-400">Ordenar por:</span>
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

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl bg-ps-surface/40 border border-ps-border">
            <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white font-gaming">No se encontraron productos</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
              Prueba cambiando los filtros seleccionados o la búsqueda de texto.
            </p>
            <button
              onClick={() => { setSelectedSubfilter('all'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 rounded-lg bg-ps-blue/30 text-ps-neon border border-ps-blue/50 text-xs font-semibold hover:bg-ps-blue/50 transition-colors"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map(product => {
              const hasStock = product.stock > 0;
              const isAdded = addedIds[product.id];

              return (
                <div
                  key={product.id}
                  className="group flex flex-col rounded-2xl bg-ps-surface border border-ps-border hover:border-ps-blue/60 hover:shadow-ps-glow transition-all duration-300 overflow-hidden"
                >
                  {/* Image container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-ps-surface via-transparent to-transparent opacity-90" />

                    {/* Badge top-left: Format / Tag */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-ps-bg/90 border border-ps-neon/40 text-ps-neon backdrop-blur-sm shadow-md">
                        {product.tag || product.format || product.model}
                      </span>
                      {product.featured && (
                        <span className="text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 flex items-center gap-1 shadow-sm">
                          <Sparkles className="w-2.5 h-2.5" /> Top Ventas
                        </span>
                      )}
                    </div>

                    {/* Stock status top-right */}
                    <div className="absolute top-3 right-3">
                      {hasStock ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 backdrop-blur-sm flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          Stock: {product.stock}
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 backdrop-blur-sm">
                          Agotado
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Technical specifications pills */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-2">
                        {product.capacity && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                            💾 {product.capacity}
                          </span>
                        )}
                        {product.model && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                            🎮 {product.model}
                          </span>
                        )}
                        {product.type && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                            ⚡ {product.type}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-white group-hover:text-ps-neon transition-colors line-clamp-2 leading-snug">
                        {product.name}
                      </h3>

                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {product.description || product.condition}
                      </p>
                    </div>

                    {/* Price and Action Button */}
                    <div className="mt-4 pt-4 border-t border-ps-border/70 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-semibold">Precio ARS</div>
                        <div className="text-lg sm:text-xl font-extrabold text-white font-gaming text-ps-neon">
                          {formatARS(product.price)}
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddWithFeedback(product)}
                        disabled={!hasStock}
                        className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all duration-200 ${
                          !hasStock
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : isAdded
                            ? 'bg-emerald-500 text-slate-950 shadow-md scale-95'
                            : 'bg-gradient-to-r from-ps-blue to-ps-blueDark hover:from-ps-blueLight hover:to-ps-blue text-white shadow-ps-glow hover:scale-105'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>¡Listo!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4" />
                            <span>{hasStock ? 'Agregar' : 'Sin stock'}</span>
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
