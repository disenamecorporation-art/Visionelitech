import React from "react";
import { Sparkles, ArrowRight, Layers, ShoppingBag } from "lucide-react";
import { cyberSound } from "./CyberSound";

interface NeonCallToActionProps {
  onNavigateToBuilder: () => void;
  onNavigateToShop: () => void;
}

export default function NeonCallToAction({ onNavigateToBuilder, onNavigateToShop }: NeonCallToActionProps) {
  return (
    <div 
      className="w-full max-w-[1290px] mx-auto px-4 md:px-0 py-12"
      id="neon-cta-container"
    >
      <div 
        className="relative w-full rounded-3xl bg-black border border-blue-500/20 p-8 md:p-12 overflow-hidden flex flex-col lg:flex-row justify-between items-center gap-8 shadow-[0_0_50px_-10px_rgba(59,130,246,0.15)] group"
      >
        {/* Futuristic Grid background lines overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:30px_30px] opacity-40 pointer-events-none" />

        {/* Ambient subtle glowing nodes */}
        <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-blue-500/10 blur-[60px] pointer-events-none group-hover:bg-blue-500/15 transition-all duration-750" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-purple-500/10 blur-[60px] pointer-events-none group-hover:bg-purple-500/15 transition-all duration-750" />

        {/* Text Details (LHS) */}
        <div className="flex-1 space-y-4 text-center lg:text-left relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/5 border border-blue-500/20 rounded-full">
            <Sparkles size={11} className="text-blue-400 animate-pulse" />
            <span className="font-sans text-[9px] font-bold tracking-widest text-blue-400 uppercase">
              Estación de Vanguardia
            </span>
          </div>

          <h3 className="font-sans font-black text-2xl sm:text-3xl md:text-4xl text-white italic tracking-tighter leading-none uppercase">
            ¿LISTO PARA <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 drop-shadow-[0_0_12px_rgba(168,85,247,0.3)]">ENSAMBLAR TU CAMINO?</span>
          </h3>
          
          <p className="font-sans text-xs sm:text-sm text-white/50 max-w-xl leading-relaxed">
            No te conformes con hardware ordinario. Elige cada procesador, GPU de última generación y chasis ARGB líquido de forma interactiva, o explora nuestro amplio inventario para entregas físicas inmediatas en Venezuela.
          </p>
        </div>

        {/* Action Controls (RHS) */}
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto relative z-10">
          <button
            onClick={() => {
              cyberSound.playClick();
              onNavigateToBuilder();
            }}
            onMouseEnter={() => cyberSound.playHover()}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-6 py-3.5 rounded-full bg-blue-500 hover:bg-blue-400 text-black font-sans text-xs font-black tracking-wider transition-all duration-300 cursor-pointer shadow-[0_4px_15px_rgba(59,130,246,0.2)] hover:scale-105 active:scale-95"
          >
            <Layers size={13} />
            <span>DISEÑAR MI PROPIA PC</span>
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => {
              cyberSound.playClick();
              onNavigateToShop();
            }}
            onMouseEnter={() => cyberSound.playHover()}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-6 py-3.5 rounded-full border border-white/10 hover:border-blue-500/30 bg-white/5 hover:bg-blue-500/10 text-white hover:text-blue-400 font-sans text-xs font-bold tracking-wider transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
          >
            <ShoppingBag size={13} />
            <span>VER CATÁLOGO COMPLETO</span>
          </button>
        </div>
      </div>
    </div>
  );
}
