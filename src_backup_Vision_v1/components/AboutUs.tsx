import React from "react";
import { Landmark, Shield, Wrench, Truck, MapPin, Clock, MessageSquare, ExternalLink } from "lucide-react";
import { cyberSound } from "./CyberSound";

export default function AboutUs() {
  return (
    <section 
      className="w-full max-w-7xl mx-auto px-4 md:px-6 py-16 relative"
      id="sobre-nosotros-section"
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="flex flex-col items-center mb-12 text-center">
        <div className="flex items-center space-x-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-3">
          <Landmark size={12} className="text-blue-400" />
          <span className="font-sans text-[10px] font-semibold text-white/70 tracking-wider uppercase">
            Quiénes Somos
          </span>
        </div>
        <h3 className="font-sans font-black text-2xl md:text-3xl text-white italic tracking-tighter leading-none uppercase">
          SOBRE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">VISIONELITECH VENEZUELA</span>
        </h3>
        <p className="font-sans text-xs text-white/60 max-w-md mt-2">
          La tienda de tecnología premium líder en Caracas, dedicada a importar y ensamblar los setups más potentes de la región.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="about-features-grid">
        {/* Core pillar 1 */}
        <div className="p-6 rounded-3xl border border-white/5 bg-[#060608]/40 hover:bg-[#08080c]/60 transition-all duration-300">
          <Shield className="text-blue-400 mb-4" size={24} />
          <h5 className="font-sans font-bold text-sm text-white tracking-wider mb-2 uppercase">
            Importaciones Certificadas
          </h5>
          <p className="font-sans text-xs text-white/60 leading-relaxed">
            Traemos hardware original y sellado de fábrica desde los principales centros logísticos globales sin intermediarios.
          </p>
        </div>

        {/* Core pillar 2 */}
        <div className="p-6 rounded-3xl border border-white/5 bg-[#060608]/40 hover:bg-[#08080c]/60 transition-all duration-300">
          <Wrench className="text-purple-400 mb-4" size={24} />
          <h5 className="font-sans font-bold text-sm text-white tracking-wider mb-2 uppercase">
            Ensamble de Precisión
          </h5>
          <p className="font-sans text-xs text-white/60 leading-relaxed">
            Cada rig de enfriamiento líquido es modelado a medida en nuestro taller de Caracas, aplicando rigurosas pruebas de rendimiento térmico.
          </p>
        </div>

        {/* Core pillar 3 */}
        <div className="p-6 rounded-3xl border border-white/5 bg-[#060608]/40 hover:bg-[#08080c]/60 transition-all duration-300">
          <Truck className="text-emerald-400 mb-4" size={24} />
          <h5 className="font-sans font-bold text-sm text-white tracking-wider mb-2 uppercase">
            Envíos Garantizados
          </h5>
          <p className="font-sans text-xs text-white/60 leading-relaxed">
            Despachos rápidos y asegurados en Caracas mediante delivery directo, y envíos asegurados a nivel nacional.
          </p>
        </div>

        {/* Core pillar 4 */}
        <div className="p-6 rounded-3xl border border-white/5 bg-[#060608]/40 hover:bg-[#08080c]/60 transition-all duration-300">
          <MessageSquare className="text-pink-400 mb-4" size={24} />
          <h5 className="font-sans font-bold text-sm text-white tracking-wider mb-2 uppercase">
            Soporte Post-Venta
          </h5>
          <p className="font-sans text-xs text-white/60 leading-relaxed">
            Ofrecemos soporte técnico continuo y asistencia directa para optimización y calibración de BIOS e iluminación ARGB.
          </p>
        </div>
      </div>

      {/* Showroom metadata card */}
      <div className="mt-10 rounded-3xl border border-white/10 bg-black/50 p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Physical store coordinates */}
        <div className="md:col-span-7 space-y-4">
          <div className="flex items-center space-x-2 text-blue-400">
            <MapPin size={18} />
            <span className="font-sans text-xs font-bold tracking-wider uppercase">
              Showroom en Caracas
            </span>
          </div>
          <h4 className="font-sans font-black text-lg text-white italic tracking-tighter uppercase">
            Visita nuestra sede de exhibición
          </h4>
          <p className="font-sans text-xs text-white/70 leading-relaxed">
            Contamos con exhibición de equipos en vivo para que pruebes la potencia de las tarjetas gráficas, periféricos mecánicos y componentes antes de concretar tu orden.
          </p>
          <div className="space-y-2 text-xs text-white/60 font-sans">
            <div className="flex items-center space-x-2">
              <span className="text-blue-400 font-bold">&gt;</span>
              <span><strong>Ubicación:</strong> Centro Comercial de Tecnología, Chacao, Caracas, Distrito Capital, Venezuela.</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-400 font-bold">&gt;</span>
              <span><strong>Horario:</strong> Lunes a Sábado - 10:00 AM a 7:00 PM (Corrido)</span>
            </div>
          </div>
        </div>

        {/* Support contact / CTA */}
        <div className="md:col-span-5 bg-gradient-to-r from-purple-900/10 to-pink-900/10 border border-purple-500/20 rounded-3xl p-6 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center space-x-2 text-pink-400 mb-2">
              <Clock size={14} />
              <span className="font-sans text-[10px] font-bold tracking-wider uppercase">Soporte Directo</span>
            </div>
            <h5 className="font-sans font-bold text-sm text-white tracking-wide mb-1 uppercase">
              ¿Deseas ensamblar un presupuesto?
            </h5>
            <p className="font-sans text-xs text-white/60 mb-6 leading-relaxed">
              Comunícate directamente con nuestro personal de ventas para procesar métodos de pago nacionales o internacionales de forma segura.
            </p>
          </div>

          <a
            href="https://wa.me/584240000000?text=Hola!%20Deseo%20hacer%20una%20consulta%20tecnica%20sobre%20sus%20equipos."
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => cyberSound.playClick()}
            onMouseEnter={() => cyberSound.playHover()}
            className="flex items-center justify-center space-x-2 py-2.5 rounded-full bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-400 hover:text-pink-300 font-sans text-xs font-bold tracking-wider transition-all duration-300 cursor-pointer shadow-md"
            id="about-consultation-btn"
          >
            <span>CONVERSAR CON UN ESPECIALISTA</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </section>
  );
}
