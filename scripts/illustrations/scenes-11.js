// Escena: calculadora de anagramas.
const k = require('./kit')
const { C, place, text, rect } = k

const ficha = (l, { fill = C.white, stroke = C.slate, color = C.slate } = {}) =>
  rect(-32, -36, 64, 72, { rx: 10, fill, stroke, sw: 3 }) + text(0, 14, l, { size: 38, fill: color })

const fila = (letras, estilo) => letras.map((l, i) => place(i * 78, 0, ficha(l, estilo))).join('')

module.exports = [
  {
    slug: 'calculadora-de-anagramas',
    file: 'calculadora-de-anagramas-palabras-con-las-mismas-letras',
    alt: 'Calculadora de anagramas',
    draw: () =>
      k.frame('anagramas', { blob: C.amberSoft, blob2: C.purpleXs }) +
      k.ground(400, 410, 560) +
      place(170, 120, fila(['A', 'M', 'O', 'R'], { fill: C.amberSoft, stroke: C.amberDark, color: C.slate })) +
      k.arrow(380, 170, 380, 250, { color: C.purple, bend: 30 }) +
      place(170, 300, fila(['R', 'O', 'M', 'A'], { fill: C.purple, stroke: C.purpleDark, color: C.white })) +
      place(640, 150, k.pill({ w: 170, h: 40, label: '4! = 24', fill: C.blue, size: 20 })) +
      place(640, 230, k.bubble({ w: 190, h: 74, label: 'mora · ramo', size: 20, stroke: C.purple })) +
      place(650, 330, k.check({ r: 30 })),
  },
]
