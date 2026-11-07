# PlayCenter Aguilares 🎮 | Gaming & Servicio Técnico PlayStation

Aplicación web completa, moderna y responsiva (Mobile-First) desarrollada en **React 18 + Tailwind CSS + Lucide Icons** para el negocio de videojuegos y servicio técnico especializado en **Aguilares (Tucumán, Argentina)**.

---

## 🚀 Características Principales

### 1. Estética PlayStation Dark Gamer
- **Paleta oficial:** Fondo oscuro `#080b12`, superficies `#111827`, bordes `#1e293b`, azul clásico PlayStation (`#0070d1` y `#00439c`) y acentos neón cian (`#00d4ff`).
- **Símbolos PlayStation:** Íconos vectoriales auténticos integrados (△ Verde `#2dd4bf`, ◯ Rojo `#f87171`, ✕ Azul `#60a5fa`, ▢ Rosa `#f472b6`).
- **Glow Effects:** Botones y tarjetas con efecto de iluminación neón en hover y animaciones fluidas.

### 2. Catálogo Interactivo en 5 Pestañas
1. **Juegos PS4:** Físicos usados/sellados y digitales primarios (God of War Ragnarök, EA Sports FC 25, Spider-Man).
2. **Juegos PS3:** Físicos y digitales con HEN (GTA V con mapa, PES 2018 actualizado, The Last of Us).
3. **Consolas PS4:** PS4 Slim 1TB, PS4 Pro 4K HDR con mantenimiento preventivo.
4. **Consolas PS3:** Super Slim 500GB y Slim 320GB con sistema HEN y 30 juegos cargados.
5. **Accesorios / Joysticks:** DualShock 4 V2 Sony Reacondicionado, Joysticks PS3 inalámbricos AAA.
- Filtros dinámicos por pestaña (Físico vs Digital, Con HEN vs Original, Original vs Alternativo).
- Buscador por texto en tiempo real y ordenamiento por precio o destacados.

### 3. Servicio Técnico Especializado (Precios Base)
- Mantenimiento Completo PS4 (Limpieza por ultrasonido + Pasta Térmica Arctic MX-4) - $25.000.
- Mantenimiento Completo PS3 + Optimización de Temperatura - $20.000.
- Reparación de Drift / Cambio de Analógico Joystick PS4 - $14.000.
- Reemplazo de Puerto HDMI PS4 (Microsoldadura SMD) - $38.000.
- Botón *"Solicitar Turno / Agregar"* para sumarlo al carrito.

### 4. Buscador Público de Estado de Reparación (Tracking por DNI)
- El cliente ingresa su DNI (ej: `38111222`, `40333444`, `42555666`).
- Muestra el estado del equipo con barra de progreso interactiva:
  - **En fila:** 25% (Amarillo)
  - **En taller:** 60% (Azul PlayStation)
  - **Listo para retirar:** 100% (Verde Esmeralda con aviso destacado)
  - **Entregado:** 100% (Gris)
- Indica posición en la fila, falla reportada, notas del técnico y botón directo para consultar por WhatsApp.

### 5. Carrito Lateral (Drawer) y Checkout a WhatsApp
- Drawer con backdrop difuminado, control de cantidades y subtotales en ARS.
- Formulario de checkout: Nombre, Teléfono, Método de Pago (Efectivo / Transferencia / Mercado Pago), y Entrega (Retiro en local / Envío a domicilio en Aguilares).
- Genera enlace directo a WhatsApp con el mensaje estructurado de la compra.

### 6. Panel de Administración Privado (PIN: 2020)
- Acceso discreto desde el Header con modal de seguridad y PIN configurable (predeterminado: **2020**).
- **Pestaña 1 - Taller:** Registro de nuevos ingresos, asignación automática de número de orden (#104...), cambio de estado en vivo y botón crítico **"Avisar por WhatsApp"** para avisar al cliente cuando su equipo esté listo para retirar.
- **Pestaña 2 - Catálogo & Servicios:** Formulario para agregar/editar productos con **carga de imagen real desde PC/celular mediante FileReader a Base64** y vista previa instantánea o URL externa, control de stock y edición de servicios.
- **Pestaña 3 - Configuración:** Cambio de nombre del negocio, número de WhatsApp receptor, dirección, horarios de atención, cambio de PIN y botón de restablecimiento de fábrica.

---

## 🛠️ Tecnologías Utilizadas
- **React 18**
- **Vite 5**
- **Tailwind CSS 3**
- **Lucide React** (iconos de alta definición)
- **HTML5 FileReader API** (conversión de imágenes a Base64)
- **LocalStorage API** (persistencia total cliente-servidor sin base de datos externa)

---

## 💻 Instrucciones para Ejecutar

```bash
# 1. Instalar dependencias (ya instaladas en el entorno)
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Compilar para producción
npm run build
```

El servidor local correrá en `http://localhost:3000`.
