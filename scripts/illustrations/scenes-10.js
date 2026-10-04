// Escenas: SUTEBA y simulador de la Liga 1.
const k = require('./kit')
const { C, place, text, rect, circle } = k

const pizarron = () => rect(-150, -100, 300, 190, { rx: 10, fill: '#14532D', stroke: '#92400E', sw: 10 }) + text(0, -40, '2 + 3 = 5', { size: 30, fill: C.white, family: 'Courier New, monospace' }) + text(0, 10, 'a · e · i · o · u', { size: 24, fill: C.amberSoft, family: 'Courier New, monospace' }) + rect(-60, 90, 120, 10, { rx: 4, fill: '#92400E' })
const pelota = (r = 40) => circle(0, 0, r, { fill: C.white, stroke: C.slate, sw: 3 }) + `<path d="M0,${-r * 0.35} L${r * 0.33},${-r * 0.1} L${r * 0.2},${r * 0.28} L${-r * 0.2},${r * 0.28} L${-r * 0.33},${-r * 0.1} Z" fill="${C.slate}"/>` + [0, 1, 2, 3, 4].map((i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5; return `<line x1="${Math.cos(a) * r * 0.36}" y1="${Math.sin(a) * r * 0.36}" x2="${Math.cos(a) * r * 0.95}" y2="${Math.sin(a) * r * 0.95}" stroke="${C.slate}" stroke-width="3"/>` }).join('')

module.exports = [
  {
    slug: 'calculadora-suteba',
    file: 'calcular-sueldo-docente-provincia-de-buenos-aires',
    alt: 'Calculadora SUTEBA',
    draw: () =>
      k.frame('suteba-docente', { blob2: C.blueSoft }) +
      k.ground(400, 400, 600) +
      place(240, 190, pizarron()) +
      place(130, 330, k.person({ shirt: C.pink, skin: 0, hair: 3, long: true, pose: 'wave' }), { s: 0.75 }) +
      place(560, 220, k.doc({ w: 180, h: 230, title: 'RECIBO DOCENTE', head: C.blueSoft, accent: C.blue, rows: [130, 100, 120, 90], total: 'IPS · IOMA' })) +
      place(690, 330, k.pill({ w: 140, h: 36, label: 'Antigüedad %', fill: C.purple, size: 14 })) +
      place(700, 80, k.flag('AR', 70)),
  },
  {
    slug: 'simulador-liga-1',
    file: 'simulador-tabla-de-posiciones-liga-1-peru',
    alt: 'Simulador Liga 1',
    draw: () =>
      k.frame('liga-1-peru', { blob: C.greenSoft, blob2: C.redSoft }) +
      `<path d="M0,360 Q400,330 800,360 V450 H0 Z" fill="#BBF7D0"/>` +
      place(230, 220, rect(-160, -120, 320, 240, { rx: 16, fill: C.white, stroke: C.slate, sw: 3 }) + rect(-160, -120, 320, 40, { rx: 16, fill: C.slate }) + rect(-160, -92, 320, 12, { rx: 0, fill: C.slate }) + text(-140, -94, '#  Equipo', { size: 14, fill: C.white, anchor: 'start' }) + text(140, -94, 'Pts', { size: 14, fill: C.white, anchor: 'end' }) +
        [[1, 22, C.green], [2, 20, C.slateSoft], [3, 19, C.slateSoft], [4, 19, C.slateSoft], [5, 19, C.slateSoft]].map(([n, p, c], i) => rect(-150, -66 + i * 36, 300, 30, { rx: 6, fill: i === 0 ? C.greenSoft : C.paper }) + text(-136, -45 + i * 36, String(n), { size: 15, fill: C.slate, anchor: 'start' }) + rect(-110, -56 + i * 36, 150, 10, { rx: 5, fill: c }) + text(136, -45 + i * 36, String(p), { size: 15, fill: C.slate, anchor: 'end' })).join('')) +
      place(560, 230, pelota(70)) +
      place(560, 110, k.pill({ w: 150, h: 40, label: '2 - 0', fill: C.red, size: 22 })) +
      place(700, 80, k.flag('PE', 70)),
  },
]
