import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatARS, buildCartCheckoutWhatsAppUrl } from '../utils/formatters';
import { X, Trash2, Plus, Minus, ShoppingBag, Send, AlertCircle, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { PlayStationSymbolsRow } from './PlayStationSymbols';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    config,
    showToast
  } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [deliveryMethod, setDeliveryMethod] = useState('Retiro por el local en Aguilares');
  const [customerAddress, setCustomerAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState('');

  if (!isCartOpen) return null;

  const handleCheckoutWhatsApp = () => {
    if (!customerName.trim()) {
      setValidationError('Por favor ingresá tu nombre para procesar el pedido.');
      return;
    }

    if (deliveryMethod.includes('Envío') && !customerAddress.trim()) {
      setValidationError('Por favor especificá la dirección o barrio de entrega en Aguilares.');
      return;
    }

    setValidationError('');

    const customerData = {
      name: customerName.trim(),
      phone: customerPhone.trim(),
      paymentMethod,
      deliveryMethod,
      address: customerAddress.trim(),
      notes: notes.trim(),
    };

    const url = buildCartCheckoutWhatsAppUrl(cart, customerData, config);

    // Open WhatsApp in new tab
    window.open(url, '_blank');
    showToast('¡Pedido transferido a WhatsApp! Te responderemos a la brevedad.', 'success');
    clearCart();
    setIsCartOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-md bg-ps-surface border-l border-ps-border shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-ps-border flex items-center justify-between bg-ps-bg/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-ps-blue/20 text-ps-neon">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white font-gaming tracking-wide flex items-center gap-2">
                  <span>TU PEDIDO</span>
                  <PlayStationSymbolsRow size="w-3 h-3" spacing="space-x-1" />
                </h2>
                <p className="text-xs text-slate-400">
                  {cart.length === 0 ? 'Carrito vacío' : `${cart.length} ítem(s) en orden`}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Cerrar Carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto mb-4 text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-white">Tu carrito está vacío</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Agregá juegos de PS4/PS3, consolas, joysticks o solicitá un turno de servicio técnico.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 px-5 py-2.5 rounded-xl bg-ps-blue hover:bg-ps-blueLight text-white text-xs font-bold transition-all shadow-ps-glow"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-ps-border/50">
                  <span>Productos y Servicios seleccionados</span>
                  <button
                    onClick={clearCart}
                    className="text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1 text-[11px]"
                  >
                    <Trash2 className="w-3 h-3" /> Vaciar
                  </button>
                </div>

                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-ps-bg/80 border border-ps-border flex items-center gap-3 relative group"
                  >
                    {/* Thumbnail if product */}
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover bg-slate-900 border border-slate-800 shrink-0"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-ps-blue/15 border border-ps-blue/30 flex items-center justify-center text-ps-neon shrink-0 font-gaming font-bold text-xl">
                        {item.isService ? '🛠️' : '🎮'}
                      </div>
                    )}

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                          title="Eliminar ítem"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-ps-neon font-medium border border-slate-700">
                          {item.tag || (item.isService ? 'Servicio' : 'Juego')}
                        </span>
                        <span className="text-xs text-slate-300 font-bold">
                          {formatARS(item.price)}
                        </span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80">
                        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-white px-2 font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-xs font-bold text-white font-gaming">
                          Subtotal: <span className="text-ps-neon">{formatARS(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Checkout Form */}
                <div className="mt-6 pt-4 border-t border-ps-border space-y-3.5">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <span>Datos de Entrega y Pago</span>
                    <span className="text-ps-neon font-mono text-[10px]">(WhatsApp)</span>
                  </h3>

                  {validationError && (
                    <div className="p-2.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{validationError}</span>
                    </div>
                  )}

                  {/* Customer Name */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Marcos Albornoz"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-ps-bg border border-ps-border focus:border-ps-neon text-xs text-white placeholder:text-slate-500 focus:outline-none"
                    />
                  </div>

                  {/* Customer Phone */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Teléfono WhatsApp de contacto
                    </label>
                    <input
                      type="tel"
                      placeholder="Ej: 3865 123456"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-ps-bg border border-ps-border focus:border-ps-neon text-xs text-white placeholder:text-slate-500 focus:outline-none"
                    />
                  </div>

                  {/* Delivery Method */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Modalidad de Entrega
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { id: 'Retiro por el local en Aguilares', label: '🏪 Retiro en Local (Aguilares)' },
                        { id: 'Envío a domicilio en Aguilares', label: '🛵 Envío a Domicilio (Aguilares y zonas)' },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setDeliveryMethod(m.id)}
                          className={`text-left px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                            deliveryMethod === m.id
                              ? 'bg-ps-blue/20 border-ps-neon text-white shadow-sm'
                              : 'bg-ps-bg border-ps-border text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Address if delivery */}
                  {deliveryMethod.includes('Envío') && (
                    <div className="animate-fadeIn">
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Dirección exacta o barrio en Aguilares *
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Barrio San Martín Mz C Lote 4"
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-ps-bg border border-ps-border focus:border-ps-neon text-xs text-white placeholder:text-slate-500 focus:outline-none"
                      />
                    </div>
                  )}

                  {/* Payment Method */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Forma de Pago
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Efectivo', 'Transferencia / Mercado Pago'].map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                            paymentMethod === method
                              ? 'bg-ps-blue/20 border-ps-neon text-white shadow-sm'
                              : 'bg-ps-bg border-ps-border text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Observaciones / Horario preferido (opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Avisar antes de llegar / Llevar cambio"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-ps-bg border border-ps-border focus:border-ps-neon text-xs text-white placeholder:text-slate-500 focus:outline-none"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-ps-border bg-ps-bg/95 sticky bottom-0 z-10 pb-6 sm:pb-5">
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-xs sm:text-sm text-slate-300 font-semibold">Total a abonar:</span>
                <span className="text-xl sm:text-2xl font-extrabold text-white font-gaming text-ps-neon">
                  {formatARS(cartTotal)}
                </span>
              </div>

              <button
                onClick={handleCheckoutWhatsApp}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold text-xs sm:text-sm tracking-wide shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-98"
              >
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                <span>TERMINAR COMPRA POR WHATSAPP</span>
              </button>

              <p className="text-[10px] text-center text-slate-400 mt-2">
                Te responderemos al instante desde nuestro local en Aguilares para coordinar.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
