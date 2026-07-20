import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Menu, X, MessageSquareCode, ShoppingCart, User } from "lucide-react";
import { cyberSound } from "./CyberSound";
import { logoBase64 } from "../assets/logoBase64";

interface NavbarProps {
  onMuteToggle: (isMuted: boolean) => void;
  isMuted: boolean;
  onNavigate: (section: string) => void;
  activeSection: string;
  cartItemsCount: number;
  onCartOpen: () => void;
  isAdminLoggedIn?: boolean;
  userEmail?: string | null;
  onLogout?: () => void;
}

export default function Navbar({
  onMuteToggle,
  isMuted,
  onNavigate,
  activeSection,
  cartItemsCount,
  onCartOpen,
  isAdminLoggedIn = false,
  userEmail = null,
  onLogout
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "inicio", label: "INICIO" },
    { id: "tienda", label: "TIENDA" },
    { id: "armado", label: "DISEÑA TU PC" },
    ...(isAdminLoggedIn ? [{ id: "admin", label: "PANEL ADMIN" }] : []),
    ...(userEmail && !isAdminLoggedIn ? [{ id: "perfil", label: "MI PERFIL" }] : []),
    { id: "sobre-nosotros", label: "SOBRE NOSOTROS" }
  ];

  const handleNavClick = (id: string) => {
    cyberSound.playClick();
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const handleMuteToggleClick = () => {
    const newMuteState = !isMuted;
    cyberSound.setMute(newMuteState);
    onMuteToggle(newMuteState);
    if (!newMuteState) {
      cyberSound.playClick();
    }
  };

  const handleCartClick = () => {
    cyberSound.playClick();
    onCartOpen();
  };

  return (
    <header
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[1100px] transition-all duration-500`}
      id="visionelitech-header"
    >
      <div
        className="w-full relative h-16 rounded-full border border-white/10 bg-black/80 backdrop-blur-xl px-6 md:px-8 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        {/* Glow effect lines behind navbar */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
        <div className="absolute bottom-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-purple-500/10 to-transparent" />

        {/* LOGO */}
        <button
          onClick={() => handleNavClick("inicio")}
          className="flex items-center gap-2 group cursor-pointer text-left"
          onMouseEnter={() => cyberSound.playHover()}
          id="navbar-logo-btn"
        >
          <img 
            src={logoBase64} 
            alt="Logo" 
            className="w-10 h-10 object-contain drop-shadow-[0_0_12px_rgba(0,240,255,0.45)] group-hover:scale-110 transition-transform duration-300"
          />
          <span className="font-sans font-light text-[9px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] text-white/90 group-hover:text-blue-400 transition-colors duration-300 uppercase select-none">
            VISIONELITECH
          </span>
        </button>

        {/* DESKTOP NAV ITEMS */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-3" id="desktop-navbar">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                onMouseEnter={() => cyberSound.playHover()}
                className={`relative px-3.5 py-1 font-sans text-[10px] font-bold tracking-widest transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "text-blue-400"
                    : "text-white/70 hover:text-blue-400"
                }`}
                style={{
                  textShadow: isActive ? "0 0 10px rgba(96,165,250,0.4)" : "none"
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* UTILITIES & TRIGGERS */}
        <div className="flex items-center space-x-3">
          {userEmail ? (
            <div className="flex items-center space-x-2 border border-white/10 bg-white/5 py-1 px-3 rounded-full">
              <button 
                onClick={() => {
                  if (!isAdminLoggedIn) {
                    cyberSound.playClick();
                    onNavigate("perfil");
                  }
                }}
                className={`text-[9px] font-bold font-mono text-blue-400 max-w-[80px] md:max-w-[120px] truncate uppercase ${!isAdminLoggedIn ? "hover:text-blue-300 cursor-pointer" : ""}`}
              >
                {isAdminLoggedIn ? "👑 Admin" : userEmail.split("@")[0]}
              </button>
              <button 
                onClick={onLogout} 
                className="text-white/40 hover:text-red-400 font-sans text-[9px] font-bold tracking-wider uppercase transition-colors cursor-pointer"
              >
                Salir
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => { cyberSound.playClick(); onNavigate("login"); }} 
                className="hidden md:block text-white/70 hover:text-blue-400 font-sans text-[10px] font-bold tracking-widest uppercase cursor-pointer"
              >
                Login
              </button>
              <button 
                onClick={() => { cyberSound.playClick(); onNavigate("registro"); }} 
                className="hidden md:block text-white/70 hover:text-blue-400 font-sans text-[10px] font-bold tracking-widest uppercase cursor-pointer"
              >
                Registro
              </button>
              <button 
                onClick={() => { cyberSound.playClick(); onNavigate("login"); }} 
                className="block md:hidden p-2 rounded-full border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center"
                title="Login / Registro"
              >
                <User size={14} />
              </button>
            </div>
          )}
          
          {/* Shopping Cart Button */}
          <button
            onClick={handleCartClick}
            onMouseEnter={() => cyberSound.playHover()}
            className="relative p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all cursor-pointer flex items-center justify-center"
            title="Ver Carrito de Compras"
            id="navbar-cart-trigger"
          >
            <ShoppingCart size={14} />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-blue-500 border border-black flex items-center justify-center text-[8px] font-bold text-black animate-pulse">
                {cartItemsCount}
              </span>
            )}
          </button>

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => {
              cyberSound.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            onMouseEnter={() => cyberSound.playHover()}
            className="md:hidden p-2 rounded-full border border-white/10 bg-white/5 text-gray-300 hover:text-white cursor-pointer"
            id="mobile-menu-toggle-btn"
          >
            {mobileMenuOpen ? <X size={14} /> : <Menu size={14} />}
          </button>
        </div>
      </div>

      {/* MOBILE NAV DRAWER */}
      {mobileMenuOpen && (
        <div
          className="absolute top-20 left-0 right-0 mx-auto w-full rounded-2xl border border-white/10 bg-[#060608]/95 backdrop-blur-lg p-5 flex flex-col space-y-3 shadow-2xl md:hidden animate-in fade-in slide-in-from-top-5 duration-300"
          id="mobile-nav-drawer"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                onMouseEnter={() => cyberSound.playHover()}
                className={`w-full py-3 px-4 rounded-xl text-left font-sans font-medium text-xs tracking-widest transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "text-blue-400 bg-blue-500/10 border-l-2 border-blue-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </button>
            );
          })}
          
          <a
            href="https://wa.me/584240000000?text=Hola!%20Estoy%20interesado%20en%20los%20equipos%20gamer%20de%20Visionelitech"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => cyberSound.playClick()}
            onMouseEnter={() => cyberSound.playHover()}
            className="flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-sans font-bold tracking-widest shadow-[0_0_15px_rgba(0,210,255,0.1)] transition-all duration-300"
          >
            <MessageSquareCode size={14} />
            <span>PEDIR POR WHATSAPP</span>
          </a>
        </div>
      )}
    </header>
  );
}
