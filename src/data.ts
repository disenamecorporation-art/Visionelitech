import { CarouselSlide, ProductDetails } from "./types";

// Exchange rate for premium Venezuelan currency formatting (e.g. 39.5 VES per USD)
export const EXCHANGE_RATE_VES = 39.5;

export const PRODUCT_CATEGORIES = {
  "Pc Gamer": ["PC GAMER Intel", "Pc Gamer AMD"],
  "Pc Oficina": ["Pc Oficina Nuevas", "Pc Oficina Refurbished"],
  "Componentes": ["Procesador AMD", "Procesador INTEL", "Motherboards AMD", "Motherboards INTEL", "Memorias RAM Pc", "Memorias RAM Laptops", "Disco de estado Solido", "Disco M.2", "Refrigeración Líquida", "Disipador de torre", "Fuentes de poder", "Tarjetas de vídeo", "Case", "UPS/Regulador", "Bases para laptops", "Brazos para monitores"],
  "Periféricos": ["Teclados", "Mouse", "Audífonos", "Gamepad", "Mousepad", "Micrófonos", "Cornetas", "WebCam"],
  "Monitores": [],
  "Laptops": ["Laptops GAMING", "Laptops de oficina", "Laptops Refurbished"],
  "Mesas GAMING": [],
  "Sillas GAMING": [],
  "Impresoras": []
};

export const PRODUCTS_DATA: ProductDetails[] = [
  // Finished builds / Combos
  {
    id: "definitive-rig-bundle",
    name: "COMBO GAMER TITAN ELITE V1",
    tagline: "El ecosistema definitivo para jugadores competitivos y creadores de contenido premium.",
    category: "pc",
    priceUSD: 4899,
    priceVES: 4899 * EXCHANGE_RATE_VES,
    stock: "BAJO STOCK",
    image: "https://static.cybertron.com/clx/kits/gmset0000002mk/gmset0000002mk_gaming-pc.jpg",
    images: [
      "https://static.cybertron.com/clx/kits/gmset0000002mk/gmset0000002mk_gaming-pc.jpg",
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80"
    ],
    isTrending: true,
    highlights: [
      "Case Gaming Visionelitech RGB con 9 ventiladores de levitación magnética y control ARGB inteligente.",
      "Monitor Curvo Ultrawide de 49 pulgadas OLED con panel de 240Hz y 0.03ms de tiempo de respuesta.",
      "Teclado Mecánico Magnético con interruptores Hall-Effect regulables y retroiluminación por tecla.",
      "Sistema optimizado por IA para cero latencia en juegos multijugador."
    ],
    specs: [
      { name: "Procesador (CPU)", value: "AMD Ryzen 9 9950X @ 5.7GHz", percentage: 98 },
      { name: "Gráfica (GPU)", value: "NVIDIA GeForce RTX 5090 32GB GDDR7", percentage: 100 },
      { name: "Memoria RAM", value: "64GB DDR5 G.Skill Trident Z5 7200MHz", percentage: 95 },
      { name: "Almacenamiento", value: "4TB NVMe SSD PCIe Gen 5 (14,000 MB/s)", percentage: 96 },
      { name: "Enfriamiento", value: "Líquido custom con tubería rígida y RGB", percentage: 94 }
    ]
  },
  {
    id: "ultimate-performance-pc",
    name: "PC GAMER HYPERION RTX 5090",
    tagline: "La cúspide del rendimiento computacional ensamblado para streaming de 8K.",
    category: "pc",
    priceUSD: 3950,
    priceVES: 3950 * EXCHANGE_RATE_VES,
    stock: "DISPONIBLE",
    image: "https://ddtech.mx/assets/uploads/18a9f242b94f4710daed947dee0278d7.jpg",
    images: [
      "https://ddtech.mx/assets/uploads/18a9f242b94f4710daed947dee0278d7.jpg",
      "https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1587202372574-6109941db945?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80"
    ],
    isTrending: true,
    highlights: [
      "Gabinete de cristal panorámico con pantalla interactiva y telemetría de temperatura en vivo.",
      "Configuración dual-SSD con arquitectura PCIe Gen 5 de velocidad extrema.",
      "Overclocking de fábrica certified para estabilidad máxima de 24 horas."
    ],
    specs: [
      { name: "Procesador (CPU)", value: "Intel Core i9-14900K @ 6.0GHz", percentage: 96 },
      { name: "Gráfica (GPU)", value: "NVIDIA GeForce RTX 5090 32GB", percentage: 100 },
      { name: "Memoria RAM", value: "64GB DDR5 Corsair Vengeance 6400MHz", percentage: 94 },
      { name: "Almacenamiento", value: "2TB NVMe PCIe Gen 5 (Ultra-Fast)", percentage: 95 }
    ]
  },
  // Peripherals
  {
    id: "teclado-wooting",
    name: "TECLADO MAGNÉTICO WOOTING 60HE",
    tagline: "La respuesta táctil instantánea gracias a interruptores analógicos de efecto Hall.",
    category: "perifericos",
    priceUSD: 280,
    priceVES: 280 * EXCHANGE_RATE_VES,
    stock: "DISPONIBLE",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-_sBwrnY2ILMCR9NCkhwABA0xchpxZwpEkrKBVOmoHpd4NUCA_BiuSR08&s=10",
    isTrending: true,
    highlights: [
      "Interruptores analógicos Lekker totalmente regulables desde 0.1mm a 4.0mm.",
      "Latencia de entrada de 0.125ms y modo de disparo rápido (Rapid Trigger).",
      "Keycaps de PBT de doble inyección para máxima durabilidad y retroiluminación."
    ],
    specs: [
      { name: "Interruptores", value: "Efecto Hall Magnéticos Lekker", percentage: 98 },
      { name: "Formato", value: "Compacto 60% ultra-portable", percentage: 90 },
      { name: "Polling Rate", value: "1000Hz con latencia de 0.1ms", percentage: 96 }
    ]
  },
  {
    id: "mouse-viper-v3",
    name: "MONITOR CURVO OCELOT C32",
    tagline: "Inmersión absoluta con panel de alta tasa de refresco y colores vibrantes.",
    category: "perifericos",
    priceUSD: 360,
    priceVES: 360 * EXCHANGE_RATE_VES,
    stock: "DISPONIBLE",
    image: "https://ocelot.com.mx/wp-content/uploads/2025/05/FONDO_OSCURO-OM_C32-1.jpg",
    isTrending: true,
    highlights: [
      "Sensor Óptico Focus Pro de 35K de última generación para precisión de píxel.",
      "Polling rate inalámbrico real de 8000Hz para un rastreo fluido sin latencia.",
      "Diseño ultraligero simétrico de 54 gramos optimizado para agarre de garra."
    ],
    specs: [
      { name: "Sensor", value: "Razer Focus Pro 35K Gen-2", percentage: 99 },
      { name: "Peso", value: "54g ultra-liviano", percentage: 95 },
      { name: "Polling Rate", value: "8000Hz HyperPolling Wireless", percentage: 98 }
    ]
  },
  {
    id: "headset-astro-a50",
    name: "AURICULARES ASTRO A50 GEN 4",
    tagline: "Audio espacial envolvente premium y base transmisora inalámbrica inteligente.",
    category: "audio",
    priceUSD: 350,
    priceVES: 350 * EXCHANGE_RATE_VES,
    stock: "DISPONIBLE",
    image: "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&w=600&q=80",
    highlights: [
      "Afinación Astro Audio V2 para agudos nítidos y graves libres de distorsión.",
      "Dolby Audio espacial integrado para posicionamiento acústico tridimensional.",
      "Base de carga magnética inteligente con conectores chapados en oro."
    ],
    specs: [
      { name: "Conectividad", value: "Wireless 2.4GHz libre de interferencia", percentage: 93 },
      { name: "Autonomía", value: "Más de 15 horas continuas por carga", percentage: 89 },
      { name: "Micrófono", value: "Unidireccional de 6.0mm con silenciado flip-up", percentage: 91 }
    ]
  },
  // Sillas
  {
    id: "silla-razer-iskur",
    name: "SILLA ERGONÓMICA RAZER ISKUR V2",
    tagline: "El estándar de oro en soporte lumbar adaptativo para largas jornadas de juego.",
    category: "sillas",
    priceUSD: 650,
    priceVES: 650 * EXCHANGE_RATE_VES,
    stock: "DISPONIBLE",
    image: "https://images.unsplash.com/photo-1598550476439-6847785fce6e?auto=format&fit=crop&w=600&q=80",
    highlights: [
      "Soporte lumbar adaptativo que se ajusta a la curvatura de la columna en vivo.",
      "Reposabrazos 4D ajustables en altura, ángulo y rotación.",
      "Piel sintética multicapa de alta resistencia al desgaste diario."
    ],
    specs: [
      { name: "Soporte Lumbar", value: "Ajuste biomecánico completo", percentage: 97 },
      { name: "Inclinación", value: "Hasta 152 grados con tensión regulable", percentage: 91 },
      { name: "Soporte Peso", value: "Estructura de acero reforzada para 136kg", percentage: 94 }
    ]
  },
  // CPUs (Custom Build)
  {
    id: "cpu-ryzen-7",
    name: "AMD RYZEN 7 7800X3D",
    tagline: "El procesador gaming más rápido del mundo gracias a 3D V-Cache.",
    category: "cpu",
    priceUSD: 450,
    priceVES: 450 * EXCHANGE_RATE_VES,
    stock: "DISPONIBLE",
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80",
    isTrending: false,
    highlights: [
      "96MB de caché L3 3D V-Cache para un rendimiento supremo en juegos exigentes.",
      "Consumo de energía ultra-eficiente optimizado térmicamente.",
      "Zócalo AM5 de última generación compatible con DDR5 y PCIe 5.0."
    ],
    specs: [
      { name: "Núcleos / Hilos", value: "8 Núcleos / 16 Hilos", percentage: 92 },
      { name: "Frecuencia Boost", value: "Hasta 5.0 GHz con overclock dinámico", percentage: 90 },
      { name: "Caché Total", value: "104 MB de caché combinada", percentage: 98 }
    ]
  },
  {
    id: "cpu-intel-i9",
    name: "INTEL CORE i9-14900K",
    tagline: "Fuerza bruta multinúcleo para streaming, renderizado y overclock extremo.",
    category: "cpu",
    priceUSD: 620,
    priceVES: 620 * EXCHANGE_RATE_VES,
    stock: "DISPONIBLE",
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80",
    highlights: [
      "Arquitectura híbrida de 24 núcleos optimizados con Intel Thread Director.",
      "Frecuencia turbo máxima de 6.0 GHz de fábrica sin configuraciones complejas.",
      "Desbloqueado listo para overclocking extremo."
    ],
    specs: [
      { name: "Núcleos / Hilos", value: "24 Núcleos / 32 Hilos", percentage: 96 },
      { name: "Frecuencia Boost", value: "Hasta 6.0 GHz de fábrica", percentage: 97 },
      { name: "Compatibilidad", value: "Zócalos LGA 1700 con DDR4 y DDR5", percentage: 90 }
    ]
  },
  {
    id: "cpu-ryzen-9",
    name: "AMD RYZEN 9 9950X",
    tagline: "El procesador premium de la arquitectura Zen 5 para estaciones de trabajo masivas.",
    category: "cpu",
    priceUSD: 750,
    priceVES: 750 * EXCHANGE_RATE_VES,
    stock: "BAJO STOCK",
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80",
    highlights: [
      "Arquitectura Zen 5 de 4 nanómetros de ultra-rendimiento térmico.",
      "16 núcleos completos de procesamiento nativo sin núcleos de eficiencia.",
      "Ideal para edición de video 8K, desarrollo de software y computación masiva."
    ],
    specs: [
      { name: "Núcleos / Hilos", value: "16 Núcleos / 32 Hilos", percentage: 99 },
      { name: "Frecuencia Boost", value: "Hasta 5.7 GHz ultra-eficiente", percentage: 95 },
      { name: "Litografía", value: "TSMC 4nm FinFET", percentage: 98 }
    ]
  },
  // GPUs (Custom Build)
  {
    id: "gpu-rtx-4070",
    name: "NVIDIA RTX 4070 TI SUPER 16GB",
    tagline: "El equilibrio definitivo entre precio y trazado de rayos a resolución 1440p y 4K.",
    category: "gpu",
    priceUSD: 950,
    priceVES: 950 * EXCHANGE_RATE_VES,
    stock: "DISPONIBLE",
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80",
    highlights: [
      "16GB de memoria GDDR6X ideal para texturas de ultra-alta definición.",
      "Arquitectura Ada Lovelace con DLSS 3 e interpolación de fotogramas por IA.",
      "Enfriamiento de tres ventiladores silenciosos con modo de parada automática."
    ],
    specs: [
      { name: "Memoria de Video", value: "16GB GDDR6X a 256 bits", percentage: 90 },
      { name: "Núcleos CUDA", value: "8,448 núcleos de trazado de rayos", percentage: 89 },
      { name: "TDP Promedio", value: "285W con conectores eficientes", percentage: 92 }
    ]
  },
  {
    id: "gpu-rtx-5090",
    name: "NVIDIA GEFORCE RTX 5090 32GB GDDR7",
    tagline: "El titán gráfico definitivo que define los límites de la física digital y la IA.",
    category: "gpu",
    priceUSD: 2899,
    priceVES: 2899 * EXCHANGE_RATE_VES,
    stock: "PEDIDO PREVIO",
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80",
    isTrending: false,
    highlights: [
      "Arquitectura Blackwell de ultra-vanguardia con memoria GDDR7 hiperveloz.",
      "Trazado de rayos en tiempo real sin pérdida de rendimiento mediante DLSS 4.",
      "32GB de VRAM masiva para Inteligencia Artificial y renderizado profesional."
    ],
    specs: [
      { name: "Ancho de Banda", value: "1,792 GB/s de ancho de banda total", percentage: 100 },
      { name: "Núcleos CUDA", value: "21,760 núcleos de procesamiento masivo", percentage: 100 },
      { name: "Memoria de Video", value: "32GB GDDR7 de última generación", percentage: 100 }
    ]
  },
  // RAM (Custom Build)
  {
    id: "ram-corsair-32",
    name: "32GB DDR5 CORSAIR VENGEANCE 6000MHZ",
    tagline: "Módulos estables de alta velocidad optimizados para plataformas Intel y AMD.",
    category: "ram",
    priceUSD: 150,
    priceVES: 150 * EXCHANGE_RATE_VES,
    stock: "DISPONIBLE",
    image: "https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?auto=format&fit=crop&w=600&q=80",
    highlights: [
      "Soporte de perfiles de overclocking Intel XMP 3.0 y AMD EXPO.",
      "Disipador de aluminio anodizado compacto de perfil bajo.",
      "PCB de rendimiento personalizado para señal limpia y confiable."
    ],
    specs: [
      { name: "Capacidad / Módulos", value: "32GB (2 x 16GB Dual Channel)", percentage: 90 },
      { name: "Frecuencia Base", value: "6000MHz con latencia CL36", percentage: 89 },
      { name: "Voltaje", value: "1.35V ultra-estable", percentage: 92 }
    ]
  },
  {
    id: "ram-gskill-64",
    name: "64GB DDR5 G.SKILL TRIDENT Z5 RGB 7200MHZ",
    tagline: "El récord absoluto de velocidad DDR5 coronado con iluminación ARGB translúcida.",
    category: "ram",
    priceUSD: 280,
    priceVES: 280 * EXCHANGE_RATE_VES,
    stock: "BAJO STOCK",
    image: "https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?auto=format&fit=crop&w=600&q=80",
    highlights: [
      "Frecuencias extremas de hasta 7200MHz con chips de memoria seleccionados.",
      "Barra de luz integrada personalizable con todos los softwares de placas madre.",
      "Disipador icónico galardonado de aluminio cepillado de precisión."
    ],
    specs: [
      { name: "Capacidad / Módulos", value: "64GB (2 x 32GB Dual Channel)", percentage: 98 },
      { name: "Frecuencia Base", value: "7200MHz con latencia CL34", percentage: 98 },
      { name: "Iluminación", value: "RGB Direccionable (ARGB) completo", percentage: 95 }
    ]
  },
  // Storage (Custom Build)
  {
    id: "ssd-samsung-2tb",
    name: "SSD 2TB SAMSUNG 990 PRO NVME",
    tagline: "La velocidad de lectura secuencial PCIe Gen 4 líder de la industria tecnológica.",
    category: "storage",
    priceUSD: 180,
    priceVES: 180 * EXCHANGE_RATE_VES,
    stock: "DISPONIBLE",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80",
    highlights: [
      "Lecturas secuenciales de hasta 7450 MB/s y escrituras de hasta 6900 MB/s.",
      "Eficiencia energética optimizada de hasta 50% por vatio en comparación al 980 Pro.",
      "Control de temperatura inteligente con revestimiento de níquel."
    ],
    specs: [
      { name: "Velocidad Lectura", value: "7,450 MB/s secuencial real", percentage: 94 },
      { name: "Capacidad", value: "2TB de memoria NAND flash V-NAND", percentage: 90 },
      { name: "Factor de Forma", value: "M.2 (2280) de alta densidad", percentage: 96 }
    ]
  },
  {
    id: "ssd-crucial-4tb",
    name: "SSD 4TB CRUCIAL T700 NVME GEN5",
    tagline: "La revolución de la arquitectura PCIe Gen 5 con velocidades que superan los 12 GB/s.",
    category: "storage",
    priceUSD: 350,
    priceVES: 350 * EXCHANGE_RATE_VES,
    stock: "DISPONIBLE",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80",
    highlights: [
      "Velocidades astronómicas de hasta 12,400 MB/s de lectura y 11,800 MB/s de escritura.",
      "Compatible con Microsoft DirectStorage para cargas de mapas en microsegundos.",
      "Disipador pasivo masivo de aluminio negro de grado aeroespacial."
    ],
    specs: [
      { name: "Velocidad Lectura", value: "12,400 MB/s secuencial Gen5", percentage: 100 },
      { name: "Capacidad", value: "4TB masiva de almacenamiento sólido", percentage: 99 },
      { name: "Bus de Conexión", value: "PCIe Gen 5 x4 NVMe 2.0", percentage: 100 }
    ]
  },
  // Motherboards (Custom Build)
  {
    id: "mobo-asus-z790",
    name: "ASUS ROG MAXIMUS Z790 HERO",
    tagline: "El lienzo definitivo para ensambles Intel con robusta entrega de energía.",
    category: "motherboard",
    priceUSD: 650,
    priceVES: 650 * EXCHANGE_RATE_VES,
    stock: "DISPONIBLE",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    highlights: [
      "20+1 fases de poder de 90A listas para procesadores Intel Core i9 de 14va Gen.",
      "Wi-Fi 7 de última generación y puertos Thunderbolt 4 tipo C duales.",
      "Iluminación Polymo en la cubierta de I/O que muestra animaciones RGB custom."
    ],
    specs: [
      { name: "Zócalo / Chipset", value: "LGA 1700 / Intel Z790 Premium", percentage: 96 },
      { name: "Ranuras de Memoria", value: "4 x DDR5 (Soporta hasta 192GB)", percentage: 95 },
      { name: "Puertos M.2", value: "5 x Ranuras M.2 (1 PCIe 5.0 compatible)", percentage: 94 }
    ]
  },
  {
    id: "mobo-msi-b650",
    name: "MSI MAG B650 TOMAHAWK WI-FI",
    tagline: "La opción de alto rendimiento con balance impecable de fases para AMD AM5.",
    category: "motherboard",
    priceUSD: 220,
    priceVES: 220 * EXCHANGE_RATE_VES,
    stock: "DISPONIBLE",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    highlights: [
      "Diseño de energía dueto de 14+2+1 fases con disipadores de calor ampliados.",
      "Solución de red de alta velocidad de 2.5G LAN y módulo Wi-Fi 6E.",
      "Soporte nativo para velocidades PCIe 4.0 en tarjetas gráficas e interfaz SSD."
    ],
    specs: [
      { name: "Zócalo / Chipset", value: "AM5 / AMD B650 Balanced", percentage: 89 },
      { name: "Velocidad Memoria", value: "Soporta DDR5 hasta 7600+ MHz (OC)", percentage: 91 },
      { name: "Fases VRM", value: "14+2+1 Duet Rail de energía limpia", percentage: 90 }
    ]
  },
  // PSUs (Custom Build)
  {
    id: "psu-corsair-1000",
    name: "CORSAIR RM1000X 1000W 80+ GOLD",
    tagline: "Alimentación silenciosa, eficiente y totalmente modular con garantía militar.",
    category: "psu",
    priceUSD: 190,
    priceVES: 190 * EXCHANGE_RATE_VES,
    stock: "DISPONIBLE",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80",
    highlights: [
      "Certificación de eficiencia 80 PLUS Gold garantizando menor consumo residual.",
      "Cableado plano 100% modular para facilitar la gestión interna en tu chasis.",
      "Ventilador de levitación magnética de 135mm silencioso bajo baja carga."
    ],
    specs: [
      { name: "Potencia Total", value: "1000 Watts continuos reales", percentage: 93 },
      { name: "Certificación", value: "80 PLUS Gold e Cybenetics Gold", percentage: 94 },
      { name: "Garantía", value: "10 años de respaldo de fábrica", percentage: 99 }
    ]
  },
  {
    id: "psu-asus-1200",
    name: "ASUS ROG THOR 1200W PLATINUM II",
    tagline: "La fuente de poder definitiva con pantalla OLED y disipación térmica de nivel ROG.",
    category: "psu",
    priceUSD: 380,
    priceVES: 380 * EXCHANGE_RATE_VES,
    stock: "BAJO STOCK",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80",
    highlights: [
      "Pantalla OLED integrada para telemetría de consumo de vatios en vivo.",
      "Certificación Lambda A++ confirmando un funcionamiento extremadamente silencioso.",
      "Iluminación ARGB direccionable compatible con ASUS Aura Sync."
    ],
    specs: [
      { name: "Potencia Total", value: "1200 Watts continuos de grado militar", percentage: 99 },
      { name: "Certificación", value: "80 PLUS Platinum con eficiencia de 92%", percentage: 98 },
      { name: "Pantalla Integrada", value: "Panel OLED monocromático de vataje", percentage: 95 }
    ]
  },
  // Cases (Custom Build)
  {
    id: "case-lianli",
    name: "LIAN LI O11 DYNAMIC EVO",
    tagline: "El chasis de cristal templado modular icónico favorito de la comunidad gamer.",
    category: "case",
    priceUSD: 200,
    priceVES: 200 * EXCHANGE_RATE_VES,
    stock: "DISPONIBLE",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80",
    highlights: [
      "Paneles de cristal templado frontales y laterales de visibilidad continua.",
      "Modo invertible que permite cambiar la orientación del ensamble a la izquierda.",
      "Soporte excepcional para radiadores triples de 360mm de refrigeración líquida."
    ],
    specs: [
      { name: "Tipo de Chasis", value: "Mid Tower Modular de doble cámara", percentage: 94 },
      { name: "Materiales", value: "Aluminio de 4mm, acero y cristal templado", percentage: 95 },
      { name: "Soporte Fan", value: "Soporta hasta 10 ventiladores de 120mm", percentage: 96 }
    ]
  },
  {
    id: "case-hyte",
    name: "HYTE Y70 TOUCH BLACK",
    tagline: "La evolución de la visibilidad panorámica con pantalla táctil interactiva 4K.",
    category: "case",
    priceUSD: 360,
    priceVES: 360 * EXCHANGE_RATE_VES,
    stock: "BAJO STOCK",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80",
    highlights: [
      "Pantalla LCD IPS táctil integrada de 14.1 pulgadas con resolución 4K y 60Hz.",
      "Diseño panorámico de tres piezas de vidrio sin pilares obstruyendo la visual.",
      "Montaje vertical nativo de tarjeta gráfica de 4 ranuras con cable riser PCIe 4.0."
    ],
    specs: [
      { name: "Pantalla Integrada", value: "14.1\" Multi-touch IPS (4K a 60Hz)", percentage: 100 },
      { name: "Soporte GPU", value: "Hasta 4 ranuras completas en vertical", percentage: 98 },
      { name: "Refrigeración", value: "Soporta radiador de 360mm lateral y superior", percentage: 96 }
    ]
  },
  // Monitors (Custom Build)
  {
    id: "monitor-asus-oled",
    name: "MONITOR ASUS ROG SWIFT 32\" OLED",
    tagline: "La experiencia de color definitiva en un panel OLED brillante de 240Hz.",
    category: "monitor",
    priceUSD: 1200,
    priceVES: 1200 * EXCHANGE_RATE_VES,
    stock: "BAJO STOCK",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80",
    highlights: [
      "Panel QD-OLED de tercera generación con brillo pico de 1000 nits y HDR.",
      "Tiempo de respuesta instantáneo de 0.03ms libre de desenfoque de movimiento.",
      "Disipador de calor pasivo personalizado de grafeno para mitigar el desgaste."
    ],
    specs: [
      { name: "Resolución / Hz", value: "4K UHD (3840 x 2160) @ 240Hz", percentage: 100 },
      { name: "Tiempo Respuesta", value: "0.03 ms Gris a Gris instantáneo", percentage: 100 },
      { name: "Contraste", value: "1,500,000:1 real OLED negro absoluto", percentage: 100 }
    ]
  }
];

export const CAROUSEL_SLIDES: (imageUrls: { slide1: string; slide2: string }) => CarouselSlide[] = (
  imageUrls
) => [
  {
    id: 1,
    title: "EXPERIENCIA GAMER DEFINITIVA",
    subtitle: "POTENCIA SIN LÍMITES",
    buttonText: "VER PRODUCTOS",
    image: imageUrls.slide1,
    themeColor: "cyan",
    accentClass: "border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.15)]",
    textGlowClass: "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]",
    detailsId: "definitive-rig-bundle"
  },
  {
    id: 2,
    title: "MÁXIMO RENDIMIENTO",
    subtitle: "ARMADOS PERSONALIZADOS",
    buttonText: "EXPLORAR EQUIPO",
    image: imageUrls.slide2,
    themeColor: "yellow",
    accentClass: "border-yellow-500/30 hover:border-yellow-400/60 shadow-[0_0_20px_rgba(234,179,8,0.15)]",
    textGlowClass: "text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]",
    detailsId: "comfort-sound-bundle"
  }
];
