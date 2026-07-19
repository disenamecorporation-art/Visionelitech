import React, { useState } from "react";
import { Check, ShoppingCart, Plus, Minimize2, Image } from "lucide-react";
import { ProductDetails } from "../types";
import { PRODUCTS_DATA } from "../data";
import { cyberSound } from "./CyberSound";

interface RigBuilderProps {
  onAddToCart: (product: ProductDetails) => void;
  products?: ProductDetails[];
}

export default function RigBuilder({ onAddToCart, products = PRODUCTS_DATA }: RigBuilderProps) {
  // Components Data
  const cpus = products.filter((p) => p.category.toLowerCase() === "cpu" || p.category.toLowerCase() === "componentes" && p.subcategory?.toLowerCase().includes("procesador"));
  const gpus = products.filter((p) => p.category.toLowerCase() === "gpu" || p.category.toLowerCase() === "componentes" && p.subcategory?.toLowerCase().includes("tarjeta"));
  const rams = products.filter((p) => p.category.toLowerCase() === "ram" || p.category.toLowerCase() === "componentes" && p.subcategory?.toLowerCase().includes("memoria"));
  const storages = products.filter((p) => p.category.toLowerCase() === "storage" || p.category.toLowerCase() === "componentes" && p.subcategory?.toLowerCase().includes("disco"));
  const motherboards = products.filter((p) => p.category.toLowerCase() === "motherboard" || p.category.toLowerCase() === "componentes" && p.subcategory?.toLowerCase().includes("motherboard"));
  const psus = products.filter((p) => p.category.toLowerCase() === "psu" || p.category.toLowerCase() === "componentes" && p.subcategory?.toLowerCase().includes("fuente"));
  const cases = products.filter((p) => p.category.toLowerCase() === "case" || p.category.toLowerCase() === "componentes" && p.subcategory?.toLowerCase().includes("case"));
  const monitors = products.filter((p) => p.category.toLowerCase() === "monitor" || p.category.toLowerCase() === "monitores");

  // Selected Components State
  const [selectedCpu, setSelectedCpu] = useState<ProductDetails>(cpus[0] || products[0]);
  const [selectedGpu, setSelectedGpu] = useState<ProductDetails>(gpus[0] || products[0]);
  const [selectedRam, setSelectedRam] = useState<ProductDetails>(rams[0] || products[0]);
  const [selectedStorage, setSelectedStorage] = useState<ProductDetails>(storages[0] || products[0]);
  const [selectedMotherboard, setSelectedMotherboard] = useState<ProductDetails>(motherboards[0] || products[0]);
  const [selectedPsu, setSelectedPsu] = useState<ProductDetails>(psus[0] || products[0]);
  const [selectedCase, setSelectedCase] = useState<ProductDetails>(cases[0] || products[0]);
  const [selectedMonitor, setSelectedMonitor] = useState<ProductDetails | null>(null);

  // Active Category modal selector state
  const [activeSelectorCategory, setActiveSelectorCategory] = useState<string | null>(null);

  // Calculate Running Total in USD
  const totalUSD =
    selectedCpu.priceUSD +
    selectedGpu.priceUSD +
    selectedRam.priceUSD +
    selectedStorage.priceUSD +
    selectedMotherboard.priceUSD +
    selectedPsu.priceUSD +
    selectedCase.priceUSD +
    (selectedMonitor ? selectedMonitor.priceUSD : 0);

  const handleBuildAddToCart = () => {
    cyberSound.playClick();

    const customPcProduct: ProductDetails = {
      id: `custom-pc-${Date.now()}`,
      name: "PC ARMADA PERSONALIZADA ELITE",
      tagline: `Configuración Custom: Intel/AMD de Ultra-Gama + Gráfica de Última Generación`,
      category: "pc",
      priceUSD: totalUSD,
      priceVES: 0,
      stock: "DISPONIBLE",
      image: selectedCase.image || "https://static.cybertron.com/clx/kits/gmset0000002mk/gmset0000002mk_gaming-pc.jpg",
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

  // Render a clean component selection slot
  const renderComponentRow = (label: string, component: ProductDetails, categoryKey: string) => {
    return (
      <div className="flex items-center justify-between p-3.5 bg-black/45 border border-white/5 hover:border-blue-500/20 rounded-2xl transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 p-1 flex items-center justify-center border border-white/10 overflow-hidden shrink-0">
            <img src={component.image} alt={component.name} className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-sans text-[10px] text-white/40 tracking-wider uppercase">{label}</span>
            <span className="font-sans text-xs text-white/90 font-medium tracking-tight uppercase line-clamp-1">{component.name}</span>
          </div>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <span className="font-sans text-xs text-blue-400 font-bold">${component.priceUSD.toLocaleString()}</span>
          <button
            onClick={() => {
              cyberSound.playClick();
              setActiveSelectorCategory(categoryKey);
            }}
            className="px-3.5 py-1.5 bg-white/5 hover:bg-blue-500 hover:text-black border border-white/5 hover:border-blue-500 rounded-full font-sans text-[10px] font-bold text-white transition-all duration-300 cursor-pointer"
          >
            CAMBIAR
          </button>
        </div>
      </div>
    );
  };

  // List of currently selected visual items for composition
  const visualItems = [
    { name: "Chasis", img: selectedCase.image, cat: "Case" },
    { name: "Gráfica", img: selectedGpu.image, cat: "GPU" },
    { name: "CPU", img: selectedCpu.image, cat: "CPU" },
    { name: "RAM", img: selectedRam.image, cat: "RAM" },
    { name: "Tarjeta Madre", img: selectedMotherboard.image, cat: "Motherboard" },
    { name: "Fuente", img: selectedPsu.image, cat: "PSU" },
    { name: "SSD", img: selectedStorage.image, cat: "SSD" },
    ...(selectedMonitor ? [{ name: "Monitor", img: selectedMonitor.image, cat: "Monitor" }] : [])
  ];

  return (
    <section 
      className="w-full max-w-[1290px] mx-auto px-4 md:px-0 pt-28 pb-16 relative"
      id="rig-builder-section"
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* Header with spacious top margin to prevent navbar collisions */}
      <div className="flex flex-col items-center mb-12 text-center">
        <h3 className="font-sans font-light text-2xl md:text-3xl text-white tracking-[0.15em] uppercase">
          DISEÑA TU <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">PROPIA PC GAMER</span>
        </h3>
        <p className="font-sans font-light text-xs text-white/50 max-w-md mt-2 leading-relaxed">
          Selecciona componentes elite de la tienda para calcular tu presupuesto y previsualizar tu ensamble personalizado.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: PC Builder Interface - Clean & Minimalist */}
        <div 
          className="lg:col-span-7 rounded-3xl border border-white/10 bg-[#07070a]/60 backdrop-blur-md p-6 md:p-8 relative"
          id="pc-builder-components-panel"
        >
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
            <span className="font-sans font-light text-xs text-white tracking-widest uppercase">
              AGREGAR COMPONENTES
            </span>
          </div>

          {/* Selector Rows */}
          <div className="space-y-3">
            {renderComponentRow("Procesador / CPU", selectedCpu, "cpu")}
            {renderComponentRow("Tarjeta Gráfica / GPU", selectedGpu, "gpu")}
            {renderComponentRow("Memoria RAM", selectedRam, "ram")}
            {renderComponentRow("Almacenamiento SSD", selectedStorage, "storage")}
            {renderComponentRow("Tarjeta Madre", selectedMotherboard, "motherboard")}
            {renderComponentRow("Fuente de Poder (PSU)", selectedPsu, "psu")}
            {renderComponentRow("Gabinete / Case", selectedCase, "case")}

            {/* Optional Monitor Row */}
            <div className="flex items-center justify-between p-3.5 bg-black/45 border border-white/5 hover:border-blue-500/20 rounded-2xl transition-all duration-300">
              <div className="flex items-center space-x-3 min-w-0">
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
                  className="w-4 h-4 rounded border-white/15 bg-black text-blue-500 accent-blue-500 focus:ring-0 cursor-pointer shrink-0"
                />
                <div className="flex items-center gap-3 min-w-0">
                  {selectedMonitor && (
                    <div className="w-10 h-10 rounded-xl bg-white/5 p-1 flex items-center justify-center border border-white/10 overflow-hidden shrink-0">
                      <img src={selectedMonitor.image} alt={selectedMonitor.name} className="w-full h-full object-contain" />
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="font-sans text-[10px] text-white/40 tracking-wider uppercase">Monitor Adicional (Opcional)</span>
                    <span className="font-sans text-xs text-white/90 font-medium tracking-tight uppercase line-clamp-1">
                      {selectedMonitor ? selectedMonitor.name : "Ninguno seleccionado"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3 shrink-0">
                {selectedMonitor && (
                  <>
                    <span className="font-sans text-xs text-blue-400 font-bold">${selectedMonitor.priceUSD.toLocaleString()}</span>
                    <button
                      onClick={() => {
                        cyberSound.playClick();
                        setActiveSelectorCategory("monitor");
                      }}
                      className="px-3.5 py-1.5 bg-white/5 hover:bg-blue-500 hover:text-black border border-white/5 hover:border-blue-500 rounded-full font-sans text-[10px] font-bold text-white transition-all duration-300 cursor-pointer"
                    >
                      CAMBIAR
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Running Budget Bar in USD ONLY */}
          <div className="mt-8 p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex flex-col sm:flex-row justify-between items-center gap-5">
            <div>
              <span className="text-[10px] text-blue-400 font-medium tracking-widest block uppercase mb-1">Presupuesto Estimado</span>
              <div className="flex items-baseline space-x-2">
                <span className="font-sans font-bold text-2xl text-white">${totalUSD.toLocaleString()}</span>
                <span className="text-xs text-white/40 font-bold font-mono">USD</span>
              </div>
            </div>

            <button
              onClick={handleBuildAddToCart}
              onMouseEnter={() => cyberSound.playHover()}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-400 text-black font-sans text-xs font-bold tracking-wider transition-all duration-300 cursor-pointer shadow-lg"
            >
              <ShoppingCart size={13} />
              <span>AÑADIR ENSAMBLE AL CARRITO</span>
            </button>
          </div>
        </div>

        {/* Right Side: Component Visual Layout with beautiful PNG grids */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          <div 
            className="w-full rounded-3xl border border-white/10 bg-[#07070a]/40 p-6 md:p-8 relative overflow-hidden"
            id="components-image-collage"
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="font-sans font-light text-xs text-white/70 tracking-widest uppercase">
                TU SETUP EN FOTOS
              </span>
              <span className="font-mono text-[9px] text-blue-400 tracking-widest">
                {visualItems.length} ELEMENTOS
              </span>
            </div>

            {/* Beautiful visual layout of selected products' images */}
            <div className="grid grid-cols-2 gap-4">
              {visualItems.map((item, idx) => (
                <div 
                  key={idx}
                  className="group relative flex flex-col items-center justify-center p-4 rounded-2xl border border-white/5 bg-black/60 hover:border-blue-500/25 transition-all duration-300 overflow-hidden aspect-square text-center"
                >
                  {/* Subtle radial light background */}
                  <div className="absolute inset-0 bg-radial from-blue-500/5 to-transparent opacity-50 pointer-events-none" />
                  
                  <img 
                    src={item.img} 
                    alt={item.name} 
                    className="w-24 h-24 object-contain drop-shadow-[0_4px_12px_rgba(0,240,255,0.15)] group-hover:scale-105 transition-transform duration-300 relative z-10"
                  />
                  
                  <div className="mt-3 relative z-10">
                    <span className="text-[9px] text-blue-400 font-medium tracking-widest uppercase block mb-0.5">
                      {item.cat}
                    </span>
                    <span className="text-[11px] text-white/80 font-bold tracking-tight line-clamp-1 uppercase">
                      {item.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL / SELECTION INLINE PANEL */}
      {activeSelectorCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#07070c] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <span className="font-sans font-light text-sm text-white tracking-widest uppercase">
                Seleccionar {
                  activeSelectorCategory === "cpu" ? "Procesador (CPU)" :
                  activeSelectorCategory === "gpu" ? "Tarjeta Gráfica (GPU)" :
                  activeSelectorCategory === "ram" ? "Memoria RAM" :
                  activeSelectorCategory === "storage" ? "Almacenamiento SSD" :
                  activeSelectorCategory === "motherboard" ? "Tarjeta Madre" :
                  activeSelectorCategory === "psu" ? "Fuente de Poder" :
                  activeSelectorCategory === "case" ? "Chasis / Case" : "Monitor Premium"
                }
              </span>
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
                    <div className="flex items-center gap-4 max-w-[80%]">
                      <div className="w-12 h-12 rounded-xl bg-white/5 p-1 flex items-center justify-center border border-white/5 overflow-hidden shrink-0">
                        <img src={component.image} alt={component.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-sans text-xs font-bold block uppercase tracking-tight text-white/90">{component.name}</span>
                        <span className="font-sans text-[10px] text-white/50 block leading-tight">{component.tagline}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 shrink-0">
                      <span className="font-sans text-xs text-blue-400 font-bold">${component.priceUSD.toLocaleString()}</span>
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
