// Escenas: México laboral y finanzas personales (lote 2).
const k = require('./kit')
const { C, place, text, rect, circle } = k

module.exports = [
  {
    slug: 'calcular-subsidio-empleo',
    file: 'subsidio-al-empleo-2026-monto-mensual',
    alt: 'Calcular subsidio al empleo',
    draw: () =>
      k.frame('subsidio-empleo', { blob2: C.greenSoft }) +
      k.ground(400, 395, 480) +
      place(240, 230, k.doc({ w: 190, h: 240, title: 'ISR', rows: [120, 90, 130], total: '$193.37' })) +
      // Escudo del subsidio que reduce el impuesto.
      place(420, 200, k.shield({ fill: C.green, s: 1.1 })) + k.arrow(460, 150, 330, 140, { color: C.green, bend: 40 }) +
      place(600, 210, rect(-110, -64, 220, 128, { rx: 18, fill: C.white, stroke: C.green, sw: 4 }) + text(0, -18, 'Subsidio', { size: 18, fill: C.slateMid }) + text(0, 26, '−$535.65', { size: 32, fill: C.green })) +
      place(600, 330, k.flag('MX', 70)),
  },
  {
    slug: 'calcular-cuota-imss',
    file: 'cuotas-imss-patron-y-trabajador-2026',
    alt: 'Calcular cuota IMSS',
    draw: () =>
      k.frame('cuotas-imss', { blob2: C.tealSoft }) +
      k.ground(400, 400, 520) +
      // Patrón y trabajador aportando a las ramas de seguro.
      place(170, 310, k.person({ shirt: C.slate, pose: 'hold' }), { s: 0.95 }) + place(630, 310, k.person({ shirt: C.teal, skin: 1, hair: 1, pose: 'hold', long: true }), { s: 0.95 }) +
      place(400, 220, rect(-120, -110, 240, 220, { rx: 20, fill: C.white, stroke: C.green, sw: 4 }) + rect(-120, -110, 240, 40, { rx: 20, fill: C.green }) + rect(-120, -84, 240, 14, { rx: 0, fill: C.green }) + text(0, -82, 'IMSS', { size: 22, fill: C.white }) + [['Enfermedad', 0.8], ['Invalidez', 0.5], ['Retiro', 0.65], ['Guarderías', 0.35]].map(([n, v], i) => text(-100, -34 + i * 38, n, { size: 14, fill: C.slate, anchor: 'start' }) + rect(0, -46 + i * 38, 100, 14, { rx: 7, fill: C.greenSoft }) + rect(0, -46 + i * 38, 100 * v, 14, { rx: 7, fill: C.green })).join('')) +
      k.arrow(220, 170, 270, 150, { color: C.slateMid, bend: 20, sw: 3 }) + k.arrow(580, 170, 530, 150, { color: C.teal, bend: 20, sw: 3 }),
  },
  {
    slug: 'salarios-minimos-2026',
    file: 'tabla-salario-minimo-2026-mexico',
    alt: 'Salario mínimo 2026',
    draw: () =>
      k.frame('salario-minimo', { blob2: C.greenSoft }) +
      k.ground(400, 400, 520) +
      place(260, 250, k.barChart({ vals: [0.25, 0.35, 0.45, 0.6, 0.75, 0.92], w: 280, h: 200, colors: [C.purpleSoft, C.purpleSoft, C.purpleSoft, C.purpleSoft, C.purple, C.green] })) +
      text(376, 138, '2026', { size: 18, fill: C.green }) +
      place(580, 190, rect(-120, -70, 240, 140, { rx: 18, fill: C.white, stroke: C.purple, sw: 4 }) + text(0, -26, 'Salario mínimo diario', { size: 16, fill: C.slateMid }) + text(0, 22, '$315.04', { size: 40, fill: C.purple }) + text(0, 52, 'frontera $440.87', { size: 15, fill: C.slateMid })) +
      place(580, 330, k.flag('MX', 80)),
  },
  {
    slug: 'pension-imss-modalidad-40',
    file: 'simulador-pension-modalidad-40-ley-73',
    alt: 'Pensión IMSS modalidad 40',
    draw: () =>
      k.frame('modalidad-40', { blob: C.amberSoft }) +
      k.ground(380, 400, 480) +
      // Persona jubilada con bastón junto a la curva de pensión que sube.
      place(210, 310, k.person({ shirt: C.purple, hair: 3, skin: 0, pose: 'hold' }), { s: 1 }) + `<path d="M242,272 L262,388" stroke="${C.amberDark}" stroke-width="7" stroke-linecap="round"/>` +
      `<path d="M190,178 Q210,160 230,178" fill="none" stroke="${C.slateSoft}" stroke-width="6"/>` +
      place(490, 250, k.lineChart({ pts: [0.2, 0.22, 0.25, 0.5, 0.75, 0.95], w: 260, h: 180, color: C.purple })) +
      place(620, 110, k.pill({ w: 170, h: 44, label: 'Modalidad 40', fill: C.purple, size: 18 })) + place(650, 320, k.coinStack(4, { w: 60 })),
  },
  {
    slug: 'semanas-cotizadas-imss',
    file: 'calcular-semanas-cotizadas-imss',
    alt: 'Semanas cotizadas IMSS',
    draw: () =>
      k.frame('semanas-cotizadas') +
      k.ground(400, 400, 520) +
      // Línea de tiempo laboral con empleos y contador de semanas.
      place(400, 180, `<line x1="-300" y1="0" x2="300" y2="0" stroke="${C.slateSoft}" stroke-width="8" stroke-linecap="round"/>` + [[-280, -120, C.purple], [-100, 60, C.teal], [80, 280, C.blue]].map(([a, b, c]) => rect(a, -14, b - a, 28, { rx: 14, fill: c })).join('') + ['1998', '2008', '2026'].map((y, i) => text(-250 + i * 260, 50, y, { size: 16, fill: C.slateMid })).join('')) +
      place(260, 310, rect(-110, -50, 220, 100, { rx: 18, fill: C.purple }) + text(0, -8, 'Semanas', { size: 16, fill: C.purpleSoft }) + text(0, 30, '1,120', { size: 36, fill: C.white })) +
      place(540, 310, k.doc({ w: 120, h: 130, title: 'IMSS', rows: [70, 60, 80], stamp: true })),
  },
  {
    slug: 'calcular-horas-extras',
    file: 'pago-de-horas-extras-dobles-y-triples',
    alt: 'Calcular horas extras',
    draw: () =>
      k.frame('horas-extras', { blob: C.purpleXs, blob2: C.blueSoft }) +
      k.ground(400, 400, 520) +
      // Oficina de noche: luna, reloj pasado de hora y pago doble y triple.
      place(660, 90, circle(0, 0, 36, { fill: C.amberSoft }) + circle(16, -8, 30, { fill: C.purpleXs })) +
      place(240, 220, k.clock({ r: 90, h: 9, m: 40, stroke: C.purple })) +
      place(470, 170, k.pill({ w: 150, h: 48, label: 'Dobles ×2', fill: C.amber, tc: C.slate, size: 20 })) + place(490, 240, k.pill({ w: 150, h: 48, label: 'Triples ×3', fill: C.red, size: 20 })) +
      place(620, 320, k.billStack({ n: 3 }), { s: 0.9 }) + place(420, 330, k.calculator({ w: 90, h: 120, screen: '9 h' }), { r: -6 }),
  },
  {
    slug: 'comparador-afore',
    file: 'comparar-afore-rendimiento-neto',
    alt: 'Comparador de AFORE',
    draw: () =>
      k.frame('comparador-afore', { blob2: C.greenSoft }) +
      k.ground(400, 400, 540) +
      place(320, 240, [0.9, 0.7, 0.55].map((v, i) => place(-120 + i * 120, 0, rect(-40, 110 - v * 200, 80, v * 200, { rx: 10, fill: [C.green, C.purple, C.slateSoft][i] }) + text(0, 100 - v * 200, ['A', 'B', 'C'][i], { size: 22, fill: C.slate }) + place(0, 90 - v * 200 - 34, k.piggy({ fill: [C.green, C.purple, C.slateMid][i], s: 0.28 })))).join('')) +
      place(620, 190, k.trophy({}), { s: 0.8 }) + place(620, 320, k.pill({ w: 200, label: 'Mayor rendimiento', fill: C.green })),
  },
  {
    slug: 'calcular-isr-aguinaldo',
    file: 'calcular-isr-del-aguinaldo-2026',
    alt: 'ISR del aguinaldo',
    draw: () =>
      k.frame('isr-aguinaldo', { blob: C.redSoft, blob2: C.greenSoft }) +
      k.ground(400, 400, 520) +
      // Regalo de aguinaldo con árbol navideño y la parte exenta protegida.
      place(170, 260, `<path d="M0,-130 L70,0 H40 L90,80 H-90 L-40,0 H-70 Z" fill="${C.green}"/>` + rect(-12, 80, 24, 30, { rx: 4, fill: '#92400E' }) + k.sparkle(0, -136, 16, C.amber)) +
      place(370, 270, k.gift({ w: 150, box: C.red, lid: '#991B1B', ribbon: C.amber })) +
      place(600, 170, k.pill({ w: 200, h: 44, label: 'Exento 30 UMA', fill: C.green, size: 18 })) + place(600, 240, k.pill({ w: 200, h: 44, label: 'Gravado: ISR', fill: C.redSoft, tc: C.red, size: 18 })) +
      place(600, 330, k.calculator({ w: 90, h: 110, screen: '3,519' }), { r: 6 }),
  },
  {
    slug: 'dolar-a-peso-mexicano',
    file: 'tipo-de-cambio-dolar-a-peso-mexicano-hoy',
    alt: 'Dólar a peso mexicano',
    draw: () =>
      k.frame('dolar-peso', { blob2: C.greenSoft }) +
      k.ground(400, 400, 520) +
      place(200, 200, k.flag('US', 110)) + place(600, 200, k.flag('MX', 110)) +
      place(200, 310, k.bill({ w: 150, h: 76, fill: C.greenSoft, stroke: C.green, label: 'USD' })) + place(600, 310, k.bill({ w: 150, h: 76, fill: C.pinkSoft, stroke: C.pink, label: 'MXN' })) +
      k.arrow(290, 170, 510, 170, { color: C.purple, bend: 50 }) + k.arrow(510, 240, 290, 240, { color: C.teal, bend: -40 }) +
      place(400, 110, k.pill({ w: 170, h: 44, label: '1 USD = 18.50', fill: C.slate, size: 18 })) +
      place(400, 330, k.lineChart({ pts: [0.5, 0.4, 0.6, 0.45, 0.55, 0.5], w: 120, h: 50, color: C.purple, fillArea: false })),
  },
  {
    slug: 'tabla-de-amortizacion',
    file: 'generar-tabla-de-amortizacion-de-prestamo',
    alt: 'Tabla de amortización',
    draw: () =>
      k.frame('tabla-amortizacion') +
      k.ground(400, 400, 540) +
      place(300, 220, k.table({ cols: 4, rows: 6, w: 360, h: 260 })) +
      // Saldo que baja pago a pago.
      place(610, 200, k.barChart({ vals: [0.95, 0.78, 0.6, 0.42, 0.24, 0.08], w: 180, h: 150, colors: [C.purple, C.purple, C.purpleSoft, C.purpleSoft, C.purpleSoft, C.purpleSoft] })) +
      place(610, 320, k.pill({ w: 160, label: 'Saldo ↓', fill: C.teal })),
  },
  {
    slug: 'calculadora-cetes',
    file: 'calcular-rendimiento-de-cetes',
    alt: 'Calculadora CETES',
    draw: () =>
      k.frame('cetes-inversion', { blob2: C.greenSoft }) +
      k.ground(400, 400, 520) +
      // Planta que crece con monedas: inversión segura del gobierno.
      place(250, 330, `<path d="M-60,0 L-50,70 H50 L60,0 Z" fill="${C.amberDark}"/>` + rect(-66, -12, 132, 18, { rx: 6, fill: C.amber }) + `<path d="M0,-10 V-150" stroke="${C.green}" stroke-width="7"/>` + place(0, -160, k.coin({ r: 30 })) + place(-3, -70, k.leaf({ fill: C.green, s: 0.5, r: -58 })) + place(3, -105, k.leaf({ fill: C.teal, s: 0.5, r: 58 }))) +
      place(560, 180, rect(-130, -70, 260, 140, { rx: 18, fill: C.white, stroke: C.green, sw: 4 }) + text(0, -26, 'CETES 28 días', { size: 18, fill: C.slateMid }) + text(0, 22, '7.25%', { size: 42, fill: C.green }) + text(0, 52, 'anual', { size: 14, fill: C.slateMid })) +
      place(560, 320, k.shield({ fill: C.purple, s: 0.55 })),
  },
  {
    slug: 'simulador-credito-automotriz',
    file: 'calcular-mensualidad-credito-de-auto',
    alt: 'Simulador de crédito automotriz',
    draw: () =>
      k.frame('credito-auto', { blob2: C.blueSoft }) +
      k.ground(330, 350, 420) +
      place(320, 300, k.car({ fill: C.purple, w: 320 })) +
      place(320, 130, `<path d="M-30,20 V-20 Q-30,-40 -10,-40 H30" fill="none" stroke="${C.slate}" stroke-width="5"/>` + k.tag({ label: 'CRÉDITO', fill: C.amber, w: 150 })) +
      place(640, 230, k.calendar({ w: 150, h: 140, month: '48 MESES', head: C.teal, mark: [0, 1, 2, 3, 4, 5, 6] , markColor: C.teal})) +
      place(640, 350, k.pill({ w: 170, label: '$8,420/mes', fill: C.purple })),
  },
  {
    slug: 'calculadora-interes-simple',
    file: 'formula-de-interes-simple-calculadora',
    alt: 'Calculadora de interés simple',
    draw: () =>
      k.frame('interes-simple', { blob2: C.amberSoft }) +
      k.ground(400, 400, 520) +
      // Pizarra con la fórmula I = C · r · t.
      place(310, 210, rect(-200, -120, 400, 240, { rx: 14, fill: '#14532D' }) + rect(-200, -120, 400, 240, { rx: 14, fill: 'none', stroke: '#92400E', sw: 12 }) + text(0, -30, 'I = C · r · t', { size: 46, fill: C.white, family: 'Georgia, serif' }) + text(0, 30, '10,000 × 0.08 × 1.5', { size: 22, fill: C.greenSoft, family: 'Georgia, serif' }) + text(0, 70, '= $1,200', { size: 28, fill: C.amber, family: 'Georgia, serif' })) +
      place(620, 300, k.coinStack(3)) + place(640, 150, k.badge({ r: 36, label: '%', fill: C.purple })),
  },
  {
    slug: 'presupuesto-mensual',
    file: 'hacer-presupuesto-mensual-regla-50-30-20',
    alt: 'Presupuesto mensual',
    draw: () =>
      k.frame('presupuesto-50-30-20', { blob2: C.greenSoft }) +
      k.ground(400, 400, 520) +
      place(240, 220, k.pie({ r: 120, parts: [[0.5, C.purple], [0.3, C.amber], [0.2, C.green]], hole: 60 }) + text(0, 10, '50/30/20', { size: 20, fill: C.slate })) +
      place(560, 220, [['Necesidades', '50%', C.purple], ['Gustos', '30%', C.amber], ['Ahorro', '20%', C.green]].map(([n, p, c], i) => place(0, -80 + i * 80, rect(-130, -30, 260, 60, { rx: 14, fill: C.white, stroke: c, sw: 3 }) + circle(-100, 0, 14, { fill: c }) + text(-76, 7, n, { size: 18, fill: C.slate, anchor: 'start' }) + text(110, 7, p, { size: 20, fill: c, anchor: 'end' }))).join('')),
  },
  {
    slug: 'plan-pago-deudas',
    file: 'metodo-bola-de-nieve-y-avalancha-deudas',
    alt: 'Plan para pagar deudas',
    draw: () =>
      k.frame('pagar-deudas', { blob: C.blueSoft }) +
      k.ground(400, 400, 540) +
      // Bola de nieve rodando cuesta abajo que crece.
      `<path d="M60,160 Q300,200 470,360" fill="none" stroke="${C.slateSoft}" stroke-width="6" stroke-dasharray="12 12"/>` +
      place(120, 170, circle(0, 0, 22, { fill: C.white, stroke: C.blue, sw: 4 })) + place(270, 230, circle(0, 0, 38, { fill: C.white, stroke: C.blue, sw: 4 })) + place(440, 320, circle(0, 0, 60, { fill: C.white, stroke: C.blue, sw: 5 }) + k.check({ r: 26 })) +
      place(620, 190, [0, 1, 2].map((i) => place(0, i * 62, k.card({ w: 150, fill: [C.red, C.amber, C.purple][i] }), { r: -4 + i * 4, o: i === 0 ? 0.45 : 1 })).join('') + `<line x1="-80" y1="-30" x2="80" y2="30" stroke="${C.red}" stroke-width="7" stroke-linecap="round"/>`),
  },
  {
    slug: 'calculadora-comision-ventas',
    file: 'calcular-comision-por-ventas',
    alt: 'Calculadora de comisión por ventas',
    draw: () =>
      k.frame('comision-ventas', { blob2: C.amberSoft }) +
      k.ground(400, 400, 520) +
      place(220, 310, k.person({ shirt: C.blue, pose: 'wave', hair: 1, skin: 1 }), { s: 1 }) +
      place(420, 230, k.barChart({ vals: [0.3, 0.5, 0.7, 0.95], w: 180, h: 170, colors: [C.purpleSoft, C.purple, C.purple, C.green] })) + k.arrow(340, 160, 500, 110, { color: C.green, bend: 20 }) +
      place(640, 180, k.badge({ r: 56, label: '5%', fill: C.amber, tc: C.slate, size: 34 })) + place(640, 310, k.billStack({ n: 3 }), { s: 0.9 }),
  },
  {
    slug: 'comparador-precios',
    file: 'comparar-precio-por-kilo-en-el-super',
    alt: 'Comparador de precios por kilo',
    draw: () =>
      k.frame('comparar-precios', { blob2: C.greenSoft }) +
      k.ground(400, 400, 520) +
      // Dos paquetes en el súper: el grande conviene por kilo.
      place(220, 280, rect(-50, -80, 100, 160, { rx: 10, fill: C.amberSoft, stroke: C.amberDark, sw: 4 }) + text(0, -20, '500 g', { size: 20, fill: C.amberDark }) + text(0, 16, '$45', { size: 26, fill: C.slate })) +
      place(400, 270, rect(-74, -110, 148, 220, { rx: 12, fill: C.greenSoft, stroke: C.green, sw: 4 }) + text(0, -40, '1 kg', { size: 26, fill: C.green }) + text(0, 4, '$80', { size: 32, fill: C.slate }) + place(0, 60, k.check({ r: 26 }))) +
      place(620, 180, rect(-110, -60, 220, 120, { rx: 16, fill: C.white, stroke: C.purple, sw: 4 }) + text(0, -14, '$80 / kg', { size: 28, fill: C.green }) + text(0, 26, 'vs $90 / kg', { size: 20, fill: C.slateMid })) +
      place(630, 320, `<path d="M-60,-30 H60 L50,30 H-50 Z" fill="${C.white}" stroke="${C.slate}" stroke-width="5"/><path d="M-60,-30 L-74,-50" stroke="${C.slate}" stroke-width="5" stroke-linecap="round"/>` + circle(-36, 44, 9, { fill: C.slate }) + circle(36, 44, 9, { fill: C.slate })),
  },
]
