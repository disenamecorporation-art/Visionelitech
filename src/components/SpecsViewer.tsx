import React from "react";
import { TrendingUp, ShoppingCart, ShieldCheck, Heart } from "lucide-react";
import { ProductDetails } from "../types";
import { PRODUCTS_DATA } from "../data";
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
        <h3 className="font-sans font-light text-2xl md:text-3xl text-white tracking-wide uppercase">
          PRODUCTOS <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">TENDENCIA GAMER</span>
        </h3>
        <p className="font-sans text-xs text-white/50 max-w-md mt-2">
          Los componentes y periféricos de ultra-gama más cotizados con entrega inmediata en Venezuela.
        </p>
      </div>

      {/* Trending Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="trending-grid">
        {trendingProducts.map((product) => {
          return (
            <div 
              key={product.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-white/5 bg-[#07070a]/60 hover:bg-[#0c0c12]/80 hover:border-blue-500/20 transition-all duration-300 overflow-hidden shadow-[0_15px_30px_-15px_rgba(0,0,0,0.8)]"
            >
              {/* Image & Badges Container */}
              <div className="relative aspect-square w-full bg-black/40 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Overlay shadow */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#07070a]/90 via-transparent to-transparent" />

                {/* Stock Tag */}
                <span className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-[8px] font-sans font-bold tracking-widest border uppercase ${
                  product.stock === "DISPONIBLE"
                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                    : product.stock === "BAJO STOCK"
                    ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                    : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                }`}>
                  ● {product.stock}
                </span>
              </div>

              {/* Product Info - Simple & Clean */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[9px] text-blue-400 font-medium tracking-widest uppercase block">
                    {product.category === "pc" ? "Computadora Armada" : product.category === "perifericos" ? "Periférico" : "Componente Elite"}
                  </span>
                  <h4 className="font-sans font-light text-base md:text-lg text-white/90 mt-1.5 tracking-wide uppercase line-clamp-1 group-hover:text-blue-400 transition-colors duration-300">
                    {product.name}
                  </h4>
                </div>

                {/* Pricing & Add to Cart button */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/30 uppercase tracking-widest font-light">Precio</span>
                    <span className="font-sans font-light text-xl md:text-2xl text-white tracking-wide">
                      ${product.priceUSD.toLocaleString()}
                    </span>
                  </div>

                  {/* Add to Cart button */}
                  <button
                    onClick={() => handleAddToCartClick(product)}
                    onMouseEnter={() => cyberSound.playHover()}
                    className="w-full flex items-center justify-center space-x-2 py-2 rounded-full bg-blue-500/10 hover:bg-blue-500 hover:text-black border border-blue-500/20 hover:border-blue-500 text-blue-400 font-sans text-[11px] font-bold tracking-wider transition-all duration-300 cursor-pointer"
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
    </section>
  );
}
