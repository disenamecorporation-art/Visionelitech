import React, { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Sliders, ChevronDown, Check, ShoppingCart, Info, CheckCircle2, X, Sparkles, ShieldCheck, Truck } from "lucide-react";
import { ProductDetails } from "../types";
import { PRODUCTS_DATA, PRODUCT_CATEGORIES } from "../data";
import { cyberSound } from "./CyberSound";

interface ShopPageProps {
  onAddToCart: (product: ProductDetails) => void;
  products?: ProductDetails[];
}

export default function ShopPage({ onAddToCart, products = PRODUCTS_DATA }: ShopPageProps) {
  // Filters States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<{parent: string, sub?: string}>({ parent: "all" });
  const [priceRange, setPriceRange] = useState<number>(5000);
  const [sortBy, setSortBy] = useState<string>("default");
  const [stockOnly, setStockOnly] = useState<boolean>(false);

  // Active hover info for specs tooltip
  const [hoveredSpecsProductId, setHoveredSpecsProductId] = useState<string | null>(null);

  const handleCategorySelect = (parent: string, sub?: string) => {
    cyberSound.playClick();
    setSelectedCategory({ parent, sub });
  };

  // WooCommerce Detail Popup State
  const [selectedProduct, setSelectedProduct] = useState<ProductDetails | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Derive elegant multi-image collection for active product
  const productImages = useMemo(() => {
    if (!selectedProduct) return [];
    if (selectedProduct.images && selectedProduct.images.length > 0) {
      return selectedProduct.images.slice(0, 4);
    }
    const mainImg = selectedProduct.image || "";
    // Build elegant custom sets of up to 4 images based on product category for perfect presentation
    if (selectedProduct.category === "pc") {
      return [
        mainImg,
        "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?auto=format&fit=crop&w=600&q=80"
      ].filter(Boolean);
    } else if (selectedProduct.category === "perifericos" || selectedProduct.category === "monitor") {
      return [
        mainImg,
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=600&q=80"
      ].filter(Boolean);
    } else if (selectedProduct.category === "audio") {
      return [
        mainImg,
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
      ].filter(Boolean);
    } else if (selectedProduct.category === "sillas") {
      return [
        mainImg,
        "https://images.unsplash.com/photo-1598550476439-6847785fce6e?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&w=600&q=80"
      ].filter(Boolean);
    }
    // Fallback for components / hardware
    return [
      mainImg,
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1587202372574-6109941db945?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80"
    ].filter(Boolean);
  }, [selectedProduct]);

  const categories = useMemo(() => PRODUCT_CATEGORIES, []);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Helper to map product categories to filter groups
  const matchesCategoryGroup = (product: ProductDetails, selected: {parent: string, sub?: string}) => {
    if (selected.parent === "all") return true;
    if (product.category !== selected.parent) return false;
    if (selected.sub && product.subcategory !== selected.sub) return false;
    return true;
  };

  // Filtered and Sorted Products
  const processedProducts = useMemo(() => {
    return products.filter((product) => {
      // Search text match
      const textMatch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tagline.toLowerCase().includes(searchQuery.toLowerCase());

      // Category group match
      const catMatch = matchesCategoryGroup(product, selectedCategory);

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
        <h2 className="font-sans font-light text-2xl md:text-3xl text-white tracking-wide uppercase">
          CATÁLOGO <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">TIENDA DE PRODUCTOS</span>
        </h2>
        <p className="font-sans text-xs text-white/50 mt-1 max-w-xl">
          Hardware y accesorios premium en Caracas con garantía certificada y envíos inmediatos.
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
                  setSelectedCategory({ parent: "all" });
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
                {/* "All" category */}
                <button
                  onClick={() => handleCategorySelect("all")}
                  className={`text-left text-xs py-2 px-3 rounded-xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                    selectedCategory.parent === "all"
                      ? "bg-blue-500/10 border-blue-400/30 text-white font-bold"
                      : "bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>Todo el Catálogo</span>
                  {selectedCategory.parent === "all" && <Check size={12} className="text-blue-400" />}
                </button>

                {Object.entries(categories).map(([parent, subcategories]) => {
                  const isExpanded = expandedCategory === parent;
                  const isParentActive = selectedCategory.parent === parent;
                  
                  return (
                    <div key={parent} className="space-y-1">
                      <button
                        onClick={() => {
                          cyberSound.playClick();
                          if (subcategories.length > 0) setExpandedCategory(isExpanded ? null : parent);
                          handleCategorySelect(parent);
                        }}
                        className={`w-full text-left text-xs py-2 px-3 rounded-xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                          isParentActive
                            ? "bg-blue-500/10 border-blue-400/30 text-white font-bold"
                            : "bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <span>{parent}</span>
                        {subcategories.length > 0 && <ChevronDown size={12} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />}
                      </button>
                      
                      {isExpanded && subcategories.map(sub => {
                          const isSubActive = selectedCategory.sub === sub;
                          return (
                            <button
                                key={sub}
                                onClick={() => handleCategorySelect(parent, sub)}
                                className={`w-full text-left text-[11px] py-1.5 px-6 rounded-xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                                    isSubActive
                                    ? "bg-purple-500/10 border-purple-400/30 text-white"
                                    : "bg-transparent border-transparent text-gray-500 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                <span>{sub}</span>
                                {isSubActive && <Check size={10} className="text-purple-400" />}
                            </button>
                          )
                      })}
                    </div>
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
              Mostrando <strong className="text-white">{processedProducts.length}</strong> de {products.length} productos
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
                return (
                  <div
                    key={product.id}
                    className="group relative flex flex-col justify-between rounded-3xl border border-white/5 bg-[#07070a]/50 hover:bg-[#0c0c12]/80 hover:border-blue-500/20 transition-all duration-500 overflow-hidden shadow-md hover:shadow-[0_20px_45px_rgba(59,130,246,0.08)] cursor-pointer"
                    onClick={() => {
                      cyberSound.playClick();
                      setSelectedProduct(product);
                      setActiveImageIndex(0);
                    }}
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
                    </div>

                    {/* Content Panel */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] text-blue-400 font-medium tracking-widest block uppercase">
                          {product.category.toUpperCase()}
                        </span>
                        <h4 className="font-sans font-light text-base md:text-lg text-white mt-1.5 group-hover:text-blue-300 transition-colors tracking-wide uppercase line-clamp-1">
                          {product.name}
                        </h4>
                      </div>

                      {/* Pricing & Add to Cart */}
                      <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-[9px] text-white/30 block uppercase font-mono">Precio</span>
                            <span className="font-sans font-light text-xl md:text-2xl text-white tracking-wide">
                              ${product.priceUSD.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCartClick(product);
                          }}
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

      {/* WooCommerce style detail popup */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto"
          onClick={() => setSelectedProduct(null)}
        >
          <div 
            className="relative w-full max-w-4xl rounded-3xl border border-white/10 bg-[#07070d] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300 grid grid-cols-1 md:grid-cols-12 gap-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => {
                cyberSound.playClick();
                setSelectedProduct(null);
              }}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer"
            >
              <X size={15} />
            </button>

            {/* Left side: Beautiful image panel with 4 images switcher */}
            <div className="md:col-span-6 bg-black/50 p-6 flex flex-col items-center justify-center border-r border-white/5 relative">
              <div className="absolute inset-0 bg-radial from-blue-500/5 to-transparent opacity-60 pointer-events-none" />
              
              {/* Active Image */}
              <div className="relative w-full aspect-square flex items-center justify-center p-4">
                <img 
                  src={productImages[activeImageIndex] || selectedProduct.image} 
                  alt={selectedProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full max-h-[300px] object-contain drop-shadow-[0_10px_30px_rgba(0,180,255,0.2)] transition-all duration-300"
                />
              </div>

              {/* Thumbnails Row (Up to 4 images) */}
              {productImages.length > 1 && (
                <div className="flex gap-2.5 mt-4 z-10 relative">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        cyberSound.playClick();
                        setActiveImageIndex(idx);
                      }}
                      className={`w-12 h-12 rounded-xl bg-black/40 border p-1 overflow-hidden transition-all duration-200 cursor-pointer shrink-0 ${
                        activeImageIndex === idx ? "border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right side: Information Details */}
            <div className="md:col-span-6 p-6 md:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Category & Stock Row */}
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] text-blue-400 font-bold tracking-widest uppercase bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                    {selectedProduct.category.toUpperCase()}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-sans font-bold tracking-wider border uppercase ${
                    selectedProduct.stock === "DISPONIBLE"
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                  }`}>
                    ● {selectedProduct.stock}
                  </span>
                </div>

                {/* Title & Tagline */}
                <div>
                  <h3 className="font-sans font-light text-xl md:text-2xl text-white tracking-wide uppercase leading-tight">
                    {selectedProduct.name}
                  </h3>
                  <p className="font-sans text-xs text-white/50 mt-1 leading-relaxed italic font-light">
                    "{selectedProduct.tagline}"
                  </p>
                </div>

                {/* Premium Highlights (Features) */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] text-white/40 font-bold tracking-wider block uppercase">Especificaciones & Detalles:</span>
                  <ul className="space-y-2">
                    {selectedProduct.highlights.map((hl, i) => (
                      <li key={i} className="text-xs text-white/80 leading-snug flex items-start gap-2.5">
                        <Sparkles size={11} className="text-blue-400 mt-1 shrink-0" />
                        <span className="font-light">{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Actions & Trust Signals */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-white/40 uppercase tracking-widest font-mono">PRECIO NETO:</span>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="font-sans font-light text-2xl text-blue-400 tracking-wide">
                      ${selectedProduct.priceUSD.toLocaleString()}
                    </span>
                    <span className="text-xs text-white/40 font-bold font-mono">USD</span>
                  </div>
                </div>

                {/* Trust Seals */}
                <div className="grid grid-cols-2 gap-3 pb-2 text-[10px] text-white/50">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={13} className="text-blue-500" />
                    <span className="font-light">Garantía Certificada</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Truck size={13} className="text-blue-500" />
                    <span className="font-light">Envío inmediato Ccs</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleAddToCartClick(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  onMouseEnter={() => cyberSound.playHover()}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-full bg-blue-500 hover:bg-blue-400 text-black font-sans text-xs font-bold tracking-wider transition-all duration-300 cursor-pointer shadow-lg"
                >
                  <ShoppingCart size={13} />
                  <span>AÑADIR AL CARRITO</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
