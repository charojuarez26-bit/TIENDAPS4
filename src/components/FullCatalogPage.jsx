import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/seedData';
import { formatARS } from '../utils/formatters';
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  X,
  Disc3,
  Gamepad,
  Tv,
  Cpu,
  Headphones,
  ShoppingBag,
  Check,
  Sparkles,
  MessageCircle,
  ShieldCheck,
  PackageOpen,
  Filter
} from 'lucide-react';
import { PlayStationSymbolsRow } from './PlayStationSymbols';
import PhysicalGameBox from './PhysicalGameBox';

const ICON_MAP = {
  Disc3: Disc3,
  Gamepad: Gamepad,
  Tv: Tv,
  Cpu: Cpu,
  Headphones: Headphones
};

export default function FullCatalogPage({ onBackToHome, initialCategory = 'all' }) {
  const { products, addToCart, config } = useApp();
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [formatFilter, setFormatFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [addedIds, setAddedIds] = useState({});

  // Scroll to top when page opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = {
      all: products.length,
      juegos_ps4: 0,
      juegos_ps3: 0,
      consolas_ps4: 0,
      consolas_ps3: 0,
      accesorios: 0
    };
    products.forEach((p) => {
      if (counts[p.category] !== undefined) {
        counts[p.category]++;
      }
    });
    return counts;
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        // Category filter
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }

        // Search text
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesName = item.name.toLowerCase().includes(q);
          const matchesDesc = (item.description || '').toLowerCase().includes(q);
          const matchesCond = (item.condition || '').toLowerCase().includes(q);
          const matchesTag = (item.tag || '').toLowerCase().includes(q);
          if (!matchesName && !matchesDesc && !matchesCond && !matchesTag) {
            return false;
          }
        }

        // Stock filter
        if (onlyInStock && (!item.stock || item.stock <= 0)) {
          return false;
        }

        // Format filter
        if (formatFilter !== 'all') {
          const format = (item.format || '').toLowerCase();
          const condition = (item.condition || '').toLowerCase();
          const tag = (item.tag || '').toLowerCase();
          if (formatFilter === 'nuevo') {
            const isNuevo = format.includes('nuevo') || condition.includes('nuevo') || tag.includes('nuevo') || condition.includes('sellad');
            if (!isNuevo) return false;
          } else if (formatFilter === 'usado') {
            const isUsado = format.includes('usado') || condition.includes('usado') || tag.includes('usado');
            if (!isUsado) return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
        if (sortBy === 'stock_desc') return (b.stock || 0) - (a.stock || 0);
        // Default: featured first, then stock
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (b.stock || 0) - (a.stock || 0);
      });
  }, [products, selectedCategory, searchQuery, formatFilter, sortBy, onlyInStock]);

  const handleAddToCart = (item) => {
    addToCart(item);
    setAddedIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [item.id]: false }));
    }, 1200);
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setFormatFilter('all');
    setSortBy('featured');
    setOnlyInStock(false);
  };

  const isOnlyGamesSelected = selectedCategory === 'juegos_ps4' || selectedCategory === 'juegos_ps3';

  return (
    <div className="min-h-screen bg-ps-bg text-slate-100 pb-20 selection:bg-ps-blue selection:text-white">
      {/* Top Breadcrumb & Return Bar */}
      <div className="border-b border-ps-border bg-slate-950/70 backdrop-blur-md sticky top-16 sm:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-300 hover:text-white group px-3 py-1.5 rounded-lg bg-ps-surface border border-ps-border hover:border-ps-neon/50 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-ps-neon group-hover:-translate-x-1 transition-transform" />
            <span>Volver al Inicio</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span>Inicio</span>
            <span>/</span>
            <span className="text-ps-neon font-semibold">Catálogo Completo</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-ps-blue/20 text-ps-neon border border-ps-blue/40 font-bold">
              {filteredProducts.length} DISPONIBLES
            </span>
            <PlayStationSymbolsRow size="w-3.5 h-3.5" spacing="space-x-1.5" />
          </div>
        </div>
      </div>

      {/* Hero Banner Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-ps-surface via-slate-950 to-ps-bg border-b border-ps-border/60 py-10 sm:py-14">
        {/* Glow orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-ps-blue/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ps-blue/20 border border-ps-neon/40 text-ps-neon text-xs font-bold uppercase tracking-wider mb-4 shadow-ps-glow">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Catálogo Completo • Todo el Stock de Aguilares</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-gaming tracking-tight text-white max-w-3xl mx-auto">
            CATÁLOGO EXCLUSIVO PLAYSTATION
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Explorá nuestra colección completa de videojuegos físicos originales para PS4 y PS3, consolas verificadas en taller y periféricos oficiales en nuestro local de Aguilares.
          </p>

          {/* Quick Store Highlights Chips */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 flex items-center gap-1.5 font-medium shadow-sm">
              <Disc3 className="w-4 h-4 text-ps-neon" />
              <span>{categoryCounts.juegos_ps4 + categoryCounts.juegos_ps3} Juegos Físicos</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 flex items-center gap-1.5 font-medium shadow-sm">
              <Tv className="w-4 h-4 text-ps-blueLight" />
              <span>{categoryCounts.consolas_ps4 + categoryCounts.consolas_ps3} Consolas Listas</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 flex items-center gap-1.5 font-medium shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>90 Días Garantía Escrita</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Catalog Explorer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-ps-border">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all shrink-0 flex items-center gap-2 ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-ps-blue to-ps-blueDark text-white shadow-ps-glow border border-ps-neon/50'
                : 'bg-ps-surface text-slate-300 hover:text-white border border-ps-border hover:border-slate-700'
            }`}
          >
            <span>Todos los Productos</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900/80 font-mono">
              {categoryCounts.all}
            </span>
          </button>

          {CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.icon] || Disc3;
            const isCatActive = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all shrink-0 flex items-center gap-2 ${
                  isCatActive
                    ? 'bg-gradient-to-r from-ps-blue to-ps-blueDark text-white shadow-ps-glow border border-ps-neon/50'
                    : 'bg-ps-surface text-slate-300 hover:text-white border border-ps-border hover:border-slate-700'
                }`}
              >
                <Icon className="w-4 h-4 text-ps-neon" />
                <span>{cat.label}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900/80 font-mono">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter and Search Toolbar */}
        <div className="mt-4 p-4 rounded-2xl bg-ps-surface/80 border border-ps-border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar título, saga o palabra clave (ej: God of War, GTA, Spider-Man, Resident Evil)..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-ps-bg border border-ps-border text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-ps-neon transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Secondary Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Format Filter */}
            <select
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-ps-bg border border-ps-border text-slate-300 text-xs font-semibold focus:outline-none focus:border-ps-neon cursor-pointer"
            >
              <option value="all">Estado: Todos</option>
              <option value="usado">💿 Físico Usado Impecable</option>
              <option value="nuevo">✨ Físico Nuevo / Sellado</option>
            </select>

            {/* Sorter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-ps-bg border border-ps-border text-slate-300 text-xs font-semibold focus:outline-none focus:border-ps-neon cursor-pointer"
            >
              <option value="featured">Orden: Destacados</option>
              <option value="price_asc">Precio: Menor a Mayor</option>
              <option value="price_desc">Precio: Mayor a Menor</option>
              <option value="name_asc">Nombre: A - Z</option>
              <option value="stock_desc">Mayor Stock Disponible</option>
            </select>

            {/* Only In Stock Toggle */}
            <button
              onClick={() => setOnlyInStock(!onlyInStock)}
              className={`px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                onlyInStock
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow'
                  : 'bg-ps-bg text-slate-400 border-ps-border hover:text-white'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${onlyInStock ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
              <span>Solo en Stock</span>
            </button>

            {/* Clear filters if any filter active */}
            {(searchQuery || formatFilter !== 'all' || sortBy !== 'featured' || onlyInStock || selectedCategory !== 'all') && (
              <button
                onClick={handleClearFilters}
                className="px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors font-semibold"
              >
                Limpiar
              </button>
            )}
          </div>

        </div>

        {/* Results Counter Bar */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-400 px-1">
          <div>
            Mostrando <span className="font-bold text-white">{filteredProducts.length}</span> títulos y productos en catálogo
            {searchQuery && <span> para "{searchQuery}"</span>}
          </div>
          <div className="text-[11px] text-slate-500 font-mono hidden sm:block">
            Precios en pesos argentinos (ARS) con stock verificado
          </div>
        </div>

        {/* Product Cards Display */}
        {filteredProducts.length === 0 ? (
          /* Empty state */
          <div className="mt-12 py-16 px-4 rounded-3xl bg-ps-surface/50 border border-ps-border text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-ps-blue/15 border border-ps-blue/30 text-ps-neon flex items-center justify-center mx-auto mb-4">
              <PackageOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white font-gaming">No se encontraron productos</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Probá ajustando la búsqueda o quitando los filtros para ver todos los juegos disponibles.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-5 px-5 py-2.5 rounded-xl bg-ps-blue hover:bg-ps-blueLight text-white text-xs font-bold transition-all shadow-ps-glow"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          /* Grid of products */
          <div className="mt-6">
            
            {/* If the current view is pure games or filtered to a game category */}
            {isOnlyGamesSelected ? (
              /* DENSE RETAIL BLU-RAY GRID */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4">
                {filteredProducts.map((prod) => (
                  <PhysicalGameBox
                    key={prod.id}
                    product={prod}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              /* Mixed or Hardware view: Games as Blu-ray Boxes, Consoles/Accessories as Detailed Wide Cards */
              <div className="space-y-10">
                {/* Games Section (if any match) */}
                {filteredProducts.some(p => p.category === 'juegos_ps4' || p.category === 'juegos_ps3') && (
                  <div>
                    <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <Disc3 className="w-5 h-5 text-ps-neon" />
                        <h3 className="text-base sm:text-lg font-bold font-gaming text-white">
                          Juegos Físicos Originales (PS4 & PS3)
                        </h3>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">
                        {filteredProducts.filter(p => p.category === 'juegos_ps4' || p.category === 'juegos_ps3').length} juegos
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4">
                      {filteredProducts
                        .filter(p => p.category === 'juegos_ps4' || p.category === 'juegos_ps3')
                        .map((prod) => (
                          <PhysicalGameBox
                            key={prod.id}
                            product={prod}
                            onAddToCart={handleAddToCart}
                          />
                        ))}
                    </div>
                  </div>
                )}

                {/* Hardware Section (Consolas & Accesorios) */}
                {filteredProducts.some(p => p.category !== 'juegos_ps4' && p.category !== 'juegos_ps3') && (
                  <div>
                    <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <Tv className="w-5 h-5 text-ps-blueLight" />
                        <h3 className="text-base sm:text-lg font-bold font-gaming text-white">
                          Consolas & Joysticks Verificados
                        </h3>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">
                        {filteredProducts.filter(p => p.category !== 'juegos_ps4' && p.category !== 'juegos_ps3').length} equipos
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {filteredProducts
                        .filter(p => p.category !== 'juegos_ps4' && p.category !== 'juegos_ps3')
                        .map((prod) => {
                          const hasStock = prod.stock > 0;
                          const isJustAdded = addedIds[prod.id];

                          return (
                            <div
                              key={prod.id}
                              className="group flex flex-col justify-between rounded-2xl bg-ps-surface border border-ps-border hover:border-ps-neon/50 hover:shadow-ps-glow transition-all duration-300 overflow-hidden"
                            >
                              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                                <img
                                  src={prod.image}
                                  alt={prod.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  loading="lazy"
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "https://images.unsplash.com/photo-1507457379470-08b800bebc67?auto=format&fit=crop&w=800&q=80";
                                  }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-ps-surface via-transparent to-transparent opacity-90" />

                                <div className="absolute top-3 left-3">
                                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-ps-bg/90 border border-ps-neon/40 text-ps-neon backdrop-blur-sm shadow-md">
                                    {prod.tag || prod.category}
                                  </span>
                                </div>

                                <div className="absolute top-3 right-3">
                                  {hasStock ? (
                                    <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 backdrop-blur-sm">
                                      Stock: {prod.stock}
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 backdrop-blur-sm">
                                      Sin Stock
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                  <h4 className="text-base font-bold text-white group-hover:text-ps-neon transition-colors line-clamp-2">
                                    {prod.name}
                                  </h4>
                                  <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                    {prod.description}
                                  </p>

                                  {/* Hardware specs pill list */}
                                  <div className="mt-3 flex flex-wrap gap-1.5">
                                    {prod.model && (
                                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                                        Modelo: {prod.model}
                                      </span>
                                    )}
                                    {prod.capacity && (
                                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                                        Capacidad: {prod.capacity}
                                      </span>
                                    )}
                                    {prod.systemStatus && (
                                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-amber-300 border border-slate-800">
                                        {prod.systemStatus}
                                      </span>
                                    )}
                                    {prod.type && (
                                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                                        {prod.type}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-ps-border flex items-center justify-between gap-3">
                                  <div>
                                    <span className="text-[10px] text-slate-400 block font-semibold">PRECIO CONTADO</span>
                                    <span className="text-lg font-black font-gaming tracking-tight text-white">
                                      {formatARS(prod.price)}
                                    </span>
                                  </div>

                                  <button
                                    onClick={() => handleAddToCart(prod)}
                                    disabled={!hasStock}
                                    className={`px-4 py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all duration-200 flex items-center gap-1.5 shadow-md ${
                                      !hasStock
                                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                                        : isJustAdded
                                        ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-emerald-500/20'
                                        : 'bg-ps-blue hover:bg-ps-blueLight text-white shadow-ps-glow hover:scale-105 active:scale-95'
                                    }`}
                                  >
                                    {isJustAdded ? (
                                      <>
                                        <Check className="w-4 h-4" />
                                        <span>¡Agregado!</span>
                                      </>
                                    ) : (
                                      <>
                                        <ShoppingBag className="w-4 h-4" />
                                        <span>{hasStock ? 'Comprar' : 'Sin Stock'}</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* WhatsApp Request Banner */}
        <div className="mt-16 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-ps-surface via-slate-900 to-ps-surface border border-ps-blue/40 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-ps-neon text-xs font-bold uppercase tracking-wider mb-2">
              <MessageCircle className="w-4 h-4" />
              <span>¿No encontrás el juego que estás buscando?</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-gaming text-white">
              ¡TE LO CONSEGUIMOS A PEDIDO!
            </h3>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Si querés algún título específico de PS4 o PS3 que no esté en la lista, avisanos por WhatsApp y te lo traemos en pocos días al mejor precio de Aguilares.
            </p>
          </div>

          <a
            href={`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
              `¡Hola PlayCenter Aguilares! Estoy buscando un juego que no encontré en el catálogo web. ¿Lo tienen o me lo pueden conseguir?`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-6 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-black text-xs sm:text-sm shadow-lg hover:scale-105 transition-all flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Consultar por WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
}
