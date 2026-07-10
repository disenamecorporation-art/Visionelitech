import React, { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Sliders, ChevronDown, Check, ShoppingCart, Info, CheckCircle2 } from "lucide-react";
import { ProductDetails } from "../types";
import { PRODUCTS_DATA, EXCHANGE_RATE_VES } from "../data";
import { cyberSound } from "./CyberSound";

interface ShopPageProps {
  onAddToCart: (product: ProductDetails) => void;
}

export default function ShopPage({ onAddToCart }: ShopPageProps) {
  // Filters States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<number>(5000);
  const [sortBy, setSortBy] = useState<string>("default");
  const [stockOnly, setStockOnly] = useState<boolean>(false);

  // Active hover info for specs tooltip
  const [hoveredSpecsProductId, setHoveredSpecsProductId] = useState<string | null>(null);

  const categoriesList = [
    { id: "all", label: "Todo el Catálogo" },
    { id: "pc", label: "Computadoras Armadas" },
    { id: "perifericos", label: "Periféricos & Teclados" },
    { id: "audio", label: "Audio de Competencia" },
    { id: "sillas", label: "Sillas Ergonómicas" },
    { id: "hardware", label: "Componentes & Hardware" }
  ];

  // Helper to map product categories to filter groups
  const matchesCategoryGroup = (prodCat: string, filterGroup: string) => {
    if (filterGroup === "all") return true;
    if (filterGroup === "hardware") {
      // Components hardware list
      return ["cpu", "gpu", "ram", "storage", "motherboard", "psu", "case"].includes(prodCat);
    }
    return prodCat === filterGroup;
  };

  // Filtered and Sorted Products
  const processedProducts = useMemo(() => {
    return PRODUCTS_DATA.filter((product) => {
      // Search text match
      const textMatch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tagline.toLowerCase().includes(searchQuery.toLowerCase());

      // Category group match
      const catMatch = matchesCategoryGroup(product.category, selectedCategory);

      // Price limit match
      const priceMatch = product.priceUSD <= priceRange;

      // Available stock option match
      const stockMatch = !stockOnly || product.stock === "DISPONIBLE";

      return textMatch && catMatch && priceMatch && stockMatch;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.priceUSD - b.priceUSD;
      if (sortBy === "price-desc") return b.priceUSD - a.priceUSD;
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      return 0; // Default sorting
    });
  }, [searchQuery, selectedCategory, priceRange, sortBy, stockOnly]);

  const handleAddToCartClick = (product: ProductDetails) => {
    cyberSound.playClick();
    onAddToCart(product);
  };

  return (
    <div className="w-full max-w-[1290px] mx-auto px-4 md:px-0 pt-28 pb-16 min-h-screen" id="shop-page-view">
      {/* Visual Title Header */}
      <div className="mb-10 text-center md:text-left">
        <h2 className="font-sans font-black text-3xl md:text-4xl text-white italic tracking-tighter uppercase">
          CATÁLOGO <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">WOOCOMMERCE TIENDA</span>
        </h2>
        <p className="font-sans text-xs text-white/50 mt-1 max-w-xl">
          Filtros avanzados de hardware y accesorios premium de grado competitivo en Caracas. Armados, garantías y envíos inmediatos.
        </p>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Advanced Filters (WooCommerce Style) */}
        <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-24 h-fit" id="shop-sidebar-filters">
          <div className="rounded-3xl border border-white/10 bg-[#07070a]/60 backdrop-blur-md p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <span className="font-sans text-xs font-bold text-white tracking-wider flex items-center gap-1.5 uppercase">
                <Sliders size={13} className="text-blue-400" />
                Filtros de Búsqueda
              </span>
              <button
                onClick={() => {
                  cyberSound.playClick();
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setPriceRange(5000);
                  setSortBy("default");
                  setStockOnly(false);
                }}
                className="font-sans text-[10px] text-blue-400 hover:text-blue-300 font-bold tracking-wide uppercase transition-colors cursor-pointer"
              >
                Limpiar todo
              </button>
            </div>

            {/* Live Search */}
            <div className="space-y-2">
              <label className="font-sans text-[10px] text-white/40 tracking-wider block uppercase">Buscar Producto</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ej. RTX 5090, Teclado..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/5 text-xs text-white placeholder-white/30 focus:border-blue-500/50 outline-none transition-all duration-300"
                />
                <Search size={13} className="absolute left-3 top-3.5 text-white/30" />
              </div>
            </div>

            {/* Categories WooCommerce List */}
            <div className="space-y-2">
              <label className="font-sans text-[10px] text-white/40 tracking-wider block uppercase">Categorías</label>
              <div className="flex flex-col space-y-1.5">
                {categoriesList.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        cyberSound.playClick();
                        setSelectedCategory(cat.id);
                      }}
                      className={`text-left text-xs py-2 px-3 rounded-xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                        isActive
                          ? "bg-blue-500/10 border-blue-400/30 text-white font-bold"
                          : "bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span>{cat.label}</span>
                      {isActive && <Check size={12} className="text-blue-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price range filter */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="font-sans text-[10px] text-white/40 tracking-wider block uppercase">Precio Máximo</label>
                <span className="font-sans text-xs font-bold text-blue-400">${priceRange} USD</span>
              </div>
              <input
                type="range"
                min="100"
                max="5000"
                step="50"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[9px] text-white/30 font-mono">
                <span>Min: $100</span>
                <span>Max: $5,000</span>
              </div>
            </div>

            {/* Stock status filter */}
            <div className="pt-2 border-t border-white/5 space-y-2">
              <label className="flex items-center space-x-2.5 cursor-pointer text-xs text-gray-300 hover:text-white transition-colors select-none">
                <input
                  type="checkbox"
                  checked={stockOnly}
                  onChange={(e) => {
                    cyberSound.playClick();
                    setStockOnly(e.target.checked);
                  }}
                  className="w-4 h-4 rounded border-white/10 bg-black text-blue-500 accent-blue-500 focus:ring-0 cursor-pointer"
                />
                <span>Solo Disponible en Stock</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Side: WooCommerce Products Showcase */}
        <div className="lg:col-span-9 space-y-6">
          {/* Controls Bar */}
          <div className="rounded-2xl border border-white/10 bg-[#07070a]/40 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-sans text-xs text-white/60">
              Mostrando <strong className="text-white">{processedProducts.length}</strong> de {PRODUCTS_DATA.length} productos
            </span>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <span className="font-sans text-[10px] text-white/40 tracking-wider uppercase whitespace-nowrap">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  cyberSound.playClick();
                  setSortBy(e.target.value);
                }}
                className="bg-black/60 border border-white/10 text-xs text-white rounded-full px-4 py-1.5 focus:border-blue-500 outline-none transition-all cursor-pointer w-full sm:w-auto"
              >
                <option value="default">Recomendados</option>
                <option value="price-asc">Precio: de Menor a Mayor</option>
                <option value="price-desc">Precio: de Mayor a Menor</option>
                <option value="name-asc">Nombre: A - Z</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {processedProducts.length === 0 ? (
            <div className="rounded-3xl border border-white/5 bg-[#07070a]/40 p-16 text-center">
              <span className="text-4xl">🔍</span>
              <h4 className="font-sans font-black text-lg text-white mt-4 uppercase">No se encontraron productos</h4>
              <p className="font-sans text-xs text-white/50 mt-1 max-w-sm mx-auto">
                Prueba relajando los filtros o buscando otros términos como "Procesador" o "Gamer".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="shop-products-grid">
              {processedProducts.map((product) => {
                const isHovered = hoveredSpecsProductId === product.id;
                const formattedVES = (product.priceUSD * EXCHANGE_RATE_VES).toLocaleString(undefined, {
                  maximumFractionDigits: 0
                });

                return (
                  <div
                    key={product.id}
                    className="group relative flex flex-col justify-between rounded-3xl border border-white/5 bg-[#07070a]/50 hover:bg-[#0c0c12]/80 hover:border-blue-500/20 transition-all duration-500 overflow-hidden shadow-md hover:shadow-[0_20px_45px_rgba(59,130,246,0.08)]"
                    onMouseEnter={() => setHoveredSpecsProductId(product.id)}
                    onMouseLeave={() => setHoveredSpecsProductId(null)}
                  >
                    {/* Image Panel */}
                    <div className="relative aspect-[4/3] bg-black/40 overflow-hidden">
                      <img
                        src={product.image || "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80"}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#07070a] via-transparent to-transparent opacity-80" />

                      {/* Floating Stock Tag */}
                      <span className={`absolute top-4 left-4 px-2 py-0.5 rounded-full text-[8px] font-sans font-bold tracking-widest border uppercase ${
                        product.stock === "DISPONIBLE"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : product.stock === "BAJO STOCK"
                          ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      }`}>
                        ● {product.stock}
                      </span>

                      {/* Hover Highlights Tooltip Overlay */}
                      {isHovered && product.highlights.length > 0 && (
                        <div className="absolute inset-0 p-5 bg-black/90 backdrop-blur-md flex flex-col justify-center text-left transition-all duration-300">
                          <span className="text-[9px] text-blue-400 font-bold tracking-wider block mb-2 uppercase">Destacados:</span>
                          <ul className="space-y-1.5">
                            {product.highlights.slice(0, 3).map((hl, i) => (
                              <li key={i} className="text-[10px] text-white/80 leading-snug flex items-start gap-1">
                                <span className="text-blue-400 font-bold">•</span>
                                <span>{hl}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Content Panel */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] text-blue-400 font-bold tracking-widest block uppercase">
                          {product.category.toUpperCase()}
                        </span>
                        <h4 className="font-sans font-bold text-sm text-white mt-1 group-hover:text-blue-300 transition-colors tracking-tight uppercase line-clamp-1">
                          {product.name}
                        </h4>
                        <p className="font-sans text-[10px] text-white/50 mt-1 line-clamp-2 h-7 leading-relaxed">
                          {product.tagline}
                        </p>
                      </div>

                      {/* Pricing & Add to Cart */}
                      <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
                        <div className="flex justify-between items-baseline">
                          <div>
                            <span className="text-[9px] text-white/30 block uppercase font-mono">Precio USD</span>
                            <span className="font-sans font-black text-base text-white">
                              ${product.priceUSD.toLocaleString()}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] text-white/30 block uppercase font-mono">Ref. VES</span>
                            <span className="font-sans font-bold text-xs text-white/70">
                              Bs. {formattedVES}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleAddToCartClick(product)}
                          onMouseEnter={() => cyberSound.playHover()}
                          className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-full bg-blue-500/10 hover:bg-blue-500 hover:text-black border border-blue-500/20 text-blue-400 text-xs font-bold tracking-wider transition-all duration-300 cursor-pointer shadow-md"
                        >
                          <ShoppingCart size={12} />
                          <span>AÑADIR AL CARRITO</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
