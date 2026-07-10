/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import ParticleBackground from "./components/ParticleBackground";
import HeroSlider from "./components/HeroSlider";
import SpecsViewer from "./components/SpecsViewer";
import RigBuilder from "./components/RigBuilder";
import AboutUs from "./components/AboutUs";
import ShopPage from "./components/ShopPage";
import NeonCallToAction from "./components/NeonCallToAction";
import ShoppingCartDrawer, { CartItem } from "./components/ShoppingCartDrawer";
import { ProductDetails } from "./types";
import { cyberSound } from "./components/CyberSound";
import { Sparkles, MessageSquareCode, Instagram, ShieldCheck, Mail } from "lucide-react";

// Image assets for the widescreen Hero Carousel
const IMAGE_ASSETS = {
  slide1: "https://i.postimg.cc/85xPn1f5/banner1.jpg", // Request banner from user
  slide2: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1290&h=500", // Custom setup
  slide3: "https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?auto=format&fit=crop&q=80&w=1290&h=500"  // Workstation
};

export default function App() {
  const [isMuted, setIsMuted] = useState(true);
  const [activeSection, setActiveSection] = useState("inicio");
  const [selectedDetailsId, setSelectedDetailsId] = useState("definitive-rig-bundle");

  // Global Shopping Cart States
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Scroll to top on page/tab change to ensure excellent UX
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeSection]);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  // Add to Cart handler
  const handleAddToCart = (product: ProductDetails) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { product, quantity: 1 }];
    });
    // Open cart drawer immediately for solid user feedback
    setCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.product.id === productId) {
            return { ...item, quantity: Math.max(0, item.quantity + delta) };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-black font-sans antialiased text-gray-100" id="app-root-container">
      {/* 1. Starry Hex Particle Backdrop (enforcing strict pure black theme requested by user) */}
      <ParticleBackground />

      {/* 2. Floating Navbar Menu with Shopping Cart indicator */}
      <Navbar
        onMuteToggle={setIsMuted}
        isMuted={isMuted}
        onNavigate={handleNavigate}
        activeSection={activeSection}
        cartItemsCount={totalCartCount}
        onCartOpen={() => setCartOpen(true)}
      />

      {/* 3. Main views renderer */}
      <main className="relative z-10 w-full flex flex-col items-center">
        {activeSection === "inicio" && (
          <>
            {/* Widescreen Hero Banner Carousel (exactly 1290x500px, no overlay texts) */}
            <HeroSlider
              onSelectDetails={() => {}}
              imageUrls={IMAGE_ASSETS}
            />

            {/* Trending Products (combopack replaced as requested by the user) */}
            <SpecsViewer onAddToCart={handleAddToCart} />

            {/* Stunning Custom PC Neon Call to Action */}
            <NeonCallToAction
              onNavigateToBuilder={() => handleNavigate("armado")}
              onNavigateToShop={() => handleNavigate("tienda")}
            />

            {/* Brand details and Caracas location */}
            <AboutUs />
          </>
        )}

        {/* WooCommerce Catalog View */}
        {activeSection === "tienda" && (
          <ShopPage onAddToCart={handleAddToCart} />
        )}

        {/* Custom PC builder view */}
        {activeSection === "armado" && (
          <RigBuilder onAddToCart={handleAddToCart} />
        )}

        {/* Modular Info View */}
        {activeSection === "sobre-nosotros" && (
          <div className="pt-24 w-full">
            <AboutUs />
          </div>
        )}

        {/* Premium Informative Footer */}
        <footer className="w-full border-t border-white/5 bg-black/80 backdrop-blur-md py-12 px-4 md:px-6 mt-12 relative overflow-hidden" id="store-footer">
          <div className="absolute top-0 left-1/3 right-1/3 h-[1px] bg-gradient-to-r from-transparent via-blue-400/20 to-transparent" />
          
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Identity */}
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center space-x-2">
                <div className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-purple-600 shadow-[0_0_10px_rgba(0,210,255,0.4)]">
                  <span className="font-sans font-black text-sm italic tracking-tighter text-white">V</span>
                </div>
                <span className="font-sans font-black text-sm text-white tracking-widest">VISIONELITECH</span>
              </div>
              <p className="font-sans text-xs text-white/50 leading-relaxed max-w-sm">
                La experiencia gamer definitiva. Ensambles de hardware de ultra-gama y refrigeración líquida personalizada. Chacao, Caracas, Venezuela.
              </p>
              <div className="flex items-center space-x-3 text-gray-400">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => cyberSound.playClick()}
                  className="p-2 rounded-full border border-white/5 bg-white/5 hover:text-white hover:border-white/25 hover:bg-white/10 transition-all duration-300"
                  title="Síguenos en Instagram"
                >
                  <Instagram size={14} />
                </a>
                <a
                  href="https://wa.me/584240000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => cyberSound.playClick()}
                  className="p-2 rounded-full border border-white/5 bg-white/5 hover:text-green-400 hover:border-green-500/20 hover:bg-green-500/5 transition-all duration-300"
                  title="Escríbenos por WhatsApp"
                >
                  <MessageSquareCode size={14} />
                </a>
              </div>
            </div>

            {/* Navigation shortcuts */}
            <div className="md:col-span-4 grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <span className="font-sans text-[10px] text-white/50 tracking-wider block">
                  MENÚ RÁPIDO
                </span>
                <ul className="space-y-2 text-xs text-white/60">
                  <li>
                    <button
                      onClick={() => handleNavigate("inicio")}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      Inicio
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigate("tienda")}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      Tienda Woo
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigate("armado")}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      Diseña tu PC
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigate("sobre-nosotros")}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      Sobre Nosotros
                    </button>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <span className="font-sans text-[10px] text-white/50 tracking-wider block">
                  SOPORTE VZLA
                </span>
                <ul className="space-y-2 text-xs text-white/60 font-sans">
                  <li className="flex items-center space-x-1">
                    <span>Zelle / Cash</span>
                  </li>
                  <li className="flex items-center space-x-1">
                    <span>Pago Móvil</span>
                  </li>
                  <li className="flex items-center space-x-1">
                    <span>Binance Pay USDT</span>
                  </li>
                  <li className="flex items-center space-x-1">
                    <span>Garantía Física</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Email subscription */}
            <div className="md:col-span-4 space-y-4">
              <span className="font-sans text-[10px] text-white/50 tracking-wider block">
                CORREO CORPORATIVO
              </span>
              <p className="font-sans text-xs text-white/60">
                Suscríbete para recibir notificaciones sobre stock de GPUs NVIDIA RTX serie 50 y ofertas exclusivas de CyberMonday en Venezuela.
              </p>
              
              <div className="flex items-center bg-black/60 border border-white/5 rounded-full p-1 max-w-sm">
                <div className="p-2 text-gray-500">
                  <Mail size={14} />
                </div>
                <input
                  type="email"
                  placeholder="tuemail@gmail.com"
                  className="bg-transparent text-xs text-white focus:outline-none w-full px-1"
                />
                <button
                  onClick={() => cyberSound.playClick()}
                  className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-sans text-[10px] font-bold tracking-wider transition-all cursor-pointer"
                >
                  UNIRSE
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 text-white/40 font-sans text-[11px]">
            <span>© 2026 VISIONELITECH VENEZUELA. Todos los derechos reservados.</span>
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1 text-purple-400">
                <ShieldCheck size={12} />
                <span>Tienda de Computación Elite</span>
              </span>
              <span className="hidden sm:inline">•</span>
              <span>CARACAS, VZLA</span>
            </div>
          </div>
        </footer>
      </main>

      {/* 4. Sliding Shopping Cart Drawer Sidebar */}
      <ShoppingCartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
