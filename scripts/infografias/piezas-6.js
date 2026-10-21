// Infografías del lote 6 (herramientas 51 a 60).
const { rect, circle } = require('../illustrations/kit')
const { tema, W, M, es } = require('./piezas-4').temas

// ─────────────────────────────────────────────────────────── 51 cm a pulgadas (pastel, regla doble)
function pulgadas() {
  const T = tema('pastel', { accent: '#7E22CE', soft: '#F3E8FF' })
  const x0 = M
  const escala = 26 // px por cm
  const y = 196
  let s = rect(x0, y, 27 * escala + 10, 116, { rx: 10, fill: '#FFFFFF', stroke: T.line, sw: 2 })
  for (let c = 0; c <= 27; c++) {
    const x = x0 + 5 + c * escala
    s += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + (c % 5 === 0 ? 30 : 18)}" stroke="${T.ink}" stroke-width="2"/>`
    if (c % 5 === 0) s += T.tx(x, y + 50, String(c), { size: 15, anchor: 'middle' })
  }
  for (let p = 0; p <= 10; p++) {
    const x = x0 + 5 + p * 2.54 * escala
    s += `<line x1="${x}" y1="${y + 116}" x2="${x}" y2="${y + 116 - 30}" stroke="${T.accent}" stroke-width="3"/>`
    s += T.tx(x, y + 78, String(p), { size: 15, anchor: 'middle', fill: T.accent, weight: 700 })
  }
  s += T.tx(x0 + 27 * escala + 26, y + 34, 'cm', { size: 16, fill: T.muted }) + T.tx(x0 + 27 * escala + 26, y + 100, 'in', { size: 16, fill: T.accent, weight: 700 })
  s += rect(M, y + 140, W - 2 * M, 62, { rx: 14, fill: T.soft })
  s += T.tx(W / 2, y + 180, '1 pulgada = 2,54 cm exactos', { size: 24, weight: 700, anchor: 'middle', fill: T.accent })
  const ty = y + 250
  s += T.tx(M, ty, 'Pantallas (diagonal)', { size: 20, weight: 700 })
  const tv = [['32"', '81 cm'], ['43"', '109 cm'], ['55"', '140 cm'], ['65"', '165 cm']]
  const cw = (W - 2 * M - 36) / 4
  tv.forEach(([a, b], i) => {
    const x = M + i * (cw + 12)
    const h = 40 + i * 14
    s += rect(x + (cw - h * 1.6) / 2, ty + 70 - h / 2, h * 1.6, h, { rx: 6, fill: T.ink })
    s += T.tx(x + cw / 2, ty + 132, a, { size: 22, weight: 700, anchor: 'middle', fill: T.accent })
    s += T.tx(x + cw / 2, ty + 156, b, { size: 17, anchor: 'middle' })
  })
  const hy = ty + 200
  s += T.tx(M, hy, 'Estatura en pies y pulgadas', { size: 20, weight: 700 })
  const est = [["5'5\"", '165,1 cm'], ["5'6\"", '167,6 cm'], ["5'10\"", '177,8 cm'], ["6'0\"", '182,9 cm']]
  est.forEach(([a, b], i) => {
    const x = M + i * (cw + 12)
    s += rect(x, hy + 16, cw, 70, { rx: 12, fill: T.soft })
    s += T.tx(x + cw / 2, hy + 44, a, { size: 20, weight: 700, anchor: 'middle', fill: T.accent })
    s += T.tx(x + cw / 2, hy + 72, b, { size: 17, anchor: 'middle' })
  })
  return T.lienzo({ alto: hy + 86 + 80, slug: 'cm-a-pulgadas', titulo: 'Centímetros y pulgadas, uno al lado del otro', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 52 Arroba a kilos (papel, balanza)
function arroba() {
  const T = tema('papel', { accent: '#92400E' })
  const cx = W / 2
  let s = `<line x1="${cx}" y1="190" x2="${cx}" y2="330" stroke="${T.ink}" stroke-width="6"/><path d="M${cx - 60},340 h120 l-20,-14 h-80 Z" fill="${T.ink}"/>`
  s += `<line x1="${cx - 230}" y1="200" x2="${cx + 230}" y2="200" stroke="${T.ink}" stroke-width="6" stroke-linecap="round"/>` + circle(cx, 200, 10, { fill: T.accent })
  const plato = (x, t1, t2) => `<line x1="${x - 60}" y1="280" x2="${x}" y2="200" stroke="${T.muted}" stroke-width="2"/><line x1="${x + 60}" y1="280" x2="${x}" y2="200" stroke="${T.muted}" stroke-width="2"/><path d="M${x - 80},280 q80,36 160,0 Z" fill="${T.soft}" stroke="${T.accent}" stroke-width="3"/>` + T.tx(x, 274, t1, { size: 22, weight: 700, anchor: 'middle', family: T.titulo }) + T.tx(x, 330, t2, { size: 17, anchor: 'middle', fill: T.muted })
  s += plato(cx - 230, '1 arroba', 'castellana') + plato(cx + 230, '11,502 kg', '= 25 libras antiguas')
  const vy = 400
  s += T.tx(M, vy, 'Una palabra, tres pesos', { size: 24, weight: 700, family: T.titulo })
  const vars = [['11,502 kg', 'Arroba castellana', 'España y uso tradicional en varios países'], ['12,5 kg', 'Arroba de 25 libras', 'Común en el comercio agrícola y ganadero, como en Colombia'], ['15 kg', 'Arroba ganadera', 'La usada en Brasil para el peso del ganado']]
  vars.forEach(([kg, n, d], i) => {
    const y = vy + 24 + i * 86
    s += rect(M, y, W - 2 * M, 74, { rx: 14, fill: i === 0 ? T.soft : '#FFFDF8', stroke: T.line, sw: 2 })
    s += T.tx(M + 20, y + 46, kg, { size: 28, weight: 700, fill: T.accent, family: T.titulo })
    s += T.tx(M + 200, y + 32, n, { size: 19, weight: 700 })
    s += T.tx(M + 200, y + 56, d, { size: 16, fill: T.muted })
  })
  const ey = vy + 24 + 3 * 86 + 20
  s += T.tx(M, ey, '10 arrobas son 115 kg, 125 kg o 150 kg según cuál uses.', { size: 20, weight: 700 })
  const n = T.nota(ey + 30, 'Antes de comprar o vender por arrobas, pregunta siempre a qué arroba se refiere el precio.')
  return T.lienzo({ alto: Math.round(ey + 30 + n.h + 64), slug: 'arroba-a-kilos', titulo: 'Cuántos kilos tiene una arroba', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 53 Tiempo de lectura (oscuro, barras)
function lectura() {
  const T = tema('oscuro', { accent: '#2DD4BF' })
  const textos = [['Post de redes', 150], ['Artículo de blog', 1000], ['Ensayo', 3000], ['Capítulo de libro', 5000]]
  const vel = [['Lenta', 150, '#5EEAD4'], ['Media', 200, '#2DD4BF'], ['Rápida', 260, '#0D9488']]
  let s = ''
  vel.forEach(([n, ppm, col], i) => { s += rect(M + i * 190, 172, 18, 18, { rx: 4, fill: col }) + T.tx(M + i * 190 + 26, 187, `${n} · ${ppm} ppm`, { size: 16, fill: T.muted }) })
  const maxMin = 5000 / 150
  const ancho = W - 2 * M - 230
  textos.forEach(([t, p], i) => {
    const y = 216 + i * 128
    s += T.tx(M, y + 20, t, { size: 20, weight: 700 })
    s += T.tx(M, y + 44, `${p.toLocaleString('es-ES', { useGrouping: 'always' })} palabras`, { size: 16, fill: T.muted })
    vel.forEach(([, ppm, col], k) => {
      const min = p / ppm
      const w = Math.max(6, (min / maxMin) * ancho)
      const yy = y + 4 + k * 30
      s += rect(M + 200, yy, w, 22, { rx: 6, fill: col })
      const etq = min < 1 ? `${Math.round(min * 60)} s` : `${es(min, min < 10 ? 1 : 0)} min`
      s += T.tx(M + 210 + w, yy + 17, etq, { size: 15 })
    })
  })
  const n = T.nota(216 + 4 * 128, 'Leer en voz alta es más lento: unas 130 palabras por minuto. Para una presentación de 10 minutos prepara unas 1.300 palabras.')
  return T.lienzo({ alto: Math.round(216 + 4 * 128 + n.h + 60), slug: 'calculadora-tiempo-lectura', titulo: 'Cuánto se tarda en leer según la extensión del texto', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 54 Indemnización Argentina (banda celeste)
function indemnizacion() {
  const T = tema('banda', { accent: '#0369A1', soft: '#F0F9FF' })
  let s = T.tx(M, 180, 'Mejor sueldo $1.000.000 · ingreso 1/3/2019 · despido sin causa 10/10/2026', { size: 17, fill: T.muted })
  const partes = [
    ['Indemnización por antigüedad', '7 años y 7 meses → 8 años (la fracción supera 3 meses)', '$8.000.000', 8],
    ['Preaviso omitido', '2 sueldos por tener 5 años o más', '$2.000.000', 2],
    ['Integración del mes', '21 días que faltaban para fin de octubre', '$677.419', 0.677],
  ]
  const total = 10.677
  const ancho = W - 2 * M
  let x = M
  const cols = [T.accent, '#38BDF8', '#BAE6FD']
  partes.forEach(([, , , v], i) => { const w = (v / total) * ancho; s += rect(x, 206, w, 50, { rx: i === 0 ? 10 : 0, fill: cols[i] }); x += w })
  partes.forEach(([t, d, v], i) => {
    const y = 290 + i * 92
    s += rect(M, y, 14, 64, { rx: 4, fill: cols[i] })
    s += T.tx(M + 30, y + 24, t, { size: 20, weight: 700 })
    s += T.tx(M + 30, y + 52, d, { size: 16, fill: T.muted })
    s += T.tx(W - M, y + 38, v, { size: 24, weight: 700, anchor: 'end', fill: T.accent })
  })
  const ty = 290 + 3 * 92 + 6
  s += rect(M, ty, W - 2 * M, 70, { rx: 14, fill: T.accent })
  s += T.tx(M + 22, ty + 44, 'Total estimado', { size: 21, fill: '#E0F2FE' })
  s += T.tx(W - M - 22, ty + 46, '$10.677.419', { size: 30, weight: 700, anchor: 'end', fill: '#FFFFFF' })
  const n = T.nota(ty + 110, 'Art. 245, 231 y 233 de la Ley de Contrato de Trabajo. A esto se suma la liquidación final: días trabajados, vacaciones y SAC proporcionales. El tope por convenio puede reducir la indemnización en sueldos altos.')
  return T.lienzo({ alto: Math.round(ty + 110 + n.h + 64), slug: 'calcular-indemnizacion-despido', titulo: 'De qué se compone la indemnización por despido en Argentina', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 55 SAC Argentina (cuaderno)
function sac() {
  const T = tema('cuaderno', { accent: '#0284C7' })
  let s = T.tx(M, 186, 'SAC = mejor sueldo del semestre ÷ 2', { size: 28, family: T.titulo })
  const meses = ['jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  const x0 = M
  const mw = (W - 2 * M) / 6
  meses.forEach((m, i) => {
    const trab = i >= 2
    s += rect(x0 + i * mw + 3, 220, mw - 6, 64, { rx: 10, fill: trab ? '#BAE6FD' : '#FFFFFF', stroke: '#93C5FD', sw: 2 })
    s += T.tx(x0 + i * mw + mw / 2, 260, m, { size: 22, anchor: 'middle', family: T.titulo, fill: trab ? T.ink : T.muted })
  })
  s += T.tx(x0 + 2 * mw + 4, 312, '↑ ingreso el 1 de septiembre: 122 de 184 días', { size: 18, fill: T.accent, weight: 700 })
  const pasos = [['SAC completo', '$1.200.000 ÷ 2', '$600.000'], ['Proporción trabajada', '122 ÷ 184', '0,663'], ['SAC proporcional', '$600.000 × 0,663', '$397.826']]
  pasos.forEach(([a, op, r], i) => {
    const y = 350 + i * 78
    s += rect(M, y, W - 2 * M, 66, { rx: 12, fill: i === 2 ? T.soft : '#FFFFFF', stroke: '#93C5FD', sw: 2 })
    s += T.tx(M + 18, y + 28, a, { size: 16, fill: T.muted })
    s += T.tx(M + 18, y + 54, op, { size: 20 })
    s += T.tx(W - M - 18, y + 44, r, { size: 26, weight: 700, anchor: 'end', fill: i === 2 ? T.accent : T.ink, family: T.titulo })
  })
  const fy = 350 + 3 * 78 + 20
  const cw = (W - 2 * M - 16) / 2
  s += rect(M, fy, cw, 76, { rx: 14, fill: '#FFFFFF', stroke: T.accent, sw: 2 }) + T.tx(M + cw / 2, fy + 32, '1.ª cuota', { size: 16, anchor: 'middle', fill: T.muted }) + T.tx(M + cw / 2, fy + 60, 'hasta el 30 de junio', { size: 20, anchor: 'middle', weight: 700 })
  s += rect(M + cw + 16, fy, cw, 76, { rx: 14, fill: '#FFFFFF', stroke: T.accent, sw: 2 }) + T.tx(M + cw + 16 + cw / 2, fy + 32, '2.ª cuota', { size: 16, anchor: 'middle', fill: T.muted }) + T.tx(M + cw + 16 + cw / 2, fy + 60, 'hasta el 18 de diciembre', { size: 20, anchor: 'middle', weight: 700 })
  const n = T.nota(fy + 116, 'La ley permite pagarla hasta 4 días hábiles después de esas fechas. Se calcula sobre el sueldo bruto y tiene los mismos descuentos que el sueldo.')
  return T.lienzo({ alto: Math.round(fy + 116 + n.h + 60), slug: 'calcular-sac-argentina', titulo: 'Cómo se calcula el aguinaldo proporcional en Argentina', subtitulo: 'Ejemplo: mejor sueldo de $1.200.000, segundo semestre', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 56 Alquiler Argentina (pizarra)
function alquiler() {
  const T = tema('pizarra')
  let s = T.tx(M, 190, 'alquiler actual × coeficiente = alquiler nuevo', { size: 26, family: T.titulo, fill: T.accent })
  s += T.tx(M, 250, '$500.000 × 1,2853 = $642.650', { size: 32, family: T.titulo })
  s += `<path d="M${M},266 q300,16 600,0" fill="none" stroke="${T.accent}" stroke-width="3"/>`
  s += T.tx(M, 308, 'Un coeficiente de 1,2853 es una suba del 28,53 %.', { size: 19, fill: T.muted })
  const indices = [['ICL', 'Índice para Contratos de Locación, del BCRA', 'Combina inflación y salarios'], ['IPC', 'Índice de Precios al Consumidor, del INDEC', 'Sigue la inflación mensual'], ['CVS', 'Coeficiente de Variación Salarial, del INDEC', 'Sigue los salarios'], ['Pactado', 'Porcentaje fijo o índice que acuerden las partes', 'Libre desde diciembre de 2023']]
  indices.forEach(([n, d, e], i) => {
    const y = 350 + i * 88
    s += rect(M, y, W - 2 * M, 76, { rx: 12, fill: T.soft, stroke: T.line, sw: 2 })
    s += T.tx(M + 20, y + 46, n, { size: 26, weight: 700, fill: T.accent, family: T.titulo })
    s += T.tx(M + 160, y + 32, d, { size: 18 })
    s += T.tx(M + 160, y + 58, e, { size: 16, fill: T.muted })
  })
  const n = T.nota(350 + 4 * 88 + 14, 'Revisá tu contrato: dice qué índice se usa y cada cuánto se actualiza. El coeficiente entre dos fechas lo publican el BCRA y el INDEC.')
  return T.lienzo({ alto: Math.round(350 + 4 * 88 + 14 + n.h + 60), slug: 'calculadora-alquiler-argentina', titulo: 'Cómo se actualiza un alquiler con un índice', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 57 Plazo fijo (banda verde)
function plazoFijo() {
  const T = tema('banda', { accent: '#15803D', soft: '#F0FDF4' })
  let s = rect(M, 180, W - 2 * M, 96, { rx: 16, fill: T.soft })
  s += T.tx(W / 2, 222, 'interés = capital × TNA × días ÷ 365', { size: 25, weight: 700, anchor: 'middle', fill: T.accent })
  s += T.tx(W / 2, 256, '$1.000.000 × 35 % × 30 ÷ 365 = $28.767', { size: 21, anchor: 'middle' })
  const cw = (W - 2 * M - 24) / 3
  const datos = [['Capital', '$1.000.000'], ['Interés a 30 días', '$28.767'], ['Cobras al vencer', '$1.028.767']]
  datos.forEach(([a, b], i) => {
    const x = M + i * (cw + 12)
    s += rect(x, 300, cw, 96, { rx: 14, fill: i === 2 ? T.accent : '#FFFFFF', stroke: T.line, sw: 2 })
    s += T.tx(x + cw / 2, 334, a, { size: 16, anchor: 'middle', fill: i === 2 ? '#DCFCE7' : T.muted })
    s += T.tx(x + cw / 2, 372, b, { size: 24, weight: 700, anchor: 'middle', fill: i === 2 ? '#FFFFFF' : T.ink })
  })
  const ty = 440
  s += T.tx(M, ty, 'TNA o TEA: la misma tasa, dos formas de expresarla', { size: 21, weight: 700 })
  const filas = [['TNA', '35 %', 'Lo que anuncia el banco. No incluye reinvertir los intereses.'], ['TEA renovando cada 30 días', '41,2 %', 'Si reinviertes capital e intereses todo el año.']]
  filas.forEach(([a, b, c], i) => {
    const y = ty + 22 + i * 86
    s += rect(M, y, W - 2 * M, 74, { rx: 12, fill: T.soft })
    s += T.tx(M + 18, y + 32, a, { size: 18, weight: 700 })
    s += T.tx(M + 18, y + 58, c, { size: 16, fill: T.muted })
    s += T.tx(W - M - 18, y + 46, b, { size: 30, weight: 700, anchor: 'end', fill: T.accent })
  })
  const n = T.nota(ty + 22 + 2 * 86 + 20, 'Tasa de ejemplo. Compara siempre la TNA del día con la inflación esperada: si la inflación es mayor, el plazo fijo pierde poder de compra.')
  return T.lienzo({ alto: Math.round(ty + 22 + 2 * 86 + 20 + n.h + 64), slug: 'calculadora-plazo-fijo', titulo: 'Cuánto rinde un plazo fijo a 30 días', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 58 Interés compuesto (oscuro, curva)
function interesCompuesto() {
  const T = tema('oscuro', { accent: '#FBBF24' })
  const gx = M + 70
  const gy = 196
  const gw = W - 2 * M - 90
  const gh = 330
  const X = (a) => gx + (a / 30) * gw
  const Y = (v) => gy + gh - (v / 180000) * gh
  let s = ''
  ;[0, 50000, 100000, 150000].forEach((v) => {
    s += `<line x1="${gx}" y1="${Y(v)}" x2="${gx + gw}" y2="${Y(v)}" stroke="${T.line}" stroke-width="1.5"/>`
    s += T.tx(gx - 10, Y(v) + 5, `$${(v / 1000).toLocaleString('es-ES')} mil`, { size: 14, anchor: 'end', fill: T.muted })
  })
  ;[0, 10, 20, 30].forEach((a) => { s += T.tx(X(a), gy + gh + 24, `${a} años`, { size: 14, anchor: 'middle', fill: T.muted }) })
  let comp = ''
  let simp = ''
  for (let a = 0; a <= 30; a++) {
    comp += `${a ? 'L' : 'M'}${X(a)},${Y(10000 * 1.1 ** a)} `
    simp += `${a ? 'L' : 'M'}${X(a)},${Y(10000 * (1 + 0.1 * a))} `
  }
  s += `<path d="${simp}" fill="none" stroke="#60A5FA" stroke-width="4"/>`
  s += `<path d="${comp}" fill="none" stroke="${T.accent}" stroke-width="5"/>`
  s += circle(X(30), Y(174494), 8, { fill: T.accent }) + T.tx(X(30) - 12, Y(174494) - 14, '$174.494', { size: 20, weight: 700, anchor: 'end', fill: T.accent })
  s += circle(X(30), Y(40000), 8, { fill: '#60A5FA' }) + T.tx(X(30) - 12, Y(40000) - 14, '$40.000', { size: 20, weight: 700, anchor: 'end', fill: '#60A5FA' })
  s += T.tx(gx + 10, gy + 20, 'Interés compuesto', { size: 17, weight: 700, fill: T.accent }) + T.tx(gx + 10, gy + 44, 'Interés simple', { size: 17, weight: 700, fill: '#60A5FA' })
  const ry = gy + gh + 64
  s += rect(M, ry, W - 2 * M, 96, { rx: 16, fill: T.soft })
  s += T.tx(M + 22, ry + 38, 'Regla del 72', { size: 20, weight: 700, fill: T.accent })
  s += T.tx(M + 22, ry + 70, '72 ÷ 10 % ≈ 7,2 años para duplicar tu dinero', { size: 20 })
  return T.lienzo({ alto: ry + 96 + 80, slug: 'calculadora-interes-compuesto', titulo: 'Interés compuesto frente a interés simple en 30 años', subtitulo: '$10.000 al 10 % anual, sin aportes adicionales', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 59 Sueldo neto Argentina (papel)
function sueldoNeto() {
  const T = tema('papel', { accent: '#1D4ED8', soft: '#DBEAFE', line: '#E3DCCB' })
  const total = 1000000
  const partes = [['Neto', 830000, T.accent], ['Jubilación 11 %', 110000, '#F59E0B'], ['Obra social 3 %', 30000, '#10B981'], ['PAMI 3 %', 30000, '#EC4899']]
  let x = M
  const ancho = W - 2 * M
  let s = T.tx(M, 184, 'Sueldo bruto de $1.000.000', { size: 24, weight: 700, family: T.titulo })
  partes.forEach(([, v, c], i) => { const w = (v / total) * ancho; s += rect(x, 206, w, 64, { rx: i === 0 ? 10 : 0, fill: c }); x += w })
  s += T.tx(M + 20, 246, '83 %', { size: 26, weight: 700, fill: '#FFFFFF' })
  partes.forEach(([n, v, c], i) => {
    const y = 316 + i * 62
    s += circle(M + 10, y - 7, 9, { fill: c })
    s += T.tx(M + 30, y, n, { size: 21, family: T.titulo })
    s += T.tx(W - M, y, `${i ? '− ' : ''}$${v.toLocaleString('es-ES', { useGrouping: 'always' })}`, { size: 24, weight: 700, anchor: 'end', fill: i ? T.ink : T.accent })
    s += `<line x1="${M}" y1="${y + 20}" x2="${W - M}" y2="${y + 20}" stroke="${T.line}" stroke-width="1.5"/>`
  })
  const n = T.nota(316 + 4 * 62 + 10, 'Son los aportes del trabajador en relación de dependencia (17 % en total). Si tu sueldo supera el mínimo no imponible, además se retiene Impuesto a las Ganancias. Algunos convenios suman cuota sindical.')
  return T.lienzo({ alto: Math.round(316 + 4 * 62 + 10 + n.h + 64), slug: 'calculadora-sueldo-neto-argentina', titulo: 'Del sueldo bruto al neto en Argentina', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 60 Área (pizarra, figuras a tiza)
function area() {
  const T = tema('pizarra', { accent: '#FDE68A' })
  const tiza = '#F1F5EE'
  let s = ''
  // Cuadrado
  s += `<rect x="${M + 20}" y="200" width="140" height="140" fill="none" stroke="${tiza}" stroke-width="4"/>`
  s += T.tx(M + 90, 276, 'l = 4', { size: 22, anchor: 'middle', family: T.titulo })
  s += T.tx(M + 90, 380, 'A = l²', { size: 24, anchor: 'middle', family: T.titulo, fill: T.accent }) + T.tx(M + 90, 412, '= 16', { size: 22, anchor: 'middle', family: T.titulo })
  // Rectángulo
  s += `<rect x="${M + 230}" y="230" width="210" height="110" fill="none" stroke="${tiza}" stroke-width="4"/>`
  s += T.tx(M + 335, 292, '6 × 3', { size: 22, anchor: 'middle', family: T.titulo })
  s += T.tx(M + 335, 380, 'A = b × h', { size: 24, anchor: 'middle', family: T.titulo, fill: T.accent }) + T.tx(M + 335, 412, '= 18', { size: 22, anchor: 'middle', family: T.titulo })
  // Triángulo
  s += `<path d="M${W - M - 200},340 L${W - M - 20},340 L${W - M - 200},200 Z" fill="none" stroke="${tiza}" stroke-width="4"/>`
  s += `<path d="M${W - M - 200},320 h20 v20" fill="none" stroke="${tiza}" stroke-width="2"/>`
  s += T.tx(W - M - 110, 364, 'b = 4', { size: 18, anchor: 'middle', family: T.titulo }) + T.tx(W - M - 214, 276, 'h = 3', { size: 18, anchor: 'end', family: T.titulo })
  s += T.tx(W - M - 110, 400, 'A = b × h ÷ 2', { size: 22, anchor: 'middle', family: T.titulo, fill: T.accent }) + T.tx(W - M - 110, 430, '= 6', { size: 22, anchor: 'middle', family: T.titulo })
  const py = 480
  s += `<line x1="${M}" y1="${py - 10}" x2="${W - M}" y2="${py - 10}" stroke="${T.line}" stroke-width="2" stroke-dasharray="8 8"/>`
  s += T.tx(M, py + 30, 'Pitágoras: a² + b² = c²', { size: 28, family: T.titulo, fill: T.accent })
  s += T.tx(M, py + 74, '3² + 4² = 9 + 16 = 25  →  c = 5', { size: 26, family: T.titulo })
  s += T.tx(M, py + 112, 'El triángulo 3-4-5 sirve para comprobar si una esquina está a escuadra.', { size: 18, fill: T.muted })
  return T.lienzo({ alto: py + 112 + 80, slug: 'calculadora-area', titulo: 'Fórmulas de área del cuadrado, el rectángulo y el triángulo', cuerpo: s })
}

const pieza = (archivo, alt, fn) => ({ archivo, alt, dibujar: fn })

module.exports = [
  pieza('regla-centimetros-pulgadas', 'Regla con centímetros y pulgadas, tamaños de pantalla y estaturas en pies convertidas a centímetros', pulgadas),
  pieza('cuantos-kilos-tiene-una-arroba', 'Equivalencias de la arroba en kilos: castellana de 11,5 kg, de 12,5 kg y de 15 kg', arroba),
  pieza('tiempo-de-lectura-por-palabras', 'Tiempo de lectura de textos de 150 a 5000 palabras a velocidad lenta, media y rápida', lectura),
  pieza('componentes-indemnizacion-argentina', 'Componentes de la indemnización por despido en Argentina: antigüedad, preaviso e integración del mes', indemnizacion),
  pieza('calculo-sac-proporcional-argentina', 'Cálculo del aguinaldo SAC proporcional en Argentina con un ejemplo del segundo semestre', sac),
  pieza('actualizacion-alquiler-icl-ipc', 'Cómo actualizar un alquiler en Argentina con el coeficiente del ICL, IPC o CVS', alquiler),
  pieza('rendimiento-plazo-fijo-30-dias', 'Rendimiento de un plazo fijo de un millón de pesos a 30 días y diferencia entre TNA y TEA', plazoFijo),
  pieza('interes-compuesto-vs-simple', 'Gráfico de interés compuesto frente a interés simple de 10 mil pesos al 10 por ciento en 30 años', interesCompuesto),
  pieza('descuentos-sueldo-bruto-argentina', 'Descuentos del sueldo bruto en Argentina: jubilación 11 por ciento, obra social 3 y PAMI 3', sueldoNeto),
  pieza('formulas-area-figuras-pitagoras', 'Fórmulas de área del cuadrado, rectángulo y triángulo y teorema de Pitágoras en una pizarra', area),
]
