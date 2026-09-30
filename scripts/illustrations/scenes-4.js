// Escenas: conversores de unidades y matemáticas (lote 2).
const k = require('./kit')
const { C, place, text, rect, circle } = k

const SERIF = 'Georgia, serif'

module.exports = [
  {
    slug: 'libras-a-kilos',
    file: 'convertir-libras-a-kilos',
    alt: 'Libras a kilos',
    draw: () =>
      k.frame('libras-kilos', { blob2: C.amberSoft }) +
      k.ground(400, 400, 500) +
      // Báscula de baño con lectura en libras y kilos.
      place(290, 280, rect(-130, -70, 260, 150, { rx: 30, fill: C.white, stroke: C.purple, sw: 5 }) + rect(-70, -46, 140, 50, { rx: 10, fill: '#1E1B4B' }) + text(0, -12, '150 lb', { size: 28, fill: C.amber, family: 'Courier New, monospace' }) + rect(-90, 20, 60, 36, { rx: 12, fill: C.purpleXs }) + rect(30, 20, 60, 36, { rx: 12, fill: C.purpleXs })) +
      k.arrow(440, 200, 520, 200, { color: C.purple, bend: 20 }) +
      place(620, 200, rect(-100, -56, 200, 112, { rx: 18, fill: C.purple }) + text(0, 16, '68.04 kg', { size: 34, fill: C.white })) +
      place(620, 330, `<path d="M-50,40 L-38,-20 H38 L50,40 Z" fill="${C.slate}"/>` + text(0, 26, 'lb', { size: 22, fill: C.white })),
  },
  {
    slug: 'fahrenheit-a-celsius',
    file: 'convertir-grados-fahrenheit-a-celsius',
    alt: 'Fahrenheit a Celsius',
    draw: () =>
      k.frame('fahrenheit-celsius', { blob: C.redSoft, blob2: C.blueSoft }) +
      k.ground(400, 400, 460) +
      place(250, 230, k.thermometer({ level: 0.7, fill: C.red })) + text(250, 110, '°F', { size: 32, fill: C.red }) +
      place(550, 230, k.thermometer({ level: 0.45, fill: C.blue })) + text(550, 110, '°C', { size: 32, fill: C.blue }) +
      k.arrow(300, 190, 500, 190, { color: C.purple, bend: 40 }) + place(400, 290, k.pill({ w: 180, h: 46, label: '100 °F = 37.8 °C', fill: C.purple, size: 17 })) +
      place(680, 110, circle(0, 0, 28, { fill: C.amber })),
  },
  {
    slug: 'onzas-a-gramos',
    file: 'convertir-onzas-a-gramos',
    alt: 'Onzas a gramos',
    draw: () =>
      k.frame('onzas-gramos', { blob2: C.amberSoft }) +
      k.ground(400, 400, 500) +
      // Báscula de cocina con harina y lingote para la onza troy.
      place(280, 290, rect(-120, -20, 240, 80, { rx: 20, fill: C.white, stroke: C.teal, sw: 5 }) + rect(-60, 4, 120, 36, { rx: 8, fill: '#134E4A' }) + text(0, 30, '227 g', { size: 22, fill: C.greenSoft, family: 'Courier New, monospace' }) + `<path d="M-100,-20 Q0,-50 100,-20" fill="${C.tealSoft}" stroke="${C.teal}" stroke-width="4"/>` + `<path d="M-60,-40 Q0,-120 60,-40 Z" fill="${C.amberSoft}"/>`) +
      place(560, 180, k.pill({ w: 170, h: 52, label: '8 oz', fill: C.purple, size: 24 })) +
      place(580, 300, `<path d="M-60,30 L-40,-20 H40 L60,30 Z" fill="${C.amber}" stroke="${C.amberDark}" stroke-width="4"/>` + text(0, 18, 'oz troy', { size: 15, fill: C.amberDark })),
  },
  {
    slug: 'tazas-a-ml',
    file: 'cuantos-ml-tiene-una-taza',
    alt: 'Tazas a ml',
    draw: () =>
      k.frame('tazas-ml', { blob: C.amberSoft, blob2: C.pinkSoft }) +
      k.ground(400, 400, 500) +
      place(260, 240, k.cup({ level: 0.7 })) + text(260, 150, '1 taza', { size: 22, fill: C.blue }) +
      k.arrow(360, 200, 470, 200, { color: C.purple, bend: 30 }) +
      place(580, 200, rect(-90, -50, 180, 100, { rx: 18, fill: C.white, stroke: C.purple, sw: 4 }) + text(0, 14, '236.6 ml', { size: 30, fill: C.purple })) +
      // Cucharas medidoras.
      place(570, 320, [0, 1, 2].map((i) => place(i * 50 - 50, 0, `<ellipse cx="0" cy="0" rx="${20 - i * 4}" ry="${12 - i * 2}" fill="${C.purpleSoft}" stroke="${C.purple}" stroke-width="3"/><path d="M0,${12 - i * 2} V50" stroke="${C.purple}" stroke-width="5" stroke-linecap="round"/>`)).join('')),
  },
  {
    slug: 'millas-a-kilometros',
    file: 'convertir-millas-a-kilometros',
    alt: 'Millas a kilómetros',
    draw: () =>
      k.frame('millas-km', { blob2: C.greenSoft }) +
      // Carretera en perspectiva con señales en millas y kilómetros.
      `<path d="M300,450 L380,190 H420 L500,450 Z" fill="${C.slate}"/><path d="M400,440 V410 M400,380 V350 M400,320 V296 M400,270 V252 M400,232 V218" stroke="${C.amber}" stroke-width="6"/>` +
      `<path d="M0,450 L300,450 L380,190 L0,230 Z" fill="${C.greenSoft}"/><path d="M800,450 L500,450 L420,190 L800,230 Z" fill="${C.greenSoft}"/>` +
      place(200, 190, rect(-80, -44, 160, 88, { rx: 12, fill: C.green }) + text(0, 12, '60 mi', { size: 30, fill: C.white }) + rect(-5, 44, 10, 120, { rx: 3, fill: C.slateMid })) +
      place(610, 190, rect(-90, -44, 180, 88, { rx: 12, fill: C.blue }) + text(0, 12, '96.6 km', { size: 30, fill: C.white }) + rect(-5, 44, 10, 120, { rx: 3, fill: C.slateMid })) +
      place(400, 90, k.pill({ w: 170, h: 42, label: '× 1.609', fill: C.purple, size: 20 })),
  },
  {
    slug: 'pies-a-metros',
    file: 'convertir-pies-a-metros-y-estatura',
    alt: 'Pies a metros',
    draw: () =>
      k.frame('pies-metros') +
      k.ground(360, 400, 420) +
      // Tallímetro con persona y la estatura en pies y metros.
      place(430, 230, rect(-14, -170, 28, 340, { rx: 6, fill: C.amber, stroke: C.amberDark, sw: 3 }) + [...Array(14)].map((_, i) => rect(-14, -160 + i * 24, i % 2 ? 12 : 20, 3, { rx: 1, fill: C.amberDark })).join('')) +
      place(320, 330, k.person({ shirt: C.purple, hair: 1 }), { s: 1.2 }) + `<line x1="270" y1="146" x2="430" y2="146" stroke="${C.red}" stroke-width="3" stroke-dasharray="8 6"/>` +
      place(600, 170, k.pill({ w: 170, h: 48, label: "5′ 9″", fill: C.slate, size: 24 })) + place(600, 240, k.pill({ w: 170, h: 48, label: '1.75 m', fill: C.purple, size: 24 })) +
      place(620, 340, k.ruler({ w: 180 }), { r: -6 }),
  },
  {
    slug: 'litros-a-galones',
    file: 'convertir-litros-a-galones',
    alt: 'Litros a galones',
    draw: () =>
      k.frame('litros-galones', { blob2: C.amberSoft }) +
      k.ground(400, 400, 520) +
      // Garrafa de galón y botellas de litro.
      place(260, 250, `<path d="M-80,-90 H40 L80,-50 V110 H-80 Z" fill="${C.blueSoft}" stroke="${C.blue}" stroke-width="5"/>` + rect(-20, -126, 44, 36, { rx: 8, fill: C.blue }) + `<path d="M40,-90 Q90,-90 80,-10" fill="none" stroke="${C.blue}" stroke-width="10"/>` + text(-10, 34, '1 gal', { size: 32, fill: C.blue })) +
      text(420, 256, '=', { size: 56, fill: C.purple }) +
      [0, 1, 2, 3].map((i) => place(500 + i * 52, 280, rect(-20, -60, 40, 110, { rx: 12, fill: i < 3 ? C.tealSoft : C.white, stroke: C.teal, sw: 3 }) + rect(-8, -80, 16, 22, { rx: 4, fill: C.teal }))).join('') +
      text(580, 370, '3.785 L', { size: 26, fill: C.teal }),
  },
  {
    slug: 'calculadora-promedio',
    file: 'sacar-promedio-de-calificaciones',
    alt: 'Calculadora de promedio',
    draw: () =>
      k.frame('promedio-notas', { blob2: C.amberSoft }) +
      k.ground(400, 400, 540) +
      place(230, 220, k.doc({ w: 190, h: 240, accent: C.blue, head: C.blueSoft, title: 'BOLETA', rows: [] }) + ['8', '9', '7.5', '10', '6'].map((n, i) => text(-60, -52 + i * 34, 'Materia', { size: 14, fill: C.slateMid, anchor: 'start' }) + text(62, -52 + i * 34, n, { size: 18, fill: C.slate, anchor: 'end' })).join('')) +
      // Balanza en equilibrio: la media.
      place(530, 250, k.scale({ tilt: 0 }), { s: 0.9 }) +
      place(530, 110, k.pill({ w: 180, h: 48, label: 'Promedio 8.1', fill: C.purple, size: 20 })),
  },
  {
    slug: 'calculadora-fracciones',
    file: 'sumar-restar-multiplicar-dividir-fracciones',
    alt: 'Calculadora de fracciones',
    draw: () =>
      k.frame('fracciones', { blob: C.amberSoft, blob2: C.pinkSoft }) +
      k.ground(400, 400, 560) +
      // Pizzas partidas: 1/2 + 1/3 = 5/6.
      place(160, 220, k.pie({ r: 70, parts: [[0.5, C.amber], [0.5, C.amberSoft]] })) + text(160, 330, '1/2', { size: 30, fill: C.slate, family: SERIF }) +
      text(270, 232, '+', { size: 50, fill: C.purple }) +
      place(380, 220, k.pie({ r: 70, parts: [[1 / 3, C.red], [2 / 3, C.redSoft]] })) + text(380, 330, '1/3', { size: 30, fill: C.slate, family: SERIF }) +
      text(490, 232, '=', { size: 50, fill: C.purple }) +
      place(620, 220, k.pie({ r: 80, parts: [[5 / 6, C.purple], [1 / 6, C.purpleXs]] })) + text(620, 340, '5/6', { size: 36, fill: C.purple, family: SERIF }),
  },
  {
    slug: 'calculadora-mcd-mcm',
    file: 'calcular-maximo-comun-divisor-y-minimo-comun-multiplo',
    alt: 'Calculadora MCD y MCM',
    draw: () =>
      k.frame('mcd-mcm') +
      k.ground(400, 400, 560) +
      // Árbol de factores primos de 12.
      place(220, 220, circle(0, -110, 34, { fill: C.purple }) + text(0, -99, '12', { size: 28, fill: C.white }) + `<path d="M-14,-80 L-60,-20 M14,-80 L60,-20 M60,20 L30,70 M60,20 L90,70" stroke="${C.slateSoft}" stroke-width="5"/>` + circle(-60, 0, 28, { fill: C.amber }) + text(-60, 9, '2', { size: 24, fill: C.slate }) + circle(60, 0, 28, { fill: C.purpleSoft }) + text(60, 9, '6', { size: 24, fill: C.slate }) + circle(30, 90, 26, { fill: C.amber }) + text(30, 99, '2', { size: 22, fill: C.slate }) + circle(90, 90, 26, { fill: C.amber }) + text(90, 99, '3', { size: 22, fill: C.slate })) +
      place(560, 170, k.pill({ w: 230, h: 56, label: 'MCD (12, 18) = 6', fill: C.teal, size: 22 })) + place(560, 260, k.pill({ w: 230, h: 56, label: 'MCM (12, 18) = 36', fill: C.purple, size: 22 })) +
      place(560, 350, text(0, 0, '12 = 2² × 3', { size: 22, fill: C.slate, family: SERIF })),
  },
  {
    slug: 'calculadora-pitagoras',
    file: 'calcular-hipotenusa-teorema-de-pitagoras',
    alt: 'Teorema de Pitágoras',
    draw: () =>
      k.frame('pitagoras', { blob2: C.amberSoft }) +
      k.ground(360, 400, 460) +
      // Triángulo 3-4-5 con los cuadrados de sus lados.
      place(300, 300, `<path d="M0,0 H160 V-120 Z" fill="${C.purpleXs}" stroke="${C.purple}" stroke-width="5" stroke-linejoin="round"/>` + rect(130, -30, 30, 30, { rx: 0, fill: 'none', stroke: C.purple, sw: 3 }) + rect(0, 0, 160, 80, { rx: 0, fill: C.amber, o: 0.5 }) + rect(160, -120, 80, 120, { rx: 0, fill: C.teal, o: 0.45 }) + text(80, 50, 'a² = 16', { size: 20, fill: C.slate }) + text(200, -50, 'b² = 9', { size: 18, fill: C.slate }) + text(40, -80, 'c = 5', { size: 26, fill: C.purple })) +
      place(600, 150, text(0, 0, 'a² + b² = c²', { size: 36, fill: C.slate, family: SERIF })) + place(620, 300, k.pencil({ l: 160 }), { r: -32 }),
  },
  {
    slug: 'calculadora-factorial',
    file: 'calcular-factorial-de-un-numero',
    alt: 'Calculadora factorial',
    draw: () =>
      k.frame('factorial') +
      k.ground(400, 400, 560) +
      place(230, 220, circle(0, 0, 110, { fill: C.purple }) + text(0, 38, '5!', { size: 110, fill: C.white, family: SERIF })) +
      // Cadena de multiplicaciones que crece.
      place(560, 150, text(0, 0, '5 × 4 × 3 × 2 × 1', { size: 30, fill: C.slate, family: SERIF })) + place(560, 220, k.pill({ w: 170, h: 54, label: '= 120', fill: C.amber, tc: C.slate, size: 28 })) +
      place(560, 320, rect(-170, -30, 340, 60, { rx: 14, fill: '#1E1B4B' }) + text(0, 9, '3628800 · 479001600…', { size: 20, fill: C.greenSoft, family: 'Courier New, monospace' })),
  },
  {
    slug: 'calculadora-desviacion-estandar',
    file: 'calcular-desviacion-estandar-y-varianza',
    alt: 'Calculadora de desviación estándar',
    draw: () =>
      k.frame('desviacion-estandar', { blob2: C.tealSoft }) +
      k.ground(400, 400, 560) +
      // Campana de Gauss con ±σ.
      place(330, 300, `<path d="M-230,0 C-150,0 -110,-200 0,-200 C110,-200 150,0 230,0 Z" fill="${C.purpleXs}" stroke="${C.purple}" stroke-width="5"/>` + `<path d="M-80,0 C-60,-120 -30,-196 0,-200 C30,-196 60,-120 80,0 Z" fill="${C.purpleSoft}"/>` + `<line x1="0" y1="-200" x2="0" y2="0" stroke="${C.purpleDark}" stroke-width="3" stroke-dasharray="8 6"/>` + text(-80, 30, '−σ', { size: 22, fill: C.slate, family: SERIF }) + text(0, 30, 'μ', { size: 24, fill: C.slate, family: SERIF }) + text(80, 30, '+σ', { size: 22, fill: C.slate, family: SERIF })) +
      place(640, 180, rect(-100, -60, 200, 120, { rx: 18, fill: C.white, stroke: C.teal, sw: 4 }) + text(0, -12, 's =', { size: 22, fill: C.slateMid, family: SERIF }) + text(0, 30, '2.138', { size: 34, fill: C.teal })) +
      place(650, 320, k.barChart({ vals: [0.3, 0.6, 1, 0.6, 0.3], w: 140, h: 70, axis: false, colors: [C.tealSoft, C.teal, C.purple, C.teal, C.tealSoft] })),
  },
  {
    slug: 'tablas-de-multiplicar',
    file: 'tablas-de-multiplicar-para-imprimir-y-practicar',
    alt: 'Tablas de multiplicar',
    draw: () =>
      k.frame('tablas-multiplicar', { blob: C.amberSoft, blob2: C.greenSoft }) +
      k.ground(400, 400, 560) +
      place(250, 220, rect(-160, -130, 320, 260, { rx: 18, fill: C.white, stroke: C.purple, sw: 4 }) + text(0, -92, 'Tabla del 7', { size: 22, fill: C.purple }) + [1, 2, 3, 4, 5, 6].map((n, i) => text(-110 + (i % 2) * 150, -50 + Math.floor(i / 2) * 50, `7 × ${n} = ${7 * n}`, { size: 20, fill: C.slate, anchor: 'start', family: SERIF })).join('')) +
      place(560, 180, rect(-90, -60, 180, 120, { rx: 18, fill: C.green }) + text(0, 14, '7 × 8 = ?', { size: 28, fill: C.white })) +
      place(530, 320, k.badge({ r: 34, label: '★', fill: C.amber, tc: C.white })) + place(620, 330, k.pencil({ l: 130 }), { r: -20 }),
  },
  {
    slug: 'edad-de-mi-perro',
    file: 'calcular-edad-de-perro-en-anos-humanos',
    alt: 'Edad de mi perro en años humanos',
    draw: () =>
      k.frame('edad-perro', { blob: C.amberSoft, blob2: C.blueSoft }) +
      k.ground(290, 400, 360) +
      // Perrito sentado con collar y placa de cumpleaños.
      place(280, 280, `<ellipse cx="0" cy="40" rx="90" ry="70" fill="${C.amberDark}"/>` + circle(0, -50, 64, { fill: C.amberDark }) + `<ellipse cx="-58" cy="-70" rx="22" ry="44" fill="#92400E" transform="rotate(20 -58 -70)"/><ellipse cx="58" cy="-70" rx="22" ry="44" fill="#92400E" transform="rotate(-20 58 -70)"/>` + `<ellipse cx="0" cy="-30" rx="30" ry="22" fill="#FDE68A"/>` + circle(-22, -62, 7, { fill: C.slate }) + circle(22, -62, 7, { fill: C.slate }) + `<ellipse cx="0" cy="-38" rx="10" ry="7" fill="${C.slate}"/>` + rect(-46, 2, 92, 14, { rx: 7, fill: C.red }) + circle(0, 24, 14, { fill: C.amber }) + `<ellipse cx="-44" cy="100" rx="22" ry="12" fill="#92400E"/><ellipse cx="44" cy="100" rx="22" ry="12" fill="#92400E"/>`) +
      place(560, 170, k.pill({ w: 200, h: 50, label: '5 años de perro', fill: C.amber, tc: C.slate, size: 20 })) + k.arrow(560, 200, 560, 250, { color: C.purple, bend: 0 }) +
      place(560, 290, k.pill({ w: 220, h: 56, label: '≈ 39 años humanos', fill: C.purple, size: 20 })) + place(680, 100, k.paw({ s: 0.6 })),
  },
]
