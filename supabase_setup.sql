-- ====================================================================
-- SCRIPT DE CONFIGURACIÓN GENERAL PARA SUPABASE (VISION ELITECH)
-- ====================================================================
-- Este script configura la base de datos completa de Supabase, incluyendo:
--   1. Tabla de Productos ('products') con campos WooCommerce completos.
--   2. Tabla de Perfiles de Clientes ('profiles') vinculada a la autenticación.
--   3. Función y Disparador (Trigger) para creación automática de perfiles.
--   4. Configuración sin RLS para máxima accesibilidad inicial de desarrollo.
--   5. Lote de semillas (Seed Data) con el inventario de hardware inicial.
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. TABLA DE PERFILES DE USUARIO (Clientes y Administradores)
-- --------------------------------------------------------------------
-- Almacena información formal y dirección de despacho de cada cliente.
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    city TEXT DEFAULT 'Caracas',
    address TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Desactivar Seguridad a Nivel de Fila (RLS) según requerimiento de desarrollo ("sin RLS")
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------
-- 2. FUNCIÓN Y TRIGGER PARA CREACIÓN AUTOMÁTICA DE PERFIL
-- --------------------------------------------------------------------
-- Cada vez que un usuario se registra vía Supabase Auth, se crea su perfil formal automáticamente.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, phone, city, address, is_admin)
    VALUES (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        coalesce(new.raw_user_meta_data->>'phone', ''),
        coalesce(new.raw_user_meta_data->>'city', 'Caracas'),
        coalesce(new.raw_user_meta_data->>'address', ''),
        CASE 
            WHEN new.email = 'admin@visionelitech.com' OR new.email = 'disenamecorporation@gmail.com' OR new.email = 'visionelitech@gmail.com' THEN TRUE
            ELSE FALSE
        END
    )
    ON CONFLICT (id) DO UPDATE 
    SET 
        email = excluded.email,
        full_name = coalesce(excluded.full_name, profiles.full_name),
        phone = coalesce(excluded.phone, profiles.phone),
        city = coalesce(excluded.city, profiles.city),
        address = coalesce(excluded.address, profiles.address);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Disparador que ejecuta la función al insertar un nuevo usuario en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- --------------------------------------------------------------------
-- 3. TABLA DE PRODUCTOS (WooCommerce Catalog)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tagline TEXT,
    price_usd NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    price_ves NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    category TEXT NOT NULL,
    subcategory TEXT,
    stock TEXT NOT NULL DEFAULT 'DISPONIBLE',
    is_trending BOOLEAN DEFAULT FALSE,
    image TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    highlights JSONB DEFAULT '[]'::jsonb,
    specs JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Desactivar Seguridad a Nivel de Fila (RLS) en la tabla de productos para desarrollo rápido
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------
-- 4. INVENTARIO SEMILLA (Seed Data)
-- --------------------------------------------------------------------
-- Inserta o actualiza el catálogo premium inicial de computadoras, procesadores, periféricos y más.
INSERT INTO public.products (id, name, tagline, price_usd, price_ves, category, subcategory, stock, is_trending, image, images, highlights, specs)
VALUES
(
    'pc-cyber-elite-r9',
    'VISION CYBER ELITE R9',
    'La PC de escritorio definitiva equipada con Ryzen 9 7900X y RTX 4080 Super.',
    3250.00,
    146250.00,
    'pc',
    'Escritorio',
    'DISPONIBLE',
    true,
    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80',
    '["https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80","https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80","https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?auto=format&fit=crop&w=600&q=80"]'::jsonb,
    '["Procesador AMD Ryzen 9 7900X (12 Cores / 24 Threads)","Tarjeta Gráfica NVIDIA GeForce RTX 4080 Super 16GB GDDR6X","Memoria RAM de 64GB DDR5 Fury Beast RGB 6000MHz","Unidad de Estado Sólido 2TB NVMe PCIe Gen4 M.2 SSD","Enfriamiento Líquido Custom Lian Li AIO de 360mm","Fuente de Poder Certificada 1000W 80+ Gold Modular"]'::jsonb,
    '[{"label":"Procesador","val":"Ryzen 9 7900X 5.6GHz"},{"label":"Gráfica","val":"NVIDIA RTX 4080 Super 16GB"},{"label":"RAM","val":"64GB DDR5 RGB"},{"label":"Almacenamiento","val":"2TB NVMe Gen4"},{"label":"Enfriamiento","val":"AIO Líquido 360mm"},{"label":"Fuente","val":"1000W Gold Modular"}]'::jsonb
),
(
    'cpu-ryzen-7-7800x3d',
    'AMD RYZEN 7 7800X3D',
    'El procesador número uno indiscutible para gaming ultra-competitivo con tecnología 3D V-Cache.',
    420.00,
    18900.00,
    'componentes',
    'Procesadores',
    'DISPONIBLE',
    true,
    'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80',
    '["https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80"]'::jsonb,
    '["Arquitectura Zen 4 optimizada para gaming","Tecnología avanzada AMD 3D V-Cache de segunda generación","96MB de Caché L3 para reducción masiva de latencia de fotogramas","Zócalo AM5 con soporte PCIe 5.0 y memorias DDR5 de alta frecuencia","Eficiencia energética excepcional con 120W TDP"]'::jsonb,
    '[{"label":"Núcleos","val":"8 Cores / 16 Threads"},{"label":"Frecuencia Base","val":"4.2 GHz"},{"label":"Frecuencia Boost","val":"5.0 GHz"},{"label":"Caché L3","val":"96MB 3D V-Cache"},{"label":"Socket","val":"AM5"},{"label":"TDP","val":"120W"}]'::jsonb
),
(
    'gpu-rtx-4090-rog',
    'ASUS ROG STRIX RTX 4090 OC',
    'La tarjeta gráfica de consumo más potente del planeta con 24GB GDDR6X.',
    2150.00,
    96750.00,
    'componentes',
    'Tarjetas Gráficas',
    'DISPONIBLE',
    true,
    'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80',
    '["https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80"]'::jsonb,
    '["Multiprocesadores de transmisión NVIDIA Ada Lovelace","Núcleos Tensor de 4.ª generación con escalado inteligente DLSS 3","Núcleos RT de 3.ª generación para Ray Tracing ultra-realista","Diseño de ventiladores Axial-tech con 23% más de flujo de aire","Armadura exterior metálica rígida de grado aeroespacial"]'::jsonb,
    '[{"label":"Chipset","val":"NVIDIA RTX 4090"},{"label":"Memoria","val":"24GB GDDR6X"},{"label":"Interfaz","val":"384-bit"},{"label":"Velocidad Reloj","val":"2640 MHz (OC)"},{"label":"Conectores","val":"1x 16-pin (12VHPWR)"},{"label":"Puertos","val":"3x DP 1.4a, 2x HDMI 2.1a"}]'::jsonb
),
(
    'teclado-apex-pro',
    'STEELSERIES APEX PRO TKL',
    'El teclado mecánico para eSports más rápido del mundo con switches ajustables OmniPoint 2.0.',
    195.00,
    8775.00,
    'perifericos',
    'Teclados',
    'DISPONIBLE',
    false,
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    '["https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80"]'::jsonb,
    '["Switches mecánicos ajustables OmniPoint 2.0 de latencia ultra-baja","Punto de actuación configurable de 0.2mm a 3.8mm","Pantalla inteligente OLED incorporada para ajustes y perfiles en tiempo real","Estructura de aluminio de grado aeronáutico Serie 5000","Reposamuñecas magnético premium con tacto suave"]'::jsonb,
    '[{"label":"Switches","val":"OmniPoint 2.0 Magnéticos"},{"label":"Formato","val":"TKL (80%)"},{"label":"Iluminación","val":"RGB Tecla por Tecla"},{"label":"Actuación","val":"0.2 mm a 3.8 mm"},{"label":"Durabilidad","val":"100 Millones de Pulsaciones"},{"label":"Conectividad","val":"Cable USB-C Desmontable"}]'::jsonb
),
(
    'monitor-oled-g8',
    'SAMSUNG ODYSSEY OLED G8 34"',
    'Monitor curvo ultrawide premium con procesador Neo Quantum y colores OLED insuperables.',
    950.00,
    42750.00,
    'monitor',
    'Pantallas',
    'DISPONIBLE',
    false,
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
    '["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80"]'::jsonb,
    '["Panel QD-OLED de 34 pulgadas con resolución Ultra-WQHD (3440 x 1440)","Frecuencia de actualización de 175Hz y tiempo de respuesta de 0.03ms GtG","Curvatura óptima de 1800R para inmersión cinematográfica","Soporte VESA DisplayHDR True Black 400 para negros absolutos","CoreSync e iluminación trasera Core Lighting+ sincronizada"]'::jsonb,
    '[{"label":"Resolución","val":"Ultra-WQHD (3440 x 1440)"},{"label":"Frecuencia","val":"175 Hz"},{"label":"Tiempo Respuesta","val":"0.03ms (GtG)"},{"label":"Relación Aspecto","val":"21:9 Ultrawide"},{"label":"Puertos","val":"Mini DP, Micro HDMI, USB-C"},{"label":"Brillo Máximo","val":"400 nits"}]'::jsonb
)
ON CONFLICT (id) DO UPDATE
SET
    name = excluded.name,
    tagline = excluded.tagline,
    price_usd = excluded.price_usd,
    price_ves = excluded.price_ves,
    category = excluded.category,
    subcategory = excluded.subcategory,
    stock = excluded.stock,
    is_trending = excluded.is_trending,
    image = excluded.image,
    images = excluded.images,
    highlights = excluded.highlights,
    specs = excluded.specs;

-- --------------------------------------------------------------------
-- ¡CONFIGURACIÓN COMPLETADA CON ÉXITO!
-- --------------------------------------------------------------------
