import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  formatARS,
  formatSimpleDate,
  getRelativeTime,
  formatTime,
  formatDateOnly,
  REPAIR_STATUS_CONFIG,
  buildReadyWhatsAppUrl,
  buildRepairReceiptText,
  buildCashClosureText,
  buildCashClosureWhatsAppUrl,
  cleanPhone
} from '../utils/formatters';
import { CATEGORIES, INITIAL_CONFIG } from '../data/seedData';
import { compressImageFile } from '../utils/imageCompressor';
import {
  Wrench,
  Package,
  Settings,
  Plus,
  Trash2,
  Edit3,
  MessageSquare,
  ArrowLeft,
  Search,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Save,
  Phone,
  Store,
  Key,
  ShieldCheck,
  Filter,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  Disc3,
  Gamepad,
  Cpu,
  Tv,
  DollarSign,
  Copy,
  Sparkles,
  Loader2,
  Camera,
  Banknote,
  CreditCard,
  TrendingUp,
  Calendar,
  CalendarDays,
  Receipt,
  Wallet,
  ArrowUpRight,
  Share2
} from 'lucide-react';
import { PlayStationSymbolsRow } from './PlayStationSymbols';

export default function AdminDashboard({ onClose }) {
  const {
    config,
    updateConfig,
    resetAllData,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStock,
    services,
    addService,
    updateService,
    deleteService,
    repairs,
    addRepair,
    updateRepairStatus,
    updateRepair,
    deleteRepair,
    transactions,
    addTransaction,
    deleteTransaction,
    chargeRepairOrder,
    logoutAdmin,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('repairs'); // 'repairs' | 'finances' | 'catalog' | 'settings'

  // --- REPAIR TAB STATES ---
  const [repairFilterStatus, setRepairFilterStatus] = useState('ALL');
  const [repairSearchTerm, setRepairSearchTerm] = useState('');
  const [isNewRepairModalOpen, setIsNewRepairModalOpen] = useState(false);
  const [editingRepair, setEditingRepair] = useState(null);
  const [copiedReceiptId, setCopiedReceiptId] = useState(null);

  // New repair form state
  const [repairForm, setRepairForm] = useState({
    clientName: '',
    dni: '',
    phone: '',
    device: 'PS4 Fat 500GB',
    issue: '',
    cost: '',
    status: 'En fila',
    technicianNotes: '',
    priority: 'Normal'
  });

  // --- CATALOG TAB STATES ---
  const [catalogSubTab, setCatalogSubTab] = useState('products'); // 'products' | 'services'
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCompressingImage, setIsCompressingImage] = useState(false);
  const [compressionDetails, setCompressionDetails] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'juegos_ps4',
    price: '',
    stock: 3,
    tag: '',
    format: 'Físico Usado',
    model: '',
    capacity: '',
    systemStatus: '',
    type: '',
    image: '',
    description: '',
    featured: false
  });
  const fileInputRef = useRef(null);

  // Quick edit states in list
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [tempPriceValue, setTempPriceValue] = useState('');
  const quickPhotoInputRef = useRef(null);
  const [quickPhotoProductId, setQuickPhotoProductId] = useState(null);

  // Service form state
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    title: '',
    subtitle: '',
    price: '',
    turnaround: '24 a 48 hs',
    platform: 'PS4 / PS3',
    icon: 'Wrench',
    highlight: '',
    includes: ''
  });

  // --- SETTINGS TAB STATES ---
  const [configForm, setConfigForm] = useState({
    businessName: config.businessName,
    whatsappNumber: config.whatsappNumber,
    address: config.address,
    businessHours: config.businessHours || '',
    newPin: '',
    confirmPin: ''
  });

  // --- FINANCES & CASH MANAGEMENT STATES ---
  const [financeDateFilter, setFinanceDateFilter] = useState('today'); // 'today' | 'yesterday' | 'week' | 'month' | 'all' | 'custom'
  const [customFinanceDate, setCustomFinanceDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [financeSearchTerm, setFinanceSearchTerm] = useState('');
  const [financeTypeFilter, setFinanceTypeFilter] = useState('ALL'); // 'ALL' | 'juego' | 'reparacion' | 'consola' | 'accesorio' | 'otro'
  const [financeMethodFilter, setFinanceMethodFilter] = useState('ALL'); // 'ALL' | 'Efectivo' | 'Transferencia'

  // Modal states for new sale / income
  const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState(false);
  const [saleForm, setSaleForm] = useState({
    type: 'juego',
    category: 'Venta de Juegos',
    catalogProductId: '',
    selectedRepairId: '',
    title: '',
    amount: '',
    paymentMethod: 'Efectivo',
    customer: 'Cliente Mostrador',
    notes: ''
  });

  // Modal states for cash closure
  const [isCashClosureModalOpen, setIsCashClosureModalOpen] = useState(false);
  const [copiedClosureText, setCopiedClosureText] = useState(false);

  // Modal states for charging repair order directly from Tab 1
  const [chargingRepairOrder, setChargingRepairOrder] = useState(null);
  const [chargeRepairMethod, setChargeRepairMethod] = useState('Efectivo');
  const [chargeRepairAmount, setChargeRepairAmount] = useState('');
  const [chargeRepairNotes, setChargeRepairNotes] = useState('');

  // ==========================================
  // REPAIR ACTIONS
  // ==========================================
  const handleOpenNewRepair = () => {
    setRepairForm({
      clientName: '',
      dni: '',
      phone: '',
      device: 'PS4 Slim 1TB',
      issue: '',
      cost: '',
      status: 'En fila',
      technicianNotes: '',
      priority: 'Normal'
    });
    setEditingRepair(null);
    setIsNewRepairModalOpen(true);
  };

  const handleEditRepair = (repair) => {
    setEditingRepair(repair);
    setRepairForm({
      clientName: repair.clientName,
      dni: repair.dni,
      phone: repair.phone,
      device: repair.device,
      issue: repair.issue,
      cost: repair.cost.toString(),
      status: repair.status,
      technicianNotes: repair.technicianNotes || '',
      priority: repair.priority || 'Normal'
    });
    setIsNewRepairModalOpen(true);
  };

  const handleSaveRepair = (e) => {
    e.preventDefault();
    if (!repairForm.clientName.trim() || !repairForm.dni.trim() || !repairForm.device.trim()) {
      showToast('Por favor completa Nombre, DNI y Equipo.', 'error');
      return;
    }

    if (editingRepair) {
      updateRepair(editingRepair.id, {
        ...repairForm,
        cost: Number(repairForm.cost) || 0
      });
    } else {
      addRepair(repairForm);
    }
    setIsNewRepairModalOpen(false);
    setEditingRepair(null);
  };

  // Copy Quick Receipt to Clipboard for the customer
  const handleCopyReceipt = (repair) => {
    const text = buildRepairReceiptText(repair, config.businessName);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopiedReceiptId(repair.id);
    showToast(`Comprobante Orden #${repair.id} copiado al portapapeles.`, 'success');
    setTimeout(() => {
      setCopiedReceiptId(null);
    }, 2500);
  };

  // Filtered repairs ordered strictly by arrival (original order or reverse)
  const filteredRepairs = repairs
    .filter(r => {
      if (repairFilterStatus !== 'ALL' && r.status !== repairFilterStatus) return false;
      if (repairSearchTerm.trim()) {
        const q = repairSearchTerm.toLowerCase();
        const matchesClient = r.clientName.toLowerCase().includes(q);
        const matchesDni = r.dni.includes(q);
        const matchesOrder = r.id.toString().includes(q);
        const matchesDevice = r.device.toLowerCase().includes(q);
        return matchesClient || matchesDni || matchesOrder || matchesDevice;
      }
      return true;
    })
    .sort((a, b) => new Date(a.entryDate || 0) - new Date(b.entryDate || 0)); // Oldest first (arrival order)

  // Repair metrics
  const repairMetrics = {
    total: repairs.length,
    enFila: repairs.filter(r => r.status === 'En fila').length,
    enTaller: repairs.filter(r => r.status === 'En taller').length,
    listo: repairs.filter(r => r.status === 'Listo para retirar').length,
    entregado: repairs.filter(r => r.status === 'Entregado').length,
    totalFacturado: repairs.reduce((sum, r) => sum + (Number(r.cost) || 0), 0)
  };

  // ==========================================
  // FINANCES & CASH MANAGEMENT ACTIONS
  // ==========================================

  // Date helpers
  const isDateToday = (isoString) => {
    if (!isoString) return false;
    const d = new Date(isoString);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() &&
           d.getMonth() === now.getMonth() &&
           d.getDate() === now.getDate();
  };

  const isDateYesterday = (isoString) => {
    if (!isoString) return false;
    const d = new Date(isoString);
    const y = new Date(Date.now() - 86400000);
    return d.getFullYear() === y.getFullYear() &&
           d.getMonth() === y.getMonth() &&
           d.getDate() === y.getDate();
  };

  const isDateLast7Days = (isoString) => {
    if (!isoString) return false;
    const d = new Date(isoString);
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
    return d >= sevenDaysAgo;
  };

  const isDateThisMonth = (isoString) => {
    if (!isoString) return false;
    const d = new Date(isoString);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  };

  // Transactions for the selected date period (used to compute period metrics)
  const periodTransactions = transactions.filter(t => {
    if (financeDateFilter === 'today') return isDateToday(t.date);
    if (financeDateFilter === 'yesterday') return isDateYesterday(t.date);
    if (financeDateFilter === 'week') return isDateLast7Days(t.date);
    if (financeDateFilter === 'month') return isDateThisMonth(t.date);
    if (financeDateFilter === 'custom') {
      if (!customFinanceDate) return true;
      return t.date.startsWith(customFinanceDate);
    }
    return true; // 'all'
  });

  // Calculate metrics for current date period
  const periodMetrics = {
    totalGeneral: periodTransactions.reduce((acc, t) => acc + (Number(t.amount) || 0), 0),
    totalEfectivo: periodTransactions
      .filter(t => t.paymentMethod === 'Efectivo')
      .reduce((acc, t) => acc + (Number(t.amount) || 0), 0),
    totalTransferencia: periodTransactions
      .filter(t => t.paymentMethod === 'Transferencia')
      .reduce((acc, t) => acc + (Number(t.amount) || 0), 0),
    totalJuegos: periodTransactions
      .filter(t => t.type === 'juego')
      .reduce((acc, t) => acc + (Number(t.amount) || 0), 0),
    countJuegos: periodTransactions.filter(t => t.type === 'juego').length,
    totalReparaciones: periodTransactions
      .filter(t => t.type === 'reparacion')
      .reduce((acc, t) => acc + (Number(t.amount) || 0), 0),
    countReparaciones: periodTransactions.filter(t => t.type === 'reparacion').length,
    totalOtros: periodTransactions
      .filter(t => t.type !== 'juego' && t.type !== 'reparacion')
      .reduce((acc, t) => acc + (Number(t.amount) || 0), 0),
    countOtros: periodTransactions.filter(t => t.type !== 'juego' && t.type !== 'reparacion').length,
  };

  periodMetrics.efectivoPercent = periodMetrics.totalGeneral > 0
    ? Math.round((periodMetrics.totalEfectivo / periodMetrics.totalGeneral) * 100)
    : 0;
  periodMetrics.transferenciaPercent = periodMetrics.totalGeneral > 0
    ? (100 - periodMetrics.efectivoPercent)
    : 0;

  // Filtered transactions for the list / table (after text search, type filter, payment method filter)
  const filteredTransactions = periodTransactions.filter(t => {
    if (financeTypeFilter !== 'ALL' && t.type !== financeTypeFilter) return false;
    if (financeMethodFilter !== 'ALL' && t.paymentMethod !== financeMethodFilter) return false;
    if (financeSearchTerm.trim()) {
      const q = financeSearchTerm.toLowerCase();
      const matchTitle = (t.title || '').toLowerCase().includes(q);
      const matchCust = (t.customer || '').toLowerCase().includes(q);
      const matchNotes = (t.notes || '').toLowerCase().includes(q);
      const matchAmount = (t.amount || '').toString().includes(q);
      const matchCategory = (t.category || '').toLowerCase().includes(q);
      return matchTitle || matchCust || matchNotes || matchAmount || matchCategory;
    }
    return true;
  }).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  const getDateFilterLabel = () => {
    if (financeDateFilter === 'today') return 'Hoy';
    if (financeDateFilter === 'yesterday') return 'Ayer';
    if (financeDateFilter === 'week') return 'Últimos 7 días';
    if (financeDateFilter === 'month') return 'Este Mes';
    if (financeDateFilter === 'custom') return `Fecha: ${customFinanceDate}`;
    return 'Histórico Completo';
  };

  // Open modal to add sale
  const handleOpenNewSale = (defaultType = 'juego') => {
    setSaleForm({
      type: defaultType,
      category: defaultType === 'reparacion' ? 'Servicio Técnico' : defaultType === 'juego' ? 'Venta de Juegos' : 'Consolas & Accesorios',
      catalogProductId: '',
      selectedRepairId: '',
      title: '',
      amount: '',
      paymentMethod: 'Efectivo',
      customer: 'Cliente Mostrador',
      notes: ''
    });
    setIsNewSaleModalOpen(true);
  };

  const handleSelectCatalogProduct = (prodId) => {
    const prod = products.find(p => p.id === prodId);
    if (prod) {
      setSaleForm(prev => ({
        ...prev,
        catalogProductId: prod.id,
        title: prod.name,
        amount: prod.price.toString(),
        notes: `${prod.format || ''} - ${prod.condition || ''}`.trim()
      }));
    }
  };

  const handleSelectPendingRepair = (repId) => {
    const rep = repairs.find(r => r.id === repId);
    if (rep) {
      setSaleForm(prev => ({
        ...prev,
        selectedRepairId: rep.id,
        title: `Reparación #${rep.id} - ${rep.device}`,
        amount: rep.cost.toString(),
        customer: rep.clientName,
        notes: `Falla: ${rep.issue} (DNI: ${rep.dni})`
      }));
    }
  };

  const handleSaveSale = (e) => {
    e.preventDefault();
    if (!saleForm.title.trim()) {
      showToast('Por favor escribe qué se vendió o el concepto.', 'error');
      return;
    }
    if (!saleForm.amount || Number(saleForm.amount) <= 0) {
      showToast('Por favor ingresa un monto válido.', 'error');
      return;
    }

    addTransaction({
      type: saleForm.type,
      category: saleForm.category || (saleForm.type === 'reparacion' ? 'Servicio Técnico' : 'Venta de Juegos'),
      title: saleForm.title,
      amount: Number(saleForm.amount),
      paymentMethod: saleForm.paymentMethod,
      customer: saleForm.customer || 'Cliente Mostrador',
      notes: saleForm.notes || '',
      referenceId: saleForm.catalogProductId || saleForm.selectedRepairId || null
    });

    // If it was linked to a repair order, mark it as delivered and paid
    if (saleForm.selectedRepairId) {
      updateRepair(saleForm.selectedRepairId, {
        status: 'Entregado',
        isPaid: true,
        paidMethod: saleForm.paymentMethod,
        paidAmount: Number(saleForm.amount)
      });
    }

    setIsNewSaleModalOpen(false);
  };

  // Workshop Tab: Quick Charge helper
  const handleOpenChargeRepairModal = (repair) => {
    setChargingRepairOrder(repair);
    setChargeRepairMethod('Efectivo');
    setChargeRepairAmount(repair.cost.toString());
    setChargeRepairNotes(`Falla: ${repair.issue} | DNI: ${repair.dni}`);
  };

  const handleConfirmChargeRepair = (e) => {
    e.preventDefault();
    if (!chargingRepairOrder) return;
    const amount = Number(chargeRepairAmount) || chargingRepairOrder.cost;
    chargeRepairOrder(chargingRepairOrder.id, chargeRepairMethod, amount, chargeRepairNotes);
    setChargingRepairOrder(null);
  };

  // Cash Closure copy helper
  const handleCopyCashClosure = () => {
    const text = buildCashClosureText({
      transactions: periodTransactions,
      dateLabel: getDateFilterLabel(),
      config,
      totalEfectivo: periodMetrics.totalEfectivo,
      totalTransferencia: periodMetrics.totalTransferencia,
      totalGeneral: periodMetrics.totalGeneral,
      totalJuegos: periodMetrics.totalJuegos,
      countJuegos: periodMetrics.countJuegos,
      totalReparaciones: periodMetrics.totalReparaciones,
      countReparaciones: periodMetrics.countReparaciones,
      totalOtros: periodMetrics.totalOtros,
      countOtros: periodMetrics.countOtros
    });

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }

    setCopiedClosureText(true);
    showToast('¡Resumen de Cierre de Caja copiado al portapapeles!', 'success');
    setTimeout(() => setCopiedClosureText(false), 2500);
  };

  // ==========================================
  // CATALOG ACTIONS & BASE64 IMAGE HANDLER (CANVAS 600px MAX)
  // ==========================================
  const handleOpenNewProduct = () => {
    setProductForm({
      name: '',
      category: 'juegos_ps4',
      price: '',
      stock: 3,
      tag: 'Físico Usado',
      format: 'Físico Usado',
      model: '',
      capacity: '',
      systemStatus: '',
      type: '',
      image: '',
      description: '',
      featured: false
    });
    setCompressionDetails(null);
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category,
      price: prod.price.toString(),
      stock: prod.stock,
      tag: prod.tag || '',
      format: prod.format || '',
      model: prod.model || '',
      capacity: prod.capacity || '',
      systemStatus: prod.systemStatus || '',
      type: prod.type || '',
      image: prod.image || '',
      description: prod.description || '',
      featured: Boolean(prod.featured)
    });
    setCompressionDetails(null);
    setIsProductModalOpen(true);
  };

  // Base64 Image Upload with offscreen Canvas auto-resize (max 600px, JPEG 0.7)
  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Por favor selecciona un archivo de imagen válido.', 'error');
      return;
    }

    try {
      setIsCompressingImage(true);
      const result = await compressImageFile(file, 600, 0.7);
      setProductForm(prev => ({ ...prev, image: result.base64 }));
      setCompressionDetails({
        originalSizeKb: result.originalSizeKb,
        compressedSizeKb: result.compressedSizeKb,
        dimensions: `${result.width}x${result.height}px`
      });
      showToast(`Foto optimizada con Canvas: de ${result.originalSizeKb} KB a ${result.compressedSizeKb} KB (máx 600px).`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Error al procesar la imagen: ' + err.message, 'error');
    } finally {
      setIsCompressingImage(false);
    }
  };

  // 1-Click Quick Price Edit
  const handleStartEditPrice = (prod) => {
    setEditingPriceId(prod.id);
    setTempPriceValue(prod.price.toString());
  };

  const handleSaveQuickPrice = (prodId) => {
    const val = Number(tempPriceValue);
    if (!isNaN(val) && val > 0) {
      updateProduct(prodId, { price: val });
      showToast('Precio actualizado en 1 clic.', 'success');
    }
    setEditingPriceId(null);
  };

  // 1-Click Quick Photo Change from list
  const handleTriggerQuickPhoto = (prodId) => {
    setQuickPhotoProductId(prodId);
    quickPhotoInputRef.current?.click();
  };

  const handleExecuteQuickPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !quickPhotoProductId) return;

    try {
      showToast('Comprimiendo y actualizando carátula...', 'info');
      const result = await compressImageFile(file, 600, 0.75);
      updateProduct(quickPhotoProductId, { image: result.base64 });
      showToast(`Carátula actualizada (${result.compressedSizeKb} KB con Canvas).`, 'success');
    } catch (err) {
      showToast('Error al actualizar foto: ' + err.message, 'error');
    } finally {
      setQuickPhotoProductId(null);
      if (e.target) e.target.value = '';
    }
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name.trim() || !productForm.price) {
      showToast('Por favor ingresa nombre y precio del producto.', 'error');
      return;
    }

    // Default placeholder if empty
    const finalImage = productForm.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';

    const payload = {
      ...productForm,
      image: finalImage,
      price: Number(productForm.price) || 0,
      stock: Number(productForm.stock) || 0,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
    } else {
      addProduct(payload);
    }
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  // Service CRUD
  const handleOpenNewService = () => {
    setServiceForm({
      title: '',
      subtitle: '',
      price: '',
      turnaround: '24 a 48 hs',
      platform: 'PS4 / PS3',
      icon: 'Fan',
      highlight: '',
      includes: ''
    });
    setEditingService(null);
    setIsServiceModalOpen(true);
  };

  const handleEditService = (serv) => {
    setEditingService(serv);
    setServiceForm({
      title: serv.title,
      subtitle: serv.subtitle || '',
      price: serv.price.toString(),
      turnaround: serv.turnaround || '',
      platform: serv.platform || '',
      icon: serv.icon || 'Wrench',
      highlight: serv.highlight || '',
      includes: Array.isArray(serv.includes) ? serv.includes.join('\n') : (serv.includes || '')
    });
    setIsServiceModalOpen(true);
  };

  const handleSaveService = (e) => {
    e.preventDefault();
    if (!serviceForm.title.trim() || !serviceForm.price) {
      showToast('Por favor ingresa título y precio del servicio.', 'error');
      return;
    }

    const payload = {
      ...serviceForm,
      price: Number(serviceForm.price) || 0,
      includes: serviceForm.includes.split('\n').filter(Boolean)
    };

    if (editingService) {
      updateService(editingService.id, payload);
    } else {
      addService(payload);
    }
    setIsServiceModalOpen(false);
    setEditingService(null);
  };

  // ==========================================
  // CONFIG ACTIONS
  // ==========================================
  const handleSaveConfig = (e) => {
    e.preventDefault();
    
    // Check PIN change
    if (configForm.newPin) {
      if (configForm.newPin !== configForm.confirmPin) {
        showToast('Los nuevos PINs no coinciden.', 'error');
        return;
      }
      if (configForm.newPin.length < 4) {
        showToast('El PIN debe tener al menos 4 números.', 'error');
        return;
      }
    }

    const updated = {
      businessName: configForm.businessName.trim(),
      whatsappNumber: cleanPhone(configForm.whatsappNumber),
      address: configForm.address.trim(),
      businessHours: configForm.businessHours.trim(),
    };

    if (configForm.newPin) {
      updated.adminPin = configForm.newPin;
    }

    updateConfig(updated);
    setConfigForm(prev => ({ ...prev, newPin: '', confirmPin: '' }));
  };

  const handleConfirmReset = () => {
    if (window.confirm('¿Seguro que deseas restablecer TODOS los productos, reparaciones y configuración a los valores iniciales de fábrica? Esta acción reiniciará la base de datos para la demostración.')) {
      resetAllData();
      setConfigForm({
        businessName: INITIAL_CONFIG.businessName,
        whatsappNumber: INITIAL_CONFIG.whatsappNumber,
        address: INITIAL_CONFIG.address,
        businessHours: INITIAL_CONFIG.businessHours,
        newPin: '',
        confirmPin: ''
      });
      showToast('Datos de demostración y catálogo restablecidos a los valores originales de fábrica.', 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ps-bg text-slate-100 flex flex-col">
      
      {/* Top Admin Navigation Header */}
      <div className="bg-ps-surface border-b border-ps-border px-3 sm:px-8 py-2.5 sm:py-3.5 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-ps-neon text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-ps-neon" />
              <span className="hidden xs:inline">Volver a la Tienda</span>
              <span className="xs:hidden">Volver</span>
            </button>

            <div className="h-6 w-px bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-7 h-7 rounded-lg bg-ps-blue flex items-center justify-center font-gaming font-bold text-white text-xs shadow-ps-glow shrink-0">
                PS
              </div>
              <div className="truncate">
                <div className="text-xs sm:text-sm font-bold text-white font-gaming tracking-wide flex items-center gap-1.5 truncate">
                  <span className="hidden sm:inline">PANEL DE ADMINISTRACIÓN</span>
                  <span className="sm:hidden font-gaming text-xs">ADMIN</span>
                  <div className="hidden xs:block">
                    <PlayStationSymbolsRow size="w-2.5 h-2.5 sm:w-3 sm:h-3" spacing="space-x-1" />
                  </div>
                </div>
                <div className="text-[9px] sm:text-[10px] text-emerald-400 font-mono truncate">
                  {config.businessName} • Sesión Activa
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                logoutAdmin();
                onClose();
              }}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-semibold transition-all cursor-pointer"
            >
              Salir
            </button>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="bg-ps-surface/60 border-b border-ps-border px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-6 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('repairs')}
            className={`flex items-center gap-2 py-3 px-3 sm:px-4 border-b-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'repairs'
                ? 'border-ps-neon text-ps-neon'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>1. Gestión de Taller ({repairs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('finances')}
            className={`flex items-center gap-2 py-3 px-3 sm:px-4 border-b-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'finances'
                ? 'border-emerald-400 text-emerald-400 shadow-[0_2px_10px_rgba(52,211,153,0.3)]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>2. Control de Caja & Dinero ({transactions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-2 py-3 px-3 sm:px-4 border-b-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'catalog'
                ? 'border-ps-neon text-ps-neon'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>3. Catálogo & Servicios</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 py-3 px-3 sm:px-4 border-b-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-ps-neon text-ps-neon'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>4. Configuración del Negocio</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* ========================================================= */}
        {/* TAB 1: GESTIÓN DE TALLER (POR ORDEN DE LLEGADA) */}
        {/* ========================================================= */}
        {activeTab === 'repairs' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Metrics cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <div className="p-3.5 rounded-xl bg-ps-surface border border-ps-border">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Ingresos</span>
                <div className="text-xl sm:text-2xl font-bold font-gaming text-white mt-1">
                  {repairMetrics.total}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <span className="text-[11px] text-amber-400 uppercase font-semibold">En Fila</span>
                <div className="text-xl sm:text-2xl font-bold font-gaming text-amber-300 mt-1">
                  {repairMetrics.enFila}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-ps-blue/15 border border-ps-blue/40">
                <span className="text-[11px] text-ps-neon uppercase font-semibold">En Taller</span>
                <div className="text-xl sm:text-2xl font-bold font-gaming text-ps-neon mt-1">
                  {repairMetrics.enTaller}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40">
                <span className="text-[11px] text-emerald-400 uppercase font-semibold">Listos p/ Retirar</span>
                <div className="text-xl sm:text-2xl font-bold font-gaming text-emerald-300 mt-1">
                  {repairMetrics.listo}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Costo Total Fila</span>
                <div className="text-base sm:text-lg font-bold font-gaming text-ps-neon mt-1 truncate">
                  {formatARS(repairMetrics.totalFacturado)}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-ps-surface border border-ps-border">
              
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleOpenNewRepair}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-ps-blue to-ps-blueDark hover:from-ps-blueLight hover:to-ps-blue text-white font-bold text-xs flex items-center gap-2 shadow-ps-glow transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>REGISTRAR NUEVO INGRESO</span>
                </button>

                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                  {['ALL', 'En fila', 'En taller', 'Listo para retirar', 'Entregado'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setRepairFilterStatus(st)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        repairFilterStatus === st
                          ? 'bg-ps-blue text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {st === 'ALL' ? 'Todos' : st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por cliente, DNI, orden..."
                  value={repairSearchTerm}
                  onChange={(e) => setRepairSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-ps-neon"
                />
              </div>

            </div>

            {/* Repairs Queue Table / List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2 text-xs font-semibold text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-ps-neon" />
                  <span>Cola de Reparaciones (Orden estricto de llegada)</span>
                </span>
                <span>{filteredRepairs.length} orden(es) encontradas</span>
              </div>

              {filteredRepairs.length === 0 ? (
                <div className="text-center py-12 bg-ps-surface rounded-2xl border border-ps-border">
                  <p className="text-sm text-slate-400">No hay órdenes de reparación con estos criterios.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {filteredRepairs.map((repair, idx) => {
                    const statusConfig = REPAIR_STATUS_CONFIG[repair.status] || REPAIR_STATUS_CONFIG['En fila'];
                    const isReady = repair.status === 'Listo para retirar';
                    const whatsAppUrl = buildReadyWhatsAppUrl(repair, config.businessName);

                    return (
                      <div
                        key={repair.id}
                        className={`p-4 sm:p-5 rounded-2xl bg-ps-surface border transition-all ${
                          isReady ? 'border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'border-ps-border'
                        } flex flex-col lg:flex-row lg:items-center justify-between gap-4`}
                      >
                        {/* Order info & customer */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-ps-neon">
                              #{repair.id}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                              Puesto #{idx + 1}
                            </span>
                            <span className="text-xs text-slate-400">
                              {formatSimpleDate(repair.entryDate)} ({getRelativeTime(repair.entryDate)})
                            </span>
                          </div>

                          <div className="flex flex-wrap items-baseline gap-2">
                            <h4 className="text-base font-bold text-white">
                              {repair.device}
                            </h4>
                            <span className="text-xs text-slate-400">
                              • Cliente: <strong className="text-slate-200">{repair.clientName}</strong> (DNI: {repair.dni})
                            </span>
                            <span className="text-xs text-slate-400">
                              • Tel: <span className="font-mono text-slate-300">{repair.phone}</span>
                            </span>
                          </div>

                          <p className="text-xs text-slate-300 mt-1.5 flex items-start gap-1.5">
                            <strong className="text-slate-400 shrink-0">Falla:</strong>
                            <span className="truncate">{repair.issue}</span>
                          </p>

                          {repair.technicianNotes && (
                            <p className="text-[11px] text-slate-400 mt-1 italic">
                              Notas técnicas: {repair.technicianNotes}
                            </p>
                          )}
                        </div>

                        {/* Price & State Selector */}
                        <div className="flex flex-wrap lg:flex-col items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                          <div className="text-left lg:text-right">
                            <span className="text-[10px] text-slate-400 uppercase font-semibold">Presupuesto</span>
                            <div className="text-lg font-bold font-gaming text-ps-neon">
                              {formatARS(repair.cost)}
                            </div>
                          </div>

                          {/* Quick State Selector */}
                          <div className="flex items-center gap-2">
                            <select
                              value={repair.status}
                              onChange={(e) => updateRepairStatus(repair.id, e.target.value)}
                              className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${statusConfig.textColor} ${statusConfig.bgColor} ${statusConfig.borderColor}`}
                            >
                              <option value="En fila">En fila</option>
                              <option value="En taller">En taller</option>
                              <option value="Listo para retirar">Listo para retirar</option>
                              <option value="Entregado">Entregado</option>
                            </select>

                            <button
                              onClick={() => handleEditRepair(repair)}
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
                              title="Editar orden"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`¿Eliminar orden #${repair.id}?`)) {
                                  deleteRepair(repair.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800"
                              title="Eliminar orden"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {/* Fast Workshop Cash Checkout Button */}
                            {repair.isPaid ? (
                              <span className="px-3 py-1.5 rounded-xl font-bold text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Cobrado ({repair.paidMethod || 'Caja'}: {formatARS(repair.paidAmount || repair.cost)})</span>
                              </span>
                            ) : (
                              <button
                                onClick={() => handleOpenChargeRepairModal(repair)}
                                className="px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/25 transition-all"
                                title="Cobrar esta reparación y registrar automáticamente el dinero en Caja"
                              >
                                <DollarSign className="w-3.5 h-3.5 stroke-[2.5]" />
                                <span>Cobrar y Pasar a Caja</span>
                              </button>
                            )}

                            {/* Quick Receipt Copy Button */}
                            <button
                              onClick={() => handleCopyReceipt(repair)}
                              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                                copiedReceiptId === repair.id
                                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                                  : 'bg-ps-blue/20 hover:bg-ps-blue/30 text-ps-neon border border-ps-blue/40 hover:shadow-ps-glow'
                              }`}
                              title="Copiar comprobante de ingreso listo para enviar al cliente por WhatsApp"
                            >
                              {copiedReceiptId === repair.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  <span>¡Comprobante Copiado!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copiar Comprobante</span>
                                </>
                              )}
                            </button>

                            {/* WhatsApp Notification Button */}
                            <a
                              href={whatsAppUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                                isReady
                                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/25 animate-pulse'
                                  : 'bg-slate-800 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30'
                              }`}
                              title="Notificar al cliente por WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Avisar por WhatsApp</span>
                            </a>
                          </div>

                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: CONTROL DE DINERO & CAJA DIARIA */}
        {/* ========================================================= */}
        {activeTab === 'finances' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header & Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-ps-surface border border-ps-border">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    Control de Caja & Flujo de Dinero
                  </h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                    En Vivo
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Control diario de ingresos por venta de juegos y servicios de taller. Registro de Efectivo y Transferencias.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Cash Closure Button */}
                <button
                  onClick={() => setIsCashClosureModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-sky-400 border border-sky-500/30 hover:border-sky-500/60 shadow-sm transition-all cursor-pointer"
                  title="Generar resumen de cierre de caja para enviar por WhatsApp"
                >
                  <Receipt className="w-4 h-4 text-sky-400" />
                  <span>Cierre de Caja del Día</span>
                </button>

                {/* New Sale Button */}
                <button
                  onClick={() => handleOpenNewSale('juego')}
                  className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>+ Registrar Venta / Ingreso</span>
                </button>
              </div>
            </div>

            {/* Date Range Filter Bar */}
            <div className="p-3 sm:p-4 rounded-2xl bg-ps-surface border border-ps-border space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1">
                    <Calendar className="w-3.5 h-3.5 text-ps-neon" />
                    <span>Período:</span>
                  </span>

                  <button
                    onClick={() => setFinanceDateFilter('today')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      financeDateFilter === 'today'
                        ? 'bg-ps-blue text-white shadow-ps-glow'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border border-slate-800'
                    }`}
                  >
                    Hoy
                  </button>

                  <button
                    onClick={() => setFinanceDateFilter('yesterday')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      financeDateFilter === 'yesterday'
                        ? 'bg-ps-blue text-white shadow-ps-glow'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border border-slate-800'
                    }`}
                  >
                    Ayer
                  </button>

                  <button
                    onClick={() => setFinanceDateFilter('week')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      financeDateFilter === 'week'
                        ? 'bg-ps-blue text-white shadow-ps-glow'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border border-slate-800'
                    }`}
                  >
                    Últimos 7 días
                  </button>

                  <button
                    onClick={() => setFinanceDateFilter('month')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      financeDateFilter === 'month'
                        ? 'bg-ps-blue text-white shadow-ps-glow'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border border-slate-800'
                    }`}
                  >
                    Este Mes
                  </button>

                  <button
                    onClick={() => setFinanceDateFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      financeDateFilter === 'all'
                        ? 'bg-ps-blue text-white shadow-ps-glow'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border border-slate-800'
                    }`}
                  >
                    Todo el Histórico
                  </button>
                </div>

                {/* Custom Date Picker */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 hidden sm:inline">Fecha exacta:</span>
                  <input
                    type="date"
                    value={customFinanceDate}
                    onChange={(e) => {
                      setCustomFinanceDate(e.target.value);
                      setFinanceDateFilter('custom');
                    }}
                    className={`px-3 py-1 rounded-xl bg-slate-900 border text-xs text-slate-200 focus:outline-none focus:border-ps-neon cursor-pointer ${
                      financeDateFilter === 'custom' ? 'border-ps-neon text-ps-neon font-bold' : 'border-slate-800'
                    }`}
                  />
                </div>
              </div>

              {/* Status pill showing current filter */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-ps-border/50">
                <span>
                  Mostrando registros de: <strong className="text-emerald-400">{getDateFilterLabel()}</strong>
                </span>
                <span className="font-mono text-slate-400">
                  {periodTransactions.length} {periodTransactions.length === 1 ? 'movimiento' : 'movimientos'}
                </span>
              </div>
            </div>

            {/* 5 KPI Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {/* 1. Total General */}
              <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-ps-surface border border-ps-blue/30 relative overflow-hidden shadow-lg shadow-ps-blue/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Recaudado</span>
                  <div className="w-7 h-7 rounded-lg bg-ps-blue/20 text-ps-neon flex items-center justify-center">
                    <DollarSign className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
                  {formatARS(periodMetrics.totalGeneral)}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  <span>{periodTransactions.length} operaciones</span>
                </div>
              </div>

              {/* 2. Total Efectivo */}
              <div className="p-4 rounded-2xl bg-ps-surface border border-emerald-500/30 relative overflow-hidden shadow-lg shadow-emerald-500/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">💵 Efectivo (Caja)</span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Banknote className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono tracking-tight">
                  {formatARS(periodMetrics.totalEfectivo)}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  <strong className="text-emerald-300">{periodMetrics.efectivoPercent}%</strong> del total en mano
                </div>
              </div>

              {/* 3. Total Transferencia */}
              <div className="p-4 rounded-2xl bg-ps-surface border border-sky-500/30 relative overflow-hidden shadow-lg shadow-sky-500/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">📱 Transferencias</span>
                  <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-sky-400 font-mono tracking-tight">
                  {formatARS(periodMetrics.totalTransferencia)}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  <strong className="text-sky-300">{periodMetrics.transferenciaPercent}%</strong> MP / Banco
                </div>
              </div>

              {/* 4. Ventas de Juegos */}
              <div className="p-4 rounded-2xl bg-ps-surface border border-purple-500/30 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300">🎮 Juegos</span>
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center">
                    <Disc3 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
                  {formatARS(periodMetrics.totalJuegos)}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {periodMetrics.countJuegos} {periodMetrics.countJuegos === 1 ? 'juego vendido' : 'juegos vendidos'}
                </div>
              </div>

              {/* 5. Taller y Reparaciones */}
              <div className="p-4 rounded-2xl bg-ps-surface border border-amber-500/30 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">🔧 Taller</span>
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
                    <Wrench className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
                  {formatARS(periodMetrics.totalReparaciones)}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {periodMetrics.countReparaciones} {periodMetrics.countReparaciones === 1 ? 'servicio cobrado' : 'servicios cobrados'}
                </div>
              </div>
            </div>

            {/* Visual Distribution Bar (Efectivo vs Transferencia) */}
            <div className="p-4 rounded-2xl bg-ps-surface border border-ps-border space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                  <span className="text-slate-300">
                    Efectivo: <strong className="text-emerald-400">{formatARS(periodMetrics.totalEfectivo)}</strong> ({periodMetrics.efectivoPercent}%)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-sky-400 inline-block"></span>
                  <span className="text-slate-300">
                    Transferencias: <strong className="text-sky-400">{formatARS(periodMetrics.totalTransferencia)}</strong> ({periodMetrics.transferenciaPercent}%)
                  </span>
                </div>
              </div>

              <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden flex p-0.5 border border-slate-800">
                <div
                  style={{ width: `${periodMetrics.efectivoPercent}%` }}
                  className="h-full bg-emerald-500 rounded-l-full transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  title={`Efectivo: ${periodMetrics.efectivoPercent}%`}
                />
                <div
                  style={{ width: `${periodMetrics.transferenciaPercent}%` }}
                  className="h-full bg-sky-400 rounded-r-full transition-all duration-500 shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                  title={`Transferencias: ${periodMetrics.transferenciaPercent}%`}
                />
              </div>
            </div>

            {/* Search & Secondary Filter Bar */}
            <div className="p-4 rounded-2xl bg-ps-surface border border-ps-border flex flex-col md:flex-row items-center justify-between gap-3">
              {/* Search bar */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por juego, cliente, nota..."
                  value={financeSearchTerm}
                  onChange={(e) => setFinanceSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-ps-neon"
                />
              </div>

              {/* Rubro & Payment Method Filters */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                {/* Rubro filter */}
                <select
                  value={financeTypeFilter}
                  onChange={(e) => setFinanceTypeFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-ps-neon cursor-pointer"
                >
                  <option value="ALL">📦 Todos los Rubros</option>
                  <option value="juego">🎮 Solo Juegos</option>
                  <option value="reparacion">🔧 Solo Taller</option>
                  <option value="accesorio">🕹️ Accesorios & Consolas</option>
                </select>

                {/* Method filter */}
                <select
                  value={financeMethodFilter}
                  onChange={(e) => setFinanceMethodFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-ps-neon cursor-pointer"
                >
                  <option value="ALL">💳 Todos los Métodos</option>
                  <option value="Efectivo">💵 Solo Efectivo</option>
                  <option value="Transferencia">📱 Solo Transferencia</option>
                </select>
              </div>
            </div>

            {/* Transactions Feed / Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <PlayStationSymbolsRow className="scale-75 origin-left" />
                  <span>Detalle de Movimientos ({filteredTransactions.length})</span>
                </h3>
              </div>

              {filteredTransactions.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-ps-surface border border-ps-border">
                  <DollarSign className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-300">
                    No se encontraron ingresos para los filtros seleccionados.
                  </p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Selecciona otro período o registra una nueva venta mostrador para comenzar a sumar a la caja.
                  </p>
                  <button
                    onClick={() => handleOpenNewSale('juego')}
                    className="mt-4 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    + Registrar Venta Ahora
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredTransactions.map((tx) => {
                    const isEfectivo = tx.paymentMethod === 'Efectivo';
                    const isJuego = tx.type === 'juego';
                    const isReparacion = tx.type === 'reparacion';
                    const isConsola = tx.type === 'consola' || tx.type === 'accesorio';

                    return (
                      <div
                        key={tx.id}
                        className="p-3.5 sm:p-4 rounded-2xl bg-ps-surface border border-ps-border hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                      >
                        {/* Left: Time, Icon, Title and Details */}
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          {/* Icon badge */}
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                              isJuego
                                ? 'bg-ps-blue/20 text-ps-neon border border-ps-blue/30'
                                : isReparacion
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : isConsola
                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            {isJuego && <Disc3 className="w-5 h-5" />}
                            {isReparacion && <Wrench className="w-5 h-5" />}
                            {isConsola && <Gamepad className="w-5 h-5" />}
                            {!isJuego && !isReparacion && !isConsola && <DollarSign className="w-5 h-5" />}
                          </div>

                          {/* Info */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-0.5">
                              <span className="text-[11px] font-mono text-slate-400">
                                {formatTime(tx.date)}
                              </span>
                              <span className="text-[10px] text-slate-500">•</span>
                              <span className="text-[11px] text-slate-400">
                                {formatSimpleDate(tx.date)}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                  isJuego
                                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                    : isReparacion
                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                    : isConsola
                                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                    : 'bg-slate-800 text-slate-400 border-slate-700'
                                }`}
                              >
                                {tx.category || (isJuego ? 'Juegos' : isReparacion ? 'Taller' : 'Accesorios')}
                              </span>
                            </div>

                            <h4 className="text-sm font-bold text-white truncate group-hover:text-ps-neon transition-colors">
                              {tx.title}
                            </h4>

                            <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2 mt-0.5">
                              {tx.customer && tx.customer !== 'Cliente Mostrador' && (
                                <span className="text-slate-300">
                                  Cliente: <strong>{tx.customer}</strong>
                                </span>
                              )}
                              {tx.notes && (
                                <span className="text-slate-500 italic truncate max-w-md">
                                  {tx.notes}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right: Payment Method Badge, Amount & Actions */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-ps-border/50 shrink-0">
                          {/* Payment Method Pill */}
                          <div
                            className={`px-2.5 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${
                              isEfectivo
                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                                : 'bg-sky-500/15 text-sky-400 border-sky-500/40 shadow-sm shadow-sky-500/10'
                            }`}
                          >
                            {isEfectivo ? (
                              <>
                                <Banknote className="w-3.5 h-3.5" />
                                <span>💵 Efectivo</span>
                              </>
                            ) : (
                              <>
                                <CreditCard className="w-3.5 h-3.5" />
                                <span>📱 Transferencia</span>
                              </>
                            )}
                          </div>

                          {/* Amount */}
                          <div className="text-right">
                            <div className="text-base sm:text-lg font-black text-emerald-400 font-mono tracking-tight">
                              +{formatARS(tx.amount)}
                            </div>
                          </div>

                          {/* Delete action */}
                          <button
                            onClick={() => {
                              if (window.confirm(`¿Anular/eliminar este ingreso de ${formatARS(tx.amount)} (${tx.title})?`)) {
                                deleteTransaction(tx.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 border border-slate-800 transition-colors cursor-pointer"
                            title="Eliminar movimiento de caja"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: GESTIÓN DE CATÁLOGO & SERVICIOS */}
        {/* ========================================================= */}
        {activeTab === 'catalog' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Sub-tab switch */}
            <div className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-ps-surface border border-ps-border">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCatalogSubTab('products')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    catalogSubTab === 'products'
                      ? 'bg-ps-blue text-white shadow-ps-glow'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  🎮 Productos ({products.length})
                </button>
                <button
                  onClick={() => setCatalogSubTab('services')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    catalogSubTab === 'services'
                      ? 'bg-ps-blue text-white shadow-ps-glow'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  🛠️ Servicios Técnicos ({services.length})
                </button>
              </div>

              {catalogSubTab === 'products' ? (
                <button
                  onClick={handleOpenNewProduct}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-ps-blue to-ps-blueDark hover:from-ps-blueLight hover:to-ps-blue text-white text-xs font-bold flex items-center gap-1.5 shadow-ps-glow"
                >
                  <Plus className="w-4 h-4" />
                  <span>AGREGAR PRODUCTO</span>
                </button>
              ) : (
                <button
                  onClick={handleOpenNewService}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-ps-blue to-ps-blueDark hover:from-ps-blueLight hover:to-ps-blue text-white text-xs font-bold flex items-center gap-1.5 shadow-ps-glow"
                >
                  <Plus className="w-4 h-4" />
                  <span>AGREGAR SERVICIO</span>
                </button>
              )}
            </div>

            {/* Hidden Input for 1-Click Quick Photo Change */}
            <input
              type="file"
              ref={quickPhotoInputRef}
              accept="image/*"
              onChange={handleExecuteQuickPhoto}
              className="hidden"
            />

            {/* Products Table/List with 1-Click Quick Edits */}
            {catalogSubTab === 'products' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((prod) => {
                  const isGame = prod.category === 'juegos_ps4' || prod.category === 'juegos_ps3';
                  const isPS4Game = prod.category === 'juegos_ps4';
                  const isEditingPrice = editingPriceId === prod.id;

                  return (
                    <div
                      key={prod.id}
                      className="p-4 rounded-2xl bg-ps-surface border border-ps-border flex flex-col justify-between hover:border-ps-neon/40 transition-all"
                    >
                      <div>
                        {/* Thumbnail: If game, display physical box header */}
                        {isGame ? (
                          <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950 mb-3 relative group">
                            {/* Tape */}
                            {isPS4Game ? (
                              <div className="bg-[#0070d1] text-white px-2 py-0.5 flex items-center justify-between text-[11px] font-bold font-gaming">
                                <span>PS4</span>
                                <span className="text-[8px] opacity-80">Blu-ray</span>
                              </div>
                            ) : (
                              <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-red-700 text-white px-2 py-0.5 flex items-center justify-between text-[11px] font-bold font-gaming border-b border-red-500/30">
                                <span className="text-red-100">PS3</span>
                                <span className="text-[8px] opacity-80 text-red-200">Blu-ray</span>
                              </div>
                            )}

                            <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-900">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80";
                                }}
                              />
                              <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-white/30 to-transparent pointer-events-none" />
                              
                              <span className="absolute top-1.5 left-1.5 text-[9px] px-1.5 py-0.5 rounded bg-black/90 text-ps-neon font-black border border-ps-neon/40">
                                FÍSICO
                              </span>

                              {/* Yellow Price Badge */}
                              <div className="absolute bottom-1 right-1">
                                <span className="text-[11px] font-black px-1.5 py-0.5 rounded bg-[#facc15] text-black border border-black font-gaming">
                                  {formatARS(prod.price)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 mb-3 border border-slate-800">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "https://images.unsplash.com/photo-1507457379470-08b800bebc67?auto=format&fit=crop&w=800&q=80";
                              }}
                            />
                            <span className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded bg-ps-bg/90 text-ps-neon border border-ps-neon/30 font-bold uppercase">
                              {prod.tag || prod.category}
                            </span>
                          </div>
                        )}

                        <h4 className="text-sm font-bold text-white line-clamp-1" title={prod.name}>
                          {prod.name}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {prod.condition || prod.description || 'Garantizado en tienda'}
                        </p>
                      </div>

                      <div className="mt-3 pt-3 border-t border-ps-border/70 space-y-2.5">
                        
                        {/* 1-CLICK QUICK PRICE EDIT */}
                        <div className="flex items-center justify-between">
                          {isEditingPrice ? (
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-bold text-ps-neon">$</span>
                              <input
                                type="number"
                                value={tempPriceValue}
                                onChange={(e) => setTempPriceValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveQuickPrice(prod.id);
                                  if (e.key === 'Escape') setEditingPriceId(null);
                                }}
                                autoFocus
                                className="w-24 px-1.5 py-0.5 rounded bg-slate-900 border border-ps-neon text-xs font-bold text-white font-mono focus:outline-none"
                              />
                              <button
                                onClick={() => handleSaveQuickPrice(prod.id)}
                                className="p-1 rounded bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                                title="Guardar nuevo precio"
                              >
                                <Check className="w-3 h-3 stroke-[3]" />
                              </button>
                              <button
                                onClick={() => setEditingPriceId(null)}
                                className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                                title="Cancelar"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <div className="text-sm font-bold font-gaming text-ps-neon">
                                {formatARS(prod.price)}
                              </div>
                              <button
                                onClick={() => handleStartEditPrice(prod)}
                                className="p-1 rounded text-slate-500 hover:text-ps-neon hover:bg-slate-800 transition-colors"
                                title="Editar precio en 1 clic"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                            </div>
                          )}

                          <div className="text-[10px] text-slate-400">
                            Stock: <strong className={prod.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}>{prod.stock}</strong>
                          </div>
                        </div>

                        {/* QUICK ACTIONS ROW: Change photo in 1 click, Toggle stock, Edit, Delete */}
                        <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-800/80">
                          {/* 1-Click Change Photo */}
                          <button
                            onClick={() => handleTriggerQuickPhoto(prod.id)}
                            className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-ps-neon flex items-center gap-1 transition-all"
                            title="Cambiar foto de carátula en 1 clic (Canvas máx 600px)"
                          >
                            <Camera className="w-3 h-3 text-ps-neon" />
                            <span>Foto</span>
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => toggleProductStock(prod.id)}
                              className={`px-2 py-1 rounded text-[10px] font-semibold border ${
                                prod.stock > 0
                                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                  : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                              }`}
                              title="Alternar stock rápido"
                            >
                              {prod.stock > 0 ? 'Pausar' : 'Activar'}
                            </button>
                            <button
                              onClick={() => handleEditProduct(prod)}
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white"
                              title="Editar completo"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`¿Eliminar ${prod.name}?`)) {
                                  deleteProduct(prod.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400"
                              title="Eliminar producto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              /* Services List */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((serv) => (
                  <div
                    key={serv.id}
                    className="p-5 rounded-2xl bg-ps-surface border border-ps-border flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-ps-neon uppercase">
                            {serv.platform || 'Servicio General'}
                          </span>
                          <h4 className="text-base font-bold text-white mt-0.5">
                            {serv.title}
                          </h4>
                          <p className="text-xs text-slate-400 mt-1">
                            {serv.subtitle}
                          </p>
                        </div>
                        <span className="text-lg font-bold font-gaming text-ps-neon">
                          {formatARS(serv.price)}
                        </span>
                      </div>

                      {Array.isArray(serv.includes) && serv.includes.length > 0 && (
                        <div className="mt-3 text-xs text-slate-300 space-y-1">
                          {serv.includes.slice(0, 3).map((item, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                              <span className="text-emerald-400">•</span>
                              <span className="truncate">{item}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-ps-border/70 flex items-center justify-between text-xs text-slate-400">
                      <span>Demora: {serv.turnaround || '24-48 hs'}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditService(serv)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" /> Editar
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`¿Eliminar ${serv.title}?`)) {
                              deleteService(serv.id);
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-rose-950/40 text-rose-400 flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: CONFIGURACIÓN DEL NEGOCIO */}
        {/* ========================================================= */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
            
            <div className="p-6 rounded-2xl bg-ps-surface border border-ps-border">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-ps-border">
                <div className="p-3 rounded-xl bg-ps-blue/20 text-ps-neon">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-gaming tracking-wide">
                    DATOS DEL NEGOCIO - EL REY PLAY
                  </h3>
                  <p className="text-xs text-slate-400">
                    Modifica los datos comerciales visibles en el header, comprobantes y WhatsApp.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveConfig} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nombre del Negocio
                  </label>
                  <input
                    type="text"
                    value={configForm.businessName}
                    onChange={(e) => setConfigForm(prev => ({ ...prev, businessName: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-ps-neon"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Número de WhatsApp Receptor de Pedidos (con código de país)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={configForm.whatsappNumber}
                      onChange={(e) => setConfigForm(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                      placeholder="5493865000000"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white font-mono focus:outline-none focus:border-ps-neon"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Formato internacional sin signos (ej: 5493865000000 para Tucumán, Argentina).
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Dirección del Local
                  </label>
                  <input
                    type="text"
                    value={configForm.address}
                    onChange={(e) => setConfigForm(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-ps-neon"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Horarios de Atención
                  </label>
                  <input
                    type="text"
                    value={configForm.businessHours}
                    onChange={(e) => setConfigForm(prev => ({ ...prev, businessHours: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-ps-neon"
                  />
                </div>

                <div className="pt-4 border-t border-ps-border">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-ps-neon" />
                    <span>Cambiar PIN de Administrador (Actual: {config.adminPin})</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Nuevo PIN Numérico</label>
                      <input
                        type="password"
                        maxLength={8}
                        placeholder="••••"
                        value={configForm.newPin}
                        onChange={(e) => setConfigForm(prev => ({ ...prev, newPin: e.target.value.replace(/[^0-9]/g, '') }))}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white font-mono text-center tracking-widest focus:outline-none focus:border-ps-neon"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Confirmar Nuevo PIN</label>
                      <input
                        type="password"
                        maxLength={8}
                        placeholder="••••"
                        value={configForm.confirmPin}
                        onChange={(e) => setConfigForm(prev => ({ ...prev, confirmPin: e.target.value.replace(/[^0-9]/g, '') }))}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white font-mono text-center tracking-widest focus:outline-none focus:border-ps-neon"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-ps-blue to-ps-blueDark hover:from-ps-blueLight hover:to-ps-blue text-white font-bold text-sm tracking-wide shadow-ps-glow transition-all flex items-center justify-center gap-2 mt-4"
                >
                  <Save className="w-4 h-4" />
                  <span>GUARDAR CONFIGURACIÓN</span>
                </button>
              </form>
            </div>

            {/* Factory Reset Seed Data Button */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-950/30 via-slate-900 to-rose-950/20 border-2 border-rose-500/40 shadow-lg shadow-rose-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
                    <RotateCcw className="w-5 h-5 animate-spin-slow" />
                  </span>
                  <h4 className="text-base font-bold text-white font-gaming tracking-wide">
                    RESTAURAR DATOS DE FÁBRICA / DEMO
                  </h4>
                </div>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                  Si durante la demostración en vivo se alteraron productos, reparaciones, precios o configuración, usá este botón para restablecer inmediatamente todos los datos originales iniciales en <code className="text-ps-neon bg-slate-900 px-1 py-0.5 rounded font-mono">localStorage</code>.
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-rose-300 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Restaura: 8 productos gaming, 4 servicios técnicos, 3 reparaciones y PIN 2020.</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleConfirmReset}
                className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-extrabold tracking-wider shadow-lg shadow-rose-600/30 transition-all whitespace-nowrap flex items-center justify-center gap-2 group cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 group-hover:-rotate-90 transition-transform duration-300" />
                <span>RESTAURAR DATOS DE FÁBRICA</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* MODAL: REGISTRAR / EDITAR REPARACIÓN */}
      {/* ========================================================= */}
      {isNewRepairModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsNewRepairModalOpen(false)}
          />

          <div className="relative w-full max-w-lg rounded-2xl bg-ps-surface border-2 border-ps-border shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-ps-border mb-4">
              <h3 className="text-base font-bold text-white font-gaming tracking-wide flex items-center gap-2">
                <Wrench className="w-5 h-5 text-ps-neon" />
                <span>{editingRepair ? `Editar Orden #${editingRepair.id}` : 'Registrar Nuevo Ingreso de Taller'}</span>
              </h3>
              <button
                onClick={() => setIsNewRepairModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRepair} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre del Cliente *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Lucas Gómez"
                    value={repairForm.clientName}
                    onChange={(e) => setRepairForm(prev => ({ ...prev, clientName: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-ps-neon"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">DNI del Cliente *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: 38111222"
                    value={repairForm.dni}
                    onChange={(e) => setRepairForm(prev => ({ ...prev, dni: e.target.value.replace(/[^0-9]/g, '') }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-ps-neon"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="Ej: 5493865112233"
                    value={repairForm.phone}
                    onChange={(e) => setRepairForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-ps-neon"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Equipo / Consola *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: PS4 Fat 500GB o 2x Joysticks"
                    value={repairForm.device}
                    onChange={(e) => setRepairForm(prev => ({ ...prev, device: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-ps-neon"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Falla Reportada por el Cliente *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ej: Calienta mucho y se apaga a los 10 minutos de jugar"
                  value={repairForm.issue}
                  onChange={(e) => setRepairForm(prev => ({ ...prev, issue: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-ps-neon"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Costo Estimado (ARS)</label>
                  <input
                    type="number"
                    placeholder="25000"
                    value={repairForm.cost}
                    onChange={(e) => setRepairForm(prev => ({ ...prev, cost: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-ps-neon"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Estado</label>
                  <select
                    value={repairForm.status}
                    onChange={(e) => setRepairForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-ps-neon cursor-pointer"
                  >
                    <option value="En fila">En fila</option>
                    <option value="En taller">En taller</option>
                    <option value="Listo para retirar">Listo para retirar</option>
                    <option value="Entregado">Entregado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notas Técnicas Internas</label>
                <textarea
                  rows={2}
                  placeholder="Detalles de diagnóstico, insumos utilizados o componentes a ordenar..."
                  value={repairForm.technicianNotes}
                  onChange={(e) => setRepairForm(prev => ({ ...prev, technicianNotes: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-ps-neon"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-ps-border">
                <button
                  type="button"
                  onClick={() => setIsNewRepairModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-ps-blue hover:bg-ps-blueLight text-white font-bold text-xs shadow-ps-glow"
                >
                  {editingRepair ? 'Guardar Cambios' : 'Registrar Ingreso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CARGADOR RÁPIDO DE JUEGOS Y PRODUCTOS (SIDE-BY-SIDE) */}
      {/* ========================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            onClick={() => setIsProductModalOpen(false)}
          />

          <div className="relative w-full max-w-4xl rounded-2xl bg-ps-surface border-2 border-ps-border shadow-2xl p-4 sm:p-7 max-h-[95vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-ps-border mb-6">
              <div>
                <h3 className="text-lg font-bold text-white font-gaming tracking-wide flex items-center gap-2">
                  <Package className="w-5 h-5 text-ps-neon" />
                  <span>{editingProduct ? 'Editar Producto / Juego' : 'Cargador Rápido de Juegos & Catálogo'}</span>
                  <PlayStationSymbolsRow size="w-3 h-3" spacing="space-x-1" />
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Completa los campos y previsualiza la caja física Blu-ray en vivo al costado antes de guardar.
                </p>
              </div>

              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SIDE-BY-SIDE GRID: FORM (LEFT) + LIVE PREVIEW (RIGHT) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT COLUMN: THE FORM */}
              <form onSubmit={handleSaveProduct} className="lg:col-span-7 space-y-4">
                
                {/* 1. Consola / Categoría (Quick Selector) */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    1. Consola / Categoría *
                  </label>
                  
                  {/* Quick Pills for Games */}
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setProductForm(prev => ({ ...prev, category: 'juegos_ps4', tag: prev.tag || 'Físico Usado' }))}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                        productForm.category === 'juegos_ps4'
                          ? 'bg-[#0070d1] border-cyan-400 text-white shadow-ps-glow'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span>🎮 Juego PS4 (Físico)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setProductForm(prev => ({ ...prev, category: 'juegos_ps3', tag: prev.tag || 'Físico Usado' }))}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                        productForm.category === 'juegos_ps3'
                          ? 'bg-gradient-to-r from-neutral-900 to-red-700 border-red-500 text-white shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span>🕹️ Juego PS3 (Físico)</span>
                    </button>
                  </div>

                  {/* Dropdown for other categories */}
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-ps-neon cursor-pointer"
                  >
                    <option value="juegos_ps4">🎮 Juegos PS4 (Físicos)</option>
                    <option value="juegos_ps3">🕹️ Juegos PS3 (Físicos)</option>
                    <option value="consolas_ps4">📺 Consolas PS4</option>
                    <option value="consolas_ps3">🖥️ Consolas PS3</option>
                    <option value="accesorios">🎧 Joysticks y Accesorios</option>
                  </select>
                </div>

                {/* 2. Nombre del Juego */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    2. Nombre del Juego / Título *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: God of War Ragnarök o EA Sports FC 24"
                    value={productForm.name}
                    onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-ps-neon"
                  />
                </div>

                {/* 3. Precio ($ ARS) y Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1">
                      3. Precio ($ ARS) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ps-neon font-bold text-xs">$</span>
                      <input
                        type="number"
                        required
                        placeholder="42000"
                        value={productForm.price}
                        onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono font-bold focus:outline-none focus:border-ps-neon"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1">
                      Stock Disponible
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={productForm.stock}
                      onChange={(e) => setProductForm(prev => ({ ...prev, stock: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-ps-neon"
                    />
                  </div>
                </div>

                {/* 4. Foto de la Carátula (Canvas 600px, JPEG 0.75) */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
                  <label className="block text-xs font-bold text-white flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-ps-neon" />
                      <span>4. Foto de la Carátula</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">Máx 600px • Canvas</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* File upload from mobile/PC */}
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        disabled={isCompressingImage}
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2 px-3 rounded-xl bg-ps-blue/20 hover:bg-ps-blue/30 border border-ps-blue/50 text-ps-neon text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                      >
                        {isCompressingImage ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-ps-neon" />
                            <span>Comprimiendo...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            <span>Subir desde Celular/PC</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Paste URL */}
                    <div>
                      <input
                        type="url"
                        placeholder="O pegar URL web de portada"
                        value={productForm.image.startsWith('data:') ? '' : productForm.image}
                        onChange={(e) => {
                          setProductForm(prev => ({ ...prev, image: e.target.value }));
                          setCompressionDetails(null);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-ps-neon"
                      />
                    </div>
                  </div>

                  {compressionDetails && (
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-300 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        <span>Comprimido en Canvas:</span>
                      </span>
                      <span className="font-mono">
                        {compressionDetails.originalSizeKb} KB ➔ <strong>{compressionDetails.compressedSizeKb} KB</strong> ({compressionDetails.dimensions})
                      </span>
                    </div>
                  )}
                </div>

                {/* 5. Formato y Condición */}
                {productForm.category === 'juegos_ps4' || productForm.category === 'juegos_ps3' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Estado de Venta</label>
                      <select
                        value={productForm.format || 'Físico Usado'}
                        onChange={(e) => setProductForm(prev => ({ ...prev, format: e.target.value, tag: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-ps-neon cursor-pointer"
                      >
                        <option value="Físico Usado Impecable">💿 Físico Usado Impecable</option>
                        <option value="Físico Usado">💿 Físico Usado</option>
                        <option value="Físico Nuevo Sellado">✨ Físico Nuevo Sellado</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Detalle de Caja/Disco</label>
                      <input
                        type="text"
                        placeholder="Ej: Caja Original, Disco 10/10, Con Mapa..."
                        value={productForm.condition || ''}
                        onChange={(e) => setProductForm(prev => ({ ...prev, condition: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-ps-neon"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Modelo / Capacidad</label>
                      <input
                        type="text"
                        placeholder="Ej: Slim 1TB o Alternativo AAA"
                        value={productForm.model || productForm.capacity || ''}
                        onChange={(e) => setProductForm(prev => ({ ...prev, model: e.target.value, capacity: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-ps-neon"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Sistema / Estado</label>
                      <input
                        type="text"
                        placeholder="Ej: Original / Con HEN"
                        value={productForm.systemStatus || productForm.type || ''}
                        onChange={(e) => setProductForm(prev => ({ ...prev, systemStatus: e.target.value, type: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-ps-neon"
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-ps-border">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-semibold"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-ps-blue to-ps-blueDark hover:from-ps-blueLight hover:to-ps-blue text-white font-extrabold text-xs tracking-wide shadow-ps-glow transition-all"
                  >
                    {editingProduct ? 'Guardar Cambios' : 'Guardar y Publicar'}
                  </button>
                </div>
              </form>

              {/* RIGHT COLUMN: VISTA PREVIA EN VIVO (AL COSTADO DEL FORMULARIO) */}
              <div className="lg:col-span-5 bg-slate-950/90 rounded-2xl p-4 sm:p-5 border border-ps-border flex flex-col items-center sticky top-2 shadow-xl">
                
                <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[11px] font-bold text-white font-gaming tracking-wider uppercase">
                      Vista Previa en Vivo
                    </span>
                  </div>
                  <span className="text-[10px] text-ps-neon font-mono bg-ps-blue/15 px-2 py-0.5 rounded border border-ps-blue/30">
                    Tiempo Real
                  </span>
                </div>

                {/* Real-time Assembled Blu-ray Game Box */}
                {productForm.category === 'juegos_ps4' || productForm.category === 'juegos_ps3' ? (
                  <div className="w-48 sm:w-52 rounded-xl bg-ps-surface border border-ps-border shadow-2xl overflow-hidden animate-fadeIn">
                    
                    {/* Simulated Case Shell */}
                    <div className="p-2 bg-gradient-to-b from-slate-900 to-ps-surface">
                      <div className={`rounded-lg overflow-hidden border-2 ${
                        productForm.category === 'juegos_ps4'
                          ? 'border-[#0070d1]/70 shadow-[0_0_15px_rgba(0,112,209,0.35)]'
                          : 'border-red-800/70 shadow-[0_0_15px_rgba(185,28,28,0.25)]'
                      } bg-slate-950`}>
                        
                        {/* Tape Header */}
                        {productForm.category === 'juegos_ps4' ? (
                          <div className="bg-[#0070d1] text-white px-2 py-1 flex items-center justify-between shadow-md">
                            <span className="font-extrabold text-xs tracking-wider font-gaming">PS4</span>
                            <span className="text-[8px] uppercase tracking-wider opacity-85 font-mono">Blu-ray</span>
                          </div>
                        ) : (
                          <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-red-700 text-white px-2 py-1 flex items-center justify-between shadow-md border-b border-red-500/40">
                            <span className="font-extrabold text-xs tracking-wider font-gaming text-red-100">PS3</span>
                            <span className="text-[8px] uppercase tracking-wider text-red-200 font-mono">Blu-ray</span>
                          </div>
                        )}

                        {/* Cover Image in 3/4 ratio */}
                        <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-900">
                          <img
                            src={productForm.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80'}
                            alt="Vista previa caja"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80";
                            }}
                          />

                          {/* Spine Sheen */}
                          <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-white/35 via-white/10 to-transparent pointer-events-none z-10" />

                          {/* Top "Físico" Badge */}
                          <div className="absolute top-1.5 left-1.5 z-20">
                            <span className="text-[9px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded shadow bg-slate-950/90 text-ps-neon border border-ps-neon/60">
                              FÍSICO
                            </span>
                          </div>

                          {/* Yellow Retail Price Splash */}
                          <div className="absolute bottom-1.5 right-1.5 z-20">
                            <div className="bg-[#facc15] text-neutral-950 px-2 py-0.5 rounded-lg shadow-2xl border-2 border-black rotate-[-2deg]">
                              <div className="text-[7px] font-black uppercase text-red-700 leading-none">OFERTA</div>
                              <div className="text-xs sm:text-sm font-black font-gaming leading-tight">
                                {formatARS(productForm.price || 42000)}
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Card Footer Title & Simulated Button */}
                    <div className="p-2.5 bg-ps-surface border-t border-slate-800">
                      <h4 className="text-xs font-bold text-white truncate">
                        {productForm.name || 'Nombre del Juego'}
                      </h4>
                      <div className="text-[10px] text-slate-400 truncate">
                        {productForm.condition || productForm.format || 'Físico Usado Impecable'}
                      </div>
                      <div className="mt-2 w-full py-1.5 rounded-lg bg-ps-blue/40 border border-ps-blue/50 text-white text-[10px] font-bold text-center">
                        Agregar al Carrito
                      </div>
                    </div>

                  </div>
                ) : (
                  /* Live Console / Accessory Wide Preview */
                  <div className="w-full rounded-2xl bg-ps-surface border border-ps-border p-4 shadow-xl">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 mb-3 border border-slate-800">
                      <img
                        src={productForm.image || 'https://images.unsplash.com/photo-1507457379470-08b800bebc67?auto=format&fit=crop&w=800&q=80'}
                        alt="Vista previa consola"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://images.unsplash.com/photo-1507457379470-08b800bebc67?auto=format&fit=crop&w=800&q=80";
                        }}
                      />
                      <span className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded bg-black/80 text-ps-neon font-bold">
                        {productForm.category}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white truncate">
                      {productForm.name || 'Título de Consola / Accesorio'}
                    </h4>
                    
                    <div className="text-base font-bold font-gaming text-ps-neon mt-2">
                      {formatARS(productForm.price || 0)}
                    </div>
                  </div>
                )}

                <p className="text-[11px] text-slate-500 text-center mt-3">
                  💡 Los cambios que hagas en el formulario se reflejan instantáneamente aquí.
                </p>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: AGREGAR / EDITAR SERVICIO TÉCNICO */}
      {/* ========================================================= */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsServiceModalOpen(false)}
          />

          <div className="relative w-full max-w-lg rounded-2xl bg-ps-surface border-2 border-ps-border shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-ps-border mb-4">
              <h3 className="text-base font-bold text-white font-gaming tracking-wide flex items-center gap-2">
                <Wrench className="w-5 h-5 text-ps-neon" />
                <span>{editingService ? 'Editar Servicio Técnico' : 'Crear Nuevo Servicio'}</span>
              </h3>
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Título del Servicio *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Mantenimiento Completo PS4"
                  value={serviceForm.title}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-ps-neon"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subtítulo / Breve resumen</label>
                <input
                  type="text"
                  placeholder="Ej: Limpieza ultrasonido + Pasta Térmica Arctic MX-4"
                  value={serviceForm.subtitle}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-ps-neon"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Precio Base (ARS) *</label>
                  <input
                    type="number"
                    required
                    placeholder="25000"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-ps-neon"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Demora Estimada</label>
                  <input
                    type="text"
                    placeholder="Ej: 24 a 48 hs"
                    value={serviceForm.turnaround}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, turnaround: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-ps-neon"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Plataforma / Dispositivo</label>
                <input
                  type="text"
                  placeholder="Ej: PS4 (Fat / Slim / Pro)"
                  value={serviceForm.platform}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, platform: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-ps-neon"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Qué incluye (Uno por línea)</label>
                <textarea
                  rows={3}
                  placeholder="Desarme completo y ultrasonido&#10;Pasta Arctic MX-4&#10;Garantía escrita de 60 días"
                  value={serviceForm.includes}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, includes: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-ps-neon"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-ps-border">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-ps-blue hover:bg-ps-blueLight text-white font-bold text-xs shadow-ps-glow"
                >
                  {editingService ? 'Guardar Cambios' : 'Crear Servicio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: REGISTRAR VENTA / INGRESO DE CAJA */}
      {/* ========================================================= */}
      {isNewSaleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-ps-surface border border-ps-border rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-ps-border mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Plus className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Registrar Ingreso en Caja</h3>
                  <p className="text-xs text-slate-400">Suma inmediatamente al total del día</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewSaleModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSale} className="space-y-4">
              {/* Type Switcher */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  ¿Qué estás cobrando?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setSaleForm(prev => ({ ...prev, type: 'juego', category: 'Venta de Juegos', catalogProductId: '', selectedRepairId: '' }))}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      saleForm.type === 'juego'
                        ? 'bg-ps-blue/20 text-ps-neon border-ps-neon shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Disc3 className="w-4 h-4" />
                    <span>Juego</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSaleForm(prev => ({ ...prev, type: 'reparacion', category: 'Servicio Técnico', catalogProductId: '', selectedRepairId: '' }))}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      saleForm.type === 'reparacion'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Wrench className="w-4 h-4" />
                    <span>Taller</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSaleForm(prev => ({ ...prev, type: 'accesorio', category: 'Consolas & Accesorios', catalogProductId: '', selectedRepairId: '' }))}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      saleForm.type === 'accesorio' || saleForm.type === 'consola'
                        ? 'bg-purple-500/20 text-purple-400 border-purple-500 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Gamepad className="w-4 h-4" />
                    <span>Accesorio</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSaleForm(prev => ({ ...prev, type: 'otro', category: 'Otros Ingresos', catalogProductId: '', selectedRepairId: '' }))}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      saleForm.type === 'otro'
                        ? 'bg-slate-800 text-white border-slate-600 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Varios</span>
                  </button>
                </div>
              </div>

              {/* Fast Selector from Catalog (if Game) */}
              {saleForm.type === 'juego' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Cargar juego rápido del catálogo (opcional)
                  </label>
                  <select
                    value={saleForm.catalogProductId}
                    onChange={(e) => handleSelectCatalogProduct(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-ps-neon cursor-pointer"
                  >
                    <option value="">-- Seleccionar juego del catálogo --</option>
                    {products.filter(p => p.category === 'juegos_ps4' || p.category === 'juegos_ps3').map(p => (
                      <option key={p.id} value={p.id}>
                        {p.category === 'juegos_ps4' ? '🎮 [PS4]' : '🎮 [PS3]'} {p.name} - {formatARS(p.price)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Fast Selector from Workshop (if Repair) */}
              {saleForm.type === 'reparacion' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Vincular orden de taller (opcional)
                  </label>
                  <select
                    value={saleForm.selectedRepairId}
                    onChange={(e) => handleSelectPendingRepair(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-ps-neon cursor-pointer"
                  >
                    <option value="">-- Seleccionar orden pendiente --</option>
                    {repairs.filter(r => !r.isPaid).map(r => (
                      <option key={r.id} value={r.id}>
                        🔧 Orden #{r.id} - {r.clientName} ({r.device}) - {formatARS(r.cost)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Title / Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Concepto / ¿Qué se vendió o cobró? *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: God of War Ragnarök (PS4) / Mantenimiento PS4"
                  value={saleForm.title}
                  onChange={(e) => setSaleForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-ps-neon"
                />
              </div>

              {/* Amount ($ ARS) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Monto Cobrado (ARS) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">$</span>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="45000"
                    value={saleForm.amount}
                    onChange={(e) => setSaleForm(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm font-black font-mono text-emerald-400 placeholder-slate-600 focus:outline-none focus:border-ps-neon"
                  />
                </div>
                {saleForm.amount && Number(saleForm.amount) > 0 && (
                  <p className="text-[11px] text-emerald-400 font-mono mt-1">
                    Equivale a: <strong>{formatARS(Number(saleForm.amount))}</strong>
                  </p>
                )}
              </div>

              {/* Payment Method Selector (Big Cards) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Método de Pago *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSaleForm(prev => ({ ...prev, paymentMethod: 'Efectivo' }))}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      saleForm.paymentMethod === 'Efectivo'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500 shadow-md shadow-emerald-500/10 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Banknote className="w-4 h-4" />
                    <span className="text-xs">💵 Efectivo (Caja)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSaleForm(prev => ({ ...prev, paymentMethod: 'Transferencia' }))}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      saleForm.paymentMethod === 'Transferencia'
                        ? 'bg-sky-500/20 text-sky-400 border-sky-500 shadow-md shadow-sky-500/10 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="text-xs">📱 Transferencia (MP/Banco)</span>
                  </button>
                </div>
              </div>

              {/* Customer Name & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nombre del Cliente
                  </label>
                  <input
                    type="text"
                    placeholder="Cliente Mostrador"
                    value={saleForm.customer}
                    onChange={(e) => setSaleForm(prev => ({ ...prev, customer: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-ps-neon"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Notas adicionales (opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Con mapa / Garantía 30 días"
                    value={saleForm.notes}
                    onChange={(e) => setSaleForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-ps-neon"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-ps-border">
                <button
                  type="button"
                  onClick={() => setIsNewSaleModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  Guardar en Caja
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: COBRAR ORDEN DE TALLER Y PASAR A CAJA */}
      {/* ========================================================= */}
      {chargingRepairOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-ps-surface border border-ps-border rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-ps-border mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Cobrar Orden #{chargingRepairOrder.id}
                  </h3>
                  <p className="text-xs text-slate-400">Registrar cobro directo en la caja de hoy</p>
                </div>
              </div>
              <button
                onClick={() => setChargingRepairOrder(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmChargeRepair} className="space-y-4">
              {/* Order summary info */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Cliente:</span>
                  <strong className="text-white">{chargingRepairOrder.clientName}</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Equipo:</span>
                  <span className="text-slate-200">{chargingRepairOrder.device}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Falla:</span>
                  <span className="text-slate-400 truncate max-w-[200px]">{chargingRepairOrder.issue}</span>
                </div>
              </div>

              {/* Amount to charge */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Monto a Cobrar ($ ARS)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">$</span>
                  <input
                    type="number"
                    required
                    min="1"
                    value={chargeRepairAmount}
                    onChange={(e) => setChargeRepairAmount(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm font-black font-mono text-emerald-400 focus:outline-none focus:border-ps-neon"
                  />
                </div>
                <p className="text-[11px] text-emerald-400 font-mono mt-1">
                  Total: <strong>{formatARS(Number(chargeRepairAmount) || chargingRepairOrder.cost)}</strong>
                </p>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  ¿Cómo pagó el cliente? *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setChargeRepairMethod('Efectivo')}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      chargeRepairMethod === 'Efectivo'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500 shadow-md font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Banknote className="w-4 h-4" />
                    <span className="text-xs">💵 Efectivo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChargeRepairMethod('Transferencia')}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      chargeRepairMethod === 'Transferencia'
                        ? 'bg-sky-500/20 text-sky-400 border-sky-500 shadow-md font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="text-xs">📱 Transferencia / MP</span>
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Notas / Observación del cobro
                </label>
                <input
                  type="text"
                  value={chargeRepairNotes}
                  onChange={(e) => setChargeRepairNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-ps-neon"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-ps-border">
                <button
                  type="button"
                  onClick={() => setChargingRepairOrder(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/25 transition-all cursor-pointer"
                >
                  Confirmar Cobro e Ingresar a Caja
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CIERRE DE CAJA DEL DÍA */}
      {/* ========================================================= */}
      {isCashClosureModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-ps-surface border border-ps-border rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-3 border-b border-ps-border mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Cierre de Caja Diario</h3>
                  <p className="text-xs text-slate-400">Resumen listo para enviar por WhatsApp</p>
                </div>
              </div>
              <button
                onClick={() => setIsCashClosureModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Structured Report Preview */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-3 max-h-72 overflow-y-auto">
              <div className="text-center font-bold text-white pb-2 border-b border-slate-800">
                💰 {config.businessName?.toUpperCase() || 'EL REY PLAY'} - CIERRE DE CAJA
                <div className="text-[11px] text-ps-neon font-normal mt-0.5">
                  {getDateFilterLabel()} • {formatDateOnly(new Date())}
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-emerald-400 font-bold">💵 Total Efectivo (Caja):</span>
                  <span className="font-bold text-emerald-400">{formatARS(periodMetrics.totalEfectivo)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sky-400 font-bold">📱 Total Transferencias (MP/Banco):</span>
                  <span className="font-bold text-sky-400">{formatARS(periodMetrics.totalTransferencia)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-800 text-sm">
                  <span className="text-white font-black">✨ TOTAL FACTURADO:</span>
                  <span className="font-black text-white text-base">{formatARS(periodMetrics.totalGeneral)}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] space-y-1 text-slate-400">
                <div className="text-slate-300 font-bold mb-1">📊 Desglose por Rubro:</div>
                <div className="flex justify-between">
                  <span>🎮 Juegos Vendidos:</span>
                  <span>{periodMetrics.countJuegos} ops ({formatARS(periodMetrics.totalJuegos)})</span>
                </div>
                <div className="flex justify-between">
                  <span>🔧 Taller / Reparaciones:</span>
                  <span>{periodMetrics.countReparaciones} ops ({formatARS(periodMetrics.totalReparaciones)})</span>
                </div>
                {periodMetrics.countOtros > 0 && (
                  <div className="flex justify-between">
                    <span>🕹️ Consolas / Accesorios:</span>
                    <span>{periodMetrics.countOtros} ops ({formatARS(periodMetrics.totalOtros)})</span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <div className="text-slate-300 font-bold mb-1">📝 Movimientos ({periodTransactions.length}):</div>
                {periodTransactions.length === 0 ? (
                  <p className="italic text-slate-500">Sin movimientos registrados en este período.</p>
                ) : (
                  <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                    {periodTransactions.map((tx, idx) => (
                      <div key={tx.id} className="flex justify-between items-center text-[10px]">
                        <span className="truncate max-w-[200px]">
                          {idx + 1}. {formatTime(tx.date)} {tx.title}
                        </span>
                        <span className="shrink-0 font-bold text-slate-200">
                          {formatARS(tx.amount)} [{tx.paymentMethod === 'Efectivo' ? 'EFECT' : 'TRANSF'}]
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-4 border-t border-ps-border mt-4">
              <button
                type="button"
                onClick={handleCopyCashClosure}
                className={`w-full sm:flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  copiedClosureText
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : 'bg-ps-blue/20 hover:bg-ps-blue/30 text-ps-neon border border-ps-blue/40 shadow-ps-glow'
                }`}
              >
                {copiedClosureText ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>¡Copiado para WhatsApp!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Resumen para WhatsApp</span>
                  </>
                )}
              </button>

              <a
                href={buildCashClosureWhatsAppUrl({
                  transactions: periodTransactions,
                  dateLabel: getDateFilterLabel(),
                  config,
                  totalEfectivo: periodMetrics.totalEfectivo,
                  totalTransferencia: periodMetrics.totalTransferencia,
                  totalGeneral: periodMetrics.totalGeneral,
                  totalJuegos: periodMetrics.totalJuegos,
                  countJuegos: periodMetrics.countJuegos,
                  totalReparaciones: periodMetrics.totalReparaciones,
                  countReparaciones: periodMetrics.countReparaciones,
                  totalOtros: periodMetrics.totalOtros,
                  countOtros: periodMetrics.countOtros
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Abrir WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
