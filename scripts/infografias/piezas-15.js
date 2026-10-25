// Infografías del lote 15 (herramientas 141 a 150).
const { rect, circle } = require('../illustrations/kit')
const { tema, W, M, es } = require('./piezas-4').temas
const mx = (n, d = 2) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })

// ─────────────────────────────────────────────────────────── 141 Crédito automotriz (oscuro)
function creditoAuto() {
  const T = tema('oscuro', { accent: '#60A5FA', bg: '#0B1220', soft: '#15203A', line: '#253354' })
  let s = T.tx(M, 182, 'Auto de $350,000 con 20 % de enganche, 14 % anual a 48 meses', { size: 18, fill: T.muted })
  const ancho = W - 2 * M
  const partes = [['Enganche', 70000, '#94A3B8'], ['Crédito', 280000, T.accent], ['Intereses', 87267.84, '#F59E0B'], ['IVA de intereses', 13962.86, '#EF4444']]
  const total = partes.reduce((a, p) => a + p[1], 0)
  let x = M
  partes.forEach(([, v, c], i) => { const w = (v / total) * ancho; s += rect(x, 204, w, 56, { rx: i === 0 ? 10 : 0, fill: c }); x += w })
  partes.forEach(([n, v, c], i) => {
    const y = 296 + i * 50
    s += rect(M, y - 16, 18, 18, { rx: 4, fill: c }) + T.tx(M + 30, y, n, { size: 18 })
    s += T.tx(W - M, y, `$${mx(v)}`, { size: 20, weight: 700, anchor: 'end' })
  })
  s += `<line x1="${M}" y1="${296 + 4 * 50 - 22}" x2="${W - M}" y2="${296 + 4 * 50 - 22}" stroke="${T.line}" stroke-width="2"/>`
  s += T.tx(M, 296 + 4 * 50 + 10, 'Pagas en total por el auto', { size: 19, weight: 700 }) + T.tx(W - M, 296 + 4 * 50 + 10, `$${mx(total)}`, { size: 24, weight: 700, anchor: 'end', fill: T.accent })
  const ry = 296 + 4 * 50 + 50
  const cw = (W - 2 * M - 16) / 2
  s += rect(M, ry, cw, 90, { rx: 14, fill: T.soft }) + T.tx(M + 18, ry + 34, 'Primera mensualidad', { size: 15, fill: T.muted }) + T.tx(M + 18, ry + 68, '$8,174.08', { size: 26, weight: 700 })
  s += rect(M + cw + 16, ry, cw, 90, { rx: 14, fill: T.soft }) + T.tx(M + cw + 34, ry + 34, 'Última mensualidad', { size: 15, fill: T.muted }) + T.tx(M + cw + 34, ry + 68, '$7,665.53', { size: 26, weight: 700 })
  const n = T.nota(ry + 130, 'La mensualidad baja porque el IVA se cobra sobre los intereses, que disminuyen. Sin seguro del auto ni comisión por apertura, que suelen sumarse.')
  return T.lienzo({ alto: Math.round(ry + 130 + n.h + 60), slug: 'simulador-credito-automotriz', titulo: 'Cuánto pagas en realidad por un auto a crédito', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 142 Interés simple (pizarra)
function interesSimple() {
  const T = tema('pizarra')
  let s = T.tx(M, 196, 'I = C × r × t', { size: 48, family: T.titulo, fill: T.accent })
  const def = [['I', 'interés ganado o pagado'], ['C', 'capital inicial'], ['r', 'tasa anual en decimal (12 % = 0,12)'], ['t', 'tiempo en años (6 meses = 0,5)']]
  def.forEach(([a, b], i) => { s += T.tx(M, 248 + i * 34, a, { size: 22, weight: 700, family: T.titulo, fill: T.accent }) + T.tx(M + 40, 248 + i * 34, b, { size: 18 }) })
  const ey = 410
  s += rect(M, ey, W - 2 * M, 90, { rx: 14, fill: T.soft, stroke: T.line, sw: 2 })
  s += T.tx(M + 20, ey + 38, '$10,000 × 0,12 × 0,5 = $600', { size: 28, family: T.titulo })
  s += T.tx(M + 20, ey + 72, 'Interés de 6 meses al 12 % anual', { size: 16, fill: T.muted })
  const cy = ey + 130
  s += T.tx(M, cy, 'Simple frente a compuesto: $10,000 al 12 %', { size: 20, family: T.titulo, fill: T.accent })
  const filas = [['1 año', '$11,200', '$11,200'], ['5 años', '$16,000', '$17,623'], ['10 años', '$22,000', '$31,058']]
  s += T.tx(M + 320, cy + 32, 'Simple', { size: 15, anchor: 'middle', fill: T.muted }) + T.tx(W - M - 80, cy + 32, 'Compuesto', { size: 15, anchor: 'middle', fill: T.muted })
  filas.forEach(([a, b, c], i) => {
    const y = cy + 66 + i * 40
    s += T.tx(M, y, a, { size: 20, family: T.titulo }) + T.tx(M + 320, y, b, { size: 20, anchor: 'middle' }) + T.tx(W - M - 80, y, c, { size: 20, anchor: 'middle', weight: 700, fill: T.accent })
  })
  return T.lienzo({ alto: cy + 66 + 3 * 40 + 60, slug: 'calculadora-interes-simple', titulo: 'La fórmula del interés simple con un ejemplo', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 143 Presupuesto 50/30/20 (pastel, anillo)
function presupuesto() {
  const T = tema('pastel', { accent: '#7C3AED', soft: '#EDE9FE', bg: '#FBFAFF', ink: '#2E1065', line: '#DDD6FE' })
  const cx = 230
  const cy = 370
  const r = 150
  const partes = [[0.5, '#7C3AED', 'Necesidades', '$7,500', 'renta, comida, servicios y transporte'], [0.3, '#C4B5FD', 'Gustos', '$4,500', 'salidas, suscripciones y caprichos'], [0.2, '#10B981', 'Ahorro y deudas', '$3,000', 'fondo de emergencia e inversión']]
  let ang = -Math.PI / 2
  let s = T.tx(M, 184, 'Ingreso neto de $15,000 al mes', { size: 20, weight: 700 })
  partes.forEach(([p, c]) => {
    const a2 = ang + p * 2 * Math.PI
    const large = p > 0.5 ? 1 : 0
    s += `<path d="M${cx + r * Math.cos(ang)},${cy + r * Math.sin(ang)} A${r},${r} 0 ${large} 1 ${cx + r * Math.cos(a2)},${cy + r * Math.sin(a2)} L${cx + 90 * Math.cos(a2)},${cy + 90 * Math.sin(a2)} A90,90 0 ${large} 0 ${cx + 90 * Math.cos(ang)},${cy + 90 * Math.sin(ang)} Z" fill="${c}"/>`
    ang = a2
  })
  s += T.tx(cx, cy - 4, '50/30/20', { size: 28, weight: 700, anchor: 'middle' }) + T.tx(cx, cy + 24, 'regla', { size: 16, anchor: 'middle', fill: T.muted })
  const lx = 420
  partes.forEach(([p, c, n, v, d], i) => {
    const y = 226 + i * 112
    s += rect(lx, y, 22, 22, { rx: 6, fill: c })
    s += T.tx(lx + 34, y + 18, `${n} · ${Math.round(p * 100)} %`, { size: 18, weight: 700 })
    s += T.tx(lx + 34, y + 50, v, { size: 28, weight: 700, fill: c === '#C4B5FD' ? '#7C3AED' : c })
    s += T.parrafo(lx + 34, y + 76, d, { size: 14, max: 34, fill: T.muted }).svg
  })
  const n = T.nota(cy + r + 50, 'Es un punto de partida, no una regla fija: si la renta se lleva más de la mitad, recorta gustos antes que ahorro. Tu presupuesto se guarda solo en tu navegador.')
  return T.lienzo({ alto: Math.round(cy + r + 50 + n.h + 64), slug: 'presupuesto-mensual', titulo: 'Cómo repartir tu sueldo con la regla 50/30/20', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 144 Plan de pago de deudas (banda roja)
function deudas() {
  const T = tema('banda', { accent: '#B91C1C', soft: '#FEF2F2' })
  const ds = [['Tarjeta A', '$30,000', '60 %'], ['Tarjeta B', '$8,000', '45 %'], ['Préstamo', '$50,000', '25 %']]
  let s = T.tx(M, 182, '3 deudas y $6,000 al mes para pagarlas', { size: 19, weight: 700 })
  ds.forEach(([n, sd, t], i) => {
    const x = M + i * ((W - 2 * M - 24) / 3 + 12)
    const cw = (W - 2 * M - 24) / 3
    s += rect(x, 200, cw, 80, { rx: 12, fill: T.soft })
    s += T.tx(x + 16, 230, n, { size: 17, weight: 700 })
    s += T.tx(x + 16, 262, `${sd} · ${t}`, { size: 16, fill: T.muted })
  })
  const cw = (W - 2 * M - 16) / 2
  const met = [['Avalancha', 'Primero la de mayor tasa', ['Tarjeta A (60 %)', 'Tarjeta B (45 %)', 'Préstamo (25 %)'], '$27,927', T.accent], ['Bola de nieve', 'Primero la de menor saldo', ['Tarjeta B ($8,000)', 'Tarjeta A ($30,000)', 'Préstamo ($50,000)'], '$29,190', '#2563EB']]
  met.forEach(([n, d, orden, int, c], i) => {
    const x = M + i * (cw + 16)
    s += rect(x, 310, cw, 290, { rx: 18, fill: '#FFFFFF', stroke: c, sw: 3 })
    s += T.tx(x + 20, 346, n, { size: 22, weight: 700, fill: c })
    s += T.tx(x + 20, 372, d, { size: 15, fill: T.muted })
    orden.forEach((o, k) => { s += circle(x + 32, 410 + k * 40, 13, { fill: c }) + T.tx(x + 32, 416 + k * 40, String(k + 1), { size: 14, weight: 700, anchor: 'middle', fill: '#FFF' }) + T.tx(x + 54, 416 + k * 40, o, { size: 17 }) })
    s += T.tx(x + 20, 556, 'Intereses totales', { size: 15, fill: T.muted })
    s += T.tx(x + 20, 586, int, { size: 28, weight: 700, fill: c })
  })
  const n = T.nota(630, 'Las dos terminan en 20 meses en este ejemplo, pero la avalancha ahorra $1,263 en intereses. La bola de nieve da antes la primera victoria: la Tarjeta B desaparece en pocos meses.')
  return T.lienzo({ alto: Math.round(630 + n.h + 64), slug: 'plan-pago-deudas', titulo: 'Método avalancha o bola de nieve: cuál conviene', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 145 Comisión por ventas (papel)
function comision() {
  const T = tema('papel', { accent: '#0F766E', soft: '#CCFBF1' })
  let s = T.tx(M, 188, 'Ventas del mes: $120,000', { size: 24, weight: 700, family: T.titulo })
  const tramos = [[0, 50000, 0.05, '#99F6E4'], [50000, 100000, 0.08, '#2DD4BF'], [100000, 120000, 0.1, '#0F766E']]
  const ancho = W - 2 * M
  tramos.forEach(([a, b, p, c]) => {
    const x = M + (a / 120000) * ancho
    const w = ((b - a) / 120000) * ancho
    s += rect(x + 1, 208, w - 2, 70, { rx: 8, fill: c })
    s += T.tx(x + w / 2, 240, `${Math.round(p * 100)} %`, { size: 20, weight: 700, anchor: 'middle', fill: p === 0.1 ? '#FFF' : T.ink })
    s += T.tx(x + w / 2, 264, `$${mx((b - a) * p, 0)}`, { size: 15, anchor: 'middle', fill: p === 0.1 ? '#FFF' : T.ink })
  })
  ;[0, 50000, 100000, 120000].forEach((v) => { s += T.tx(M + (v / 120000) * ancho, 300, `$${(v / 1000).toLocaleString('es-ES')} mil`, { size: 14, anchor: 'middle', fill: T.muted }) })
  const cw = (W - 2 * M - 16) / 2
  s += rect(M, 336, cw, 130, { rx: 16, fill: T.soft }) + T.tx(M + 20, 372, 'Por tramos', { size: 19, weight: 700, family: T.titulo }) + T.tx(M + 20, 400, 'Cada parte con su porcentaje', { size: 15, fill: T.muted }) + T.tx(M + 20, 448, '$8,500', { size: 32, weight: 700, fill: T.accent, family: T.titulo })
  s += rect(M + cw + 16, 336, cw, 130, { rx: 16, fill: '#FFFDF8', stroke: T.line, sw: 2 }) + T.tx(M + cw + 36, 372, 'Comisión fija del 8 %', { size: 19, weight: 700, family: T.titulo }) + T.tx(M + cw + 36, 400, 'El mismo porcentaje para todo', { size: 15, fill: T.muted }) + T.tx(M + cw + 36, 448, '$9,600', { size: 32, weight: 700, family: T.titulo })
  const n = T.nota(500, 'En México las comisiones son parte del salario: cuentan para el aguinaldo, las vacaciones y el IMSS, y pagan ISR como el sueldo.')
  return T.lienzo({ alto: Math.round(500 + n.h + 64), slug: 'calculadora-comision-ventas', titulo: 'Comisión por tramos frente a comisión fija', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 146 Comparador de precios (cuaderno)
function comparador() {
  const T = tema('cuaderno', { accent: '#15803D' })
  const prods = [['Paquete chico', '500 g', '$42.00', 84, false], ['Paquete grande', '1.2 kg', '$89.00', 74.17, true], ['Promoción 3×2', '3 × 500 g, pagas 2', '$84.00', 56, false]]
  let s = T.tx(M, 188, 'Arroz: ¿cuál sale más barato por kilo?', { size: 24, family: T.titulo })
  prods.forEach(([n, d, p, kg], i) => {
    const y = 214 + i * 108
    const mejor = i === 2
    s += rect(M, y, W - 2 * M, 94, { rx: 14, fill: mejor ? '#DCFCE7' : '#FFFFFF', stroke: mejor ? T.accent : '#93C5FD', sw: mejor ? 3 : 2 })
    s += T.tx(M + 20, y + 36, n, { size: 21, weight: 700 })
    s += T.tx(M + 20, y + 66, `${d} · ${p}`, { size: 17, fill: T.muted })
    s += T.tx(W - M - 20, y + 46, `$${mx(kg)}/kg`, { size: 28, weight: 700, anchor: 'end', family: T.titulo, fill: mejor ? T.accent : T.ink })
    if (mejor) s += T.tx(W - M - 20, y + 76, 'el más barato', { size: 15, anchor: 'end', fill: T.accent, weight: 700 })
  })
  const fy = 214 + 3 * 108 + 16
  s += rect(M, fy, W - 2 * M, 70, { rx: 12, fill: '#FFFFFF', stroke: '#93C5FD', sw: 2 })
  s += T.tx(M + 18, fy + 44, 'precio por kilo = precio ÷ peso en kilos', { size: 22, family: T.titulo })
  const n = T.nota(fy + 110, 'El tamaño grande no siempre es el más barato, y la promoción solo conviene si vas a usar todo antes de que caduque.')
  return T.lienzo({ alto: Math.round(fy + 110 + n.h + 56), slug: 'comparador-precios', titulo: 'Cómo saber qué presentación sale más barata', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 147 Libras a kilos (banda gris acero)
function librasKilos() {
  const T = tema('banda', { accent: '#475569', soft: '#F1F5F9' })
  let s = T.tx(M, 184, '1 lb = 0,4536 kg · truco: divide entre 2 y resta un 10 %', { size: 19, weight: 700 })
  const filas = [['10 lb', '4,5 kg'], ['25 lb', '11,3 kg'], ['45 lb', '20,4 kg'], ['100 lb', '45,4 kg'], ['150 lb', '68,0 kg'], ['200 lb', '90,7 kg']]
  const cw = (W - 2 * M - 24) / 3
  filas.forEach(([a, b], i) => {
    const x = M + (i % 3) * (cw + 12)
    const y = 206 + Math.floor(i / 3) * 96
    s += rect(x, y, cw, 84, { rx: 14, fill: T.soft })
    s += T.tx(x + cw / 2, y + 34, a, { size: 18, anchor: 'middle', fill: T.muted })
    s += T.tx(x + cw / 2, y + 68, b, { size: 28, weight: 700, anchor: 'middle' })
  })
  const gy = 206 + 2 * 96 + 30
  s += T.tx(M, gy, 'Discos olímpicos del gimnasio', { size: 19, weight: 700 })
  const discos = [[45, '#2563EB', 54], [35, '#FACC15', 48], [25, '#16A34A', 42], [10, '#334155', 32]]
  discos.forEach(([lb, c, r], i) => {
    const x = M + 70 + i * 170
    s += circle(x, gy + 80, r, { fill: c }) + circle(x, gy + 80, 10, { fill: '#F8FAFC' })
    s += T.tx(x, gy + 160, `${lb} lb`, { size: 18, weight: 700, anchor: 'middle' })
    s += T.tx(x, gy + 184, `${es(lb * 0.45359237, 1)} kg`, { size: 16, anchor: 'middle', fill: T.muted })
  })
  return T.lienzo({ alto: gy + 184 + 80, slug: 'libras-a-kilos', titulo: 'Tabla de libras a kilos y discos del gimnasio', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 148 Fahrenheit a Celsius (banda naranja, horno)
function fahrenheit() {
  const T = tema('banda', { accent: '#C2410C', soft: '#FFF7ED' })
  const horno = [[300, 149, 'Muy bajo: merengues'], [325, 163, 'Bajo: pasteles densos'], [350, 177, 'Moderado: la mayoría de pasteles'], [375, 191, 'Medio-alto: galletas'], [400, 204, 'Alto: pan y verduras asadas'], [425, 218, 'Muy alto: pizza casera'], [450, 232, 'Máximo: gratinar']]
  let s = rect(M, 180, W - 2 * M, 64, { rx: 14, fill: T.soft })
  s += T.tx(W / 2, 222, '°C = (°F − 32) ÷ 1,8', { size: 28, weight: 700, anchor: 'middle', fill: T.accent })
  horno.forEach(([f, c, d], i) => {
    const y = 266 + i * 52
    const heat = i / 6
    s += rect(M, y, W - 2 * M, 44, { rx: 10, fill: i % 2 ? '#FFFFFF' : T.soft })
    s += rect(M, y, 10, 44, { rx: 4, fill: `rgb(${251},${Math.round(191 - heat * 150)},${Math.round(36 - heat * 30)})` })
    s += T.tx(M + 26, y + 30, `${f} °F`, { size: 20, weight: 700 })
    s += T.tx(M + 150, y + 30, `${c} °C`, { size: 20, weight: 700, fill: T.accent })
    s += T.tx(W - M - 16, y + 30, d, { size: 16, anchor: 'end', fill: T.muted })
  })
  const n = T.nota(266 + 7 * 52 + 16, 'Truco de cabeza: resta 30 y divide entre 2. Para 350 °F: (350 − 30) ÷ 2 = 160 °C, aproximado; el valor exacto es 177 °C.')
  return T.lienzo({ alto: Math.round(266 + 7 * 52 + 16 + n.h + 64), slug: 'fahrenheit-a-celsius', titulo: 'Temperaturas del horno de Fahrenheit a Celsius', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 149 Onzas a gramos (papel)
function onzas() {
  const T = tema('papel', { accent: '#A16207', soft: '#FEF3C7' })
  const tipos = [['Onza de peso (avoirdupois)', '28,35 g', 'Alimentos, paquetes, cartas'], ['Onza troy', '31,10 g', 'Oro, plata y metales preciosos'], ['Onza líquida (EE. UU.)', '29,57 ml', 'Bebidas, biberones, recetas: mide volumen']]
  let s = ''
  tipos.forEach(([a, b, c], i) => {
    const y = 180 + i * 118
    s += rect(M, y, W - 2 * M, 104, { rx: 16, fill: i === 1 ? T.soft : '#FFFDF8', stroke: T.line, sw: 2 })
    s += T.tx(M + 22, y + 38, a, { size: 20, weight: 700, family: T.titulo })
    s += T.tx(M + 22, y + 72, c, { size: 16, fill: T.muted })
    s += T.tx(W - M - 22, y + 62, b, { size: 34, weight: 700, anchor: 'end', family: T.titulo, fill: T.accent })
  })
  const ty = 180 + 3 * 118 + 20
  s += T.tx(M, ty, 'Equivalencias rápidas', { size: 20, weight: 700, family: T.titulo })
  const eq = [['16 oz', '1 libra = 453,6 g'], ['8 oz líquidas', '1 taza de EE. UU. ≈ 237 ml'], ['100 g', '3,53 oz'], ['Biberón de 240 ml', 'unas 8 oz líquidas']]
  eq.forEach(([a, b], i) => {
    const y = ty + 24 + i * 44
    s += `<line x1="${M}" y1="${y + 30}" x2="${W - M}" y2="${y + 30}" stroke="${T.line}" stroke-width="1.5"/>`
    s += T.tx(M, y + 20, a, { size: 19, weight: 700 })
    s += T.tx(W - M, y + 20, b, { size: 18, anchor: 'end' })
  })
  return T.lienzo({ alto: ty + 24 + 4 * 44 + 70, slug: 'onzas-a-gramos', titulo: 'Tres onzas distintas: peso, troy y líquida', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 150 Tazas a ml (pastel ámbar)
function tazas() {
  const T = tema('pastel', { accent: '#B45309', soft: '#FEF3C7', bg: '#FFFCF5', ink: '#451A03', line: '#FDE68A' })
  const tz = [['Estadounidense', '236,6 ml', 100], ['Métrica', '250 ml', 106], ['Británica', '284 ml', 120]]
  let s = ''
  tz.forEach(([n, ml, h], i) => {
    const x = M + 40 + i * 230
    const y = 330 - h
    s += `<path d="M${x},${y} h120 l-12,${h} h-96 Z" fill="${T.soft}" stroke="${T.accent}" stroke-width="3"/><path d="M${x + 120},${y + 18} q32,6 0,${Math.round(h * 0.5)}" fill="none" stroke="${T.accent}" stroke-width="3"/>`
    s += T.tx(x + 60, 364, n, { size: 18, weight: 700, anchor: 'middle' })
    s += T.tx(x + 60, 390, ml, { size: 20, anchor: 'middle', fill: T.accent, weight: 700 })
  })
  const gy = 450
  s += T.tx(M, gy, 'Gramos por taza de EE. UU. (aproximado)', { size: 20, weight: 700 })
  const ing = [['Harina de trigo', 125], ['Azúcar blanca', 200], ['Arroz crudo', 185], ['Mantequilla', 227], ['Avena en hojuelas', 90], ['Miel', 340]]
  const max = 340
  const ancho = W - 2 * M - 270
  ing.forEach(([n, g], i) => {
    const y = gy + 20 + i * 44
    s += T.tx(M, y + 24, n, { size: 17 })
    s += rect(M + 200, y + 8, (g / max) * ancho, 24, { rx: 6, fill: T.accent, o: 0.85 })
    s += T.tx(M + 210 + (g / max) * ancho, y + 26, `${g} g`, { size: 17, weight: 700 })
  })
  return T.lienzo({ alto: gy + 20 + 6 * 44 + 70, slug: 'tazas-a-ml', titulo: 'Cuántos ml y gramos tiene una taza', cuerpo: s })
}

const pieza = (archivo, alt, fn) => ({ archivo, alt, dibujar: fn })

module.exports = [
  pieza('costo-total-credito-automotriz', 'Desglose del costo total de un auto a crédito: enganche, crédito, intereses e IVA', creditoAuto),
  pieza('formula-interes-simple-ejemplo', 'Fórmula del interés simple con un ejemplo y comparación con el interés compuesto', interesSimple),
  pieza('regla-50-30-20-presupuesto', 'Reparto de un sueldo de 15 mil pesos con la regla 50/30/20', presupuesto),
  pieza('metodo-avalancha-bola-de-nieve', 'Comparación de los métodos avalancha y bola de nieve para pagar tres deudas', deudas),
  pieza('comision-ventas-por-tramos', 'Cálculo de una comisión por ventas por tramos frente a una comisión fija', comision),
  pieza('precio-por-kilo-comparado', 'Comparación del precio por kilo de tres presentaciones de un producto', comparador),
  pieza('tabla-libras-a-kilos-gimnasio', 'Tabla de libras a kilos y peso en kilos de los discos de gimnasio', librasKilos),
  pieza('temperaturas-horno-fahrenheit-celsius', 'Temperaturas del horno en grados Fahrenheit y su equivalencia en Celsius', fahrenheit),
  pieza('tipos-de-onza-gramos', 'Diferencia entre onza de peso, onza troy y onza líquida en gramos y mililitros', onzas),
  pieza('tazas-a-ml-y-gramos', 'Mililitros de la taza estadounidense, métrica y británica y gramos por taza de cada ingrediente', tazas),
]
