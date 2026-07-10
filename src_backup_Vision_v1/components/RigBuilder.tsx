import React, { useState, useEffect, useRef } from "react";
import { Cpu, Zap, Fan, Droplet, Sparkles, Check, ShoppingCart, MessageSquareCode, Layers } from "lucide-react";
import { ProductDetails } from "../types";
import { PRODUCTS_DATA, EXCHANGE_RATE_VES } from "../data";
import { cyberSound } from "./CyberSound";

interface RigBuilderProps {
  onAddToCart: (product: ProductDetails) => void;
}

interface RGBZone {
  id: string;
  name: string;
  color: string;
}

const PRESET_COLORS = [
  { name: "Cyan", value: "#06b6d4" },
  { name: "Fucsia", value: "#ec4899" },
  { name: "Verde Ácido", value: "#84cc16" },
  { name: "Púrpura", value: "#a855f7" },
  { name: "Oro", value: "#eab308" }
];

export default function RigBuilder({ onAddToCart }: RigBuilderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Components Data
  const cpus = PRODUCTS_DATA.filter((p) => p.category === "cpu");
  const gpus = PRODUCTS_DATA.filter((p) => p.category === "gpu");
  const rams = PRODUCTS_DATA.filter((p) => p.category === "ram");
  const storages = PRODUCTS_DATA.filter((p) => p.category === "storage");
  const motherboards = PRODUCTS_DATA.filter((p) => p.category === "motherboard");
  const psus = PRODUCTS_DATA.filter((p) => p.category === "psu");
  const cases = PRODUCTS_DATA.filter((p) => p.category === "case");
  const monitors = PRODUCTS_DATA.filter((p) => p.category === "monitor");

  // Selected Components State
  const [selectedCpu, setSelectedCpu] = useState<ProductDetails>(cpus[0] || PRODUCTS_DATA[0]);
  const [selectedGpu, setSelectedGpu] = useState<ProductDetails>(gpus[0] || PRODUCTS_DATA[0]);
  const [selectedRam, setSelectedRam] = useState<ProductDetails>(rams[0] || PRODUCTS_DATA[0]);
  const [selectedStorage, setSelectedStorage] = useState<ProductDetails>(storages[0] || PRODUCTS_DATA[0]);
  const [selectedMotherboard, setSelectedMotherboard] = useState<ProductDetails>(motherboards[0] || PRODUCTS_DATA[0]);
  const [selectedPsu, setSelectedPsu] = useState<ProductDetails>(psus[0] || PRODUCTS_DATA[0]);
  const [selectedCase, setSelectedCase] = useState<ProductDetails>(cases[0] || PRODUCTS_DATA[0]);
  const [selectedMonitor, setSelectedMonitor] = useState<ProductDetails | null>(null);

  // Active Category modal selector state
  const [activeSelectorCategory, setActiveSelectorCategory] = useState<string | null>(null);

  // RGB Control state
  const [selectedZone, setSelectedZone] = useState<string>("fans");
  const [zones, setZones] = useState<RGBZone[]>([
    { id: "fans", name: "Ventiladores ARGB", color: "#06b6d4" },
    { id: "liquid", name: "Fluido Líquido", color: "#a855f7" },
    { id: "block", name: "Bloque de CPU", color: "#ec4899" },
    { id: "underglow", name: "Underglow del Chasis", color: "#84cc16" }
  ]);
  const [fanRPM, setFanRPM] = useState<number>(1400);
  const [fluidFlow, setFluidFlow] = useState<number>(5);

  const updateZoneColor = (color: string) => {
    cyberSound.playClick();
    setZones((prev) =>
      prev.map((z) => (z.id === selectedZone ? { ...z, color } : z))
    );
  };

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let fanAngle = 0;
    let liquidOffset = 0;

    const drawRig = () => {
      ctx.fillStyle = "#050508";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const fansColor = zones.find((z) => z.id === "fans")?.color || "#06b6d4";
      const liquidColor = zones.find((z) => z.id === "liquid")?.color || "#a855f7";
      const blockColor = zones.find((z) => z.id === "block")?.color || "#ec4899";
      const underColor = zones.find((z) => z.id === "underglow")?.color || "#84cc16";

      // 1. Underglow
      const ugGrad = ctx.createLinearGradient(0, 310, 0, 350);
      ugGrad.addColorStop(0, `${underColor}40`);
      ugGrad.addColorStop(1, "transparent");
      ctx.fillStyle = ugGrad;
      ctx.fillRect(40, 310, 320, 35);

      // 2. Chassis Outline
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 3;
      ctx.fillStyle = "rgba(10, 10, 15, 0.85)";
      ctx.beginPath();
      ctx.roundRect(50, 40, 300, 270, 12);
      ctx.fill();
      ctx.stroke();

      // Front glass
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;
      ctx.strokeRect(60, 50, 280, 250);

      // PSU Shroud
      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(65, 260, 270, 35);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.strokeRect(65, 260, 270, 35);

      // Custom RGB Case Brand label
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctx.font = "bold 9px sans-serif";
      ctx.fillText(selectedCase.name.split(" ")[0] || "VISIONELITECH", 80, 282);

      // 3. Liquid cooling tubes
      ctx.lineWidth = 6;
      ctx.strokeStyle = `${liquidColor}80`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = liquidColor;

      ctx.beginPath();
      ctx.moveTo(150, 110);
      ctx.lineTo(290, 110);
      ctx.lineTo(290, 240);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(150, 125);
      ctx.lineTo(270, 125);
      ctx.lineTo(270, 240);
      ctx.stroke();

      ctx.shadowBlur = 0; // Reset shadow

      // 4. Draw Reservoir / Pump
      ctx.fillStyle = "rgba(20, 20, 30, 0.9)";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;
      ctx.fillRect(260, 140, 40, 110);
      ctx.strokeRect(260, 140, 40, 110);

      // Draw active liquid inside reservoir
      ctx.fillStyle = `${liquidColor}50`;
      const resFillHeight = 85 + Math.sin(liquidOffset * 0.05) * 2;
      ctx.fillRect(262, 245 - resFillHeight, 36, resFillHeight);

      // Bubbles in reservoir
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      for (let i = 0; i < 4; i++) {
        const bx = 265 + ((i * 7 + liquidOffset) % 30);
        const by = 240 - ((i * 20 + liquidOffset * 1.5) % 80);
        ctx.beginPath();
        ctx.arc(bx, by, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Draw Motherboard and GPU
      ctx.fillStyle = "#0e0e15";
      ctx.fillRect(90, 80, 160, 160);

      // GPU Block
      ctx.fillStyle = "#151522";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.beginPath();
      ctx.roundRect(85, 150, 165, 30, 4);
      ctx.fill();
      ctx.stroke();

      // GPU Branding light
      ctx.fillStyle = fansColor;
      ctx.shadowBlur = 6;
      ctx.shadowColor = fansColor;
      ctx.fillRect(100, 162, 50, 3);
      ctx.shadowBlur = 0;

      // 6. Draw CPU Water block
      ctx.fillStyle = "#12121d";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.beginPath();
      ctx.roundRect(115, 95, 45, 45, 6);
      ctx.fill();
      ctx.stroke();

      // CPU RGB ring
      ctx.strokeStyle = blockColor;
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 8;
      ctx.shadowColor = blockColor;
      ctx.beginPath();
      ctx.arc(137, 117, 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 7. Draw RAM Modules
      ctx.lineWidth = 1;
      for (let i = 0; i < 4; i++) {
        const rx = 175 + i * 5;
        ctx.fillStyle = "#1c1c28";
        ctx.fillRect(rx, 90, 3, 30);
        // RGB Top bar on RAM
        ctx.fillStyle = fansColor;
        ctx.fillRect(rx, 90, 3, 4);
      }

      // 8. Dual 120mm top fans
      const drawFan = (cx: number, cy: number, radius: number) => {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = fansColor;
        ctx.shadowBlur = 10;
        ctx.shadowColor = fansColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, radius - 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Fan blades spinning
        ctx.fillStyle = "rgba(255,255,255,0.07)";
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(fanAngle);
        for (let j = 0; j < 7; j++) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(8, -12, 0, -radius + 6);
          ctx.quadraticCurveTo(-8, -12, 0, 0);
          ctx.fill();
          ctx.rotate((Math.PI * 2) / 7);
        }
        ctx.restore();
      };

      drawFan(120, 60, 22);
      drawFan(175, 60, 22);
      drawFan(230, 60, 22);

      // Hardware status overlay on canvas
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.font = "8px monospace";
      ctx.fillText(`FANS: ${fanRPM} RPM`, 70, 280);
      ctx.fillText(`COOLANT: ${fluidFlow} L/M`, 265, 280);

      // Adjust animation speeds based on state
      fanAngle += (fanRPM / 1000) * 0.08;
      liquidOffset += fluidFlow * 0.4;

      animFrame = requestAnimationFrame(drawRig);
    };

    drawRig();

    return () => {
      cancelAnimationFrame(animFrame);
    };
  }, [zones, fanRPM, fluidFlow, selectedCase]);

  // Calculate Running Total
  const totalUSD =
    selectedCpu.priceUSD +
    selectedGpu.priceUSD +
    selectedRam.priceUSD +
    selectedStorage.priceUSD +
    selectedMotherboard.priceUSD +
    selectedPsu.priceUSD +
    selectedCase.priceUSD +
    (selectedMonitor ? selectedMonitor.priceUSD : 0);

  const totalVES = totalUSD * EXCHANGE_RATE_VES;

  const handleBuildAddToCart = () => {
    cyberSound.playClick();

    // Create a beautifully described PC Bundle item
    const customPcProduct: ProductDetails = {
      id: `custom-pc-${Date.now()}`,
      name: "PC ARMADA PERSONALIZADA ELITE",
      tagline: `Configuración Custom: Intel/AMD de Ultra-Gama + Gráfica de Última Generación`,
      category: "pc",
      priceUSD: totalUSD,
      priceVES: totalVES,
      stock: "DISPONIBLE",
      image: selectedCase.image || "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80",
      highlights: [
        `Procesador (CPU): ${selectedCpu.name} ($${selectedCpu.priceUSD})`,
        `Gráfica (GPU): ${selectedGpu.name} ($${selectedGpu.priceUSD})`,
        `Memoria RAM: ${selectedRam.name} ($${selectedRam.priceUSD})`,
        `Almacenamiento: ${selectedStorage.name} ($${selectedStorage.priceUSD})`,
        `Tarjeta Madre: ${selectedMotherboard.name} ($${selectedMotherboard.priceUSD})`,
        `Fuente de Poder: ${selectedPsu.name} ($${selectedPsu.priceUSD})`,
        `Gabinete (Chasis): ${selectedCase.name} ($${selectedCase.priceUSD})`,
        selectedMonitor ? `Monitor Premium: ${selectedMonitor.name} ($${selectedMonitor.priceUSD})` : "Sin monitor adicional"
      ],
      specs: [
        { name: "CPU", value: selectedCpu.name.replace("AMD ", "").replace("INTEL ", ""), percentage: 95 },
        { name: "GPU", value: selectedGpu.name.replace("NVIDIA ", "").replace("GEFORCE ", ""), percentage: 100 },
        { name: "RAM", value: selectedRam.name.split(" ")[0] || "DDR5", percentage: 95 },
        { name: "SSD", value: selectedStorage.name.split(" ")[1] || "M.2", percentage: 95 }
      ]
    };

    onAddToCart(customPcProduct);
  };

  // Render Component Row
  const renderComponentRow = (label: string, value: string, price: number, categoryKey: string) => {
    return (
      <div className="flex items-center justify-between p-3.5 bg-black/40 border border-white/5 hover:border-blue-500/20 rounded-2xl transition-all duration-300">
        <div className="flex flex-col">
          <span className="font-sans text-[10px] text-white/40 tracking-wider uppercase">{label}</span>
          <span className="font-sans text-xs text-white font-bold tracking-tight uppercase line-clamp-1">{value}</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="font-sans text-xs text-blue-400 font-bold">${price.toLocaleString()}</span>
          <button
            onClick={() => {
              cyberSound.playClick();
              setActiveSelectorCategory(categoryKey);
            }}
            className="px-3 py-1 bg-white/5 hover:bg-blue-500 hover:text-black border border-white/5 rounded-full font-sans text-[10px] font-bold text-white/80 transition-all duration-300 cursor-pointer"
          >
            CAMBIAR
          </button>
        </div>
      </div>
    );
  };

  return (
    <section 
      className="w-full max-w-[1290px] mx-auto px-4 md:px-0 py-16 relative"
      id="rig-builder-section"
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* Header */}
      <div className="flex flex-col items-center mb-12 text-center">
        <div className="flex items-center space-x-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-3">
          <Layers size={12} className="text-blue-400 animate-bounce" />
          <span className="font-sans text-[10px] font-semibold text-white/70 tracking-wider uppercase">
            Estación de Armado Virtual
          </span>
        </div>
        <h3 className="font-sans font-black text-2xl md:text-3xl text-white italic tracking-tighter leading-none uppercase">
          DISEÑA TU <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">PROPIA PC GAMER</span>
        </h3>
        <p className="font-sans text-xs text-white/60 max-w-md mt-2">
          Selecciona cada componente individual, mira el presupuesto total estimado en dólares y bolívares, y personaliza el chasis y la iluminación de tu máquina de ensueño.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: PC Builder Interface */}
        <div 
          className="lg:col-span-7 rounded-3xl border border-white/10 bg-[#07070a]/60 backdrop-blur-md p-6 md:p-8 relative"
          id="pc-builder-components-panel"
        >
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
            <h4 className="font-sans font-black text-base text-white tracking-tight uppercase">
              Lista de Componentes
            </h4>
            <span className="text-[10px] font-mono text-white/50 uppercase">Tasa: {EXCHANGE_RATE_VES} VES/USD</span>
          </div>

          {/* Selector Rows */}
          <div className="space-y-3">
            {renderComponentRow("Procesador / CPU", selectedCpu.name, selectedCpu.priceUSD, "cpu")}
            {renderComponentRow("Tarjeta Gráfica / GPU", selectedGpu.name, selectedGpu.priceUSD, "gpu")}
            {renderComponentRow("Memoria RAM", selectedRam.name, selectedRam.priceUSD, "ram")}
            {renderComponentRow("Almacenamiento SSD", selectedStorage.name, selectedStorage.priceUSD, "storage")}
            {renderComponentRow("Tarjeta Madre", selectedMotherboard.name, selectedMotherboard.priceUSD, "motherboard")}
            {renderComponentRow("Fuente de Poder (PSU)", selectedPsu.name, selectedPsu.priceUSD, "psu")}
            {renderComponentRow("Gabinete / Case", selectedCase.name, selectedCase.priceUSD, "case")}

            {/* Optional Monitor Row */}
            <div className="flex items-center justify-between p-3.5 bg-black/40 border border-white/5 hover:border-blue-500/20 rounded-2xl transition-all duration-300">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="include-monitor"
                  checked={selectedMonitor !== null}
                  onChange={(e) => {
                    cyberSound.playClick();
                    if (e.target.checked) {
                      setSelectedMonitor(monitors[0] || null);
                    } else {
                      setSelectedMonitor(null);
                    }
                  }}
                  className="w-4 h-4 rounded border-white/15 bg-black text-blue-500 accent-blue-500 focus:ring-0 cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="font-sans text-[10px] text-white/40 tracking-wider uppercase">Monitor Adicional (Opcional)</span>
                  <span className="font-sans text-xs text-white font-bold tracking-tight uppercase line-clamp-1">
                    {selectedMonitor ? selectedMonitor.name : "Ninguno seleccionado"}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {selectedMonitor && (
                  <>
                    <span className="font-sans text-xs text-blue-400 font-bold">${selectedMonitor.priceUSD.toLocaleString()}</span>
                    <button
                      onClick={() => {
                        cyberSound.playClick();
                        setActiveSelectorCategory("monitor");
                      }}
                      className="px-3 py-1 bg-white/5 hover:bg-blue-500 hover:text-black border border-white/5 rounded-full font-sans text-[10px] font-bold text-white/80 transition-all duration-300 cursor-pointer"
                    >
                      CAMBIAR
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Running Budget Bar */}
          <div className="mt-8 p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <span className="text-[10px] text-blue-400 font-bold tracking-wider block uppercase mb-1">Presupuesto del Ensamble</span>
              <div className="flex items-baseline space-x-2">
                <span className="font-sans font-black text-2xl text-white">${totalUSD.toLocaleString()}</span>
                <span className="text-xs text-white/50 font-bold">USD</span>
                <span className="text-xs text-white/30 px-2">|</span>
                <span className="font-sans font-bold text-sm text-white/80">Bs. {totalVES.toLocaleString(undefined, { maximumFractionDigits: 0 })} VES</span>
              </div>
            </div>

            <button
              onClick={handleBuildAddToCart}
              onMouseEnter={() => cyberSound.playHover()}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-400 text-black font-sans text-xs font-black tracking-wider transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            >
              <ShoppingCart size={13} />
              <span>AÑADIR ENSAMBLE AL CARRITO</span>
            </button>
          </div>
        </div>

        {/* Right Side: Animated Chassis and ARGB Controls */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          {/* Live Canvas Visualizer */}
          <div 
            className="w-full flex flex-col justify-center items-center rounded-3xl border border-white/10 bg-[#030305] p-5 relative overflow-hidden"
            id="canvas-chassis-viewer"
          >
            {/* Tech details */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-white/10 pointer-events-none" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-white/10 pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-white/10 pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-white/10 pointer-events-none" />

            <div className="mb-4">
              <span className="font-sans text-[10px] text-white/50 tracking-widest block text-center uppercase">
                Simulación en Tiempo Real
              </span>
            </div>

            <canvas
              ref={canvasRef}
              width={400}
              height={320}
              className="rounded-xl shadow-inner max-w-full"
            />
          </div>

          {/* ARGB Controls inside a secondary elegant dashboard */}
          <div className="rounded-3xl border border-white/10 bg-[#07070a]/40 p-5 space-y-5">
            <span className="text-[10px] text-white/50 font-bold tracking-wider block uppercase">Control de Iluminación y Rendimiento</span>
            
            {/* Zone & RGB Selector */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="flex space-x-1.5 bg-black/40 border border-white/5 rounded-full p-1 w-full sm:w-auto">
                {zones.map((z) => (
                  <button
                    key={z.id}
                    onClick={() => {
                      cyberSound.playClick();
                      setSelectedZone(z.id);
                    }}
                    className={`py-1.5 px-3 rounded-full font-sans text-[9px] font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                      selectedZone === z.id
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        : "text-gray-500 border border-transparent hover:text-white"
                    }`}
                  >
                    {z.name.split(" ")[0]}
                  </button>
                ))}
              </div>

              {/* Color Presets */}
              <div className="flex items-center space-x-1.5">
                {PRESET_COLORS.map((color) => {
                  const currentActiveColor = zones.find((z) => z.id === selectedZone)?.color;
                  const isMatching = currentActiveColor?.toLowerCase() === color.value.toLowerCase();
                  return (
                    <button
                      key={color.name}
                      onClick={() => updateZoneColor(color.value)}
                      className={`w-5 h-5 rounded-full border transition-all duration-300 cursor-pointer ${
                        isMatching ? "border-white scale-110" : "border-transparent"
                      }`}
                      style={{
                        backgroundColor: color.value,
                        boxShadow: `0 0 6px ${color.value}50`
                      }}
                      title={color.name}
                    />
                  );
                })}
              </div>
            </div>

            {/* Performance Sliders */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-white/50">
                  <span>VELOCIDAD VENTILADORES</span>
                  <span className="text-white font-bold">{fanRPM} RPM</span>
                </div>
                <input
                  type="range"
                  min="600"
                  max="2200"
                  step="200"
                  value={fanRPM}
                  onChange={(e) => setFanRPM(Number(e.target.value))}
                  className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-white/50">
                  <span>FLUJO REFRIGERACIÓN</span>
                  <span className="text-white font-bold">{fluidFlow} L/M</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="1"
                  value={fluidFlow}
                  onChange={(e) => setFluidFlow(Number(e.target.value))}
                  className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL / SELECTION INLINE PANEL */}
      {activeSelectorCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#07070c] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h5 className="font-sans font-black text-base text-white tracking-tight uppercase">
                Seleccionar {
                  activeSelectorCategory === "cpu" ? "Procesador (CPU)" :
                  activeSelectorCategory === "gpu" ? "Tarjeta Gráfica (GPU)" :
                  activeSelectorCategory === "ram" ? "Memoria RAM" :
                  activeSelectorCategory === "storage" ? "Almacenamiento SSD" :
                  activeSelectorCategory === "motherboard" ? "Tarjeta Madre" :
                  activeSelectorCategory === "psu" ? "Fuente de Poder" :
                  activeSelectorCategory === "case" ? "Chasis / Case" : "Monitor Premium"
                }
              </h5>
              <button
                onClick={() => {
                  cyberSound.playClick();
                  setActiveSelectorCategory(null);
                }}
                className="text-gray-400 hover:text-white font-sans text-xs tracking-wider font-bold cursor-pointer"
              >
                CERRAR [X]
              </button>
            </div>

            {/* List of components */}
            <div className="p-6 max-h-[400px] overflow-y-auto space-y-3 scrollbar-thin">
              {(
                activeSelectorCategory === "cpu" ? cpus :
                activeSelectorCategory === "gpu" ? gpus :
                activeSelectorCategory === "ram" ? rams :
                activeSelectorCategory === "storage" ? storages :
                activeSelectorCategory === "motherboard" ? motherboards :
                activeSelectorCategory === "psu" ? psus :
                activeSelectorCategory === "case" ? cases : monitors
              ).map((component) => {
                const isSelected = 
                  activeSelectorCategory === "cpu" ? selectedCpu.id === component.id :
                  activeSelectorCategory === "gpu" ? selectedGpu.id === component.id :
                  activeSelectorCategory === "ram" ? selectedRam.id === component.id :
                  activeSelectorCategory === "storage" ? selectedStorage.id === component.id :
                  activeSelectorCategory === "motherboard" ? selectedMotherboard.id === component.id :
                  activeSelectorCategory === "psu" ? selectedPsu.id === component.id :
                  activeSelectorCategory === "case" ? selectedCase.id === component.id :
                  selectedMonitor?.id === component.id;

                return (
                  <button
                    key={component.id}
                    onClick={() => {
                      cyberSound.playClick();
                      if (activeSelectorCategory === "cpu") setSelectedCpu(component);
                      else if (activeSelectorCategory === "gpu") setSelectedGpu(component);
                      else if (activeSelectorCategory === "ram") setSelectedRam(component);
                      else if (activeSelectorCategory === "storage") setSelectedStorage(component);
                      else if (activeSelectorCategory === "motherboard") setSelectedMotherboard(component);
                      else if (activeSelectorCategory === "psu") setSelectedPsu(component);
                      else if (activeSelectorCategory === "case") setSelectedCase(component);
                      else if (activeSelectorCategory === "monitor") setSelectedMonitor(component);
                      setActiveSelectorCategory(null);
                    }}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex justify-between items-center cursor-pointer ${
                      isSelected
                        ? "bg-blue-500/10 border-blue-400/50 text-white"
                        : "bg-black/30 border-white/5 hover:border-white/10 text-gray-300 hover:text-white"
                    }`}
                  >
                    <div className="space-y-1 max-w-[80%]">
                      <span className="font-sans text-xs font-bold block uppercase">{component.name}</span>
                      <span className="font-sans text-[10px] text-white/50 block leading-tight">{component.tagline}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-sans text-xs text-blue-400 font-bold">${component.priceUSD}</span>
                      {isSelected && <Check size={14} className="text-blue-400" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
