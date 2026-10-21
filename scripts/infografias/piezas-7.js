// Infografías del lote 7 (herramientas 61 a 70).
const { rect, circle } = require('../illustrations/kit')
const { tema, W, M, es } = require('./piezas-4').temas

// ─────────────────────────────────────────────────────────── 61 Volumen (pastel, cuatro cuerpos)
function volumen() {
  const T = tema('pastel', { accent: '#0E7490', soft: '#ECFEFF', bg: '#F5FEFF', line: '#CFF5FA', ink: '#164E63' })
  const cw = (W - 2 * M - 16) / 2
  const figs = [
    ['Cubo', 'V = l³', 'l = 5 → 125', (x, y) => `<rect x="${x + 30}" y="${y + 50}" width="70" height="70" fill="#A5F3FC" stroke="${T.accent}" stroke-width="3"/><path d="M${x + 30},${y + 50} l20,-20 h70 l-20,20 M${x + 100},${y + 50} l20,-20 v70 l-20,20" fill="#CFFAFE" stroke="${T.accent}" stroke-width="3"/>`],
    ['Esfera', 'V = 4/3 × π × r³', 'r = 3 → 113,10', (x, y) => circle(x + 75, y + 80, 48, { fill: '#A5F3FC', stroke: T.accent, sw: 3 }) + `<ellipse cx="${x + 75}" cy="${y + 80}" rx="48" ry="14" fill="none" stroke="${T.accent}" stroke-width="2" stroke-dasharray="5 5"/>`],
    ['Cono', 'V = π × r² × h ÷ 3', 'r = 3, h = 8 → 75,40', (x, y) => `<path d="M${x + 75},${y + 26} L${x + 125},${y + 126} L${x + 25},${y + 126} Z" fill="#A5F3FC" stroke="${T.accent}" stroke-width="3"/><ellipse cx="${x + 75}" cy="${y + 126}" rx="50" ry="12" fill="#CFFAFE" stroke="${T.accent}" stroke-width="3"/>`],
    ['Prisma (caja)', 'V = l × a × h', '4 × 3 × 2 → 24', (x, y) => `<rect x="${x + 20}" y="${y + 66}" width="100" height="56" fill="#A5F3FC" stroke="${T.accent}" stroke-width="3"/><path d="M${x + 20},${y + 66} l26,-22 h100 l-26,22 M${x + 120},${y + 66} l26,-22 v56 l-26,22" fill="#CFFAFE" stroke="${T.accent}" stroke-width="3"/>`],
  ]
  let s = ''
  figs.forEach(([n, f, e, dib], i) => {
    const x = M + (i % 2) * (cw + 16)
    const y = 176 + Math.floor(i / 2) * 200
    s += rect(x, y, cw, 186, { rx: 18, fill: '#FFFFFF', stroke: T.line, sw: 2 })
    s += dib(x, y + 10)
    s += T.tx(x + 180, y + 50, n, { size: 21, weight: 700 })
    s += T.tx(x + 180, y + 90, f, { size: 16, fill: T.accent, weight: 700 })
    s += T.tx(x + 180, y + 124, e, { size: 16, fill: T.muted })
  })
  const n = T.nota(176 + 2 * 200 + 20, 'Las medidas en cm dan el volumen en cm³; divide entre 1.000 para tenerlo en litros. Para cilindros hay una calculadora propia.')
  return T.lienzo({ alto: Math.round(176 + 2 * 200 + 20 + n.h + 60), slug: 'calculadora-volumen', titulo: 'Fórmulas de volumen de cubo, esfera, cono y prisma', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 62 Cálculos combinados (cuaderno)
function combinados() {
  const T = tema('cuaderno', { accent: '#16A34A' })
  const orden = [['1', 'Paréntesis', '( )'], ['2', 'Potencias y raíces', 'x²  √'], ['3', 'Multiplicaciones y divisiones', '×  ÷'], ['4', 'Sumas y restas', '+  −']]
  let s = ''
  orden.forEach(([n, t, sim], i) => {
    const y = 176 + i * 62
    const w = W - 2 * M - i * 60
    s += rect(M + i * 30, y, w, 52, { rx: 12, fill: ['#DCFCE7', '#E0F2FE', '#FEF9C3', '#FCE7F3'][i], stroke: '#93C5FD', sw: 1.5 })
    s += T.tx(M + i * 30 + 18, y + 35, `${n}. ${t}`, { size: 20, weight: 700 })
    s += T.tx(M + i * 30 + w - 18, y + 36, sim, { size: 24, anchor: 'end', family: T.titulo, fill: T.accent })
  })
  s += T.tx(M, 176 + 4 * 62 + 20, 'De izquierda a derecha dentro de cada nivel.', { size: 17, fill: T.muted })
  const ey = 176 + 4 * 62 + 70
  const pasos = [['3 + 4 × (6 − 2)² ÷ 8', ''], ['3 + 4 × 4² ÷ 8', 'paréntesis'], ['3 + 4 × 16 ÷ 8', 'potencia'], ['3 + 64 ÷ 8', 'multiplicación'], ['3 + 8', 'división'], ['11', 'suma']]
  pasos.forEach(([e, c], i) => {
    const y = ey + i * 48
    s += T.tx(M + 10, y + 30, e, { size: i === 5 ? 34 : 26, family: T.titulo, fill: i === 5 ? T.accent : T.ink, weight: i === 5 ? 700 : 400 })
    if (c) s += T.tx(W - M, y + 28, c, { size: 16, anchor: 'end', fill: T.muted })
  })
  const n = T.nota(ey + 6 * 48 + 20, 'Error clásico: sumar antes de multiplicar. 3 + 4 × 2 es 11, no 14.')
  return T.lienzo({ alto: Math.round(ey + 6 * 48 + 20 + n.h + 56), slug: 'calculadora-calculos-combinados', titulo: 'El orden de las operaciones, paso a paso', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 63 Resistencias (banda gris, resistor dibujado)
function resistencias() {
  const T = tema('banda', { accent: '#475569', soft: '#F8FAFC' })
  const cx = W / 2
  let s = `<line x1="${M}" y1="240" x2="${W - M}" y2="240" stroke="#9CA3AF" stroke-width="6"/>`
  s += rect(cx - 170, 200, 340, 80, { rx: 36, fill: '#E7D3B0', stroke: '#B08D57', sw: 3 })
  const bandas = [['#8B4513', 'Marrón', '1'], ['#1A1A1A', 'Negro', '0'], ['#DC2626', 'Rojo', '× 100'], ['#CA8A04', 'Dorado', '± 5 %']]
  const xs = [cx - 110, cx - 60, cx - 10, cx + 90]
  bandas.forEach(([c, n, v], i) => {
    s += `<rect x="${xs[i]}" y="200" width="24" height="80" fill="${c}"/>`
    s += `<line x1="${xs[i] + 12}" y1="284" x2="${xs[i] + 12}" y2="${310 + i * 0}" stroke="#9CA3AF" stroke-width="2"/>`
    s += T.tx(xs[i] + 12, 330, n, { size: 15, anchor: 'middle', fill: T.muted })
    s += T.tx(xs[i] + 12, 356, v, { size: 18, weight: 700, anchor: 'middle' })
  })
  s += rect(M, 382, W - 2 * M, 56, { rx: 12, fill: T.soft })
  s += T.tx(W / 2, 418, '1 · 0 × 100 = 1.000 Ω = 1 kΩ  (±5 %)', { size: 22, weight: 700, anchor: 'middle' })
  const colores = [['Negro', '#1A1A1A', 0], ['Marrón', '#8B4513', 1], ['Rojo', '#DC2626', 2], ['Naranja', '#EA580C', 3], ['Amarillo', '#EAB308', 4], ['Verde', '#16A34A', 5], ['Azul', '#2563EB', 6], ['Violeta', '#7C3AED', 7], ['Gris', '#6B7280', 8], ['Blanco', '#FFFFFF', 9]]
  const cw = (W - 2 * M - 36) / 5
  colores.forEach(([n, c, v], i) => {
    const x = M + (i % 5) * (cw + 9)
    const y = 470 + Math.floor(i / 5) * 64
    s += rect(x, y, cw, 54, { rx: 10, fill: c, stroke: '#D1D5DB', sw: 1.5 })
    const claro = ['Amarillo', 'Blanco'].includes(n)
    s += T.tx(x + 12, y + 34, n, { size: 15, fill: claro ? '#111' : '#FFF' })
    s += T.tx(x + cw - 12, y + 36, String(v), { size: 22, weight: 700, anchor: 'end', fill: claro ? '#111' : '#FFF' })
  })
  const oy = 470 + 2 * 64 + 20
  s += rect(M, oy, W - 2 * M, 66, { rx: 12, fill: '#FEF3C7' })
  s += T.tx(M + 18, oy + 42, 'Ley de Ohm:  V = I × R   ·   P = V × I', { size: 22, weight: 700, fill: '#92400E' })
  return T.lienzo({ alto: oy + 66 + 84, slug: 'calculadora-resistencias', titulo: 'Cómo leer el código de colores de una resistencia', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 64 Calorías (banda naranja, flujo)
function calorias() {
  const T = tema('banda', { accent: '#C2410C', soft: '#FFF7ED' })
  const pasos = [
    ['Metabolismo basal (BMR)', 'Mifflin-St Jeor: 10 × 65 + 6,25 × 165 − 5 × 30 − 161', '1.370 kcal'],
    ['Gasto diario (TDEE)', 'BMR × 1,55 por actividad moderada', '2.124 kcal'],
    ['Objetivo: bajar de peso', 'TDEE − 20 %', '1.699 kcal'],
  ]
  let s = T.tx(M, 180, 'Mujer de 30 años, 65 kg, 1,65 m, ejercicio 3-5 días por semana', { size: 17, fill: T.muted })
  pasos.forEach(([t, d, v], i) => {
    const y = 204 + i * 128
    s += rect(M, y, W - 2 * M, 104, { rx: 18, fill: i === 2 ? T.accent : T.soft })
    s += T.tx(M + 22, y + 38, t, { size: 21, weight: 700, fill: i === 2 ? '#FFF' : T.ink })
    s += T.tx(M + 22, y + 72, d, { size: 15, fill: i === 2 ? '#FFEDD5' : T.muted })
    s += T.tx(W - M - 22, y + 62, v, { size: 30, weight: 700, anchor: 'end', fill: i === 2 ? '#FFF' : T.accent })
    if (i < 2) s += `<path d="M${W / 2},${y + 108} v14 M${W / 2 - 8},${y + 114} L${W / 2},${y + 122} L${W / 2 + 8},${y + 114}" fill="none" stroke="${T.accent}" stroke-width="3"/>`
  })
  const fy = 204 + 3 * 128 + 10
  const factores = [['1,2', 'Sedentario'], ['1,375', 'Ligero'], ['1,55', 'Moderado'], ['1,725', 'Activo'], ['1,9', 'Muy activo']]
  const fw = (W - 2 * M - 32) / 5
  factores.forEach(([f, n], i) => {
    const x = M + i * (fw + 8)
    s += rect(x, fy, fw, 74, { rx: 12, fill: i === 2 ? '#FED7AA' : '#FFFFFF', stroke: '#FDBA74', sw: 1.5 })
    s += T.tx(x + fw / 2, fy + 32, f, { size: 22, weight: 700, anchor: 'middle', fill: T.accent })
    s += T.tx(x + fw / 2, fy + 58, n, { size: 14, anchor: 'middle', fill: T.muted })
  })
  const n = T.nota(fy + 116, 'Un déficit del 20 % suele dar una pérdida gradual y sostenible. No bajes de 1.200 kcal (mujeres) o 1.500 kcal (hombres) sin supervisión profesional.')
  return T.lienzo({ alto: Math.round(fy + 116 + n.h + 64), slug: 'calculadora-calorias', titulo: 'De tu metabolismo basal a las calorías para bajar de peso', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 65 Embarazo (pastel rosa, línea de 40 semanas)
function embarazo() {
  const T = tema('pastel', { accent: '#DB2777', soft: '#FCE7F3', bg: '#FFF7FB', ink: '#500724', line: '#FBCFE8' })
  const x0 = M
  const ancho = W - 2 * M
  const X = (sem) => x0 + (sem / 40) * ancho
  const y = 240
  let s = T.tx(M, 186, 'Fecha de la última regla (FUM): 1 de marzo de 2026', { size: 19, weight: 700 })
  const tri = [[0, 13, 'Primer trimestre', '#F9A8D4'], [13, 27, 'Segundo trimestre', '#F472B6'], [27, 40, 'Tercer trimestre', '#DB2777']]
  tri.forEach(([a, b, n, c]) => {
    s += rect(X(a), y, X(b) - X(a), 40, { rx: 0, fill: c })
    s += T.tx((X(a) + X(b)) / 2, y + 66, n, { size: 16, anchor: 'middle', weight: 700 })
  })
  ;[0, 13, 27, 40].forEach((w) => { s += T.tx(X(w), y - 10, `sem. ${w}`, { size: 14, anchor: w === 0 ? 'start' : w === 40 ? 'end' : 'middle', fill: T.muted }) })
  const hoy = 33 + 3 / 7
  s += `<line x1="${X(hoy)}" y1="${y - 2}" x2="${X(hoy)}" y2="${y + 92}" stroke="${T.ink}" stroke-width="3"/>` + T.tx(X(hoy), y + 112, 'Hoy, 21 de octubre: 33 semanas y 3 días', { size: 16, anchor: 'end', weight: 700 })
  const cy = y + 160
  const datos = [['Fecha probable de parto', '6 de diciembre de 2026', 'FUM + 280 días (regla de Naegele)'], ['Embarazo a término', 'De la semana 37 a la 42', 'solo un 4 % nace justo en la fecha probable']]
  datos.forEach(([a, b, c], i) => {
    const yy = cy + i * 110
    s += rect(M, yy, W - 2 * M, 96, { rx: 18, fill: i === 0 ? T.accent : T.soft })
    s += T.tx(M + 22, yy + 32, a, { size: 16, fill: i === 0 ? '#FCE7F3' : T.muted })
    s += T.tx(M + 22, yy + 64, b, { size: 26, weight: 700, fill: i === 0 ? '#FFFFFF' : T.ink })
    s += T.tx(M + 22, yy + 86, c, { size: 14, fill: i === 0 ? '#FBCFE8' : T.muted })
  })
  return T.lienzo({ alto: cy + 2 * 110 + 70, slug: 'calculadora-embarazo', titulo: 'Las 40 semanas del embarazo y la fecha probable de parto', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 66 Peso ideal (papel, tabla con barras)
function pesoIdeal() {
  const T = tema('papel', { accent: '#047857', soft: '#D1FAE5', line: '#E3DCCB' })
  const filas = [[150, 41.6, 56.0], [155, 44.4, 59.8], [160, 47.4, 63.7], [165, 50.4, 67.8], [170, 53.5, 72.0], [175, 56.7, 76.3], [180, 59.9, 80.7], [185, 63.3, 85.2], [190, 66.8, 89.9]]
  const min = 35
  const max = 95
  const x0 = M + 120
  const ancho = W - M - x0 - 10
  const X = (kg) => x0 + ((kg - min) / (max - min)) * ancho
  let s = ''
  ;[40, 50, 60, 70, 80, 90].forEach((k) => { s += T.tx(X(k), 186, `${k} kg`, { size: 14, anchor: 'middle', fill: T.muted }) + `<line x1="${X(k)}" y1="196" x2="${X(k)}" y2="${200 + filas.length * 52}" stroke="${T.line}" stroke-width="1.5"/>` })
  filas.forEach(([h, a, b], i) => {
    const y = 204 + i * 52
    s += T.tx(M, y + 28, `${h} cm`, { size: 20, weight: 700, family: T.titulo })
    s += rect(X(a), y + 8, X(b) - X(a), 30, { rx: 15, fill: T.accent })
    s += T.tx(X(a) - 8, y + 29, es(a, 1), { size: 15, anchor: 'end' })
    s += T.tx(X(b) + 8, y + 29, es(b, 1), { size: 15 })
  })
  const n = T.nota(204 + filas.length * 52 + 30, 'Rango de peso saludable para adultos: IMC entre 18,5 y 24,9 según la OMS. No tiene en cuenta la masa muscular ni la complexión.')
  return T.lienzo({ alto: Math.round(204 + filas.length * 52 + 30 + n.h + 64), slug: 'calculadora-peso-ideal', titulo: 'Peso saludable según tu altura', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 67 Ciclos de sueño (oscuro noche)
function sueno() {
  const T = tema('oscuro', { accent: '#818CF8', bg: '#0B1026', soft: '#151B3D', line: '#232A55' })
  const opciones = [['21:45', 6, '9 h'], ['23:15', 5, '7 h 30 min'], ['00:45', 4, '6 h'], ['02:15', 3, '4 h 30 min']]
  let s = T.tx(M, 184, 'Si te despiertas a las 7:00, acuéstate a las…', { size: 22, weight: 700 })
  opciones.forEach(([h, c, d], i) => {
    const y = 210 + i * 92
    const mejor = i < 2
    s += rect(M, y, W - 2 * M, 80, { rx: 16, fill: mejor ? '#1E1B4B' : T.soft, stroke: mejor ? T.accent : T.line, sw: 2 })
    s += T.tx(M + 22, y + 52, h, { size: 34, weight: 700, fill: mejor ? T.accent : T.ink, family: 'Consolas, monospace' })
    for (let k = 0; k < c; k++) s += `<path d="M${M + 190 + k * 54},${y + 50} q13,-26 26,0 q13,26 26,0" fill="none" stroke="${mejor ? T.accent : T.muted}" stroke-width="3"/>`
    s += T.tx(W - M - 22, y + 36, `${c} ciclos`, { size: 18, weight: 700, anchor: 'end' })
    s += T.tx(W - M - 22, y + 60, `${d} de sueño`, { size: 15, anchor: 'end', fill: T.muted })
  })
  const ny = 210 + 4 * 92 + 16
  s += circle(M + 30, ny + 34, 26, { fill: '#FDE68A' }) + circle(M + 42, ny + 26, 24, { fill: T.bg })
  s += T.tx(M + 76, ny + 30, 'Ciclos de unos 90 minutos', { size: 19, weight: 700 })
  s += T.tx(M + 76, ny + 56, 'más 15 minutos para quedarte dormido', { size: 17, fill: T.muted })
  const n = T.nota(ny + 100, 'Los adultos necesitan entre 7 y 9 horas: 5 o 6 ciclos. Despertar al final de un ciclo, y no en medio, ayuda a levantarse con menos pesadez.')
  return T.lienzo({ alto: Math.round(ny + 100 + n.h + 60), slug: 'calculadora-ciclos-sueno', titulo: 'A qué hora acostarte para despertar entre ciclos de sueño', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 68 Escalas (cuaderno de plano)
function escalas() {
  const T = tema('cuaderno', { accent: '#B45309' })
  let s = rect(M + 10, 190, 300, 200, { rx: 4, fill: '#FFFFFF', stroke: T.ink, sw: 3 })
  s += `<line x1="${M + 10}" y1="290" x2="${M + 170}" y2="290" stroke="${T.ink}" stroke-width="3"/><line x1="${M + 170}" y1="290" x2="${M + 170}" y2="390" stroke="${T.ink}" stroke-width="3"/>`
  s += `<path d="M${M + 210},390 a40,40 0 0 1 40,-40" fill="none" stroke="${T.ink}" stroke-width="2"/>`
  s += `<line x1="${M + 10}" y1="410" x2="${M + 310}" y2="410" stroke="${T.accent}" stroke-width="2.5"/><line x1="${M + 10}" y1="402" x2="${M + 10}" y2="418" stroke="${T.accent}" stroke-width="2.5"/><line x1="${M + 310}" y1="402" x2="${M + 310}" y2="418" stroke="${T.accent}" stroke-width="2.5"/>`
  s += T.tx(M + 160, 440, '12 cm en el plano', { size: 18, anchor: 'middle', family: T.titulo, fill: T.accent })
  s += T.tx(M + 160, 470, '1:50 → 6 m reales', { size: 24, anchor: 'middle', weight: 700, family: T.titulo })
  const fx = 400
  const filas = [['1:20', '1 cm = 20 cm', 'Muebles y detalles'], ['1:50', '1 cm = 50 cm', 'Planos de vivienda'], ['1:100', '1 cm = 1 m', 'Planos de edificio'], ['1:1.000', '1 cm = 10 m', 'Urbanismo'], ['1:50.000', '1 cm = 500 m', 'Mapas de senderismo']]
  filas.forEach(([e, eq, u], i) => {
    const y = 190 + i * 64
    s += rect(fx, y, W - M - fx, 54, { rx: 10, fill: '#FFFFFF', stroke: '#93C5FD', sw: 2 })
    s += T.tx(fx + 14, y + 34, e, { size: 18, weight: 700, fill: T.accent, family: T.titulo })
    s += T.tx(fx + 140, y + 25, eq, { size: 16, weight: 700 })
    s += T.tx(fx + 140, y + 45, u, { size: 14, fill: T.muted })
  })
  const fy = 190 + 5 * 64 + 30
  s += rect(M, fy, W - 2 * M, 70, { rx: 14, fill: T.soft, stroke: '#93C5FD', sw: 2 })
  s += T.tx(W / 2, fy + 44, 'real = plano × N      ·      plano = real ÷ N', { size: 22, weight: 700, anchor: 'middle', family: T.titulo })
  const n = T.nota(fy + 110, 'Usa la misma unidad en las dos medidas. Si mides el plano en cm, el resultado real también sale en cm.')
  return T.lienzo({ alto: Math.round(fy + 110 + n.h + 56), slug: 'calculadora-de-escalas', titulo: 'Cómo leer las escalas de planos y mapas', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 69 Sopa de letras (banda amarilla, cuadrícula)
function sopa() {
  const T = tema('banda', { accent: '#A16207', soft: '#FEFCE8' })
  const grid = [
    'SOLEMAR',
    'XLUNAPO',
    'AIRETBK',
    'NUBEZIO',
    'RIOGTFL',
    'AVTSELA',
    'MCIELOR',
  ]
  const c = 56
  const x0 = M + 10
  const y0 = 190
  let s = ''
  // Palabras resaltadas: SOL (fila 0), LUNA (fila 1), NUBE (fila 3), RIO (fila 4), CIELO (fila 6), MAR (fila 0)
  const marcas = [[0, 0, 0, 2], [1, 1, 1, 4], [3, 0, 3, 3], [4, 0, 4, 2], [6, 1, 6, 5], [0, 4, 0, 6]]
  const cols = ['#FDE68A', '#BFDBFE', '#BBF7D0', '#FBCFE8', '#DDD6FE', '#FED7AA']
  marcas.forEach(([r1, c1, r2, c2], i) => { s += rect(x0 + c1 * c + 4, y0 + r1 * c + 6, (c2 - c1 + 1) * c - 8, (r2 - r1 + 1) * c - 12, { rx: 22, fill: cols[i] }) })
  grid.forEach((fila, r) => [...fila].forEach((ch, k) => { s += T.tx(x0 + k * c + c / 2, y0 + r * c + 38, ch, { size: 28, weight: 700, anchor: 'middle', family: 'Consolas, monospace' }) }))
  const lx = x0 + 7 * c + 40
  s += T.tx(lx, 210, 'Palabras', { size: 20, weight: 700 })
  ;['SOL', 'MAR', 'LUNA', 'NUBE', 'RIO', 'CIELO'].forEach((p, i) => { s += rect(lx, 228 + i * 44, 22, 22, { rx: 6, fill: cols[[0, 5, 1, 2, 3, 4][i]] }) + T.tx(lx + 34, 246 + i * 44, p, { size: 20 }) })
  const dy = y0 + 7 * c + 30
  s += T.tx(M, dy, '8 direcciones posibles', { size: 20, weight: 700 })
  const cx = M + 90
  const cy = dy + 90
  for (let k = 0; k < 8; k++) {
    const a = (k * Math.PI) / 4
    const x2 = cx + 58 * Math.cos(a)
    const y2 = cy + 58 * Math.sin(a)
    s += `<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="${T.accent}" stroke-width="4" stroke-linecap="round"/>` + circle(x2, y2, 6, { fill: T.accent })
  }
  s += T.tx(cx + 110, cy - 10, 'Horizontal, vertical y diagonal,', { size: 18 })
  s += T.tx(cx + 110, cy + 18, 'hacia delante y hacia atrás.', { size: 18 })
  return T.lienzo({ alto: cy + 70 + 70, slug: 'sopa-de-letras', titulo: 'Así se esconden las palabras en una sopa de letras', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 70 Letras grandes (oscuro, tres estilos)
function letrasGrandes() {
  const T = tema('oscuro', { accent: '#F97316', bg: '#18181B', soft: '#27272A', line: '#3F3F46' })
  const estilos = [
    ['Grafiti', 'Rótulos, carteles de fiesta y portadas', 'Impact, Arial Black, sans-serif', '#F97316', 64],
    ['Tatuaje', 'Referencia para un tatuador o una invitación', 'Segoe Script, Brush Script MT, cursive', '#F472B6', 58],
    ['Molde', 'Letras para recortar, murales y clase', 'Arial Black, Arial, sans-serif', '#38BDF8', 60],
  ]
  let s = ''
  estilos.forEach(([n, u, f, col, size], i) => {
    const y = 176 + i * 150
    s += rect(M, y, W - 2 * M, 136, { rx: 18, fill: T.soft })
    s += T.tx(M + 24, y + 86, 'Sofía', { size, family: f, fill: col, weight: 700 })
    s += T.tx(W - M - 24, y + 56, n, { size: 22, weight: 700, anchor: 'end' })
    s += T.tx(W - M - 24, y + 86, u, { size: 15, anchor: 'end', fill: T.muted })
  })
  const n = T.nota(176 + 3 * 150 + 10, 'Muestra aproximada de cada estilo. La herramienta genera una imagen con tu texto que puedes descargar o imprimir en varias hojas.')
  return T.lienzo({ alto: Math.round(176 + 3 * 150 + 10 + n.h + 60), slug: 'generador-de-letras-grandes', titulo: 'Tres estilos de letras grandes y para qué usar cada uno', cuerpo: s + n.svg })
}

const pieza = (archivo, alt, fn) => ({ archivo, alt, dibujar: fn })

module.exports = [
  pieza('formulas-volumen-cubo-esfera-cono', 'Fórmulas de volumen del cubo, la esfera, el cono y el prisma rectangular con ejemplos', volumen),
  pieza('orden-de-las-operaciones-ejemplo', 'Orden de las operaciones combinadas con un ejemplo resuelto paso a paso que da 11', combinados),
  pieza('codigo-colores-resistencias', 'Código de colores de una resistencia de 1 kilohmio y tabla de valores de cada color', resistencias),
  pieza('calorias-bmr-tdee-deficit', 'Cálculo de calorías diarias: metabolismo basal, gasto con actividad y déficit para bajar de peso', calorias),
  pieza('semanas-embarazo-fecha-parto', 'Línea de las 40 semanas de embarazo por trimestres y cálculo de la fecha probable de parto', embarazo),
  pieza('peso-saludable-segun-altura', 'Rango de peso saludable en kilos según la altura de 150 a 190 cm', pesoIdeal),
  pieza('hora-dormir-ciclos-de-sueno', 'Horas para acostarse según los ciclos de sueño de 90 minutos si te despiertas a las 7', sueno),
  pieza('escalas-planos-mapas', 'Escalas de planos y mapas como 1:50, 1:100 y 1:50.000 con su equivalencia real', escalas),
  pieza('sopa-de-letras-direcciones', 'Ejemplo de sopa de letras con palabras resaltadas y las ocho direcciones posibles', sopa),
  pieza('estilos-letras-grandes', 'Estilos de letras grandes: grafiti, tatuaje y molde con sus usos', letrasGrandes),
]
