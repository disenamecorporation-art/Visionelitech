import React, { useState, useMemo } from 'react';
import { PRODUCT_CATEGORIES } from '../data';
import { ProductDetails, ProductSpec } from '../types';
import { Trash2, Plus, Edit3, Save, Search, RefreshCw, Layers, DollarSign, Image as ImageIcon, Eye, Package } from 'lucide-react';
import { cyberSound } from './CyberSound';

interface AdminPanelProps {
  products: ProductDetails[];
  onUpdateProducts: (newProducts: ProductDetails[]) => void;
}

export default function AdminPanel({ products, onUpdateProducts }: AdminPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [priceUSD, setPriceUSD] = useState<number>(0);
  const [category, setCategory] = useState<string>(Object.keys(PRODUCT_CATEGORIES)[0]);
  const [subcategory, setSubcategory] = useState<string>('');
  const [stock, setStock] = useState<'DISPONIBLE' | 'BAJO STOCK' | 'PEDIDO PREVIO'>('DISPONIBLE');
  const [isTrending, setIsTrending] = useState(false);
  const [highlightsInput, setHighlightsInput] = useState(''); // Separated by lines
  
  // 4 Image URLs
  const [imgUrl1, setImgUrl1] = useState('');
  const [imgUrl2, setImgUrl2] = useState('');
  const [imgUrl3, setImgUrl3] = useState('');
  const [imgUrl4, setImgUrl4] = useState('');

  // Filtered list of products for the admin panel sidebar
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const categories = Object.keys(PRODUCT_CATEGORIES);
  const subcategories = (PRODUCT_CATEGORIES as any)[category] || [];

  // Load a product into the form for editing
  const handleSelectProduct = (product: ProductDetails) => {
    cyberSound.playClick();
    setSelectedProductId(product.id);
    setName(product.name);
    setTagline(product.tagline || '');
    setPriceUSD(product.priceUSD);
    setCategory(product.category);
    setSubcategory(product.subcategory || '');
    setStock(product.stock || 'DISPONIBLE');
    setIsTrending(!!product.isTrending);
    setHighlightsInput((product.highlights || []).join('\n'));

    // Populate images
    const extraImages = product.images || [];
    setImgUrl1(product.image || extraImages[0] || '');
    setImgUrl2(extraImages[1] || '');
    setImgUrl3(extraImages[2] || '');
    setImgUrl4(extraImages[3] || '');

    setErrorMessage('');
    setSuccessMessage('');
  };

  // Reset form to create a new product
  const handleNewProductClick = () => {
    cyberSound.playClick();
    setSelectedProductId(null);
    setName('');
    setTagline('');
    setPriceUSD(0);
    setCategory(categories[0]);
    setSubcategory('');
    setStock('DISPONIBLE');
    setIsTrending(false);
    setHighlightsInput('');
    setImgUrl1('');
    setImgUrl2('');
    setImgUrl3('');
    setImgUrl4('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Delete a product
  const handleDeleteProduct = (productId: string) => {
    cyberSound.playClick();

    const updated = products.filter(p => p.id !== productId);
    onUpdateProducts(updated);
    
    if (selectedProductId === productId) {
      handleNewProductClick();
    }
    setDeletingProductId(null);
    setSuccessMessage('¡Producto eliminado exitosamente!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Save changes (Create or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    cyberSound.playClick();

    if (!name.trim()) {
      setErrorMessage('El nombre del producto es obligatorio.');
      return;
    }
    if (priceUSD <= 0) {
      setErrorMessage('El precio en USD debe ser un número positivo.');
      return;
    }

    const highlights = highlightsInput
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    // Collect up to 4 images
    const imagesList = [imgUrl1, imgUrl2, imgUrl3, imgUrl4].map(url => url.trim()).filter(url => url.length > 0);
    const mainImage = imagesList[0] || 'https://via.placeholder.com/500?text=Sin+Imagen';

    // Auto-calculate VES price
    const calculatedVES = Math.round(priceUSD * 39.5 * 100) / 100;

    // Create custom spec sheet to keep the performance visuals looking phenomenal
    const defaultSpecs: ProductSpec[] = [
      { name: "Rendimiento Gaming", value: isTrending ? "Premium Ultra" : "Óptimo", percentage: isTrending ? 95 : 80 },
      { name: "Estabilidad de Voltaje", value: "Excelente", percentage: 90 },
      { name: "Eficiencia Térmica", value: "Baja Temperatura", percentage: 85 }
    ];

    if (selectedProductId) {
      // Edit mode
      const updated = products.map(p => {
        if (p.id === selectedProductId) {
          return {
            ...p,
            name: name.trim(),
            tagline: tagline.trim(),
            priceUSD,
            priceVES: calculatedVES,
            category,
            subcategory: subcategory || undefined,
            stock,
            isTrending,
            highlights,
            image: mainImage,
            images: imagesList.length > 0 ? imagesList : undefined,
            specs: p.specs && p.specs.length > 0 ? p.specs : defaultSpecs
          };
        }
        return p;
      });
      onUpdateProducts(updated);
      setSuccessMessage('¡Producto actualizado exitosamente!');
    } else {
      // Create mode
      const newId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
      const newProduct: ProductDetails = {
        id: newId,
        name: name.trim(),
        tagline: tagline.trim(),
        priceUSD,
        priceVES: calculatedVES,
        category,
        subcategory: subcategory || undefined,
        stock,
        isTrending,
        highlights,
        image: mainImage,
        images: imagesList,
        specs: defaultSpecs
      };
      
      onUpdateProducts([newProduct, ...products]);
      setSelectedProductId(newId);
      setSuccessMessage('¡Nuevo producto creado exitosamente!');
    }

    setTimeout(() => setSuccessMessage(''), 4000);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 md:px-8 w-full max-w-7xl mx-auto text-white font-sans animate-in fade-in duration-500">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono font-bold tracking-[0.3em] text-blue-400 uppercase">Panel de Control</span>
          <h2 className="text-3xl font-extrabold tracking-tight mt-1">ADMINISTRACIÓN DE HARDWARE</h2>
          <p className="text-white/40 text-xs mt-1">Añade, edita, categoriza y elimina productos del catálogo VisionEliteTech.</p>
        </div>
        <button 
          onClick={handleNewProductClick}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-bold text-xs tracking-wider uppercase shadow-lg shadow-blue-500/10 transition-all duration-300"
        >
          <Plus size={14} />
          Nuevo Producto
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Search and Product List */}
        <div className="lg:col-span-5 flex flex-col h-[70vh] lg:h-[80vh] bg-zinc-950/60 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
          <div className="p-4 border-b border-white/10 space-y-3 bg-white/5">
            <span className="text-[10px] text-blue-400 font-bold tracking-wider uppercase block">Inventario Local ({products.length} Items)</span>
            <div className="relative">
              <Search className="absolute left-3 top-3 text-white/30" size={14} />
              <input 
                type="text" 
                placeholder="Buscar por nombre o categoría..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs placeholder:text-white/30 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* List Box */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/5 p-2 space-y-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-white/30 text-xs font-mono">
                No se encontraron productos en el inventario.
              </div>
            ) : (
              filteredProducts.map(p => {
                const isSelected = p.id === selectedProductId;
                return (
                  <div 
                    key={p.id}
                    onClick={() => handleSelectProduct(p)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 cursor-pointer group ${
                      isSelected 
                        ? 'bg-blue-600/10 border-blue-500/40' 
                        : 'bg-transparent border-transparent hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {p.image ? (
                        <img 
                          src={p.image} 
                          alt={p.name} 
                          className="w-10 h-10 rounded-lg object-cover bg-black/40 border border-white/10 flex-shrink-0" 
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/30 border border-white/10 flex-shrink-0">
                          <Package size={16} />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate group-hover:text-blue-300 transition-colors">{p.name}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[9px] font-semibold text-white/50 bg-white/5 px-1.5 py-0.5 rounded uppercase">
                            {p.category}
                          </span>
                          {p.subcategory && (
                            <span className="text-[9px] font-semibold text-purple-400 bg-purple-500/5 px-1.5 py-0.5 rounded uppercase truncate">
                              {p.subcategory}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pl-2 flex-shrink-0">
                      {deletingProductId === p.id ? (
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProduct(p.id);
                            }}
                            className="px-2 py-1 text-[10px] bg-red-600 hover:bg-red-500 text-white font-bold rounded-md transition-all uppercase tracking-wide"
                            title="Confirmar eliminación"
                          >
                            Eliminar
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              cyberSound.playClick();
                              setDeletingProductId(null);
                            }}
                            className="px-2 py-1 text-[10px] bg-zinc-800 hover:bg-zinc-700 text-white/70 rounded-md transition-all"
                            title="Cancelar"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="text-xs font-mono font-bold text-green-400">${p.priceUSD}</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              cyberSound.playClick();
                              setDeletingProductId(p.id);
                            }}
                            className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Eliminar producto"
                          >
                            <Trash2 size={13} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Edit Form / Details */}
        <div className="lg:col-span-7 bg-zinc-950/60 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl relative">
          
          {/* Form header */}
          <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              {selectedProductId ? (
                <>
                  <Edit3 size={16} className="text-blue-400" />
                  <span className="text-sm font-bold uppercase tracking-wider text-blue-400">Modificando Producto</span>
                </>
              ) : (
                <>
                  <Plus size={16} className="text-emerald-400" />
                  <span className="text-sm font-bold uppercase tracking-wider text-emerald-400">Creando Nuevo Hardware</span>
                </>
              )}
            </div>
            {selectedProductId && (
              <span className="text-[10px] font-mono text-white/30">ID: {selectedProductId}</span>
            )}
          </div>

          {/* Feedback states */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-xs flex items-center gap-2 animate-in slide-in-from-top-1">
              <Package size={14} />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-center gap-2 animate-in slide-in-from-top-1">
              <Trash2 size={14} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSaveProduct} className="space-y-5">
            
            {/* Row 1: Name and Tagline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">Nombre del Producto *</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ej. CPU AMD Ryzen 7 7800X3D"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">Slogan / Tagline Corto</label>
                <input 
                  type="text" 
                  value={tagline}
                  onChange={e => setTagline(e.target.value)}
                  placeholder="Ej. El mejor procesador para Gaming del mundo"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Row 2: Price and Stock */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">Precio (USD) *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-3 text-white/30" size={13} />
                  <input 
                    type="number" 
                    required
                    value={priceUSD || ''}
                    onChange={e => setPriceUSD(Number(e.target.value))}
                    placeholder="Ej. 450"
                    className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:ring-1 focus:ring-blue-500 outline-none transition-all font-mono"
                  />
                </div>
                <span className="text-[10px] text-white/30 block">
                  Conversión aprox. VES: <strong className="text-white/60 font-mono">Bs. {Math.round(priceUSD * 39.5 * 100) / 100}</strong>
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">Estatus de Stock</label>
                <select 
                  value={stock}
                  onChange={e => setStock(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-xs text-white focus:ring-1 focus:ring-blue-500 outline-none"
                >
                  <option value="DISPONIBLE">🟢 DISPONIBLE</option>
                  <option value="BAJO STOCK">🟡 BAJO STOCK</option>
                  <option value="PEDIDO PREVIO">🔵 PEDIDO PREVIO</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">Ajustes Especiales</label>
                <div className="flex items-center h-10 px-4 bg-white/5 border border-white/10 rounded-xl">
                  <input 
                    type="checkbox" 
                    id="isTrending"
                    checked={isTrending}
                    onChange={e => setIsTrending(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 bg-black/40 border-white/10 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <label htmlFor="isTrending" className="text-xs font-bold text-white/70 ml-2.5 cursor-pointer select-none">
                    ⭐ En Tendencia
                  </label>
                </div>
              </div>
            </div>

            {/* Row 3: Category and Subcategory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">Categoría Principal *</label>
                <div className="relative">
                  <Layers className="absolute left-3.5 top-3 text-white/30" size={13} />
                  <select 
                    value={category}
                    onChange={e => {
                      const newCat = e.target.value;
                      setCategory(newCat);
                      // Clear subcategory or load the first one if subcategories exist
                      const subs = (PRODUCT_CATEGORIES as any)[newCat] || [];
                      setSubcategory(subs[0] || '');
                    }}
                    className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-xs text-white focus:ring-1 focus:ring-blue-500 outline-none"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">Sub-categoría (Filtrado Automático)</label>
                <div className="relative">
                  <Layers className="absolute left-3.5 top-3 text-white/30" size={13} />
                  <select 
                    value={subcategory}
                    disabled={subcategories.length === 0}
                    onChange={e => setSubcategory(e.target.value)}
                    className={`w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-xs text-white focus:ring-1 focus:ring-blue-500 outline-none ${
                      subcategories.length === 0 ? 'opacity-40 cursor-not-allowed' : ''
                    }`}
                  >
                    {subcategories.length === 0 ? (
                      <option value="">(Sin subcategorías)</option>
                    ) : (
                      subcategories.map((s: string) => <option key={s} value={s}>{s}</option>)
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* Row 4: 4 Image URLs */}
            <div className="space-y-3 bg-white/5 border border-white/5 p-4 rounded-2xl">
              <span className="text-[10px] text-blue-400 font-bold tracking-wider uppercase block">IMÁGENES DEL PRODUCTO (HASTA 4 FOTOS)</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] text-white/30 uppercase font-mono">Foto 1 (Principal) *</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-2.5 text-white/30" size={12} />
                    <input 
                      type="text" 
                      value={imgUrl1}
                      onChange={e => setImgUrl1(e.target.value)}
                      placeholder="URL de la imagen principal"
                      className="w-full pl-8 pr-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-[11px] text-white outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-white/30 uppercase font-mono">Foto 2 (Adicional)</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-2.5 text-white/30" size={12} />
                    <input 
                      type="text" 
                      value={imgUrl2}
                      onChange={e => setImgUrl2(e.target.value)}
                      placeholder="URL de la segunda imagen"
                      className="w-full pl-8 pr-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-[11px] text-white outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-white/30 uppercase font-mono">Foto 3 (Adicional)</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-2.5 text-white/30" size={12} />
                    <input 
                      type="text" 
                      value={imgUrl3}
                      onChange={e => setImgUrl3(e.target.value)}
                      placeholder="URL de la tercera imagen"
                      className="w-full pl-8 pr-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-[11px] text-white outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-white/30 uppercase font-mono">Foto 4 (Adicional)</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-2.5 text-white/30" size={12} />
                    <input 
                      type="text" 
                      value={imgUrl4}
                      onChange={e => setImgUrl4(e.target.value)}
                      placeholder="URL de la cuarta imagen"
                      className="w-full pl-8 pr-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-[11px] text-white outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Previews of the images */}
              <div className="flex gap-2.5 mt-2.5 overflow-x-auto py-1">
                {[imgUrl1, imgUrl2, imgUrl3, imgUrl4].map((url, i) => {
                  if (!url.trim()) return null;
                  return (
                    <div key={i} className="relative w-12 h-12 rounded-lg bg-black/40 border border-white/10 overflow-hidden flex-shrink-0 group">
                      <img src={url} alt={`Preview ${i+1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[8px] font-mono font-bold text-white">#{i+1}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Row 5: Description Highlights */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">Características Destacadas / Especificaciones (Un detalle por línea) *</label>
              <textarea 
                rows={4}
                value={highlightsInput}
                onChange={e => setHighlightsInput(e.target.value)}
                placeholder="Ej.&#10;8 Núcleos y 16 hilos de procesamiento&#10;Frecuencia Boost hasta 5.0 GHz&#10;Ideal para tarjetas gráficas de última generación&#10;Tecnología 3D V-Cache premium"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:ring-1 focus:ring-blue-500 outline-none transition-all font-sans leading-relaxed"
              />
              <span className="text-[10px] text-white/30 block">Cada línea ingresada se convertirá en una viñeta individual en la vista de detalles.</span>
            </div>

            {/* Form actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-white/5">
              <button 
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-300"
              >
                <Save size={14} />
                {selectedProductId ? 'Guardar Cambios' : 'Registrar Hardware'}
              </button>

              {selectedProductId && (
                <button 
                  type="button"
                  onClick={handleNewProductClick}
                  className="px-5 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-bold tracking-wider uppercase transition-all"
                >
                  Cancelar Edición
                </button>
              )}
            </div>

          </form>

        </div>

      </div>

    </div>
  );
}
