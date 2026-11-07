import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  formatARS,
  formatSimpleDate,
  getRelativeTime,
  REPAIR_STATUS_CONFIG,
  buildReadyWhatsAppUrl,
  buildRepairReceiptText,
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
  Loader2
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
    logoutAdmin,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('repairs'); // 'repairs' | 'catalog' | 'settings'

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
      <div className="bg-ps-surface border-b border-ps-border px-4 sm:px-8 py-3.5 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-ps-neon text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4 text-ps-neon" />
              <span>Volver a la Tienda</span>
            </button>

            <div className="h-6 w-px bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-ps-blue flex items-center justify-center font-gaming font-bold text-white text-xs shadow-ps-glow">
                PS
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-white font-gaming tracking-wide flex items-center gap-2">
                  <span>PANEL DE ADMINISTRACIÓN</span>
                  <PlayStationSymbolsRow size="w-3 h-3" spacing="space-x-1" />
                </div>
                <div className="text-[10px] text-emerald-400 font-mono">
                  {config.businessName} • Sesión Activa
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                logoutAdmin();
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-semibold transition-all"
            >
              Cerrar Sesión
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
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-2 py-3 px-3 sm:px-4 border-b-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'catalog'
                ? 'border-ps-neon text-ps-neon'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>2. Catálogo & Servicios</span>
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
            <span>3. Configuración del Negocio</span>
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
        {/* TAB 2: GESTIÓN DE CATÁLOGO & SERVICIOS */}
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

            {/* Products Table/List */}
            {catalogSubTab === 'products' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-4 rounded-2xl bg-ps-surface border border-ps-border flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 mb-3 border border-slate-800">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded bg-ps-bg/90 text-ps-neon border border-ps-neon/30 font-bold uppercase">
                          {prod.tag || prod.category}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white line-clamp-1">
                        {prod.name}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                        {prod.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-ps-border/70 flex items-center justify-between">
                      <div>
                        <div className="text-base font-bold font-gaming text-ps-neon">
                          {formatARS(prod.price)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Stock: <strong className={prod.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}>{prod.stock}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
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
                          title="Editar"
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
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
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
                    DATOS DE PLAYCENTER AGUILARES
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
      {/* MODAL: AGREGAR / EDITAR PRODUCTO CON CARGA REAL BASE64 */}
      {/* ========================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsProductModalOpen(false)}
          />

          <div className="relative w-full max-w-xl rounded-2xl bg-ps-surface border-2 border-ps-border shadow-2xl p-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-ps-border mb-4">
              <h3 className="text-base font-bold text-white font-gaming tracking-wide flex items-center gap-2">
                <Package className="w-5 h-5 text-ps-neon" />
                <span>{editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto en Catálogo'}</span>
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              
              {/* Image Upload Box with Base64 & Preview */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <label className="block text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-ps-neon" />
                  <span>Imagen del Producto (Archivo local o URL)</span>
                </label>

                {/* Instant Preview */}
                {productForm.image && (
                  <div className="relative aspect-video max-h-48 rounded-xl overflow-hidden bg-black/60 border border-ps-neon/40 mb-3 mx-auto flex items-center justify-center">
                    <img
                      src={productForm.image}
                      alt="Vista previa"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setProductForm(prev => ({ ...prev, image: '' }))}
                      className="absolute top-2 right-2 p-1 rounded-lg bg-rose-600 text-white hover:bg-rose-500 shadow-md"
                      title="Quitar foto"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* File Upload (FileReader Base64 with Canvas Compression) */}
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
                      className="w-full py-2.5 px-3 rounded-xl bg-ps-blue/20 hover:bg-ps-blue/30 border border-ps-blue/50 text-ps-neon text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      {isCompressingImage ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-ps-neon" />
                          <span>Comprimiendo a 600px...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          <span>Cargar foto desde Celular o PC</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* External URL alternative */}
                  <div>
                    <input
                      type="url"
                      placeholder="O pegar enlace web (Unsplash / Web)"
                      value={productForm.image.startsWith('data:') ? '' : productForm.image}
                      onChange={(e) => {
                        setProductForm(prev => ({ ...prev, image: e.target.value }));
                        setCompressionDetails(null);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-ps-neon"
                    />
                  </div>
                </div>

                {/* Compression Success Badge */}
                {compressionDetails && (
                  <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-[11px] text-emerald-300 flex items-center justify-between animate-fadeIn">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Optimización Canvas (Máx 600px • JPEG 0.7):</span>
                    </div>
                    <div className="font-mono text-xs">
                      <span className="line-through text-slate-400 mr-1.5">{compressionDetails.originalSizeKb} KB</span>
                      <strong className="text-emerald-400 font-bold">➔ {compressionDetails.compressedSizeKb} KB</strong>
                    </div>
                  </div>
                )}
                
                <p className="text-[10px] text-slate-400 mt-2">
                  🛡️ Compresión activa en Canvas: Las fotos se escalan a 600px con calidad JPEG 0.7 para optimizar el almacenamiento en localStorage.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre del Producto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: God of War Ragnarök (PS4)"
                  value={productForm.name}
                  onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-ps-neon"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Categoría</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-ps-neon cursor-pointer"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Precio (ARS) *</label>
                  <input
                    type="number"
                    required
                    placeholder="45000"
                    value={productForm.price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-ps-neon"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.stock}
                    onChange={(e) => setProductForm(prev => ({ ...prev, stock: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-ps-neon"
                  />
                </div>
              </div>

              {/* Dynamic tag based on category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Etiqueta Principal (Badge)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Físico Usado, Con HEN, Sellada..."
                    value={productForm.tag}
                    onChange={(e) => setProductForm(prev => ({ ...prev, tag: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-ps-neon"
                  />
                </div>

                {/* Conditional specs: if console, ask capacity/model */}
                {productForm.category.includes('consola') ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Capacidad / Modelo</label>
                    <input
                      type="text"
                      placeholder="Ej: Slim 1TB o Super Slim 500GB"
                      value={productForm.capacity || productForm.model}
                      onChange={(e) => setProductForm(prev => ({ ...prev, capacity: e.target.value, model: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-ps-neon"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo / Formato</label>
                    <input
                      type="text"
                      placeholder="Ej: Digital Primario / Original Sony"
                      value={productForm.format || productForm.type}
                      onChange={(e) => setProductForm(prev => ({ ...prev, format: e.target.value, type: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-ps-neon"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción detallada</label>
                <textarea
                  rows={2}
                  placeholder="Detalles de contenido, estado físico, idiomas, trofeos o accesorios incluidos..."
                  value={productForm.description}
                  onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-ps-neon"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={productForm.featured}
                  onChange={(e) => setProductForm(prev => ({ ...prev, featured: e.target.checked }))}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-800 text-ps-blue focus:ring-ps-neon"
                />
                <label htmlFor="featuredCheck" className="text-xs text-slate-300 cursor-pointer">
                  Destacar este producto en la página principal
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-ps-border">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-ps-blue hover:bg-ps-blueLight text-white font-bold text-xs shadow-ps-glow"
                >
                  {editingProduct ? 'Guardar Cambios' : 'Publicar Producto'}
                </button>
              </div>
            </form>
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

    </div>
  );
}
