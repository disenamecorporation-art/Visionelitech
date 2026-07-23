import React from "react";
import { X, Trash2, ShoppingCart, Send, Plus, Minus } from "lucide-react";
import { ProductDetails } from "../types";
import { cyberSound } from "./CyberSound";

export interface CartItem {
  product: ProductDetails;
  quantity: number;
}

interface ShoppingCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export default function ShoppingCartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}: ShoppingCartDrawerProps) {
  if (!isOpen) return null;

  const totalUSD = cartItems.reduce(
    (acc, item) => acc + item.product.priceUSD * item.quantity,
    0
  );

  const handleCheckoutWhatsApp = () => {
    cyberSound.playClick();
    if (cartItems.length === 0) return;

    // Build a professional billing spec
    let messageText = `*PEDIDO NUEVO - VISIONELITECH*\n`;
    messageText += `--------------------------------------\n\n`;

    cartItems.forEach((item, index) => {
      messageText += `*${index + 1}. ${item.product.name}*\n`;
      messageText += `   Cant: ${item.quantity} x $${item.product.priceUSD.toLocaleString()} USD\n`;
      if (item.product.id.startsWith("custom-pc-")) {
        // Detailed specifications for custom rigs
        messageText += `   _Especificaciones:_\n`;
        item.product.highlights.forEach((hl) => {
          messageText += `   • ${hl}\n`;
        });
      }
      messageText += `\n`;
    });

    messageText += `--------------------------------------\n`;
    messageText += `*TOTAL EN USD:* $${totalUSD.toLocaleString()} USD\n\n`;
    messageText += `Deseo coordinar la entrega personal en Caracas o el envío nacional a mi ubicación.`;

    const encodedText = encodeURIComponent(messageText);
    window.open(`https://wa.me/584162586839?text=${encodedText}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" id="shopping-cart-drawer-overlay">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => {
          cyberSound.playClick();
          onClose();
        }}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md h-full bg-[#07070a] border-l border-white/10 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <ShoppingCart size={18} className="text-blue-400" />
            <h4 className="font-sans font-black text-sm text-white tracking-widest uppercase">Carrito de Compras</h4>
            <span className="bg-blue-500/10 text-blue-400 font-mono text-[10px] px-2 py-0.5 rounded-full border border-blue-500/20">
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>

          <button
            onClick={() => {
              cyberSound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white transition-all cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <span className="text-4xl">🛒</span>
              <div>
                <h5 className="font-sans font-bold text-sm text-white uppercase">Tu carrito está vacío</h5>
                <p className="font-sans text-[11px] text-white/40 max-w-xs mt-1">
                  ¡Añade productos de la Tienda o diseña tu PC personalizada para empezar!
                </p>
              </div>
            </div>
          ) : (
            cartItems.map((item) => {
              return (
                <div 
                  key={item.product.id}
                  className="p-3.5 rounded-2xl bg-black/40 border border-white/5 hover:border-white/10 transition-all duration-300 flex items-start gap-4"
                >
                  {/* Miniature Image */}
                  <div className="w-16 aspect-square rounded-xl bg-black/40 border border-white/5 overflow-hidden flex-shrink-0">
                    <img 
                      src={item.product.image || "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=150&q=80"} 
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info details */}
                  <div className="flex-1 min-w-0">
                    <h5 className="font-sans font-bold text-xs text-white uppercase truncate" title={item.product.name}>
                      {item.product.name}
                    </h5>
                    <p className="text-[10px] text-white/50 line-clamp-1 mt-0.5">
                      {item.product.id.startsWith("custom-pc-") ? "Ensamble a Medida" : item.product.tagline}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Selector */}
                      <div className="flex items-center space-x-1.5 bg-black/50 rounded-full p-1 border border-white/5">
                        <button
                          onClick={() => {
                            cyberSound.playClick();
                            onUpdateQuantity(item.product.id, -1);
                          }}
                          className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="font-sans font-bold text-[10px] text-white w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => {
                            cyberSound.playClick();
                            onUpdateQuantity(item.product.id, 1);
                          }}
                          className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
                        >
                          <Plus size={10} />
                        </button>
                      </div>

                      {/* Prices */}
                      <div className="text-right">
                        <span className="font-sans font-black text-xs text-blue-400 block">
                          ${(item.product.priceUSD * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => {
                      cyberSound.playClick();
                      onRemoveItem(item.product.id);
                    }}
                    className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                    title="Eliminar producto"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Billing Details & Actions */}
        <div className="p-6 border-t border-white/5 bg-black/60 space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between items-baseline text-xs font-sans text-white/50">
              <span>SUBTOTAL USD</span>
              <strong className="text-white text-base font-black">${totalUSD.toLocaleString()}</strong>
            </div>
            <div className="text-[10px] text-blue-400 font-sans italic text-right">
              Envíos inmediatos nacionales Y delivery en toda caracas
            </div>
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <button
              onClick={handleCheckoutWhatsApp}
              disabled={cartItems.length === 0}
              className={`w-full flex items-center justify-center space-x-2 py-3 rounded-full text-black font-sans text-xs font-black tracking-wider transition-all duration-300 shadow-md ${
                cartItems.length === 0
                  ? "bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed"
                  : "bg-blue-400 hover:bg-blue-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer"
              }`}
            >
              <Send size={12} />
              <span>PROCESAR PEDIDO POR WHATSAPP</span>
            </button>

            {cartItems.length > 0 && (
              <button
                onClick={() => {
                  cyberSound.playClick();
                  onClearCart();
                }}
                className="w-full text-center py-2 text-[10px] text-gray-500 hover:text-gray-300 font-bold tracking-wider uppercase transition-colors cursor-pointer"
              >
                Vaciar Carrito
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
