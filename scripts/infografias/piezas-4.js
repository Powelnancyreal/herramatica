// Infografías del lote 4 (herramientas 31 a 40) y temas visuales compartidos con lotes posteriores.
// Cada tema cambia fondo, tipografía y paleta para que las infografías no parezcan salidas de la misma plantilla.
const { C, rect, circle } = require('../illustrations/kit')
const { partir } = require('./piezas').util

const W = 800
const M = 44
const escapar = (t) => String(t).replace(/&(?!#?\w+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const TEMAS = {
  papel: { bg: '#FBF6EC', ink: '#3B2F2A', muted: '#7C6A58', accent: '#B45309', soft: '#F3E3C7', line: '#E7D8BE', font: 'Georgia, serif', titulo: 'Georgia, serif' },
  oscuro: { bg: '#111827', ink: '#F9FAFB', muted: '#9CA3AF', accent: '#A78BFA', soft: '#1F2937', line: '#374151', font: 'Segoe UI, Arial, sans-serif', titulo: 'Segoe UI, Arial, sans-serif' },
  cuaderno: { bg: '#FFFFFF', ink: '#1E3A8A', muted: '#475569', accent: '#DC2626', soft: '#EFF6FF', line: '#DBEAFE', font: 'Segoe UI, Arial, sans-serif', titulo: 'Segoe Print, Comic Sans MS, cursive', cuadricula: true },
  terminal: { bg: '#0B1020', ink: '#E5E7EB', muted: '#94A3B8', accent: '#34D399', soft: '#111A33', line: '#1E2A4A', font: 'Consolas, Courier New, monospace', titulo: 'Consolas, Courier New, monospace' },
  banda: { bg: '#FFFFFF', ink: '#1F2937', muted: '#6B7280', accent: '#0D9488', soft: '#F0FDFA', line: '#E5E7EB', font: 'Trebuchet MS, Arial, sans-serif', titulo: 'Trebuchet MS, Arial, sans-serif', banda: true },
}

function tema(nombre, extra = {}) {
  const t = { ...TEMAS[nombre], ...extra }
  const tx = (x, y, s, { size = 20, fill = t.ink, weight = 400, anchor = 'start', family = t.font } = {}) =>
    `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${escapar(s)}</text>`
  const parrafo = (x, y, s, { size = 19, max = 68, alto = 1.35, ...op } = {}) => {
    const ls = partir(s, max)
    return { svg: ls.map((l, i) => tx(x, y + i * size * alto, l, { size, ...op })).join(''), h: ls.length * size * alto }
  }
  const nota = (y, s) => parrafo(M, y, s, { size: 18, fill: t.muted })

  function lienzo({ alto: base, titulo, subtitulo, slug, cuerpo }) {
    const enBanda = t.banda
    const tit = parrafo(M, enBanda ? 96 : 92, titulo, { size: 34, max: 40, alto: 1.2, weight: 700, family: t.titulo, fill: enBanda ? '#FFFFFF' : t.ink })
    const sub = subtitulo
      ? parrafo(M, (enBanda ? 96 : 92) + tit.h + 8, subtitulo, { size: 20, max: 62, fill: enBanda ? 'rgba(255,255,255,0.85)' : t.muted })
      : { svg: '', h: 0 }
    const finCabecera = (enBanda ? 96 : 92) + tit.h + sub.h
    const dy = Math.round(finCabecera - 150) + (enBanda ? 40 : 20)
    const alto = Math.round(base + dy)
    let fondo = `<rect width="${W}" height="${alto}" fill="${t.bg}"/>`
    if (t.cuadricula) {
      fondo += `<defs><pattern id="g" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="${t.line}" stroke-width="1"/></pattern></defs><rect width="${W}" height="${alto}" fill="url(#g)"/>`
      fondo += `<line x1="${M - 16}" y1="0" x2="${M - 16}" y2="${alto}" stroke="#FCA5A5" stroke-width="2"/>`
    }
    if (enBanda) fondo += `<rect width="${W}" height="${finCabecera + 30}" fill="${t.accent}"/>`
    if (!enBanda && !t.cuadricula) fondo += `<rect x="${M}" y="${alto - 58}" width="${W - 2 * M}" height="1.5" fill="${t.line}"/>`
    const etiqueta = tx(M, 50, 'herramatica.com', { size: 15, weight: 700, fill: enBanda ? 'rgba(255,255,255,0.8)' : t.accent })
    const pie = tx(M, alto - 26, `herramatica.com/${slug}`, { size: 16, weight: 700, fill: t.muted })
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${alto}" width="${W}" height="${alto}">${fondo}${etiqueta}${tit.svg}${sub.svg}<g transform="translate(0,${dy})">${cuerpo}</g>${pie}</svg>`
    return { svg, alto }
  }
  return { ...t, tx, parrafo, nota, lienzo }
}

const mx = (n, d = 2) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })
const es = (n, d = 2) => n.toLocaleString('es-ES', { minimumFractionDigits: d, maximumFractionDigits: d, useGrouping: 'always' })

// ─────────────────────────────────────────────────────────── 31 Hipoteca (papel)
function hipoteca() {
  const T = tema('papel')
  let s = T.tx(M, 180, 'Piso de 200.000 €', { size: 26, weight: 700, family: T.titulo })
  // Barra del precio: 80 % financiado + 20 % entrada, y aparte los gastos
  const x0 = M
  const ancho = W - 2 * M
  const y = 206
  s += rect(x0, y, ancho * 0.8, 70, { rx: 10, fill: '#D6C3A1' })
  s += rect(x0 + ancho * 0.8, y, ancho * 0.2, 70, { rx: 10, fill: T.accent })
  s += T.tx(x0 + ancho * 0.4, y + 32, 'Hipoteca (80 %)', { size: 20, weight: 700, anchor: 'middle' })
  s += T.tx(x0 + ancho * 0.4, y + 58, '160.000 €', { size: 20, anchor: 'middle' })
  s += T.tx(x0 + ancho * 0.9, y + 32, 'Entrada', { size: 18, weight: 700, anchor: 'middle', fill: '#FFF' })
  s += T.tx(x0 + ancho * 0.9, y + 58, '40.000 €', { size: 18, anchor: 'middle', fill: '#FFF' })
  s += rect(x0 + ancho * 0.6, y + 84, ancho * 0.4, 56, { rx: 10, fill: T.soft, stroke: T.accent, sw: 2 })
  s += T.tx(x0 + ancho * 0.8, y + 119, '+ gastos ≈ 10 %: 20.000 €', { size: 18, anchor: 'middle', weight: 700, fill: T.accent })
  s += T.tx(M, y + 120, 'Ahorro necesario', { size: 18, fill: T.muted })
  s += T.tx(M, y + 152, '≈ 60.000 €', { size: 36, weight: 700, family: T.titulo, fill: T.accent })
  const cy = y + 210
  s += `<line x1="${M}" y1="${cy - 30}" x2="${W - M}" y2="${cy - 30}" stroke="${T.line}" stroke-width="2"/>`
  const datos = [['Cuota mensual', '758,74 €', '160.000 € al 3 % fijo a 25 años'], ['Intereses totales', '67.621 €', 'lo que pagas de más en 25 años'], ['Ingresos netos mínimos', '2.168 €/mes', 'para que la cuota no pase del 35 %']]
  datos.forEach(([a, b, c], i) => {
    const yy = cy + i * 84
    s += T.tx(M, yy, a, { size: 19, fill: T.muted })
    s += T.tx(W - M, yy + 4, b, { size: 30, weight: 700, anchor: 'end', family: T.titulo })
    s += T.tx(M, yy + 28, c, { size: 17, fill: T.muted })
  })
  const n = T.nota(cy + 3 * 84 + 10, 'Los gastos de compraventa (impuestos, notaría y registro) dependen de la comunidad autónoma. Los bancos suelen financiar como máximo el 80 % del valor de tasación.')
  return T.lienzo({ alto: Math.round(cy + 3 * 84 + 10 + n.h + 64), slug: 'calcular-hipoteca', titulo: 'Cuánto necesitas ahorrar para comprar una vivienda', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 32 Letra del DNI (cuaderno)
function dni() {
  const T = tema('cuaderno')
  let s = T.tx(M, 184, '12345678 ÷ 23 = 536.768', { size: 28, family: T.titulo })
  s += T.tx(M, 228, 'resto = 14', { size: 30, family: T.titulo, fill: T.accent, weight: 700 })
  s += `<path d="M${M + 170},216 q20,20 60,30" fill="none" stroke="${T.accent}" stroke-width="2.5"/>`
  const letras = 'TRWAGMYFPDXBNJZSQVHLCKE'.split('')
  const cw = 58
  const cols = 12
  const y0 = 290
  letras.forEach((l, i) => {
    const x = M + (i % cols) * cw
    const y = y0 + Math.floor(i / cols) * 92
    const sel = i === 14
    s += rect(x + 2, y, cw - 6, 72, { rx: 8, fill: sel ? T.accent : '#FFFFFF', stroke: sel ? T.accent : '#93C5FD', sw: 2 })
    s += T.tx(x + cw / 2 - 1, y + 24, String(i), { size: 14, anchor: 'middle', fill: sel ? '#FFF' : T.muted })
    s += T.tx(x + cw / 2 - 1, y + 58, l, { size: 28, anchor: 'middle', weight: 700, fill: sel ? '#FFF' : T.ink })
  })
  const ry = y0 + 2 * 92 + 30
  s += rect(M, ry, W - 2 * M, 74, { rx: 14, fill: T.soft, stroke: '#93C5FD', sw: 2 })
  s += T.tx(W / 2, ry + 48, 'DNI 12345678Z', { size: 32, anchor: 'middle', weight: 700, family: T.titulo })
  const n = T.nota(ry + 118, 'NIE: cambia la X por 0, la Y por 1 y la Z por 2 y haz la misma división. No hay I, Ñ, O ni U para evitar confusiones con el 1 y el 0.')
  return T.lienzo({ alto: Math.round(ry + 118 + n.h + 60), slug: 'calcular-letra-dni', titulo: 'Cómo se calcula la letra del DNI', subtitulo: 'El resto de dividir el número entre 23 elige la letra', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 33 Pensión (banda azul)
function pension() {
  const T = tema('banda', { accent: '#1D4ED8', soft: '#EFF6FF' })
  const gx = M + 50
  const gy = 200
  const gw = W - 2 * M - 70
  const gh = 280
  const X = (anios) => gx + ((anios - 10) / 30) * gw
  const Y = (pct) => gy + gh - (pct / 100) * gh
  let s = ''
  ;[0, 25, 50, 75, 100].forEach((p) => {
    s += `<line x1="${gx}" y1="${Y(p)}" x2="${gx + gw}" y2="${Y(p)}" stroke="${T.line}" stroke-width="1.5"/>`
    s += T.tx(gx - 12, Y(p) + 6, `${p} %`, { size: 15, anchor: 'end', fill: T.muted })
  })
  ;[10, 15, 20, 25, 30, 36.5, 40].forEach((a) => { s += T.tx(X(a), gy + gh + 26, a === 36.5 ? '36,5' : String(a), { size: 15, anchor: 'middle', fill: T.muted }) })
  s += T.tx(gx + gw / 2, gy + gh + 52, 'Años cotizados', { size: 16, anchor: 'middle', fill: T.muted })
  s += `<polyline points="${X(10)},${Y(0)} ${X(15)},${Y(0)} ${X(15)},${Y(50)} ${X(25)},${Y(72.8)} ${X(36.5)},${Y(100)} ${X(40)},${Y(100)}" fill="none" stroke="${T.accent}" stroke-width="5" stroke-linejoin="round"/>`
  const punto = (a, p, t, dx = 12, dyy = -14) => circle(X(a), Y(p), 8, { fill: T.accent }) + T.tx(X(a) + dx, Y(p) + dyy, t, { size: 17, weight: 700 })
  s += punto(15, 50, '15 años: 50 %', 14, 30)
  s += punto(25, 72.8, '25 años: 72,8 %', 14, 30)
  s += punto(36.5, 100, '100 %', -18, -16).replace('text-anchor="start"', 'text-anchor="end"')
  s += T.tx(X(12.5), Y(8), 'Sin pensión', { size: 15, anchor: 'middle', fill: T.muted })
  const by = gy + gh + 90
  const tarjetas = [['Edad de jubilación 2026', '66 años y 10 meses', 'o 65 si has cotizado 38 años y 3 meses'], ['Pensión máxima 2026', '3.359,60 €/mes', 'en 14 pagas']]
  const cw = (W - 2 * M - 16) / 2
  tarjetas.forEach(([a, b, c], i) => {
    const x = M + i * (cw + 16)
    s += rect(x, by, cw, 118, { rx: 16, fill: T.soft })
    s += T.tx(x + 20, by + 34, a, { size: 17, fill: T.muted })
    s += T.tx(x + 20, by + 72, b, { size: 26, weight: 700, fill: T.accent })
    s += T.tx(x + 20, by + 100, c, { size: 15, fill: T.muted })
  })
  return T.lienzo({ alto: by + 118 + 80, slug: 'calculo-pension-jubilacion', titulo: 'Qué porcentaje de pensión te corresponde según los años cotizados', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 34 Apiretal (banda rosa)
function apiretal() {
  const T = tema('banda', { accent: '#BE185D', soft: '#FDF2F8' })
  const filas = [[5, 0.8], [8, 1.2], [10, 1.5], [12, 1.8], [15, 2.3], [20, 3], [25, 3.8], [30, 4.5]]
  let s = T.tx(M, 184, 'Dosis por toma = peso (kg) × 0,15 ml', { size: 24, weight: 700, fill: T.accent })
  const cw = (W - 2 * M - 36) / 4
  filas.forEach(([kg, ml], i) => {
    const x = M + (i % 4) * (cw + 12)
    const y = 210 + Math.floor(i / 4) * 128
    s += rect(x, y, cw, 116, { rx: 18, fill: T.soft })
    s += T.tx(x + cw / 2, y + 36, `${kg} kg`, { size: 20, anchor: 'middle', fill: T.muted })
    s += T.tx(x + cw / 2, y + 78, `${es(ml, 1)} ml`, { size: 32, anchor: 'middle', weight: 700, fill: T.accent })
    s += T.tx(x + cw / 2, y + 102, `${Math.round(ml * 100)} mg`, { size: 15, anchor: 'middle', fill: T.muted })
  })
  const ry = 210 + 2 * 128 + 20
  const reglas = [['Cada 6 a 8 horas', 'nunca antes de 6 horas desde la toma anterior'], ['Máximo 4 tomas al día', 'sin superar 60 mg por kilo en 24 horas'], ['Menos de 4 kg', 'consulta siempre al pediatra']]
  reglas.forEach(([a, b], i) => {
    const y = ry + i * 64
    s += circle(M + 12, y + 18, 10, { fill: T.accent })
    s += T.tx(M + 34, y + 25, a, { size: 21, weight: 700 })
    s += T.tx(M + 300, y + 25, b, { size: 17, fill: T.muted })
  })
  const n = T.nota(ry + 3 * 64 + 20, 'Para Apiretal 100 mg/ml solución oral según su prospecto. Usa siempre la jeringa del envase y confirma la dosis con tu pediatra o farmacéutico.')
  return T.lienzo({ alto: Math.round(ry + 3 * 64 + 20 + n.h + 64), slug: 'calculadora-apiretal', titulo: 'Dosis de Apiretal según el peso del niño', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 35 Calculadora del amor (oscuro)
function amor() {
  const T = tema('oscuro', { accent: '#F472B6' })
  const pasos = [
    ['1', 'Escribes dos nombres', 'Ana  ·  Luis'],
    ['2', 'Se pasan a minúsculas y sin tildes', 'ana  ·  luis'],
    ['3', 'Se ordenan alfabéticamente', 'ana + luis'],
    ['4', 'Cada letra alimenta una fórmula', 'el resultado siempre va de 0 a 100'],
  ]
  let s = ''
  pasos.forEach(([n, t, e], i) => {
    const y = 180 + i * 104
    s += circle(M + 26, y + 34, 26, { fill: T.accent })
    s += T.tx(M + 26, y + 43, n, { size: 24, weight: 700, anchor: 'middle', fill: '#111827' })
    s += T.tx(M + 74, y + 28, t, { size: 22, weight: 700 })
    s += T.tx(M + 74, y + 60, e, { size: 20, fill: T.accent, family: 'Consolas, monospace' })
    if (i < 3) s += `<line x1="${M + 26}" y1="${y + 64}" x2="${M + 26}" y2="${y + 100}" stroke="${T.line}" stroke-width="3"/>`
  })
  const y = 180 + 4 * 104 + 10
  const cw = (W - 2 * M - 16) / 2
  s += rect(M, y, cw, 110, { rx: 18, fill: T.soft })
  s += T.tx(M + 20, y + 44, 'Mismo par, mismo resultado', { size: 19, weight: 700 })
  s += T.tx(M + 20, y + 78, 'Puedes repetirlo: no cambia.', { size: 17, fill: T.muted })
  s += rect(M + cw + 16, y, cw, 110, { rx: 18, fill: T.soft })
  s += T.tx(M + cw + 36, y + 44, 'El orden no importa', { size: 19, weight: 700 })
  s += T.tx(M + cw + 36, y + 78, '«Ana y Luis» = «Luis y Ana».', { size: 17, fill: T.muted })
  const n = T.nota(y + 150, 'Es un juego: el porcentaje sale de las letras de los nombres, no de ningún dato real sobre la pareja.')
  return T.lienzo({ alto: Math.round(y + 150 + n.h + 60), slug: 'calculadora-del-amor', titulo: 'Qué hace la calculadora del amor con vuestros nombres', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 36 NIT Colombia (banda ámbar)
function nit() {
  const T = tema('banda', { accent: '#B45309', soft: '#FFFBEB' })
  const digitos = '900123456'.split('').reverse().map(Number)
  const pesos = [3, 7, 13, 17, 19, 23, 29, 37, 41]
  const cw = (W - 2 * M) / 9
  let s = T.tx(M, 180, 'NIT 900.123.456: cifras de derecha a izquierda', { size: 21, weight: 700 })
  const filas = [['Cifra', digitos, T.ink], ['× Peso', pesos, T.accent], ['=', digitos.map((d, i) => d * pesos[i]), T.ink]]
  filas.forEach(([et, vals, col], f) => {
    const y = 204 + f * 74
    vals.forEach((v, i) => {
      const x = M + i * cw
      s += rect(x + 3, y, cw - 6, 60, { rx: 10, fill: f === 1 ? T.soft : f === 2 ? '#F9FAFB' : '#FFFFFF', stroke: T.line, sw: 2 })
      s += T.tx(x + cw / 2, y + 40, String(v), { size: f === 2 ? 22 : 26, weight: 700, anchor: 'middle', fill: col })
    })
  })
  const y = 204 + 3 * 74 + 20
  const pasos = [['Suma de productos', '586'], ['586 ÷ 11, resto', '3'], ['11 − 3', '8']]
  pasos.forEach(([a, b], i) => {
    s += T.tx(M, y + 34 + i * 50, a, { size: 21 })
    s += T.tx(W - M, y + 34 + i * 50, b, { size: 26, weight: 700, anchor: 'end', fill: i === 2 ? T.accent : T.ink })
  })
  const ry = y + 3 * 50 + 30
  s += rect(M, ry, W - 2 * M, 76, { rx: 16, fill: T.accent })
  s += T.tx(W / 2, ry + 50, 'NIT 900.123.456-8', { size: 32, weight: 700, anchor: 'middle', fill: '#FFF' })
  const n = T.nota(ry + 118, 'Si el resto es 0 o 1, el dígito de verificación es ese mismo resto. Los pesos son números primos fijados por la DIAN.')
  return T.lienzo({ alto: Math.round(ry + 118 + n.h + 60), slug: 'calcular-nit', titulo: 'Cómo se calcula el dígito de verificación del NIT', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 37 CUIL Argentina (papel)
function cuil() {
  const T = tema('papel', { accent: '#0369A1', soft: '#E0F2FE', line: '#D7E3EC' })
  const partes = [['20', 'Prefijo', T.accent], ['30123456', 'DNI (8 cifras)', T.ink], ['3', 'Verificador', '#B45309']]
  let x = M + 30
  let s = ''
  partes.forEach(([v, et, col], i) => {
    const w = v.length * 34 + 40
    s += rect(x, 190, w, 90, { rx: 14, fill: '#FFFFFF', stroke: col, sw: 3 })
    s += T.tx(x + w / 2, 250, v, { size: 46, weight: 700, anchor: 'middle', fill: col, family: T.titulo })
    s += T.tx(x + w / 2, 310, et, { size: 18, anchor: 'middle', fill: T.muted })
    x += w
    if (i < 2) { s += T.tx(x + 18, 250, '-', { size: 46, anchor: 'middle', fill: T.muted }); x += 36 }
  })
  const ty = 370
  s += T.tx(M, ty, 'Qué prefijo te corresponde', { size: 24, weight: 700, family: T.titulo })
  const pref = [['20', 'Hombres'], ['27', 'Mujeres'], ['23', 'Cuando con 20 o 27 el verificador daría 10'], ['30, 33, 34', 'Empresas (CUIT)']]
  pref.forEach(([p, d], i) => {
    const y = ty + 24 + i * 60
    s += rect(M, y, 130, 46, { rx: 10, fill: i === 2 ? '#FEF3C7' : T.soft })
    s += T.tx(M + 65, y + 31, p, { size: 22, weight: 700, anchor: 'middle', fill: T.accent })
    s += T.tx(M + 150, y + 31, d, { size: 20 })
  })
  const n = T.nota(ty + 24 + 4 * 60 + 20, 'El verificador sale de multiplicar las 10 primeras cifras por 5, 4, 3, 2, 7, 6, 5, 4, 3, 2, sumar y restar de 11 el resto de dividir entre 11.')
  return T.lienzo({ alto: Math.round(ty + 24 + 4 * 60 + 20 + n.h + 64), slug: 'calcular-cuil', titulo: 'Las tres partes del CUIL', subtitulo: 'Ejemplo: hombre con DNI 30.123.456', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 38 RUT Chile (oscuro)
function rut() {
  const T = tema('oscuro', { accent: '#38BDF8' })
  const dig = '12345678'.split('').reverse().map(Number)
  const ser = [2, 3, 4, 5, 6, 7, 2, 3]
  const cw = (W - 2 * M) / 8
  let s = T.tx(M, 180, 'RUT 12.345.678: de derecha a izquierda, por 2, 3, 4, 5, 6, 7…', { size: 19, fill: T.muted })
  dig.forEach((d, i) => {
    const x = M + i * cw
    s += rect(x + 4, 204, cw - 8, 150, { rx: 14, fill: T.soft })
    s += T.tx(x + cw / 2, 246, String(d), { size: 30, weight: 700, anchor: 'middle' })
    s += T.tx(x + cw / 2, 284, `× ${ser[i]}`, { size: 20, anchor: 'middle', fill: T.accent })
    s += T.tx(x + cw / 2, 330, String(d * ser[i]), { size: 24, weight: 700, anchor: 'middle', fill: '#FDE68A' })
  })
  const y = 400
  const pasos = [['Suma', '138'], ['138 ÷ 11, resto', '6'], ['11 − 6', '5']]
  pasos.forEach(([a, b], i) => {
    s += T.tx(M, y + i * 52, a, { size: 22 })
    s += T.tx(W - M, y + i * 52, b, { size: 28, weight: 700, anchor: 'end', fill: i === 2 ? T.accent : T.ink })
  })
  const ry = y + 3 * 52 + 10
  s += rect(M, ry, W - 2 * M, 80, { rx: 16, fill: T.accent })
  s += T.tx(W / 2, ry + 53, 'RUT 12.345.678-5', { size: 34, weight: 700, anchor: 'middle', fill: '#0B1020' })
  const ky = ry + 116
  const cw2 = (W - 2 * M - 16) / 2
  s += rect(M, ky, cw2, 76, { rx: 14, fill: T.soft }) + T.tx(M + 20, ky + 32, 'Si da 11', { size: 17, fill: T.muted }) + T.tx(M + 20, ky + 62, 'el dígito es 0', { size: 22, weight: 700 })
  s += rect(M + cw2 + 16, ky, cw2, 76, { rx: 14, fill: T.soft }) + T.tx(M + cw2 + 36, ky + 32, 'Si da 10', { size: 17, fill: T.muted }) + T.tx(M + cw2 + 36, ky + 62, 'el dígito es K', { size: 22, weight: 700, fill: T.accent })
  return T.lienzo({ alto: ky + 76 + 84, slug: 'calcular-rut', titulo: 'Cómo se calcula el dígito verificador del RUT', subtitulo: 'El algoritmo del módulo 11, cifra por cifra', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 39 Área del círculo (cuaderno)
function circulo() {
  const T = tema('cuaderno', { accent: '#7C3AED' })
  const cx = 220
  const cy = 330
  const r = 130
  let s = circle(cx, cy, r, { fill: '#EDE9FE', stroke: T.ink, sw: 3 })
  s += `<line x1="${cx}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="${T.accent}" stroke-width="4"/>`
  s += circle(cx, cy, 6, { fill: T.ink })
  s += T.tx(cx + r / 2, cy - 12, 'r = 5 cm', { size: 22, anchor: 'middle', family: T.titulo, fill: T.accent })
  s += `<line x1="${cx - r}" y1="${cy + r + 30}" x2="${cx + r}" y2="${cy + r + 30}" stroke="${T.muted}" stroke-width="2"/><line x1="${cx - r}" y1="${cy + r + 22}" x2="${cx - r}" y2="${cy + r + 38}" stroke="${T.muted}" stroke-width="2"/><line x1="${cx + r}" y1="${cy + r + 22}" x2="${cx + r}" y2="${cy + r + 38}" stroke="${T.muted}" stroke-width="2"/>`
  s += T.tx(cx, cy + r + 62, 'd = 10 cm', { size: 20, anchor: 'middle', family: T.titulo, fill: T.muted })
  const fx = 420
  const formulas = [['Si tienes el radio', 'A = π × r²', 'π × 5² = 78,54 cm²'], ['Si tienes el diámetro', 'A = π × (d ÷ 2)²', 'π × 5² = 78,54 cm²'], ['Si tienes la circunferencia', 'A = C² ÷ (4π)', '31,42² ÷ 12,57 = 78,54 cm²']]
  formulas.forEach(([a, f, e], i) => {
    const y = 190 + i * 112
    s += rect(fx, y, W - M - fx, 100, { rx: 14, fill: '#FFFFFF', stroke: '#93C5FD', sw: 2 })
    s += T.tx(fx + 16, y + 28, a, { size: 16, fill: T.muted })
    s += T.tx(fx + 16, y + 60, f, { size: 24, family: T.titulo, fill: T.ink })
    s += T.tx(fx + 16, y + 86, e, { size: 16, fill: T.accent, weight: 700 })
  })
  const n = T.nota(cy + r + 110, 'El área se mide en unidades al cuadrado (cm², m²). La circunferencia, en cambio, es una longitud: C = 2 × π × r = 31,42 cm.')
  return T.lienzo({ alto: Math.round(cy + r + 110 + n.h + 60), slug: 'calcular-area-circulo', titulo: 'Tres formas de calcular el área de un círculo', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 40 Hexadecimal a decimal (terminal)
function hexadecimal() {
  const T = tema('terminal')
  let s = T.tx(M, 180, '$ hex2dec 1A3', { size: 24, fill: T.accent })
  const cols = [['1', '16²', '256', '1 × 256 = 256'], ['A', '16¹', '16', '10 × 16 = 160'], ['3', '16⁰', '1', '3 × 1 = 3']]
  const cw = (W - 2 * M - 24) / 3
  cols.forEach(([d, p, v, op], i) => {
    const x = M + i * (cw + 12)
    s += rect(x, 206, cw, 196, { rx: 12, fill: T.soft, stroke: T.line, sw: 2 })
    s += T.tx(x + cw / 2, 270, d, { size: 58, weight: 700, anchor: 'middle', fill: '#FDE68A' })
    s += T.tx(x + cw / 2, 310, `posición ${p} = ${v}`, { size: 17, anchor: 'middle', fill: T.muted })
    s += T.tx(x + cw / 2, 370, op, { size: 19, anchor: 'middle' })
  })
  s += T.tx(M, 452, '256 + 160 + 3 =', { size: 26 })
  s += T.tx(W - M, 452, '419', { size: 42, weight: 700, anchor: 'end', fill: T.accent })
  const ty = 510
  s += T.tx(M, ty, '# letras', { size: 18, fill: T.muted })
  const letras = [['A', 10], ['B', 11], ['C', 12], ['D', 13], ['E', 14], ['F', 15]]
  const lw = (W - 2 * M - 50) / 6
  letras.forEach(([l, v], i) => {
    const x = M + i * (lw + 10)
    s += rect(x, ty + 16, lw, 70, { rx: 10, fill: T.soft, stroke: T.line, sw: 2 })
    s += T.tx(x + lw / 2, ty + 46, l, { size: 24, weight: 700, anchor: 'middle', fill: '#FDE68A' })
    s += T.tx(x + lw / 2, ty + 74, String(v), { size: 18, anchor: 'middle' })
  })
  const ey = ty + 130
  const ejemplos = [['FF', '255', 'el máximo de un byte'], ['7F', '127', 'mitad de FF, redondeado abajo'], ['100', '256', 'uno más que FF']]
  ejemplos.forEach(([h, d, c], i) => {
    const y = ey + i * 44
    s += T.tx(M, y, `0x${h}`, { size: 22, fill: '#FDE68A' })
    s += T.tx(M + 140, y, `= ${d}`, { size: 22, weight: 700 })
    s += T.tx(M + 260, y, `// ${c}`, { size: 18, fill: T.muted })
  })
  return T.lienzo({ alto: ey + 3 * 44 + 60, slug: 'calcular-hexadecimal-a-decimal', titulo: 'Hexadecimal a decimal, posición por posición', cuerpo: s })
}

const pieza = (archivo, alt, fn) => ({ archivo, alt, dibujar: fn })

module.exports = [
  pieza('ahorro-necesario-hipoteca', 'Ahorro necesario para comprar un piso de 200 mil euros con hipoteca del 80 por ciento y cuota mensual', hipoteca),
  pieza('calculo-letra-dni-modulo-23', 'Cálculo de la letra del DNI con el resto de dividir entre 23 y la tabla de letras', dni),
  pieza('porcentaje-pension-anos-cotizados', 'Porcentaje de la pensión de jubilación según los años cotizados: 50 por ciento con 15 años y 100 con 36 y medio', pension),
  pieza('dosis-apiretal-por-peso', 'Tabla de dosis de Apiretal 100 mg/ml en mililitros según el peso del niño', apiretal),
  pieza('como-funciona-calculadora-amor', 'Cómo funciona la calculadora del amor: nombres normalizados, ordenados y convertidos en un porcentaje', amor),
  pieza('digito-verificacion-nit-colombia', 'Cálculo del dígito de verificación del NIT de Colombia con los pesos de la DIAN', nit),
  pieza('partes-del-cuil-argentina', 'Partes del CUIL argentino: prefijo según sexo, DNI y dígito verificador', cuil),
  pieza('digito-verificador-rut-chile', 'Cálculo del dígito verificador del RUT chileno con el módulo 11', rut),
  pieza('formulas-area-del-circulo', 'Fórmulas del área del círculo con el radio, el diámetro o la circunferencia', circulo),
  pieza('hexadecimal-a-decimal-paso-a-paso', 'Conversión de hexadecimal a decimal paso a paso: 1A3 es 419', hexadecimal),
]
module.exports.temas = { tema, W, M, mx, es }
