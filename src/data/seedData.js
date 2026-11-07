export const INITIAL_CONFIG = {
  businessName: "PlayCenter Aguilares",
  whatsappNumber: "5493865000000",
  adminPin: "2020",
  address: "Aguilares, Tucumán",
  businessHours: "Lunes a Sábado de 09:30 a 13:00 y 17:30 a 21:30",
  phoneDisplay: "+54 9 3865 00-0000",
  instagram: "@playcenter.aguilares",
  googleMapsUrl: "https://maps.google.com/?q=Aguilares+Tucuman",
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
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80",
    description: "Edición PlayStation Hits en caja roja/azul con manuales y disco en excelente estado.",
    featured: false
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
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=600&q=80",
    description: "Nuevo de fábrica en plástico sellado con tira PlayStation. Incluye pack de inicio criminal.",
    featured: true
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
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80",
    description: "Último gran PES para PS3 en formato disco. Ideal para jugar partidos clásicos de 2 a 4 jugadores.",
    featured: false
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
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=600&q=80",
    description: "Incluye todos los personajes descargables: Freddy Krueger, Kenshi, Rain y Skarlet.",
    featured: false
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
    image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=600&q=80",
    description: "Campaña futurista y el legendario modo Zombis en disco Bluray original.",
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
