export const INITIAL_CONFIG = {
  businessName: "El Rey Play",
  whatsappNumber: "5493865000000",
  adminPin: "2020",
  address: "Centro - Atención al Público",
  businessHours: "Lunes a Sábado de 09:30 a 13:00 y 17:30 a 21:30",
  phoneDisplay: "+54 9 3865 00-0000",
  instagram: "@elreyplay.oficial",
  googleMapsUrl: "https://maps.google.com",
  warrantyPolicy: "Garantía escrita de 90 días en todos los servicios y consolas.",
};

export const CATEGORIES = [
  { id: 'juegos_ps4', label: 'Juegos PS4 (Físicos)', icon: 'Disc3', badge: 'PS4' },
  { id: 'juegos_ps3', label: 'Juegos PS3 (Físicos)', icon: 'Gamepad', badge: 'PS3' },
  { id: 'consolas_ps4', label: 'Consolas PS4', icon: 'Tv', badge: 'Consola' },
  { id: 'consolas_ps3', label: 'Consolas PS3', icon: 'Cpu', badge: 'Consola' },
  { id: 'accesorios', label: 'Joysticks y Accesorios', icon: 'Headphones', badge: 'Gear' },
];

export const INITIAL_PRODUCTS = [
  // 1. JUEGOS PS4 (FÍSICOS)
  {
    id: "prod-ps4-1",
    name: "God of War Ragnarök",
    category: "juegos_ps4",
    price: 48000,
    format: "Físico Usado Impecable",
    condition: "Caja Original",
    tag: "Físico Usado Impecable",
    stock: 2,
    image: "/covers/gow-ragnarok.jpg",
    description: "Caja azul original completa con disco 10/10. Audio y subtítulos en español latino.",
    featured: true
  },
  {
    id: "prod-ps4-2",
    name: "EA Sports FC 24",
    category: "juegos_ps4",
    price: 42000,
    format: "Físico Usado",
    condition: "Disco 10/10",
    tag: "Físico Usado",
    stock: 3,
    image: "/covers/fc-24.jpg",
    description: "Fútbol de nueva generación con Ultimate Team y ligas actualizadas en formato físico.",
    featured: true
  },
  {
    id: "prod-ps4-3",
    name: "The Last of Us Part II",
    category: "juegos_ps4",
    price: 38000,
    format: "Físico Usado",
    condition: "Caja Original",
    tag: "Físico Usado",
    stock: 1,
    image: "/covers/tlou2.png",
    description: "Edición estándar física en estuche original. Disco testeado sin marcas ni rayas.",
    featured: true
  },
  {
    id: "prod-ps4-4",
    name: "Marvel's Spider-Man",
    category: "juegos_ps4",
    price: 32000,
    format: "Físico Usado",
    condition: "Hits",
    tag: "Físico Usado",
    stock: 2,
    image: "/covers/spiderman.jpg",
    description: "Edición PlayStation Hits en caja roja/azul con manuales y disco en excelente estado.",
    featured: true
  },
  {
    id: "prod-ps4-5",
    name: "Red Dead Redemption 2 (2 Discos)",
    category: "juegos_ps4",
    price: 45000,
    format: "Físico Usado",
    condition: "Con Mapa",
    tag: "Físico Usado",
    stock: 1,
    image: "/covers/rdr2.jpg",
    description: "Incluye los 2 discos (Data + Play) y el mapa original desplegable de New Austin.",
    featured: true
  },
  {
    id: "prod-ps4-6",
    name: "GTA V Premium Edition",
    category: "juegos_ps4",
    price: 35000,
    format: "Físico Nuevo Sellado",
    condition: "Nuevo",
    tag: "Físico Nuevo Sellado",
    stock: 4,
    image: "/covers/gtav.png",
    description: "Nuevo de fábrica en plástico sellado con tira PlayStation. Incluye pack de inicio criminal.",
    featured: true
  },
  {
    id: "prod-ps4-7",
    name: "Uncharted 4: A Thief's End",
    category: "juegos_ps4",
    price: 28000,
    format: "Físico Usado",
    condition: "Hits Impecable",
    tag: "Físico Usado",
    stock: 2,
    image: "/covers/uncharted4.jpg",
    description: "La despedida de Nathan Drake con gráficos cinematográficos y disco verificado.",
    featured: false
  },
  {
    id: "prod-ps4-8",
    name: "Bloodborne",
    category: "juegos_ps4",
    price: 30000,
    format: "Físico Usado",
    condition: "Caja Original",
    tag: "Físico Usado",
    stock: 1,
    image: "/covers/bloodborne.jpg",
    description: "Obra maestra de FromSoftware en caja original. Disco 10 de 10.",
    featured: false
  },
  {
    id: "prod-ps4-9",
    name: "Horizon Zero Dawn Complete Edition",
    category: "juegos_ps4",
    price: 26000,
    format: "Físico Usado",
    condition: "Complete Edition",
    tag: "Físico Usado",
    stock: 3,
    image: "/covers/horizon.jpg",
    description: "Incluye la expansión The Frozen Wilds y contenidos extra en disco.",
    featured: false
  },
  {
    id: "prod-ps4-10",
    name: "Resident Evil 4 Remake",
    category: "juegos_ps4",
    price: 46000,
    format: "Físico Usado",
    condition: "Disco 10/10",
    tag: "Físico Usado",
    stock: 2,
    image: "/covers/re4.jpg",
    description: "El aclamado survival horror reimaginado para PS4 con gráficos y jugabilidad de nueva era.",
    featured: false
  },
  {
    id: "prod-ps4-11",
    name: "Ghost of Tsushima",
    category: "juegos_ps4",
    price: 39000,
    format: "Físico Usado",
    condition: "Caja Original",
    tag: "Físico Usado",
    stock: 2,
    image: "/covers/ghost.jpg",
    description: "Aventura samurai de mundo abierto en Japón feudal con voces en japonés o latino.",
    featured: false
  },
  {
    id: "prod-ps4-12",
    name: "Elden Ring",
    category: "juegos_ps4",
    price: 49000,
    format: "Físico Usado Impecable",
    condition: "Disco 10/10",
    tag: "Físico Usado Impecable",
    stock: 1,
    image: "/covers/eldenring.jpg",
    description: "Juego del Año (GOTY). Mundo abierto épico de Hidetaka Miyazaki y George R.R. Martin.",
    featured: false
  },
  {
    id: "prod-ps4-13",
    name: "Crash Bandicoot N. Sane Trilogy",
    category: "juegos_ps4",
    price: 34000,
    format: "Físico Usado",
    condition: "3 Juegos en 1",
    tag: "Físico Usado",
    stock: 2,
    image: "/covers/crash.jpg",
    description: "Tres aventuras clásicas remasterizadas en alta definición para toda la familia.",
    featured: false
  },
  {
    id: "prod-ps4-14",
    name: "God of War (2018)",
    category: "juegos_ps4",
    price: 29000,
    format: "Físico Usado",
    condition: "PlayStation Hits",
    tag: "Físico Usado",
    stock: 3,
    image: "/covers/gow2018.jpg",
    description: "El inicio del viaje nórdico de Kratos y Atreus. Galardonado como Mejor Juego del Año.",
    featured: false
  },

  // 2. JUEGOS PS3 (FÍSICOS)
  {
    id: "prod-ps3-1",
    name: "GTA V (PS3)",
    category: "juegos_ps3",
    price: 18000,
    format: "Físico Usado",
    condition: "Caja Original",
    tag: "Físico Usado",
    stock: 2,
    image: "/covers/gtav.png",
    description: "Caja transparente original PS3 con mapa de Los Santos y disco Bluray verificado.",
    featured: true
  },
  {
    id: "prod-ps3-2",
    name: "God of War III",
    category: "juegos_ps3",
    price: 16000,
    format: "Físico Usado",
    condition: "Disco 10/10",
    tag: "Físico Usado",
    stock: 1,
    image: "/covers/gow3.jpg",
    description: "El épico cierre de la trilogía de Kratos en el Olimpo. Disco pulcro y sin detalles.",
    featured: true
  },
  {
    id: "prod-ps3-3",
    name: "PES 2018 (Físico)",
    category: "juegos_ps3",
    price: 19000,
    format: "Físico Usado",
    condition: "Original",
    tag: "Físico Usado",
    stock: 2,
    image: "/covers/pes2018.png",
    description: "Último gran PES para PS3 en formato disco. Ideal para jugar partidos clásicos de 2 a 4 jugadores.",
    featured: true
  },
  {
    id: "prod-ps3-4",
    name: "The Last of Us (PS3)",
    category: "juegos_ps3",
    price: 17000,
    format: "Físico Usado",
    condition: "Caja Original",
    tag: "Físico Usado",
    stock: 1,
    image: "/covers/tlou.jpg",
    description: "Edición original en caja con arte intacto. Testeado 100% en consola de banco de taller.",
    featured: true
  },
  {
    id: "prod-ps3-5",
    name: "Mortal Kombat Komplete Edition",
    category: "juegos_ps3",
    price: 15000,
    format: "Físico Usado",
    condition: "Disco 10/10",
    tag: "Físico Usado",
    stock: 2,
    image: "/covers/mk-komplete.png",
    description: "Incluye todos los personajes descargables: Freddy Krueger, Kenshi, Rain y Skarlet.",
    featured: true
  },
  {
    id: "prod-ps3-6",
    name: "Call of Duty: Black Ops II",
    category: "juegos_ps3",
    price: 16000,
    format: "Físico Usado",
    condition: "Original",
    tag: "Físico Usado",
    stock: 3,
    image: "/covers/cod-bo2.png",
    description: "Campaña futurista y el legendario modo Zombis en disco Bluray original.",
    featured: true
  },
  {
    id: "prod-ps3-7",
    name: "Uncharted 2: Among Thieves",
    category: "juegos_ps3",
    price: 14000,
    format: "Físico Usado",
    condition: "Caja Original",
    tag: "Físico Usado",
    stock: 2,
    image: "/covers/uncharted2.jpg",
    description: "La búsqueda de Shambhala en los Himalayas. Uno de los juegos mejor puntuados de PS3.",
    featured: false
  },
  {
    id: "prod-ps3-8",
    name: "Red Dead Redemption (PS3)",
    category: "juegos_ps3",
    price: 17000,
    format: "Físico Usado",
    condition: "Con Mapa Original",
    tag: "Físico Usado",
    stock: 1,
    image: "/covers/rdr1.jpg",
    description: "La historia original de John Marston en la frontera estadounidense y México.",
    featured: false
  },
  {
    id: "prod-ps3-9",
    name: "Need for Speed Most Wanted (2012)",
    category: "juegos_ps3",
    price: 15000,
    format: "Físico Usado",
    condition: "Disco 10/10",
    tag: "Físico Usado",
    stock: 2,
    image: "/covers/nfsmw.jpg",
    description: "Carreras callejeras de mundo abierto desarrolladas por Criterion Games con persecuciones policiales.",
    featured: false
  },
  {
    id: "prod-ps3-10",
    name: "Resident Evil 5",
    category: "juegos_ps3",
    price: 13000,
    format: "Físico Usado",
    condition: "Caja Original",
    tag: "Físico Usado",
    stock: 1,
    image: "/covers/re5.jpg",
    description: "Acción cooperativa inolvidable en África con Chris Redfield y Sheva Alomar.",
    featured: false
  },
  {
    id: "prod-ps3-11",
    name: "Assassin's Creed IV: Black Flag",
    category: "juegos_ps3",
    price: 14500,
    format: "Físico Usado",
    condition: "Edición Especial",
    tag: "Físico Usado",
    stock: 2,
    image: "/covers/ac4.jpg",
    description: "Navega y combate en el mar Caribe con el capitán pirata Edward Kenway.",
    featured: false
  },
  {
    id: "prod-ps3-12",
    name: "Batman: Arkham City",
    category: "juegos_ps3",
    price: 14000,
    format: "Físico Usado",
    condition: "Original Impecable",
    tag: "Físico Usado",
    stock: 2,
    image: "/covers/batman-ac.jpg",
    description: "El Caballero de la Noche atrapado en la prisión de máxima seguridad de Arkham City.",
    featured: false
  },

  // 3. CONSOLAS PS4
  {
    id: "prod-cons-ps4-1",
    name: "PlayStation 4 Slim 1TB + 1 Joystick + 2 Juegos Físicos",
    category: "consolas_ps4",
    price: 430000,
    model: "Slim",
    capacity: "1TB",
    systemStatus: "Original",
    tag: "Original Sellada / Verificada",
    stock: 2,
    image: "https://images.unsplash.com/photo-1507457379470-08b800bebc67?auto=format&fit=crop&w=800&q=80",
    description: "Consola PS4 Slim de 1TB en excelente estado térmico. Incluye mando DualShock 4 original y 2 juegos físicos a elección del catálogo.",
    featured: true,
    condition: "Original garantizada con 90 días de respaldo local"
  },
  {
    id: "prod-cons-ps4-2",
    name: "PlayStation 4 Pro 1TB 4K + 2 Joysticks",
    category: "consolas_ps4",
    price: 520000,
    model: "Pro",
    capacity: "1TB",
    systemStatus: "Original",
    tag: "Pro 4K HDR",
    stock: 1,
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=80",
    description: "Máxima resolución gráfica 4K HDR. Incluye 2 joysticks originales, cables HDMI 2.0 y mantenimiento térmico recién realizado con pasta Arctic MX-4.",
    featured: true,
    condition: "Seminueva testeada y silenciosa"
  },

  // 4. CONSOLAS PS3
  {
    id: "prod-cons-ps3-1",
    name: "PlayStation 3 Super Slim 500GB + 2 Joysticks",
    category: "consolas_ps3",
    price: 210000,
    model: "Super Slim",
    capacity: "500GB",
    systemStatus: "Con HEN / +30 Juegos",
    tag: "Con HEN / +30 Juegos",
    stock: 2,
    image: "https://images.unsplash.com/photo-1526509867162-5b0c0d1b4b33?auto=format&fit=crop&w=800&q=80",
    description: "Modelo Super Slim con sistema HEN 4.91 instalado. Lista para encender y jugar con más de 30 juegos cargados en el disco interno y tienda libre.",
    featured: true,
    condition: "Incluye 2 mandos inalámbricos y cable HDMI"
  },
  {
    id: "prod-cons-ps3-2",
    name: "PlayStation 3 Slim 320GB + 3 Juegos Físicos",
    category: "consolas_ps3",
    price: 195000,
    model: "Slim",
    capacity: "320GB",
    systemStatus: "Original Lectora 10 puntos",
    tag: "Original Lectora 10 Puntos",
    stock: 1,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    description: "Consola PS3 Slim con lectora óptica Bluray calibrada al 100%. Lee discos al instante. Incluye 3 juegos físicos en caja.",
    featured: false,
    condition: "Mantenimiento preventivo completo"
  },

  // 5. ACCESORIOS / JOYSTICKS
  {
    id: "prod-acc-1",
    name: "Joystick DualShock 4 V2 Negro",
    category: "accesorios",
    price: 65000,
    tag: "Original Reacondicionado",
    type: "Original Sony Reacondicionado",
    stock: 4,
    image: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=800&q=80",
    description: "DualShock 4 V2 original Sony. Analógicos con potenciómetros nuevos sin drift, batería original de larga duración y garantía escrita.",
    featured: true,
    condition: "Garantía de 90 días en taller"
  },
  {
    id: "prod-acc-2",
    name: "Joystick PS3 DualShock 3 Inalámbrico",
    category: "accesorios",
    price: 22000,
    tag: "Alternativo AAA",
    type: "Alternativo AAA",
    stock: 6,
    image: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=800&q=80",
    description: "Joystick inalámbrico Bluetooth con doble motor de vibración háptica y sensor Sixaxis. Incluye cable de carga USB.",
    featured: false,
    condition: "Nuevo en caja cerrada"
  }
];

export const INITIAL_SERVICES = [
  {
    id: "serv-1",
    title: "Mantenimiento Completo PS4",
    subtitle: "Limpieza + Pasta Térmica Arctic MX-4",
    price: 25000,
    turnaround: "24 a 48 hs",
    platform: "PS4 (Fat / Slim / Pro)",
    icon: "Fan",
    includes: [
      "Desarme completo y limpieza por ultrasonido",
      "Aplicación de pasta térmica importada Arctic MX-4",
      "Limpieza de disipador de aluminio y turbina de refrigeración",
      "Revisión y lubricación de cooler y thermal pads",
      "Test de estrés térmico de 2 horas continuas"
    ],
    highlight: "¡Elimina el ruido de turbina de avión!"
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
      "Limpieza de polvo y pelusa interna de fuente y placa",
      "Cambio de pasta térmica premium en procesadores CELL y RSX",
      "Calibración de perfil de ventilación para prolongar la vida útil",
      "Verificación de lectura Bluray y disco duro",
      "Informe del estado térmico final"
    ],
    highlight: "Consola silenciosa y duradera"
  },
  {
    id: "serv-3",
    title: "Reparación de Analógico / Drift Joystick PS4 o PS3",
    subtitle: "Reemplazo con potenciómetros originales de alta precisión",
    price: 14000,
    turnaround: "En el día",
    platform: "DualShock 4 & DualShock 3",
    icon: "Gamepad2",
    includes: [
      "Diagnóstico en software para medir zona muerta y desvíos",
      "Desoldado prolijo con estación térmica profesional",
      "Colocación de módulo analógico original con calibración",
      "Limpieza interna de membranas y contactos",
      "Garantía de 60 días contra retorno de drift"
    ],
    highlight: "¡Tu mira vuelve a estar 100% precisa!"
  },
  {
    id: "serv-4",
    title: "Limpieza y Calibración de Lectora Blu-ray (PS3 / PS4)",
    subtitle: "Solución a problemas de lectura o expulsión trabada",
    price: 22000,
    turnaround: "24 a 48 hs",
    platform: "PS3 & PS4 (Todas las versiones)",
    icon: "Tv2",
    includes: [
      "Limpieza óptica microscópica de lentes láser KES",
      "Lubricación de rieles, engranajes y rodillos de inserción",
      "Ajuste y calibración de potenciómetro de potencia láser",
      "Prueba intensiva con discos físicos de doble capa",
      "Garantía escrita de funcionamiento"
    ],
    highlight: "Recupera la lectura rápida de tus juegos físicos"
  }
];

export const INITIAL_REPAIRS = [
  {
    id: "101",
    dni: "38111222",
    clientName: "Lucas Gómez",
    phone: "5493865112233",
    device: "PS4 Fat 500GB",
    issue: "Calienta y hace ruido de turbina",
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
    issue: "Drift en analógico izquierdo",
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
    issue: "Traba los discos físicos al salir",
    status: "En fila",
    cost: 22000,
    entryDate: "2026-11-07T09:15:00",
    technicianNotes: "Rodillos de inserción/expulsión resecos. Mantenimiento y alineación de mecanismo de carga.",
    priority: "Normal"
  }
];

// Helper to seed transactions dynamically relative to current date
const getIsoDateString = (offsetDays = 0, timeStr = '12:00:00') => {
  const d = new Date(Date.now() - offsetDays * 86400000);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}T${timeStr}`;
};

export const INITIAL_TRANSACTIONS = [
  // HOY
  {
    id: "tx-101",
    date: getIsoDateString(0, "10:15:00"),
    type: "juego", // 'juego' | 'reparacion' | 'consola' | 'accesorio' | 'otro'
    category: "Venta de Juegos",
    title: "God of War Ragnarök (PS4)",
    amount: 48000,
    paymentMethod: "Efectivo", // 'Efectivo' | 'Transferencia'
    customer: "Lucas Gómez",
    notes: "Caja física impecable. Pago en efectivo exacto en mostrador.",
    referenceId: "prod-ps4-1"
  },
  {
    id: "tx-102",
    date: getIsoDateString(0, "11:40:00"),
    type: "reparacion",
    category: "Servicio Técnico",
    title: "Reparación Orden #102 - 2x Joysticks PS4 (Drift)",
    amount: 28000,
    paymentMethod: "Transferencia",
    customer: "Martín Díaz",
    notes: "Cambio de módulos analógicos y calibración. Transferencia por Mercado Pago verificada.",
    referenceId: "102"
  },
  {
    id: "tx-103",
    date: getIsoDateString(0, "13:10:00"),
    type: "juego",
    category: "Venta de Juegos",
    title: "EA Sports FC 24 (PS4)",
    amount: 42000,
    paymentMethod: "Efectivo",
    customer: "Cliente Mostrador",
    notes: "Juego físico usado disco 10/10.",
    referenceId: "prod-ps4-2"
  },
  {
    id: "tx-104",
    date: getIsoDateString(0, "17:35:00"),
    type: "accesorio",
    category: "Consolas & Accesorios",
    title: "Joystick DualShock 4 V2 Negro (Reacondicionado)",
    amount: 65000,
    paymentMethod: "Transferencia",
    customer: "Esteban Rodríguez",
    notes: "Pago por transferencia bancaria instantánea. Garantía 90 días.",
    referenceId: "prod-acc-1"
  },
  {
    id: "tx-105",
    date: getIsoDateString(0, "19:20:00"),
    type: "juego",
    category: "Venta de Juegos",
    title: "GTA V (PS3)",
    amount: 18000,
    paymentMethod: "Efectivo",
    customer: "Nahuel Coronel",
    notes: "Físico caja original con mapa de Los Santos.",
    referenceId: "prod-ps3-1"
  },

  // AYER
  {
    id: "tx-201",
    date: getIsoDateString(1, "10:30:00"),
    type: "reparacion",
    category: "Servicio Técnico",
    title: "Mantenimiento Completo PS4 Fat (Limpieza + Arctic MX-4)",
    amount: 25000,
    paymentMethod: "Transferencia",
    customer: "Rodrigo Morales",
    notes: "Limpieza ultrasónica de turbina y disipador, cambio térmico.",
    referenceId: "101"
  },
  {
    id: "tx-202",
    date: getIsoDateString(1, "12:15:00"),
    type: "juego",
    category: "Venta de Juegos",
    title: "The Last of Us Part II (PS4)",
    amount: 38000,
    paymentMethod: "Efectivo",
    customer: "Cliente Mostrador",
    notes: "Caja original física impecable.",
    referenceId: "prod-ps4-3"
  },
  {
    id: "tx-203",
    date: getIsoDateString(1, "18:00:00"),
    type: "juego",
    category: "Venta de Juegos",
    title: "God of War III Remastered (PS4)",
    amount: 28000,
    paymentMethod: "Transferencia",
    customer: "Carlos Pérez",
    notes: "Transferencia por Cuenta DNI.",
    referenceId: "prod-ps4-7"
  },
  {
    id: "tx-204",
    date: getIsoDateString(1, "19:45:00"),
    type: "reparacion",
    category: "Servicio Técnico",
    title: "Reparación Drift Analógico DS4",
    amount: 14000,
    paymentMethod: "Efectivo",
    customer: "Joaquín Benítez",
    notes: "Reemplazo de potenciómetro izquierdo.",
    referenceId: null
  },

  // HACE 2 DÍAS
  {
    id: "tx-301",
    date: getIsoDateString(2, "11:20:00"),
    type: "consola",
    category: "Consolas & Accesorios",
    title: "PlayStation 3 Super Slim 500GB con HEN + 30 Juegos",
    amount: 210000,
    paymentMethod: "Transferencia",
    customer: "Matías Albornoz",
    notes: "Consola completa con 2 joysticks y 30 juegos cargados en disco rígido.",
    referenceId: "prod-con-ps3-1"
  },
  {
    id: "tx-302",
    date: getIsoDateString(2, "16:40:00"),
    type: "juego",
    category: "Venta de Juegos",
    title: "Red Dead Redemption 2 (2 Discos Físicos)",
    amount: 45000,
    paymentMethod: "Efectivo",
    customer: "Diego Valdez",
    notes: "Edición con los 2 discos y mapa original.",
    referenceId: "prod-ps4-5"
  }
];
