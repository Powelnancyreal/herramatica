// Infografías del lote 16 (herramientas 151 a 160).
const { rect, circle } = require('../illustrations/kit')
const { tema, W, M, es } = require('./piezas-4').temas

// ─────────────────────────────────────────────────────────── 151 Millas a km (banda verde señal de tráfico)
function millas() {
  const T = tema('banda', { accent: '#047857', soft: '#ECFDF5' })
  const senal = (x, y, mph, kmh) => rect(x, y, 150, 190, { rx: 14, fill: '#FFFFFF', stroke: '#111827', sw: 5 }) + T.tx(x + 75, y + 40, 'SPEED', { size: 18, weight: 700, anchor: 'middle', fill: '#111827' }) + T.tx(x + 75, y + 62, 'LIMIT', { size: 18, weight: 700, anchor: 'middle', fill: '#111827' }) + T.tx(x + 75, y + 130, String(mph), { size: 60, weight: 700, anchor: 'middle', fill: '#111827' }) + T.tx(x + 75, y + 222, `${kmh} km/h`, { size: 20, weight: 700, anchor: 'middle', fill: T.accent })
  let s = ''
  ;[[30, 48], [55, 89], [65, 105], [75, 121]].forEach(([m, k], i) => { s += senal(M + i * 182, 186, m, k) })
  const ty = 466
  s += T.tx(M, ty, '1 milla = 1,609 km · 1 milla náutica = 1,852 km', { size: 20, weight: 700 })
  const fib = [[3, 5], [5, 8], [8, 13], [13, 21]]
  s += T.tx(M, ty + 40, 'Truco de Fibonacci: cada número de la serie es casi el siguiente en kilómetros', { size: 16, fill: T.muted })
  fib.forEach(([a, b], i) => {
    const x = M + i * 178
    s += rect(x, ty + 60, 166, 70, { rx: 12, fill: T.soft })
    s += T.tx(x + 83, ty + 104, `${a} mi ≈ ${b} km`, { size: 22, weight: 700, anchor: 'middle', fill: T.accent })
  })
  const n = T.nota(ty + 170, 'Un maratón son 26,2 millas (42,195 km). Los límites de velocidad de EE. UU. y Reino Unido están en millas por hora.')
  return T.lienzo({ alto: Math.round(ty + 170 + n.h + 64), slug: 'millas-a-kilometros', titulo: 'Límites de velocidad en millas y su equivalencia en km/h', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 152 Pies a metros (pastel, estaturas)
function pies() {
  const T = tema('pastel', { accent: '#4338CA', soft: '#E0E7FF', bg: '#F8F9FF', ink: '#1E1B4B', line: '#C7D2FE' })
  const alts = [["5'0\"", 152.4], ["5'4\"", 162.6], ["5'7\"", 170.2], ["5'10\"", 177.8], ["6'0\"", 182.9], ["6'2\"", 188]]
  const base = 470
  const cw = (W - 2 * M - 50) / 6
  let s = T.tx(M, 184, 'Estaturas en pies y pulgadas', { size: 20, weight: 700 })
  alts.forEach(([p, cm], i) => {
    const x = M + i * (cw + 10)
    const h = (cm - 120) * 3.2
    s += rect(x + cw / 2 - 26, base - h, 52, h, { rx: 26, fill: i === 2 ? T.accent : '#A5B4FC' })
    s += circle(x + cw / 2, base - h - 24, 22, { fill: i === 2 ? T.accent : '#A5B4FC' })
    s += T.tx(x + cw / 2, base + 30, p, { size: 20, weight: 700, anchor: 'middle' })
    s += T.tx(x + cw / 2, base + 54, `${es(cm / 100, 2)} m`, { size: 16, anchor: 'middle', fill: T.muted })
  })
  const ty = base + 96
  const datos = [['1 pie', '30,48 cm'], ['1 pie²', '0,0929 m²'], ['35.000 pies', '10.668 m (avión)']]
  const cw2 = (W - 2 * M - 24) / 3
  datos.forEach(([a, b], i) => {
    const x = M + i * (cw2 + 12)
    s += rect(x, ty, cw2, 84, { rx: 14, fill: T.soft })
    s += T.tx(x + cw2 / 2, ty + 34, a, { size: 18, anchor: 'middle', fill: T.muted })
    s += T.tx(x + cw2 / 2, ty + 66, b, { size: 21, weight: 700, anchor: 'middle' })
  })
  return T.lienzo({ alto: ty + 84 + 80, slug: 'pies-a-metros', titulo: 'Pies a metros: estaturas, superficies y altitud', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 153 Litros a galones (papel, cubetas)
function galones() {
  const T = tema('papel', { accent: '#0E7490', soft: '#CFFAFE' })
  const cubeta = (x, y, w, h, c, t1, t2) => `<path d="M${x},${y} h${w} l-12,${h} h-${w - 24} Z" fill="${c}" stroke="${T.ink}" stroke-width="3"/><path d="M${x + 10},${y} q${w / 2 - 10},-50 ${w - 20},0" fill="none" stroke="${T.ink}" stroke-width="3"/>` + T.tx(x + w / 2, y + h + 34, t1, { size: 20, weight: 700, anchor: 'middle', family: T.titulo }) + T.tx(x + w / 2, y + h + 58, t2, { size: 16, anchor: 'middle', fill: T.muted })
  let s = cubeta(M + 40, 240, 150, 150, '#BAE6FD', 'Galón de EE. UU.', '3,785 litros')
  s += cubeta(M + 290, 220, 170, 170, '#7DD3FC', 'Galón imperial', '4,546 litros')
  s += cubeta(M + 560, 200, 180, 190, '#38BDF8', 'Cubeta de 19 L', '≈ 5 galones de EE. UU.')
  const ty = 520
  s += T.tx(M, ty, 'Equivalencias útiles', { size: 20, weight: 700, family: T.titulo })
  const eq = [['1 litro', '0,264 galones (EE. UU.)'], ['20 litros', '5,28 galones'], ['100 litros', '26,42 galones'], ['1 cuarto de galón', '0,946 litros']]
  eq.forEach(([a, b], i) => {
    const y = ty + 22 + i * 44
    s += `<line x1="${M}" y1="${y + 30}" x2="${W - M}" y2="${y + 30}" stroke="${T.line}" stroke-width="1.5"/>`
    s += T.tx(M, y + 20, a, { size: 19, weight: 700 })
    s += T.tx(W - M, y + 20, b, { size: 19, anchor: 'end', fill: T.accent })
  })
  const n = T.nota(ty + 22 + 4 * 44 + 16, 'México y casi toda América usan el galón estadounidense; el imperial aparece en Reino Unido y en recetas británicas antiguas.')
  return T.lienzo({ alto: Math.round(ty + 22 + 4 * 44 + 16 + n.h + 64), slug: 'litros-a-galones', titulo: 'Cuántos litros tiene un galón', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 154 Validar CURP (terminal)
function validarCurp() {
  const T = tema('terminal', { accent: '#F87171' })
  let s = T.tx(M, 182, '$ validar GOMJ900514HJCMRN07', { size: 22, fill: '#34D399' })
  const checks = [['18 caracteres', true], ['4 letras + 6 dígitos de fecha', true], ['Fecha real: 14/05/1990', true], ['Sexo H o M', true], ['Clave de estado JC (Jalisco)', true], ['Diferenciador 0: nacido antes de 2000', true], ['Dígito verificador: esperado 1, escrito 7', false]]
  checks.forEach(([t, ok], i) => {
    const y = 214 + i * 50
    s += rect(M, y, W - 2 * M, 42, { rx: 8, fill: ok ? T.soft : '#3B1218' })
    s += T.tx(M + 16, y + 28, ok ? '[OK]' : '[ERROR]', { size: 17, weight: 700, fill: ok ? '#34D399' : T.accent })
    s += T.tx(M + 120, y + 28, t, { size: 18, fill: ok ? T.ink : '#FECACA' })
  })
  const ry = 214 + 7 * 50 + 20
  s += T.tx(M, ry, '# conclusión: hay un error al escribir el último dígito', { size: 17, fill: T.muted })
  s += T.tx(M, ry + 32, '# CURP correcta: GOMJ900514HJCMRN01', { size: 17, fill: '#34D399' })
  const n = T.nota(ry + 70, '// una estructura válida no garantiza que la CURP esté registrada: eso solo lo confirma RENAPO en gob.mx/curp.')
  return T.lienzo({ alto: Math.round(ry + 70 + n.h + 60), slug: 'validar-curp', titulo: 'Qué revisa un validador de CURP', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 155 Dividir la cuenta (cuaderno)
function dividirCuenta() {
  const T = tema('cuaderno', { accent: '#B45309' })
  let s = T.tx(M, 188, 'Cuenta de $1,200 + 10 % de propina = $1,320, entre 4', { size: 21, family: T.titulo })
  const cw = (W - 2 * M - 16) / 2
  s += rect(M, 214, cw, 280, { rx: 16, fill: '#FFFFFF', stroke: '#93C5FD', sw: 2 })
  s += T.tx(M + 20, 250, 'Partes iguales', { size: 21, weight: 700, fill: T.accent })
  ;['Ana', 'Luis', 'Sara', 'Pablo'].forEach((n, i) => { s += T.tx(M + 20, 296 + i * 40, n, { size: 19, family: T.titulo }) + T.tx(M + cw - 20, 296 + i * 40, '$330', { size: 20, weight: 700, anchor: 'end' }) })
  s += T.tx(M + 20, 474, 'Rápido y sin discusión', { size: 15, fill: T.muted })
  const x2 = M + cw + 16
  s += rect(x2, 214, cw, 280, { rx: 16, fill: '#FFFFFF', stroke: '#93C5FD', sw: 2 })
  s += T.tx(x2 + 20, 250, 'Cada quien lo suyo', { size: 21, weight: 700, fill: T.accent })
  const cada = [['Ana', 400], ['Luis', 250], ['Sara', 350], ['Pablo', 200]]
  cada.forEach(([n, v], i) => { s += T.tx(x2 + 20, 296 + i * 40, `${n} ($${v})`, { size: 19, family: T.titulo }) + T.tx(x2 + cw - 20, 296 + i * 40, `$${(v * 1.1).toFixed(0)}`, { size: 20, weight: 700, anchor: 'end' }) })
  s += T.tx(x2 + 20, 474, 'Cada consumo + su 10 % de propina', { size: 15, fill: T.muted })
  const n = T.nota(530, 'Si alguien no toma de una botella compartida, réstala de su parte y repártela solo entre quienes bebieron.')
  return T.lienzo({ alto: Math.round(530 + n.h + 56), slug: 'dividir-cuenta', titulo: 'Dos formas justas de dividir la cuenta', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 156 Hora militar (oscuro, esfera de 24 h)
function horaMilitar() {
  const T = tema('oscuro', { accent: '#FBBF24', bg: '#0C1222', soft: '#172036', line: '#263352' })
  const cx = 230
  const cy = 400
  let s = circle(cx, cy, 190, { fill: T.soft, stroke: T.line, sw: 3 })
  for (let h = 0; h < 24; h++) {
    const a = (h / 24) * 2 * Math.PI - Math.PI / 2
    const r1 = 160
    const tarde = h >= 12
    s += T.tx(cx + r1 * Math.cos(a), cy + r1 * Math.sin(a) + 7, String(h).padStart(2, '0'), { size: 17, weight: 700, anchor: 'middle', fill: tarde ? T.accent : T.ink, family: 'Consolas, monospace' })
    const r2 = 118
    if (h % 2 === 0) s += T.tx(cx + r2 * Math.cos(a), cy + r2 * Math.sin(a) + 5, `${h % 12 === 0 ? 12 : h % 12}${tarde ? 'p' : 'a'}`, { size: 12, anchor: 'middle', fill: T.muted })
  }
  s += T.tx(cx, cy + 6, '24 h', { size: 30, weight: 700, anchor: 'middle' })
  const tx = 460
  const filas = [['00:00', '12:00 a. m.', 'medianoche'], ['08:00', '8:00 a. m.', ''], ['12:00', '12:00 p. m.', 'mediodía'], ['15:00', '3:00 p. m.', ''], ['20:00', '8:00 p. m.', ''], ['23:59', '11:59 p. m.', '']]
  filas.forEach(([a, b, c], i) => {
    const y = 210 + i * 62
    s += rect(tx, y, W - M - tx, 52, { rx: 10, fill: T.soft })
    s += T.tx(tx + 14, y + 34, a, { size: 22, weight: 700, fill: T.accent, family: 'Consolas, monospace' })
    s += T.tx(tx + 112, y + 24, b, { size: 16 })
    if (c) s += T.tx(tx + 112, y + 44, c, { size: 13, fill: T.muted })
  })
  const n = T.nota(cy + 220, 'De 13:00 a 23:59, resta 12 y añade p. m. En la jerga militar se escribe sin dos puntos: 0800 se lee «cero ocho cero cero».')
  return T.lienzo({ alto: Math.round(cy + 220 + n.h + 60), slug: 'hora-militar', titulo: 'La hora militar y su equivalencia en 12 horas', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 157 Promedio (pizarra)
function promedio() {
  const T = tema('pizarra')
  let s = T.tx(M, 192, 'Notas: 8 · 6 · 9 · 6 · 10 · 7', { size: 30, family: T.titulo })
  const medidas = [['Media', '(8+6+9+6+10+7) ÷ 6', '7,67', 'el promedio de siempre'], ['Mediana', 'ordenadas: 6 6 7 8 9 10 → (7+8) ÷ 2', '7,5', 'el valor del centro'], ['Moda', 'el que más se repite', '6', 'aparece dos veces']]
  medidas.forEach(([a, b, c, d], i) => {
    const y = 226 + i * 112
    s += rect(M, y, W - 2 * M, 100, { rx: 14, fill: T.soft, stroke: T.line, sw: 2 })
    s += T.tx(M + 20, y + 38, a, { size: 24, weight: 700, family: T.titulo, fill: T.accent })
    s += T.tx(M + 20, y + 72, b, { size: 17 })
    s += T.tx(W - M - 20, y + 54, c, { size: 40, weight: 700, anchor: 'end', family: T.titulo })
    s += T.tx(W - M - 20, y + 84, d, { size: 14, anchor: 'end', fill: T.muted })
  })
  const n = T.nota(226 + 3 * 112 + 20, 'Cuando hay un valor extremo, como un 0 por un examen no presentado, la mediana representa mejor el grupo que la media.')
  return T.lienzo({ alto: Math.round(226 + 3 * 112 + 20 + n.h + 60), slug: 'calculadora-promedio', titulo: 'Media, mediana y moda con las mismas notas', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 158 Fracciones (pastel, barras)
function fracciones() {
  const T = tema('pastel', { accent: '#DB2777', soft: '#FCE7F3', bg: '#FFF7FB', ink: '#500724', line: '#FBCFE8' })
  const barra = (y, partes, llenas, color, etq) => {
    const w = (W - 2 * M - 160) / partes
    let o = T.tx(M, y + 34, etq, { size: 22, weight: 700 })
    for (let i = 0; i < partes; i++) o += rect(M + 160 + i * w, y, w - 4, 52, { rx: 6, fill: i < llenas ? color : '#FFFFFF', stroke: T.line, sw: 2 })
    return o
  }
  let s = T.tx(M, 184, '2/3 + 5/6: primero, el mismo denominador', { size: 20, weight: 700 })
  s += barra(206, 3, 2, '#F472B6', '2/3')
  s += barra(270, 6, 4, '#F472B6', '= 4/6')
  s += barra(334, 6, 5, '#A855F7', '+ 5/6')
  s += T.tx(M, 430, '4/6 + 5/6 = 9/6 = 3/2 = 1 ½', { size: 30, weight: 700, fill: T.accent })
  const ry = 480
  const reglas = [['Sumar y restar', 'Igualar denominadores con el MCM y operar los numeradores.'], ['Multiplicar', 'Numerador por numerador y denominador por denominador: 2/3 × 3/4 = 6/12 = 1/2.'], ['Dividir', 'Multiplicar por la fracción invertida: 2/3 ÷ 4/5 = 2/3 × 5/4 = 10/12 = 5/6.']]
  reglas.forEach(([a, b], i) => {
    const y = ry + i * 70
    s += rect(M, y, W - 2 * M, 60, { rx: 12, fill: T.soft })
    s += T.tx(M + 16, y + 26, a, { size: 18, weight: 700, fill: T.accent })
    s += T.tx(M + 16, y + 50, b, { size: 15 })
  })
  return T.lienzo({ alto: ry + 3 * 70 + 70, slug: 'calculadora-fracciones', titulo: 'Cómo sumar, multiplicar y dividir fracciones', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 159 MCD y MCM (plano)
function mcd() {
  const T = tema('plano', { accent: '#FCD34D', font: 'Segoe UI, Arial, sans-serif' })
  let s = T.tx(M, 186, 'Algoritmo de Euclides: MCD(252, 198)', { size: 22, weight: 700, fill: '#FFFFFF' })
  const pasos = [['252 = 198 × 1 + 54'], ['198 = 54 × 3 + 36'], ['54 = 36 × 1 + 18'], ['36 = 18 × 2 + 0']]
  pasos.forEach(([p], i) => {
    const y = 206 + i * 54
    s += rect(M, y, 420, 46, { rx: 8, fill: T.soft, stroke: i === 3 ? T.accent : T.line, sw: 2 })
    s += T.tx(M + 16, y + 31, p, { size: 21, family: 'Consolas, monospace', fill: i === 3 ? T.accent : T.ink })
  })
  s += rect(M + 450, 206, W - M - (M + 450), 208, { rx: 14, fill: '#123A63', stroke: T.accent, sw: 2 })
  s += T.tx((M + 450 + W - M) / 2, 280, 'MCD', { size: 22, anchor: 'middle', fill: T.muted })
  s += T.tx((M + 450 + W - M) / 2, 350, '18', { size: 70, weight: 700, anchor: 'middle', fill: T.accent })
  s += T.tx((M + 450 + W - M) / 2, 392, 'el último resto distinto de 0', { size: 14, anchor: 'middle', fill: T.muted })
  const fy = 460
  s += T.tx(M, fy, 'Por factores primos: 12 y 18', { size: 22, weight: 700, fill: '#FFFFFF' })
  const filas = [['12 = 2² × 3', ''], ['18 = 2 × 3²', ''], ['MCD = 2 × 3 = 6', 'factores comunes con el menor exponente'], ['MCM = 2² × 3² = 36', 'todos los factores con el mayor exponente']]
  filas.forEach(([a, b], i) => {
    const y = fy + 24 + i * 50
    s += T.tx(M, y + 24, a, { size: 22, family: 'Consolas, monospace', fill: i >= 2 ? T.accent : T.ink })
    if (b) s += T.tx(W - M, y + 24, b, { size: 15, anchor: 'end', fill: T.muted })
  })
  return T.lienzo({ alto: fy + 24 + 4 * 50 + 60, slug: 'calculadora-mcd-mcm', titulo: 'Cómo calcular el MCD y el MCM paso a paso', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 160 Pitágoras (banda morada, escalera)
function pitagoras() {
  const T = tema('banda', { accent: '#7C3AED', soft: '#F5F3FF' })
  const x0 = M + 70
  const y0 = 470
  let s = `<line x1="${x0}" y1="${y0}" x2="${x0 + 260}" y2="${y0}" stroke="#6B7280" stroke-width="5"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0 - 290}" stroke="#6B7280" stroke-width="8"/>`
  s += `<line x1="${x0 + 210}" y1="${y0}" x2="${x0}" y2="${y0 - 280}" stroke="${T.accent}" stroke-width="10" stroke-linecap="round"/>`
  for (let k = 1; k < 7; k++) { const t = k / 7; const px = x0 + 210 * (1 - t); const py = y0 - 280 * t; s += `<line x1="${px - 12}" y1="${py - 9}" x2="${px + 12}" y2="${py + 9}" stroke="${T.accent}" stroke-width="4"/>` }
  s += `<path d="M${x0},${y0 - 20} h20 v20" fill="none" stroke="#111827" stroke-width="2"/>`
  s += T.tx(x0 + 105, y0 + 32, 'a = 3 m (pie de la escalera)', { size: 16, anchor: 'middle', weight: 700 })
  s += T.tx(x0 - 14, y0 - 140, 'b = 4 m', { size: 16, anchor: 'end', weight: 700 })
  s += T.tx(x0 + 140, y0 - 160, 'c = 5 m', { size: 18, weight: 700, fill: T.accent })
  const tx = 420
  s += T.tx(tx, 200, 'a² + b² = c²', { size: 36, weight: 700, fill: T.accent })
  s += T.tx(tx, 244, '3² + 4² = 9 + 16 = 25 → c = 5', { size: 18 })
  s += T.tx(tx, 300, 'Ternas pitagóricas', { size: 18, weight: 700 })
  const ternas = ['3 · 4 · 5', '5 · 12 · 13', '8 · 15 · 17', '7 · 24 · 25', '6 · 8 · 10']
  ternas.forEach((t, i) => {
    const y = 316 + i * 44
    s += rect(tx, y, W - M - tx, 36, { rx: 8, fill: T.soft })
    s += T.tx(tx + 14, y + 25, t, { size: 18, weight: 700 })
  })
  const n = T.nota(y0 + 110, 'Solo vale para triángulos rectángulos. Una escalera de 5 m con el pie a 3 m de la pared llega a 4 m de altura.')
  return T.lienzo({ alto: Math.round(y0 + 110 + n.h + 64), slug: 'calculadora-pitagoras', titulo: 'El teorema de Pitágoras con una escalera', cuerpo: s + n.svg })
}

const pieza = (archivo, alt, fn) => ({ archivo, alt, dibujar: fn })

module.exports = [
  pieza('millas-por-hora-a-kmh', 'Señales de límite de velocidad en millas por hora con su equivalencia en km/h y truco de Fibonacci', millas),
  pieza('estaturas-pies-a-metros', 'Estaturas en pies y pulgadas convertidas a metros y otras equivalencias de pies', pies),
  pieza('galon-estadounidense-imperial-litros', 'Litros del galón estadounidense, del galón imperial y de una cubeta de 19 litros', galones),
  pieza('que-revisa-validador-curp', 'Comprobaciones que hace un validador de CURP con un ejemplo de dígito verificador erróneo', validarCurp),
  pieza('formas-dividir-cuenta-restaurante', 'Dividir la cuenta del restaurante a partes iguales o según lo que consumió cada persona', dividirCuenta),
  pieza('reloj-24-horas-hora-militar', 'Reloj de 24 horas y tabla de equivalencias entre hora militar y formato a. m. y p. m.', horaMilitar),
  pieza('media-mediana-moda-ejemplo', 'Cálculo de media, mediana y moda con un mismo conjunto de notas', promedio),
  pieza('operaciones-con-fracciones', 'Suma de fracciones con barras y reglas para multiplicar y dividir fracciones', fracciones),
  pieza('mcd-mcm-euclides-factores', 'Cálculo del MCD con el algoritmo de Euclides y del MCD y MCM por factores primos', mcd),
  pieza('teorema-pitagoras-escalera', 'Teorema de Pitágoras explicado con una escalera de 5 metros y ternas pitagóricas', pitagoras),
]
