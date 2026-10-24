// Infografías del lote 9 (herramientas 81 a 90).
const { rect, circle } = require('../illustrations/kit')
const { tema, W, M, es } = require('./piezas-4').temas

// ─────────────────────────────────────────────────────────── 81 Gratificación Perú (papel)
function gratificacion() {
  const T = tema('papel', { accent: '#B91C1C', soft: '#FEE2E2' })
  let s = T.tx(M, 184, 'Sueldo de S/ 2.500, semestre completo', { size: 24, weight: 700, family: T.titulo })
  const ancho = W - 2 * M
  const total = 2725
  s += rect(M, 206, (2500 / total) * ancho, 64, { rx: 10, fill: T.accent })
  s += rect(M + (2500 / total) * ancho, 206, (225 / total) * ancho, 64, { rx: 0, fill: '#F59E0B' })
  s += T.tx(M + 20, 246, 'Gratificación S/ 2.500', { size: 21, weight: 700, fill: '#FFF' })
  s += T.tx(W - M - 8, 296, '+ 9 %: S/ 225', { size: 17, anchor: 'end', fill: '#B45309', weight: 700 })
  s += T.tx(M, 350, 'Total que recibes', { size: 20, fill: T.muted })
  s += T.tx(W - M, 352, 'S/ 2.725', { size: 40, weight: 700, anchor: 'end', fill: T.accent, family: T.titulo })
  const ty = 400
  s += `<line x1="${M}" y1="${ty}" x2="${W - M}" y2="${ty}" stroke="${T.line}" stroke-width="2"/>`
  const filas = [['Si trabajaste 4 meses', 'S/ 2.500 ÷ 6 × 4 = S/ 1.666,67'], ['Bonificación con EsSalud', '9 % de la gratificación'], ['Bonificación con EPS', '6,75 % de la gratificación']]
  filas.forEach(([a, b], i) => {
    const y = ty + 40 + i * 52
    s += T.tx(M, y, a, { size: 20, family: T.titulo })
    s += T.tx(W - M, y, b, { size: 18, anchor: 'end', weight: 700 })
  })
  const cy = ty + 40 + 3 * 52 + 10
  const cw = (W - 2 * M - 16) / 2
  s += rect(M, cy, cw, 82, { rx: 14, fill: T.soft }) + T.tx(M + 20, cy + 34, 'Fiestas Patrias', { size: 19, weight: 700, fill: T.accent }) + T.tx(M + 20, cy + 62, 'hasta el 15 de julio · enero a junio', { size: 15, fill: T.muted })
  s += rect(M + cw + 16, cy, cw, 82, { rx: 14, fill: T.soft }) + T.tx(M + cw + 36, cy + 34, 'Navidad', { size: 19, weight: 700, fill: T.accent }) + T.tx(M + cw + 36, cy + 62, 'hasta el 15 de diciembre · julio a diciembre', { size: 15, fill: T.muted })
  const n = T.nota(cy + 122, 'Solo cuentan los meses calendario completos trabajados en el semestre. La gratificación no tiene descuento de AFP ni ONP.')
  return T.lienzo({ alto: Math.round(cy + 122 + n.h + 64), slug: 'calcular-gratificacion-peru', titulo: 'Cuánto es la gratificación de julio y diciembre en Perú', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 82 IGV Perú (pizarra)
function igv() {
  const T = tema('pizarra')
  let s = T.tx(M, 190, 'IGV 18 % = 16 % IGV + 2 % IPM', { size: 30, family: T.titulo, fill: T.accent })
  s += T.tx(M, 224, 'El 2 % es el Impuesto de Promoción Municipal, que se cobra junto al IGV.', { size: 17, fill: T.muted })
  const cw = (W - 2 * M - 20) / 2
  const caja = (x, t, a, b, c) =>
    rect(x, 260, cw, 190, { rx: 16, fill: T.soft, stroke: T.line, sw: 2 }) +
    T.tx(x + 20, 296, t, { size: 20, weight: 700, fill: T.accent, family: T.titulo }) +
    T.tx(x + 20, 346, a, { size: 26, family: T.titulo }) +
    T.tx(x + 20, 386, b, { size: 20 }) +
    T.tx(x + 20, 424, c, { size: 16, fill: T.muted })
  s += caja(M, 'Agregar el IGV', 'S/ 100 × 1,18', '= S/ 118', 'valor de venta → precio de venta')
  s += caja(M + cw + 20, 'Quitar el IGV', 'S/ 118 ÷ 1,18', '= S/ 100', 'precio de venta → valor de venta')
  const ty = 490
  s += T.tx(M, ty, 'Montos frecuentes', { size: 20, weight: 700 })
  const filas = [['S/ 50', 'S/ 9', 'S/ 59'], ['S/ 250', 'S/ 45', 'S/ 295'], ['S/ 1.000', 'S/ 180', 'S/ 1.180'], ['S/ 5.000', 'S/ 900', 'S/ 5.900']]
  const xs = [M, M + 260, W - M]
  ;['Valor de venta', 'IGV', 'Precio de venta'].forEach((h, i) => { s += T.tx(xs[i], ty + 34, h, { size: 15, fill: T.muted, anchor: i === 0 ? 'start' : i === 1 ? 'middle' : 'end' }) })
  filas.forEach((f, j) => f.forEach((v, i) => { s += T.tx(xs[i], ty + 70 + j * 36, v, { size: 21, family: T.titulo, anchor: i === 0 ? 'start' : i === 1 ? 'middle' : 'end', fill: i === 1 ? T.accent : T.ink }) }))
  return T.lienzo({ alto: ty + 70 + 4 * 36 + 60, slug: 'calculadora-de-igv', titulo: 'Cómo agregar o quitar el IGV del 18 %', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 83 Detracción (banda pizarra azul)
function detraccion() {
  const T = tema('banda', { accent: '#1E3A8A', soft: '#EFF6FF' })
  let s = T.tx(M, 180, 'Factura por un servicio de S/ 5.900 (IGV incluido), detracción del 12 %', { size: 17, fill: T.muted })
  const caja = (x, y, w, t, v, c) => rect(x, y, w, 96, { rx: 16, fill: '#FFFFFF', stroke: c, sw: 3 }) + T.tx(x + w / 2, y + 38, t, { size: 17, anchor: 'middle', fill: T.muted }) + T.tx(x + w / 2, y + 76, v, { size: 26, weight: 700, anchor: 'middle', fill: c })
  s += caja(M + 230, 204, 260, 'El cliente paga en total', 'S/ 5.900', T.accent)
  s += `<path d="M${M + 300},304 L${M + 140},380 M${M + 420},304 L${W - M - 160},380" stroke="#94A3B8" stroke-width="3"/>`
  s += caja(M, 384, 300, 'Al proveedor directamente', 'S/ 5.192', '#0F766E')
  s += caja(W - M - 300, 384, 300, 'A la cuenta de detracciones', 'S/ 708', '#B45309')
  s += T.tx(W - M - 150, 506, 'Banco de la Nación', { size: 15, anchor: 'middle', fill: T.muted })
  const ty = 550
  const usos = [['Para qué sirve', 'El proveedor solo puede usar ese saldo para pagar sus impuestos a SUNAT.'], ['Quién deposita', 'Normalmente el cliente, antes de pagar o dentro del plazo que fija SUNAT.'], ['Porcentajes', 'Dependen del bien o servicio: por ejemplo, 12 % en muchos servicios y 4 % en contratos de construcción.']]
  usos.forEach(([a, b], i) => {
    const y = ty + i * 66
    s += T.tx(M, y + 20, a, { size: 18, weight: 700, fill: T.accent })
    const p = T.parrafo(M + 180, y + 20, b, { size: 16, max: 62, fill: T.ink })
    s += p.svg
  })
  return T.lienzo({ alto: ty + 3 * 66 + 60, slug: 'calcular-detraccion', titulo: 'Cómo funciona una detracción de SUNAT', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 84 Matrices (plano)
function matrices() {
  const T = tema('plano')
  const matriz = (x, y, vals, col = T.ink, w = 70) => {
    let o = `<path d="M${x + 10},${y} h-10 v${vals.length * 54} h10 M${x + vals[0].length * w - 10},${y} h10 v${vals.length * 54} h-10" fill="none" stroke="${T.muted}" stroke-width="3"/>`
    vals.forEach((f, i) => f.forEach((v, j) => { o += T.tx(x + j * w + w / 2, y + i * 54 + 36, String(v), { size: 26, anchor: 'middle', fill: col }) }))
    return o
  }
  let s = T.tx(M, 184, 'A =', { size: 26, family: T.titulo })
  s += matriz(M + 60, 160, [[3, 1], [2, 4]])
  s += T.tx(M + 240, 184, 'det(A) = 3·4 − 1·2 = 10', { size: 26, fill: T.accent })
  s += `<path d="M${M + 80},178 L${M + 190},232" stroke="#34D399" stroke-width="2" stroke-dasharray="5 4"/><path d="M${M + 190},178 L${M + 80},232" stroke="#F87171" stroke-width="2" stroke-dasharray="5 4"/>`
  const iy = 320
  s += T.tx(M, iy, 'Inversa:  A⁻¹ = 1/det × (cambia la diagonal y el signo de la otra)', { size: 17, fill: T.muted })
  s += T.tx(M, iy + 64, 'A⁻¹ = 1/10 ×', { size: 24, family: T.titulo })
  s += matriz(M + 170, iy + 34, [[4, -1], [-2, 3]], T.accent)
  s += T.tx(M + 340, iy + 64, '=', { size: 26 })
  s += matriz(M + 380, iy + 34, [['0,4', '−0,1'], ['−0,2', '0,3']], T.ink, 90)
  const ry = iy + 190
  const reglas = [['det = 0', 'La matriz no tiene inversa'], ['A × B', 'Columnas de A = filas de B'], ['Transpuesta', 'Las filas pasan a ser columnas']]
  const cw = (W - 2 * M - 24) / 3
  reglas.forEach(([a, b], i) => {
    const x = M + i * (cw + 12)
    s += rect(x, ry, cw, 92, { rx: 12, fill: T.soft, stroke: T.line, sw: 2 })
    s += T.tx(x + 16, ry + 36, a, { size: 20, weight: 700, fill: T.accent })
    const p = T.parrafo(x + 16, ry + 64, b, { size: 15, max: 26 })
    s += p.svg
  })
  return T.lienzo({ alto: ry + 92 + 80, slug: 'calculadora-de-matrices', titulo: 'Determinante e inversa de una matriz 2×2', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 85 Ecuaciones (pastel, parábola)
function ecuaciones() {
  const T = tema('pastel', { accent: '#4338CA', soft: '#EEF2FF', bg: '#F8F9FF', ink: '#1E1B4B', line: '#E0E7FF' })
  const gx = M + 20
  const gy = 190
  const gw = 340
  const gh = 300
  const X = (x) => gx + ((x + 0.5) / 6) * gw
  const Y = (y) => gy + gh - ((y + 1) / 7) * gh
  let s = `<line x1="${gx}" y1="${Y(0)}" x2="${gx + gw}" y2="${Y(0)}" stroke="${T.muted}" stroke-width="2"/><line x1="${X(0)}" y1="${gy}" x2="${X(0)}" y2="${gy + gh}" stroke="${T.muted}" stroke-width="2"/>`
  let d = ''
  for (let x = 0; x <= 5.001; x += 0.1) d += `${d ? 'L' : 'M'}${X(x)},${Y(x * x - 5 * x + 6)} `
  s += `<path d="${d}" fill="none" stroke="${T.accent}" stroke-width="4"/>`
  s += circle(X(2), Y(0), 8, { fill: '#DB2777' }) + circle(X(3), Y(0), 8, { fill: '#DB2777' })
  s += T.tx(X(2), Y(0) + 30, 'x = 2', { size: 17, anchor: 'middle', weight: 700, fill: '#DB2777' }) + T.tx(X(3) + 14, Y(0) - 14, 'x = 3', { size: 17, weight: 700, fill: '#DB2777' })
  const fx = 420
  s += T.tx(fx, 200, 'x² − 5x + 6 = 0', { size: 26, weight: 700 })
  s += T.tx(fx, 240, 'Δ = b² − 4ac', { size: 20, fill: T.muted })
  s += T.tx(fx, 272, 'Δ = 25 − 24 = 1', { size: 22 })
  s += T.tx(fx, 316, 'x = (5 ± 1) ÷ 2', { size: 22 })
  s += T.tx(fx, 356, 'x₁ = 3   ·   x₂ = 2', { size: 24, weight: 700, fill: T.accent })
  const cy = 530
  const casos = [['Δ > 0', 'Dos soluciones reales', 'La parábola corta el eje dos veces'], ['Δ = 0', 'Una solución doble', 'La parábola toca el eje en un punto'], ['Δ < 0', 'Soluciones complejas', 'La parábola no corta el eje']]
  const cw = (W - 2 * M - 24) / 3
  casos.forEach(([a, b, c], i) => {
    const x = M + i * (cw + 12)
    s += rect(x, cy, cw, 116, { rx: 14, fill: T.soft })
    s += T.tx(x + 16, cy + 36, a, { size: 22, weight: 700, fill: T.accent })
    s += T.tx(x + 16, cy + 66, b, { size: 16, weight: 700 })
    const p = T.parrafo(x + 16, cy + 92, c, { size: 14, max: 26, fill: T.muted })
    s += p.svg
  })
  return T.lienzo({ alto: cy + 116 + 80, slug: 'calculadora-de-ecuaciones', titulo: 'Cómo se resuelve una ecuación de segundo grado', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 86 Precios TikTok (oscuro, rosa y cian)
function tiktok() {
  const T = tema('oscuro', { accent: '#FE2C55', bg: '#010101', soft: '#161823', line: '#2F3140' })
  const piezas = [['50.000', 'seguidores', '#FFFFFF'], ['× 5 %', 'engagement', '#25F4EE'], ['× 0,5', 'tarifa estándar', '#FE2C55'], ['× 1', 'video dedicado', '#FFFFFF']]
  const cw = (W - 2 * M - 36) / 4
  let s = ''
  piezas.forEach(([v, n, c], i) => {
    const x = M + i * (cw + 12)
    s += rect(x, 186, cw, 104, { rx: 16, fill: T.soft, stroke: c === '#FFFFFF' ? T.line : c, sw: 2 })
    s += T.tx(x + cw / 2, 236, v, { size: 28, weight: 700, anchor: 'middle', fill: c })
    s += T.tx(x + cw / 2, 268, n, { size: 15, anchor: 'middle', fill: T.muted })
  })
  s += T.tx(M, 340, 'Estimación central', { size: 18, fill: T.muted })
  s += T.tx(M, 392, 'US$ 1.250', { size: 52, weight: 700, fill: '#FFFFFF' })
  s += T.tx(W - M, 392, 'rango US$ 1.000 – 1.625', { size: 22, anchor: 'end', fill: '#25F4EE' })
  const ty = 450
  s += T.tx(M, ty, 'Multiplicador por tipo de contenido', { size: 19, weight: 700 })
  const tipos = [['Mención breve', '× 0,5'], ['Video dedicado', '× 1'], ['Video + Stories/Reels', '× 1,3'], ['Paquete de 3 videos', '× 2,5']]
  tipos.forEach(([a, b], i) => {
    const y = ty + 20 + i * 50
    s += rect(M, y, W - 2 * M, 42, { rx: 10, fill: T.soft })
    s += T.tx(M + 16, y + 28, a, { size: 17 })
    s += T.tx(W - M - 16, y + 28, b, { size: 19, weight: 700, anchor: 'end', fill: i === 1 ? '#FE2C55' : '#25F4EE' })
  })
  const n = T.nota(ty + 20 + 4 * 50 + 20, 'Es una referencia para negociar, no una tarifa oficial. Influyen también el país de la audiencia, los derechos de uso y la exclusividad.')
  return T.lienzo({ alto: Math.round(ty + 20 + 4 * 50 + 20 + n.h + 60), slug: 'calculadora-precios-influencers-tiktok', titulo: 'Cuánto cobrar por un video patrocinado en TikTok', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 87 IP y subredes (plano)
function ip() {
  const T = tema('plano', { accent: '#34D399' })
  let s = T.tx(M, 186, '192.168.1.130 / 26', { size: 32, weight: 700, fill: '#FFFFFF' })
  const bits = '11000000101010000000000110000010'
  const bw = (W - 2 * M) / 32
  ;[...bits].forEach((b, i) => {
    const red = i < 26
    s += rect(M + i * bw + 1, 210, bw - 2, 44, { rx: 3, fill: red ? '#1D4ED8' : '#047857' })
    s += T.tx(M + i * bw + bw / 2, 240, b, { size: 16, anchor: 'middle', fill: '#FFFFFF' })
  })
  s += T.tx(M, 280, '26 bits de red', { size: 16, fill: '#93C5FD' }) + T.tx(W - M, 280, '6 bits de host', { size: 16, anchor: 'end', fill: T.accent })
  const filas = [['Máscara', '255.255.255.192'], ['Dirección de red', '192.168.1.128'], ['Primer host', '192.168.1.129'], ['Último host', '192.168.1.190'], ['Broadcast', '192.168.1.191'], ['Hosts utilizables', '2⁶ − 2 = 62']]
  filas.forEach(([a, b], i) => {
    const y = 316 + i * 52
    s += rect(M, y, W - 2 * M, 44, { rx: 8, fill: i % 2 ? 'transparent' : T.soft })
    s += T.tx(M + 14, y + 29, a, { size: 18, fill: T.muted })
    s += T.tx(W - M - 14, y + 29, b, { size: 20, weight: 700, anchor: 'end', fill: i === 5 ? T.accent : T.ink })
  })
  const n = T.nota(316 + 6 * 52 + 20, 'Se restan 2 direcciones: la de red y la de broadcast no se pueden asignar a ningún equipo.')
  return T.lienzo({ alto: Math.round(316 + 6 * 52 + 20 + n.h + 56), slug: 'calculadora-ip', titulo: 'Cómo se divide una dirección IP en red y host', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 88 Regla de tres (cuaderno)
function reglaTres() {
  const T = tema('cuaderno', { accent: '#C2410C' })
  const bloque = (y, titulo, a1, b1, a2, b2, op, res, nota, inversa) => {
    let o = T.tx(M, y, titulo, { size: 24, weight: 700, family: T.titulo, fill: T.accent })
    o += T.tx(M + 40, y + 50, a1, { size: 26, family: T.titulo }) + T.tx(M + 240, y + 50, '→', { size: 26 }) + T.tx(M + 290, y + 50, b1, { size: 26, family: T.titulo })
    o += T.tx(M + 40, y + 94, a2, { size: 26, family: T.titulo }) + T.tx(M + 240, y + 94, '→', { size: 26 }) + T.tx(M + 290, y + 94, b2, { size: 26, family: T.titulo, fill: T.accent })
    o += inversa
      ? `<line x1="${M + 470}" y1="${y + 40}" x2="${M + 470}" y2="${y + 86}" stroke="${T.ink}" stroke-width="3"/><path d="M${M + 462},${y + 50} l8,-12 l8,12" fill="none" stroke="${T.ink}" stroke-width="3"/><line x1="${M + 500}" y1="${y + 40}" x2="${M + 500}" y2="${y + 86}" stroke="${T.ink}" stroke-width="3"/><path d="M${M + 492},${y + 76} l8,12 l8,-12" fill="none" stroke="${T.ink}" stroke-width="3"/>`
      : `<line x1="${M + 470}" y1="${y + 40}" x2="${M + 470}" y2="${y + 86}" stroke="${T.ink}" stroke-width="3"/><path d="M${M + 462},${y + 76} l8,12 l8,-12" fill="none" stroke="${T.ink}" stroke-width="3"/><line x1="${M + 500}" y1="${y + 40}" x2="${M + 500}" y2="${y + 86}" stroke="${T.ink}" stroke-width="3"/><path d="M${M + 492},${y + 76} l8,12 l8,-12" fill="none" stroke="${T.ink}" stroke-width="3"/>`
    o += T.tx(M + 540, y + 72, nota, { size: 15, fill: T.muted })
    o += rect(M, y + 116, W - 2 * M, 56, { rx: 12, fill: '#FFF7ED', stroke: '#FDBA74', sw: 2 })
    o += T.tx(M + 18, y + 152, op, { size: 21, family: T.titulo })
    o += T.tx(W - M - 18, y + 153, res, { size: 26, weight: 700, anchor: 'end', fill: T.accent, family: T.titulo })
    return o
  }
  let s = bloque(186, 'Directa: si uno sube, el otro sube', '3 kg', 'S/ 45', '7 kg', 'x', 'x = 7 × 45 ÷ 3', 'S/ 105', 'mismo sentido', false)
  s += bloque(400, 'Inversa: si uno sube, el otro baja', '4 obreros', '12 días', '6 obreros', 'x', 'x = 4 × 12 ÷ 6', '8 días', 'sentido contrario', true)
  const n = T.nota(610, 'Pregúntate: si duplico el primer dato, ¿el segundo se duplica (directa) o se reduce a la mitad (inversa)?')
  return T.lienzo({ alto: Math.round(610 + n.h + 56), slug: 'calculadora-regla-de-tres', titulo: 'Regla de tres directa e inversa con ejemplos', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 89 Pendiente (plano)
function pendiente() {
  const T = tema('plano', { accent: '#FCD34D' })
  const gx = M + 30
  const gy = 180
  const g = 36
  const X = (x) => gx + (x + 1) * g
  const Y = (y) => gy + (9 - y) * g
  let s = ''
  for (let i = -1; i <= 7; i++) s += `<line x1="${X(i)}" y1="${Y(-1)}" x2="${X(i)}" y2="${Y(9)}" stroke="${T.line}" stroke-width="1"/>`
  for (let j = -1; j <= 9; j++) s += `<line x1="${X(-1)}" y1="${Y(j)}" x2="${X(7)}" y2="${Y(j)}" stroke="${T.line}" stroke-width="1"/>`
  s += `<line x1="${X(-1)}" y1="${Y(0)}" x2="${X(7)}" y2="${Y(0)}" stroke="${T.muted}" stroke-width="2"/><line x1="${X(0)}" y1="${Y(-1)}" x2="${X(0)}" y2="${Y(9)}" stroke="${T.muted}" stroke-width="2"/>`
  s += `<line x1="${X(-0.4)}" y1="${Y(-0.8)}" x2="${X(4.5)}" y2="${Y(9)}" stroke="${T.accent}" stroke-width="4"/>`
  s += `<path d="M${X(1)},${Y(2)} H${X(4)} V${Y(8)}" fill="none" stroke="#F472B6" stroke-width="3" stroke-dasharray="7 5"/>`
  s += T.tx((X(1) + X(4)) / 2, Y(2) + 26, 'Δx = 3', { size: 17, anchor: 'middle', fill: '#F472B6' }) + T.tx(X(4) + 10, (Y(2) + Y(8)) / 2, 'Δy = 6', { size: 17, fill: '#F472B6' })
  s += circle(X(1), Y(2), 7, { fill: '#FFFFFF' }) + T.tx(X(1) - 10, Y(2) - 10, '(1, 2)', { size: 16, anchor: 'end' })
  s += circle(X(4), Y(8), 7, { fill: '#FFFFFF' }) + T.tx(X(4) - 10, Y(8) - 10, '(4, 8)', { size: 16, anchor: 'end' })
  const fx = 420
  s += T.tx(fx, 210, 'm = (y₂ − y₁) ÷ (x₂ − x₁)', { size: 20, fill: T.muted })
  s += T.tx(fx, 252, 'm = (8 − 2) ÷ (4 − 1)', { size: 22 })
  s += T.tx(fx, 296, 'm = 6 ÷ 3 = 2', { size: 30, weight: 700, fill: T.accent })
  s += T.tx(fx, 348, 'b = y₁ − m·x₁ = 2 − 2 = 0', { size: 19 })
  s += T.tx(fx, 392, 'y = 2x', { size: 34, weight: 700, fill: '#FFFFFF' })
  const ty = Y(-1) + 50
  const tipos = [['m > 0', 'sube'], ['m < 0', 'baja'], ['m = 0', 'horizontal'], ['Δx = 0', 'vertical (indefinida)']]
  const cw = (W - 2 * M - 36) / 4
  tipos.forEach(([a, b], i) => {
    const x = M + i * (cw + 12)
    s += rect(x, ty, cw, 74, { rx: 12, fill: T.soft, stroke: T.line, sw: 2 })
    s += T.tx(x + cw / 2, ty + 32, a, { size: 20, weight: 700, anchor: 'middle', fill: T.accent })
    s += T.tx(x + cw / 2, ty + 58, b, { size: 15, anchor: 'middle' })
  })
  return T.lienzo({ alto: ty + 74 + 80, slug: 'calculadora-de-pendiente', titulo: 'Cómo calcular la pendiente de una recta entre dos puntos', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 90 Derivadas e integrales (oscuro)
function derivadas() {
  const T = tema('oscuro', { accent: '#22D3EE' })
  const gx = M + 40
  const gy = 190
  const gw = 400
  const gh = 330
  const X = (x) => gx + ((x + 0.5) / 4.5) * gw
  const Y = (y) => gy + gh - ((y + 1) / 13) * gh
  let s = `<line x1="${gx}" y1="${Y(0)}" x2="${gx + gw}" y2="${Y(0)}" stroke="${T.line}" stroke-width="2"/><line x1="${X(0)}" y1="${gy}" x2="${X(0)}" y2="${gy + gh}" stroke="${T.line}" stroke-width="2"/>`
  let area = `M${X(0)},${Y(0)} `
  for (let x = 0; x <= 2.001; x += 0.05) area += `L${X(x)},${Y(x * x)} `
  area += `L${X(2)},${Y(0)} Z`
  s += `<path d="${area}" fill="#22D3EE" opacity="0.25"/>`
  let curva = ''
  for (let x = -0.4; x <= 3.6; x += 0.05) curva += `${curva ? 'L' : 'M'}${X(x)},${Y(x * x)} `
  s += `<path d="${curva}" fill="none" stroke="#F9FAFB" stroke-width="4"/>`
  s += `<line x1="${X(1.5)}" y1="${Y(0)}" x2="${X(4)}" y2="${Y(15)}" stroke="#F472B6" stroke-width="3"/>`
  s += circle(X(3), Y(9), 8, { fill: '#F472B6' })
  s += T.tx(X(1), Y(0) + 26, 'área ≈ 2,667', { size: 17, anchor: 'middle', weight: 700, fill: T.accent })
  s += T.tx(X(3) - 14, Y(9) - 12, 'pendiente 6', { size: 16, anchor: 'end', weight: 700, fill: '#F472B6' })
  const fx = 480
  s += T.tx(fx, 210, 'f(x) = x²', { size: 28, weight: 700 })
  s += T.tx(fx, 266, "Derivada en x = 3", { size: 17, fill: '#F472B6' })
  s += T.tx(fx, 298, "f'(3) = 6", { size: 26, weight: 700 })
  s += T.tx(fx, 354, 'Integral de 0 a 2', { size: 17, fill: T.accent })
  s += T.tx(fx, 386, '∫ x² dx = 8/3', { size: 26, weight: 700 })
  s += T.tx(fx, 416, '≈ 2,666667', { size: 18, fill: T.muted })
  const ty = gy + gh + 40
  const metodos = [['Derivada', 'Diferencia centrada con h = 0,00001'], ['Integral', 'Regla de Simpson con 1.000 tramos'], ['Límite', 'Se evalúa muy cerca del punto por los dos lados']]
  metodos.forEach(([a, b], i) => {
    const y = ty + i * 52
    s += rect(M, y, W - 2 * M, 44, { rx: 10, fill: T.soft })
    s += T.tx(M + 16, y + 29, a, { size: 18, weight: 700, fill: T.accent })
    s += T.tx(M + 140, y + 29, b, { size: 17 })
  })
  return T.lienzo({ alto: ty + 3 * 52 + 70, slug: 'calculadora-derivadas-integrales', titulo: 'Qué calcula una derivada y qué calcula una integral', cuerpo: s })
}

const pieza = (archivo, alt, fn) => ({ archivo, alt, dibujar: fn })

module.exports = [
  pieza('calculo-gratificacion-peru-julio', 'Cálculo de la gratificación de julio o diciembre en Perú con la bonificación extraordinaria del 9 por ciento', gratificacion),
  pieza('agregar-quitar-igv-peru', 'Cómo agregar o quitar el IGV del 18 por ciento en Perú con una tabla de montos', igv),
  pieza('como-funciona-detraccion-sunat', 'Cómo funciona una detracción de SUNAT: reparto del pago entre el proveedor y la cuenta del Banco de la Nación', detraccion),
  pieza('determinante-inversa-matriz-2x2', 'Cálculo del determinante y la matriz inversa de una matriz 2 por 2', matrices),
  pieza('ecuacion-segundo-grado-discriminante', 'Resolución de una ecuación de segundo grado con el discriminante y su parábola', ecuaciones),
  pieza('precio-video-patrocinado-tiktok', 'Cálculo del precio estimado de un video patrocinado en TikTok según seguidores y engagement', tiktok),
  pieza('subred-ip-red-host-broadcast', 'División de una dirección IP en bits de red y de host con máscara, red, broadcast y hosts', ip),
  pieza('regla-de-tres-directa-inversa', 'Ejemplos de regla de tres directa e inversa resueltos paso a paso', reglaTres),
  pieza('pendiente-recta-dos-puntos', 'Gráfica de la pendiente de una recta entre los puntos 1,2 y 4,8 con su ecuación', pendiente),
  pieza('derivada-integral-x-cuadrado', 'Derivada de x al cuadrado en x igual a 3 y área bajo la curva entre 0 y 2', derivadas),
]
