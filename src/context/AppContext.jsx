import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_CONFIG,
  INITIAL_PRODUCTS,
  INITIAL_SERVICES,
  INITIAL_REPAIRS,
  INITIAL_TRANSACTIONS
} from '../data/seedData';
import { formatARS } from '../utils/formatters';

const AppContext = createContext();

const STORAGE_KEYS = {
  CONFIG: 'playcenter_config_v2',
  PRODUCTS: 'playcenter_products_v4',
  SERVICES: 'playcenter_services_v2',
  REPAIRS: 'playcenter_repairs_v2',
  TRANSACTIONS: 'playcenter_transactions_v2',
  CART: 'playcenter_cart_v2',
  AUTH: 'playcenter_admin_auth_v2',
};

export function AppProvider({ children }) {
  // Load or seed config with automatic migration to "El Rey Play"
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Automatic migration: If businessName still has old branding, update seamlessly
        if (!parsed.businessName || parsed.businessName.toLowerCase().includes('playcenter')) {
          const updated = {
            ...parsed,
            businessName: 'El Rey Play',
            instagram: parsed.instagram?.includes('playcenter') ? '@elreyplay.aguilares' : parsed.instagram
          };
          localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(updated));
          return updated;
        }
        return parsed;
      }
      return INITIAL_CONFIG;
    } catch (e) {
      console.error('Error loading config:', e);
      return INITIAL_CONFIG;
    }
  });

  // Load or seed products with seamless migration for real game covers & expanded catalog
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure all new seed games are present
        const existingIds = new Set(parsed.map((p) => p.id));
        const missing = INITIAL_PRODUCTS.filter((p) => !existingIds.has(p.id));
        if (missing.length > 0) {
          const merged = [...parsed, ...missing];
          localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }

      // Check older versions v3/v2 to preserve custom user edits and upgrade covers
      const olderSaved = localStorage.getItem('playcenter_products_v3') || localStorage.getItem('playcenter_products_v2');
      if (olderSaved) {
        try {
          const parsedOlder = JSON.parse(olderSaved);
          const existingIds = new Set(parsedOlder.map((p) => p.id));
          const missing = INITIAL_PRODUCTS.filter((p) => !existingIds.has(p.id));
          const upgraded = [
            ...parsedOlder.map((prod) => {
              const seedMatch = INITIAL_PRODUCTS.find((p) => p.id === prod.id);
              if (seedMatch && seedMatch.image.startsWith('/covers/')) {
                return { ...prod, image: seedMatch.image };
              }
              return prod;
            }),
            ...missing
          ];
          localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(upgraded));
          return upgraded;
        } catch (err) {
          console.error('Error migrating older products:', err);
        }
      }

      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    } catch (e) {
      console.error('Error loading products:', e);
      return INITIAL_PRODUCTS;
    }
  });

  // Load or seed services
  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      return saved ? JSON.parse(saved) : INITIAL_SERVICES;
    } catch (e) {
      console.error('Error loading services:', e);
      return INITIAL_SERVICES;
    }
  });

  // Load or seed repairs
  const [repairs, setRepairs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REPAIRS);
      return saved ? JSON.parse(saved) : INITIAL_REPAIRS;
    } catch (e) {
      console.error('Error loading repairs:', e);
      return INITIAL_REPAIRS;
    }
  });

  // Load or seed cash & sales transactions
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (saved) {
        return JSON.parse(saved);
      }
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
      return INITIAL_TRANSACTIONS;
    } catch (e) {
      console.error('Error loading transactions:', e);
      return INITIAL_TRANSACTIONS;
    }
  });

  // Load or init cart
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Admin auth
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    } catch (e) {
      return false;
    }
  });

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save config', e);
    }
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    } catch (e) {
      console.error('Failed to save services', e);
    }
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REPAIRS, JSON.stringify(repairs));
    } catch (e) {
      console.error('Failed to save repairs', e);
    }
  }, [repairs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed to save transactions', e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [cart]);

  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Auth Methods
  const loginAdmin = (pin) => {
    if (pin.trim() === config.adminPin) {
      setIsAdmin(true);
      sessionStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      setIsAdminModalOpen(false);
      showToast('Sesión de Administrador iniciada correctamente.', 'success');
      return true;
    } else {
      showToast('PIN incorrecto. Intenta con "2020"', 'error');
      return false;
    }
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    sessionStorage.removeItem(STORAGE_KEYS.AUTH);
    showToast('Sesión de administrador cerrada.', 'info');
  };

  // Config Methods
  const updateConfig = (newConfig) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
    showToast('Configuración del negocio guardada.', 'success');
  };

  const resetAllData = () => {
    setConfig(INITIAL_CONFIG);
    setProducts(INITIAL_PRODUCTS);
    setServices(INITIAL_SERVICES);
    setRepairs(INITIAL_REPAIRS);
    setTransactions(INITIAL_TRANSACTIONS);
    setCart([]);
    localStorage.clear();
    showToast('Datos restablecidos a los valores originales de fábrica.', 'info');
  };

  // Product Methods
  const addProduct = (productData) => {
    const newProduct = {
      ...productData,
      id: `prod-${Date.now()}`,
      price: Number(productData.price) || 0,
      stock: Number(productData.stock) || 0,
    };
    setProducts(prev => [newProduct, ...prev]);
    showToast(`"${newProduct.name}" agregado al catálogo.`, 'success');
  };

  const updateProduct = (id, productData) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...productData, price: Number(productData.price) || p.price } : p))
    );
    showToast('Producto actualizado correctamente.', 'success');
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Producto eliminado del catálogo.', 'info');
  };

  const toggleProductStock = (id) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const newStock = p.stock > 0 ? 0 : 5;
          return { ...p, stock: newStock };
        }
        return p;
      })
    );
  };

  // Service Methods
  const addService = (serviceData) => {
    const newService = {
      ...serviceData,
      id: `serv-${Date.now()}`,
      price: Number(serviceData.price) || 0,
      includes: Array.isArray(serviceData.includes) ? serviceData.includes : (serviceData.includes || '').split('\n').filter(Boolean)
    };
    setServices(prev => [...prev, newService]);
    showToast(`Servicio "${newService.title}" creado con éxito.`, 'success');
  };

  const updateService = (id, serviceData) => {
    setServices(prev =>
      prev.map(s => (s.id === id ? {
        ...s,
        ...serviceData,
        price: Number(serviceData.price) || s.price,
        includes: Array.isArray(serviceData.includes) ? serviceData.includes : (serviceData.includes || '').split('\n').filter(Boolean)
      } : s))
    );
    showToast('Servicio actualizado correctamente.', 'success');
  };

  const deleteService = (id) => {
    setServices(prev => prev.filter(s => s.id !== id));
    showToast('Servicio eliminado.', 'info');
  };

  // Repair Methods
  const addRepair = (repairData) => {
    // Generate next sequential order number
    const existingIds = repairs.map(r => parseInt(r.id, 10)).filter(n => !isNaN(n));
    const nextId = existingIds.length > 0 ? (Math.max(...existingIds) + 1).toString() : '101';

    const newRepair = {
      id: nextId,
      dni: repairData.dni.trim(),
      clientName: repairData.clientName.trim(),
      phone: repairData.phone.trim(),
      device: repairData.device.trim(),
      issue: repairData.issue.trim(),
      status: repairData.status || 'En fila',
      cost: Number(repairData.cost) || 0,
      entryDate: repairData.entryDate || new Date().toISOString(),
      technicianNotes: repairData.technicianNotes || '',
      priority: repairData.priority || 'Normal',
    };

    // Keep chronological order (oldest first or newest at arrival queue)
    setRepairs(prev => [...prev, newRepair]);
    showToast(`Orden #${nextId} registrada para ${newRepair.clientName}.`, 'success');
    return newRepair;
  };

  const updateRepairStatus = (id, newStatus) => {
    setRepairs(prev =>
      prev.map(r => (r.id === id ? { ...r, status: newStatus } : r))
    );
    showToast(`Orden #${id} actualizada a: "${newStatus}"`, 'info');
  };

  const updateRepair = (id, repairData) => {
    setRepairs(prev =>
      prev.map(r => (r.id === id ? { ...r, ...repairData, cost: Number(repairData.cost) || r.cost } : r))
    );
    showToast(`Orden #${id} guardada exitosamente.`, 'success');
  };

  const deleteRepair = (id) => {
    setRepairs(prev => prev.filter(r => r.id !== id));
    showToast(`Orden #${id} eliminada.`, 'info');
  };

  const getRepairsByDni = (dniInput) => {
    if (!dniInput) return [];
    const cleanDni = dniInput.toString().trim().replace(/[^0-9]/g, '');
    if (!cleanDni) return [];
    return repairs.filter(r => r.dni.replace(/[^0-9]/g, '') === cleanDni);
  };

  // Transaction / Cash Management Methods
  const addTransaction = (data) => {
    const newTx = {
      id: `tx-${Date.now()}`,
      date: data.date || new Date().toISOString(),
      type: data.type || 'juego',
      category: data.category || (data.type === 'reparacion' ? 'Servicio Técnico' : 'Venta de Juegos'),
      title: data.title || 'Venta Mostrador',
      amount: Number(data.amount) || 0,
      paymentMethod: data.paymentMethod === 'Transferencia' ? 'Transferencia' : 'Efectivo',
      customer: data.customer?.trim() || 'Cliente Mostrador',
      notes: data.notes?.trim() || '',
      referenceId: data.referenceId || null
    };

    setTransactions(prev => [newTx, ...prev]);
    showToast(`Ingreso de ${formatARS(newTx.amount)} registrado en Caja (${newTx.paymentMethod}).`, 'success');
    return newTx;
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    showToast('Movimiento de caja eliminado.', 'info');
  };

  const chargeRepairOrder = (repairId, paymentMethod = 'Efectivo', customAmount = null, customNotes = '') => {
    const repair = repairs.find(r => r.id === repairId);
    if (!repair) {
      showToast('Orden de reparación no encontrada.', 'error');
      return null;
    }

    const amount = customAmount !== null && customAmount !== undefined && customAmount !== '' ? Number(customAmount) : Number(repair.cost);
    const newTx = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString(),
      type: 'reparacion',
      category: 'Servicio Técnico',
      title: `Cobro Taller Orden #${repair.id} - ${repair.device}`,
      amount: amount || 0,
      paymentMethod: paymentMethod === 'Transferencia' ? 'Transferencia' : 'Efectivo',
      customer: repair.clientName || 'Cliente Taller',
      notes: customNotes || `Falla: ${repair.issue} | DNI: ${repair.dni}`,
      referenceId: repair.id
    };

    // Mark repair as delivered and paid
    setRepairs(prev =>
      prev.map(r => r.id === repairId ? {
        ...r,
        status: 'Entregado',
        isPaid: true,
        paidMethod: paymentMethod,
        paidAmount: amount,
        paidDate: new Date().toISOString()
      } : r)
    );

    setTransactions(prev => [newTx, ...prev]);
    showToast(`Orden #${repairId} cobrada: ${formatARS(amount)} en ${paymentMethod}.`, 'success');
    return newTx;
  };

  // Cart Methods
  const addToCart = (item, isService = false) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        showToast(`Incrementado: ${item.name || item.title}`, 'info');
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        showToast(`Agregado al carrito: ${item.name || item.title}`, 'success');
        return [
          ...prev,
          {
            id: item.id,
            name: item.name || item.title,
            price: item.price,
            image: item.image,
            tag: item.tag || item.format || item.model || (isService ? 'Servicio Técnico' : 'Gaming'),
            isService,
            quantity: 1,
          }
        ];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
    showToast('Ítem eliminado del carrito.', 'info');
  };

  const updateQuantity = (id, delta) => {
    setCart(prev =>
      prev
        .map(i => {
          if (i.id === id) {
            const nextQuantity = i.quantity + delta;
            return nextQuantity > 0 ? { ...i, quantity: nextQuantity } : null;
          }
          return i;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
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
        getRepairsByDni,
        transactions,
        addTransaction,
        deleteTransaction,
        chargeRepairOrder,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        isAdmin,
        isAdminModalOpen,
        setIsAdminModalOpen,
        loginAdmin,
        logoutAdmin,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
