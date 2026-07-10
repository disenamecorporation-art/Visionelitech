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
import HeroScene from "./components/HeroScene";
import LoadingScreen from "./components/LoadingScreen";
import { ProductDetails } from "./types";
import { cyberSound } from "./components/CyberSound";
import { Sparkles, MessageSquareCode, Instagram, ShieldCheck, Mail } from "lucide-react";

// Image assets for the widescreen Hero Carousel
const IMAGE_ASSETS = {
  slide1: "https://i.postimg.cc/85xPn1f5/banner1.jpg",
  slide2: "https://i.postimg.cc/C5ByXkp0/banner2.jpg"
};

export default function App() {
  const [isMuted, setIsMuted] = useState(true);
  const [activeSection, setActiveSection] = useState("inicio");
  const [selectedDetailsId, setSelectedDetailsId] = useState("definitive-rig-bundle");

  // Global Shopping Cart States
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Cinematic 3D Intro & Responsive States
  const [loadingFinished, setLoadingFinished] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Monitor screen size for mobile responsive parameters
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
          <div className="w-full relative">
            {/* 3D Cinematic Scroll-Triggered Intro Block */}
            <div id="hero-trigger-container" className="relative w-full h-[185vh] bg-black">
              <div className="fixed inset-0 w-full h-screen z-0 bg-black overflow-hidden select-none">
                <HeroScene isMobile={isMobile} />
              </div>

              {/* Bouncing Scroll-down indicator */}
              <div 
                id="scroll-indicator"
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-[#00f0ff]/80 text-[9px] tracking-[0.45em] uppercase font-mono z-20 pointer-events-none select-none transition-opacity duration-500"
              >
                <span className="animate-pulse">SCROLL PARA CONTINUAR</span>
                <span className="text-xs mt-2 animate-bounce">↓</span>
              </div>
            </div>

            {/* DOM Content revealed via GSAP scroll trigger */}
            <div 
              id="main-content" 
              className="relative z-10 w-full bg-black border-t border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.95)]"
            >
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
            </div>
          </div>
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
        <footer className="w-full border-t border-white/5 bg-black/85 backdrop-blur-md py-24 px-6 md:px-8 mt-24 relative overflow-hidden" id="store-footer">
          <div className="absolute top-0 left-1/3 right-1/3 h-[1px] bg-gradient-to-r from-transparent via-blue-400/20 to-transparent" />
          
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            {/* Identity */}
            <div className="md:col-span-4 space-y-5">
              <div className="flex items-center space-x-3">
                <img 
                  src="/assets/icono.png" 
                  alt="Logo" 
                  className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(0,240,255,0.45)]"
                />
                <span className="font-sans font-light text-xs text-white tracking-[0.25em] uppercase">VISIONELITECH</span>
              </div>
              <p className="font-sans font-light text-xs text-white/50 leading-relaxed max-w-sm">
                La experiencia gamer definitiva. Ensambles de hardware de ultra-gama y refrigeración líquida personalizada. Caracas, Venezuela.
              </p>
              <div className="flex items-center space-x-3 text-gray-400">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => cyberSound.playClick()}
                  className="p-2.5 rounded-full border border-white/5 bg-white/5 hover:text-white hover:border-white/25 hover:bg-white/10 transition-all duration-300"
                  title="Síguenos en Instagram"
                >
                  <Instagram size={14} />
                </a>
                <a
                  href="https://wa.me/584240000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => cyberSound.playClick()}
                  className="p-2.5 rounded-full border border-white/5 bg-white/5 hover:text-green-400 hover:border-green-500/20 hover:bg-green-500/5 transition-all duration-300"
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
                      Tienda
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

      {/* 5. Preloading Overlay */}
      <LoadingScreen onFinished={() => setLoadingFinished(true)} />
    </div>
  );
}
