// Infografías del lote 22 (herramientas 211 a 220).
const { rect, circle } = require('../illustrations/kit')
const { tema, W, M } = require('./piezas-4').temas

const mono = 'Consolas, monospace'

// ─────────────────────────────────────────────────────────── 211 Intereses de cesantías (pastel turquesa)
function interesesCesantias() {
  const T = tema('pastel', { accent: '#0F766E', soft: '#CCFBF1', bg: '#F5FFFD', ink: '#042F2E', line: '#99F6E4' })
  let s = rect(M, 180, W - 2 * M, 96, { rx: 16, fill: '#FFFFFF', stroke: T.line, sw: 2 })
  s += T.tx(W / 2, 222, 'Intereses = cesantías × días × 12 % ÷ 360', { size: 22, weight: 700, anchor: 'middle', family: mono })
  s += T.tx(W / 2, 254, 'se pagan directo al trabajador, a más tardar el 31 de enero', { size: 14, anchor: 'middle', fill: T.muted })
  const filas = [['Año completo', '360 días', '$2.000.000', '$240.000'], ['Desde el 1 de abril', '270 días', '$1.500.000', '$135.000'], ['Desde el 1 de julio', '180 días', '$1.000.000', '$60.000'], ['Desde el 1 de octubre', '90 días', '$500.000', '$15.000']]
  const cx = [M, M + 250, M + 400, W - M]
  ;['Ingreso', 'Días', 'Cesantías', 'Intereses'].forEach((c, i) => { s += T.tx(cx[i], 320, c, { size: 14, weight: 700, fill: T.muted, anchor: i === 3 ? 'end' : 'start' }) })
  filas.forEach((f, i) => {
    const y = 334 + i * 56
    s += rect(M - 8, y, W - 2 * M + 16, 46, { rx: 10, fill: i % 2 ? '#FFFFFF' : T.soft })
    f.forEach((v, k) => { s += T.tx(cx[k], y + 30, v, { size: 17, weight: k === 3 ? 700 : 400, fill: k === 3 ? T.accent : T.ink, anchor: k === 3 ? 'end' : 'start' }) })
  })
  const n = T.nota(334 + 4 * 56 + 20, 'Base: salario mínimo de 2026 más auxilio de transporte ($2.000.000). Con menos de un año, los intereses bajan dos veces: menos cesantías y menos días.')
  return T.lienzo({ alto: Math.round(334 + 4 * 56 + 20 + n.h + 60), slug: 'intereses-cesantias', titulo: 'Cuánto son los intereses de las cesantías', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 212 Retención en la fuente (terminal, depuración)
function retencion() {
  const T = tema('terminal', { accent: '#FBBF24' })
  let s = T.tx(M, 184, '$ retencion --salario 10000000', { size: 19, fill: '#34D399' })
  const pasos = [['ingreso laboral', '10.000.000', T.ink], ['− pensión 4 % y salud 4 %', '− 800.000', '#F87171'], ['− fondo de solidaridad 1 % (más de 4 SMMLV)', '− 100.000', '#F87171'], ['= ingreso neto', '9.100.000', T.ink], ['− renta exenta del 25 %', '− 2.275.000', '#F87171'], ['= base gravable', '6.825.000', T.accent], ['en UVT ($52.374)', '130,31 UVT', T.accent]]
  pasos.forEach(([a, b, c], i) => {
    const y = 222 + i * 40
    s += T.tx(M, y, a, { size: 17, fill: c === T.ink ? T.ink : T.muted })
    s += T.tx(W - M, y, b, { size: 18, weight: 700, anchor: 'end', fill: c })
  })
  const ty = 222 + 7 * 40 + 10
  s += rect(M, ty, W - 2 * M, 112, { rx: 10, fill: T.soft, stroke: T.accent, sw: 2 })
  s += T.tx(M + 16, ty + 32, '# tabla del art. 383: de 95 a 150 UVT, 19 % marginal', { size: 15, fill: T.muted })
  s += T.tx(M + 16, ty + 62, '(130,31 − 95) × 19 % = 6,71 UVT × 52.374', { size: 17 })
  s += T.tx(M + 16, ty + 94, 'retención mensual ≈ $351.000', { size: 22, weight: 700, fill: T.accent })
  const n = T.nota(ty + 144, '// por debajo de 95 UVT de base gravable no hay retención. Dependientes, medicina prepagada e intereses de vivienda la bajan.')
  return T.lienzo({ alto: Math.round(ty + 144 + n.h + 60), slug: 'retencion-en-la-fuente', titulo: 'Retención en la fuente paso a paso', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 213 Vacaciones Colombia (cuaderno, calendario)
function vacacionesCo() {
  const T = tema('cuaderno', { accent: '#B45309' })
  let s = T.tx(M, 190, '15 días hábiles por año trabajado', { size: 24, weight: 700, family: T.titulo, fill: T.accent })
  const dias = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
  const cw = (W - 2 * M - 60) / 7
  dias.forEach((d, i) => { s += T.tx(M + i * (cw + 10) + cw / 2, 226, d, { size: 16, weight: 700, anchor: 'middle', fill: T.muted }) })
  let habil = 0
  for (let k = 0; k < 21; k++) {
    const f = Math.floor(k / 7)
    const c = k % 7
    const finde = c >= 5
    const toma = !finde && habil < 15
    if (toma) habil++
    s += rect(M + c * (cw + 10), 240 + f * 58, cw, 48, { rx: 8, fill: toma ? '#FDE68A' : finde ? '#E5E7EB' : '#FFFFFF', stroke: '#93C5FD', sw: 1 })
    s += T.tx(M + c * (cw + 10) + cw / 2, 240 + f * 58 + 31, String(k + 1), { size: 16, anchor: 'middle', family: T.titulo })
  }
  s += T.tx(M, 240 + 3 * 58 + 24, 'En una empresa de lunes a viernes, 15 días hábiles son 3 semanas de descanso.', { size: 16, family: T.titulo })
  const ey = 240 + 3 * 58 + 66
  s += rect(M, ey, W - 2 * M, 130, { rx: 14, fill: '#FFFFFF', stroke: '#93C5FD', sw: 1.5 })
  s += T.tx(M + 20, ey + 34, 'Pago de las vacaciones', { size: 19, weight: 700, family: T.titulo })
  s += T.tx(M + 20, ey + 68, 'salario ÷ 30 × días de vacaciones', { size: 19, family: mono })
  s += T.tx(M + 20, ey + 104, 'Salario de $3.000.000 → $100.000 por día', { size: 17, family: T.titulo, fill: T.muted })
  return T.lienzo({ alto: ey + 130 + 70, slug: 'vacaciones-colombia', titulo: 'Cuántas vacaciones tienes en Colombia', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 214 Renta de quinta (banda roja, tramos)
function quinta() {
  const T = tema('banda', { accent: '#B91C1C', soft: '#FEF2F2' })
  let s = T.tx(M, 188, 'Sueldo de S/ 5,000 con 2 gratificaciones al año', { size: 18, weight: 700 })
  const pasos = [['12 sueldos + 2 gratificaciones', 'S/ 70,000'], ['+ bonificación extraordinaria del 9 %', 'S/ 900'], ['= renta bruta anual', 'S/ 70,900'], ['− 7 UIT (7 × S/ 5,500)', '− S/ 38,500'], ['= renta neta', 'S/ 32,400']]
  pasos.forEach(([a, b], i) => {
    const y = 208 + i * 42
    s += rect(M, y, W - 2 * M, 36, { rx: 8, fill: i === 2 || i === 4 ? T.soft : '#FFFFFF', stroke: '#F3F4F6', sw: 1 })
    s += T.tx(M + 14, y + 24, a, { size: 16 })
    s += T.tx(W - M - 14, y + 24, b, { size: 17, weight: 700, anchor: 'end', fill: i === 4 ? T.accent : '#111827' })
  })
  const ty = 208 + 5 * 42 + 30
  s += T.tx(M, ty, 'Tramos sobre la renta neta', { size: 18, weight: 700 })
  const tramos = [['hasta 5 UIT', '8 %'], ['5 a 20 UIT', '14 %'], ['20 a 35 UIT', '17 %'], ['35 a 45 UIT', '20 %'], ['más de 45', '30 %']]
  const cw = (W - 2 * M - 48) / 5
  tramos.forEach(([a, b], i) => {
    const x = M + i * (cw + 12)
    s += rect(x, ty + 16, cw, 72, { rx: 12, fill: i < 2 ? T.accent : '#FECACA' })
    s += T.tx(x + cw / 2, ty + 44, a, { size: 13, anchor: 'middle', fill: i < 2 ? '#FFFFFF' : '#7F1D1D' })
    s += T.tx(x + cw / 2, ty + 74, b, { size: 22, weight: 700, anchor: 'middle', fill: i < 2 ? '#FFFFFF' : '#7F1D1D' })
  })
  const ry = ty + 118
  s += rect(M, ry, W - 2 * M, 96, { rx: 14, fill: T.soft })
  s += T.tx(M + 18, ry + 32, '27,500 × 8 % + 4,900 × 14 % = S/ 2,886 al año', { size: 18, family: mono })
  s += T.tx(M + 18, ry + 70, 'Retención mensual: S/ 240.50', { size: 22, weight: 700, fill: T.accent })
  return T.lienzo({ alto: ry + 96 + 70, slug: 'renta-quinta-categoria', titulo: 'Cómo se calcula la renta de quinta categoría', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 215 UIT a soles (plano, histórico)
function uit() {
  const T = tema('plano', { accent: '#FCA5A5', font: 'Segoe UI, Arial, sans-serif' })
  const hist = [[2017, 4050], [2018, 4150], [2019, 4200], [2020, 4300], [2021, 4400], [2022, 4600], [2023, 4950], [2024, 5150], [2025, 5350], [2026, 5500]]
  let s = T.tx(M, 186, 'Valor de la UIT en soles, de 2017 a 2026', { size: 18, weight: 700, fill: '#FFFFFF' })
  const bw = (W - 2 * M) / hist.length
  const base = 440
  hist.forEach(([a, v], i) => {
    const h = ((v - 3500) / 2000) * 210
    s += rect(M + i * bw + 6, base - h, bw - 12, h, { rx: 6, fill: i === 9 ? T.accent : '#7DD3FC' })
    s += T.tx(M + i * bw + bw / 2, base - h - 8, v.toLocaleString('es-PE'), { size: 13, weight: 700, anchor: 'middle', fill: '#FFFFFF' })
    s += T.tx(M + i * bw + bw / 2, base + 20, String(a), { size: 13, anchor: 'middle', fill: T.muted })
  })
  const ty = 490
  s += T.tx(M, ty, 'Para qué se usa en 2026', { size: 18, weight: 700, fill: '#FFFFFF' })
  const usos = [['7 UIT', 'S/ 38,500', 'deducción anual de la renta de trabajo'], ['5 UIT', 'S/ 27,500', 'límite del primer tramo de renta (8 %)'], ['3 UIT', 'S/ 16,500', 'deducción adicional por gastos'], ['0.5 UIT', 'S/ 2,750', 'referencia de multas menores']]
  usos.forEach(([a, b, c], i) => {
    const y = ty + 18 + i * 50
    s += rect(M, y, W - 2 * M, 42, { rx: 8, fill: T.soft, stroke: T.line, sw: 1.5 })
    s += T.tx(M + 14, y + 28, a, { size: 17, weight: 700, fill: T.accent })
    s += T.tx(M + 110, y + 28, b, { size: 17, weight: 700, fill: '#FFFFFF', family: mono })
    s += T.tx(W - M - 14, y + 28, c, { size: 14, anchor: 'end', fill: T.muted })
  })
  return T.lienzo({ alto: ty + 18 + 4 * 50 + 56, slug: 'uit-a-soles', titulo: 'Cuánto vale la UIT y para qué sirve', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 216 Vacaciones Perú (papel, truncas)
function vacacionesPe() {
  const T = tema('papel', { accent: '#B91C1C', soft: '#FEE2E2' })
  let s = T.tx(M, 188, '30 días calendario por cada año completo de servicios', { size: 20, weight: 700, family: T.titulo })
  const meses = 12
  const mw = (W - 2 * M) / meses
  for (let i = 0; i < meses; i++) s += rect(M + i * mw + 2, 210, mw - 4, 50, { rx: 6, fill: i < 7 ? T.accent : '#F3F4F6' })
  s += rect(M + 7 * mw + 2, 210, (mw - 4) / 3, 50, { rx: 4, fill: '#FCA5A5' })
  s += T.tx(M, 290, 'Cesaste a los 7 meses y 10 días: te corresponden vacaciones truncas', { size: 16, fill: T.muted })
  const ey = 320
  const filas = [['Por los meses', 'S/ 3,000 ÷ 12 × 7', 'S/ 1,750.00'], ['Por los días', 'S/ 3,000 ÷ 360 × 10', 'S/ 83.33'], ['Vacaciones truncas', '', 'S/ 1,833.33']]
  filas.forEach(([a, b, c], i) => {
    const y = ey + i * 60
    s += rect(M, y, W - 2 * M, 50, { rx: 10, fill: i === 2 ? T.soft : '#FFFFFF', stroke: T.line, sw: 1.5 })
    s += T.tx(M + 16, y + 32, a, { size: 18, weight: 700, family: T.titulo })
    if (b) s += T.tx(M + 250, y + 32, b, { size: 16, family: mono, fill: T.muted })
    s += T.tx(W - M - 16, y + 32, c, { size: 20, weight: 700, anchor: 'end', fill: T.accent })
  })
  const ty = ey + 3 * 60 + 30
  const casos = [['Vacaciones gozadas', 'descansas 30 días con sueldo'], ['Vacaciones truncas', 'cesas antes de cumplir el año'], ['Indemnización vacacional', 'no las tomaste en el año siguiente: una remuneración más']]
  casos.forEach(([a, b], i) => {
    s += T.tx(M, ty + i * 32, `• ${a}:`, { size: 16, weight: 700 })
    s += T.tx(M + 240, ty + i * 32, b, { size: 16 })
  })
  return T.lienzo({ alto: ty + 3 * 32 + 50, slug: 'vacaciones-peru', titulo: 'Vacaciones y vacaciones truncas en Perú', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 217 AFP vs ONP (oscuro, comparación)
function afpOnp() {
  const T = tema('oscuro', { accent: '#F59E0B', bg: '#111317', soft: '#1C1F26', line: '#2D323C' })
  const cw = (W - 2 * M - 20) / 2
  const col = (x, tit, c, items) => rect(x, 180, cw, 318, { rx: 16, fill: T.soft, stroke: c, sw: 2 }) + T.tx(x + 20, 220, tit, { size: 24, weight: 700, fill: c }) + items.map((t, i) => T.tx(x + 20, 262 + i * 42, t, { size: 16 })).join('')
  let s = col(M, 'ONP', '#60A5FA', ['Aporte: 13 % del sueldo', 'Fondo común del Estado', 'Pensión según años aportados', 'Mínimo 10 años para cobrar', 'No se hereda el fondo', 'Pensión máxima: S/ 1,000'])
  s += col(M + cw + 20, 'AFP', T.accent, ['Aporte: 10 % + comisión + seguro', 'Cuenta individual a tu nombre', 'Pensión según lo ahorrado', 'Sin mínimo de años', 'El saldo se hereda', 'Depende de la rentabilidad'])
  const ty = 534
  s += T.tx(M, ty, 'Pensión de la ONP según los años de aporte', { size: 18, weight: 700 })
  const tr = [['menos de 10', 'S/ 0'], ['10 a 14', 'S/ 300'], ['15 a 19', 'S/ 400'], ['20 o más', 'S/ 600 a 1,000']]
  const tw = (W - 2 * M - 36) / 4
  tr.forEach(([a, b], i) => {
    const x = M + i * (tw + 12)
    s += rect(x, ty + 16, tw, 72, { rx: 12, fill: T.soft, stroke: T.line, sw: 1.5 })
    s += T.tx(x + tw / 2, ty + 44, `${a} años`, { size: 14, anchor: 'middle', fill: T.muted })
    s += T.tx(x + tw / 2, ty + 74, b, { size: 19, weight: 700, anchor: 'middle', fill: '#60A5FA' })
  })
  const n = T.nota(ty + 120, 'Montos de la Ley 32123. La comisión y el seguro de cada AFP varían; compara antes de elegir.')
  return T.lienzo({ alto: Math.round(ty + 120 + n.h + 60), slug: 'afp-vs-onp', titulo: 'AFP u ONP: en qué se diferencian', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 218 Décimo tercero (pastel verde lima, suma de meses)
function decimoTercero() {
  const T = tema('pastel', { accent: '#4D7C0F', soft: '#ECFCCB', bg: '#FBFFF5', ink: '#1A2E05', line: '#D9F99D' })
  const meses = ['Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov']
  const valores = [600, 600, 600, 600, 650, 600, 600, 720, 600, 600, 600, 630]
  let s = T.tx(M, 186, 'Todo lo ganado del 1 de diciembre al 30 de noviembre', { size: 18, weight: 700 })
  const mw = (W - 2 * M) / 12
  const base = 400
  meses.forEach((m, i) => {
    const h = (valores[i] / 720) * 160
    s += rect(M + i * mw + 4, base - h, mw - 8, h, { rx: 6, fill: valores[i] > 600 ? T.accent : '#A3E635' })
    s += T.tx(M + i * mw + mw / 2, base - h - 8, `$${valores[i]}`, { size: 12, weight: 700, anchor: 'middle' })
    s += T.tx(M + i * mw + mw / 2, base + 20, m, { size: 13, anchor: 'middle', fill: T.muted })
  })
  s += T.tx(M, base + 50, 'Los meses más altos incluyen horas extra y comisiones: también suman.', { size: 14, fill: T.muted })
  const ey = base + 80
  s += rect(M, ey, W - 2 * M, 110, { rx: 14, fill: '#FFFFFF', stroke: T.line, sw: 2 })
  s += T.tx(M + 20, ey + 36, 'Suma: $7.400 ÷ 12', { size: 20, family: mono })
  s += T.tx(M + 20, ey + 82, 'Décimo tercero: $616,67', { size: 28, weight: 700, fill: T.accent })
  s += T.tx(W - M - 20, ey + 82, 'hasta el 24 de diciembre', { size: 15, anchor: 'end', fill: T.muted })
  const n = T.nota(ey + 140, 'Si lo pides por escrito, lo cobras mensualizado: la doceava parte cada mes junto al sueldo.')
  return T.lienzo({ alto: Math.round(ey + 140 + n.h + 60), slug: 'decimo-tercer-sueldo', titulo: 'Cómo se calcula el décimo tercer sueldo', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 219 Décimo cuarto (banda azul, regiones)
function decimoCuarto() {
  const T = tema('banda', { accent: '#1D4ED8', soft: '#EFF6FF' })
  let s = T.tx(M, 188, 'Un salario básico unificado al año: $482 en 2026', { size: 19, weight: 700 })
  const cw = (W - 2 * M - 20) / 2
  const reg = [['Sierra y Amazonía', '1 de agosto al 31 de julio', '15 de agosto', '#047857'], ['Costa y Galápagos', '1 de marzo al 28 de febrero', '15 de marzo', '#0369A1']]
  reg.forEach(([a, b, c, col], i) => {
    const x = M + i * (cw + 20)
    s += rect(x, 210, cw, 170, { rx: 16, fill: T.soft, stroke: col, sw: 2 })
    s += T.tx(x + 20, 248, a, { size: 20, weight: 700, fill: col })
    s += T.tx(x + 20, 284, 'Periodo de cálculo', { size: 13, fill: '#6B7280' })
    s += T.tx(x + 20, 306, b, { size: 16 })
    s += T.tx(x + 20, 340, 'Fecha límite de pago', { size: 13, fill: '#6B7280' })
    s += T.tx(x + 20, 364, c, { size: 20, weight: 700 })
  })
  const fy = 410
  s += T.tx(M, fy, 'Proporcional al tiempo y a la jornada', { size: 18, weight: 700 })
  s += rect(M, fy + 16, W - 2 * M, 60, { rx: 10, fill: '#F9FAFB', stroke: '#E5E7EB', sw: 1.5 })
  s += T.tx(W / 2, fy + 54, 'SBU × días trabajados ÷ 360 × horas semanales ÷ 40', { size: 18, anchor: 'middle', family: mono })
  const ej = [['Año completo, 40 h', '$482,00'], ['6 meses, 40 h', '$241,00'], ['Año completo, 20 h', '$241,00'], ['Mensualizado', '$40,17 al mes']]
  const ew = (W - 2 * M - 36) / 4
  ej.forEach(([a, b], i) => {
    const x = M + i * (ew + 12)
    s += rect(x, fy + 96, ew, 72, { rx: 12, fill: T.soft })
    s += T.tx(x + ew / 2, fy + 124, a, { size: 13, anchor: 'middle', fill: '#6B7280' })
    s += T.tx(x + ew / 2, fy + 154, b, { size: 18, weight: 700, anchor: 'middle', fill: T.accent })
  })
  return T.lienzo({ alto: fy + 168 + 66, slug: 'decimo-cuarto-sueldo', titulo: 'Cuándo y cuánto se paga el décimo cuarto', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 220 Fondos de reserva (cuaderno, dos opciones)
function fondos() {
  const T = tema('cuaderno', { accent: '#047857' })
  let s = T.tx(M, 190, 'Desde el segundo año con el mismo empleador', { size: 22, family: T.titulo })
  s += T.tx(M, 230, '8,33 % de la remuneración cada mes', { size: 28, weight: 700, family: T.titulo, fill: T.accent })
  s += T.tx(M, 262, 'Con un sueldo de $800 → $66,64 al mes · $799,68 al año', { size: 18, family: T.titulo, fill: T.muted })
  const cw = (W - 2 * M - 20) / 2
  const opc = [['Cobrarlo cada mes', ['Llega en tu rol de pagos.', 'Lo usas cuando quieras.', 'No genera intereses.']], ['Acumularlo en el IESS', ['Se deposita en tu cuenta del IESS.', 'Genera intereses.', 'Sirve de garantía para préstamos quirografarios e hipotecarios.']]]
  opc.forEach(([a, items], i) => {
    const x = M + i * (cw + 20)
    s += rect(x, 296, cw, 210, { rx: 14, fill: '#FFFFFF', stroke: '#93C5FD', sw: 2 })
    s += T.tx(x + 18, 332, a, { size: 20, weight: 700, fill: T.accent })
    items.forEach((t, k) => {
      const lineas = t.length > 34 ? [t.slice(0, t.lastIndexOf(' ', 34)), t.slice(t.lastIndexOf(' ', 34) + 1)] : [t]
      lineas.forEach((l, j) => { s += T.tx(x + 18, 372 + k * 44 + j * 22, (j ? '  ' : '• ') + l, { size: 16, family: T.titulo }) })
    })
  })
  const n = T.nota(536, 'No paga aportes al IESS ni impuesto a la renta. Si cambias de empleador, vuelves a cumplir un año antes de recibirlo de nuevo.')
  return T.lienzo({ alto: Math.round(536 + n.h + 56), slug: 'fondos-de-reserva', titulo: 'Cómo funcionan los fondos de reserva en Ecuador', cuerpo: s + n.svg })
}

const pieza = (archivo, alt, fn) => ({ archivo, alt, dibujar: fn })

module.exports = [
  pieza('intereses-cesantias-por-dias', 'Fórmula y tabla de intereses de cesantías según los días trabajados en el año', interesesCesantias),
  pieza('depuracion-retencion-fuente', 'Paso a paso de la depuración de la retención en la fuente de un salario de diez millones de pesos', retencion),
  pieza('vacaciones-colombia-dias-habiles', 'Calendario de 15 días hábiles de vacaciones en Colombia y fórmula de pago', vacacionesCo),
  pieza('calculo-renta-quinta-categoria', 'Cálculo de la renta de quinta categoría en Perú con un sueldo de 5.000 soles y los tramos del impuesto', quinta),
  pieza('valor-uit-historico-2026', 'Evolución del valor de la UIT de 2017 a 2026 y sus usos en soles', uit),
  pieza('vacaciones-truncas-peru', 'Cálculo de vacaciones truncas en Perú por meses y días trabajados', vacacionesPe),
  pieza('diferencias-afp-onp', 'Diferencias entre AFP y ONP en Perú y pensión de la ONP según años de aporte', afpOnp),
  pieza('calculo-decimo-tercer-sueldo', 'Suma de lo ganado de diciembre a noviembre para calcular el décimo tercer sueldo en Ecuador', decimoTercero),
  pieza('decimo-cuarto-regiones-ecuador', 'Periodos y fechas de pago del décimo cuarto sueldo en la Sierra y la Costa, con ejemplos proporcionales', decimoCuarto),
  pieza('fondos-de-reserva-ecuador', 'Fondos de reserva del 8,33 % en Ecuador y las dos formas de cobrarlos', fondos),
]
