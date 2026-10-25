// Infografías del lote 14 (herramientas 131 a 140).
const { rect, circle } = require('../illustrations/kit')
const { tema, W, M, es } = require('./piezas-4').temas
const mx = (n, d = 2) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })

// ─────────────────────────────────────────────────────────── 131 Cuotas IMSS (banda verde oscuro)
function cuotasImss() {
  const T = tema('banda', { accent: '#14532D', soft: '#F0FDF4' })
  let s = T.tx(M, 182, 'Salario base de cotización de $500 diarios, un mes (30.4 días)', { size: 17, fill: T.muted })
  const total = 4128.63
  const ancho = W - 2 * M
  s += rect(M, 202, ancho * (3749.62 / total), 66, { rx: 10, fill: T.accent })
  s += rect(M + ancho * (3749.62 / total), 202, ancho * (379.01 / total), 66, { rx: 0, fill: '#F59E0B' })
  s += T.tx(M + 18, 244, 'Patrón: $3,749.62', { size: 22, weight: 700, fill: '#FFF' })
  s += T.tx(W - M, 296, 'Trabajador: $379.01 →', { size: 17, weight: 700, anchor: 'end', fill: '#B45309' })
  const filas = [['Enfermedad y maternidad', 'Patrón y trabajador'], ['Invalidez y vida', 'Patrón y trabajador'], ['Cesantía y vejez', 'Patrón y trabajador'], ['Riesgos de trabajo', 'Solo el patrón'], ['Guarderías y prestaciones sociales', 'Solo el patrón'], ['Retiro (SAR) e Infonavit', 'Solo el patrón']]
  filas.forEach(([a, b], i) => {
    const y = 330 + i * 46
    s += rect(M, y, W - 2 * M, 40, { rx: 8, fill: i % 2 ? '#FFFFFF' : T.soft })
    s += T.tx(M + 14, y + 27, a, { size: 17 })
    s += T.tx(W - M - 14, y + 27, b, { size: 16, anchor: 'end', weight: 700, fill: b.startsWith('Solo') ? T.accent : '#B45309' })
  })
  const n = T.nota(330 + 6 * 46 + 20, 'Prima de riesgo de clase I (0.54355 %). La cuota patronal de cesantía y vejez sube cada año hasta 2030; el tope de cotización es 25 UMA diarias.')
  return T.lienzo({ alto: Math.round(330 + 6 * 46 + 20 + n.h + 64), slug: 'calcular-cuota-imss', titulo: 'Cuánto paga el patrón y cuánto el trabajador al IMSS', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 132 Salarios mínimos 2026 (papel)
function salariosMinimos() {
  const T = tema('papel', { accent: '#9F1239', soft: '#FFE4E6' })
  const cw = (W - 2 * M - 16) / 2
  const col = (x, titulo, diario, semanal, mensual, c) =>
    rect(x, 180, cw, 286, { rx: 18, fill: '#FFFDF8', stroke: c, sw: 3 }) +
    T.tx(x + 22, 218, titulo, { size: 20, weight: 700, family: T.titulo, fill: c }) +
    T.tx(x + 22, 270, `$${diario}`, { size: 40, weight: 700, family: T.titulo }) + T.tx(x + 22, 296, 'al día', { size: 16, fill: T.muted }) +
    T.tx(x + 22, 348, `$${semanal}`, { size: 22, weight: 700 }) + T.tx(x + 22, 370, 'a la semana (7 días)', { size: 15, fill: T.muted }) +
    T.tx(x + 22, 412, `$${mensual}`, { size: 22, weight: 700 }) + T.tx(x + 22, 432, 'al mes (30.4 días)', { size: 15, fill: T.muted })
  let s = col(M, 'Zona general', '315.04', '2,205.28', '9,577.22', T.accent)
  s += col(M + cw + 16, 'Zona libre de la frontera norte', '440.87', '3,086.09', '13,402.45', '#B45309')
  const uy = 500
  s += rect(M, uy, W - 2 * M, 100, { rx: 16, fill: T.soft })
  s += T.tx(M + 20, uy + 36, 'No confundir con la UMA: $117.31 diarios en 2026', { size: 19, weight: 700, family: T.titulo })
  s += T.tx(M + 20, uy + 68, 'La UMA sirve para multas, créditos y exenciones; el salario mínimo,', { size: 16 })
  s += T.tx(M + 20, uy + 90, 'para lo que se paga a un trabajador.', { size: 16 })
  const n = T.nota(uy + 140, 'Vigentes desde el 1 de enero de 2026, fijados por la Comisión Nacional de los Salarios Mínimos (CONASAMI). El salario mínimo no paga ISR.')
  return T.lienzo({ alto: Math.round(uy + 140 + n.h + 64), slug: 'salarios-minimos-2026', titulo: 'Salario mínimo 2026 en México por día, semana y mes', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 133 Modalidad 40 (oscuro)
function modalidad40() {
  const T = tema('oscuro', { accent: '#34D399', bg: '#0A1F17', soft: '#123326', line: '#1D4A38' })
  let s = rect(M, 180, W - 2 * M, 96, { rx: 16, fill: T.soft })
  s += T.tx(W / 2, 220, 'cuota mensual = salario diario × 30.4 × 14.438 %', { size: 22, weight: 700, anchor: 'middle', fill: T.accent })
  s += T.tx(W / 2, 254, 'tasa de 2026 para la continuación voluntaria', { size: 16, anchor: 'middle', fill: T.muted })
  const ej = [['Tope: 25 UMA', '$2,932.75 diarios', '$12,872'], ['Salario de $1,000', '$1,000 diarios', '$4,389']]
  const cw = (W - 2 * M - 16) / 2
  ej.forEach(([a, b, c], i) => {
    const x = M + i * (cw + 16)
    s += rect(x, 300, cw, 130, { rx: 16, fill: T.soft, stroke: T.line, sw: 2 })
    s += T.tx(x + 20, 336, a, { size: 18, weight: 700 })
    s += T.tx(x + 20, 362, b, { size: 15, fill: T.muted })
    s += T.tx(x + 20, 408, `${c}/mes`, { size: 30, weight: 700, fill: T.accent })
  })
  const py = 470
  s += T.tx(M, py, 'Por qué sube la pensión de la Ley 73', { size: 19, weight: 700 })
  const pasos = ['La pensión se calcula con el promedio de las últimas 250 semanas.', 'Cotizar 5 años (260 semanas) con un salario alto reemplaza ese promedio.', 'Un promedio más alto aumenta la cuantía básica y los incrementos por semanas.']
  pasos.forEach((p, i) => { s += circle(M + 12, py + 30 + i * 40, 10, { fill: T.accent }) + T.tx(M + 34, py + 36 + i * 40, p, { size: 17 }) })
  const n = T.nota(py + 30 + 3 * 40 + 20, 'Solo para quienes empezaron a cotizar antes del 1 de julio de 1997 y tienen al menos 52 semanas en los últimos 5 años. Pide una asesoría al IMSS antes de invertir.')
  return T.lienzo({ alto: Math.round(py + 30 + 3 * 40 + 20 + n.h + 60), slug: 'pension-imss-modalidad-40', titulo: 'Cuánto cuesta la Modalidad 40 en 2026', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 134 Semanas cotizadas (banda azul, escalera)
function semanas() {
  const T = tema('banda', { accent: '#1D4ED8', soft: '#EFF6FF' })
  const anios = [[2026, 875], [2027, 900], [2028, 925], [2029, 950], [2030, 975], [2031, 1000]]
  const base = 470
  const cw = (W - 2 * M - 50) / 6
  let s = T.tx(M, 184, 'Semanas para pensionarte por la Ley 97', { size: 20, weight: 700 })
  anios.forEach(([a, sm], i) => {
    const x = M + i * (cw + 10)
    const h = 80 + (sm - 875) * 1.4
    s += rect(x, base - h, cw, h, { rx: 10, fill: i === 0 ? T.accent : '#93C5FD' })
    s += T.tx(x + cw / 2, base - h - 12, String(sm), { size: 22, weight: 700, anchor: 'middle', fill: i === 0 ? T.accent : T.ink })
    s += T.tx(x + cw / 2, base + 28, String(a), { size: 17, anchor: 'middle', fill: T.muted })
  })
  s += T.tx(M, base + 64, 'Sube 25 semanas cada año hasta llegar a 1,000 en 2031.', { size: 17 })
  const cy = base + 100
  const cw2 = (W - 2 * M - 24) / 3
  const datos = [['52', 'semanas = 1 año'], ['875', 'semanas ≈ 16,8 años'], ['500', 'semanas mínimas Ley 73']]
  datos.forEach(([a, b], i) => {
    const x = M + i * (cw2 + 12)
    s += rect(x, cy, cw2, 86, { rx: 14, fill: T.soft })
    s += T.tx(x + cw2 / 2, cy + 40, a, { size: 30, weight: 700, anchor: 'middle', fill: T.accent })
    s += T.tx(x + cw2 / 2, cy + 68, b, { size: 15, anchor: 'middle', fill: T.muted })
  })
  return T.lienzo({ alto: cy + 86 + 84, slug: 'semanas-cotizadas-imss', titulo: 'Cuántas semanas cotizadas necesitas para pensionarte', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 135 Horas extra (cuaderno)
function horasExtra() {
  const T = tema('cuaderno', { accent: '#C2410C' })
  let s = T.tx(M, 188, 'Salario diario $400 · jornada de 8 h · hora = $50', { size: 22, family: T.titulo })
  const ancho = W - 2 * M
  const hw = ancho / 12
  for (let h = 0; h < 12; h++) {
    const doble = h < 9
    s += rect(M + h * hw + 2, 214, hw - 4, 64, { rx: 8, fill: doble ? '#FED7AA' : T.accent })
    s += T.tx(M + h * hw + hw / 2, 254, String(h + 1), { size: 18, weight: 700, anchor: 'middle', fill: doble ? T.ink : '#FFF' })
  }
  s += T.tx(M, 304, '9 primeras horas extra de la semana: dobles', { size: 17, fill: '#C2410C' })
  s += T.tx(W - M, 304, 'a partir de la 10.ª: triples', { size: 17, anchor: 'end', weight: 700, fill: T.accent })
  const pasos = [['9 horas dobles', '9 × $50 × 2', '$900'], ['3 horas triples', '3 × $50 × 3', '$450'], ['Total horas extra', '', '$1,350']]
  pasos.forEach(([a, op, r], i) => {
    const y = 336 + i * 60
    s += rect(M, y, W - 2 * M, 50, { rx: 10, fill: i === 2 ? '#FFEDD5' : '#FFFFFF', stroke: '#93C5FD', sw: 2 })
    s += T.tx(M + 16, y + 33, a, { size: 18, weight: 700 })
    s += T.tx(M + 300, y + 33, op, { size: 18, family: T.titulo })
    s += T.tx(W - M - 16, y + 34, r, { size: 24, weight: 700, anchor: 'end', family: T.titulo, fill: i === 2 ? T.accent : T.ink })
  })
  const ey = 336 + 3 * 60 + 20
  s += rect(M, ey, W - 2 * M, 80, { rx: 14, fill: '#FFFFFF', stroke: '#93C5FD', sw: 2 })
  s += T.tx(M + 18, ey + 34, 'Exento de ISR: $450', { size: 19, weight: 700, fill: '#15803D' })
  s += T.tx(M + 18, ey + 62, 'La mitad de las horas dobles, con un tope de 5 UMA por semana ($586.55).', { size: 16 })
  const n = T.nota(ey + 120, 'Art. 66 a 68 de la LFT: máximo 3 horas al día y 3 veces por semana. Quien gana el salario mínimo tiene exentas todas sus horas dobles.')
  return T.lienzo({ alto: Math.round(ey + 120 + n.h + 56), slug: 'calcular-horas-extras', titulo: 'Cómo se pagan las horas extra en México', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 136 Comparador de AFORE (pastel verde)
function afore() {
  const T = tema('pastel', { accent: '#15803D', soft: '#DCFCE7', bg: '#F7FEF9', ink: '#14532D', line: '#BBF7D0' })
  let s = T.tx(M, 184, '$1,500 al mes durante 30 años, en pesos de hoy', { size: 20, weight: 700 })
  const afores = [['Rendimiento neto 6.5 %', 1600539, '#15803D'], ['Rendimiento neto 5.5 %', 1336388, '#22C55E'], ['Rendimiento neto 4.5 %', 1120596, '#86EFAC']]
  const ancho = W - 2 * M - 180
  afores.forEach(([n, v, c], i) => {
    const y = 214 + i * 90
    s += T.tx(M, y + 20, n, { size: 18 })
    s += rect(M, y + 32, (v / 1600539) * ancho, 38, { rx: 10, fill: c })
    s += T.tx(M + (v / 1600539) * ancho + 14, y + 59, `$${mx(v, 0)}`, { size: 22, weight: 700, fill: T.ink })
  })
  const dy = 214 + 3 * 90 + 10
  s += rect(M, dy, W - 2 * M, 96, { rx: 16, fill: T.accent })
  s += T.tx(M + 20, dy + 40, '2 puntos de rendimiento = $479,943 más', { size: 24, weight: 700, fill: '#FFFFFF' })
  s += T.tx(M + 20, dy + 72, 'con las mismas aportaciones', { size: 17, fill: '#DCFCE7' })
  const n = T.nota(dy + 136, 'Simulación con rendimientos reales constantes. Consulta el indicador de rendimiento neto (IRN) de la CONSAR para tu SIEFORE generacional antes de cambiarte.')
  return T.lienzo({ alto: Math.round(dy + 136 + n.h + 64), slug: 'comparador-afore', titulo: 'Cuánto cambia tu retiro según el rendimiento de tu AFORE', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 137 ISR del aguinaldo (papel)
function isrAguinaldo() {
  const T = tema('papel', { accent: '#7C2D12', soft: '#FFEDD5' })
  let s = T.tx(M, 188, 'Sueldo de $20,000 al mes · aguinaldo de 15 días: $9,868.42', { size: 20, weight: 700, family: T.titulo })
  const ancho = W - 2 * M
  s += rect(M, 210, ancho * (3519.3 / 9868.42), 60, { rx: 10, fill: '#16A34A' })
  s += rect(M + ancho * (3519.3 / 9868.42), 210, ancho * (6349.12 / 9868.42), 60, { rx: 0, fill: '#DC2626' })
  s += T.tx(M + 14, 248, 'Exento $3,519.30', { size: 18, weight: 700, fill: '#FFF' })
  s += T.tx(M + ancho * (3519.3 / 9868.42) + 14, 248, 'Gravado $6,349.12', { size: 18, weight: 700, fill: '#FFF' })
  s += T.tx(M, 296, 'Exento: 30 UMA ($117.31 × 30)', { size: 15, fill: T.muted })
  const cw = (W - 2 * M - 16) / 2
  const met = [['Artículo 96 LISR', 'Suma el aguinaldo gravado al sueldo del mes y calcula la diferencia de ISR.'], ['Artículo 174 RLISR', 'Aplica una tasa efectiva calculada con la parte mensual del aguinaldo.']]
  met.forEach(([a, b], i) => {
    const x = M + i * (cw + 16)
    s += rect(x, 324, cw, 160, { rx: 16, fill: '#FFFDF8', stroke: T.line, sw: 2 })
    s += T.tx(x + 20, 360, a, { size: 19, weight: 700, family: T.titulo, fill: T.accent })
    s += T.parrafo(x + 20, 390, b, { size: 15, max: 38 }).svg
    s += T.tx(x + 20, 468, 'ISR: $1,356.17', { size: 22, weight: 700, family: T.titulo })
  })
  const ry = 510
  s += rect(M, ry, W - 2 * M, 80, { rx: 14, fill: T.soft })
  s += T.tx(M + 20, ry + 34, 'Aquí los dos métodos dan lo mismo', { size: 19, weight: 700, family: T.titulo })
  s += T.tx(M + 20, ry + 62, 'porque el aguinaldo no te cambia de renglón en la tarifa (21.36 %).', { size: 16 })
  const n = T.nota(ry + 120, 'Cuando el aguinaldo sí te sube de renglón, el método del reglamento suele retener menos. Tu patrón elige cuál aplicar.')
  return T.lienzo({ alto: Math.round(ry + 120 + n.h + 64), slug: 'calcular-isr-aguinaldo', titulo: 'Cuánto ISR paga tu aguinaldo en 2026', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 138 Dólar a peso (plano)
function dolar() {
  const T = tema('plano', { accent: '#4ADE80', font: 'Segoe UI, Arial, sans-serif' })
  const tipos = [['Tipo de cambio FIX', 'Lo publica el Banco de México cada día hábil. Sirve para pagar deudas en dólares dentro de México.', '#4ADE80'], ['Tipo de cambio de referencia', 'El del mercado interbancario, el que muestra esta calculadora.', '#93C5FD'], ['Ventanilla: compra', 'Lo que te da el banco o la casa de cambio por tus dólares. Siempre menor.', '#FCD34D'], ['Ventanilla: venta', 'Lo que pagas por comprar dólares. Siempre mayor.', '#F472B6']]
  let s = ''
  tipos.forEach(([a, b, c], i) => {
    const y = 180 + i * 110
    s += rect(M, y, W - 2 * M, 98, { rx: 12, fill: T.soft, stroke: c, sw: 2 })
    s += T.tx(M + 20, y + 32, a, { size: 20, weight: 700, fill: c })
    s += T.parrafo(M + 20, y + 60, b, { size: 16, max: 70 }).svg
  })
  const ey = 180 + 4 * 110 + 20
  s += rect(M, ey, W - 2 * M, 100, { rx: 14, fill: '#123A63', stroke: T.line, sw: 2 })
  s += T.tx(M + 20, ey + 40, 'Si cambias 500 dólares y el banco paga $0.60 menos', { size: 19, weight: 700, fill: '#FFFFFF' })
  s += T.tx(M + 20, ey + 74, 'que el tipo de referencia, recibes $300 pesos menos.', { size: 19, fill: '#FFFFFF' })
  const n = T.nota(ey + 140, 'Compara siempre cuánto recibes al final, no la comisión: el margen suele estar escondido en el tipo de cambio.')
  return T.lienzo({ alto: Math.round(ey + 140 + n.h + 60), slug: 'dolar-a-peso-mexicano', titulo: 'Los cuatro tipos de cambio del dólar en México', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 139 Tabla de amortización (cuaderno)
function amortizacion() {
  const T = tema('cuaderno', { accent: '#1D4ED8' })
  let s = T.tx(M, 188, '$100,000 al 18 % anual en 12 pagos mensuales', { size: 22, family: T.titulo })
  const sis = [['Francés', 'cuota fija', '$9,168.00', '$9,168.00', '$10,015.99'], ['Alemán', 'capital fijo', '$9,833.33', '$8,458.33', '$9,750.00'], ['Americano', 'capital al final', '$1,500.00', '$101,500.00', '$18,000.00']]
  const xs = [M + 10, M + 250, M + 420, W - M - 10]
  ;['Sistema', 'Primer pago', 'Último pago', 'Intereses totales'].forEach((h, i) => { s += T.tx(xs[i], 228, h, { size: 15, fill: T.muted, anchor: i === 0 ? 'start' : i === 3 ? 'end' : 'middle' }) })
  sis.forEach(([n, d, p1, p2, it], j) => {
    const y = 244 + j * 70
    s += rect(M, y, W - 2 * M, 60, { rx: 12, fill: j === 1 ? '#DBEAFE' : '#FFFFFF', stroke: '#93C5FD', sw: 2 })
    s += T.tx(xs[0], y + 28, n, { size: 20, weight: 700, family: T.titulo })
    s += T.tx(xs[0], y + 50, d, { size: 14, fill: T.muted })
    s += T.tx(xs[1], y + 38, p1, { size: 18, anchor: 'middle' })
    s += T.tx(xs[2], y + 38, p2, { size: 18, anchor: 'middle' })
    s += T.tx(xs[3], y + 38, it, { size: 20, weight: 700, anchor: 'end', fill: j === 1 ? T.accent : T.ink, family: T.titulo })
  })
  const ay = 244 + 3 * 70 + 24
  s += rect(M, ay, W - 2 * M, 96, { rx: 14, fill: '#ECFDF5', stroke: '#6EE7B7', sw: 2 })
  s += T.tx(M + 18, ay + 36, 'Abono extra de $2,000 al mes (sistema francés)', { size: 19, weight: 700, fill: '#047857' })
  s += T.tx(M + 18, ay + 68, 'Terminas en 10 meses y pagas $8,206.09 de intereses: $1,809.90 menos.', { size: 17 })
  const n = T.nota(ay + 136, 'En México, los créditos personales y de auto cobran además IVA sobre los intereses; la herramienta lo puede incluir.')
  return T.lienzo({ alto: Math.round(ay + 136 + n.h + 56), slug: 'tabla-de-amortizacion', titulo: 'Sistema francés, alemán y americano: cuál cobra menos intereses', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 140 CETES (banda verde)
function cetes() {
  const T = tema('banda', { accent: '#166534', soft: '#F0FDF4' })
  let s = T.tx(M, 182, '$10,000 en CETES a 28 días con una tasa del 7 % anual', { size: 19, weight: 700 })
  const pasos = [['Precio de cada CETE', 'valor nominal de $10 con descuento', '$9.9459'], ['Títulos que compras', '$10,000 ÷ $9.9459, sin decimales', '1,005'], ['Ganancia bruta', '1,005 × ($10 − $9.9459)', '$54.42'], ['Retención de ISR', '0.50 % anual sobre lo invertido', '− $3.83'], ['Ganancia neta', 'el remanente se queda en tu cuenta', '$50.59']]
  pasos.forEach(([a, b, c], i) => {
    const y = 204 + i * 66
    s += rect(M, y, W - 2 * M, 58, { rx: 10, fill: i === 4 ? '#DCFCE7' : i % 2 ? '#FFFFFF' : T.soft })
    s += T.tx(M + 16, y + 26, a, { size: 18, weight: 700 })
    s += T.tx(M + 16, y + 48, b, { size: 14, fill: T.muted })
    s += T.tx(W - M - 16, y + 38, c, { size: 22, weight: 700, anchor: 'end', fill: i === 4 ? T.accent : T.ink })
  })
  const ry = 204 + 5 * 66 + 20
  s += rect(M, ry, W - 2 * M, 80, { rx: 14, fill: T.accent })
  s += T.tx(M + 20, ry + 34, 'Reinvirtiendo 13 veces (un año)', { size: 17, fill: '#DCFCE7' })
  s += T.tx(M + 20, ry + 64, '$677.91 de ganancia neta · 6.70 % anual neto', { size: 22, weight: 700, fill: '#FFFFFF' })
  const n = T.nota(ry + 120, 'Tasa y retención de ejemplo: escribe las de la subasta y la Ley de Ingresos vigentes. Mínimo $100 en Cetesdirecto, sin comisiones.')
  return T.lienzo({ alto: Math.round(ry + 120 + n.h + 64), slug: 'calculadora-cetes', titulo: 'Cuánto ganas con CETES a 28 días, paso a paso', cuerpo: s + n.svg })
}

const pieza = (archivo, alt, fn) => ({ archivo, alt, dibujar: fn })

module.exports = [
  pieza('cuotas-imss-patron-trabajador', 'Reparto de las cuotas del IMSS entre patrón y trabajador para un salario de 500 pesos diarios', cuotasImss),
  pieza('salario-minimo-2026-mexico', 'Salario mínimo 2026 en México por día, semana y mes en la zona general y la frontera norte', salariosMinimos),
  pieza('costo-modalidad-40-2026', 'Costo mensual de la Modalidad 40 del IMSS en 2026 y por qué aumenta la pensión de la Ley 73', modalidad40),
  pieza('semanas-cotizadas-ley-97', 'Semanas cotizadas necesarias para pensionarse por la Ley 97 de 2026 a 2031', semanas),
  pieza('pago-horas-extra-lft', 'Cómo se pagan las horas extra dobles y triples según la Ley Federal del Trabajo con un ejemplo', horasExtra),
  pieza('rendimiento-afore-retiro', 'Saldo para el retiro con aportaciones de 1,500 pesos al mes según el rendimiento de la AFORE', afore),
  pieza('isr-aguinaldo-exento-gravado', 'Parte exenta y gravada del aguinaldo y cálculo del ISR con los artículos 96 y 174', isrAguinaldo),
  pieza('tipos-de-cambio-dolar-mexico', 'Diferencia entre tipo de cambio FIX, de referencia y de compra y venta en ventanilla', dolar),
  pieza('sistemas-amortizacion-comparados', 'Comparación de los sistemas de amortización francés, alemán y americano para un préstamo de 100 mil pesos', amortizacion),
  pieza('ganancia-cetes-28-dias', 'Cálculo de la ganancia de 10 mil pesos en CETES a 28 días paso a paso', cetes),
]
