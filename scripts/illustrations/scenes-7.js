// Escenas: España, Argentina y Chile (lote 3).
const k = require('./kit')
const { C, place, text, rect, circle } = k

// Piezas propias de este lote.
const suitcase = ({ fill = C.purple } = {}) => rect(-22, -70, 44, 24, { rx: 10, fill: 'none', stroke: C.slate, sw: 7 }) + rect(-70, -50, 140, 110, { rx: 16, fill }) + rect(-30, -50, 12, 110, { rx: 0, fill: C.white, o: 0.35 }) + rect(18, -50, 12, 110, { rx: 0, fill: C.white, o: 0.35 })
const meter = ({ label = '0342', unit = 'kWh' } = {}) => rect(-80, -90, 160, 180, { rx: 20, fill: C.white, stroke: C.slate, sw: 4 }) + rect(-60, -66, 120, 44, { rx: 8, fill: C.slate }) + text(0, -35, label, { size: 26, fill: C.amber, family: 'Courier New, monospace' }) + text(0, -2, unit, { size: 16, fill: C.slateMid }) + place(0, 44, k.gauge({ v: 0.62, r: 38, color: C.amber }), { s: 0.9 })
const footprint = ({ fill = C.green } = {}) => `<path d="M-30,-40 Q-44,-100 0,-110 Q44,-104 36,-40 Q30,10 20,60 Q14,90 -8,90 Q-30,88 -28,56 Q-24,10 -30,-40 Z" fill="${fill}"/>` + [[-34, -142, 13], [-6, -150, 11], [18, -146, 10], [36, -134, 8], [48, -118, 7]].map(([x, y, r]) => circle(x, y, r, { fill })).join('')
const roller = () => rect(-70, -26, 140, 52, { rx: 18, fill: C.purple }) + rect(-70, -26, 140, 18, { rx: 9, fill: C.purpleDark, o: 0.4 }) + `<path d="M70,0 H92 V50 H0 V90" fill="none" stroke="${C.slate}" stroke-width="7" stroke-linejoin="round"/>` + rect(-10, 88, 20, 60, { rx: 8, fill: C.amberDark })
const stairs = (n, { w = 34, step = 20, hi = -1, color = C.purpleSoft, hiColor = C.purple, labels = [] } = {}) =>
  [...Array(n)].map((_, i) => rect(i * (w + 6), -(i + 1) * step, w, (i + 1) * step, { rx: 6, fill: i === hi ? hiColor : color }) + (labels[i] ? text(i * (w + 6) + w / 2, 20, labels[i], { size: 13, fill: i === hi ? hiColor : C.slateMid }) : '')).join('')

module.exports = [
  // ── España ──
  {
    slug: 'calcular-paro',
    file: 'cuanto-cobro-de-paro-en-2026',
    alt: 'Calcular paro',
    draw: () =>
      k.frame('paro-espana', { blob2: C.amberSoft }) +
      k.ground(400, 400, 580) +
      place(170, 300, k.person({ shirt: C.blue, skin: 3, hair: 1, pose: 'hold' })) + place(215, 282, rect(-24, -18, 48, 36, { rx: 5, fill: C.amber }) + rect(-24, -18, 48, 10, { rx: 5, fill: C.amberDark }), { r: 6 }) +
      place(430, 230, k.doc({ w: 190, h: 230, title: 'PRESTACIÓN', rows: [140, 110, 130], total: '1.225 €/mes' })) +
      place(610, 300, rect(-10, -150, 150, 150, { rx: 0, fill: 'none' }) + rect(0, -130, 50, 130, { rx: 8, fill: C.purple }) + rect(62, -110, 50, 110, { rx: 8, fill: C.purpleSoft }) + text(25, -142, '70%', { size: 18, fill: C.purple }) + text(87, -122, '60%', { size: 18, fill: C.slateMid }) + text(25, 24, '180 d', { size: 13, fill: C.slateMid }) + text(87, 24, 'resto', { size: 13, fill: C.slateMid })) +
      place(700, 90, k.flag('ES', 80)),
  },
  {
    slug: 'cuota-autonomo',
    file: 'calcular-cuota-de-autonomos-por-tramos',
    alt: 'Cuota de autónomos 2026',
    draw: () =>
      k.frame('autonomos-tramos', { blob2: C.tealSoft }) +
      k.ground(400, 400, 600) +
      place(170, 250, rect(-110, -70, 220, 140, { rx: 12, fill: C.slate }) + rect(-100, -60, 200, 120, { rx: 6, fill: C.blueSoft }) + k.lineChart({ pts: [0.2, 0.5, 0.4, 0.8], w: 150, h: 70, color: C.blue }) + rect(-140, 70, 280, 16, { rx: 8, fill: C.slateMid })) +
      place(170, 110, k.pill({ w: 170, h: 40, label: 'Rendimientos', fill: C.teal, size: 17 })) +
      place(360, 330, stairs(8, { w: 38, step: 26, hi: 4, labels: ['1', '2', '3', '4', '5', '6', '7', '8'] })) +
      place(572, 150, k.bubble({ w: 150, h: 60, label: '294 €/mes', size: 22, stroke: C.purple, tail: 'left' })) +
      place(710, 90, k.flag('ES', 76)),
  },
  {
    slug: 'calcular-plusvalia',
    file: 'calcular-plusvalia-municipal-venta-de-vivienda',
    alt: 'Calcular plusvalía municipal',
    draw: () =>
      k.frame('plusvalia-municipal', { blob2: C.greenSoft }) +
      k.ground(400, 400, 580) +
      place(250, 300, k.house({ w: 190, roof: C.purple, door: C.amber })) +
      place(250, 110, k.pill({ w: 130, h: 40, label: 'VENDIDO', fill: C.red, size: 18 }), { r: -6 }) +
      place(480, 250, k.lineChart({ pts: [0.15, 0.25, 0.3, 0.5, 0.62, 0.85], w: 170, h: 130, color: C.green })) +
      k.arrow(420, 350, 560, 350, { color: C.slateSoft, bend: 0, sw: 3 }) + text(420, 378, 'compra', { size: 14, fill: C.slateMid }) + text(560, 378, 'venta', { size: 14, fill: C.slateMid }) +
      place(660, 230, k.doc({ w: 120, h: 150, title: 'IIVTNU', head: C.amberSoft, accent: C.amberDark, rows: [80, 60, 70], stamp: true })) +
      place(700, 80, k.flag('ES', 70)),
  },
  {
    slug: 'nota-de-corte',
    file: 'calcular-nota-de-admision-ebau-sobre-14',
    alt: 'Nota de corte PAU',
    draw: () =>
      k.frame('nota-corte-pau', { blob2: C.blueSoft }) +
      k.ground(400, 400, 560) +
      place(230, 230, rect(-140, -120, 280, 240, { rx: 20, fill: C.white, stroke: C.purple, sw: 4 }) + text(0, -80, 'NOTA DE ADMISIÓN', { size: 16, fill: C.slateMid }) + text(-16, 10, '12,85', { size: 66, fill: C.purple }) + text(118, 10, '/14', { size: 26, fill: C.slateMid }) + rect(-110, 44, 220, 14, { rx: 7, fill: C.purpleXs }) + rect(-110, 44, 202, 14, { rx: 7, fill: C.purple }) + text(0, 92, 'Bachillerato + PAU + ponderación', { size: 13, fill: C.slateMid })) +
      place(530, 180, k.gradCap({}), { s: 0.9 }) +
      place(530, 320, [['0,6 ×', C.teal], ['0,4 ×', C.blue], ['0,2 ×', C.amberDark]].map(([l, c], i) => place((i - 1) * 84, 0, k.pill({ w: 76, h: 36, label: l, fill: c, size: 15 }))).join('')) +
      place(700, 90, k.flag('ES', 70)),
  },
  {
    slug: 'calculadora-factura-luz',
    file: 'calcular-factura-de-la-luz-por-kwh',
    alt: 'Calculadora factura de la luz',
    draw: () =>
      k.frame('factura-luz', { blob: C.amberSoft, blob2: C.purpleXs }) +
      k.ground(400, 400, 580) +
      place(190, 230, k.bulb({})) +
      place(390, 240, meter({ label: '0342', unit: 'kWh' })) +
      place(600, 230, k.doc({ w: 170, h: 220, title: 'FACTURA LUZ', head: C.amberSoft, accent: C.amberDark, rows: [120, 90, 110, 80], total: '64,30 €' })) +
      place(500, 110, k.bolt({ s: 0.6 })),
  },
  {
    slug: 'jubilacion-espana',
    file: 'edad-de-jubilacion-en-espana-2026',
    alt: 'Cuándo me puedo jubilar',
    draw: () =>
      k.frame('jubilacion-espana', { blob2: C.tealSoft }) +
      k.ground(400, 400, 560) +
      place(200, 310, k.person({ shirt: C.teal, skin: 0, hair: 3, pose: 'wave' }) + rect(-27, -140, 54, 18, { rx: 9, fill: '#E5E7EB' })) +
      place(420, 230, k.hourglass({}), { s: 1.1 }) +
      place(610, 200, rect(-120, -80, 240, 160, { rx: 20, fill: C.white, stroke: C.purple, sw: 4 }) + text(0, -40, 'EDAD DE JUBILACIÓN', { size: 14, fill: C.slateMid }) + text(0, 16, '66 años', { size: 40, fill: C.purple }) + text(0, 52, 'y 10 meses', { size: 22, fill: C.slate })) +
      place(610, 330, k.pill({ w: 190, h: 38, label: '38 años cotizados', fill: C.green, size: 15 })) +
      place(80, 90, k.flag('ES', 70)),
  },
  {
    slug: 'impuesto-sucesiones',
    file: 'calcular-impuesto-de-sucesiones-por-comunidad',
    alt: 'Impuesto de sucesiones',
    draw: () =>
      k.frame('sucesiones-herencia', { blob2: C.amberSoft }) +
      k.ground(400, 400, 600) +
      place(190, 240, k.doc({ w: 170, h: 220, title: 'TESTAMENTO', rows: [120, 100, 130, 90], stamp: true })) +
      place(400, 290, k.scale({ tilt: 0 })) + place(300, 238, k.house({ w: 64, roof: C.amberDark, door: C.purple })) + place(505, 244, k.coinStack(3, { w: 50 })) +
      place(630, 260, [[0, 0], [70, 12]].map(([x, y], i) => place(x, y, k.person({ shirt: [C.pink, C.blue][i], skin: i + 1, hair: i, long: i === 0 }), { s: 0.62 })).join('')) +
      place(640, 110, k.bubble({ w: 150, h: 54, label: 'Por comunidad', size: 16, stroke: C.teal, tail: 'left' })),
  },
  {
    slug: 'cuanto-cuesta-reformar',
    file: 'precio-de-reforma-de-piso-por-metro-cuadrado',
    alt: 'Cuánto cuesta reformar un piso',
    draw: () =>
      k.frame('reforma-piso', { blob2: C.amberSoft }) +
      k.ground(400, 400, 600) +
      // Plano de un piso con metros cuadrados.
      place(270, 220, rect(-170, -130, 340, 260, { rx: 8, fill: C.white, stroke: C.slate, sw: 6 }) + `<path d="M-40,-130 V-10 H-170 M-40,40 V130 M60,-10 H170 M60,-10 V60" fill="none" stroke="${C.slate}" stroke-width="5"/>` + rect(-160, -120, 110, 100, { rx: 4, fill: C.blueSoft }) + rect(70, 0, 90, 120, { rx: 4, fill: C.amberSoft }) + text(-105, -64, 'Cocina', { size: 14, fill: C.blue }) + text(115, 64, 'Baño', { size: 14, fill: C.amberDark }) + text(10, 90, '80 m²', { size: 30, fill: C.purple })) +
      place(560, 150, roller(), { s: 0.8, r: -20 }) +
      place(640, 330, k.tag({ label: '550 €/m²', fill: C.teal, w: 170 })),
  },
  {
    slug: 'huella-de-carbono',
    file: 'calcular-mi-huella-de-carbono-personal',
    alt: 'Huella de carbono',
    draw: () =>
      k.frame('huella-carbono', { blob: C.greenSoft, blob2: C.blueSoft }) +
      k.ground(400, 400, 560) +
      place(400, 280, footprint({ fill: C.green }), { s: 1.3 }) +
      place(400, 250, text(0, 0, 'CO₂', { size: 36, fill: C.white })) +
      place(170, 200, k.car({ fill: C.slateMid, w: 150 })) + place(160, 110, `<path d="M-40,20 Q-60,20 -56,0 Q-60,-24 -30,-24 Q-20,-44 6,-40 Q30,-46 38,-20 Q64,-16 56,8 Q56,24 30,20 Z" fill="${C.slateSoft}"/>`) +
      place(640, 220, k.globe({ r: 70 })) + place(640, 350, k.pill({ w: 150, h: 38, label: '4,2 t/año', fill: C.teal, size: 17 })),
  },
  // ── Argentina ──
  {
    slug: 'dolar-blue',
    file: 'cotizacion-dolar-blue-a-pesos-argentinos',
    alt: 'Dólar blue hoy',
    draw: () =>
      k.frame('dolar-blue-ars', { blob: C.blueSoft, blob2: C.greenSoft }) +
      k.ground(400, 400, 580) +
      place(210, 230, k.billStack({ n: 3, label: 'US$' }), { s: 1.3 }) +
      k.arrow(310, 180, 460, 180, { color: C.blue, bend: 34 }) + k.arrow(460, 270, 310, 270, { color: C.slateSoft, bend: -34 }) +
      place(580, 230, [0, 1, 2].map((i) => place(i * 8, -i * 10, k.bill({ fill: '#E0F2FE', stroke: '#0284C7', label: '$' }), { r: -4 + i * 3 })).join(''), { s: 1.3 }) +
      place(400, 340, rect(-120, -30, 240, 60, { rx: 16, fill: C.white, stroke: C.blue, sw: 3 }) + text(-100, -6, 'Compra', { size: 13, fill: C.slateMid, anchor: 'start' }) + text(100, -6, 'Venta', { size: 13, fill: C.slateMid, anchor: 'end' }) + text(-100, 18, '$ ▲', { size: 18, fill: C.green, anchor: 'start' }) + text(100, 18, '$ ▲', { size: 18, fill: C.green, anchor: 'end' })) +
      place(700, 90, k.flag('AR', 76)),
  },
  {
    slug: 'monotributo',
    file: 'calcular-categoria-de-monotributo',
    alt: 'Categorías monotributo 2026',
    draw: () =>
      k.frame('monotributo-arca', { blob2: C.blueSoft }) +
      k.ground(400, 400, 600) +
      place(140, 330, stairs(11, { w: 34, step: 18, hi: 3, color: C.blueSoft, hiColor: C.blue, labels: 'ABCDEFGHIJK'.split('') })) +
      place(261, 180, k.person({ shirt: C.purple, skin: 1, hair: 0, pose: 'wave' }), { s: 0.55 }) +
      place(590, 160, k.bubble({ w: 180, h: 60, label: 'Categoría D', size: 22, stroke: C.blue, tail: 'left' })) +
      place(620, 290, k.doc({ w: 140, h: 120, title: 'Facturación', head: C.blueSoft, accent: C.blue, rows: [90, 70] })) +
      place(80, 80, k.flag('AR', 70)),
  },
  {
    slug: 'calculadora-inflacion',
    file: 'calcular-inflacion-acumulada',
    alt: 'Calculadora de inflación',
    draw: () =>
      k.frame('inflacion-acumulada', { blob: C.redSoft, blob2: C.amberSoft }) +
      k.ground(400, 400, 580) +
      // Carrito con precios que suben.
      place(210, 280, `<path d="M-90,-80 H-66 L-40,40 H70 L90,-50 H-58" fill="none" stroke="${C.slate}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>` + rect(-50, -70, 40, 50, { rx: 6, fill: C.amber }) + rect(-4, -84, 36, 64, { rx: 6, fill: C.green }) + circle(40, -44, 22, { fill: C.red }) + circle(-26, 62, 12, { fill: C.slate }) + circle(56, 62, 12, { fill: C.slate })) +
      place(480, 220, k.lineChart({ pts: [0.1, 0.18, 0.3, 0.45, 0.66, 0.9], w: 200, h: 150, color: C.red })) +
      place(640, 120, k.tag({ label: '+117%', fill: C.red, w: 150 })) +
      place(640, 330, k.pill({ w: 120, h: 40, label: 'IPC', fill: C.purple, size: 18 })),
  },
  {
    slug: 'preaviso-laboral',
    file: 'calcular-indemnizacion-sustitutiva-de-preaviso',
    alt: 'Preaviso laboral',
    draw: () =>
      k.frame('preaviso-laboral', { blob2: C.amberSoft }) +
      k.ground(400, 400, 580) +
      place(200, 220, k.envelope({ w: 190 }) + place(0, -50, rect(-70, -60, 140, 90, { rx: 6, fill: C.paper, stroke: C.slateSoft, sw: 2 }) + text(0, -30, 'PREAVISO', { size: 16, fill: C.red }) + k.lines(-50, -14, [100, 80], { gap: 16 }))) +
      place(430, 240, k.calendar({ w: 180, h: 170, month: '30 DÍAS', mark: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], markColor: C.amber, cols: 6, rows: 3 })) +
      place(630, 250, k.billStack({ n: 3 }), { s: 1.1 }) + place(630, 150, k.badge({ r: 34, label: '1–2', fill: C.purple, size: 20 })) +
      place(80, 80, k.flag('AR', 70)),
  },
  // ── Chile ──
  {
    slug: 'sueldo-liquido-chile',
    file: 'calcular-sueldo-liquido-en-chile',
    alt: 'Sueldo líquido Chile',
    draw: () =>
      k.frame('sueldo-liquido-cl', { blob2: C.redSoft }) +
      k.ground(400, 400, 600) +
      place(200, 230, k.doc({ w: 170, h: 220, title: 'LIQUIDACIÓN', rows: [120, 90, 110, 80], total: 'Bruto' })) +
      k.arrow(300, 230, 390, 230, { color: C.purple, bend: 26 }) +
      place(480, 230, k.pie({ r: 80, parts: [[0.8, C.green], [0.1, C.red], [0.07, C.blue], [0.03, C.amber]], hole: 40 }) + text(0, 8, '80%', { size: 22, fill: C.green })) +
      place(660, 180, [['AFP', C.red], ['Salud 7%', C.blue], ['Cesantía', C.amber]].map(([l, c], i) => place(0, i * 46, k.pill({ w: 130, h: 36, label: l, fill: c, size: 15, tc: i === 2 ? C.slate : C.white }))).join('')) +
      place(480, 360, k.pill({ w: 170, h: 40, label: 'Sueldo líquido', fill: C.green, size: 17 })) +
      place(80, 80, k.flag('CL', 70)),
  },
  {
    slug: 'finiquito-chile',
    file: 'calcular-finiquito-e-indemnizacion-chile',
    alt: 'Finiquito Chile',
    draw: () =>
      k.frame('finiquito-chile', { blob2: C.amberSoft }) +
      k.ground(400, 400, 580) +
      place(210, 300, k.person({ shirt: C.slate, skin: 1, hair: 2, pose: 'hold' })) + place(228, 300, rect(-40, -30, 80, 50, { rx: 6, fill: C.amber }) + k.lines(-28, -20, [30, 20], { fill: C.amberDark }) + circle(20, -40, 12, { fill: C.green })) +
      place(440, 220, k.doc({ w: 180, h: 230, title: 'FINIQUITO', rows: [130, 100, 120, 90], total: 'Años de servicio', stamp: true })) +
      place(640, 260, k.billStack({ n: 3 }), { s: 1.1 }) +
      place(700, 90, k.flag('CL', 70)),
  },
  {
    slug: 'uf-a-pesos',
    file: 'valor-uf-hoy-en-pesos-chilenos',
    alt: 'UF a pesos',
    draw: () =>
      k.frame('uf-pesos-chile', { blob2: C.blueSoft }) +
      k.ground(400, 400, 580) +
      place(200, 230, k.coin({ r: 80, label: 'UF', fill: C.purpleSoft, rim: C.purple, tc: C.purple })) +
      k.arrow(300, 230, 420, 230, { color: C.purple, bend: 30 }) +
      place(520, 230, k.coin({ r: 80, label: '$', fill: C.amber, rim: C.amberDark, tc: C.amberDark })) +
      place(690, 180, k.calendar({ w: 110, h: 110, month: 'HOY', mark: [7], markColor: C.purple, cols: 4, rows: 2 })) +
      place(360, 360, k.pill({ w: 240, h: 42, label: 'Reajuste diario por IPC', fill: C.teal, size: 16 })) +
      place(80, 80, k.flag('CL', 70)),
  },
  {
    slug: 'utm-a-pesos',
    file: 'valor-utm-en-pesos-chilenos',
    alt: 'UTM a pesos',
    draw: () =>
      k.frame('utm-pesos-chile', { blob: C.tealSoft, blob2: C.purpleXs }) +
      k.ground(400, 400, 600) +
      place(210, 230, rect(-120, -100, 240, 200, { rx: 20, fill: C.white, stroke: C.teal, sw: 4 }) + rect(-120, -100, 240, 56, { rx: 20, fill: C.teal }) + rect(-120, -60, 240, 16, { rx: 0, fill: C.teal }) + text(0, -64, 'UTM', { size: 30, fill: C.white }) + text(0, 10, '1 UTM =', { size: 20, fill: C.slateMid }) + text(0, 56, 'pesos CLP', { size: 28, fill: C.teal })) +
      place(500, 250, k.barChart({ vals: [0.5, 0.55, 0.6, 0.62, 0.68, 0.74], w: 220, h: 150, colors: [C.purpleSoft, C.purpleSoft, C.purpleSoft, C.purpleSoft, C.purpleSoft, C.teal] })) +
      place(500, 355, text(0, 0, 'Valor mensual', { size: 15, fill: C.slateMid })) +
      place(690, 140, k.doc({ w: 90, h: 110, title: 'SII', head: C.tealSoft, accent: C.teal, rows: [50, 40] })) +
      place(700, 320, k.flag('CL', 70)),
  },
  {
    slug: 'dividendo-hipotecario',
    file: 'simular-dividendo-credito-hipotecario-chile',
    alt: 'Dividendo hipotecario',
    draw: () =>
      k.frame('dividendo-hipotecario', { blob2: C.greenSoft }) +
      k.ground(400, 400, 600) +
      place(220, 300, k.house({ w: 200, roof: C.teal, door: C.amber })) +
      place(220, 110, k.pill({ w: 150, h: 40, label: '20 años · UF', fill: C.purple, size: 16 })) +
      place(470, 230, k.calendar({ w: 170, h: 160, month: 'DIVIDENDO', mark: [0, 5, 10], markColor: C.green, cols: 5, rows: 3 })) +
      place(660, 250, k.coinStack(5, { w: 80 })) + place(660, 140, k.badge({ r: 36, label: '4,5%', fill: C.green, size: 18 })) +
      place(80, 80, k.flag('CL', 70)),
  },
  {
    slug: 'gratificacion-chile',
    file: 'calcular-gratificacion-legal-chile',
    alt: 'Gratificación legal Chile',
    draw: () =>
      k.frame('gratificacion-chile', { blob: C.amberSoft, blob2: C.pinkSoft }) +
      k.ground(400, 400, 560) +
      place(260, 250, k.gift({ w: 170, box: C.red, lid: '#B91C1C', ribbon: C.amber })) +
      place(260, 130, k.billStack({ n: 2 }), { s: 0.8, r: -8 }) +
      place(500, 210, k.badge({ r: 70, label: '25%', fill: C.purple, size: 40 })) +
      place(520, 330, k.pill({ w: 230, h: 40, label: 'Tope 4,75 ingresos mín.', fill: C.teal, size: 15 })) +
      place(690, 170, k.flag('CL', 80)),
  },
  {
    slug: 'cotizacion-afp',
    file: 'cuanto-descuenta-la-afp-chile',
    alt: 'Cotización AFP',
    draw: () =>
      k.frame('cotizacion-afp', { blob2: C.tealSoft }) +
      k.ground(400, 400, 580) +
      place(210, 250, k.piggy({ fill: C.pink, s: 1.05 })) + place(200, 160, k.coin({ r: 28 })) +
      place(440, 230, k.pie({ r: 80, parts: [[0.1, C.purple], [0.015, C.amber], [0.885, C.purpleXs]] }) + text(0, 12, '10%', { size: 30, fill: C.purple })) +
      place(640, 200, [['Fondo A', 0.9], ['Fondo C', 0.6], ['Fondo E', 0.3]].map(([l, v], i) => text(-70, i * 48, l, { size: 14, fill: C.slateMid, anchor: 'start' }) + rect(-70, i * 48 + 8, 150, 12, { rx: 6, fill: C.purpleXs }) + rect(-70, i * 48 + 8, 150 * v, 12, { rx: 6, fill: C.teal })).join('')) +
      place(440, 350, k.pill({ w: 170, h: 38, label: '+ comisión AFP', fill: C.amberDark, size: 15 })) +
      place(700, 90, k.flag('CL', 70)),
  },
  {
    slug: 'puntaje-paes',
    file: 'calcular-puntaje-ponderado-paes',
    alt: 'Puntaje PAES',
    draw: () =>
      k.frame('puntaje-paes', { blob2: C.blueSoft }) +
      k.ground(400, 400, 600) +
      place(210, 220, rect(-130, -110, 260, 220, { rx: 20, fill: '#1E1B4B' }) + text(0, -64, 'PUNTAJE PONDERADO', { size: 14, fill: C.purpleSoft }) + text(0, 20, '812,4', { size: 64, fill: C.amber, family: 'Courier New, monospace' }) + text(0, 70, 'de 1.000', { size: 18, fill: C.purpleSoft })) +
      place(480, 250, k.barChart({ vals: [0.55, 0.85, 0.7, 0.4, 0.6], w: 200, h: 150, colors: [C.blue, C.purple, C.teal, C.amber, C.pink] })) +
      place(480, 355, text(0, 0, 'NEM · Ranking · M1 · Lectora', { size: 14, fill: C.slateMid })) +
      place(670, 150, k.gradCap({}), { s: 0.7 }) +
      place(700, 300, k.flag('CL', 70)),
  },
]
