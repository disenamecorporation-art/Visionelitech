import React from "react";
import { TrendingUp, ShoppingCart, ShieldCheck, Heart } from "lucide-react";
import { ProductDetails } from "../types";
import { PRODUCTS_DATA, EXCHANGE_RATE_VES } from "../data";
import { cyberSound } from "./CyberSound";

interface SpecsViewerProps {
  onAddToCart: (product: ProductDetails) => void;
}

export default function SpecsViewer({ onAddToCart }: SpecsViewerProps) {
  // Filter trending products defined in our database
  const trendingProducts = PRODUCTS_DATA.filter((p) => p.isTrending);

  const handleAddToCartClick = (product: ProductDetails) => {
    cyberSound.playClick();
    onAddToCart(product);
  };

  return (
    <section 
      className="w-full max-w-[1290px] mx-auto px-4 md:px-0 py-16 relative"
      id="specs-viewer-section"
    >
      {/* Background divider */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      <div className="flex flex-col items-center mb-12 text-center">
        <div className="flex items-center space-x-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-3">
          <TrendingUp size={12} className="text-blue-400 animate-pulse" />
          <span className="font-sans text-[10px] font-semibold text-white/70 tracking-wider uppercase">
            Lo más buscado en Caracas
          </span>
        </div>
        <h3 className="font-sans font-black text-2xl md:text-3xl text-white italic tracking-tighter leading-none uppercase">
          PRODUCTOS <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">TENDENCIA GAMER</span>
        </h3>
        <p className="font-sans text-xs text-white/60 max-w-md mt-2">
          Adquiere los componentes y periféricos de ultra-gama más cotizados con entrega inmediata y garantía certificada en Venezuela.
        </p>
      </div>

      {/* Trending Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="trending-grid">
        {trendingProducts.map((product) => {
          const formattedVES = (product.priceUSD * EXCHANGE_RATE_VES).toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          });

          return (
            <div 
              key={product.id}
              className="group relative flex flex-col justify-between rounded-3xl border border-white/5 bg-[#07070a]/50 hover:bg-[#0c0c12]/70 hover:border-blue-500/20 transition-all duration-500 overflow-hidden shadow-[0_15px_35px_-15px_rgba(0,0,0,0.8)] hover:shadow-[0_20px_40px_rgba(59,130,246,0.1)]"
            >
              {/* Image & Badges Container */}
              <div className="relative aspect-[4/3] w-full bg-black/40 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Overlay shadow */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#07070a] via-transparent to-transparent opacity-80" />

                {/* Stock Tag */}
                <span className={`absolute top-4 left-4 px-2 py-0.5 rounded-full text-[8px] font-sans font-bold tracking-widest border uppercase ${
                  product.stock === "DISPONIBLE"
                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                    : product.stock === "BAJO STOCK"
                    ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                    : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                }`}>
                  ● {product.stock}
                </span>

                {/* Brand Badge */}
                <span className="absolute top-4 right-4 text-[9px] font-sans font-bold tracking-wider bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full text-white/50 border border-white/5">
                  ELITE
                </span>
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase">
                    {product.category === "pc" ? "Computadora Armada" : product.category === "perifericos" ? "Periférico" : "Componente Elite"}
                  </span>
                  <h4 className="font-sans font-bold text-sm text-white mt-1 group-hover:text-blue-300 transition-colors tracking-tight uppercase line-clamp-1">
                    {product.name}
                  </h4>
                  <p className="font-sans text-[11px] text-white/50 mt-1.5 leading-relaxed line-clamp-2 h-8">
                    {product.tagline}
                  </p>
                </div>

                {/* Pricing & Cart Button */}
                <div className="mt-5 pt-4 border-t border-white/5">
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <span className="text-[10px] text-white/40 block">PRECIO USD</span>
                      <span className="font-sans font-black text-lg text-white">
                        ${product.priceUSD.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-white/40 block">REF. VES</span>
                      <span className="font-sans font-semibold text-xs text-white/70">
                        Bs. {formattedVES}
                      </span>
                    </div>
                  </div>

                  {/* Add to Cart button */}
                  <button
                    onClick={() => handleAddToCartClick(product)}
                    onMouseEnter={() => cyberSound.playHover()}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-full bg-blue-500/10 hover:bg-blue-500 hover:text-black border border-blue-500/30 text-blue-400 font-sans text-xs font-bold tracking-wider transition-all duration-300 cursor-pointer shadow-md group-hover:border-blue-400"
                  >
                    <ShoppingCart size={13} />
                    <span>AÑADIR AL CARRITO</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
