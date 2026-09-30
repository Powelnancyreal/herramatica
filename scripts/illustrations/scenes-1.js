// Escenas: herramientas laborales y financieras (lote 1).
const k = require('./kit')
const { C, place, text, rect, circle } = k

module.exports = [
  {
    slug: 'calcular-prima-vacacional',
    file: 'como-calcular-la-prima-vacacional-2026',
    alt: 'Calcular prima vacacional',
    draw: () =>
      k.frame('prima-vacacional', { blob2: C.amberSoft }) +
      // Playa: sol, sombrilla y mar, con el recibo de la prima en primer plano.
      place(610, 110, k.circle(0, 0, 46, { fill: C.amber }) + [...Array(8)].map((_, i) => `<line x1="${Math.cos(i * 0.785) * 58}" y1="${Math.sin(i * 0.785) * 58}" x2="${Math.cos(i * 0.785) * 74}" y2="${Math.sin(i * 0.785) * 74}" stroke="${C.amber}" stroke-width="6" stroke-linecap="round"/>`).join('')) +
      `<path d="M0,330 Q200,300 400,330 T800,330 V450 H0 Z" fill="${C.blueSoft}"/><path d="M0,360 Q200,338 400,360 T800,360 V450 H0 Z" fill="#BFDBFE"/>` +
      place(560, 320, `<path d="M0,-150 V60" stroke="${C.slate}" stroke-width="7" stroke-linecap="round"/><path d="M-110,-110 Q0,-190 110,-110 Q55,-130 0,-110 Q-55,-130 -110,-110 Z" fill="${C.purple}"/><path d="M-55,-122 Q0,-190 0,-110 M55,-122 Q0,-190 0,-110" fill="none" stroke="${C.purpleDark}" stroke-width="4"/>`) +
      k.ground(270, 395, 260) +
      place(270, 235, k.doc({ w: 200, h: 250, title: 'PRIMA VACACIONAL', rows: [120, 90, 140, 100], total: '25%' })) +
      place(400, 330, k.coinStack(3, { w: 64 })) + place(170, 300, k.badge({ r: 34, label: '%', fill: C.amber, tc: C.slate })),
  },
  {
    slug: 'calcular-vacaciones',
    file: 'dias-de-vacaciones-por-antiguedad-mexico',
    alt: 'Calcular vacaciones',
    draw: () =>
      k.frame('vacaciones-antiguedad') +
      k.ground(250, 380, 280) +
      place(250, 225, k.calendar({ w: 250, h: 220, month: 'VACACIONES', cols: 6, rows: 4, mark: [7, 8, 9, 10, 13, 14, 15, 16], markColor: C.teal })) +
      // Escalera de años de antigüedad: más años, más días (LFT art. 76).
      place(560, 330, [12, 14, 16, 18, 20].map((d, i) => rect(i * 44 - 110, -i * 34 - 30, 40, 30 + i * 34, { rx: 6, fill: [C.purpleSoft, C.purple, C.purpleSoft, C.purple, C.purpleDark][i] }) + text(i * 44 - 90, -i * 34 - 38, String(d), { size: 17, fill: C.slate })).join('') + text(0, 34, 'días por año trabajado', { size: 16, fill: C.slateMid })) +
      place(705, 88, circle(0, 0, 40, { fill: C.amberSoft }) + circle(0, -6, 18, { fill: C.amber }) + `<path d='M-30,22 Q0,6 30,22' stroke='${C.blue}' stroke-width='5' fill='none' stroke-linecap='round'/>`),
  },
  {
    slug: 'calcular-ptu',
    file: 'calculo-reparto-de-utilidades-ptu-2026',
    alt: 'Calcular PTU',
    draw: () =>
      k.frame('ptu-utilidades', { blob2: C.greenSoft }) +
      k.ground(400, 395, 420) +
      // Pastel de utilidades: el 10% se reparte entre los trabajadores.
      place(250, 230, k.pie({ r: 110, parts: [[0.9, C.purpleSoft], [0.1, C.amber]] }) + text(78, -86, '10%', { size: 28, fill: C.amberDark })) +
      place(560, 290, k.person({ shirt: C.teal, pose: 'hold' }), { s: 0.9 }) + place(660, 300, k.person({ shirt: C.purple, skin: 1, hair: 1, long: true }), { s: 0.8 }) +
      k.arrow(360, 150, 520, 150, { color: C.amberDark, bend: 50 }) +
      place(470, 330, k.billStack({ n: 3 }), { s: 0.8 }),
  },
  {
    slug: 'calcular-salario-diario-integrado',
    file: 'como-calcular-salario-diario-integrado-imss',
    alt: 'Calcular salario diario integrado',
    draw: () =>
      k.frame('sdi-integrado', { blob2: C.tealSoft }) +
      k.ground(400, 390, 460) +
      // Suma de piezas: salario + aguinaldo + prima = SDI.
      place(150, 230, k.bill({ w: 130, h: 70, label: '$' })) + text(150, 300, 'Salario', { size: 17, fill: C.slateMid }) +
      text(245, 242, '+', { size: 44, fill: C.purple }) +
      place(330, 230, k.gift({ w: 90 })) + text(330, 300, 'Aguinaldo', { size: 17, fill: C.slateMid }) +
      text(420, 242, '+', { size: 44, fill: C.purple }) +
      place(500, 232, k.badge({ r: 44, label: '25%', fill: C.amber, tc: C.slate, size: 24 })) + text(500, 300, 'Prima', { size: 17, fill: C.slateMid }) +
      text(585, 242, '=', { size: 44, fill: C.purple }) +
      place(680, 228, rect(-62, -52, 124, 104, { rx: 16, fill: C.purple }) + text(0, -10, 'SDI', { size: 30, fill: C.white }) + text(0, 26, '× 1.0493', { size: 16, fill: C.purpleSoft })),
  },
  {
    slug: 'calculadora-cat',
    file: 'calcular-costo-anual-total-cat-credito',
    alt: 'Calculadora CAT',
    draw: () =>
      k.frame('cat-credito') +
      k.ground(400, 395, 460) +
      place(250, 230, k.card({ w: 220, fill: C.purple }), { r: -8 }) +
      place(300, 280, k.card({ w: 200, fill: C.blue }), { r: 6 }) +
      place(560, 220, k.gauge({ v: 0.72, r: 110, color: C.red })) + text(560, 280, 'CAT 38.5%', { size: 30, fill: C.slate }) + text(560, 310, 'sin IVA', { size: 16, fill: C.slateMid }) +
      place(680, 110, k.magnifier({ r: 30 }), { r: -10 }),
  },
  {
    slug: 'calculadora-nomina',
    file: 'calcular-sueldo-neto-nomina-mexico',
    alt: 'Calculadora de nómina',
    draw: () =>
      k.frame('nomina-neto', { blob2: C.greenSoft }) +
      k.ground(360, 395, 420) +
      place(240, 228, k.doc({ w: 210, h: 260, title: 'RECIBO DE NÓMINA', rows: [150, 110, 130, 90, 120], total: 'NETO', stamp: true })) +
      // Descuentos que salen del bruto hacia ISR e IMSS.
      place(470, 150, k.pill({ w: 130, label: '− ISR', fill: C.redSoft, tc: C.red })) + place(470, 205, k.pill({ w: 130, label: '− IMSS', fill: C.redSoft, tc: C.red })) +
      k.arrow(360, 170, 400, 150, { color: C.red, bend: 10, sw: 3 }) +
      place(610, 290, k.person({ shirt: C.green, pose: 'wave', skin: 2 }), { s: 0.95 }) + place(470, 320, k.billStack({ n: 2 }), { s: 0.8 }),
  },
  {
    slug: 'calcular-descuento',
    file: 'calcular-porcentaje-de-descuento-precio-final',
    alt: 'Calcular descuento',
    draw: () =>
      k.frame('descuento-rebaja', { blob: C.redSoft, blob2: C.amberSoft }) +
      k.ground(380, 390, 420) +
      // Bolsa de compras con etiqueta de rebaja y precio tachado.
      place(270, 250, `<path d="M-90,-80 H90 L100,110 H-100 Z" fill="${C.purple}"/><path d="M-40,-80 Q-40,-140 0,-140 Q40,-140 40,-80" fill="none" stroke="${C.purpleDark}" stroke-width="10"/>` + rect(-60, -30, 120, 60, { rx: 10, fill: C.white, o: 0.95 }) + text(0, 10, 'SALE', { size: 30, fill: C.purple })) +
      place(510, 180, k.tag({ label: '-20%', w: 170 }), { r: -12 }) +
      place(540, 300, text(0, 0, '$1,250', { size: 30, fill: C.slateMid }) + `<line x1="-56" y1="-10" x2="56" y2="-10" stroke="${C.red}" stroke-width="4"/>` + text(0, 44, '$1,000', { size: 40, fill: C.green })),
  },
  {
    slug: 'calculadora-ahorro',
    file: 'calculadora-meta-de-ahorro-mensual',
    alt: 'Calculadora de ahorro',
    draw: () =>
      k.frame('ahorro-meta', { blob2: C.pinkSoft }) +
      k.ground(330, 395, 340) +
      place(320, 280, k.piggy({ s: 1.2 })) +
      place(320, 120, k.coin({ r: 30 })) + k.arrow(320, 150, 320, 190, { color: C.amberDark, bend: 0, sw: 3 }) +
      // Meta con barra de progreso.
      place(600, 200, rect(-110, -80, 220, 160, { rx: 16, fill: C.white, stroke: C.purple, sw: 3 }) + place(-50, -48, circle(0, 0, 14, { fill: C.redSoft, stroke: C.red, sw: 3 }) + circle(0, 0, 5, { fill: C.red })) + text(10, -40, 'Meta', { size: 22, fill: C.slate }) + rect(-86, -10, 172, 22, { rx: 11, fill: C.purpleXs }) + rect(-86, -10, 120, 22, { rx: 11, fill: C.green }) + text(0, 50, '70% ahorrado', { size: 18, fill: C.green })),
  },
  {
    slug: 'calculadora-roi',
    file: 'calcular-retorno-de-inversion-roi',
    alt: 'Calculadora ROI',
    draw: () =>
      k.frame('roi-inversion', { blob2: C.greenSoft }) +
      k.ground(400, 400, 520) +
      place(330, 250, k.lineChart({ pts: [0.1, 0.2, 0.18, 0.4, 0.55, 0.85], w: 320, h: 200, color: C.green })) +
      place(170, 330, k.coinStack(4)) +
      place(610, 150, rect(-80, -44, 160, 88, { rx: 18, fill: C.green }) + text(0, -6, 'ROI', { size: 22, fill: C.greenSoft }) + text(0, 28, '+42%', { size: 32, fill: C.white })) +
      place(630, 300, k.bulb({}), { s: 0.8 }),
  },
  {
    slug: 'calculadora-nota-necesaria',
    file: 'que-nota-necesito-para-aprobar',
    alt: 'Calculadora de nota necesaria',
    draw: () =>
      k.frame('nota-necesaria', { blob2: C.amberSoft }) +
      k.ground(390, 395, 460) +
      place(250, 225, k.doc({ w: 190, h: 240, accent: C.blue, head: C.blueSoft, title: 'EXAMEN FINAL', rows: [120, 100, 130, 90] }) + place(40, 60, circle(0, 0, 38, { fill: C.white, stroke: C.red, sw: 4 }) + text(0, 14, '8.5', { size: 32, fill: C.red }))) +
      place(540, 250, k.gradCap({})) + place(430, 130, k.bubble({ w: 170, h: 60, label: '¿Cuánto necesito?', size: 16 })) +
      place(650, 330, k.pencil({ l: 150 }), { r: -30 }),
  },
  {
    slug: 'calculadora-dias-habiles',
    file: 'contar-dias-habiles-entre-dos-fechas',
    alt: 'Calculadora de días hábiles',
    draw: () =>
      k.frame('dias-habiles', { blob2: C.tealSoft }) +
      k.ground(400, 395, 500) +
      // Semana laboral: lunes a viernes activos, fin de semana y festivo apagados.
      place(400, 220, ['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => place(-270 + i * 90, 0, rect(-38, -54, 76, 108, { rx: 14, fill: i < 5 ? (i === 2 ? C.redSoft : C.white) : C.slateSoft, stroke: i < 5 ? (i === 2 ? C.red : C.purple) : C.slateMid, sw: 3 }) + text(0, -16, d, { size: 26, fill: i < 5 ? C.slate : C.slateMid }) + (i < 5 && i !== 2 ? place(0, 24, k.check({ r: 14 })) : i === 2 ? text(0, 30, 'festivo', { size: 13, fill: C.red }) : ''))).join('')) +
      place(400, 340, k.pill({ w: 220, h: 42, label: '4 días hábiles', fill: C.purple, size: 18 })),
  },
  {
    slug: 'calcular-fecha-futura',
    file: 'que-fecha-sera-dentro-de-x-dias',
    alt: 'Calcular fecha futura',
    draw: () =>
      k.frame('fecha-futura') +
      k.ground(400, 395, 480) +
      place(200, 230, k.calendar({ w: 180, h: 170, month: 'HOY', mark: [2], markColor: C.purple })) +
      k.arrow(310, 210, 490, 210, { color: C.amberDark, bend: 70, dash: '12 10' }) + place(400, 130, k.pill({ w: 130, label: '+ 90 días', fill: C.amber, tc: C.slate })) +
      place(600, 230, k.calendar({ w: 180, h: 170, month: 'FUTURO', head: C.teal, mark: [11], markColor: C.amber })) +
      place(400, 320, k.hourglass({}), { s: 0.6 }),
  },
]
