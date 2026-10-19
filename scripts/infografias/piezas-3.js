// Infografías del lote 3 (herramientas 21 a 30).
const { C, text, rect, circle } = require('../illustrations/kit')
const { W, M, parrafo, lienzo, linea } = require('./piezas').util

const nota = (y, t) => parrafo(M, y, t, { size: 19, max: 70, anchor: 'start', fill: C.slateMid, weight: 400 })
const mx = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const es = (n, d = 2) => n.toLocaleString('es-ES', { minimumFractionDigits: d, maximumFractionDigits: d, useGrouping: 'always' })

// ─────────────────────────────────────────────────────────── Préstamo: amortización francesa
function prestamo() {
  const P = 100000
  const r = 0.18 / 12
  const n = 12
  const cuota = (P * r * (1 + r) ** n) / ((1 + r) ** n - 1)
  let saldo = P
  const meses = []
  for (let i = 1; i <= n; i++) {
    const interes = saldo * r
    const capital = cuota - interes
    saldo -= capital
    meses.push({ i, interes, capital })
  }
  const base = 500
  const alto = 260
  const bw = (W - 2 * M - (n - 1) * 10) / n
  let s = text(M, 176, `Cuota fija: $${mx(cuota)} al mes`, { size: 24, fill: C.slate, anchor: 'start' })
  s += rect(M, 192, 18, 18, { rx: 4, fill: C.purple }) + text(M + 26, 207, 'Capital', { size: 18, fill: C.slate, anchor: 'start', weight: 400 })
  s += rect(M + 120, 192, 18, 18, { rx: 4, fill: C.amber }) + text(M + 146, 207, 'Intereses', { size: 18, fill: C.slate, anchor: 'start', weight: 400 })
  meses.forEach((m, k) => {
    const x = M + k * (bw + 10)
    const hi = (m.interes / cuota) * alto
    const hc = (m.capital / cuota) * alto
    s += rect(x, base - hc, bw, hc, { rx: 4, fill: C.purple })
    s += rect(x, base - hc - hi, bw, hi, { rx: 4, fill: C.amber })
    s += text(x + bw / 2, base + 26, String(m.i), { size: 17, fill: C.slateMid, weight: 400 })
  })
  s += text(W / 2, base + 52, 'Mes', { size: 17, fill: C.slateMid, weight: 400 })
  const filas = [meses[0], meses[5], meses[11]]
  let y = base + 90
  s += text(M, y, 'Mes', { size: 17, fill: C.slateMid, anchor: 'start', weight: 400 })
  s += text(M + 260, y, 'Intereses', { size: 17, fill: C.slateMid, anchor: 'end', weight: 400 })
  s += text(W - M, y, 'Capital', { size: 17, fill: C.slateMid, anchor: 'end', weight: 400 })
  filas.forEach((m) => {
    y += 40
    s += linea(M, y - 28, W - M, y - 28, C.line, 2)
    s += text(M, y, `Mes ${m.i}`, { size: 20, fill: C.slate, anchor: 'start' })
    s += text(M + 260, y, `$${mx(m.interes)}`, { size: 20, fill: C.amberDark, anchor: 'end' })
    s += text(W - M, y, `$${mx(m.capital)}`, { size: 20, fill: C.purple, anchor: 'end' })
  })
  const total = cuota * n - P
  s += rect(M, y + 24, W - 2 * M, 60, { rx: 14, fill: C.slate })
  s += text(W / 2, y + 62, `Intereses totales del préstamo: $${mx(total)}`, { size: 22, fill: C.white })
  const nt = nota(y + 124, 'El interés de cada mes se calcula sobre lo que aún debes. Por eso al principio pagas más intereses y al final casi todo es capital.')
  return lienzo({ alto: Math.round(y + 124 + nt.h + 60), slug: 'calculadora-prestamo', titulo: 'Cómo se reparte cada cuota de un préstamo', subtitulo: 'Ejemplo: $100,000 al 18 % anual a 12 meses (sistema francés)', cuerpo: s + nt.svg })
}

// ─────────────────────────────────────────────────────────── Equivalencias de unidades
function unidades() {
  const eq = [
    ['1 pulgada', '2,54 cm', C.purple, C.purpleXs],
    ['1 pie', '30,48 cm', C.purple, C.purpleXs],
    ['1 milla', '1,609 km', C.purple, C.purpleXs],
    ['1 libra', '453,6 g', C.blue, C.blueSoft],
    ['1 onza', '28,35 g', C.blue, C.blueSoft],
    ['1 galón (EE. UU.)', '3,785 L', C.teal, C.tealSoft],
    ['1 bar', '14,50 PSI', C.amberDark, C.amberSoft],
    ['1 HP', '745,7 W', C.pink, C.pinkSoft],
    ['1 CV', '735,5 W', C.pink, C.pinkSoft],
  ]
  const cw = (W - 2 * M - 24) / 3
  let s = ''
  eq.forEach(([a, b, col, suave], i) => {
    const x = M + (i % 3) * (cw + 12)
    const y = 176 + Math.floor(i / 3) * 122
    s += rect(x, y, cw, 108, { rx: 16, fill: suave })
    s += text(x + cw / 2, y + 42, a, { size: 20, fill: C.slate, weight: 400 })
    s += text(x + cw / 2, y + 82, `= ${b}`, { size: 28, fill: col })
  })
  const ty = 176 + 3 * 122 + 20
  s += rect(M, ty, W - 2 * M, 112, { rx: 16, fill: C.white, stroke: C.line, sw: 2 })
  s += text(M + 22, ty + 40, 'Temperatura: no basta con multiplicar', { size: 21, fill: C.slate, anchor: 'start' })
  s += text(M + 22, ty + 80, '°F = °C × 1,8 + 32', { size: 26, fill: C.red, anchor: 'start' })
  s += text(W - M - 22, ty + 80, '°C = (°F − 32) ÷ 1,8', { size: 26, fill: C.blue, anchor: 'end' })
  const nt = nota(ty + 156, 'El HP (horsepower) y el CV (caballo de vapor) no son iguales: el HP es un 1,4 % mayor.')
  return lienzo({ alto: Math.round(ty + 156 + nt.h + 60), slug: 'convertidor-unidades', titulo: 'Las equivalencias de unidades que más se buscan', cuerpo: s + nt.svg })
}

// ─────────────────────────────────────────────────────────── Nombres
function nombres() {
  let s = text(M, 176, 'Así se forma un nombre de fantasía', { size: 23, fill: C.slate, anchor: 'start' })
  const ejemplos = [['Kael', 'wyn'], ['Thal', 'ora'], ['Drak', 'thor'], ['Sil', 'ven', 'ora']]
  ejemplos.forEach((partes, i) => {
    const y = 200 + i * 72
    let x = M
    partes.forEach((p, k) => {
      const w = 34 + p.length * 15
      s += rect(x, y, w, 52, { rx: 12, fill: k === 0 ? C.purple : C.purpleXs })
      s += text(x + w / 2, y + 35, p, { size: 22, fill: k === 0 ? C.white : C.purpleDark })
      x += w + 8
      if (k < partes.length - 1) { s += text(x + 4, y + 34, '+', { size: 22, fill: C.slateMid }); x += 24 }
    })
    s += text(x + 18, y + 35, '→', { size: 22, fill: C.slateMid, anchor: 'start' })
    s += text(x + 52, y + 35, partes.join(''), { size: 26, fill: C.slate, anchor: 'start' })
  })
  s += text(M, 520, 'Prefijo (20 opciones) + 1 o 2 terminaciones (20 opciones)', { size: 18, fill: C.slateMid, anchor: 'start', weight: 400 })
  const ty = 580
  s += text(M, ty, 'Cómo elegir el nombre de una mascota', { size: 23, fill: C.slate, anchor: 'start' })
  const tips = [
    ['Una o dos sílabas', 'Luna, Toby o Kira se dicen rápido.'],
    ['Que no suene a una orden', 'Mo se confunde con «no».'],
    ['Fácil de llamar en voz alta', 'Pruébalo como si estuvieras en el parque.'],
    ['Que te siga gustando', 'Lo vas a repetir durante años.'],
  ]
  const cw = (W - 2 * M - 12) / 2
  tips.forEach(([t, d], i) => {
    const x = M + (i % 2) * (cw + 12)
    const y = ty + 20 + Math.floor(i / 2) * 96
    s += rect(x, y, cw, 84, { rx: 14, fill: C.tealSoft })
    s += text(x + 18, y + 34, t, { size: 20, fill: C.teal, anchor: 'start' })
    s += text(x + 18, y + 64, d, { size: 17, fill: C.slate, anchor: 'start', weight: 400 })
  })
  return lienzo({ alto: ty + 20 + 2 * 96 + 70, slug: 'generador-nombres', titulo: 'De dónde salen los nombres del generador', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── Formatos de imagen
function formatos() {
  const cols = ['JPG', 'PNG', 'WEBP']
  const filas = [
    ['Transparencia', ['No', 'Sí', 'Sí']],
    ['Compresión', ['Con pérdida', 'Sin pérdida', 'Ambas']],
    ['Peso de una foto', ['Ligero', 'Pesado', 'El más ligero']],
    ['Texto y logos nítidos', ['Regular', 'Excelente', 'Muy bueno']],
    ['Compatibilidad', ['Universal', 'Universal', 'Navegadores actuales']],
  ]
  const c0 = 250
  const cw = (W - M - c0) / 3
  let s = ''
  cols.forEach((c, i) => {
    const x = c0 + i * cw
    s += rect(x + 6, 166, cw - 12, 56, { rx: 14, fill: [C.amber, C.blue, C.green][i] })
    s += text(x + cw / 2, 203, c, { size: 24, fill: C.white })
  })
  filas.forEach(([t, v], i) => {
    const y = 240 + i * 66
    if (i % 2 === 0) s += rect(M - 8, y, W - 2 * M + 16, 60, { rx: 10, fill: C.paper })
    s += text(M, y + 38, t, { size: 19, fill: C.slate, anchor: 'start' })
    v.forEach((val, k) => {
      const bueno = ['Sí', 'Excelente', 'El más ligero', 'Universal', 'Ligero', 'Muy bueno', 'Ambas'].includes(val)
      s += text(c0 + k * cw + cw / 2, y + 38, val, { size: 18, fill: bueno ? C.green : C.slate, weight: bueno ? 700 : 400 })
    })
  })
  const uy = 240 + filas.length * 66 + 26
  s += text(M, uy, 'Úsalo para', { size: 22, fill: C.slate, anchor: 'start' })
  const usos = [['JPG', 'Fotos para enviar o imprimir'], ['PNG', 'Logos, capturas y fondos transparentes'], ['WEBP', 'Imágenes para tu web']]
  usos.forEach(([f, u], i) => {
    const y = uy + 22 + i * 54
    s += rect(M, y, 90, 42, { rx: 10, fill: [C.amber, C.blue, C.green][i] }) + text(M + 45, y + 28, f, { size: 18, fill: C.white })
    s += text(M + 108, y + 28, u, { size: 20, fill: C.slate, anchor: 'start', weight: 400 })
  })
  const nt = nota(uy + 22 + 3 * 54 + 24, 'Pasar un JPG a PNG no recupera la calidad perdida: solo hace el archivo más pesado.')
  return lienzo({ alto: Math.round(uy + 22 + 3 * 54 + 24 + nt.h + 60), slug: 'convertidor-imagenes', titulo: 'JPG, PNG o WEBP: qué formato de imagen usar', cuerpo: s + nt.svg })
}

// ─────────────────────────────────────────────────────────── Imágenes a PDF: encaje en la página
function imagenesPdf() {
  const hoja = (x, y, w, h, img, etiqueta, sub) => {
    let o = rect(x, y, w, h, { rx: 6, fill: C.white, stroke: C.slateSoft, sw: 2 })
    const m = w * (10 / 210)
    o += `<rect x="${x + m}" y="${y + m}" width="${w - 2 * m}" height="${h - 2 * m}" fill="none" stroke="${C.purple}" stroke-width="1.5" stroke-dasharray="6 5"/>`
    const [iw, ih] = img
    const esc = Math.min((w - 2 * m) / iw, (h - 2 * m) / ih)
    const dw = iw * esc
    const dh = ih * esc
    o += rect(x + (w - dw) / 2, y + (h - dh) / 2, dw, dh, { rx: 4, fill: C.blueSoft, stroke: C.blue, sw: 2 })
    o += circle(x + (w - dw) / 2 + dw * 0.3, y + (h - dh) / 2 + dh * 0.32, Math.min(dw, dh) * 0.09, { fill: C.amber })
    o += `<path d="M${x + (w - dw) / 2 + 4},${y + (h + dh) / 2 - 4} L${x + w / 2 - dw * 0.1},${y + h / 2} L${x + w / 2 + dw * 0.1},${y + h / 2 + dh * 0.15} L${x + (w + dw) / 2 - 4},${y + (h + dh) / 2 - 4} Z" fill="${C.blue}" opacity="0.5"/>`
    o += text(x + w / 2, y + h + 32, etiqueta, { size: 20, fill: C.slate })
    o += text(x + w / 2, y + h + 58, sub, { size: 17, fill: C.slateMid, weight: 400 })
    return o
  }
  let s = hoja(M + 20, 180, 210, 297, [4, 3], 'Foto horizontal', 'en página vertical')
  s += hoja(M + 270, 180, 210, 297, [3, 4], 'Foto vertical', 'en página vertical')
  s += hoja(M + 520, 222, 200, 141, [4, 3], 'Foto horizontal', 'con orientación auto')
  const ly = 180 + 297 + 100
  const lista = [
    ['Página A4', '210 × 297 mm, el tamaño estándar para imprimir y enviar.'],
    ['Margen normal', '10 mm por lado (línea discontinua). «Sin margen» usa toda la hoja.'],
    ['Sin deformar', 'Cada imagen se escala hasta tocar un borde y se centra.'],
  ]
  let y = ly
  lista.forEach(([t, d]) => {
    s += circle(M + 10, y - 7, 7, { fill: C.purple })
    s += text(M + 28, y, t, { size: 20, fill: C.slate, anchor: 'start' })
    const p = parrafo(M + 200, y, d, { size: 19, max: 46, anchor: 'start', weight: 400 })
    s += p.svg
    y += Math.max(44, p.h + 18)
  })
  return lienzo({ alto: Math.round(y + 50), slug: 'imagenes-a-pdf', titulo: 'Cómo se coloca cada imagen en el PDF', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── Números a letras
function numerosLetras() {
  const reglas = [
    ['21.000', 'veintiún mil', 'no «veintiuno mil»'],
    ['100', 'cien', 'pero 101 es «ciento uno»'],
    ['500', 'quinientos', 'no «cincocientos»'],
    ['700', 'setecientos', 'no «sietecientos»'],
    ['900', 'novecientos', 'no «nuevecientos»'],
    ['1.000.000', 'un millón', 'y 2.000.000, «dos millones»'],
  ]
  let s = ''
  reglas.forEach(([n, l, d], i) => {
    const y = 176 + i * 74
    if (i % 2 === 0) s += rect(M - 8, y, W - 2 * M + 16, 66, { rx: 12, fill: C.paper })
    s += text(M + 6, y + 42, n, { size: 26, fill: C.purple, anchor: 'start' })
    s += text(M + 210, y + 32, l, { size: 23, fill: C.slate, anchor: 'start' })
    s += text(M + 210, y + 56, d, { size: 17, fill: C.slateMid, anchor: 'start', weight: 400 })
  })
  const cy = 176 + reglas.length * 74 + 30
  s += text(M, cy, 'Formato de cheque', { size: 22, fill: C.slate, anchor: 'start' })
  s += rect(M, cy + 18, W - 2 * M, 136, { rx: 16, fill: C.greenSoft, stroke: C.green, sw: 2 })
  s += text(M + 24, cy + 62, '$1,235.50', { size: 30, fill: C.green, anchor: 'start' })
  s += text(M + 24, cy + 102, 'MIL DOSCIENTOS TREINTA Y CINCO PESOS', { size: 22, fill: C.slate, anchor: 'start' })
  s += text(M + 24, cy + 132, '50/100 M.N.', { size: 22, fill: C.slate, anchor: 'start' })
  const nt = nota(cy + 196, 'Del 16 al 29 se escribe en una sola palabra: dieciséis, veintidós, veintinueve. Desde el 31, con «y»: treinta y uno.')
  return lienzo({ alto: Math.round(cy + 196 + nt.h + 60), slug: 'convertidor-numeros-a-letras', titulo: 'Los números que más se escriben mal en letras', cuerpo: s + nt.svg })
}

// ─────────────────────────────────────────────────────────── Fracciones
function fracciones() {
  const frac = (x, y, a, b, col = C.slate, size = 34) =>
    text(x, y, String(a), { size, fill: col }) + linea(x - size * 0.7, y + 12, x + size * 0.7, y + 12, col, 3) + text(x, y + 12 + size, String(b), { size, fill: col })
  let s = text(M, 176, 'Simplificar: divide arriba y abajo entre el MCD', { size: 22, fill: C.slate, anchor: 'start' })
  s += frac(M + 60, 240, 8, 12)
  s += text(M + 205, 236, '÷ 4', { size: 24, fill: C.purple })
  s += `<path d="M${M + 120},250 H${M + 290}" stroke="${C.slateSoft}" stroke-width="3"/><path d="M${M + 280},242 L${M + 292},250 L${M + 280},258" fill="none" stroke="${C.slateSoft}" stroke-width="3"/>`
  s += frac(M + 340, 240, 2, 3, C.purple)
  s += text(M + 420, 262, 'MCD(8, 12) = 4', { size: 20, fill: C.slateMid, anchor: 'start', weight: 400 })
  s += text(M, 360, 'Impropia a mixta: divide el numerador', { size: 22, fill: C.slate, anchor: 'start' })
  s += frac(M + 60, 420, 11, 4)
  s += text(M + 200, 442, '11 ÷ 4 = 2 y sobran 3', { size: 20, fill: C.slateMid, weight: 400 })
  s += text(M + 340, 448, '2', { size: 46, fill: C.teal })
  s += frac(M + 390, 420, 3, 4, C.teal)
  const ty = 540
  s += text(M, ty, 'Fracciones y decimales que conviene saber', { size: 22, fill: C.slate, anchor: 'start' })
  const tabla = [['1/2', '0,5'], ['1/4', '0,25'], ['3/4', '0,75'], ['1/5', '0,2'], ['1/8', '0,125'], ['1/3', '0,333…'], ['2/3', '0,666…'], ['1/10', '0,1']]
  const tw = (W - 2 * M - 36) / 4
  tabla.forEach(([f, d], i) => {
    const x = M + (i % 4) * (tw + 12)
    const y = ty + 20 + Math.floor(i / 4) * 86
    s += rect(x, y, tw, 74, { rx: 12, fill: i >= 5 && i <= 6 ? C.amberSoft : C.purpleXs })
    s += text(x + tw / 2, y + 32, f, { size: 22, fill: C.slate })
    s += text(x + tw / 2, y + 60, d, { size: 20, fill: C.purpleDark, weight: 400 })
  })
  const nt = nota(ty + 20 + 2 * 86 + 30, 'Los tercios dan decimales periódicos: sus cifras se repiten sin fin, por eso se redondean.')
  return lienzo({ alto: Math.round(ty + 20 + 2 * 86 + 30 + nt.h + 60), slug: 'convertidor-fracciones', titulo: 'Cómo simplificar y convertir fracciones', cuerpo: s + nt.svg })
}

// ─────────────────────────────────────────────────────────── Mayúsculas y minúsculas
function mayusculas() {
  const frase = 'el arte de escribir bien en internet'
  const minus = new Set(['de', 'la', 'el', 'los', 'las', 'y', 'en', 'a', 'un', 'una', 'con', 'del', 'al', 'o', 'que'])
  const titulo = frase.split(' ').map((p, i) => (i > 0 && minus.has(p) ? p : p[0].toUpperCase() + p.slice(1))).join(' ')
  const oracion = frase[0].toUpperCase() + frase.slice(1)
  const alternado = [...frase].map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase())).join('')
  const filas = [
    ['MAYÚSCULAS', frase.toUpperCase(), 'Avisos y siglas. En mensajes se lee como gritar.'],
    ['minúsculas', frase, 'Etiquetas, usuarios y direcciones web.'],
    ['Tipo título', titulo, 'Títulos al estilo inglés, sin artículos ni preposiciones.'],
    ['Tipo oración', oracion, 'Lo correcto en español para títulos y textos.'],
    ['aLtErNaDo', alternado, 'Memes y tono burlón.'],
  ]
  let s = ''
  filas.forEach(([f, ej, uso], i) => {
    const y = 176 + i * 108
    s += rect(M, y, W - 2 * M, 96, { rx: 14, fill: i === 3 ? C.greenSoft : C.white, stroke: i === 3 ? C.green : C.line, sw: 2 })
    s += text(M + 20, y + 30, f, { size: 18, fill: i === 3 ? C.green : C.purple, anchor: 'start' })
    s += text(M + 20, y + 62, ej, { size: 23, fill: C.slate, anchor: 'start' })
    s += text(M + 20, y + 86, uso, { size: 16, fill: C.slateMid, anchor: 'start', weight: 400 })
  })
  const nt = nota(176 + 5 * 108 + 16, 'La RAE recomienda en títulos de libros y artículos solo la mayúscula inicial y la de los nombres propios: «Cien años de soledad».')
  return lienzo({ alto: Math.round(176 + 5 * 108 + 16 + nt.h + 60), slug: 'convertidor-mayusculas-minusculas', titulo: 'Los 5 formatos de mayúsculas y cuándo usar cada uno', cuerpo: s + nt.svg })
}

// ─────────────────────────────────────────────────────────── Binario
function binario() {
  let s = ''
  const cab = ['Decimal', 'Binario', 'Hex', 'Octal']
  const cx = [M + 70, M + 250, M + 410, M + 520]
  cab.forEach((c, i) => { s += text(cx[i], 176, c, { size: 18, fill: C.slateMid, weight: 400 }) })
  for (let n = 0; n <= 15; n++) {
    const col = n < 8 ? 0 : 1
    const y = 198 + (n % 8) * 46
    const ox = col * 0
    if (col === 1) continue
    s += rect(M - 8 + ox, y, 590, 40, { rx: 8, fill: n % 2 ? C.white : C.paper })
    s += text(cx[0], y + 28, String(n), { size: 21, fill: C.slate })
    s += text(cx[1], y + 28, n.toString(2).padStart(4, '0'), { size: 21, fill: C.purple })
    s += text(cx[2], y + 28, n.toString(16).toUpperCase(), { size: 21, fill: C.blue })
    s += text(cx[3], y + 28, n.toString(8), { size: 21, fill: C.teal })
  }
  // Segunda mitad, a la derecha y compacta
  for (let n = 8; n <= 15; n++) {
    const y = 198 + (n - 8) * 46
    s += rect(M + 600, y, W - 2 * M - 600, 40, { rx: 8, fill: n % 2 ? C.white : C.paper })
    s += text(M + 630, y + 28, String(n), { size: 19, fill: C.slate })
    s += text(W - M - 10, y + 28, n.toString(2), { size: 19, fill: C.purple, anchor: 'end' })
  }
  const dy = 198 + 8 * 46 + 40
  s += text(M, dy, 'De decimal a binario: divide entre 2 y lee los restos de abajo arriba', { size: 20, fill: C.slate, anchor: 'start' })
  const divs = [['13 ÷ 2 = 6', '1'], ['6 ÷ 2 = 3', '0'], ['3 ÷ 2 = 1', '1'], ['1 ÷ 2 = 0', '1']]
  divs.forEach(([d, r], i) => {
    const y = dy + 22 + i * 48
    s += rect(M, y, 330, 40, { rx: 8, fill: C.paper })
    s += text(M + 16, y + 28, d, { size: 20, fill: C.slate, anchor: 'start', weight: 400 })
    s += text(M + 300, y + 28, `resto ${r}`, { size: 19, fill: C.purple, anchor: 'end' })
  })
  s += `<path d="M${M + 360},${dy + 22 + 3 * 48 + 20} V${dy + 42}" stroke="${C.purple}" stroke-width="3"/><path d="M${M + 352},${dy + 52} L${M + 360},${dy + 40} L${M + 368},${dy + 52}" fill="none" stroke="${C.purple}" stroke-width="3"/>`
  s += rect(M + 400, dy + 60, W - M - (M + 400), 110, { rx: 16, fill: C.purpleXs })
  s += text((M + 400 + W - M) / 2, dy + 104, '13 en binario', { size: 20, fill: C.slate, weight: 400 })
  s += text((M + 400 + W - M) / 2, dy + 148, '1101', { size: 40, fill: C.purpleDark })
  return lienzo({ alto: dy + 22 + 4 * 48 + 76, slug: 'convertidor-binario', titulo: 'Tabla de binario, hexadecimal y octal del 0 al 15', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── IRPF España
function irpf() {
  const tramos = [
    ['Hasta 12.450 €', 9.5],
    ['12.450 a 20.200 €', 12],
    ['20.200 a 35.200 €', 15],
    ['35.200 a 60.000 €', 18.5],
    ['60.000 a 300.000 €', 22.5],
    ['Más de 300.000 €', 24.5],
  ]
  let s = text(M, 176, 'Escala estatal (art. 63 LIRPF)', { size: 21, fill: C.slate, anchor: 'start' })
  s += text(W - M, 176, 'Total si la autonómica es igual', { size: 17, fill: C.slateMid, anchor: 'end', weight: 400 })
  const ancho = 340
  tramos.forEach(([t, p], i) => {
    const y = 196 + i * 56
    s += text(M, y + 30, t, { size: 19, fill: C.slate, anchor: 'start', weight: 400 })
    s += rect(M + 220, y + 8, (p / 24.5) * ancho, 32, { rx: 8, fill: C.purple })
    s += text(M + 220 + (p / 24.5) * ancho + 10, y + 31, `${es(p, p % 1 ? 1 : 0)} %`, { size: 19, fill: C.purple, anchor: 'start' })
    s += text(W - M, y + 31, `${es(p * 2, p % 1 ? 0 : 0)} %`, { size: 21, fill: C.slate, anchor: 'end' })
  })
  const ey = 196 + 6 * 56 + 40
  s += text(M, ey, 'Ejemplo: 30.000 € brutos al año, sin hijos, menos de 65 años', { size: 20, fill: C.slate, anchor: 'start' })
  const pasos = [
    ['Seguridad Social (6,5 %)', '− 1.950,00 €'],
    ['Otros gastos (art. 19)', '− 2.000,00 €'],
    ['Base liquidable', '26.050,00 €'],
    ['Cuota estatal menos la del mínimo personal (5.550 €)', '2.463,00 €'],
    ['IRPF total estimado (× 2)', '4.926,00 €'],
  ]
  pasos.forEach(([a, b], i) => {
    const y = ey + 20 + i * 52
    const fuerte = i === 4
    s += rect(M, y, W - 2 * M, 44, { rx: 10, fill: fuerte ? C.purpleXs : i === 2 ? C.paper : C.white, stroke: fuerte ? C.purple : C.line, sw: 2 })
    s += text(M + 16, y + 29, a, { size: 18, fill: C.slate, anchor: 'start', weight: 400 })
    s += text(W - M - 16, y + 29, b, { size: 20, fill: fuerte ? C.purple : C.slate, anchor: 'end' })
  })
  const fy = ey + 20 + 5 * 52 + 16
  s += rect(M, fy, W - 2 * M, 66, { rx: 14, fill: C.slate })
  s += text(M + 22, fy + 42, 'Neto: 23.124 € al año', { size: 23, fill: C.white, anchor: 'start' })
  s += text(W - M - 22, fy + 42, 'Tipo efectivo 16,4 %', { size: 21, fill: C.slateSoft, anchor: 'end' })
  const nt = nota(fy + 110, 'Cada comunidad autónoma fija su propia escala, así que tu IRPF real puede variar unos cientos de euros.')
  return lienzo({ alto: Math.round(fy + 110 + nt.h + 60), slug: 'calculadora-irpf', titulo: 'Tramos del IRPF y cálculo de un sueldo de 30.000 €', cuerpo: s + nt.svg })
}

const pieza = (archivo, alt, fn) => ({ archivo, alt, dibujar: fn })

module.exports = [
  pieza('amortizacion-prestamo-cuota-fija', 'Reparto de capital e intereses en cada cuota de un préstamo de 100 mil pesos a 12 meses', prestamo),
  pieza('equivalencias-unidades-medida', 'Equivalencias de pulgadas, pies, millas, libras, onzas, galones, bar, HP y CV, y fórmula de grados', unidades),
  pieza('nombres-fantasia-y-mascotas', 'Cómo se forman los nombres de fantasía y consejos para elegir el nombre de una mascota', nombres),
  pieza('jpg-png-webp-diferencias', 'Diferencias entre JPG, PNG y WEBP: transparencia, compresión, peso y usos', formatos),
  pieza('imagenes-en-pdf-tamano-a4', 'Cómo se ajustan las fotos verticales y horizontales en una página A4 del PDF', imagenesPdf),
  pieza('numeros-en-letras-reglas', 'Reglas para escribir números en letras en español y ejemplo en formato de cheque', numerosLetras),
  pieza('simplificar-fracciones-decimales', 'Cómo simplificar fracciones, pasar de impropia a mixta y tabla de fracciones a decimales', fracciones),
  pieza('formatos-mayusculas-minusculas', 'Los cinco formatos de mayúsculas y minúsculas con un ejemplo y su uso', mayusculas),
  pieza('tabla-binario-hexadecimal-octal', 'Tabla de números del 0 al 15 en binario, hexadecimal y octal, y conversión de 13 a binario', binario),
  pieza('tramos-irpf-ejemplo-30000', 'Tramos del IRPF estatal y ejemplo de cálculo para un sueldo de 30 mil euros', irpf),
]
