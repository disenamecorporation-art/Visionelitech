import React from "react";
import { Landmark, Shield, Wrench, Truck, MapPin, Clock, MessageSquare, ExternalLink, Instagram } from "lucide-react";
import { cyberSound } from "./CyberSound";

export default function AboutUs() {
  return (
    <section 
      className="w-full max-w-7xl mx-auto px-4 md:px-6 py-16 relative"
      id="sobre-nosotros-section"
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="flex flex-col items-center mb-12 text-center">
        <h3 className="font-sans font-light text-2xl md:text-3xl text-white tracking-wide uppercase">
          SOBRE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">VISIONELITECH</span>
        </h3>
        <p className="font-sans text-xs text-white/50 max-w-md mt-2">
          La tienda de tecnología premium líder en Caracas, de máxima potencia.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="about-features-grid">
        {/* Core pillar 1 */}
        <div className="p-6 rounded-3xl border border-white/5 bg-[#060608]/40 hover:bg-[#08080c]/60 transition-all duration-300">
          <Shield className="text-blue-400 mb-4" size={24} />
          <h5 className="font-sans font-bold text-xs text-white tracking-wider mb-2 uppercase">
            IMPORTACIONES
          </h5>
          <p className="font-sans text-[11px] text-white/50 leading-relaxed">
            Hardware original, sellado y traído directamente desde centros globales.
          </p>
        </div>

        {/* Core pillar 2 */}
        <div className="p-6 rounded-3xl border border-white/5 bg-[#060608]/40 hover:bg-[#08080c]/60 transition-all duration-300">
          <Wrench className="text-purple-400 mb-4" size={24} />
          <h5 className="font-sans font-bold text-xs text-white tracking-wider mb-2 uppercase">
            ENSAMBLE ELITE
          </h5>
          <p className="font-sans text-[11px] text-white/50 leading-relaxed">
            Cada PC es ensamblada a medida y sometida a rigurosas pruebas térmicas.
          </p>
        </div>

        {/* Core pillar 3 */}
        <div className="p-6 rounded-3xl border border-white/5 bg-[#060608]/40 hover:bg-[#08080c]/60 transition-all duration-300">
          <Truck className="text-emerald-400 mb-4" size={24} />
          <h5 className="font-sans font-bold text-xs text-white tracking-wider mb-2 uppercase">
            ENVÍOS SEGUROS
          </h5>
          <p className="font-sans text-[11px] text-white/50 leading-relaxed">
            Entregas inmediatas en Caracas y envíos asegurados a nivel nacional.
          </p>
        </div>

        {/* Core pillar 4 */}
        <div className="p-6 rounded-3xl border border-white/5 bg-[#060608]/40 hover:bg-[#08080c]/60 transition-all duration-300">
          <MessageSquare className="text-pink-400 mb-4" size={24} />
          <h5 className="font-sans font-bold text-xs text-white tracking-wider mb-2 uppercase">
            SOPORTE POST-VENTA
          </h5>
          <p className="font-sans text-[11px] text-white/50 leading-relaxed">
            Asistencia directa para la optimización de tu sistema e iluminación.
          </p>
        </div>
      </div>

      {/* Showroom metadata card */}
      <div className="mt-10 rounded-3xl border border-white/10 bg-black/50 p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Physical store coordinates */}
        <div className="md:col-span-7 space-y-4">
          <h4 className="font-sans font-light text-lg text-white uppercase">
            NUESTRA SEDE DE EXHIBICIÓN
          </h4>
          <p className="font-sans text-xs text-white/60 leading-relaxed">
            Asegura tu inversión: retira tus componentes y periféricos favoritos directo en tienda con asesoría experta.
          </p>
          <div className="space-y-2 text-xs text-white/50 font-sans">
            <div>
              <span>• CC de Tecnología, Chacao, Caracas, Venezuela.</span>
            </div>
            <div>
              <span>• Lunes a Sábado - 9:30 AM a 5:30 PM</span>
            </div>
          </div>
        </div>

        {/* Support contact / CTA */}
        <div className="md:col-span-5 bg-gradient-to-r from-purple-900/10 to-pink-900/10 border border-purple-500/20 rounded-3xl p-6 flex flex-col justify-between h-full">
          <div>
            <h5 className="font-sans font-bold text-xs text-white tracking-wide mb-1 uppercase">
              ¿Deseas un presupuesto?
            </h5>
            <p className="font-sans text-xs text-white/50 mb-6 leading-relaxed">
              Conversa con un asesor elite y ves detrás de tu objetivo Ahora!
            </p>
          </div>

          <a
            href="https://wa.me/584162586839"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => cyberSound.playClick()}
            onMouseEnter={() => cyberSound.playHover()}
            className="flex items-center justify-center space-x-2 py-2 rounded-full bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-400 hover:text-pink-300 font-sans text-[11px] font-bold tracking-wider transition-all duration-300 cursor-pointer shadow-md"
            id="about-consultation-btn"
          >
            <span>WHATSAPP DIRECTO</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
      
      {/* Social Links */}
      <div className="flex justify-center gap-6 mt-8">
        <a href="https://www.instagram.com/visionelitech.inc/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-purple-400 transition-colors">
          <Instagram size={28} />
        </a>
        <a href="https://wa.me/584162586839" target="_blank" rel="noopener noreferrer" className="text-white hover:text-purple-400 transition-colors">
          <MessageSquare size={28} />
        </a>
      </div>
    </section>
  );
}
