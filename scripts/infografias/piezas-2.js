// Infografías del lote 2 (herramientas 11 a 20).
const { C, text, rect, circle } = require('../illustrations/kit')
const { W, M, parrafo, lienzo, linea, flechaAbajo } = require('./piezas').util

const nota = (y, t) => parrafo(M, y, t, { size: 19, max: 70, anchor: 'start', fill: C.slateMid, weight: 400 })

// ─────────────────────────────────────────────────────────── Aguinaldo proporcional (México)
function aguinaldo() {
  let s = rect(M, 170, W - 2 * M, 64, { rx: 14, fill: C.purpleXs })
  s += text(W / 2, 211, 'salario diario × 15 × días trabajados ÷ 365', { size: 25, fill: C.purpleDark })
  // Barra del año con la parte trabajada
  const y = 300
  const x0 = M
  const ancho = W - 2 * M
  const inicio = 90 / 365 // 1 de abril
  s += text(M, y - 16, 'Año 2026', { size: 18, fill: C.slateMid, anchor: 'start', weight: 400 })
  s += rect(x0, y, ancho, 40, { rx: 20, fill: C.line })
  s += rect(x0 + ancho * inicio, y, ancho * (1 - inicio), 40, { rx: 20, fill: C.green })
  s += text(x0 + ancho * inicio + ancho * (1 - inicio) / 2, y + 27, '275 días trabajados', { size: 19, fill: C.white })
  s += text(x0 + 10, y + 27, 'ene–mar', { size: 17, fill: C.slateMid, anchor: 'start', weight: 400 })
  s += text(x0 + ancho * inicio, y + 66, 'Ingreso: 1 de abril', { size: 17, fill: C.slate })
  s += text(W - M, y + 66, '31 de dic.', { size: 17, fill: C.slate, anchor: 'end' })
  const filas = [
    ['Salario diario', '$400.00'],
    ['$400 × 15 días × 275 ÷ 365', '$4,520.55'],
    ['Exento de ISR (30 UMA × $117.31)', '− $3,519.30'],
  ]
  let fy = 420
  filas.forEach(([a, b], i) => {
    s += rect(M, fy, W - 2 * M, 50, { rx: 10, fill: i === 1 ? C.greenSoft : C.white, stroke: i === 1 ? C.green : C.line, sw: 2 })
    s += text(M + 18, fy + 33, a, { size: 20, fill: C.slate, anchor: 'start', weight: 400 })
    s += text(W - M - 18, fy + 33, b, { size: 22, fill: i === 1 ? C.green : C.slate, anchor: 'end' })
    fy += 60
  })
  s += rect(M, fy + 6, W - 2 * M, 72, { rx: 14, fill: C.slate })
  s += text(M + 22, fy + 50, 'Parte que paga ISR', { size: 20, fill: C.slateSoft, anchor: 'start', weight: 400 })
  s += text(W - M - 22, fy + 52, '$1,001.25', { size: 28, fill: C.white, anchor: 'end' })
  const n = nota(fy + 124, 'Mínimo por ley: 15 días de salario (art. 87 LFT), pagado antes del 20 de diciembre. Tu contrato puede dar más días.')
  return lienzo({ alto: Math.round(fy + 124 + n.h + 60), slug: 'calcular-aguinaldo', titulo: 'Cómo se calcula el aguinaldo proporcional en 2026', subtitulo: 'Ejemplo: ingreso el 1 de abril con un salario diario de $400', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── Días hábiles (calendario)
function dias() {
  const dias = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
  const cw = 92
  const ch = 58
  const x0 = (W - 7 * cw) / 2
  let s = ''
  dias.forEach((d, i) => { s += text(x0 + i * cw + cw / 2, 190, d, { size: 20, fill: i > 4 ? C.slateMid : C.slate }) })
  // Octubre de 2026 empieza en jueves (columna 3)
  for (let dia = 1; dia <= 31; dia++) {
    const pos = dia + 2
    const col = pos % 7
    const fila = Math.floor(pos / 7)
    const x = x0 + col * cw
    const y = 206 + fila * (ch + 8)
    const habil = col < 5
    s += rect(x + 4, y, cw - 8, ch, { rx: 10, fill: habil ? C.blueSoft : C.paper, stroke: habil ? undefined : C.line, sw: 2 })
    s += text(x + cw / 2, y + 37, String(dia), { size: 22, fill: habil ? C.blue : C.slateMid, weight: habil ? 700 : 400 })
  }
  const y = 206 + 5 * (ch + 8) + 24
  const caja = (x, w, n, t, col, suave) => rect(x, y, w, 92, { rx: 16, fill: suave }) + text(x + w / 2, y + 48, n, { size: 34, fill: col }) + text(x + w / 2, y + 78, t, { size: 18, fill: C.slate, weight: 400 })
  const bw = (W - 2 * M - 12) / 2
  s += caja(M, bw, '31', 'días naturales', C.slate, C.paper)
  s += caja(M + bw + 12, bw, '22', 'días hábiles (lunes a viernes)', C.blue, C.blueSoft)
  const n = nota(y + 140, 'Los festivos cambian según el país y la región: réstalos tú si tu plazo es de días hábiles administrativos.')
  return lienzo({ alto: Math.round(y + 140 + n.h + 60), slug: 'calculadora-dias', titulo: 'Días naturales y días hábiles: la diferencia', subtitulo: 'Octubre de 2026 en el calendario', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── Quitar el IVA
function iva() {
  const cw = (W - 2 * M - 16) / 2
  const y = 180
  const tarjeta = (x, ok, titulo, op, res, detalle) => {
    const col = ok ? C.green : C.red
    const suave = ok ? C.greenSoft : C.redSoft
    return rect(x, y, cw, 230, { rx: 18, fill: suave }) +
      circle(x + 34, y + 38, 18, { fill: col }) + text(x + 34, y + 45, ok ? '✓' : '✗', { size: 20, fill: C.white }) +
      text(x + 62, y + 45, titulo, { size: 21, fill: col, anchor: 'start' }) +
      text(x + cw / 2, y + 112, op, { size: 26, fill: C.slate }) +
      text(x + cw / 2, y + 160, res, { size: 34, fill: col }) +
      text(x + cw / 2, y + 200, detalle, { size: 17, fill: C.slate, weight: 400 })
  }
  let s = text(M, 160, 'Precio con IVA: $1,160. ¿Cuánto es sin IVA?', { size: 22, fill: C.slate, anchor: 'start' })
  s = s.replace('y="160"', 'y="158"')
  s += tarjeta(M, false, 'Restar el 16 %', '1,160 − 16 %', '$974.40', 'Le quitas IVA de más')
  s += tarjeta(M + cw + 16, true, 'Dividir entre 1.16', '1,160 ÷ 1.16', '$1,000.00', 'IVA real: $160.00')
  const ty = 460
  s += text(M, ty, 'Tasas de IVA', { size: 22, fill: C.slate, anchor: 'start' })
  const tasas = [['16 %', 'México, tasa general'], ['8 %', 'México, región fronteriza'], ['0 %', 'México, alimentos y medicinas'], ['19 %', 'Chile, tasa única']]
  const tw = (W - 2 * M - 36) / 4
  tasas.forEach(([t, d], i) => {
    const x = M + i * (tw + 12)
    s += rect(x, ty + 18, tw, 112, { rx: 14, fill: i === 3 ? C.amberSoft : C.purpleXs })
    s += text(x + tw / 2, ty + 66, t, { size: 32, fill: i === 3 ? C.amberDark : C.purpleDark })
    const p = parrafo(x + tw / 2, ty + 96, d, { size: 16, max: 18, fill: C.slate, weight: 400, alto: 1.2 })
    s += p.svg
  })
  const n = nota(ty + 176, 'Para quitar cualquier IVA divide entre (1 + tasa): 1.16, 1.08 o 1.19. Restar el porcentaje siempre da de menos.')
  return lienzo({ alto: Math.round(ty + 176 + n.h + 60), slug: 'calcular-iva', titulo: 'Cómo quitar el IVA de un precio sin equivocarte', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── Trucos de cálculo mental
function calculoMental() {
  const trucos = [
    ['× 5', 'Multiplica por 10 y divide entre 2', '48 × 5 = 480 ÷ 2 = 240'],
    ['× 9', 'Multiplica por 10 y resta el número', '37 × 9 = 370 − 37 = 333'],
    ['× 11', 'Separa las cifras y pon su suma en medio', '43 × 11 = 4 (4+3) 3 = 473'],
    ['+ 99', 'Suma 100 y quita 1', '256 + 99 = 356 − 1 = 355'],
    ['…5²', 'Cifra × la siguiente, y añade 25', '35² = 3 × 4 = 12 → 1225'],
    ['× 4', 'Duplica dos veces', '27 × 4 = 54 × 2 = 108'],
  ]
  const cw = (W - 2 * M - 16) / 2
  let s = ''
  trucos.forEach(([op, regla, ej], i) => {
    const x = M + (i % 2) * (cw + 16)
    const y = 176 + Math.floor(i / 2) * 150
    const col = [C.purple, C.blue, C.teal][Math.floor(i / 2)]
    s += rect(x, y, cw, 136, { rx: 18, fill: C.white, stroke: C.line, sw: 2 })
    s += rect(x + 18, y + 20, 74, 46, { rx: 12, fill: col }) + text(x + 55, y + 52, op, { size: 24, fill: C.white })
    const p = parrafo(x + 108, y + 38, regla, { size: 18, max: 22, anchor: 'start', fill: C.slate, alto: 1.2 })
    s += p.svg
    s += text(x + 18, y + 112, ej, { size: 20, fill: col, anchor: 'start' })
  })
  const n = nota(176 + 3 * 150 + 20, 'Practica cada truco por separado hasta que sea automático y luego mézclalos en el modo contrarreloj.')
  return lienzo({ alto: Math.round(176 + 3 * 150 + 20 + n.h + 60), slug: 'calculo-mental', titulo: '6 trucos de cálculo mental para operar más rápido', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── CURP
function curp() {
  const chars = 'GOMJ900514HJCMRN01'.split('')
  const grupo = (i) => (i < 4 ? 0 : i < 10 ? 1 : i < 11 ? 2 : i < 13 ? 3 : i < 16 ? 4 : 5)
  const cols = [[C.purple, C.purpleXs], [C.blue, C.blueSoft], [C.pink, C.pinkSoft], [C.teal, C.tealSoft], [C.amberDark, C.amberSoft], [C.slate, C.line]]
  const bw = 36
  const gap = 4
  const sep = 8
  const total = chars.length * bw + (chars.length - 1) * gap + 5 * sep
  let x = (W - total) / 2
  const y = 190
  let s = ''
  const pos = []
  chars.forEach((ch, i) => {
    if (i > 0 && grupo(i) !== grupo(i - 1)) x += sep
    const [f, sv] = cols[grupo(i)]
    s += rect(x, y, bw, 56, { rx: 8, fill: sv, stroke: f, sw: 2 })
    s += text(x + bw / 2, y + 38, ch, { size: 24, fill: f })
    pos.push(x)
    x += bw + gap
  })
  const rangos = [[0, 3], [4, 9], [10, 10], [11, 12], [13, 15], [16, 17]]
  rangos.forEach(([a, b], g) => {
    const cx = (pos[a] + pos[b] + bw) / 2
    s += circle(cx, y + 84, 14, { fill: cols[g][0] }) + text(cx, y + 91, String(g + 1), { size: 17, fill: C.white })
  })
  const notas = [
    ['GOMJ', 'Letras de apellidos y nombre, igual que en el RFC.'],
    ['900514', 'Fecha de nacimiento: año, mes y día.'],
    ['H', 'Sexo: H para hombre y M para mujer.'],
    ['JC', 'Entidad de nacimiento: JC es Jalisco; NE, nacido en el extranjero.'],
    ['MRN', 'Primeras consonantes internas de GóMez, MaRtínez y JuaN.'],
    ['01', 'Diferenciador (0 antes de 2000, letra desde 2000) y dígito verificador.'],
  ]
  let ly = 340
  notas.forEach(([k, d], g) => {
    s += circle(M + 16, ly - 7, 15, { fill: cols[g][0] }) + text(M + 16, ly, String(g + 1), { size: 17, fill: C.white })
    s += text(M + 44, ly, k, { size: 21, fill: cols[g][0], anchor: 'start' })
    const p = parrafo(M + 150, ly, d, { size: 20, max: 52, anchor: 'start', weight: 400 })
    s += p.svg
    ly += Math.max(44, p.h + 16)
  })
  const n = nota(ly + 10, 'El dígito verificador se calcula con los 17 caracteres anteriores; si uno está mal, deja de cuadrar.')
  return lienzo({ alto: Math.round(ly + 10 + n.h + 60), slug: 'calcular-curp', titulo: 'Qué significa cada carácter de la CURP', subtitulo: 'Ejemplo: Juan Gómez Martínez, hombre, nacido en Jalisco el 14/05/1990', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── Porcentajes
function porcentajes() {
  const formulas = [
    ['¿Cuánto es el 15 % de 240?', '240 × 15 ÷ 100', '36'],
    ['¿Qué % es 45 de 180?', '45 ÷ 180 × 100', '25 %'],
    ['¿Cuánto subió de 80 a 100?', '(100 − 80) ÷ 80 × 100', '+25 %'],
  ]
  let s = ''
  formulas.forEach(([p, op, r], i) => {
    const y = 176 + i * 96
    s += rect(M, y, W - 2 * M, 84, { rx: 14, fill: C.white, stroke: C.line, sw: 2 })
    s += text(M + 20, y + 34, p, { size: 20, fill: C.slateMid, anchor: 'start', weight: 400 })
    s += text(M + 20, y + 66, op, { size: 22, fill: C.slate, anchor: 'start' })
    s += text(W - M - 22, y + 56, r, { size: 32, fill: C.purple, anchor: 'end' })
  })
  const by = 176 + 3 * 96 + 40
  s += text(M, by, 'Dos descuentos del 10 % no son un 20 %', { size: 23, fill: C.slate, anchor: 'start' })
  const pasos = [['$100', C.slate], ['$90', C.blue], ['$81', C.purple]]
  const xs = [M + 60, W / 2, W - M - 60]
  pasos.forEach(([v, col], i) => {
    s += circle(xs[i], by + 86, 48, { fill: i === 0 ? C.line : i === 1 ? C.blueSoft : C.purpleXs })
    s += text(xs[i], by + 96, v, { size: 28, fill: col })
    if (i < 2) {
      s += `<path d="M${xs[i] + 58},${by + 86} H${xs[i + 1] - 62}" stroke="${C.slateSoft}" stroke-width="3"/><path d="M${xs[i + 1] - 72},${by + 78} L${xs[i + 1] - 62},${by + 86} L${xs[i + 1] - 72},${by + 94}" fill="none" stroke="${C.slateSoft}" stroke-width="3"/>`
      s += text((xs[i] + xs[i + 1]) / 2, by + 74, '− 10 %', { size: 19, fill: C.slateMid })
    }
  })
  s += rect(M, by + 156, W - 2 * M, 60, { rx: 14, fill: C.amberSoft }) + text(W / 2, by + 194, 'Descuento real: 19 %, porque el segundo se aplica sobre $90', { size: 20, fill: '#92400E' })
  return lienzo({ alto: by + 216 + 80, slug: 'calculadora-porcentaje', titulo: 'Las 3 fórmulas de porcentajes que más se usan', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── Tipo de cambio
function moneda() {
  const y0 = 200
  const escala = (v) => y0 + (19.4 - v) * 150 // 19.4 arriba, 17.6 abajo
  let s = linea(W / 2, escala(19.4), W / 2, escala(17.6), C.slateSoft, 4)
  const marcas = [
    [19.1, 'Precio de venta', 'Lo que pagas al comprar dólares', C.red, C.redSoft],
    [18.5, 'Tipo de referencia', 'El que muestra esta calculadora', C.purple, C.purpleXs],
    [17.9, 'Precio de compra', 'Lo que recibes al vender dólares', C.green, C.greenSoft],
  ]
  marcas.forEach(([v, t, d, col, suave], i) => {
    const y = escala(v)
    s += circle(W / 2, y, 12, { fill: col })
    const izquierda = i === 1
    const x = izquierda ? M : W / 2 + 34
    s += rect(x, y - 44, W / 2 - 34 - M, 88, { rx: 16, fill: suave })
    s += text(x + 18, y - 12, t, { size: 21, fill: col, anchor: 'start' })
    s += text(x + 18, y + 16, d, { size: 16, fill: C.slate, anchor: 'start', weight: 400 })
    s += text(izquierda ? W / 2 + 30 : W / 2 - 30, y + 9, `$${v.toFixed(2)}`, { size: 24, fill: col, anchor: izquierda ? 'start' : 'end' })
  })
  const by = escala(17.6) + 40
  s += rect(M, by, W - 2 * M, 72, { rx: 14, fill: C.slate })
  s += text(W / 2, by + 45, 'La diferencia (spread) es el margen de la casa de cambio', { size: 21, fill: C.white })
  const n = nota(by + 116, 'Valores de ejemplo en pesos mexicanos por dólar. Las tasas reales cambian cada día; usa la calculadora para el valor actual.')
  return lienzo({ alto: Math.round(by + 116 + n.h + 60), slug: 'convertidor-moneda', titulo: 'Por qué el banco no te da el tipo de cambio que ves en internet', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── Contraseñas
function contrasenas() {
  const filas = [
    ['8 caracteres', 'solo minúsculas', '21 segundos', 0.05],
    ['8 caracteres', 'letras, números y símbolos', '7 días', 0.22],
    ['12 caracteres', 'solo minúsculas', '110 días', 0.32],
    ['12 caracteres', 'letras y números', '10.000 años', 0.6],
    ['12 caracteres', 'letras, números y símbolos', '1,5 millones de años', 0.78],
    ['16 caracteres', 'letras, números y símbolos', '118 billones de años', 1],
  ]
  let s = ''
  const ancho = W - 2 * M
  filas.forEach(([l, tipo, t, f], i) => {
    const y = 180 + i * 84
    s += text(M, y + 18, `${l} · ${tipo}`, { size: 19, fill: C.slate, anchor: 'start', weight: 400 })
    s += rect(M, y + 30, ancho, 32, { rx: 16, fill: C.paper })
    const col = f < 0.3 ? C.red : f < 0.5 ? C.amber : C.green
    s += rect(M, y + 30, Math.max(ancho * f, 36), 32, { rx: 16, fill: col })
    const dentro = ancho * f > 330
    s += text(dentro ? M + ancho * f - 14 : M + Math.max(ancho * f, 36) + 12, y + 53, t, { size: 18, fill: dentro ? C.white : C.slate, anchor: dentro ? 'end' : 'start' })
  })
  const n = nota(180 + filas.length * 84 + 24, 'Tiempo para probar todas las combinaciones a 10.000 millones de intentos por segundo. La longitud pesa más que los símbolos.')
  return lienzo({ alto: Math.round(180 + filas.length * 84 + 24 + n.h + 60), slug: 'generador-contrasenas', titulo: 'Cuánto se tarda en adivinar una contraseña por fuerza bruta', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── Límites de caracteres
function limites() {
  const filas = [
    ['Mensaje SMS (un solo mensaje)', 160],
    ['Título SEO recomendado', 60],
    ['Meta descripción recomendada', 155],
    ['Bio de Instagram', 150],
    ['Publicación en X (Twitter)', 280],
    ['Título de un video de YouTube', 100],
    ['Pie de foto de Instagram', 2200],
    ['Publicación en LinkedIn', 3000],
  ]
  let s = ''
  const max = 3000
  const ancho = W - 2 * M - 120
  filas.forEach(([t, n], i) => {
    const y = 180 + i * 64
    s += text(M, y + 18, t, { size: 19, fill: C.slate, anchor: 'start', weight: 400 })
    const w = Math.max(10, Math.sqrt(n / max) * ancho)
    s += rect(M, y + 28, w, 20, { rx: 10, fill: i < 6 ? C.purple : C.blue })
    s += text(W - M, y + 46, n >= 1000 ? `${Math.floor(n / 1000)}.${String(n % 1000).padStart(3, '0')}` : String(n), { size: 22, fill: C.slate, anchor: 'end' })
  })
  const n = nota(180 + filas.length * 64 + 20, 'Barras en escala de raíz cuadrada para que se vean los límites cortos. Las redes cambian sus límites de vez en cuando.')
  return lienzo({ alto: Math.round(180 + filas.length * 64 + 20 + n.h + 60), slug: 'contador-palabras', titulo: 'Límites de caracteres más habituales', subtitulo: 'Caracteres con espacios incluidos', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── Propinas
function propinas() {
  const paises = [
    ['México', '10–15 %', 'En restaurantes con servicio a la mesa.'],
    ['Argentina', '10 %', 'Habitual en restaurantes y bares.'],
    ['Colombia', '10 %', 'Sugerida en la cuenta; es voluntaria.'],
    ['Chile', '10 %', 'Sugerida en la cuenta; es voluntaria.'],
    ['Perú', '10 %', 'Costumbre, a veces incluida como servicio.'],
    ['España', '5–10 %', 'Opcional; a menudo se redondea.'],
  ]
  let s = ''
  const cw = (W - 2 * M - 16) / 2
  paises.forEach(([p, pct, d], i) => {
    const x = M + (i % 2) * (cw + 16)
    const y = 176 + Math.floor(i / 2) * 104
    s += rect(x, y, cw, 92, { rx: 16, fill: C.white, stroke: C.line, sw: 2 })
    s += text(x + 18, y + 36, p, { size: 22, fill: C.slate, anchor: 'start' })
    s += text(x + cw - 18, y + 38, pct, { size: 26, fill: C.teal, anchor: 'end' })
    s += text(x + 18, y + 70, d, { size: 16, fill: C.slateMid, anchor: 'start', weight: 400 })
  })
  const ey = 176 + 3 * 104 + 30
  s += text(M, ey, 'Ejemplo: cuenta de $1,250 entre 4 personas con 15 %', { size: 21, fill: C.slate, anchor: 'start' })
  const pasos = [['Propina: 1,250 × 15 %', '$187.50'], ['Total: 1,250 + 187.50', '$1,437.50'], ['Cada persona: 1,437.50 ÷ 4', '$359.38']]
  pasos.forEach(([a, b], i) => {
    const y = ey + 20 + i * 56
    s += rect(M, y, W - 2 * M, 46, { rx: 10, fill: i === 2 ? C.tealSoft : C.paper })
    s += text(M + 18, y + 31, a, { size: 19, fill: C.slate, anchor: 'start', weight: 400 })
    s += text(W - M - 18, y + 31, b, { size: 22, fill: i === 2 ? C.teal : C.slate, anchor: 'end' })
  })
  const n = nota(ey + 20 + 3 * 56 + 30, 'Son costumbres orientativas. Revisa siempre si la cuenta ya incluye un cargo por servicio antes de añadir propina.')
  return lienzo({ alto: Math.round(ey + 20 + 3 * 56 + 30 + n.h + 60), slug: 'calculadora-propinas', titulo: 'Cuánta propina se deja en cada país', cuerpo: s + n.svg })
}

const pieza = (archivo, alt, fn) => ({ archivo, alt, dibujar: fn })

module.exports = [
  pieza('calculo-aguinaldo-proporcional-2026', 'Cálculo del aguinaldo proporcional 2026 con 275 días trabajados y la parte exenta de ISR', aguinaldo),
  pieza('dias-habiles-vs-naturales', 'Calendario de octubre de 2026 con 22 días hábiles y 31 días naturales', dias),
  pieza('como-quitar-el-iva-correctamente', 'Cómo quitar el IVA de un precio: dividir entre 1.16 en lugar de restar el 16 por ciento', iva),
  pieza('trucos-de-calculo-mental', 'Seis trucos de cálculo mental para multiplicar por 5, 9, 11 y 4 con ejemplos', calculoMental),
  pieza('significado-caracteres-curp', 'Significado de cada carácter de la CURP con un ejemplo de 18 caracteres', curp),
  pieza('formulas-de-porcentajes', 'Fórmulas de porcentajes y por qué dos descuentos del 10 por ciento suman 19', porcentajes),
  pieza('tipo-de-cambio-compra-venta', 'Diferencia entre tipo de cambio de referencia, precio de compra y de venta del dólar', moneda),
  pieza('tiempo-descifrar-contrasena', 'Tiempo para descifrar una contraseña por fuerza bruta según su longitud y caracteres', contrasenas),
  pieza('limites-de-caracteres-redes', 'Límites de caracteres de SMS, Instagram, X, YouTube, LinkedIn y títulos SEO', limites),
  pieza('propina-por-pais', 'Porcentaje de propina habitual en México, Argentina, Colombia, Chile, Perú y España', propinas),
]
