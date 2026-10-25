// Infografías del lote 21 (herramientas 201 a 210).
const { rect, circle } = require('../illustrations/kit')
const { tema, W, M } = require('./piezas-4').temas

const mono = 'Consolas, monospace'
const clp = (n) => '$' + Math.round(n).toLocaleString('es-CL', { useGrouping: 'always' })

// ─────────────────────────────────────────────────────────── 201 Sueldo líquido Chile (banda roja, cascada)
function sueldoLiquido() {
  const T = tema('banda', { accent: '#B91C1C', soft: '#FEF2F2' })
  const partes = [['Sueldo líquido', 811300, '#16A34A'], ['AFP Habitat (10 % + 1,27 %)', 112700, '#DC2626'], ['Salud Fonasa (7 %)', 70000, '#EA580C'], ['Seguro de cesantía (0,6 %)', 6000, '#D97706'], ['Impuesto único', 0, '#9CA3AF']]
  const ww = W - 2 * M
  let s = T.tx(M, 188, 'Contrato indefinido, $1.000.000 brutos al mes', { size: 18, weight: 700 })
  let x = M
  partes.forEach(([, v, c]) => { if (!v) return; const w = (v / 1000000) * ww; s += rect(x, 208, Math.max(w - 3, 4), 60, { rx: 6, fill: c }); x += w })
  s += T.tx(M + 14, 246, '81 %', { size: 22, weight: 700, fill: '#FFFFFF' })
  partes.forEach(([a, v, c], i) => {
    const y = 290 + i * 46
    s += rect(M, y, ww, 38, { rx: 8, fill: i === 0 ? T.soft : '#FFFFFF', stroke: '#E5E7EB', sw: 1.5 })
    s += rect(M + 12, y + 12, 14, 14, { rx: 3, fill: c })
    s += T.tx(M + 36, y + 25, a, { size: 15, weight: i === 0 ? 700 : 400 })
    s += T.tx(W - M - 14, y + 25, i === 0 ? clp(v) : v ? `− ${clp(v)}` : '$0 (exento)', { size: 16, weight: 700, anchor: 'end', fill: c === '#9CA3AF' ? '#6B7280' : c })
  })
  const ly = 290 + 5 * 46 - 20
  const n = T.nota(ly + 46, 'La base tributable (811.300) queda bajo 13,5 UTM, así que no paga impuesto único. Con más sueldo, el impuesto empieza a contar.')
  return T.lienzo({ alto: Math.round(ly + 46 + n.h + 64), slug: 'sueldo-liquido-chile', titulo: 'Del sueldo bruto al líquido en Chile', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 202 Finiquito Chile (cuaderno, liquidación)
function finiquito() {
  const T = tema('cuaderno', { accent: '#B91C1C' })
  let s = T.tx(M, 190, 'Despido por necesidades de la empresa, sin aviso', { size: 21, family: T.titulo })
  s += T.tx(M, 222, 'Sueldo $1.000.000 · 5 años y 3 meses de antigüedad', { size: 17, fill: T.muted })
  const filas = [['Indemnización por años de servicio', '1 sueldo por año: 5 × $1.000.000', '$5.000.000'], ['Indemnización sustitutiva del aviso', '1 sueldo más, porque no hubo aviso de 30 días', '$1.000.000'], ['Feriado proporcional', '3 meses × 1,25 = 3,75 días hábiles ≈ 5,25 corridos', '$175.000']]
  filas.forEach(([a, b, c], i) => {
    const y = 250 + i * 86
    s += rect(M, y, W - 2 * M, 74, { rx: 12, fill: '#FFFFFF', stroke: '#93C5FD', sw: 1.5 })
    s += T.tx(M + 18, y + 30, a, { size: 18, weight: 700 })
    s += T.tx(M + 18, y + 56, b, { size: 15, family: T.titulo, fill: T.muted })
    s += T.tx(W - M - 18, y + 44, c, { size: 21, weight: 700, anchor: 'end', fill: T.accent })
  })
  const ty = 250 + 3 * 86 + 10
  s += `<line x1="${M}" y1="${ty}" x2="${W - M}" y2="${ty}" stroke="${T.ink}" stroke-width="2"/>`
  s += T.tx(M, ty + 40, 'Total del finiquito', { size: 22, weight: 700, family: T.titulo }) + T.tx(W - M - 18, ty + 40, '$6.175.000', { size: 28, weight: 700, anchor: 'end', fill: T.accent })
  const ry = ty + 80
  const reglas = ['Si los meses sobrantes pasan de 6, cuentan como un año más.', 'Máximo 11 años y tope de 90 UF por sueldo.', 'Si renuncias, solo cobras el feriado pendiente y lo adeudado.']
  reglas.forEach((r, i) => { s += T.tx(M, ry + i * 32, `• ${r}`, { size: 17, family: T.titulo }) })
  return T.lienzo({ alto: ry + 3 * 32 + 50, slug: 'finiquito-chile', titulo: 'Cómo se calcula un finiquito en Chile', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 203 UF (oscuro, reajuste diario)
function uf() {
  const T = tema('oscuro', { accent: '#34D399', bg: '#08130F', soft: '#10221B', line: '#1C3A2E' })
  let s = T.tx(M, 186, 'La UF sube (o baja) un poco cada día según el IPC', { size: 18, weight: 700 })
  const gx = M + 20
  const gy = 220
  const gw = W - 2 * M - 40
  const gh = 200
  s += `<line x1="${gx}" y1="${gy + gh}" x2="${gx + gw}" y2="${gy + gh}" stroke="${T.line}" stroke-width="2"/>`
  const tramos = [[0.0, 0.4], [0.4, 0.7], [0.7, 0.75], [0.75, 1.2]]
  let x = gx
  let y = gy + gh - 20
  const seg = gw / 4
  const meses = ['10 jul → 9 ago', '10 ago → 9 sep', '10 sep → 9 oct', '10 oct → 9 nov']
  const ipc = ['IPC de junio: 0,4 %', 'IPC de julio: 0,3 %', 'IPC de agosto: 0,05 %', 'IPC de septiembre: 0,45 %']
  tramos.forEach(([, b], i) => {
    const y2 = gy + gh - 20 - b * 130
    s += `<line x1="${x}" y1="${y}" x2="${x + seg}" y2="${y2}" stroke="${T.accent}" stroke-width="4"/>`
    s += `<line x1="${x + seg}" y1="${gy}" x2="${x + seg}" y2="${gy + gh}" stroke="${T.line}" stroke-width="1" stroke-dasharray="4 4"/>`
    s += T.tx(x + seg / 2, gy + gh + 22, meses[i], { size: 13, anchor: 'middle', fill: T.muted })
    s += T.tx(x + seg / 2, gy + gh + 42, ipc[i], { size: 12, anchor: 'middle', fill: T.accent })
    x += seg
    y = y2
  })
  const cy = gy + gh + 80
  const usos = [['Dividendos hipotecarios', 'el crédito se pacta en UF'], ['Arriendos', 'muchos contratos se reajustan en UF'], ['Isapres y seguros', 'los planes se cobran en UF'], ['Topes legales', 'imponible AFP: 90 UF']]
  const cw = (W - 2 * M - 16) / 2
  usos.forEach(([a, b], i) => {
    const xx = M + (i % 2) * (cw + 16)
    const yy = cy + Math.floor(i / 2) * 76
    s += rect(xx, yy, cw, 64, { rx: 12, fill: T.soft })
    s += T.tx(xx + 16, yy + 28, a, { size: 17, weight: 700 })
    s += T.tx(xx + 16, yy + 50, b, { size: 14, fill: T.muted })
  })
  const n = T.nota(cy + 2 * 76 + 10, 'Valores de IPC ilustrativos. El Banco Central publica el valor diario de la UF; la calculadora lo consulta al abrirla.')
  return T.lienzo({ alto: Math.round(cy + 2 * 76 + 10 + n.h + 60), slug: 'uf-a-pesos', titulo: 'Cómo se reajusta la UF', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 204 UTM (pastel morado, tramos del impuesto)
function utm() {
  const T = tema('pastel', { accent: '#6D28D9', soft: '#EDE9FE', bg: '#FAF7FF', ink: '#2E1065', line: '#DDD6FE' })
  const tramos = [['0 – 13,5', 'Exento'], ['13,5 – 30', '4 %'], ['30 – 50', '8 %'], ['50 – 70', '13,5 %'], ['70 – 90', '23 %'], ['90 – 120', '30,4 %'], ['120 – 310', '35 %'], ['más de 310', '40 %']]
  let s = T.tx(M, 186, 'Impuesto único de segunda categoría, en UTM mensuales', { size: 18, weight: 700 })
  const cw = (W - 2 * M - 36) / 4
  tramos.forEach(([a, b], i) => {
    const x = M + (i % 4) * (cw + 12)
    const y = 206 + Math.floor(i / 4) * 102
    s += rect(x, y, cw, 90, { rx: 14, fill: i === 0 ? '#C4B5FD' : T.soft })
    s += T.tx(x + cw / 2, y + 36, a, { size: 16, anchor: 'middle', fill: T.muted })
    s += T.tx(x + cw / 2, y + 70, b, { size: 24, weight: 700, anchor: 'middle', fill: T.accent })
  })
  const ty = 206 + 2 * 102 + 30
  s += T.tx(M, ty, 'UTM y UTA', { size: 19, weight: 700 })
  const filas = [['UTM', 'unidad mensual que fija el SII y se reajusta con el IPC'], ['UTA', 'unidad tributaria anual = 12 UTM de diciembre'], ['Multas', 'muchas infracciones de tránsito se fijan entre 0,2 y 3 UTM'], ['Patentes y derechos', 'municipales y de aduanas']]
  filas.forEach(([a, b], i) => {
    const y = ty + 18 + i * 48
    s += rect(M, y, W - 2 * M, 40, { rx: 8, fill: '#FFFFFF', stroke: T.line, sw: 1.5 })
    s += T.tx(M + 14, y + 26, a, { size: 16, weight: 700, fill: T.accent })
    s += T.tx(M + 200, y + 26, b, { size: 15 })
  })
  return T.lienzo({ alto: ty + 18 + 4 * 48 + 60, slug: 'utm-a-pesos', titulo: 'Para qué se usa la UTM en Chile', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 205 Dividendo hipotecario (papel, plazos)
function dividendo() {
  const T = tema('papel', { accent: '#1E40AF', soft: '#DBEAFE' })
  const filas = [[15, 24.48, 1206], [20, 20.24, 1659], [25, 17.79, 2136], [30, 16.21, 2637]]
  let s = T.tx(M, 188, 'Casa de 4.000 UF con 20 % de pie: crédito de 3.200 UF al 4,5 %', { size: 18, weight: 700, family: T.titulo })
  const cw = (W - 2 * M - 36) / 4
  const base = 470
  filas.forEach(([a, d, int], i) => {
    const x = M + i * (cw + 12)
    const h1 = (d / 24.48) * 150
    const h2 = (int / 2637) * 150
    s += rect(x + 10, base - h1, cw / 2 - 16, h1, { rx: 6, fill: T.accent })
    s += rect(x + cw / 2 + 6, base - h2, cw / 2 - 16, h2, { rx: 6, fill: '#FCA5A5' })
    s += T.tx(x + 10 + (cw / 2 - 16) / 2, base - h1 - 8, `${String(d).replace('.', ',')}`, { size: 14, weight: 700, anchor: 'middle', fill: T.accent })
    s += T.tx(x + cw / 2 + 6 + (cw / 2 - 16) / 2, base - h2 - 8, int.toLocaleString('es-CL'), { size: 14, weight: 700, anchor: 'middle', fill: '#B91C1C' })
    s += T.tx(x + cw / 2, base + 26, `${a} años`, { size: 17, weight: 700, anchor: 'middle', family: T.titulo })
  })
  s += rect(M, base + 50, 16, 16, { rx: 3, fill: T.accent }) + T.tx(M + 24, base + 63, 'dividendo mensual en UF (sin seguros)', { size: 14, fill: T.muted })
  s += rect(M + 340, base + 50, 16, 16, { rx: 3, fill: '#FCA5A5' }) + T.tx(M + 364, base + 63, 'intereses totales en UF', { size: 14, fill: T.muted })
  const n = T.nota(base + 100, 'Pasar de 20 a 30 años baja el dividendo un 20 %, pero sube los intereses totales casi un 60 %. A eso se suman los seguros de desgravamen e incendio.')
  return T.lienzo({ alto: Math.round(base + 100 + n.h + 60), slug: 'dividendo-hipotecario', titulo: 'Dividendo e intereses según el plazo del crédito', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 206 Gratificación (plano, dos casos)
function gratificacion() {
  const T = tema('plano', { accent: '#FDE047', font: 'Segoe UI, Arial, sans-serif' })
  let s = T.tx(M, 186, 'Gratificación mensual (art. 50): 25 % del sueldo con tope', { size: 18, weight: 700, fill: '#FFFFFF' })
  s += T.tx(M, 212, 'Tope anual: 4,75 IMM = $2.629.377 → $219.115 al mes (IMM de $553.553)', { size: 14, fill: T.muted })
  const maxW = W - 2 * M - 290
  const caso = (y, sueldo, v25, pago, topado) => {
    let o = T.tx(M, y, `Sueldo ${clp(sueldo)}`, { size: 18, weight: 700, fill: '#FFFFFF' })
    o += T.tx(M, y + 34, '25 % del sueldo', { size: 14, fill: T.muted })
    o += rect(M + 180, y + 18, (v25 / 375000) * maxW, 26, { rx: 5, fill: '#7DD3FC' }) + T.tx(M + 190 + (v25 / 375000) * maxW, y + 37, clp(v25), { size: 14, fill: '#FFFFFF' })
    o += T.tx(M, y + 74, 'Se paga', { size: 14, fill: T.muted })
    o += rect(M + 180, y + 58, (pago / 375000) * maxW, 26, { rx: 5, fill: T.accent }) + T.tx(M + 190 + (pago / 375000) * maxW, y + 77, clp(pago) + (topado ? ' (tope)' : ''), { size: 14, weight: 700, fill: T.accent })
    return o
  }
  const xt = M + 180 + (219115 / 375000) * maxW
  s += `<line x1="${xt}" y1="236" x2="${xt}" y2="484" stroke="#F87171" stroke-width="2" stroke-dasharray="6 4"/>` + T.tx(xt, 498, 'tope mensual', { size: 13, anchor: 'middle', fill: '#F87171' })
  s += caso(258, 600000, 150000, 150000, false)
  s += caso(380, 1500000, 375000, 219115, true)
  const n = T.nota(530, 'Por eso, desde unos $876.459 de sueldo, la gratificación ya no crece aunque ganes más.')
  return T.lienzo({ alto: Math.round(530 + n.h + 56), slug: 'gratificacion-chile', titulo: 'Cuándo la gratificación llega a su tope', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 207 Cotización AFP (banda verde, comisiones)
function afp() {
  const T = tema('banda', { accent: '#047857', soft: '#ECFDF5' })
  const afps = [['Uno', 0.46], ['Modelo', 0.58], ['PlanVital', 1.16], ['Habitat', 1.27], ['Capital', 1.44], ['Cuprum', 1.44], ['Provida', 1.45]]
  let s = T.tx(M, 188, 'Comisión de cada AFP y lo que cuesta con $1.000.000 imponibles', { size: 17, weight: 700 })
  const maxW = W - 2 * M - 300
  afps.forEach(([a, c], i) => {
    const y = 208 + i * 52
    s += T.tx(M, y + 28, a, { size: 17, weight: 700 })
    s += rect(M + 120, y + 8, (c / 1.45) * maxW, 30, { rx: 6, fill: i === 0 ? T.accent : '#6EE7B7' })
    s += T.tx(M + 130 + (c / 1.45) * maxW, y + 29, `${String(c).replace('.', ',')} %`, { size: 15, weight: 700 })
    s += T.tx(W - M, y + 29, `${clp(c * 10000)} al mes`, { size: 15, anchor: 'end', fill: '#6B7280' })
  })
  const ty = 208 + 7 * 52 + 20
  s += rect(M, ty, W - 2 * M, 100, { rx: 14, fill: T.soft })
  s += T.tx(M + 18, ty + 34, 'El 10 % obligatorio va a tu cuenta; la comisión es aparte', { size: 17, weight: 700 })
  s += T.tx(M + 18, ty + 64, 'Entre la más cara y la más barata: $9.900 al mes, $118.800 al año.', { size: 16 })
  s += T.tx(M + 18, ty + 88, 'Comisiones vigentes en 2026; cambian cada cierto tiempo.', { size: 13, fill: '#6B7280' })
  return T.lienzo({ alto: ty + 100 + 70, slug: 'cotizacion-afp', titulo: 'Cuánto cobra cada AFP en 2026', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 208 PAES (pizarra, ponderado)
function paes() {
  const T = tema('pizarra')
  const f = [['NEM', 750, 20], ['Ranking', 800, 20], ['Lectora', 700, 10], ['Matemática 1', 650, 35], ['Ciencias', 600, 15]]
  let s = T.tx(M, 192, 'Ejemplo con ponderaciones de una carrera ficticia', { size: 22, family: T.titulo, fill: T.accent })
  const cw = (W - 2 * M - 48) / 5
  const base = 470
  f.forEach(([a, p, w], i) => {
    const x = M + i * (cw + 12)
    const h = (p / 1000) * 200
    const hp = ((p * w) / 100 / 1000) * 200 * 3
    s += rect(x, base - h, cw, h, { rx: 8, fill: T.soft, stroke: T.line, sw: 2 })
    s += T.tx(x + cw / 2, base - h - 10, String(p), { size: 18, weight: 700, anchor: 'middle', family: T.titulo })
    s += T.tx(x + cw / 2, base + 26, a, { size: 16, anchor: 'middle', family: T.titulo })
    s += T.tx(x + cw / 2, base + 50, `× ${w} %`, { size: 16, anchor: 'middle', fill: T.accent })
    s += T.tx(x + cw / 2, base + 76, `= ${String((p * w) / 100).replace('.', ',')}`, { size: 17, weight: 700, anchor: 'middle' })
    void hp
  })
  const ty = base + 116
  s += rect(M, ty, W - 2 * M, 80, { rx: 14, fill: T.soft, stroke: T.accent, sw: 2 })
  s += T.tx(M + 20, ty + 34, '150 + 160 + 70 + 227,5 + 90', { size: 20, family: T.titulo })
  s += T.tx(W - M - 20, ty + 52, '697,5 puntos', { size: 32, weight: 700, anchor: 'end', family: T.titulo, fill: T.accent })
  const n = T.nota(ty + 112, 'Cada carrera publica sus propias ponderaciones en DEMRE. Escala de cada prueba: 100 a 1.000 puntos.')
  return T.lienzo({ alto: Math.round(ty + 112 + n.h + 60), slug: 'puntaje-paes', titulo: 'Cómo se calcula el puntaje ponderado PAES', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 209 Prima de servicios (pastel amarillo, calendario)
function prima() {
  const T = tema('pastel', { accent: '#A16207', soft: '#FEF9C3', bg: '#FFFDF2', ink: '#422006', line: '#FDE68A' })
  const mesesN = ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
  const mw = (W - 2 * M) / 12
  let s = T.tx(M, 186, 'Dos pagos al año, cada uno por un semestre trabajado', { size: 18, weight: 700 })
  mesesN.forEach((m, i) => {
    const x = M + i * mw
    s += rect(x + 2, 206, mw - 4, 70, { rx: 8, fill: i < 6 ? '#FDE68A' : '#FCD34D' })
    s += T.tx(x + mw / 2, 248, m, { size: 18, weight: 700, anchor: 'middle' })
  })
  s += T.tx(M + 3 * mw, 304, '1.ª prima: a más tardar el 30 de junio', { size: 15, weight: 700, anchor: 'middle', fill: T.accent })
  s += T.tx(M + 9 * mw, 304, '2.ª prima: a más tardar el 20 de diciembre', { size: 15, weight: 700, anchor: 'middle', fill: T.accent })
  const fy = 346
  s += rect(M, fy, W - 2 * M, 90, { rx: 14, fill: '#FFFFFF', stroke: T.line, sw: 2 })
  s += T.tx(W / 2, fy + 40, 'Prima = salario base × días trabajados ÷ 360', { size: 22, weight: 700, anchor: 'middle', family: mono })
  s += T.tx(W / 2, fy + 70, 'el salario base incluye el auxilio de transporte si lo recibes', { size: 14, anchor: 'middle', fill: T.muted })
  const ey = fy + 120
  const ej = [['Semestre completo', '180 días', '$1.000.000'], ['Entraste el 1 de abril', '90 días', '$500.000']]
  const cw = (W - 2 * M - 16) / 2
  ej.forEach(([a, b, c], i) => {
    const x = M + i * (cw + 16)
    s += rect(x, ey, cw, 110, { rx: 14, fill: T.soft })
    s += T.tx(x + 18, ey + 32, a, { size: 17, weight: 700 })
    s += T.tx(x + 18, ey + 58, `$2.000.000 × ${b} ÷ 360`, { size: 14, fill: T.muted })
    s += T.tx(x + 18, ey + 94, c, { size: 26, weight: 700, fill: T.accent })
  })
  const n = T.nota(ey + 140, 'Con el salario mínimo de 2026 ($1.750.905) más el auxilio de transporte ($249.095), la base es de $2.000.000.')
  return T.lienzo({ alto: Math.round(ey + 140 + n.h + 60), slug: 'prima-de-servicios', titulo: 'Cuándo y cuánto se paga la prima de servicios', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 210 Cesantías (terminal, línea de tiempo)
function cesantias() {
  const T = tema('terminal', { accent: '#5EEAD4' })
  let s = T.tx(M, 184, '$ cesantias --anio 2026 --base 2000000', { size: 19, fill: '#34D399' })
  const hitos = [['31 dic 2026', 'Se liquidan las cesantías del año', '$2.000.000 × 360 ÷ 360 = $2.000.000'], ['31 ene 2027', 'Intereses del 12 % directo al trabajador', '$2.000.000 × 12 % = $240.000'], ['14 feb 2027', 'El empleador consigna al fondo', 'el dinero queda a tu nombre en el fondo de cesantías']]
  hitos.forEach(([a, b, c], i) => {
    const y = 222 + i * 112
    s += circle(M + 14, y + 20, 10, { fill: T.accent })
    if (i < 2) s += `<line x1="${M + 14}" y1="${y + 30}" x2="${M + 14}" y2="${y + 112}" stroke="${T.line}" stroke-width="3"/>`
    s += T.tx(M + 40, y + 26, a, { size: 18, weight: 700, fill: T.accent })
    s += T.tx(M + 40, y + 54, b, { size: 17 })
    s += T.tx(M + 40, y + 80, `# ${c}`, { size: 15, fill: T.muted })
  })
  const ty = 222 + 3 * 112 + 10
  s += rect(M, ty, W - 2 * M, 104, { rx: 10, fill: T.soft })
  s += T.tx(M + 16, ty + 30, 'para qué puedes retirarlas', { size: 16, fill: '#34D399' })
  ;['• comprar, construir o mejorar vivienda', '• pagar estudios propios, del cónyuge o de los hijos', '• al terminar el contrato de trabajo'].forEach((t, i) => { s += T.tx(M + 16, ty + 56 + i * 20, t, { size: 15 }) })
  const n = T.nota(ty + 136, '// si el empleador consigna tarde, debe un día de salario por cada día de retraso (art. 99, Ley 50 de 1990).')
  return T.lienzo({ alto: Math.round(ty + 136 + n.h + 60), slug: 'calcular-cesantias', titulo: 'El calendario de las cesantías en Colombia', cuerpo: s + n.svg })
}

const pieza = (archivo, alt, fn) => ({ archivo, alt, dibujar: fn })

module.exports = [
  pieza('sueldo-bruto-a-liquido-chile', 'Descuentos de AFP, salud y seguro de cesantía desde un sueldo bruto de un millón de pesos chilenos', sueldoLiquido),
  pieza('ejemplo-finiquito-chile', 'Ejemplo de finiquito en Chile por necesidades de la empresa con indemnización, aviso y feriado proporcional', finiquito),
  pieza('reajuste-diario-uf', 'Cómo se reajusta la UF día a día según el IPC del mes anterior y para qué se usa', uf),
  pieza('tramos-impuesto-utm-chile', 'Tramos del impuesto único de segunda categoría en UTM y usos de la UTM y la UTA', utm),
  pieza('dividendo-segun-plazo-uf', 'Dividendo mensual e intereses totales en UF de un crédito hipotecario a 15, 20, 25 y 30 años', dividendo),
  pieza('tope-gratificacion-chile', 'Gratificación del 25 % del sueldo y su tope mensual con dos sueldos de ejemplo', gratificacion),
  pieza('comisiones-afp-2026', 'Comisión de cada AFP en 2026 y su costo mensual sobre un millón de pesos imponibles', afp),
  pieza('puntaje-ponderado-paes-ejemplo', 'Cálculo de un puntaje ponderado PAES con NEM, ranking y pruebas', paes),
  pieza('calendario-prima-de-servicios', 'Fechas de pago de la prima de servicios en Colombia, fórmula y dos ejemplos', prima),
  pieza('calendario-cesantias-colombia', 'Fechas de liquidación, intereses y consignación de las cesantías en Colombia', cesantias),
]
