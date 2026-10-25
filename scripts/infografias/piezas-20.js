// Infografías del lote 20 (herramientas 191 a 200).
const { rect, circle } = require('../illustrations/kit')
const { tema, W, M } = require('./piezas-4').temas

const mono = 'Consolas, monospace'
const eur = (n, d = 2) => n.toLocaleString('es-ES', { minimumFractionDigits: d, maximumFractionDigits: d, useGrouping: 'always' })

// ─────────────────────────────────────────────────────────── 191 Nota de corte (cuaderno, fórmula)
function notaCorte() {
  const T = tema('cuaderno', { accent: '#1D4ED8' })
  let s = T.tx(M, 190, 'Nota de acceso (máximo 10)', { size: 22, weight: 700, family: T.titulo, fill: T.accent })
  const caja = (x, y, w, t1, t2, c) => rect(x, y, w, 84, { rx: 14, fill: '#FFFFFF', stroke: c, sw: 2 }) + T.tx(x + w / 2, y + 36, t1, { size: 22, weight: 700, anchor: 'middle', family: T.titulo }) + T.tx(x + w / 2, y + 64, t2, { size: 14, anchor: 'middle', fill: T.muted })
  s += caja(M, 210, 300, '0,6 × Bachillerato', 'media de 1.º y 2.º', '#93C5FD')
  s += T.tx(M + 330, 262, '+', { size: 30, weight: 700, anchor: 'middle' })
  s += caja(M + 360, 210, W - 2 * M - 360, '0,4 × Fase general', 'debe ser 4 o más', '#93C5FD')
  s += T.tx(M, 350, 'Nota de admisión (máximo 14)', { size: 22, weight: 700, family: T.titulo, fill: T.accent })
  s += caja(M, 370, 220, 'Acceso', 'hasta 10', '#93C5FD')
  s += T.tx(M + 245, 422, '+', { size: 30, weight: 700, anchor: 'middle' })
  s += caja(M + 270, 370, W - 2 * M - 270, '2 mejores específicas × ponderación', 'solo cuentan si sacas 5 o más · ponderación 0,1 o 0,2', '#FCA5A5')
  const ey = 500
  s += rect(M, ey, W - 2 * M, 150, { rx: 14, fill: '#FEF9C3' })
  s += T.tx(M + 20, ey + 36, 'Ejemplo', { size: 20, weight: 700, family: T.titulo })
  s += T.tx(M + 20, ey + 70, 'Bachillerato 8 y fase general 7 → 0,6 × 8 + 0,4 × 7 = 7,6', { size: 18, family: T.titulo })
  s += T.tx(M + 20, ey + 100, 'Específicas 9 y 8 con ponderación 0,2 → 1,8 + 1,6 = 3,4', { size: 18, family: T.titulo })
  s += T.tx(M + 20, ey + 132, 'Nota de admisión: 7,6 + 3,4 = 11,0', { size: 20, weight: 700, family: T.titulo, fill: T.accent })
  return T.lienzo({ alto: ey + 150 + 70, slug: 'nota-de-corte', titulo: 'Cómo se calcula la nota de la PAU', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 192 Factura de la luz (oscuro amarillo, desglose)
function facturaLuz() {
  const T = tema('oscuro', { accent: '#FACC15', bg: '#0F1115', soft: '#1A1D24', line: '#2A2F3A' })
  const partes = [['Potencia', 13.8, '4,6 kW × 30 días × 0,10 €', '#60A5FA'], ['Energía', 35, '250 kWh × 0,14 €', '#FACC15'], ['Impuesto eléctrico', 2.49, '5,11 % de potencia + energía', '#F472B6'], ['Alquiler del contador', 0.81, 'importe fijo mensual', '#A78BFA'], ['IVA', 10.94, '21 % de todo lo anterior', '#F87171']]
  const total = 63.05
  let s = T.tx(M, 186, 'Factura de 30 días con 250 kWh de consumo', { size: 19, weight: 700 })
  let x = M
  const ww = W - 2 * M
  partes.forEach(([, v, , c]) => { const w = (v / total) * ww; s += rect(x, 206, Math.max(w - 3, 4), 56, { rx: 6, fill: c }); x += w })
  s += T.tx(W - M, 296, `Total: ${eur(total)} €`, { size: 26, weight: 700, anchor: 'end', fill: T.accent })
  partes.forEach(([a, v, d, c], i) => {
    const y = 322 + i * 62
    s += rect(M, y, ww, 52, { rx: 10, fill: T.soft })
    s += rect(M + 14, y + 18, 16, 16, { rx: 4, fill: c })
    s += T.tx(M + 42, y + 23, a, { size: 17, weight: 700 })
    s += T.tx(M + 42, y + 43, d, { size: 13, fill: T.muted })
    s += T.tx(W - M - 16, y + 33, `${eur(v)} €`, { size: 19, weight: 700, anchor: 'end', fill: c })
  })
  const n = T.nota(322 + 5 * 62 + 16, 'El término de potencia se paga aunque no consumas nada: bajar la potencia contratada es el ahorro más rápido si te sobra.')
  return T.lienzo({ alto: Math.round(322 + 5 * 62 + 16 + n.h + 60), slug: 'calculadora-factura-luz', titulo: 'Qué pagas en cada parte de la factura de la luz', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 193 Jubilación España (papel, calendario)
function jubilacion() {
  const T = tema('papel', { accent: '#0F766E', soft: '#CCFBF1' })
  const anios = [['2024', '66 años y 6 meses', '38 años'], ['2025', '66 años y 8 meses', '38 años y 3 meses'], ['2026', '66 años y 10 meses', '38 años y 3 meses'], ['2027 en adelante', '67 años', '38 años y 6 meses']]
  let s = T.tx(M, 188, 'Edad ordinaria de jubilación según el año', { size: 20, weight: 700, family: T.titulo })
  s += T.tx(M, 214, 'Si no llegas a la cotización que se indica más abajo', { size: 14, fill: T.muted })
  const cw = (W - 2 * M - 36) / 4
  anios.forEach(([a, b, c], i) => {
    const x = M + i * (cw + 12)
    const h = 120 + i * 30
    const y = 470 - h
    s += rect(x, y, cw, h, { rx: 12, fill: i === 2 ? T.accent : '#5EEAD4' })
    s += T.tx(x + cw / 2, y + 34, a, { size: i === 3 ? 15 : 20, weight: 700, anchor: 'middle', fill: i === 2 ? '#FFFFFF' : '#134E4A' })
    s += T.tx(x + cw / 2, y + 66, b.split(' y ')[0], { size: 17, weight: 700, anchor: 'middle', fill: i === 2 ? '#FFFFFF' : '#134E4A' })
    if (b.includes(' y ')) s += T.tx(x + cw / 2, y + 88, `y ${b.split(' y ')[1]}`, { size: 15, anchor: 'middle', fill: i === 2 ? '#FFFFFF' : '#134E4A' })
  })
  const ty = 510
  s += T.tx(M, ty, 'A los 65 años, si has cotizado al menos…', { size: 18, weight: 700, family: T.titulo })
  anios.forEach(([a, , c], i) => {
    const x = M + i * (cw + 12)
    s += rect(x, ty + 16, cw, 64, { rx: 10, fill: T.soft })
    s += T.tx(x + cw / 2, ty + 42, a.replace(' en adelante', '+'), { size: 14, anchor: 'middle', fill: T.muted })
    s += T.tx(x + cw / 2, ty + 66, c, { size: 14, weight: 700, anchor: 'middle', fill: T.accent })
  })
  const n = T.nota(ty + 112, 'Para cobrar pensión contributiva hacen falta al menos 15 años cotizados, 2 de ellos dentro de los últimos 15.')
  return T.lienzo({ alto: Math.round(ty + 112 + n.h + 60), slug: 'jubilacion-espana', titulo: 'A qué edad te puedes jubilar en España', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 194 Sucesiones (plano, escala progresiva)
function sucesiones() {
  const T = tema('plano', { accent: '#FDBA74', font: 'Segoe UI, Arial, sans-serif' })
  const tramos = [[0, 7.65], [7993, 8.5], [15981, 9.35], [23968, 10.2], [31956, 11.05], [39943, 11.9], [47931, 12.75], [55918, 13.6], [63906, 14.45], [71893, 15.3], [79881, 16.15], [119758, 18.7], [159635, 21.25], [239389, 25.5], [398778, 29.75], [797555, 34]]
  let s = T.tx(M, 186, 'Escala estatal: el tipo sube por tramos de base liquidable', { size: 18, weight: 700, fill: '#FFFFFF' })
  const bw = (W - 2 * M) / tramos.length
  const base = 440
  tramos.forEach(([d, p], i) => {
    const h = (p / 34) * 200
    s += rect(M + i * bw + 2, base - h, bw - 4, h, { rx: 4, fill: i === 12 ? T.accent : '#7DD3FC' })
    if ([0, 5, 10, 12, 15].includes(i)) s += T.tx(M + i * bw + bw / 2, base - h - 8, `${String(p).replace('.', ',')} %`, { size: 12, anchor: 'middle', fill: '#FFFFFF' })
  })
  s += T.tx(M, base + 22, '0 €', { size: 12, fill: T.muted }) + T.tx(W - M, base + 22, '+797.555 €', { size: 12, anchor: 'end', fill: T.muted })
  const ey = 500
  s += T.tx(M, ey, 'Hijo de 30 años que hereda 200.000 €', { size: 18, weight: 700, fill: '#FFFFFF' })
  const pasos = [['Reducción por parentesco (grupo II)', '− 15.956,87 €'], ['Base liquidable', '184.043,13 €'], ['Cuota según la escala', '28.250,01 €'], ['Tipo efectivo sobre lo heredado', '14,1 %']]
  pasos.forEach(([a, b], i) => {
    const y = ey + 18 + i * 48
    s += rect(M, y, W - 2 * M, 40, { rx: 8, fill: T.soft, stroke: i === 2 ? T.accent : T.line, sw: 1.5 })
    s += T.tx(M + 14, y + 26, a, { size: 16 })
    s += T.tx(W - M - 14, y + 26, b, { size: 17, weight: 700, anchor: 'end', fill: i === 2 ? T.accent : '#FFFFFF', family: mono })
  })
  const n = T.nota(ey + 18 + 4 * 48 + 14, 'Es la norma estatal, sin bonificaciones. Madrid, Andalucía y otras comunidades bonifican hasta el 99 % a hijos y cónyuges.')
  return T.lienzo({ alto: Math.round(ey + 18 + 4 * 48 + 14 + n.h + 56), slug: 'impuesto-sucesiones', titulo: 'Cómo se calcula el impuesto de sucesiones', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 195 Reformar (pastel naranja, rangos €/m²)
function reformar() {
  const T = tema('pastel', { accent: '#C2410C', soft: '#FFEDD5', bg: '#FFFAF5', ink: '#431407', line: '#FED7AA' })
  const tipos = [['Lavado de cara', 'pintura, suelos, detalles', 150, 300], ['Reforma parcial', 'suelos, carpintería, electricidad', 350, 600], ['Reforma integral', 'con cocina y baños', 600, 1000], ['Integral de calidad alta', 'materiales y acabados premium', 1000, 1600]]
  let s = T.tx(M, 186, 'Precio orientativo por m², sin IVA', { size: 19, weight: 700 })
  const x0 = M + 230
  const ww = W - M - x0
  const X = (v) => x0 + (v / 1700) * ww
  ;[0, 500, 1000, 1500].forEach((v) => { s += `<line x1="${X(v)}" y1="206" x2="${X(v)}" y2="${206 + 4 * 74}" stroke="${T.line}" stroke-width="1.5"/>` + T.tx(X(v), 206 + 4 * 74 + 20, `${v} €`, { size: 13, anchor: 'middle', fill: T.muted }) })
  tipos.forEach(([a, b, mn, mx], i) => {
    const y = 214 + i * 74
    s += T.tx(M, y + 24, a, { size: 16, weight: 700 })
    s += T.tx(M, y + 44, b, { size: 13, fill: T.muted })
    s += rect(X(mn), y + 8, X(mx) - X(mn), 36, { rx: 18, fill: i === 2 ? T.accent : '#FDBA74' })
    s += T.tx((X(mn) + X(mx)) / 2, y + 32, `${mn}–${mx}`, { size: 14, weight: 700, anchor: 'middle', fill: i === 2 ? '#FFFFFF' : T.ink })
  })
  const ey = 206 + 4 * 74 + 56
  s += rect(M, ey, W - 2 * M, 112, { rx: 14, fill: T.soft })
  s += T.tx(M + 18, ey + 34, 'Piso de 60 m², reforma parcial, calidad media', { size: 17, weight: 700 })
  s += T.tx(M + 18, ey + 64, '60 × 350 a 600 € = 21.000 a 36.000 €', { size: 18, family: mono })
  s += T.tx(M + 18, ey + 92, '+ 10 % de IVA en vivienda habitual (con requisitos) y licencia de obra municipal', { size: 14, fill: T.muted })
  return T.lienzo({ alto: ey + 112 + 70, slug: 'cuanto-cuesta-reformar', titulo: 'Cuánto cuesta reformar por metro cuadrado', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 196 Huella de carbono (pizarra, dietas)
function huella() {
  const T = tema('pizarra')
  const dietas = [['Mucha carne', 2.62], ['Carne moderada', 2.05], ['Poca carne', 1.7], ['Pescetariana', 1.43], ['Vegetariana', 1.39], ['Vegana', 1.05]]
  let s = T.tx(M, 192, 'Toneladas de CO₂ al año solo por la dieta', { size: 24, family: T.titulo, fill: T.accent })
  const maxW = W - 2 * M - 250
  dietas.forEach(([a, t], i) => {
    const y = 214 + i * 52
    s += T.tx(M, y + 28, a, { size: 18, family: T.titulo })
    s += rect(M + 190, y + 8, (t / 2.62) * maxW, 30, { rx: 6, fill: i === 0 ? '#F87171' : i < 3 ? '#FBBF24' : '#86EFAC' })
    s += T.tx(M + 200 + (t / 2.62) * maxW, y + 30, `${String(t).replace('.', ',')} t`, { size: 17, weight: 700 })
  })
  const fy = 214 + 6 * 52 + 30
  s += T.tx(M, fy, 'Factores de emisión que usa la calculadora', { size: 22, family: T.titulo, fill: T.accent })
  const f = [['1 litro de gasolina', '2,31 kg'], ['1 litro de diésel', '2,68 kg'], ['1 hora de vuelo', '≈ 90 kg por pasajero'], ['1 bombona de butano', '37 kg']]
  const cw = (W - 2 * M - 16) / 2
  f.forEach(([a, b], i) => {
    const x = M + (i % 2) * (cw + 16)
    const y = fy + 18 + Math.floor(i / 2) * 72
    s += rect(x, y, cw, 60, { rx: 12, fill: T.soft, stroke: T.line, sw: 1.5 })
    s += T.tx(x + 16, y + 26, a, { size: 15 })
    s += T.tx(x + 16, y + 50, b, { size: 19, weight: 700, family: T.titulo, fill: T.accent })
  })
  const n = T.nota(fy + 18 + 2 * 72 + 12, 'Dietas según Scarborough et al. (Climatic Change, 2014). La media en España ronda las 5 toneladas por persona y año.')
  return T.lienzo({ alto: Math.round(fy + 18 + 2 * 72 + 12 + n.h + 60), slug: 'huella-de-carbono', titulo: 'Cuánto CO₂ emite lo que comes y cómo te mueves', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 197 Dólar blue (banda celeste, tipos de dólar)
function dolarBlue() {
  const T = tema('banda', { accent: '#0369A1', soft: '#F0F9FF' })
  const tipos = [['Oficial', 'el que fija el BCRA y venden los bancos'], ['Blue', 'mercado informal, en cuevas y arbolitos'], ['MEP (bolsa)', 'comprando y vendiendo bonos en pesos y dólares'], ['Contado con liqui', 'como el MEP, pero con los dólares en el exterior'], ['Mayorista', 'entre bancos y grandes empresas'], ['Tarjeta', 'el oficial más los impuestos a gastos en el exterior'], ['Cripto', 'stablecoins como USDT compradas con pesos']]
  let s = ''
  tipos.forEach(([a, b], i) => {
    const y = 184 + i * 58
    s += rect(M, y, W - 2 * M, 48, { rx: 10, fill: i === 1 ? '#DBEAFE' : T.soft, stroke: i === 1 ? T.accent : '#E0F2FE', sw: 2 })
    s += T.tx(M + 16, y + 30, a, { size: 18, weight: 700, fill: T.accent })
    s += T.tx(M + 210, y + 30, b, { size: 15 })
  })
  const by = 184 + 7 * 58 + 20
  s += rect(M, by, W - 2 * M, 104, { rx: 14, fill: '#0C4A6E' })
  s += T.tx(M + 20, by + 34, 'Brecha cambiaria', { size: 18, weight: 700, fill: '#FFFFFF' })
  s += T.tx(M + 20, by + 70, '(precio del blue ÷ precio oficial − 1) × 100', { size: 20, family: mono, fill: '#7DD3FC' })
  s += T.tx(M + 20, by + 92, 'Si el blue cuesta 1.500 y el oficial 1.250, la brecha es del 20 %.', { size: 13, fill: '#BAE6FD' })
  return T.lienzo({ alto: by + 104 + 64, slug: 'dolar-blue', titulo: 'Los tipos de dólar en Argentina', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 198 Monotributo (oscuro azul, categorías)
function monotributo() {
  const T = tema('oscuro', { accent: '#38BDF8', bg: '#071526', soft: '#0E2238', line: '#1B3654' })
  const cats = [['A', 12.01, 49527], ['B', 17.6, 56379], ['C', 24.67, 66020], ['D', 30.63, 84613], ['E', 36.03, 119811], ['F', 45.15, 150784], ['G', 54, 230313], ['H', 81.92, 522707], ['I', 91.7, 963748], ['J', 105.01, 1167300], ['K', 126.61, 1614446]]
  let s = T.tx(M, 184, 'Tope de facturación anual y cuota mensual (servicios)', { size: 18, weight: 700 })
  const maxW = W - 2 * M - 300
  cats.forEach(([c, tope, cuota], i) => {
    const y = 204 + i * 40
    s += T.tx(M + 10, y + 24, c, { size: 18, weight: 700, fill: T.accent })
    s += T.tx(M + 46, y + 24, `$${String(tope).replace('.', ',')} M`, { size: 14, fill: T.muted })
    s += rect(M + 150, y + 6, Math.max(6, (cuota / 1614446) * maxW), 26, { rx: 5, fill: T.accent })
    s += T.tx(W - M, y + 24, `$${cuota.toLocaleString('es-AR')}`, { size: 15, weight: 700, anchor: 'end' })
  })
  const n = T.nota(204 + 11 * 40 + 16, 'Escalas desde agosto de 2026. La cuota incluye impuesto integrado, aporte jubilatorio (SIPA) y obra social. La recategorización es en enero y julio.')
  return T.lienzo({ alto: Math.round(204 + 11 * 40 + 16 + n.h + 60), slug: 'monotributo', titulo: 'Categorías del Monotributo y cuánto se paga', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 199 Inflación (papel, interés compuesto de precios)
function inflacion() {
  const T = tema('papel', { accent: '#B91C1C', soft: '#FEE2E2' })
  let s = T.tx(M, 188, '¿Por qué 12 meses al 2 % no son un 24 %?', { size: 21, weight: 700, family: T.titulo })
  const gx = M + 40
  const gy = 220
  const gw = W - 2 * M - 60
  const gh = 230
  const X = (m) => gx + (m / 12) * gw
  const Y = (v) => gy + gh - (v / 30) * gh
  for (let v = 0; v <= 30; v += 10) s += `<line x1="${gx}" y1="${Y(v)}" x2="${gx + gw}" y2="${Y(v)}" stroke="${T.line}" stroke-width="1"/>` + T.tx(gx - 8, Y(v) + 5, `${v} %`, { size: 12, anchor: 'end', fill: T.muted })
  let lin = ''
  let comp = ''
  for (let m = 0; m <= 12; m++) {
    lin += `${m ? 'L' : 'M'}${X(m)},${Y(2 * m)} `
    comp += `${m ? 'L' : 'M'}${X(m)},${Y((Math.pow(1.02, m) - 1) * 100)} `
  }
  s += `<path d="${lin}" fill="none" stroke="#9CA3AF" stroke-width="3" stroke-dasharray="7 5"/><path d="${comp}" fill="none" stroke="${T.accent}" stroke-width="4"/>`
  s += T.tx(X(12) - 4, Y(24) + 42, 'suma simple: 24 %', { size: 14, anchor: 'end', fill: T.muted })
  s += T.tx(X(12) - 4, Y(26.82) - 10, 'real: 26,82 %', { size: 15, weight: 700, anchor: 'end', fill: T.accent })
  for (let m = 0; m <= 12; m += 3) s += T.tx(X(m), gy + gh + 20, `mes ${m}`, { size: 12, anchor: 'middle', fill: T.muted })
  const ty = gy + gh + 56
  s += T.tx(M, ty, 'Cada mes sube sobre el precio ya subido: (1 + i)¹² − 1', { size: 17, family: mono })
  const filas = [['1 % mensual', '12,68 % anual'], ['2 % mensual', '26,82 % anual'], ['3 % mensual', '42,58 % anual']]
  const cw = (W - 2 * M - 24) / 3
  filas.forEach(([a, b], i) => {
    const x = M + i * (cw + 12)
    s += rect(x, ty + 20, cw, 72, { rx: 12, fill: T.soft })
    s += T.tx(x + cw / 2, ty + 48, a, { size: 15, anchor: 'middle', fill: T.muted })
    s += T.tx(x + cw / 2, ty + 76, b, { size: 19, weight: 700, anchor: 'middle', fill: T.accent })
  })
  return T.lienzo({ alto: ty + 92 + 70, slug: 'calculadora-inflacion', titulo: 'La inflación se acumula, no se suma', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 200 Preaviso Argentina (terminal, liquidación)
function preaviso() {
  const T = tema('terminal', { accent: '#FBBF24' })
  let s = T.tx(M, 184, '$ despido sin preaviso', { size: 20, fill: '#34D399' })
  const datos = [['sueldo', '$1.200.000'], ['antigüedad', '3 años y 4 meses'], ['fecha de despido', '10 de octubre de 2026']]
  datos.forEach(([a, b], i) => { s += T.tx(M, 220 + i * 28, `${a.padEnd(18, ' ')}`, { size: 17, fill: T.muted }) + T.tx(M + 230, 220 + i * 28, b, { size: 17 }) })
  const ty = 330
  const filas = [['Indemnización sustitutiva', '1 mes (hasta 5 años de antigüedad)', '$1.200.000'], ['Integración del mes', '21 días restantes de octubre', '$812.903'], ['SAC sobre ambos conceptos', '1/12 de lo anterior', '$167.742']]
  filas.forEach(([a, b, c], i) => {
    const y = ty + i * 72
    s += rect(M, y, W - 2 * M, 62, { rx: 10, fill: T.soft })
    s += T.tx(M + 16, y + 27, a, { size: 18, weight: 700 })
    s += T.tx(M + 16, y + 49, `# ${b}`, { size: 14, fill: T.muted })
    s += T.tx(W - M - 16, y + 38, c, { size: 20, weight: 700, anchor: 'end', fill: T.accent })
  })
  const by = ty + 3 * 72 + 10
  s += T.tx(M, by + 24, 'total', { size: 20, fill: '#34D399' }) + T.tx(W - M - 16, by + 24, '$2.180.645', { size: 26, weight: 700, anchor: 'end', fill: '#34D399' })
  const ry = by + 70
  const reglas = [['período de prueba', '15 días'], ['hasta 5 años', '1 mes'], ['más de 5 años', '2 meses']]
  reglas.forEach(([a, b], i) => {
    const cw = (W - 2 * M - 24) / 3
    const x = M + i * (cw + 12)
    s += rect(x, ry, cw, 64, { rx: 10, fill: T.soft, stroke: T.line, sw: 1.5 })
    s += T.tx(x + cw / 2, ry + 26, a, { size: 14, anchor: 'middle', fill: T.muted })
    s += T.tx(x + cw / 2, ry + 50, b, { size: 19, weight: 700, anchor: 'middle' })
  })
  const n = T.nota(ry + 96, '// art. 231 a 233 de la LCT. Además corresponde la indemnización por antigüedad, que se calcula aparte.')
  return T.lienzo({ alto: Math.round(ry + 96 + n.h + 60), slug: 'preaviso-laboral', titulo: 'Cuánto se cobra si te despiden sin preaviso', cuerpo: s + n.svg })
}

const pieza = (archivo, alt, fn) => ({ archivo, alt, dibujar: fn })

module.exports = [
  pieza('formula-nota-pau-acceso-admision', 'Fórmula de la nota de acceso y de admisión de la PAU con un ejemplo resuelto', notaCorte),
  pieza('desglose-factura-luz-espana', 'Desglose de una factura de la luz de 30 días: potencia, energía, impuesto eléctrico, alquiler del contador e IVA', facturaLuz),
  pieza('edad-jubilacion-espana-2024-2027', 'Edad ordinaria de jubilación en España de 2024 a 2027 y cotización necesaria para jubilarse a los 65', jubilacion),
  pieza('escala-impuesto-sucesiones', 'Escala estatal del impuesto de sucesiones y ejemplo de un hijo que hereda 200.000 euros', sucesiones),
  pieza('precio-reforma-metro-cuadrado', 'Rangos de precio por metro cuadrado según el tipo de reforma y ejemplo para un piso de 60 m²', reformar),
  pieza('huella-carbono-dieta-factores', 'Toneladas de CO2 al año según la dieta y factores de emisión de combustibles y vuelos', huella),
  pieza('tipos-dolar-argentina', 'Tipos de dólar en Argentina: oficial, blue, MEP, contado con liqui, mayorista, tarjeta y cripto, y fórmula de la brecha', dolarBlue),
  pieza('categorias-monotributo-2026', 'Categorías del Monotributo de la A a la K con su tope de facturación anual y la cuota mensual para servicios', monotributo),
  pieza('inflacion-acumulada-vs-suma', 'Gráfica que muestra por qué la inflación mensual se acumula y no se suma, con equivalencias anuales', inflacion),
  pieza('liquidacion-preaviso-argentina', 'Ejemplo de liquidación por despido sin preaviso en Argentina con integración del mes y SAC', preaviso),
]
