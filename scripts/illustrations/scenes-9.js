// Escenas: herramientas del lote de octubre de 2026.
const k = require('./kit')
const { C, place, text, rect, circle } = k

const MONO = 'Courier New, monospace'
const boxCaja = () => rect(-60, -40, 120, 80, { rx: 6, fill: C.amber }) + rect(-60, -40, 120, 20, { rx: 6, fill: C.amberDark }) + k.lines(-40, -6, [80, 60], { fill: C.amberDark })

module.exports = [
  {
    slug: 'calculadora-finiquito-mexico',
    file: 'calcular-finiquito-por-renuncia-o-despido-mexico',
    alt: 'Calculadora de finiquito México',
    draw: () =>
      k.frame('finiquito-mexico', { blob2: C.greenSoft }) +
      k.ground(400, 400, 600) +
      place(170, 300, k.person({ shirt: C.green, skin: 1, hair: 0, pose: 'hold' })) + place(222, 300, boxCaja(), { s: 0.7, r: 4 }) +
      place(420, 225, k.doc({ w: 190, h: 240, title: 'FINIQUITO', rows: [140, 110, 130, 100], total: 'Total bruto'  })) +
      place(640, 170, [['Aguinaldo', C.purple], ['Vacaciones', C.teal], ['Prima 25%', C.amberDark]].map(([l, c], i) => place(0, i * 48, k.pill({ w: 150, h: 38, label: l, fill: c, size: 15 }))).join('')) +
      place(640, 330, k.billStack({ n: 2 }), { s: 0.9 }) +
      place(80, 80, k.flag('MX', 70)),
  },
  {
    slug: 'convertidor-libras-a-newtons',
    file: 'convertir-libras-fuerza-a-newtons',
    alt: 'Libras a newtons',
    draw: () =>
      k.frame('libras-newtons', { blob2: C.tealSoft }) +
      k.ground(400, 400, 560) +
      // Pesa colgando de un dinamómetro.
      place(230, 90, rect(-40, -20, 80, 20, { rx: 6, fill: C.slate })) + place(230, 100, `<line x1="0" y1="0" x2="0" y2="30" stroke="${C.slate}" stroke-width="5"/>`) +
      place(230, 190, rect(-30, -60, 60, 130, { rx: 14, fill: C.white, stroke: C.purple, sw: 4 }) + [...Array(6)].map((_, i) => rect(-14, -44 + i * 18, 28, 3, { rx: 1.5, fill: C.slateSoft })).join('') + rect(-22, 10, 44, 6, { rx: 3, fill: C.red })) +
      place(230, 270, `<line x1="0" y1="-10" x2="0" y2="20" stroke="${C.slate}" stroke-width="5"/>` + `<path d="M-50,20 H50 L64,100 H-64 Z" fill="${C.slate}"/>` + text(0, 72, '10 lb', { size: 24, fill: C.white })) +
      k.arrow(330, 230, 450, 230, { color: C.purple, bend: 30 }) +
      place(590, 200, rect(-130, -70, 260, 140, { rx: 20, fill: '#1E1B4B' }) + text(0, 0, '44.48', { size: 54, fill: C.greenSoft, family: MONO }) + text(0, 44, 'newtons', { size: 20, fill: C.purpleSoft })) +
      place(590, 330, k.pill({ w: 190, h: 40, label: '1 lbf = 4.448 N', fill: C.teal, size: 17 })),
  },
  {
    slug: 'calculadora-4x1000',
    file: 'calcular-gravamen-4x1000-colombia',
    alt: 'Calculadora 4x1000',
    draw: () =>
      k.frame('gmf-4x1000', { blob: C.amberSoft, blob2: C.blueSoft }) +
      k.ground(400, 400, 600) +
      place(200, 240, k.phone({ w: 150, h: 260, content: rect(-60, -100, 120, 44, { rx: 8, fill: C.blue }) + text(0, -72, 'Transferir', { size: 15, fill: C.white }) + text(0, -16, '$2.000.000', { size: 20, fill: C.slate }) + rect(-60, 10, 120, 2, { rx: 1, fill: C.slateSoft }) + text(-56, 40, 'GMF', { size: 14, fill: C.slateMid, anchor: 'start' }) + text(56, 40, '$8.000', { size: 14, fill: C.red, anchor: 'end' }) })) +
      place(430, 210, circle(0, 0, 90, { fill: C.amber }) + text(0, -6, '4 × 1000', { size: 32, fill: C.slate }) + text(0, 28, '0,4%', { size: 22, fill: C.amberDark })) +
      place(640, 250, k.shield({ fill: C.green, s: 1.1 }) + place(0, 100, k.pill({ w: 170, h: 36, label: 'Exenta: 350 UVT', fill: C.green, size: 15 }))) +
      place(700, 80, k.flag('CO', 70)),
  },
  {
    slug: 'calculadora-upao',
    file: 'calcular-promedio-notas-upao',
    alt: 'Calculadora UPAO',
    draw: () =>
      k.frame('calculadora-upao', { blob2: C.blueSoft }) +
      k.ground(400, 400, 600) +
      place(220, 230, rect(-140, -120, 280, 240, { rx: 18, fill: C.white, stroke: C.blue, sw: 4 }) + rect(-140, -120, 280, 44, { rx: 18, fill: C.blue }) + rect(-140, -90, 280, 14, { rx: 0, fill: C.blue }) + text(0, -90, 'REGISTRO DE NOTAS', { size: 15, fill: C.white }) +
        [['EP1', '20%', '12'], ['EVP', '30%', '09'], ['EP2', '20%', '13'], ['EVF', '30%', '10']].map(([e, p, n], i) => text(-116, -44 + i * 40, e, { size: 18, fill: C.slate, anchor: 'start' }) + text(0, -44 + i * 40, p, { size: 16, fill: C.slateMid }) + text(110, -44 + i * 40, n, { size: 20, fill: C.blue, anchor: 'end', family: MONO })).join('')) +
      k.arrow(380, 230, 460, 230, { color: C.purple, bend: 26 }) +
      place(570, 210, circle(0, 0, 84, { fill: C.green }) + text(0, 16, '11', { size: 64, fill: C.white }) + text(0, 50, 'APROBADO', { size: 13, fill: C.greenSoft })) +
      place(570, 340, k.pill({ w: 200, h: 38, label: '10.7 → 11 (redondeo)', fill: C.slate, size: 15 })) +
      place(700, 80, k.flag('PE', 70)),
  },
  {
    slug: 'calculadora-de-notas',
    file: 'calcular-nota-definitiva-por-cortes-colombia',
    alt: 'Calculadora de notas',
    draw: () =>
      k.frame('notas-colombia', { blob: C.amberSoft, blob2: C.purpleXs }) +
      k.ground(400, 400, 600) +
      place(230, 250, [['1.er corte', '30%', 3.5, C.blue], ['2.º corte', '30%', 2.8, C.teal], ['3.er corte', '40%', 3.2, C.purple]].map(([l, p, n, c], i) => place(i * 90 - 90, 0, rect(-34, -n * 34, 68, n * 34, { rx: 10, fill: c }) + text(0, -n * 34 - 12, String(n).replace('.', ','), { size: 20, fill: c }) + text(0, 26, l, { size: 13, fill: C.slateMid }) + text(0, 46, p, { size: 14, fill: C.slate }))).join('') + `<line x1="-140" y1="${-3 * 34}" x2="140" y2="${-3 * 34}" stroke="${C.red}" stroke-width="3" stroke-dasharray="8 6"/>` + text(-150, -3 * 34 + 5, '3,0', { size: 15, fill: C.red, anchor: 'end' })) +
      place(560, 200, rect(-110, -80, 220, 160, { rx: 20, fill: C.white, stroke: C.purple, sw: 4 }) + text(0, -40, 'DEFINITIVA', { size: 15, fill: C.slateMid }) + text(0, 26, '3,2', { size: 64, fill: C.purple }) + text(0, 62, 'de 5,0', { size: 16, fill: C.slateMid })) +
      place(560, 340, k.check({ r: 24 })) +
      place(700, 80, k.flag('CO', 70)),
  },
  {
    slug: 'calculadora-empleados-de-comercio',
    file: 'sueldo-empleados-de-comercio-escala-cct-130-75',
    alt: 'Calculadora empleados de comercio',
    draw: () =>
      k.frame('empleados-comercio', { blob2: C.blueSoft }) +
      k.ground(400, 400, 600) +
      // Mostrador de tienda con cajero.
      place(220, 270, rect(-140, -10, 280, 110, { rx: 10, fill: C.purple }) + rect(-140, -10, 280, 18, { rx: 6, fill: C.purpleDark }) + place(70, -50, rect(-40, -30, 80, 50, { rx: 8, fill: C.slate }) + rect(-30, -22, 60, 22, { rx: 4, fill: C.greenSoft }) + text(0, -6, '$', { size: 16, fill: C.green }))) +
      place(150, 255, k.person({ shirt: C.blue, skin: 3, hair: 1 }), { s: 0.8 }) +
      place(560, 210, k.doc({ w: 200, h: 240, title: 'RECIBO DE SUELDO', head: C.blueSoft, accent: C.blue, rows: [150, 120, 140, 110, 90], total: 'Neto' })) +
      place(420, 120, k.pill({ w: 120, h: 34, label: 'CCT 130/75', fill: C.slate, size: 14 })) +
      place(80, 80, k.flag('AR', 70)),
  },
  {
    slug: 'calculadora-registral',
    file: 'calcular-derechos-registrales-sunarp',
    alt: 'Calculadora registral SUNARP',
    draw: () =>
      k.frame('registral-sunarp', { blob2: C.redSoft }) +
      k.ground(400, 400, 600) +
      place(210, 300, k.house({ w: 180, roof: C.red, door: C.amber })) +
      place(430, 220, k.doc({ w: 170, h: 220, title: 'PARTIDA', head: C.redSoft, accent: C.red, rows: [120, 90, 110, 80], stamp: true })) +
      place(640, 160, k.coin({ r: 46, label: 'S/' })) +
      place(640, 290, rect(-90, -46, 180, 92, { rx: 14, fill: C.white, stroke: C.slate, sw: 3 }) + text(0, -14, 'Calificación', { size: 15, fill: C.slateMid }) + text(0, 14, '+ Inscripción', { size: 15, fill: C.slateMid }) + text(0, 38, '‰ del valor', { size: 13, fill: C.red })) +
      place(80, 80, k.flag('PE', 70)),
  },
]
