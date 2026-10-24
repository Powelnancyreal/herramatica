// Infografías del lote 11 (herramientas 101 a 110).
const { rect, circle } = require('../illustrations/kit')
const { tema, W, M, es } = require('./piezas-4').temas

// ─────────────────────────────────────────────────────────── 101 CAT (oscuro)
function cat() {
  const T = tema('oscuro', { accent: '#F59E0B', bg: '#111111', soft: '#1F1F1F', line: '#333333' })
  let s = T.tx(M, 182, 'Préstamo de $50,000 a 24 meses, tasa anual del 30 %', { size: 18, fill: T.muted })
  s += T.tx(M, 214, 'Pago mensual: $2,795.64', { size: 22, weight: 700 })
  const barras = [['Tasa de interés', 30, '#60A5FA'], ['CAT sin comisiones', 34.5, '#F59E0B'], ['CAT con comisión de apertura de $1,500', 38.9, '#EF4444']]
  const ancho = W - 2 * M - 120
  barras.forEach(([n, v, c], i) => {
    const y = 250 + i * 90
    s += T.tx(M, y + 18, n, { size: 18 })
    s += rect(M, y + 28, (v / 40) * ancho, 38, { rx: 10, fill: c })
    s += T.tx(M + (v / 40) * ancho + 14, y + 55, `${es(v, 1)} %`, { size: 26, weight: 700, fill: c })
  })
  const ty = 250 + 3 * 90 + 20
  s += T.tx(M, ty, 'Qué suma el CAT además del interés', { size: 20, weight: 700 })
  const items = ['Comisión por apertura', 'Seguros obligatorios', 'Capitalización mensual de los intereses', 'Otras comisiones fijas del crédito']
  items.forEach((it, i) => {
    const x = M + (i % 2) * ((W - 2 * M) / 2)
    const y = ty + 36 + Math.floor(i / 2) * 36
    s += circle(x + 8, y - 6, 6, { fill: T.accent }) + T.tx(x + 24, y, it, { size: 17 })
  })
  const n = T.nota(ty + 36 + 2 * 36 + 20, 'El CAT se expresa sin IVA. Sirve para comparar créditos del mismo plazo y monto: a menor CAT, más barato el crédito.')
  return T.lienzo({ alto: Math.round(ty + 36 + 2 * 36 + 20 + n.h + 60), slug: 'calculadora-cat', titulo: 'Por qué el CAT es más alto que la tasa de interés', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 102 Nómina México (banda pizarra)
function nomina() {
  const T = tema('banda', { accent: '#334155', soft: '#F1F5F9' })
  const total = 20000
  const partes = [['Neto', 17076.78, '#16A34A'], ['ISR', 2383.65, '#DC2626'], ['IMSS', 539.57, '#F59E0B']]
  let s = T.tx(M, 184, 'Sueldo mensual bruto de $20,000', { size: 24, weight: 700 })
  let x = M
  const ancho = W - 2 * M
  partes.forEach(([, v, c], i) => { const w = (v / total) * ancho; s += rect(x, 206, w, 60, { rx: i === 0 ? 10 : 0, fill: c }); x += w })
  s += T.tx(M + 18, 245, '85,4 %', { size: 24, weight: 700, fill: '#FFF' })
  const filas = [['Sueldo neto', '$17,076.78', '#16A34A', 'lo que llega a tu cuenta'], ['ISR', '− $2,383.65', '#DC2626', 'tarifa mensual del art. 96 LISR, sin subsidio'], ['Cuotas obreras del IMSS', '− $539.57', '#F59E0B', 'enfermedad, invalidez, cesantía y vejez']]
  filas.forEach(([a, b, c, d], i) => {
    const y = 304 + i * 72
    s += rect(M, y, 12, 54, { rx: 4, fill: c })
    s += T.tx(M + 28, y + 24, a, { size: 20, weight: 700 })
    s += T.tx(M + 28, y + 48, d, { size: 15, fill: T.muted })
    s += T.tx(W - M, y + 36, b, { size: 24, weight: 700, anchor: 'end', fill: c })
  })
  const n = T.nota(304 + 3 * 72 + 16, 'Cálculo con salario base de cotización igual al salario por 1.0493. Tu recibo puede incluir Infonavit, fondo de ahorro, vales o préstamos.')
  return T.lienzo({ alto: Math.round(304 + 3 * 72 + 16 + n.h + 64), slug: 'calculadora-nomina', titulo: 'Del sueldo bruto al neto en México', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 103 Descuentos (pastel)
function descuentos() {
  const T = tema('pastel', { accent: '#E11D48', soft: '#FFE4E6', bg: '#FFF7F8', ink: '#4C0519', line: '#FECDD3' })
  const etiqueta = (x, y, precio, tachado, nota) => {
    let o = `<path d="M${x},${y} h170 l30,40 l-30,40 h-170 Z" fill="#FFFFFF" stroke="${T.accent}" stroke-width="3"/>` + circle(x + 182, y + 40, 6, { fill: T.accent })
    o += T.tx(x + 18, y + 52, precio, { size: 28, weight: 700, fill: tachado ? T.muted : T.accent })
    if (tachado) o += `<line x1="${x + 14}" y1="${y + 43}" x2="${x + 150}" y2="${y + 43}" stroke="${T.muted}" stroke-width="3"/>`
    o += T.tx(x + 100, y + 108, nota, { size: 15, anchor: 'middle', fill: T.muted })
    return o
  }
  let s = etiqueta(M, 190, '$1,299', true, 'precio original')
  s += T.tx(M + 245, 238, '− 30 %', { size: 20, weight: 700, fill: T.accent })
  s += etiqueta(M + 250, 190, '$909.30', true, 'con el 30 %')
  s += T.tx(M + 495, 238, '− 10 %', { size: 20, weight: 700, fill: T.accent })
  s += etiqueta(W - M - 210, 190, '$818.37', false, '+ 10 % extra en caja')
  const ry = 340
  s += rect(M, ry, W - 2 * M, 96, { rx: 16, fill: T.soft })
  s += T.tx(M + 22, ry + 40, 'Descuento real: 37 %, no 40 %', { size: 24, weight: 700, fill: T.accent })
  s += T.tx(M + 22, ry + 72, 'El 10 % se aplica sobre el precio ya rebajado: 1 − 0,7 × 0,9 = 0,37', { size: 17 })
  const ty = ry + 136
  s += T.tx(M, ty, '¿2×1 o 50 %?', { size: 21, weight: 700 })
  const p = T.parrafo(M, ty + 34, 'Por unidad cuestan lo mismo, pero con el 2×1 te llevas dos y pagas el doble que con el 50 % en una sola.', { size: 16, max: 80 })
  s += p.svg
  s += T.tx(M, ty + 40 + p.h, 'Si solo necesitas una, el 50 % es mejor.', { size: 16, weight: 700, fill: T.accent })
  return T.lienzo({ alto: Math.round(ty + 40 + p.h + 80), slug: 'calcular-descuento', titulo: 'Cuánto te ahorras con descuentos dobles', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 104 Ahorro (cuaderno, alcancía de barras)
function ahorro() {
  const T = tema('cuaderno', { accent: '#059669' })
  let s = T.tx(M, 190, 'Meta: $50,000 para un fondo de emergencia', { size: 24, family: T.titulo })
  const opciones = [['6 meses', 8333.33], ['12 meses', 4166.67], ['24 meses', 2083.33]]
  const base = 450
  const cw = 160
  opciones.forEach(([p, v], i) => {
    const x = M + 40 + i * (cw + 70)
    const h = (v / 8333.33) * 200
    s += rect(x, base - h, cw, h, { rx: 10, fill: ['#A7F3D0', '#6EE7B7', '#34D399'][i], stroke: T.accent, sw: 2 })
    s += T.tx(x + cw / 2, base - h - 14, `$${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, { size: 22, weight: 700, anchor: 'middle', family: T.titulo, fill: T.accent })
    s += T.tx(x + cw / 2, base + 30, p, { size: 20, anchor: 'middle', family: T.titulo })
  })
  s += T.tx(M + 40, base + 64, 'ahorro mensual necesario, sin contar rendimientos', { size: 16, fill: T.muted })
  const ry = base + 100
  s += rect(M, ry, W - 2 * M, 110, { rx: 16, fill: '#ECFDF5', stroke: '#6EE7B7', sw: 2 })
  s += T.tx(M + 20, ry + 36, '¿Cuánto debe tener un fondo de emergencia?', { size: 19, weight: 700, fill: T.accent })
  s += T.tx(M + 20, ry + 68, 'Entre 3 y 6 meses de tus gastos fijos.', { size: 18 })
  s += T.tx(M + 20, ry + 94, 'Si gastas $12,000 al mes: de $36,000 a $72,000.', { size: 17, fill: T.muted })
  return T.lienzo({ alto: ry + 110 + 80, slug: 'calculadora-ahorro', titulo: 'Cuánto ahorrar al mes para llegar a tu meta', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 105 ROI y margen (oscuro, verde)
function roi() {
  const T = tema('oscuro', { accent: '#4ADE80', bg: '#06140D', soft: '#0F2A1B', line: '#1F4D33' })
  let s = rect(M, 180, W - 2 * M, 100, { rx: 16, fill: T.soft })
  s += T.tx(M + 22, 218, 'ROI = (ganancia − inversión) ÷ inversión', { size: 22, weight: 700, fill: T.accent })
  s += T.tx(M + 22, 256, 'Inviertes $10,000 y recuperas $13,000:  3,000 ÷ 10,000 = 30 %', { size: 18 })
  s += T.tx(M, 326, 'Margen y markup: el mismo producto, dos porcentajes', { size: 20, weight: 700 })
  const y = 350
  const ancho = W - 2 * M
  s += rect(M, y, ancho * 0.6, 56, { rx: 10, fill: '#334155' }) + T.tx(M + 16, y + 36, 'Costo $60', { size: 19, weight: 700 })
  s += rect(M + ancho * 0.6, y, ancho * 0.4, 56, { rx: 10, fill: '#16A34A' }) + T.tx(M + ancho * 0.6 + 16, y + 36, 'Ganancia $40', { size: 19, weight: 700 })
  s += T.tx(W - M, y + 86, 'Precio de venta $100', { size: 17, anchor: 'end', fill: T.muted })
  const cw = (W - 2 * M - 16) / 2
  const cy = y + 116
  s += rect(M, cy, cw, 116, { rx: 16, fill: T.soft }) + T.tx(M + 20, cy + 36, 'Margen', { size: 18, fill: T.muted }) + T.tx(M + 20, cy + 76, '40 %', { size: 36, weight: 700, fill: T.accent }) + T.tx(M + 20, cy + 102, 'ganancia ÷ precio', { size: 15, fill: T.muted })
  s += rect(M + cw + 16, cy, cw, 116, { rx: 16, fill: T.soft }) + T.tx(M + cw + 36, cy + 36, 'Markup', { size: 18, fill: T.muted }) + T.tx(M + cw + 36, cy + 76, '66,7 %', { size: 36, weight: 700, fill: '#FACC15' }) + T.tx(M + cw + 36, cy + 102, 'ganancia ÷ costo', { size: 15, fill: T.muted })
  const n = T.nota(cy + 156, 'Para obtener un margen del 40 % no basta con sumar un 40 % al costo: el precio es costo ÷ (1 − 0,40) = $100.')
  return T.lienzo({ alto: Math.round(cy + 156 + n.h + 60), slug: 'calculadora-roi', titulo: 'ROI, margen y markup explicados con un ejemplo', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 106 Nota necesaria (pizarra)
function notaNecesaria() {
  const T = tema('pizarra')
  let s = T.tx(M, 190, 'nota necesaria = (meta − lo que ya tienes) ÷ peso del final', { size: 22, family: T.titulo, fill: T.accent })
  const filas = [['Prueba 1', '4,5', '30 %', '1,35'], ['Prueba 2', '5,2', '30 %', '1,56'], ['Examen final', '?', '40 %', '']]
  const xs = [M, M + 280, M + 420, W - M]
  ;['Evaluación', 'Nota', 'Peso', 'Aporta'].forEach((h, i) => { s += T.tx(xs[i], 232, h, { size: 16, fill: T.muted, anchor: i === 0 ? 'start' : i === 3 ? 'end' : 'middle' }) })
  filas.forEach((f, j) => {
    const y = 270 + j * 48
    f.forEach((v, i) => { s += T.tx(xs[i], y, v, { size: 24, family: T.titulo, anchor: i === 0 ? 'start' : i === 3 ? 'end' : 'middle', fill: v === '?' ? T.accent : T.ink }) })
  })
  s += `<line x1="${M}" y1="${270 + 2 * 48 + 20}" x2="${W - M}" y2="${270 + 2 * 48 + 20}" stroke="${T.line}" stroke-width="2"/>`
  const ry = 270 + 3 * 48 + 20
  s += T.tx(M, ry, 'Para aprobar con 4,0 (escala de 1 a 7):', { size: 20 })
  s += T.tx(M, ry + 44, '(4,0 − 2,91) ÷ 0,40 = 2,73', { size: 30, family: T.titulo, fill: T.accent })
  s += T.tx(M, ry + 82, 'Necesitas un 2,7 en el examen final.', { size: 19 })
  const ey = ry + 130
  const escalas = [['Chile', '1 a 7', 'aprueba con 4,0'], ['Perú', '0 a 20', 'aprueba con 11'], ['España', '0 a 10', 'aprueba con 5'], ['México', '0 a 10', 'aprueba con 6']]
  const cw = (W - 2 * M - 36) / 4
  escalas.forEach(([p, e, a], i) => {
    const x = M + i * (cw + 12)
    s += rect(x, ey, cw, 92, { rx: 12, fill: T.soft, stroke: T.line, sw: 2 })
    s += T.tx(x + cw / 2, ey + 30, p, { size: 17, weight: 700, anchor: 'middle', fill: T.accent })
    s += T.tx(x + cw / 2, ey + 58, e, { size: 20, anchor: 'middle', family: T.titulo })
    s += T.tx(x + cw / 2, ey + 80, a, { size: 13, anchor: 'middle', fill: T.muted })
  })
  return T.lienzo({ alto: ey + 92 + 80, slug: 'calculadora-nota-necesaria', titulo: 'Qué nota necesitas en el examen final para aprobar', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 107 Días hábiles (banda verde México)
function diasHabiles() {
  const T = tema('banda', { accent: '#166534', soft: '#F0FDF4' })
  const fest = [['1 ene', 'Año Nuevo', 'jueves'], ['2 feb', 'Día de la Constitución', 'lunes'], ['16 mar', 'Natalicio de Benito Juárez', 'lunes'], ['1 may', 'Día del Trabajo', 'viernes'], ['16 sep', 'Día de la Independencia', 'miércoles'], ['16 nov', 'Revolución Mexicana', 'lunes'], ['25 dic', 'Navidad', 'viernes']]
  let s = T.tx(M, 184, 'Días de descanso obligatorio en 2026 (art. 74 LFT)', { size: 20, weight: 700 })
  fest.forEach(([f, n, d], i) => {
    const y = 204 + i * 54
    s += rect(M, y, W - 2 * M, 46, { rx: 10, fill: i % 2 ? '#FFFFFF' : T.soft })
    s += rect(M + 8, y + 7, 92, 32, { rx: 8, fill: T.accent })
    s += T.tx(M + 54, y + 29, f, { size: 17, weight: 700, anchor: 'middle', fill: '#FFF' })
    s += T.tx(M + 118, y + 30, n, { size: 18 })
    s += T.tx(W - M - 16, y + 30, d, { size: 16, anchor: 'end', fill: T.muted })
  })
  const ny = 204 + 7 * 54 + 20
  s += rect(M, ny, W - 2 * M, 96, { rx: 14, fill: '#FEF3C7' })
  s += T.tx(M + 18, ny + 34, 'No son de descanso obligatorio por ley', { size: 18, weight: 700, fill: '#92400E' })
  s += T.tx(M + 18, ny + 64, 'Jueves y Viernes Santo, 2 de noviembre ni 12 de diciembre, aunque', { size: 16, fill: '#92400E' })
  s += T.tx(M + 18, ny + 86, 'muchas empresas y oficinas públicas no abran. Añádelos si te afectan.', { size: 16, fill: '#92400E' })
  return T.lienzo({ alto: ny + 96 + 84, slug: 'calculadora-dias-habiles', titulo: 'Qué días no cuentan como hábiles en México', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 108 Fecha futura (papel, calendario de hojas)
function fechaFutura() {
  const T = tema('papel', { accent: '#9333EA', soft: '#F3E8FF' })
  let s = T.tx(M, 186, 'Desde el sábado 24 de octubre de 2026', { size: 22, weight: 700, family: T.titulo })
  const hojas = [['+ 30 días', '23', 'nov 2026', 'lunes'], ['+ 60 días', '23', 'dic 2026', 'miércoles'], ['+ 90 días', '22', 'ene 2027', 'viernes'], ['+ 180 días', '22', 'abr 2027', 'jueves'], ['+ 6 meses', '24', 'abr 2027', 'sábado'], ['+ 1 año', '24', 'oct 2027', 'domingo']]
  const cw = (W - 2 * M - 32) / 3
  hojas.forEach(([o, d, m, ds], i) => {
    const x = M + (i % 3) * (cw + 16)
    const y = 210 + Math.floor(i / 3) * 196
    s += T.tx(x + cw / 2, y + 22, o, { size: 17, anchor: 'middle', weight: 700, fill: T.accent })
    s += rect(x, y + 34, cw, 146, { rx: 14, fill: '#FFFFFF', stroke: T.line, sw: 2 })
    s += rect(x, y + 34, cw, 36, { rx: 14, fill: T.accent }) + rect(x, y + 56, cw, 14, { rx: 0, fill: T.accent })
    s += T.tx(x + cw / 2, y + 60, m, { size: 16, anchor: 'middle', weight: 700, fill: '#FFF' })
    s += T.tx(x + cw / 2, y + 132, d, { size: 52, anchor: 'middle', weight: 700, family: T.titulo })
    s += T.tx(x + cw / 2, y + 164, ds, { size: 15, anchor: 'middle', fill: T.muted })
  })
  const n = T.nota(210 + 2 * 196 + 10, '180 días no son 6 meses: los meses tienen entre 28 y 31 días. Si un plazo legal se expresa en meses, cuéntalo por meses.')
  return T.lienzo({ alto: Math.round(210 + 2 * 196 + 10 + n.h + 64), slug: 'calcular-fecha-futura', titulo: 'Qué fecha será dentro de 30, 90 o 180 días', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 109 IBAN (terminal)
function iban() {
  const T = tema('terminal', { accent: '#60A5FA' })
  const partes = [['ES', 'país', '#F472B6'], ['91', 'control', '#FBBF24'], ['2100', 'banco', '#60A5FA'], ['0418', 'oficina', '#34D399'], ['45', 'DC', '#FBBF24'], ['0200051332', 'número de cuenta', '#E5E7EB']]
  let x = M
  let s = ''
  partes.forEach(([v, n, c]) => {
    const w = v.length * 22 + 26
    s += rect(x, 184, w, 64, { rx: 10, fill: T.soft, stroke: c, sw: 2 })
    s += T.tx(x + w / 2, 226, v, { size: 26, weight: 700, anchor: 'middle', fill: c })
    s += T.tx(x + w / 2, 272, n, { size: 13, anchor: 'middle', fill: T.muted })
    x += w + 8
  })
  const ty = 320
  s += T.tx(M, ty, '# validación mod 97 (ISO 13616)', { size: 17, fill: T.muted })
  const pasos = ['1. Mueve los 4 primeros caracteres al final', '2. Cambia cada letra por un número: A=10, E=14, S=28…', '3. Divide el número enorme entre 97', '4. Si el resto es 1, el IBAN es válido']
  pasos.forEach((p, i) => { s += T.tx(M, ty + 38 + i * 34, p, { size: 18, fill: i === 3 ? '#34D399' : T.ink }) })
  const ly = ty + 38 + 4 * 34 + 20
  s += T.tx(M, ly, '# longitudes', { size: 17, fill: T.muted })
  const lon = [['España', '24'], ['Alemania', '22'], ['Francia', '27'], ['Reino Unido', '22']]
  const cw = (W - 2 * M - 36) / 4
  lon.forEach(([p, l], i) => {
    const xx = M + i * (cw + 12)
    s += rect(xx, ly + 16, cw, 70, { rx: 10, fill: T.soft })
    s += T.tx(xx + cw / 2, ly + 48, l, { size: 24, weight: 700, anchor: 'middle', fill: T.accent })
    s += T.tx(xx + cw / 2, ly + 74, p, { size: 14, anchor: 'middle', fill: T.muted })
  })
  const n = T.nota(ly + 120, '// válido no significa que la cuenta exista: solo que los dígitos de control cuadran.')
  return T.lienzo({ alto: Math.round(ly + 120 + n.h + 60), slug: 'validador-iban', titulo: 'Las partes de un IBAN español y cómo se valida', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 110 Ovulación (banda violeta, ciclo de 28 días)
function ovulacion() {
  const T = tema('banda', { accent: '#7E22CE', soft: '#FAF5FF' })
  const c = 74
  const x0 = (W - 7 * c) / 2
  let s = ''
  for (let d = 1; d <= 28; d++) {
    const col = (d - 1) % 7
    const fila = Math.floor((d - 1) / 7)
    const x = x0 + col * c
    const y = 186 + fila * (c + 6)
    const regla = d <= 5
    const fertil = d >= 10 && d <= 16
    const ovul = d === 15
    const fill = ovul ? T.accent : fertil ? '#E9D5FF' : regla ? '#FECACA' : '#FFFFFF'
    s += rect(x + 3, y, c - 6, c - 6, { rx: 12, fill, stroke: '#E5E7EB', sw: 1.5 })
    s += T.tx(x + c / 2, y + 42, String(d), { size: 22, weight: ovul ? 700 : 400, anchor: 'middle', fill: ovul ? '#FFF' : T.ink })
  }
  const ly = 186 + 4 * (c + 6) + 20
  const ley = [['#FECACA', 'Regla (días 1 a 5, aprox.)'], ['#E9D5FF', 'Ventana fértil: 5 días antes y 1 después de ovular'], [T.accent, 'Ovulación: 14 días antes de la siguiente regla']]
  ley.forEach(([cl, t], i) => {
    const y = ly + i * 36
    s += rect(M, y, 24, 24, { rx: 6, fill: cl }) + T.tx(M + 36, y + 19, t, { size: 18 })
  })
  const n = T.nota(ly + 3 * 36 + 20, 'Ejemplo con un ciclo regular de 28 días. Es una estimación: no sirve como método anticonceptivo.')
  return T.lienzo({ alto: Math.round(ly + 3 * 36 + 20 + n.h + 64), slug: 'calculadora-ovulacion', titulo: 'Cuáles son tus días fértiles en un ciclo de 28 días', cuerpo: s + n.svg })
}

const pieza = (archivo, alt, fn) => ({ archivo, alt, dibujar: fn })

module.exports = [
  pieza('cat-vs-tasa-de-interes', 'Comparación entre tasa de interés y CAT de un préstamo con y sin comisión de apertura', cat),
  pieza('sueldo-bruto-neto-mexico', 'Descuentos de ISR e IMSS de un sueldo de 20 mil pesos y sueldo neto resultante', nomina),
  pieza('descuentos-dobles-precio-final', 'Cómo se calcula un descuento doble del 30 y 10 por ciento sobre un precio', descuentos),
  pieza('ahorro-mensual-meta-50000', 'Cuánto ahorrar al mes para reunir 50 mil pesos en 6, 12 o 24 meses', ahorro),
  pieza('roi-margen-markup-ejemplo', 'Fórmula del ROI y diferencia entre margen y markup con un ejemplo', roi),
  pieza('nota-necesaria-examen-final', 'Cálculo de la nota necesaria en el examen final para aprobar y escalas de calificación por país', notaNecesaria),
  pieza('dias-festivos-mexico-2026', 'Días de descanso obligatorio en México en 2026 según la Ley Federal del Trabajo', diasHabiles),
  pieza('fecha-dentro-de-90-dias', 'Fechas resultantes de sumar 30, 60, 90 y 180 días, 6 meses y 1 año a una fecha', fechaFutura),
  pieza('estructura-iban-validacion', 'Estructura de un IBAN español y cómo se valida con el módulo 97', iban),
  pieza('dias-fertiles-ciclo-28-dias', 'Calendario de un ciclo de 28 días con la regla, la ventana fértil y el día de ovulación', ovulacion),
]
