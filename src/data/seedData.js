export const INITIAL_CONFIG = {
  businessName: "PlayCenter Aguilares",
  whatsappNumber: "5493865000000",
  adminPin: "2020",
  address: "Centro, Aguilares, Tucumán",
  businessHours: "Lunes a Sábado de 09:30 a 13:00 y 17:30 a 21:30",
  phoneDisplay: "+54 9 3865 00-0000",
  instagram: "@playcenter.aguilares",
  googleMapsUrl: "https://maps.google.com/?q=Aguilares+Tucuman",
  warrantyPolicy: "Garantía escrita de 90 días en todos los servicios y consolas.",
};

export const CATEGORIES = [
  { id: 'juegos_ps4', label: 'Juegos PS4', icon: 'Disc3', badge: 'PS4' },
  { id: 'juegos_ps3', label: 'Juegos PS3', icon: 'Gamepad', badge: 'PS3' },
  { id: 'consolas_ps4', label: 'Consolas PS4', icon: 'Tv', badge: 'Consola' },
  { id: 'consolas_ps3', label: 'Consolas PS3', icon: 'Cpu', badge: 'Consola' },
  { id: 'accesorios', label: 'Accesorios / Joysticks', icon: 'Headphones', badge: 'Gear' },
];

export const INITIAL_PRODUCTS = [
  {
    id: "prod-1",
    name: "God of War Ragnarök (PS4)",
    category: "juegos_ps4",
    price: 45000,
    format: "Físico Usado",
    tag: "Físico Usado",
    stock: 2,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    description: "Disco impecable en caja original. Audio y subtítulos en español latino. Compatible con PS4 y PS5.",
    featured: true,
    condition: "Excelente estado, testeado al 100%"
  },
  {
    id: "prod-2",
    name: "EA Sports FC 25 (PS4)",
    category: "juegos_ps4",
    price: 28000,
    format: "Digital Primario",
    tag: "Digital Primario",
    stock: 5,
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
    description: "Cuenta primaria con garantía total anti-candado. Juegas desde tu propio usuario personal con trofeos.",
    featured: true,
    condition: "Entrega digital inmediata por WhatsApp"
  },
  {
    id: "prod-3",
    name: "Spider-Man: Miles Morales (PS4)",
    category: "juegos_ps4",
    price: 36000,
    format: "Físico Nuevo",
    tag: "Físico Sellado",
    stock: 3,
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
    description: "Edición estándar sellada de fábrica. Vive la historia de Miles Morales en New York con gráficos espectaculares.",
    featured: false,
    condition: "Nuevo en blister original"
  },
  {
    id: "prod-4",
    name: "GTA V (PS3)",
    category: "juegos_ps3",
    price: 15000,
    format: "Físico Usado",
    tag: "Físico Usado",
    stock: 3,
    image: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=800&q=80",
    description: "Incluye mapa original de Los Santos y manual. Disco verificado sin rayas en nuestra tienda.",
    featured: true,
    condition: "Completo con mapa"
  },
  {
    id: "prod-5",
    name: "PES 2018 Actualizado (PS3)",
    category: "juegos_ps3",
    price: 10000,
    format: "Digital",
    tag: "Digital HEN / Store",
    stock: 8,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
    description: "Edición con option file actualizado: plantillas de fútbol argentino y europeo, camisetas y fichajes vigentes.",
    featured: false,
    condition: "Carga rápida en el local o remota"
  },
  {
    id: "prod-6",
    name: "The Last of Us (PS3)",
    category: "juegos_ps3",
    price: 16000,
    format: "Físico Usado",
    tag: "Físico Usado",
    stock: 1,
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80",
    description: "La obra maestra de Naughty Dog para PS3. Edición en caja original, testeado en taller.",
    featured: false,
    condition: "Disco 10/10 verificado"
  },
  {
    id: "prod-7",
    name: "PlayStation 4 Slim 1TB + 1 Joystick",
    category: "consolas_ps4",
    price: 420000,
    model: "Slim",
    capacity: "1TB",
    systemStatus: "Original Sellada",
    tag: "Original Sellada",
    stock: 2,
    image: "https://images.unsplash.com/photo-1507457379470-08b800bebc67?auto=format&fit=crop&w=800&q=80",
    description: "Consola PS4 Slim de 1TB en caja cerrada con sellos de garantía Sony. Incluye 1 mando DualShock 4 original, cables HDMI, power y auriculares.",
    featured: true,
    condition: "Nueva sellada de fábrica con 6 meses de garantía"
  },
  {
    id: "prod-8",
    name: "PlayStation 4 Pro 1TB 4K HDR",
    category: "consolas_ps4",
    price: 490000,
    model: "Pro",
    capacity: "1TB",
    systemStatus: "Seminueva Verificada",
    tag: "Seminueva Garantizada",
    stock: 1,
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=80",
    description: "Máxima potencia gráfica 4K para PS4. Incluye mantenimiento preventivo recién hecho con Arctic MX-4 y Joystick DualShock 4 original.",
    featured: false,
    condition: "Servicio térmico recién realizado, silenciosa"
  },
  {
    id: "prod-9",
    name: "PlayStation 3 Super Slim 500GB + 30 Juegos",
    category: "consolas_ps3",
    price: 210000,
    model: "Super Slim",
    capacity: "500GB",
    systemStatus: "Con HEN / Magia",
    tag: "Con HEN / Magia",
    stock: 2,
    image: "https://images.unsplash.com/photo-1526509867162-5b0c0d1b4b33?auto=format&fit=crop&w=800&q=80",
    description: "PS3 Super Slim con sistema HEN 4.91 instalado. Lista para encender y jugar con 30 juegos cargados en el disco y tienda libre para descargar más.",
    featured: true,
    condition: "Incluye joystick inalámbrico, cable HDMI y cargador"
  },
  {
    id: "prod-10",
    name: "PlayStation 3 Slim 320GB Con Tienda de Juegos",
    category: "consolas_ps3",
    price: 185000,
    model: "Slim",
    capacity: "320GB",
    systemStatus: "Con HEN / Magia",
    tag: "Con HEN / Magia",
    stock: 1,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    description: "Modelo clásico Slim muy silencioso y confiable. Viene con 20 juegos preinstalados (GTA V, FIFA, God of War) y tienda libre.",
    featured: false,
    condition: "Mantenimiento recién hecho en taller"
  },
  {
    id: "prod-11",
    name: "Joystick DualShock 4 V2 Negro",
    category: "accesorios",
    price: 65000,
    tag: "Original Reacondicionado",
    type: "Original Sony Reacondicionado",
    stock: 4,
    image: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=800&q=80",
    description: "DualShock 4 V2 con barra luminosa en el touchpad. Placa y componentes 100% Sony originales con analógicos nuevos sin drift.",
    featured: true,
    condition: "Garantía de 90 días en taller"
  },
  {
    id: "prod-12",
    name: "Joystick PS3 Inalámbrico",
    category: "accesorios",
    price: 22000,
    tag: "Alternativo AAA",
    type: "Alternativo AAA",
    stock: 6,
    image: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=800&q=80",
    description: "Joystick inalámbrico Bluetooth con función de vibración dual y sensor Sixaxis. Excelente batería recargable.",
    featured: false,
    condition: "Nuevo en caja con cable USB"
  }
];

export const INITIAL_SERVICES = [
  {
    id: "serv-1",
    title: "Mantenimiento Completo PS4",
    subtitle: "Limpieza ultrasonido + Pasta Térmica Arctic MX-4",
    price: 25000,
    turnaround: "24 a 48 hs",
    platform: "PS4 (Fat / Slim / Pro)",
    icon: "Fan",
    includes: [
      "Desarme completo y limpieza profunda por ultrasonido",
      "Aplicación de pasta térmica de alta conductividad Arctic MX-4",
      "Limpieza de disipador de aluminio y turbina de refrigeración",
      "Revisión y lubricación de cooler y pads térmicos",
      "Test de estrés térmico de 2 horas antes de la entrega"
    ],
    highlight: "¡Evita sobrecalentamiento y la luz roja!"
  },
  {
    id: "serv-2",
    title: "Mantenimiento Completo PS3",
    subtitle: "Optimización de Temperatura y Limpieza Interna",
    price: 20000,
    turnaround: "24 hs",
    platform: "PS3 (Fat / Slim / Super Slim)",
    icon: "Cpu",
    includes: [
      "Limpieza de polvo y pelusa interna de fuente y placa madre",
      "Cambio de pasta térmica premium en procesadores CELL y RSX",
      "Calibración de perfil de ventilación para prolongar la vida útil",
      "Verificación de lectura de disco Bluray y disco duro",
      "Informe del estado de temperatura final"
    ],
    highlight: "Consola silenciosa y duradera"
  },
  {
    id: "serv-3",
    title: "Reparación de Drift / Cambio de Analógico PS4",
    subtitle: "Reemplazo con potenciómetros originales de alta precisión",
    price: 14000,
    turnaround: "En el día",
    platform: "Joystick DualShock 4",
    icon: "Gamepad2",
    includes: [
      "Diagnóstico en software para medir zona muerta y desvíos",
      "Desoldado prolijo con estación térmica profesional",
      "Colocación de módulo analógico original con calibración",
      "Limpieza interna de membranas y botones",
      "Garantía de 60 días contra retorno de drift"
    ],
    highlight: "¡Tu mira vuelve a estar 100% precisa!"
  },
  {
    id: "serv-4",
    title: "Reemplazo de Puerto HDMI PS4",
    subtitle: "Microsoldadura SMD reforzada con garantía",
    price: 38000,
    turnaround: "48 a 72 hs",
    platform: "PS4 (Todas las versiones)",
    icon: "Tv2",
    includes: [
      "Diagnóstico de pistas y chip codificador Panasonic MN8647",
      "Remoción del puerto roto sin dañar pistas del impreso",
      "Colocación de conector HDMI original blindado y reforzado",
      "Inspección bajo microscopio óptico de soldaduras",
      "Prueba de salida de video a 1080p y 4K HDR"
    ],
    highlight: "Reparación definitiva con garantía escrita"
  }
];

export const INITIAL_REPAIRS = [
  {
    id: "101",
    dni: "38111222",
    clientName: "Lucas Gómez",
    phone: "5493865112233",
    device: "PS4 Fat 500GB",
    issue: "Calienta mucho y se apaga a los 10 minutos de jugar",
    status: "En taller",
    cost: 25000,
    entryDate: "2026-11-05T10:30:00",
    technicianNotes: "Se detectó pasta térmica petrificada y turbina tapada de pelusa. Se procede con limpieza ultrasónica y cambio por Arctic MX-4.",
    priority: "Normal"
  },
  {
    id: "102",
    dni: "40333444",
    clientName: "Martín Díaz",
    phone: "5493865445566",
    device: "2x Joysticks PS4",
    issue: "Drift en analógico izquierdo en ambos mandos",
    status: "Listo para retirar",
    cost: 28000,
    entryDate: "2026-11-06T15:20:00",
    technicianNotes: "Módulos analógicos reemplazados y calibrados en PC con cero drift. Limpieza de botonera completa efectuada.",
    priority: "Alta"
  },
  {
    id: "103",
    dni: "42555666",
    clientName: "Sofía Ruiz",
    phone: "5493865778899",
    device: "PS3 Slim",
    issue: "No lee discos de juegos Bluray ni películas",
    status: "En fila",
    cost: 30000,
    entryDate: "2026-11-07T09:15:00",
    technicianNotes: "Ingreso en espera de desmontaje para calibrar o reemplazar el lente láser KES-450A.",
    priority: "Normal"
  }
];
