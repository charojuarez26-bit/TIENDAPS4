export function formatARS(amount) {
  if (typeof amount !== 'number') {
    amount = Number(amount) || 0;
  }
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatSimpleDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;
  
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getRelativeTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;
  
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays === 0) {
    if (diffInHours === 0) return 'Hace instantes';
    return `Hoy (hace ${diffInHours}h)`;
  } else if (diffInDays === 1) {
    return 'Ayer';
  } else if (diffInDays < 7) {
    return `Hace ${diffInDays} días`;
  } else {
    return date.toLocaleDateString('es-AR');
  }
}

export const REPAIR_STATUS_CONFIG = {
  'En fila': {
    label: 'En fila',
    progress: 25,
    color: 'yellow',
    textColor: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    barColor: 'bg-amber-400',
    icon: 'Clock',
    description: 'Equipo registrado en orden de llegada, a la espera del turno en banco de trabajo.'
  },
  'En taller': {
    label: 'En taller',
    progress: 60,
    color: 'blue',
    textColor: 'text-ps-neon',
    bgColor: 'bg-ps-blue/15',
    borderColor: 'border-ps-neon/40',
    barColor: 'bg-gradient-to-r from-ps-blue to-ps-neon',
    icon: 'Wrench',
    description: 'Técnico trabajando en la consola: diagnóstico, microelectrónica o limpieza profunda.'
  },
  'Listo para retirar': {
    label: 'Listo para retirar',
    progress: 100,
    color: 'emerald',
    textColor: 'text-emerald-400',
    bgColor: 'bg-emerald-500/15',
    borderColor: 'border-emerald-500/50',
    barColor: 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]',
    icon: 'CheckCircle2',
    description: 'Trabajo terminado y testeado al 100%. Podes pasar a retirarlo por el local en Aguilares.'
  },
  'Entregado': {
    label: 'Entregado',
    progress: 100,
    color: 'gray',
    textColor: 'text-slate-400',
    bgColor: 'bg-slate-800/60',
    borderColor: 'border-slate-700',
    barColor: 'bg-slate-600',
    icon: 'PackageCheck',
    description: 'Equipo entregado al cliente con garantía activa.'
  }
};

export function cleanPhone(phone) {
  if (!phone) return '';
  return phone.replace(/[^0-9]/g, '');
}

export function buildReadyWhatsAppUrl(repair, businessName) {
  const phone = cleanPhone(repair.phone);
  const formattedCost = formatARS(repair.cost);
  const message = `¡Hola ${repair.clientName}! Te escribimos de ${businessName}. Te avisamos que tu ${repair.device} (Orden #${repair.id}) ya está LISTO PARA RETIRAR por el local. El total del servicio es ${formattedCost}. ¡Te esperamos!`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildCartCheckoutWhatsAppUrl(cart, customerData, config) {
  const phone = cleanPhone(config.whatsappNumber);
  
  let text = `🎮 *NUEVO PEDIDO - ${config.businessName}*\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `👤 *Cliente:* ${customerData.name}\n`;
  if (customerData.phone) {
    text += `📱 *Teléfono:* ${customerData.phone}\n`;
  }
  text += `💳 *Método de Pago:* ${customerData.paymentMethod}\n`;
  text += `📍 *Modalidad:* ${customerData.deliveryMethod}\n`;
  if (customerData.deliveryMethod.includes('Envío') && customerData.address) {
    text += `🏠 *Dirección de Entrega:* ${customerData.address}\n`;
  }
  if (customerData.notes) {
    text += `📝 *Notas:* ${customerData.notes}\n`;
  }
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `📦 *DETALLE DE LA COMPRA:*\n`;

  let total = 0;
  cart.forEach((item, index) => {
    const itemSubtotal = item.price * item.quantity;
    total += itemSubtotal;
    const typeLabel = item.isService ? '🛠️ [Servicio]' : '🎮 [Producto]';
    text += `${index + 1}. ${typeLabel} *${item.title || item.name}*\n`;
    text += `   Cant: ${item.quantity} x ${formatARS(item.price)} = *${formatARS(itemSubtotal)}*\n`;
    if (item.tag || item.format || item.model) {
      text += `   _(${item.tag || item.format || item.model})_\n`;
    }
  });

  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `💰 *TOTAL A ABONAR: ${formatARS(total)}*\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `_Pedido generado desde la tienda web oficial de Aguilares, Tucumán._`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
