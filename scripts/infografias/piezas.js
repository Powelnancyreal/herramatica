// Infografías de las herramientas. Cada pieza devuelve { svg, alto }; el ancho es siempre 800.
const QRCode = require('qrcode')
const { C, FONT, text, rect, circle } = require('../illustrations/kit')

const W = 800
const M = 40 // margen lateral

// Parte un texto en líneas de como máximo `max` caracteres.
function partir(t, max) {
  const lineas = []
  let actual = ''
  for (const palabra of t.split(' ')) {
    if ((actual + ' ' + palabra).trim().length > max) {
      lineas.push(actual)
      actual = palabra
    } else actual = (actual + ' ' + palabra).trim()
  }
  if (actual) lineas.push(actual)
  return lineas
}
// Texto de varias líneas; devuelve el SVG y la altura ocupada.
function parrafo(x, y, t, { size = 22, max = 52, alto = 1.32, ...op } = {}) {
  const ls = partir(t, max)
  return { svg: ls.map((l, i) => text(x, y + i * size * alto, l, { size, ...op })).join(''), h: ls.length * size * alto }
}

// Las piezas colocan su contenido suponiendo un título de una línea; si el título ocupa más, todo baja.
function lienzo({ alto: altoBase, titulo, subtitulo, slug, cuerpo }) {
  const tit = parrafo(M, 92, titulo, { size: 36, max: 38, anchor: 'start', fill: C.slate, alto: 1.2 })
  const sub = subtitulo ? parrafo(M, 92 + tit.h + 10, subtitulo, { size: 22, max: 60, anchor: 'start', fill: C.slateMid, weight: 400 }) : { svg: '', h: 22 * 1.32 }
  const dy = Math.round(tit.h - 36 * 1.2 + sub.h - 22 * 1.32) + 24
  const alto = Math.round(altoBase + dy)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${alto}" width="${W}" height="${alto}">
<rect width="${W}" height="${alto}" fill="${C.white}"/>
<rect width="${W}" height="8" fill="${C.purple}"/>
${text(M, 50, 'HERRAMATICA · INFOGRAFÍA', { size: 16, fill: C.purple, anchor: 'start' })}
${tit.svg}${sub.svg}
<g transform="translate(0,${dy})">${cuerpo}</g>
<line x1="${M}" y1="${alto - 52}" x2="${W - M}" y2="${alto - 52}" stroke="${C.line}" stroke-width="2"/>
${text(M, alto - 22, `herramatica.com/${slug}`, { size: 18, fill: C.slateMid, anchor: 'start', weight: 700 })}
</svg>`
  return { svg, alto }
}

const linea = (x1, y1, x2, y2, color = C.slateSoft, sw = 2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>`
const flechaAbajo = (x, y, color = C.slateSoft) => `<path d="M${x},${y} v18 M${x - 8},${y + 10} L${x},${y + 18} L${x + 8},${y + 10}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`

// ─────────────────────────────────────────────────────────── RFC
function rfc() {
  const chars = ['G', 'O', 'M', 'J', '9', '0', '0', '5', '1', '4', '?', '?', '?']
  const grupo = (i) => (i < 4 ? 'letras' : i < 10 ? 'fecha' : 'homo')
  const color = { letras: [C.purple, C.purpleXs], fecha: [C.blue, C.blueSoft], homo: [C.amberDark, C.amberSoft] }
  const bw = 46
  const gap = 6
  const extra = 14 // separación entre grupos
  const total = chars.length * bw + (chars.length - 1) * gap + extra * 2
  let x = (W - total) / 2
  const y = 190
  let cajas = ''
  const pos = []
  chars.forEach((ch, i) => {
    if (i === 4 || i === 10) x += extra
    const [fuerte, suave] = color[grupo(i)]
    cajas += rect(x, y, bw, 64, { rx: 10, fill: suave, stroke: fuerte, sw: 2.5 })
    cajas += text(x + bw / 2, y + 44, ch, { size: 32, fill: fuerte })
    pos.push(x)
    x += bw + gap
  })
  const centro = (a, b) => (pos[a] + pos[b] + bw) / 2
  const marcas = [
    [0, 1, C.purple, '1'], [2, 2, C.purple, '2'], [3, 3, C.purple, '3'], [4, 9, C.blue, '4'], [10, 12, C.amberDark, '5'],
  ]
  let llaves = ''
  for (const [a, b, col, n] of marcas) {
    llaves += `<path d="M${pos[a] + 4},${y + 76} v8 H${pos[b] + bw - 4} v-8" fill="none" stroke="${col}" stroke-width="2.5"/>`
    llaves += circle(centro(a, b), y + 104, 14, { fill: col })
    llaves += text(centro(a, b), y + 111, n, { size: 18, fill: C.white })
  }
  const notas = [
    ['1', C.purple, 'GO', 'Primera letra y primera vocal interna del primer apellido: GÓMEZ.'],
    ['2', C.purple, 'M', 'Inicial del segundo apellido: MARTÍNEZ.'],
    ['3', C.purple, 'J', 'Inicial del nombre: JUAN.'],
    ['4', C.blue, '900514', 'Fecha de nacimiento en formato año, mes y día.'],
    ['5', C.amberDark, '???', 'Homoclave: tres caracteres que asigna el SAT para que no haya dos RFC iguales.'],
  ]
  let lista = ''
  let ly = 350
  for (const [n, col, clave, desc] of notas) {
    lista += circle(M + 16, ly - 7, 16, { fill: col })
    lista += text(M + 16, ly, n, { size: 18, fill: C.white })
    lista += text(M + 46, ly, clave, { size: 22, fill: col, anchor: 'start' })
    const p = parrafo(M + 150, ly, desc, { size: 21, max: 50, anchor: 'start', weight: 400 })
    lista += p.svg
    ly += Math.max(46, p.h + 18)
  }
  const nota = parrafo(M, ly + 16, 'Las partículas como DE, DEL o LA se omiten, y los nombres compuestos con JOSÉ o MARÍA usan el segundo nombre.', { size: 19, max: 70, anchor: 'start', fill: C.slateMid, weight: 400 })
  const alto = Math.round(ly + 16 + nota.h + 70)
  return lienzo({
    alto, slug: 'calcular-rfc', titulo: 'Cómo se forma el RFC de una persona física',
    subtitulo: 'Ejemplo: Juan Gómez Martínez, nacido el 14 de mayo de 1990',
    cuerpo: cajas + llaves + lista + nota.svg,
  })
}

// ─────────────────────────────────────────────────────────── IMC
function imc() {
  const min = 15
  const max = 45
  const x0 = M
  const ancho = W - 2 * M
  const px = (v) => x0 + ((v - min) / (max - min)) * ancho
  const tramos = [
    [15, 18.5, '#60A5FA', 'Bajo peso', 'menos de 18,5'],
    [18.5, 25, '#10B981', 'Normal', '18,5 a 24,9'],
    [25, 30, '#FBBF24', 'Sobrepeso', '25 a 29,9'],
    [30, 35, '#F97316', 'Obesidad I', '30 a 34,9'],
    [35, 40, '#EF4444', 'Obesidad II', '35 a 39,9'],
    [40, 45, '#B91C1C', 'Obesidad III', '40 o más'],
  ]
  const y = 300
  let etiquetas = ''
  tramos.forEach(([a, b, , nombre, rango]) => {
    const cx = (px(a) + px(b)) / 2
    etiquetas += text(cx, y + 80, nombre, { size: 18, fill: C.slate })
    etiquetas += text(cx, y + 104, rango, { size: 16, fill: C.slateMid, weight: 400 })
  })
  let fondo = ''
  tramos.forEach(([a, b, col]) => { fondo += `<rect x="${px(a)}" y="${y}" width="${px(b) - px(a)}" height="46" fill="${col}"/>` })
  const valor = 22.9
  const mx = px(valor)
  const marcador = `<path d="M${mx - 12},${y - 26} L${mx + 12},${y - 26} L${mx},${y - 6} Z" fill="${C.slate}"/>` +
    rect(mx - 58, y - 72, 116, 40, { rx: 20, fill: C.slate }) + text(mx, y - 45, 'IMC 22,9', { size: 20, fill: C.white })
  const formula = rect(M, 170, W - 2 * M, 64, { rx: 14, fill: C.purpleXs }) +
    text(W / 2, 212, 'IMC = peso (kg) ÷ altura (m)²', { size: 28, fill: C.purpleDark })
  const ejemplo = parrafo(M, 470, 'Ejemplo: 70 kg y 1,75 m → 70 ÷ (1,75 × 1,75) = 70 ÷ 3,06 = 22,9, peso normal.', { size: 22, max: 62, anchor: 'start', weight: 400 })
  const nota = parrafo(M, 470 + ejemplo.h + 14, 'Para adultos de 18 años o más. En niños y adolescentes se usan percentiles por edad y sexo.', { size: 19, max: 70, anchor: 'start', fill: C.slateMid, weight: 400 })
  const alto = Math.round(470 + ejemplo.h + 14 + nota.h + 64)
  return lienzo({
    alto, slug: 'calcular-imc', titulo: 'Clasificación del IMC en adultos según la OMS',
    subtitulo: 'Dónde cae tu resultado y cómo se calcula',
    cuerpo: formula + `<clipPath id="barra"><rect x="${x0}" y="${y}" width="${ancho}" height="46" rx="23"/></clipPath><g clip-path="url(#barra)">${fondo}</g>` + etiquetas + marcador + ejemplo.svg + nota.svg,
  })
}

// ─────────────────────────────────────────────────────────── Edad
function edad() {
  const y = 250
  const xs = [M + 20, 330, 560, W - M - 20]
  const fechas = ['15/03/1995', '15/03/2026', '15/10/2026', '20/10/2026']
  const tramos = [
    ['31 años', 'años completos', C.purple, C.purpleXs],
    ['7 meses', 'meses completos', C.blue, C.blueSoft],
    ['5 días', 'días restantes', C.teal, C.tealSoft],
  ]
  let s = linea(xs[0], y, xs[3], y, C.slateSoft, 4)
  tramos.forEach(([valor, desc, col, suave], i) => {
    s += `<rect x="${xs[i]}" y="${y - 6}" width="${xs[i + 1] - xs[i]}" height="12" fill="${col}" rx="6"/>`
    const cx = (xs[i] + xs[i + 1]) / 2
    s += rect(cx - 90, y + 40, 180, 92, { rx: 16, fill: suave })
    s += text(cx, y + 80, valor, { size: 30, fill: col })
    s += text(cx, y + 112, desc, { size: 18, fill: C.slate, weight: 400 })
  })
  xs.forEach((x, i) => {
    s += circle(x, y, 11, { fill: C.white, stroke: C.slate, sw: 4 })
    s += text(x, y - 26, fechas[i], { size: 19, fill: C.slate, anchor: i === 0 ? 'start' : i === 3 ? 'end' : 'middle' })
  })
  s += text(xs[0], y - 52, 'Nacimiento', { size: 17, fill: C.slateMid, weight: 400, anchor: 'start' })
  s += text(xs[3], y - 52, 'Hoy', { size: 17, fill: C.slateMid, weight: 400, anchor: 'end' })
  s += rect(M, 430, W - 2 * M, 84, { rx: 16, fill: C.slate })
  s += text(W / 2, 466, 'Edad exacta: 31 años, 7 meses y 5 días', { size: 26, fill: C.white })
  s += text(W / 2, 498, 'En total, 11.542 días vividos', { size: 20, fill: C.slateSoft, weight: 400 })
  const nota = parrafo(M, 556, 'Se cuentan fechas del calendario, no bloques de 365 días, así que los años bisiestos y los meses de 28, 30 o 31 días quedan incluidos solos.', { size: 19, max: 70, anchor: 'start', fill: C.slateMid, weight: 400 })
  const alto = Math.round(556 + nota.h + 60)
  return lienzo({
    alto, slug: 'calculadora-edad', titulo: 'Cómo se calcula la edad exacta en años, meses y días',
    subtitulo: 'Ejemplo: nacimiento el 15/03/1995, cálculo el 20/10/2026', cuerpo: s + nota.svg,
  })
}

// ─────────────────────────────────────────────────────────── Suma en columna (Calculadora de Alicia)
function alicia() {
  const cols = [C.teal, C.blue, C.purple] // unidades, decenas, centenas
  const cx = [250, 190, 130] // x de unidades, decenas, centenas
  const filas = { lleva: 210, a: 268, b: 330, res: 420 }
  let s = ''
  // Columnas sombreadas
  ;[0, 1, 2].forEach((i) => { s += rect(cx[i] - 26, 176, 52, 270, { rx: 12, fill: cols[i], o: 0.08 }) })
  const num = (x, y, t, col = C.slate, size = 46) => text(x, y, t, { size, fill: col })
  s += num(cx[1], filas.lleva, '1', C.red, 26) + num(cx[2], filas.lleva, '1', C.red, 26)
  ;['4', '7', '8'].forEach((d, i) => { s += num(cx[2 - i], filas.a, d) })
  ;['3', '5', '6'].forEach((d, i) => { s += num(cx[2 - i], filas.b, d) })
  s += num(70, filas.b, '+', C.slateMid)
  s += linea(60, 356, 285, 356, C.slate, 4)
  ;['8', '3', '4'].forEach((d, i) => { s += num(cx[2 - i], filas.res, d, cols[2 - i]) })
  const pasos = [
    ['Unidades', '8 + 6 = 14', 'Escribo 4 y llevo 1 a las decenas.', cols[0]],
    ['Decenas', '7 + 5 + 1 = 13', 'Escribo 3 y llevo 1 a las centenas.', cols[1]],
    ['Centenas', '4 + 3 + 1 = 8', 'Escribo 8. Resultado: 834.', cols[2]],
  ]
  pasos.forEach(([nombre, op, desc, col], i) => {
    const y = 176 + i * 92
    s += rect(330, y, W - M - 330, 80, { rx: 14, fill: C.white, stroke: col, sw: 2.5 })
    s += text(350, y + 32, `${i + 1}. ${nombre}`, { size: 20, fill: col, anchor: 'start' })
    s += text(W - M - 20, y + 32, op, { size: 22, fill: C.slate, anchor: 'end' })
    s += text(350, y + 62, desc, { size: 19, fill: C.slate, anchor: 'start', weight: 400 })
  })
  s += text(cx[1], filas.lleva - 30, 'llevadas', { size: 16, fill: C.red, weight: 400 })
  const nota = parrafo(M, 500, 'Se empieza siempre por la derecha. Cuando una columna suma 10 o más, la cifra de las decenas pasa como «llevada» a la columna siguiente.', { size: 19, max: 70, anchor: 'start', fill: C.slateMid, weight: 400 })
  const alto = Math.round(500 + nota.h + 60)
  return lienzo({ alto, slug: 'calculadora-alicia', titulo: 'La suma en columna con llevadas, paso a paso', subtitulo: 'Ejemplo: 478 + 356', cuerpo: s + nota.svg })
}

// ─────────────────────────────────────────────────────────── Código QR
function qr() {
  const q = QRCode.create('https://herramatica.com', { errorCorrectionLevel: 'M' })
  const n = q.modules.size // 25 (versión 2)
  const m = 11
  const ox = M + 4 * m
  const oy = 190
  let s = rect(M, oy - 4 * m, (n + 8) * m, (n + 8) * m, { rx: 8, fill: C.white, stroke: C.line, sw: 2 })
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.modules.get(r, c)) s += `<rect x="${ox + c * m}" y="${oy + r * m}" width="${m}" height="${m}" fill="#111827"/>`
  const marco = (x, y, w, h, col, etiqueta) =>
    `<rect x="${ox + x * m - 3}" y="${oy + y * m - 3}" width="${w * m + 6}" height="${h * m + 6}" rx="6" fill="none" stroke="${col}" stroke-width="4"/>` +
    circle(ox + x * m + w * m + 2, oy + y * m - 2, 13, { fill: col }) + text(ox + x * m + w * m + 2, oy + y * m + 5, etiqueta, { size: 16, fill: C.white })
  s += marco(0, 0, 7, 7, C.purple, '1') + marco(n - 7, 0, 7, 7, C.purple, '1') + marco(0, n - 7, 7, 7, C.purple, '1')
  s += marco(16, 16, 5, 5, C.amberDark, '2')
  s += `<rect x="${ox + 8 * m}" y="${oy + 6 * m}" width="${(n - 16) * m}" height="${m}" fill="${C.teal}" opacity="0.35"/>`
  s += `<rect x="${ox + 6 * m}" y="${oy + 8 * m}" width="${m}" height="${(n - 16) * m}" fill="${C.teal}" opacity="0.35"/>`
  s += circle(ox + 12 * m, oy + 6 * m - 18, 13, { fill: C.teal }) + text(ox + 12 * m, oy + 6 * m - 11, '3', { size: 16, fill: C.white })
  const lx = M + (n + 8) * m + 34
  const leyenda = [
    ['1', C.purple, 'Patrones de posición', 'Indican a la cámara dónde están tres de las esquinas.'],
    ['2', C.amberDark, 'Patrón de alineación', 'Corrige la deformación si escaneas en ángulo.'],
    ['3', C.teal, 'Patrones de sincronización', 'Marcan el tamaño de cada módulo.'],
    ['4', C.slate, 'Datos y corrección de errores', 'El resto de módulos guarda el contenido y su copia de seguridad.'],
    ['5', C.slateMid, 'Margen en blanco', 'Al menos 4 módulos libres alrededor.'],
  ]
  let ly = oy - 22
  for (const [k, col, tit, desc] of leyenda) {
    s += circle(lx + 13, ly - 6, 13, { fill: col }) + text(lx + 13, ly + 1, k, { size: 16, fill: C.white })
    s += text(lx + 36, ly, tit, { size: 20, fill: C.slate, anchor: 'start' })
    const p = parrafo(lx + 36, ly + 26, desc, { size: 17, max: 32, anchor: 'start', fill: C.slateMid, weight: 400 })
    s += p.svg
    ly += 34 + p.h + 8
  }
  const ny = Math.max(oy + (n + 4) * m, ly) + 56
  s += text(M, ny, 'Niveles de corrección de errores: cuánto puede dañarse y seguir leyéndose', { size: 20, fill: C.slate, anchor: 'start' })
  const niveles = [['L', '7 %'], ['M', '15 %'], ['Q', '25 %'], ['H', '30 %']]
  const bw = (W - 2 * M - 3 * 12) / 4
  niveles.forEach(([l, p], i) => {
    const x = M + i * (bw + 12)
    s += rect(x, ny + 18, bw, 62, { rx: 12, fill: i === 1 ? C.purple : C.purpleXs })
    s += text(x + bw / 2, ny + 58, `${l} · ${p}`, { size: 24, fill: i === 1 ? C.white : C.purpleDark })
  })
  s += text(M, ny + 112, 'Este código es real: escanéalo y te llevará a herramatica.com (nivel M).', { size: 18, fill: C.slateMid, anchor: 'start', weight: 400 })
  const alto = ny + 196
  return lienzo({ alto, slug: 'generador-qr', titulo: 'Las partes de un código QR', subtitulo: 'Qué hace cada zona y cuánta información puede recuperar', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── Horas decimales
function horas() {
  let s = rect(M, 170, W - 2 * M, 64, { rx: 14, fill: C.purpleXs }) + text(W / 2, 212, 'horas decimales = horas + minutos ÷ 60', { size: 27, fill: C.purpleDark })
  const tabla = [['5 min', '0,08'], ['10 min', '0,17'], ['15 min', '0,25'], ['20 min', '0,33'], ['30 min', '0,50'], ['40 min', '0,67'], ['45 min', '0,75'], ['50 min', '0,83']]
  const tw = (W - 2 * M - 3 * 12) / 4
  tabla.forEach(([mins, dec], i) => {
    const x = M + (i % 4) * (tw + 12)
    const y = 262 + Math.floor(i / 4) * 96
    s += rect(x, y, tw, 84, { rx: 14, fill: C.paper, stroke: C.line, sw: 2 })
    s += text(x + tw / 2, y + 34, mins, { size: 20, fill: C.slateMid, weight: 400 })
    s += text(x + tw / 2, y + 68, `${dec} h`, { size: 28, fill: C.slate })
  })
  const ey = 482
  s += text(M, ey, 'Ejemplo de jornada', { size: 22, fill: C.slate, anchor: 'start' })
  const pasos = [
    ['Entrada 08:45 → salida 17:20', '8 h 35 min'],
    ['Menos 30 min de descanso', '8 h 05 min'],
    ['5 min ÷ 60 = 0,08', '8,08 h'],
  ]
  pasos.forEach(([a, b], i) => {
    const y = ey + 22 + i * 56
    s += rect(M, y, W - 2 * M, 46, { rx: 10, fill: i === 2 ? C.greenSoft : C.white, stroke: i === 2 ? C.green : C.line, sw: 2 })
    s += text(M + 18, y + 31, a, { size: 20, fill: C.slate, anchor: 'start', weight: 400 })
    s += text(W - M - 18, y + 31, b, { size: 22, fill: i === 2 ? C.green : C.slate, anchor: 'end' })
  })
  const ay = ey + 22 + 3 * 56 + 20
  s += rect(M, ay, W - 2 * M, 66, { rx: 14, fill: C.amberSoft })
  s += text(W / 2, ay + 42, 'Ojo: 8,30 h no son 8 h 30 min, sino 8 h 18 min.', { size: 22, fill: '#92400E' })
  const alto = ay + 66 + 80
  return lienzo({ alto, slug: 'calculadora-horas', titulo: 'Cómo pasar horas y minutos a horas decimales', subtitulo: 'Tabla rápida para nóminas, facturas y registros de jornada', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── Grados y radianes
function cientifica() {
  const cx = 200
  const cy = 360
  const r = 140
  let s = circle(cx, cy, r, { fill: 'none', stroke: C.slateSoft, sw: 3 })
  s += linea(cx - r - 20, cy, cx + r + 20, cy, C.slateSoft, 2) + linea(cx, cy - r - 20, cx, cy + r + 20, C.slateSoft, 2)
  const angulos = [[0, '0', '0'], [30, '30°', 'π/6'], [45, '45°', 'π/4'], [60, '60°', 'π/3'], [90, '90°', 'π/2'], [180, '180°', 'π']]
  for (const [g, gt, rt] of angulos) {
    const a = (g * Math.PI) / 180
    const x = cx + r * Math.cos(a)
    const y = cy - r * Math.sin(a)
    if (g === 30) s += linea(cx, cy, x, y, C.purple, 4)
    s += circle(x, y, 7, { fill: g === 30 ? C.purple : C.slate })
    const lx = cx + (r + 44) * Math.cos(a)
    const ly = cy - (r + 30) * Math.sin(a) + 7
    if (g !== 0 && g !== 180) s += text(lx, ly, `${gt} = ${rt}`, { size: 17, fill: C.slate, anchor: g >= 90 ? 'middle' : 'start' })
  }
  s += text(cx + r + 24, cy + 28, '0°', { size: 17, fill: C.slate })
  s += text(cx - r + 4, cy + 34, '180° = π', { size: 17, fill: C.slate })
  s += `<path d="M${cx + 48},${cy} A48,48 0 0 0 ${cx + 48 * Math.cos(Math.PI / 6)},${cy - 48 * Math.sin(Math.PI / 6)}" fill="none" stroke="${C.purple}" stroke-width="3"/>`
  const rx = 470
  const tarjeta = (y, modo, op, res, col, suave, nota) =>
    rect(rx, y, W - M - rx, 120, { rx: 16, fill: suave }) +
    text(rx + 20, y + 34, `Modo ${modo}`, { size: 18, fill: col, anchor: 'start' }) +
    text(rx + 20, y + 76, `${op} = ${res}`, { size: 30, fill: C.slate, anchor: 'start' }) +
    text(rx + 20, y + 104, nota, { size: 17, fill: C.slateMid, anchor: 'start', weight: 400 })
  s += tarjeta(200, 'DEG (grados)', 'sen(30)', '0,5', C.green, C.greenSoft, '30 grados')
  s += tarjeta(340, 'RAD (radianes)', 'sen(30)', '−0,988', C.red, C.redSoft, '30 radianes ≈ 1718,9°')
  s += rect(M, 560, W - 2 * M, 64, { rx: 14, fill: C.purpleXs }) + text(W / 2, 601, 'radianes = grados × π ÷ 180', { size: 26, fill: C.purpleDark })
  const nota = parrafo(M, 664, 'Si un seno o un coseno da un resultado raro, revisa el modo antes que la fórmula: es el error más común.', { size: 19, max: 70, anchor: 'start', fill: C.slateMid, weight: 400 })
  const alto = Math.round(664 + nota.h + 60)
  return lienzo({ alto, slug: 'calculadora-cientifica', titulo: 'Grados o radianes: por qué sen(30) no siempre da 0,5', subtitulo: 'El mismo número, dos unidades de ángulo distintas', cuerpo: s + nota.svg })
}

// ─────────────────────────────────────────────────────────── Finiquito (España)
function finiquito() {
  const conceptos = [
    ['Salario pendiente', 'Los días trabajados del último mes.'],
    ['Vacaciones', 'Los días generados y no disfrutados.'],
    ['Pagas extra', 'Parte proporcional no cobrada.'],
    ['Indemnización', 'Solo si el motivo del cese la da.'],
  ]
  const cw = (W - 2 * M - 12) / 2
  let s = ''
  conceptos.forEach(([t, d], i) => {
    const x = M + (i % 2) * (cw + 12)
    const y = 190 + Math.floor(i / 2) * 102
    const col = i === 3 ? C.purple : C.blue
    s += rect(x, y, cw, 90, { rx: 14, fill: i === 3 ? C.purpleXs : C.blueSoft })
    s += text(x + 18, y + 36, `${i + 1}. ${t}`, { size: 22, fill: col, anchor: 'start' })
    s += text(x + 18, y + 68, d, { size: 18, fill: C.slate, anchor: 'start', weight: 400 })
  })
  const by = 440
  s += text(M, by, 'Indemnización: días de salario por año trabajado', { size: 23, fill: C.slate, anchor: 'start' })
  const tipos = [
    ['Baja voluntaria o despido disciplinario procedente', 0, 'Sin indemnización'],
    ['Fin de contrato temporal', 12, '12 días'],
    ['Despido objetivo', 20, '20 días · máx. 12 mensualidades'],
    ['Despido improcedente', 33, '33 días · máx. 24 mensualidades'],
    ['Improcedente, por el tiempo trabajado antes del 12/02/2012', 45, '45 días por ese periodo'],
  ]
  const escala = (W - 2 * M) / 45
  tipos.forEach(([t, d, et], i) => {
    const y = by + 28 + i * 74
    s += text(M, y + 18, t, { size: 18, fill: C.slate, anchor: 'start', weight: 400 })
    s += rect(M, y + 28, W - 2 * M, 26, { rx: 13, fill: C.paper })
    if (d) s += rect(M, y + 28, d * escala, 26, { rx: 13, fill: i === 4 ? C.slateMid : C.purple })
    s += text(d > 30 ? M + d * escala - 14 : d ? M + d * escala + 12 : M + 12, y + 47, et, { size: 17, fill: d > 30 ? C.white : C.slate, anchor: d > 30 ? 'end' : 'start' })
  })
  const fy = by + 28 + tipos.length * 74 + 20
  const nota = parrafo(M, fy, 'Según el Estatuto de los Trabajadores (arts. 49, 53 y 56). Tu convenio puede mejorar estas cantidades.', { size: 19, max: 70, anchor: 'start', fill: C.slateMid, weight: 400 })
  const alto = Math.round(fy + nota.h + 60)
  return lienzo({ alto, slug: 'calculadora-finiquito', titulo: 'Qué incluye tu finiquito y cuánto es la indemnización', subtitulo: 'Los cuatro conceptos y los días por año según el tipo de cese', cuerpo: s + nota.svg })
}

// ─────────────────────────────────────────────────────────── ISR México
function isr() {
  const pasos = [
    ['Busca tu renglón en la tarifa mensual', 'De $14,644.65 a $17,533.64: cuota fija $1,339.14 y 17.92 %'],
    ['Resta el límite inferior', '$15,000.00 − $14,644.65 = $355.35'],
    ['Aplica el porcentaje al excedente', '$355.35 × 17.92 % = $63.68'],
    ['Suma la cuota fija', '$63.68 + $1,339.14 = $1,402.82'],
    ['Resta el subsidio al empleo', 'No aplica: el sueldo supera $11,492.66'],
  ]
  let s = ''
  let y = 190
  pasos.forEach(([t, op], i) => {
    s += rect(M, y, W - 2 * M, 82, { rx: 14, fill: C.white, stroke: C.line, sw: 2 })
    s += circle(M + 34, y + 41, 18, { fill: C.purple }) + text(M + 34, y + 48, String(i + 1), { size: 19, fill: C.white })
    s += text(M + 66, y + 34, t, { size: 20, fill: C.slateMid, anchor: 'start', weight: 400 })
    s += text(M + 66, y + 64, op, { size: 22, fill: C.slate, anchor: 'start' })
    if (i < pasos.length - 1) s += flechaAbajo(W / 2, y + 84)
    y += 106
  })
  s += rect(M, y, W - 2 * M, 96, { rx: 16, fill: C.slate })
  s += text(M + 24, y + 42, 'ISR retenido en el mes', { size: 20, fill: C.slateSoft, anchor: 'start', weight: 400 })
  s += text(M + 24, y + 78, '$1,402.82', { size: 32, fill: C.white, anchor: 'start' })
  s += text(W - M - 24, y + 42, 'Tasa efectiva', { size: 20, fill: C.slateSoft, anchor: 'end', weight: 400 })
  s += text(W - M - 24, y + 78, '9.35 %', { size: 32, fill: C.white, anchor: 'end' })
  const nota = parrafo(M, y + 140, 'Tarifa del artículo 96 de la LISR publicada en el Anexo 8 de la Resolución Miscelánea Fiscal 2026.', { size: 19, max: 70, anchor: 'start', fill: C.slateMid, weight: 400 })
  const alto = Math.round(y + 140 + nota.h + 60)
  return lienzo({ alto, slug: 'calculadora-isr', titulo: 'Cómo se calcula el ISR mensual de un sueldo en 2026', subtitulo: 'Ejemplo: sueldo mensual gravable de $15,000', cuerpo: s + nota.svg })
}

// ─────────────────────────────────────────────────────────── Texto invisible
function textoInvisible() {
  const filas = [
    ['U+3164', 'Relleno hangul', true, 'Nombres y mensajes «en blanco» en juegos y apps'],
    ['U+2800', 'Braille en blanco', true, 'Mensajes, bios y apodos vacíos'],
    ['U+200B', 'Espacio de ancho cero', false, 'Separar palabras o enlaces sin espacio visible'],
    ['U+200C', 'No unificador de ancho cero', false, 'Evitar que dos letras se unan'],
    ['U+200D', 'Unificador de ancho cero', false, 'Unir emojis compuestos, como familias'],
    ['U+00A0', 'Espacio de no separación', true, 'Que dos palabras no se separen de línea'],
    ['U+3000', 'Espacio ideográfico', true, 'Un espacio ancho, como un carácter chino'],
  ]
  let s = ''
  const y0 = 186
  s += text(M + 4, y0, 'Código', { size: 17, fill: C.slateMid, anchor: 'start', weight: 400 })
  s += text(M + 140, y0, 'Nombre y uso habitual', { size: 17, fill: C.slateMid, anchor: 'start', weight: 400 })
  s += text(W - M, y0, '¿Se ve el hueco?', { size: 17, fill: C.slateMid, anchor: 'end', weight: 400 })
  filas.forEach(([cod, nombre, ocupa, uso], i) => {
    const y = y0 + 16 + i * 74
    if (i % 2 === 0) s += rect(M - 10, y, W - 2 * M + 20, 70, { rx: 12, fill: C.paper })
    s += rect(M, y + 18, 120, 36, { rx: 18, fill: C.purpleXs }) + text(M + 60, y + 43, cod, { size: 18, fill: C.purpleDark })
    s += text(M + 140, y + 32, nombre, { size: 21, fill: C.slate, anchor: 'start' })
    s += text(M + 140, y + 58, uso, { size: 17, fill: C.slateMid, anchor: 'start', weight: 400 })
    s += rect(W - M - 64, y + 20, 64, 32, { rx: 16, fill: ocupa ? C.greenSoft : C.line })
    s += text(W - M - 32, y + 42, ocupa ? 'Sí' : 'No', { size: 17, fill: ocupa ? C.green : C.slateMid })
  })
  const fy = y0 + 16 + filas.length * 74 + 30
  const nota = parrafo(M, fy, 'Los de ancho cero no dejan hueco y muchas apps los eliminan; para un nombre o un mensaje en blanco funcionan mejor U+3164 y U+2800.', { size: 19, max: 70, anchor: 'start', fill: C.slateMid, weight: 400 })
  const alto = Math.round(fy + nota.h + 60)
  return lienzo({ alto, slug: 'texto-invisible', titulo: 'Los caracteres invisibles de Unicode y para qué sirve cada uno', subtitulo: 'Todos se pueden copiar con el generador de texto invisible', cuerpo: s + nota.svg })
}

const pieza = (archivo, alt, fn) => ({ archivo, alt, dibujar: fn })

module.exports = [
  pieza('partes-del-rfc-persona-fisica', 'Partes del RFC de una persona física: letras de apellidos y nombre, fecha de nacimiento y homoclave', rfc),
  pieza('tabla-imc-oms-adultos', 'Tabla de clasificación del IMC según la OMS con la fórmula y un ejemplo de 70 kg y 1,75 m', imc),
  pieza('como-calcular-edad-exacta', 'Cómo calcular la edad exacta en años, meses y días con un ejemplo en una línea de tiempo', edad),
  pieza('suma-en-columna-con-llevadas', 'Suma en columna con llevadas paso a paso: 478 más 356 igual a 834', alicia),
  pieza('partes-de-un-codigo-qr', 'Partes de un código QR y niveles de corrección de errores L, M, Q y H', qr),
  pieza('tabla-minutos-a-horas-decimales', 'Tabla para convertir minutos a horas decimales con un ejemplo de jornada laboral', horas),
  pieza('grados-y-radianes-calculadora', 'Diferencia entre grados y radianes en la calculadora científica con el seno de 30', cientifica),
  pieza('conceptos-finiquito-indemnizacion-espana', 'Conceptos del finiquito y días de indemnización por año según el tipo de despido en España', finiquito),
  pieza('calculo-isr-mensual-2026-ejemplo', 'Cálculo del ISR mensual 2026 paso a paso con la tarifa del SAT para un sueldo de 15 mil pesos', isr),
  pieza('caracteres-invisibles-unicode', 'Tabla de caracteres invisibles de Unicode como U+3164 y U+200B con su uso', textoInvisible),
]
