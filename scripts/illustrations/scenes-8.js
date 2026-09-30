// Escenas: Colombia, Perú, Ecuador, Uruguay y generales (lote 3).
const k = require('./kit')
const { C, place, text, rect, circle } = k

const MONO = 'Courier New, monospace'

// Piezas propias de este lote.
const umbrella = ({ fill = C.pink } = {}) => `<path d="M-100,0 A100,80 0 0,1 100,0 Q75,-14 50,0 Q25,-14 0,0 Q-25,-14 -50,0 Q-75,-14 -100,0 Z" fill="${fill}"/>` + `<path d="M-50,0 A50,80 0 0,1 0,-80 A50,80 0 0,1 50,0" fill="none" stroke="${C.white}" stroke-width="3" opacity="0.6"/>` + rect(-3, -84, 6, 190, { rx: 3, fill: C.slate })
const sun = ({ r = 34 } = {}) => [...Array(8)].map((_, i) => { const a = (i / 8) * Math.PI * 2; return `<line x1="${Math.cos(a) * (r + 8)}" y1="${Math.sin(a) * (r + 8)}" x2="${Math.cos(a) * (r + 20)}" y2="${Math.sin(a) * (r + 20)}" stroke="${C.amber}" stroke-width="5" stroke-linecap="round"/>` }).join('') + circle(0, 0, r, { fill: C.amber })
const vault = ({ fill = C.slate, label = '' } = {}) => rect(-90, -90, 180, 170, { rx: 18, fill }) + rect(-76, -76, 152, 142, { rx: 12, fill: C.slateMid }) + circle(0, -6, 42, { fill: C.slateSoft, stroke: C.white, sw: 4 }) + [0, 1, 2, 3].map((i) => `<line x1="0" y1="-6" x2="${Math.cos(i * Math.PI / 2 + 0.4) * 34}" y2="${-6 + Math.sin(i * Math.PI / 2 + 0.4) * 34}" stroke="${C.slate}" stroke-width="6" stroke-linecap="round"/>`).join('') + circle(0, -6, 10, { fill: C.slate }) + rect(-70, 80, 30, 14, { rx: 4, fill: fill }) + rect(40, 80, 30, 14, { rx: 4, fill: fill }) + (label ? text(0, 56, label, { size: 16, fill: C.white }) : '')
const building = ({ fill = C.slate, label = '' } = {}) => `<path d="M-90,-40 L0,-90 L90,-40 Z" fill="${fill}"/>` + [-64, -24, 16, 56].map((x) => rect(x - 4, -36, 16, 96, { rx: 3, fill: C.slateSoft })).join('') + rect(-96, 60, 192, 18, { rx: 4, fill }) + (label ? text(0, -52, label, { size: 15, fill: C.white }) : '')
const backpack = ({ fill = C.blue } = {}) => rect(-24, -96, 48, 30, { rx: 14, fill: 'none', stroke: C.slate, sw: 7 }) + rect(-60, -76, 120, 150, { rx: 30, fill }) + rect(-40, 10, 80, 50, { rx: 12, fill: C.white, o: 0.3 }) + rect(-60, -30, 120, 10, { rx: 0, fill: C.slate, o: 0.25 })
const xmasTree = () => rect(-12, 60, 24, 36, { rx: 4, fill: '#92400E' }) + `<path d="M0,-120 L60,-40 H30 L80,20 H40 L96,74 H-96 L-40,20 H-80 L-30,-40 H-60 Z" fill="${C.green}"/>` + [[-30, 0, C.red], [26, -20, C.amber], [0, 44, C.blue], [-50, 54, C.amber], [52, 50, C.red], [-10, -56, C.pink]].map(([x, y, c]) => circle(x, y, 8, { fill: c })).join('') + k.sparkle(0, -128, 18, C.amber)
const hat = () => `<ellipse cx="0" cy="40" rx="110" ry="22" fill="${C.slate}"/>` + `<path d="M-66,40 L-56,-60 Q0,-76 56,-60 L66,40 Z" fill="${C.slate}"/>` + rect(-60, 8, 120, 22, { rx: 0, fill: C.red })
const suitcase = ({ fill = C.purple } = {}) => rect(-22, -70, 44, 24, { rx: 10, fill: 'none', stroke: C.slate, sw: 7 }) + rect(-70, -50, 140, 110, { rx: 16, fill }) + rect(-30, -50, 12, 110, { rx: 0, fill: C.white, o: 0.35 }) + rect(18, -50, 12, 110, { rx: 0, fill: C.white, o: 0.35 })
const handles = (w, h) => [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, y]) => rect(x * w / 2 - 8, y * h / 2 - 8, 16, 16, { rx: 3, fill: C.white, stroke: C.purple, sw: 3 })).join('')

module.exports = [
  // ── Colombia ──
  {
    slug: 'prima-de-servicios',
    file: 'calcular-prima-de-servicios-colombia',
    alt: 'Prima de servicios',
    draw: () =>
      k.frame('prima-servicios-co', { blob: C.amberSoft, blob2: C.blueSoft }) +
      k.ground(400, 400, 580) +
      place(210, 230, k.envelope({ w: 190, stroke: C.amberDark }) + place(0, -60, k.billStack({ n: 2 }), { s: 0.9 })) +
      place(440, 230, rect(-90, -80, 180, 160, { rx: 16, fill: C.white, stroke: C.purple, sw: 4 }) + text(0, -40, 'Pagos', { size: 16, fill: C.slateMid }) + k.pill({ w: 140, h: 36, label: '30 de junio', fill: C.purple, size: 16 }) + place(0, 50, k.pill({ w: 140, h: 36, label: '20 de diciembre', fill: C.teal, size: 15 }))) +
      place(640, 240, k.badge({ r: 62, label: '15', fill: C.amber, tc: C.slate, size: 44 }) + text(0, 90, 'días por semestre', { size: 14, fill: C.slateMid })) +
      place(700, 80, k.flag('CO', 70)),
  },
  {
    slug: 'calcular-cesantias',
    file: 'como-calcular-cesantias-colombia',
    alt: 'Calcular cesantías',
    draw: () =>
      k.frame('cesantias-colombia', { blob2: C.greenSoft }) +
      k.ground(400, 400, 600) +
      place(220, 250, vault({ fill: C.purple, label: 'FONDO' })) +
      k.arrow(340, 170, 330, 230, { color: C.green, bend: -30 }) + place(390, 140, k.coin({ r: 30 })) +
      place(480, 250, k.calendar({ w: 170, h: 150, month: 'AÑO', mark: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], markColor: C.green, cols: 4, rows: 3 })) +
      place(660, 230, rect(-70, -40, 140, 80, { rx: 14, fill: C.white, stroke: C.green, sw: 3 }) + text(0, -8, '1 salario', { size: 18, fill: C.green }) + text(0, 20, 'por año', { size: 15, fill: C.slateMid })) +
      place(660, 340, k.pill({ w: 150, h: 36, label: 'antes del 14 feb', fill: C.slate, size: 14 })) +
      place(80, 80, k.flag('CO', 70)),
  },
  {
    slug: 'intereses-cesantias',
    file: 'calcular-intereses-sobre-cesantias',
    alt: 'Intereses a las cesantías',
    draw: () =>
      k.frame('intereses-cesantias', { blob: C.greenSoft, blob2: C.amberSoft }) +
      k.ground(400, 400, 560) +
      place(210, 300, k.coinStack(6, { w: 110 })) + place(210, 150, k.coin({ r: 44 })) +
      place(430, 220, k.badge({ r: 80, label: '12%', fill: C.green, size: 46 })) +
      place(430, 340, text(0, 0, 'anual sobre el saldo', { size: 16, fill: C.slateMid })) +
      place(640, 230, k.lineChart({ pts: [0.1, 0.25, 0.35, 0.55, 0.7, 0.9], w: 160, h: 130, color: C.green })) +
      place(640, 350, k.pill({ w: 140, h: 36, label: '31 de enero', fill: C.purple, size: 15 })) +
      place(700, 80, k.flag('CO', 70)),
  },
  {
    slug: 'retencion-en-la-fuente',
    file: 'calcular-retencion-en-la-fuente-salarios',
    alt: 'Retención en la fuente',
    draw: () =>
      k.frame('retencion-fuente', { blob2: C.redSoft }) +
      k.ground(400, 400, 600) +
      place(190, 230, k.doc({ w: 170, h: 220, title: 'SALARIO', rows: [120, 90, 110, 80], total: 'Neto' })) +
      // Parte del salario que se retiene y va a la DIAN.
      k.arrow(290, 180, 480, 180, { color: C.red, bend: 50, dash: '10 8' }) +
      place(380, 250, k.tag({ label: 'UVT', fill: C.amberDark, w: 110 })) +
      place(590, 250, building({ fill: C.slate, label: 'DIAN' })) +
      place(590, 360, k.pill({ w: 180, h: 38, label: 'Tabla art. 383', fill: C.purple, size: 15 })) +
      place(700, 80, k.flag('CO', 70)),
  },
  {
    slug: 'vacaciones-colombia',
    file: 'calcular-vacaciones-en-colombia',
    alt: 'Vacaciones Colombia',
    draw: () =>
      k.frame('vacaciones-colombia', { blob: C.tealSoft, blob2: C.amberSoft }) +
      `<path d="M0,370 Q200,340 400,366 T800,360 V450 H0 Z" fill="${C.amberSoft}"/>` +
      place(220, 290, umbrella({ fill: C.red })) + place(110, 110, sun({})) +
      place(470, 220, k.calendar({ w: 180, h: 170, month: '15 DÍAS HÁBILES', mark: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], markColor: C.teal, cols: 5, rows: 3 })) +
      place(660, 300, k.bill({ label: '$' }), { r: -8 }) +
      place(690, 90, k.flag('CO', 70)),
  },
  // ── Perú ──
  {
    slug: 'renta-quinta-categoria',
    file: 'calcular-impuesto-renta-quinta-categoria',
    alt: 'Renta de quinta categoría',
    draw: () =>
      k.frame('quinta-categoria', { blob2: C.redSoft }) +
      k.ground(400, 400, 600) +
      place(200, 230, rect(-110, -110, 220, 220, { rx: 20, fill: C.white, stroke: C.red, sw: 4 }) + text(0, -64, '5.ª', { size: 48, fill: C.red }) + text(0, -30, 'CATEGORÍA', { size: 16, fill: C.slateMid }) + k.lines(-80, 0, [160, 130, 150], { gap: 22 }) + text(0, 94, '− 7 UIT', { size: 20, fill: C.purple })) +
      place(470, 250, k.barChart({ vals: [0.2, 0.35, 0.5, 0.7, 0.9], w: 200, h: 150, colors: [C.redSoft, '#FCA5A5', '#F87171', C.red, '#991B1B'] })) +
      place(470, 356, text(0, 0, '8% · 14% · 17% · 20% · 30%', { size: 14, fill: C.slateMid })) +
      place(680, 180, k.calculator({ w: 100, h: 140, accent: C.red, screen: '12' })) +
      place(690, 330, k.flag('PE', 70)),
  },
  {
    slug: 'uit-a-soles',
    file: 'valor-uit-2026-en-soles',
    alt: 'UIT a soles',
    draw: () =>
      k.frame('uit-soles', { blob: C.redSoft, blob2: C.purpleXs }) +
      k.ground(400, 400, 560) +
      place(210, 230, rect(-110, -80, 220, 160, { rx: 24, fill: C.red }) + text(0, -20, 'UIT', { size: 50, fill: C.white }) + text(0, 30, '2026', { size: 28, fill: C.redSoft })) +
      k.arrow(340, 230, 440, 230, { color: C.slate, bend: 30 }) +
      place(540, 230, k.coin({ r: 80, label: 'S/', fill: C.amber })) +
      place(400, 360, k.pill({ w: 260, h: 42, label: 'multas · tributos · deducciones', fill: C.slate, size: 15 })) +
      place(700, 90, k.flag('PE', 70)),
  },
  {
    slug: 'vacaciones-peru',
    file: 'calcular-vacaciones-truncas-peru',
    alt: 'Vacaciones truncas Perú',
    draw: () =>
      k.frame('vacaciones-truncas', { blob: C.tealSoft }) +
      k.ground(400, 400, 580) +
      place(200, 280, suitcase({ fill: C.teal })) + place(300, 110, sun({ r: 26 })) +
      place(430, 230, k.pie({ r: 90, parts: [[7 / 12, C.purple], [5 / 12, C.purpleXs]], hole: 46 }) + text(0, 11, '7/12', { size: 28, fill: C.purple })) +
      place(430, 355, text(0, 0, 'meses trabajados', { size: 15, fill: C.slateMid })) +
      place(640, 220, k.doc({ w: 140, h: 170, title: 'LIQUIDACIÓN', rows: [90, 70, 80], total: 'Truncas' })) +
      place(80, 80, k.flag('PE', 70)),
  },
  {
    slug: 'afp-vs-onp',
    file: 'comparar-pension-afp-vs-onp',
    alt: 'AFP vs ONP',
    draw: () =>
      k.frame('afp-onp', { blob2: C.blueSoft }) +
      k.ground(400, 400, 600) +
      place(220, 250, k.piggy({ fill: C.purple, s: 0.9 }) + place(0, -110, k.pill({ w: 110, h: 40, label: 'AFP', fill: C.purple, size: 20 }))) +
      place(400, 220, circle(0, 0, 42, { fill: C.amber }) + text(0, 12, 'VS', { size: 32, fill: C.slate })) +
      place(580, 270, building({ fill: C.blue }) + place(0, -140, k.pill({ w: 110, h: 40, label: 'ONP', fill: C.blue, size: 20 }))) +
      place(220, 355, text(0, 0, 'cuenta individual', { size: 15, fill: C.slateMid })) + place(580, 370, text(0, 0, 'fondo común', { size: 15, fill: C.slateMid })) +
      place(700, 80, k.flag('PE', 70)),
  },
  // ── Ecuador ──
  {
    slug: 'decimo-tercer-sueldo',
    file: 'calcular-decimo-tercer-sueldo-ecuador',
    alt: 'Décimo tercer sueldo',
    draw: () =>
      k.frame('decimo-tercero', { blob: C.amberSoft, blob2: C.redSoft }) +
      k.ground(400, 400, 560) +
      place(220, 230, circle(0, 0, 110, { fill: C.purple }) + text(0, 32, '13.º', { size: 90, fill: C.white })) +
      place(460, 270, k.gift({ w: 130, box: C.red, lid: '#B91C1C', ribbon: C.amber })) +
      place(640, 220, k.calendar({ w: 150, h: 140, month: 'DICIEMBRE', mark: [11], markColor: C.red, cols: 5, rows: 3 })) +
      place(640, 340, k.pill({ w: 170, h: 36, label: 'hasta el 24 dic', fill: C.slate, size: 15 })) +
      place(80, 80, k.flag('EC', 70)),
  },
  {
    slug: 'decimo-cuarto-sueldo',
    file: 'calcular-decimo-cuarto-sueldo-ecuador',
    alt: 'Décimo cuarto sueldo',
    draw: () =>
      k.frame('decimo-cuarto', { blob: C.tealSoft, blob2: C.amberSoft }) +
      k.ground(400, 400, 560) +
      place(220, 230, circle(0, 0, 110, { fill: C.teal }) + text(0, 32, '14.º', { size: 90, fill: C.white })) +
      place(450, 290, backpack({ fill: C.blue })) +
      place(640, 190, [['Sierra · Amazonía', 'agosto', C.purple], ['Costa · Galápagos', 'marzo', C.amberDark]].map(([r, m, c], i) => place(0, i * 96, rect(-100, -36, 200, 72, { rx: 14, fill: C.white, stroke: c, sw: 3 }) + text(0, -8, r, { size: 14, fill: C.slateMid }) + text(0, 20, m, { size: 20, fill: c }))).join('')) +
      place(80, 80, k.flag('EC', 70)),
  },
  {
    slug: 'fondos-de-reserva',
    file: 'calcular-fondos-de-reserva-iess',
    alt: 'Fondos de reserva',
    draw: () =>
      k.frame('fondos-reserva', { blob2: C.greenSoft }) +
      k.ground(400, 400, 580) +
      place(220, 240, k.shield({ fill: C.green, s: 1.7 })) +
      place(440, 220, k.badge({ r: 74, label: '8,33%', fill: C.purple, size: 30 })) +
      place(440, 330, text(0, 0, 'del sueldo mensual', { size: 16, fill: C.slateMid })) +
      place(640, 290, k.coinStack(5, { w: 90 })) + place(640, 160, k.pill({ w: 150, h: 38, label: 'desde el 2.º año', fill: C.teal, size: 15 })) +
      place(80, 80, k.flag('EC', 70)),
  },
  {
    slug: 'impuesto-renta-ecuador',
    file: 'calcular-impuesto-a-la-renta-ecuador',
    alt: 'Impuesto a la renta Ecuador',
    draw: () =>
      k.frame('renta-ecuador', { blob2: C.amberSoft }) +
      k.ground(400, 400, 600) +
      place(220, 230, k.table({ cols: 3, rows: 5, w: 250, h: 220, head: C.blue, stroke: C.blue })) +
      place(290, 290, k.magnifier({ r: 42 })) +
      place(520, 220, k.doc({ w: 160, h: 210, title: 'DECLARACIÓN', head: C.blueSoft, accent: C.blue, rows: [110, 80, 100, 70], total: 'SRI', stamp: true })) +
      place(680, 250, k.coin({ r: 44, label: '$' })) +
      place(690, 90, k.flag('EC', 70)),
  },
  // ── Uruguay ──
  {
    slug: 'aguinaldo-uruguay',
    file: 'calcular-aguinaldo-en-uruguay',
    alt: 'Aguinaldo Uruguay',
    draw: () =>
      k.frame('aguinaldo-uruguay', { blob: C.blueSoft, blob2: C.amberSoft }) +
      k.ground(400, 400, 580) +
      place(220, 260, k.gift({ w: 170, box: C.blue, lid: '#1D4ED8', ribbon: C.amber })) +
      place(480, 170, k.pill({ w: 190, h: 44, label: '1.ª cuota · junio', fill: C.purple, size: 17 })) + place(480, 250, k.pill({ w: 190, h: 44, label: '2.ª cuota · diciembre', fill: C.teal, size: 16 })) +
      place(480, 330, text(0, 0, '1/12 de lo ganado', { size: 18, fill: C.slate })) +
      place(670, 250, k.billStack({ n: 3 })) +
      place(690, 90, k.flag('UY', 72)),
  },
  {
    slug: 'irpf-uruguay',
    file: 'calcular-irpf-uruguay-sueldo',
    alt: 'IRPF Uruguay',
    draw: () =>
      k.frame('irpf-uruguay', { blob2: C.purpleXs }) +
      k.ground(400, 400, 600) +
      place(190, 230, k.doc({ w: 170, h: 220, title: 'RECIBO', head: C.blueSoft, accent: C.blue, rows: [120, 90, 110, 80], total: 'IRPF' })) +
      place(360, 330, [0, 10, 15, 24, 25, 27, 31, 36].map((p, i) => rect(i * 42, -(i + 1) * 24, 34, (i + 1) * 24, { rx: 6, fill: i === 3 ? C.blue : C.blueSoft }) + text(i * 42 + 17, 20, `${p}%`, { size: 12, fill: i === 3 ? C.blue : C.slateMid })).join('')) +
      place(560, 110, k.bubble({ w: 180, h: 56, label: 'Franjas en BPC', size: 18, stroke: C.blue, tail: 'left' })) +
      place(80, 80, k.flag('UY', 72)),
  },
  // ── Generales ──
  {
    slug: 'amigo-invisible',
    file: 'sorteo-amigo-invisible-online',
    alt: 'Amigo invisible',
    draw: () =>
      k.frame('amigo-invisible', { blob: C.redSoft, blob2: C.greenSoft }) +
      k.ground(400, 400, 600) +
      place(400, 250, hat()) + [[-40, -20], [0, -34], [40, -18]].map(([x, y], i) => place(400 + x, 250 + y - 40, rect(-18, -26, 36, 40, { rx: 4, fill: C.white, stroke: C.slateSoft, sw: 2 }) + text(0, 2, '?', { size: 22, fill: [C.red, C.green, C.purple][i] }), { r: x / 3 })).join('') +
      [[150, C.red, 0], [650, C.green, 1]].map(([x, c, i]) => place(x, 300, k.person({ shirt: c, skin: i + 1, hair: i + 2, long: i === 1 })) + place(x, 104, k.bubble({ w: 60, h: 52, label: '?', size: 32, stroke: c, tail: i ? 'left' : 'right' }))).join('') +
      place(250, 350, k.gift({ w: 60, box: C.purple, lid: C.purpleDark })) + place(560, 350, k.gift({ w: 60, box: C.amberDark, lid: '#B45309', ribbon: C.red })),
  },
  {
    slug: 'dias-para-navidad',
    file: 'cuantos-dias-faltan-para-navidad',
    alt: 'Días para Navidad',
    draw: () =>
      k.frame('dias-navidad', { blob: C.greenSoft, blob2: C.redSoft }) +
      k.ground(400, 400, 560) +
      place(220, 280, xmasTree()) +
      place(450, 220, rect(-110, -100, 220, 200, { rx: 22, fill: C.white, stroke: C.red, sw: 5 }) + rect(-110, -100, 220, 50, { rx: 22, fill: C.red }) + rect(-110, -64, 220, 14, { rx: 0, fill: C.red }) + text(0, -64, 'DICIEMBRE', { size: 20, fill: C.white }) + text(0, 50, '25', { size: 96, fill: C.red })) +
      place(650, 240, k.hourglass({ fill: C.red }), { s: 0.9 }) +
      place(650, 370, k.pill({ w: 150, h: 36, label: 'cuenta regresiva', fill: C.green, size: 15 })) +
      place(640, 80, k.gift({ w: 50 })),
  },
  {
    slug: 'presupuesto-boda',
    file: 'cuanto-cuesta-una-boda-presupuesto',
    alt: 'Presupuesto de boda',
    draw: () =>
      k.frame('presupuesto-boda', { blob: C.pinkSoft, blob2: C.amberSoft }) +
      k.ground(400, 400, 600) +
      place(170, 270, k.ring({ r: 50, gem: C.blueSoft })) + place(250, 290, k.ring({ r: 40, gem: C.pink }), { s: 0.8 }) +
      place(400, 270, k.cake() + place(0, -90, rect(-50, -20, 100, 40, { rx: 8, fill: C.pinkSoft, stroke: C.pink, sw: 3 }) + circle(0, -34, 12, { fill: C.pink }))) +
      place(630, 220, rect(-110, -120, 220, 240, { rx: 18, fill: C.white, stroke: C.purple, sw: 4 }) + [['Salón', '40%'], ['Banquete', '30%'], ['Vestido', '10%'], ['Música', '8%'], ['Flores', '5%']].map(([l, p], i) => text(-88, -76 + i * 38, l, { size: 16, fill: C.slate, anchor: 'start' }) + text(88, -76 + i * 38, p, { size: 16, fill: C.purple, anchor: 'end' })).join('') + rect(-88, 102, 176, 4, { rx: 2, fill: C.purpleSoft })),
  },
  {
    slug: 'comprimir-imagen',
    file: 'comprimir-imagen-sin-perder-calidad',
    alt: 'Comprimir imagen',
    draw: () =>
      k.frame('comprimir-imagen', { blob2: C.greenSoft }) +
      k.ground(400, 400, 600) +
      place(200, 220, k.imageIcon({ w: 230, h: 170 })) + place(200, 350, k.pill({ w: 110, h: 38, label: '4,8 MB', fill: C.red, size: 17 })) +
      // Prensa que aprieta el archivo.
      place(400, 220, `<path d="M-30,-60 L0,-30 L30,-60 M-30,60 L0,30 L30,60" fill="none" stroke="${C.purple}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`) +
      place(590, 220, k.imageIcon({ w: 150, h: 110 })) + place(590, 350, k.pill({ w: 110, h: 38, label: '620 KB', fill: C.green, size: 17 })) +
      place(690, 120, k.check({ r: 26 })),
  },
  {
    slug: 'redimensionar-imagen',
    file: 'cambiar-tamano-de-imagen-para-redes-sociales',
    alt: 'Redimensionar imagen',
    draw: () =>
      k.frame('redimensionar-imagen', { blob2: C.pinkSoft }) +
      k.ground(400, 400, 600) +
      place(260, 220, k.imageIcon({ w: 280, h: 200 }) + `<rect x="-140" y="-100" width="280" height="200" fill="none" stroke="${C.purple}" stroke-width="3" stroke-dasharray="10 8"/>` + handles(280, 200)) +
      
      [['1:1', 70, 70, C.pink], ['9:16', 56, 100, C.purple], ['16:9', 110, 62, C.blue]].map(([l, w, h, c], i) => place([505, 595, 700][i], 220, rect(-w / 2, -h / 2, w, h, { rx: 8, fill: C.white, stroke: c, sw: 4 }) + text(0, 6, l, { size: 16, fill: c }))).join('') +
      place(610, 340, k.pill({ w: 230, h: 40, label: '1080 × 1080 px', fill: C.slate, size: 17 })),
  },
  {
    slug: 'generador-favicon',
    file: 'crear-favicon-ico-para-sitio-web',
    alt: 'Generador de favicon',
    draw: () =>
      k.frame('generador-favicon', { blob2: C.amberSoft }) +
      k.ground(400, 400, 600) +
      // Icono en cuadrícula de píxeles.
      place(220, 230, (() => {
        const px = ['.######.', '.######.', '.##.....', '.#####..', '.#####..', '.##.....', '.##.....', '.##.....']
        let o = rect(-104, -104, 208, 208, { rx: 16, fill: C.white, stroke: C.slateSoft, sw: 3 })
        px.forEach((row, y) => [...row].forEach((ch, x) => { o += rect(-96 + x * 24, -96 + y * 24, 22, 22, { rx: 3, fill: ch === '#' ? C.purple : C.purpleXs }) }))
        return o
      })()) +
      // Pestaña del navegador con el favicon.
      place(530, 150, `<path d="M-140,30 V-10 Q-140,-30 -120,-30 H80 Q100,-30 106,-10 L118,30 Z" fill="${C.white}" stroke="${C.purple}" stroke-width="3"/>` + rect(-124, -14, 26, 26, { rx: 6, fill: C.purple }) + text(-111, 6, 'F', { size: 18, fill: C.white }) + k.lines(-86, -4, [120], {}) + text(92, 6, '×', { size: 18, fill: C.slateMid })) +
      place(530, 290, [16, 32, 48].map((s, i) => place((i - 1) * 90, 0, rect(-s / 2 - 4, -s / 2 - 4, s + 8, s + 8, { rx: 6, fill: C.purple }) + text(0, s / 2 + 28, `${s}px`, { size: 14, fill: C.slateMid }))).join('')) +
      place(690, 370, k.pill({ w: 100, h: 34, label: '.ico', fill: C.amberDark, size: 16 })),
  },
  {
    slug: 'generador-excusas',
    file: 'excusas-creibles-y-graciosas',
    alt: 'Generador de excusas',
    draw: () =>
      k.frame('generador-excusas', { blob: C.amberSoft, blob2: C.pinkSoft }) +
      k.ground(400, 400, 560) +
      place(250, 300, k.person({ shirt: C.amberDark, skin: 2, hair: 1, pose: 'wave' })) + place(250, 300, `<path d="M40,-58 Q70,-90 60,-120" stroke="${C.skin[2]}" stroke-width="13" stroke-linecap="round" fill="none"/>`) +
      place(500, 130, k.bubble({ w: 300, h: 70, label: 'Se me cayó el internet', size: 20, stroke: C.purple, tail: 'left' })) +
      place(500, 250, k.bubble({ w: 280, h: 64, label: 'Mi perro se comió la tarea', size: 18, stroke: C.pink, tail: 'left' }), { o: 0.8 }) +
      place(670, 350, k.clock({ r: 44, h: 9, m: 45, stroke: C.red })) + place(110, 110, text(0, 0, '?!', { size: 50, fill: C.purple })),
  },
  {
    slug: 'tallas-de-anillo',
    file: 'tabla-de-tallas-de-anillo',
    alt: 'Tallas de anillo',
    draw: () =>
      k.frame('tallas-anillo', { blob: C.amberSoft, blob2: C.purpleXs }) +
      k.ground(400, 400, 580) +
      place(200, 250, k.ring({ r: 64, gem: C.purple })) +
      place(400, 370, k.ruler({ w: 520 })) +
      place(510, 210, [[30, '5', '15,7'], [34, '7', '17,3'], [38, '9', '18,9'], [42, '11', '20,6']].map(([r, n, mm], i) => place(i * 86 - 110, 0, circle(0, 0, r, { fill: 'none', stroke: [C.teal, C.blue, C.purple, C.pink][i], sw: 7 }) + text(0, 7, n, { size: 20, fill: C.slate }) + text(0, r + 26, `${mm} mm`, { size: 12, fill: C.slateMid }))).join('')) +
      place(510, 100, k.pill({ w: 200, h: 38, label: 'MX · US · EU', fill: C.slate, size: 16 })),
  },
]
