// Infografía de la calculadora de anagramas: cuántas ordenaciones tiene una palabra y cuántas son palabras reales.
const { rect } = require('../illustrations/kit')
const { tema, W, M } = require('./piezas-4').temas

const ficha = (T, x, y, l, { fill = '#FFFFFF', stroke, color } = {}) =>
  rect(x, y, 52, 58, { rx: 9, fill, stroke: stroke || T.line, sw: 2.5 }) + T.tx(x + 26, y + 40, l, { size: 28, weight: 700, anchor: 'middle', fill: color || T.ink })

function anagramas() {
  const T = tema('pizarra')
  let s = T.tx(M, 190, '¿De cuántas formas se ordenan las letras de COLOMBIA?', { size: 21, family: T.titulo, fill: T.accent })
  const letras = [...'COLOMBIA']
  letras.forEach((l, i) => {
    const repetida = l === 'O'
    s += ficha(T, M + i * 60, 214, l, { fill: repetida ? '#FDE68A' : '#FFFFFF', stroke: repetida ? '#F59E0B' : '#D1D5DB', color: '#1F2937' })
  })
  s += T.tx(M + 8 * 60 + 14, 252, 'La O se repite 2 veces', { size: 16, fill: T.muted })
  s += rect(M, 300, W - 2 * M, 112, { rx: 14, fill: T.soft, stroke: T.line, sw: 2 })
  s += T.tx(M + 22, 340, '8 letras → 8! = 40.320 ordenaciones', { size: 21 })
  s += T.tx(M + 22, 378, 'Las dos O son iguales: 40.320 ÷ 2! = 20.160 distintas', { size: 21, weight: 700, fill: T.accent })
  s += T.tx(M + 22, 402, 'Fórmula: n! ÷ (a! × b! × …), con a, b… las veces que se repite cada letra', { size: 14, fill: T.muted })

  const y2 = 452
  s += T.tx(M, y2, 'Pocas ordenaciones son palabras de verdad', { size: 21, family: T.titulo, fill: T.accent })
  const casos = [
    ['AMOR', '24 ordenaciones', 'roma · mora · ramo · armo · maro'],
    ['ALEGRÍA', '2.520 ordenaciones', 'alergia · galería · regalía · aligera…'],
    ['ABRIGAR', '1.260 ordenaciones', 'barriga'],
  ]
  casos.forEach(([palabra, n, reales], i) => {
    const y = y2 + 22 + i * 74
    s += rect(M, y, W - 2 * M, 62, { rx: 12, fill: T.soft, stroke: T.line, sw: 1.5 })
    s += T.tx(M + 18, y + 27, palabra, { size: 20, weight: 700 })
    s += T.tx(M + 18, y + 50, n, { size: 14, fill: T.muted })
    s += T.tx(W - M - 18, y + 39, reales, { size: 17, anchor: 'end', fill: T.accent })
  })
  const n = T.nota(y2 + 22 + 3 * 74 + 12, 'Las tildes no cuentan al formar un anagrama: alegría y galería usan las mismas letras.')
  return T.lienzo({ alto: Math.round(y2 + 22 + 3 * 74 + 12 + n.h + 60), slug: 'calculadora-de-anagramas', titulo: 'Ordenaciones posibles y anagramas reales', cuerpo: s + n.svg })
}

module.exports = [
  { archivo: 'ordenaciones-letras-anagramas-colombia', alt: 'Cálculo de las ordenaciones de las letras de COLOMBIA y ejemplos de anagramas reales en español', dibujar: anagramas },
]
