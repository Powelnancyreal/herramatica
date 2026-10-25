// Infografías del lote 17 (herramientas 161 a 170).
const { rect, circle } = require('../illustrations/kit')
const { tema, W, M, es } = require('./piezas-4').temas
// El SVG colapsa los espacios iniciales: la sangría se convierte en desplazamiento horizontal.
const sangria = (l) => l.match(/^ */)[0].length

// ─────────────────────────────────────────────────────────── 161 Factorial (oscuro, escalera de crecimiento)
function factorial() {
  const T = tema('oscuro', { accent: '#F472B6', bg: '#160B1A', soft: '#26142C', line: '#3E2346' })
  const filas = [['5!', '120', 3], ['10!', '3.628.800', 7], ['20!', '2,43 × 10¹⁸', 19], ['52!', '8,07 × 10⁶⁷', 68], ['100!', '9,33 × 10¹⁵⁷', 158]]
  let s = T.tx(M, 184, 'Cuántos dígitos tiene cada factorial', { size: 20, weight: 700 })
  const maxW = W - 2 * M - 250
  filas.forEach(([n, v, d], i) => {
    const y = 206 + i * 62
    const w = Math.max(24, (Math.log10(d) / Math.log10(158)) * maxW)
    s += T.tx(M, y + 34, n, { size: 24, weight: 700, fill: T.accent, family: 'Consolas, monospace' })
    s += rect(M + 90, y + 8, w, 36, { rx: 8, fill: T.soft, stroke: T.accent, sw: 1.5 })
    s += T.tx(M + 104, y + 33, v, { size: 17, family: 'Consolas, monospace' })
    s += T.tx(W - M, y + 33, `${d} dígitos`, { size: 16, anchor: 'end', fill: T.muted })
  })
  const cy = 206 + 5 * 62 + 30
  s += rect(M, cy, W - 2 * M, 150, { rx: 14, fill: T.soft })
  s += T.tx(M + 20, cy + 36, 'Ceros al final de 100!', { size: 19, weight: 700 })
  s += T.tx(M + 20, cy + 76, '⌊100 ÷ 5⌋ + ⌊100 ÷ 25⌋ = 20 + 4 = 24 ceros', { size: 21, fill: T.accent, family: 'Consolas, monospace' })
  s += T.tx(M + 20, cy + 116, 'Cada cero sale de un par 2 × 5, y siempre sobran doses: basta contar los cincos.', { size: 15, fill: T.muted })
  const n = T.nota(cy + 180, '52! son las formas de barajar una baraja inglesa: ninguna mezcla bien hecha se ha repetido en la historia.')
  return T.lienzo({ alto: Math.round(cy + 180 + n.h + 60), slug: 'calculadora-factorial', titulo: 'Lo rápido que crece un factorial', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 162 Desviación estándar (papel, tabla de desvíos)
function desviacion() {
  const T = tema('papel', { accent: '#B91C1C', soft: '#FEE2E2' })
  const datos = [4, 8, 6, 5, 3, 7]
  const media = 5.5
  let s = T.tx(M, 186, 'Datos: 4, 8, 6, 5, 3, 7 · media = 33 ÷ 6 = 5,5', { size: 20, weight: 700, family: T.titulo })
  // recta numérica con desvíos
  const x0 = M + 20
  const esc = (W - 2 * M - 40) / 6
  const px = (v) => x0 + (v - 2.5) * esc
  const ly = 270
  s += `<line x1="${x0}" y1="${ly}" x2="${W - M - 20}" y2="${ly}" stroke="${T.ink}" stroke-width="2"/>`
  for (let v = 3; v <= 8; v++) s += `<line x1="${px(v)}" y1="${ly - 6}" x2="${px(v)}" y2="${ly + 6}" stroke="${T.ink}" stroke-width="2"/>` + T.tx(px(v), ly + 28, String(v), { size: 15, anchor: 'middle', fill: T.muted })
  s += `<line x1="${px(media)}" y1="${ly - 50}" x2="${px(media)}" y2="${ly + 10}" stroke="${T.accent}" stroke-width="3" stroke-dasharray="6 4"/>` + T.tx(px(media), ly - 58, 'media 5,5', { size: 15, weight: 700, anchor: 'middle', fill: T.accent })
  datos.forEach((v) => { s += circle(px(v), ly, 9, { fill: T.accent }) })
  // tabla
  const ty = 330
  const cols = [M, M + 160, M + 360]
  ;['Dato', 'Desvío (x − 5,5)', 'Desvío²'].forEach((h, i) => { s += T.tx(cols[i], ty, h, { size: 16, weight: 700, fill: T.muted }) })
  datos.forEach((v, i) => {
    const y = ty + 14 + i * 34
    const d = v - media
    if (i % 2 === 0) s += rect(M - 10, y, 520, 34, { fill: T.soft, rx: 4 })
    s += T.tx(cols[0], y + 24, String(v), { size: 18 })
    s += T.tx(cols[1], y + 24, es(d, 1), { size: 18 })
    s += T.tx(cols[2], y + 24, es(d * d, 2), { size: 18 })
  })
  const by = ty + 14 + 6 * 34
  s += T.tx(cols[2], by + 26, 'Σ = 17,5', { size: 18, weight: 700, fill: T.accent })
  const rx = M + 560
  const caja = (y, t, f, v) => rect(rx, y, W - M - rx, 110, { rx: 12, fill: '#FFFFFF', stroke: T.line, sw: 2 }) + T.tx(rx + 16, y + 30, t, { size: 16, weight: 700 }) + T.tx(rx + 16, y + 58, f, { size: 15, fill: T.muted }) + T.tx(rx + 16, y + 94, v, { size: 26, weight: 700, fill: T.accent })
  s += caja(ty - 6, 'Poblacional σ', '√(17,5 ÷ 6)', '1,708')
  s += caja(ty + 120, 'Muestral s', '√(17,5 ÷ 5)', '1,871')
  const n = T.nota(by + 60, 'Divide entre n si tienes todos los datos del grupo; entre n − 1 si son una muestra de algo más grande.')
  return T.lienzo({ alto: Math.round(by + 60 + n.h + 60), slug: 'calculadora-desviacion-estandar', titulo: 'Desviación estándar calculada a mano', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 163 Tablas de multiplicar (pastel, mapa de dificultad)
function tablas() {
  const T = tema('pastel', { accent: '#EA580C', soft: '#FFEDD5', bg: '#FFFAF5', ink: '#431407', line: '#FED7AA' })
  const faciles = (a, b) => [1, 2, 5, 10].includes(a) || [1, 2, 5, 10].includes(b)
  const dificil = (a, b) => a >= 6 && b >= 6 && a <= 9 && b <= 9
  const c = 40
  const gx = M + 40
  const gy = 210
  let s = ''
  for (let i = 1; i <= 10; i++) {
    s += T.tx(gx + (i - 1) * c + c / 2, gy - 10, String(i), { size: 15, weight: 700, anchor: 'middle', fill: T.muted })
    s += T.tx(gx - 12, gy + (i - 1) * c + c / 2 + 5, String(i), { size: 15, weight: 700, anchor: 'end', fill: T.muted })
    for (let j = 1; j <= 10; j++) {
      const fill = faciles(i, j) ? '#FEF3C7' : dificil(i, j) ? '#FB923C' : '#FDBA74'
      s += rect(gx + (j - 1) * c, gy + (i - 1) * c, c - 3, c - 3, { rx: 6, fill })
      s += T.tx(gx + (j - 1) * c + c / 2 - 1, gy + (i - 1) * c + c / 2 + 5, String(i * j), { size: 13, anchor: 'middle', weight: dificil(i, j) ? 700 : 400 })
    }
  }
  const lx = gx + 10 * c + 30
  const ley = [['#FEF3C7', 'Se aprenden solas', '×1, ×2, ×5, ×10'], ['#FDBA74', 'Con práctica', '×3, ×4…'], ['#FB923C', 'Las que más fallan', 'del 6 al 9 entre sí']]
  ley.forEach(([f, t, d], i) => {
    const y = gy + i * 76
    s += rect(lx, y, 30, 30, { rx: 6, fill: f })
    s += T.tx(lx + 42, y + 21, t, { size: 16, weight: 700 })
    if (d) s += T.tx(lx + 42, y + 45, d, { size: 14, fill: T.muted })
  })
  s += rect(lx, gy + 236, W - M - lx, 168, { rx: 14, fill: T.soft })
  s += T.tx(lx + 16, gy + 266, 'Trucos que ayudan', { size: 17, weight: 700, fill: T.accent })
  ;['3 × 8 = 8 × 3: de los', '100 productos solo hay', '55 que memorizar.', 'En la del 9, las cifras', 'del resultado suman 9.'].forEach((t, i) => { s += T.tx(lx + 16, gy + 292 + i * 23, t, { size: 14 }) })
  return T.lienzo({ alto: gy + 10 * c + 90, slug: 'tablas-de-multiplicar', titulo: 'Las tablas de multiplicar que más cuestan', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 164 Edad de mi perro (cuaderno, curvas por tamaño)
function perro() {
  const T = tema('cuaderno', { accent: '#7C2D12' })
  const tam = [['Pequeño (≤ 9 kg)', 4, '#16A34A'], ['Mediano (10–22 kg)', 5, '#2563EB'], ['Grande (23–40 kg)', 6, '#D97706'], ['Gigante (> 40 kg)', 7, '#DC2626']]
  const humana = (a, inc) => (a <= 1 ? 15 * a : a <= 2 ? 15 + 9 * (a - 1) : 24 + inc * (a - 2))
  const gx = M + 50
  const gy = 210
  const gw = 480
  const gh = 300
  const X = (a) => gx + (a / 12) * gw
  const Y = (h) => gy + gh - (h / 90) * gh
  let s = ''
  for (let h = 0; h <= 90; h += 15) s += `<line x1="${gx}" y1="${Y(h)}" x2="${gx + gw}" y2="${Y(h)}" stroke="#BFDBFE" stroke-width="1"/>` + T.tx(gx - 8, Y(h) + 5, String(h), { size: 13, anchor: 'end', fill: T.muted })
  for (let a = 0; a <= 12; a += 2) s += T.tx(X(a), gy + gh + 22, String(a), { size: 13, anchor: 'middle', fill: T.muted })
  s += T.tx(gx + gw / 2, gy + gh + 46, 'años del perro', { size: 14, anchor: 'middle', fill: T.muted })
  s += T.tx(gx - 40, gy - 14, 'años humanos', { size: 14, fill: T.muted })
  tam.forEach(([, inc, col]) => {
    let d = ''
    for (let a = 0; a <= 12; a += 0.25) d += `${a === 0 ? 'M' : 'L'}${X(a).toFixed(1)},${Y(humana(a, inc)).toFixed(1)} `
    s += `<path d="${d}" fill="none" stroke="${col}" stroke-width="4" stroke-linecap="round"/>`
  })
  let dl = ''
  for (let a = 0.5; a <= 12; a += 0.25) dl += `${a === 0.5 ? 'M' : 'L'}${X(a).toFixed(1)},${Y(Math.max(0, 16 * Math.log(a) + 31)).toFixed(1)} `
  s += `<path d="${dl}" fill="none" stroke="${T.ink}" stroke-width="3" stroke-dasharray="7 5"/>`
  const lx = gx + gw + 30
  s += T.tx(lx, gy + 4, 'A los 10 años', { size: 18, weight: 700, family: T.titulo })
  tam.forEach(([t, inc, col], i) => {
    const y = gy + 26 + i * 54
    s += rect(lx, y, 18, 18, { rx: 4, fill: col })
    s += T.tx(lx + 28, y + 15, t, { size: 14 })
    s += T.tx(lx + 28, y + 38, `${humana(10, inc)} años humanos`, { size: 16, weight: 700, fill: col })
  })
  const yl = gy + 26 + 4 * 54
  s += `<line x1="${lx}" y1="${yl + 9}" x2="${lx + 18}" y2="${yl + 9}" stroke="${T.ink}" stroke-width="3" stroke-dasharray="5 3"/>`
  s += T.tx(lx + 28, yl + 15, '16·ln(edad) + 31', { size: 14 })
  s += T.tx(lx + 28, yl + 38, '≈ 68 años humanos', { size: 16, weight: 700 })
  const n = T.nota(gy + gh + 80, 'El primer año equivale a unos 15 humanos en todas las razas; la diferencia por tamaño se abre a partir del segundo.')
  return T.lienzo({ alto: Math.round(gy + gh + 80 + n.h + 60), slug: 'edad-de-mi-perro', titulo: 'Años de perro en años humanos', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 165 JWT (terminal, tres partes)
function jwt() {
  const T = tema('terminal', { accent: '#C084FC' })
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url')
  const head = b64({ alg: 'HS256', typ: 'JWT' })
  const pay = b64({ sub: '1024', name: 'Ana', exp: 1798761600 })
  const cols = ['#F87171', '#C084FC', '#38BDF8']
  let s = T.tx(M, 182, '$ token', { size: 20, fill: '#34D399' })
  const trozo = (t, n) => t.match(new RegExp(`.{1,${n}}`, 'g'))
  const lineas = [[head, cols[0]], [pay, cols[1]], ['SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c', cols[2]]]
  let y = 214
  lineas.forEach(([t, c], i) => {
    trozo(t, 52).forEach((p, k, arr) => { s += T.tx(M, y, p + (k === arr.length - 1 && i < 2 ? '.' : ''), { size: 19, fill: c, family: 'Consolas, monospace' }); y += 28 })
  })
  y += 20
  const partes = [['HEADER', 'algoritmo y tipo', '{ "alg": "HS256", "typ": "JWT" }'], ['PAYLOAD', 'los datos (claims)', '{ "sub": "1024", "name": "Ana", "exp": 1798761600 }'], ['FIRMA', 'HMAC de header.payload con la clave secreta', 'solo se puede comprobar con esa clave']]
  partes.forEach(([a, b, c], i) => {
    s += rect(M, y, W - 2 * M, 84, { rx: 10, fill: T.soft, stroke: cols[i], sw: 2 })
    s += T.tx(M + 16, y + 30, a, { size: 18, weight: 700, fill: cols[i] })
    s += T.tx(M + 130, y + 30, `# ${b}`, { size: 15, fill: T.muted })
    s += T.tx(M + 16, y + 64, c, { size: 16, family: 'Consolas, monospace' })
    y += 96
  })
  s += T.tx(M, y + 14, '# exp 1798761600 → 1 ene 2027, 00:00 UTC', { size: 16, fill: '#34D399' })
  const n = T.nota(y + 46, '// Base64url no es cifrado: cualquiera puede leer el payload. Nunca pongas contraseñas dentro de un JWT.')
  return T.lienzo({ alto: Math.round(y + 46 + n.h + 60), slug: 'decodificador-jwt', titulo: 'Las tres partes de un JSON Web Token', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 166 CSV a JSON (plano)
function csv() {
  const T = tema('plano', { accent: '#5EEAD4', font: 'Segoe UI, Arial, sans-serif' })
  const mono = 'Consolas, monospace'
  const cw = (W - 2 * M - 60) / 2
  let s = T.tx(M, 186, 'CSV', { size: 20, weight: 700, fill: '#FFFFFF' }) + T.tx(M + cw + 60, 186, 'JSON', { size: 20, weight: 700, fill: '#FFFFFF' })
  s += rect(M, 200, cw, 250, { rx: 10, fill: T.soft, stroke: T.line, sw: 2 })
  const lin = ['nombre,edad,ciudad', 'Ana Pérez,31,Guadalajara', '"López, Luis",27,Monterrey']
  lin.forEach((l, i) => { s += T.tx(M + 14, 236 + i * 40, l, { size: 15, family: mono, fill: i === 0 ? T.accent : i === 2 ? '#FCD34D' : T.ink }) })
  s += T.tx(M + 14, 370, '↑ fila 1 = nombres de las claves', { size: 13, fill: T.muted })
  s += T.tx(M + 14, 396, '↑ comillas: la coma es parte', { size: 13, fill: T.muted })
  s += T.tx(M + 14, 416, '   del texto, no un separador', { size: 13, fill: T.muted })
  s += T.tx(M + cw + 30, 330, '→', { size: 34, anchor: 'middle', fill: T.accent })
  const jx = M + cw + 60
  s += rect(jx, 200, cw, 250, { rx: 10, fill: T.soft, stroke: T.line, sw: 2 })
  const js = ['[', '  { "nombre": "Ana Pérez",', '    "edad": 31,', '    "ciudad": "Guadalajara" },', '  { "nombre": "López, Luis",', '    "edad": 27,', '    "ciudad": "Monterrey" }', ']']
  js.forEach((l, i) => { s += T.tx(jx + 14 + sangria(l) * 7.7, 228 + i * 28, l.trim(), { size: 14, family: mono, fill: l.includes('López') ? '#FCD34D' : T.ink }) })
  const ty = 486
  s += T.tx(M, ty, 'Problemas habituales al convertir', { size: 19, weight: 700, fill: '#FFFFFF' })
  const probs = [['Excel en español guarda con «;»', 'porque la coma ya es el separador decimal'], ['Códigos postales y teléfonos', 'un 01020 convertido a número pierde el cero inicial'], ['Acentos rotos (PÃ©rez)', 'el archivo no estaba en UTF-8']]
  probs.forEach(([a, b], i) => {
    const y = ty + 18 + i * 58
    s += rect(M, y, W - 2 * M, 50, { rx: 8, fill: T.soft, stroke: T.line, sw: 1.5 })
    s += T.tx(M + 14, y + 31, a, { size: 16, weight: 700, fill: T.accent })
    s += T.tx(W - M - 14, y + 31, b, { size: 14, anchor: 'end', fill: T.muted })
  })
  return T.lienzo({ alto: ty + 18 + 3 * 58 + 56, slug: 'conversor-csv-json', titulo: 'Así se convierte una fila de CSV en un objeto JSON', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 167 Codificar URL (banda azul, tabla de caracteres)
function url() {
  const T = tema('banda', { accent: '#1D4ED8', soft: '#EFF6FF' })
  const mono = 'Consolas, monospace'
  let s = T.tx(M, 186, 'Antes y después de codificar', { size: 19, weight: 700 })
  s += rect(M, 202, W - 2 * M, 50, { rx: 10, fill: '#F9FAFB', stroke: '#E5E7EB', sw: 1.5 }) + T.tx(M + 16, 234, '?q=café & té?', { size: 19, family: mono })
  s += rect(M, 262, W - 2 * M, 50, { rx: 10, fill: T.soft, stroke: T.accent, sw: 1.5 }) + T.tx(M + 16, 294, '?q=caf%C3%A9%20%26%20t%C3%A9%3F', { size: 19, family: mono, fill: T.accent })
  const tabla = [['espacio', '%20', 'o + en formularios'], ['&', '%26', 'separa parámetros'], ['?', '%3F', 'inicia la consulta'], ['/', '%2F', 'separa carpetas'], ['=', '%3D', 'une clave y valor'], ['#', '%23', 'marca un ancla'], ['ñ', '%C3%B1', '2 bytes en UTF-8'], ['é', '%C3%A9', '2 bytes en UTF-8']]
  const cw = (W - 2 * M - 16) / 2
  tabla.forEach(([a, b, c], i) => {
    const x = M + (i % 2) * (cw + 16)
    const y = 340 + Math.floor(i / 2) * 64
    s += rect(x, y, cw, 54, { rx: 10, fill: '#FFFFFF', stroke: '#E5E7EB', sw: 1.5 })
    s += T.tx(x + 16, y + 35, a, { size: 18, weight: 700 })
    s += T.tx(x + 110, y + 35, b, { size: 19, weight: 700, family: mono, fill: T.accent })
    s += T.tx(x + cw - 14, y + 35, c, { size: 13, anchor: 'end', fill: '#6B7280' })
  })
  const n = T.nota(340 + 4 * 64 + 30, 'Codifica solo el valor de cada parámetro, no la URL completa: si codificas https:// también, el enlace deja de funcionar.')
  return T.lienzo({ alto: Math.round(340 + 4 * 64 + 30 + n.h + 64), slug: 'codificador-url', titulo: 'Qué caracteres cambian al codificar una URL', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 168 Minificar (oscuro verde, antes/después)
function minificar() {
  const T = tema('oscuro', { accent: '#4ADE80', bg: '#0B1410', soft: '#13231B', line: '#1F3A2C' })
  const mono = 'Consolas, monospace'
  let s = T.tx(M, 184, 'Antes · 125 bytes', { size: 18, weight: 700, fill: T.muted })
  const antes = ['/* Botón principal */', '.boton {', '  color: #ffffff;', '  background-color: #2563eb;', '  padding: 12px 24px;', '  border-radius: 8px;', '}']
  s += rect(M, 198, W - 2 * M, antes.length * 28 + 24, { rx: 10, fill: T.soft, stroke: T.line, sw: 2 })
  antes.forEach((l, i) => { s += T.tx(M + 16 + sangria(l) * 9.35, 228 + i * 28, l.trim(), { size: 17, family: mono, fill: i === 0 ? '#6B7280' : T.ink }) })
  const ay = 198 + antes.length * 28 + 60
  s += T.tx(M, ay, 'Después · 82 bytes (−34 %)', { size: 18, weight: 700, fill: T.accent })
  s += rect(M, ay + 14, W - 2 * M, 56, { rx: 10, fill: T.soft, stroke: T.accent, sw: 2 })
  s += T.tx(M + 16, ay + 49, '.boton{color:#ffffff;background-color:#2563eb;padding:12px 24px;border-radius:8px}', { size: 14, family: mono, fill: T.accent })
  const ly = ay + 110
  const quita = [['Comentarios', '/* … */ y <!-- … -->'], ['Espacios y saltos de línea', 'los que no cambian el resultado'], ['Último punto y coma', 'antes de la llave de cierre'], ['Nombres largos (solo JS)', 'calcularTotal → a']]
  quita.forEach(([a, b], i) => {
    const x = M + (i % 2) * ((W - 2 * M) / 2 + 8)
    const y = ly + Math.floor(i / 2) * 70
    s += rect(x, y, (W - 2 * M) / 2 - 8, 60, { rx: 10, fill: T.soft })
    s += T.tx(x + 14, y + 26, `− ${a}`, { size: 16, weight: 700 })
    s += T.tx(x + 14, y + 48, b, { size: 14, fill: T.muted })
  })
  const n = T.nota(ly + 160, 'Guarda siempre el original: el código minificado funciona igual, pero es casi imposible de editar a mano.')
  return T.lienzo({ alto: Math.round(ly + 160 + n.h + 60), slug: 'minificador-codigo', titulo: 'Qué quita un minificador de CSS', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 169 Datos de prueba (papel crema, ficha)
function datosPrueba() {
  const T = tema('papel', { accent: '#6D28D9', soft: '#EDE9FE', bg: '#FFFCF5' })
  const mono = 'Consolas, monospace'
  let s = rect(M, 180, 380, 300, { rx: 14, fill: '#FFFFFF', stroke: T.line, sw: 2 })
  s += rect(M, 180, 380, 46, { rx: 14, fill: T.accent }) + rect(M, 210, 380, 16, { fill: T.accent })
  s += T.tx(M + 18, 211, 'Registro ficticio', { size: 18, weight: 700, fill: '#FFFFFF' })
  const ficha = [['id', '1'], ['nombre', 'Mariana'], ['apellidos', 'Ruiz Ortega'], ['email', 'mariana.ruiz42@example.com'], ['telefono', '+52 33 …'], ['ciudad', 'Guadalajara'], ['activo', 'true']]
  ficha.forEach(([k, v], i) => {
    s += T.tx(M + 18, 258 + i * 31, k, { size: 14, fill: T.muted, family: mono })
    s += T.tx(M + 128, 258 + i * 31, v, { size: 15, family: mono })
  })
  const rx = M + 410
  s += T.tx(rx, 198, 'Correos que nunca llegan a nadie', { size: 17, weight: 700, family: T.titulo })
  ;['example.com', 'example.org', 'example.net', 'correo.test', 'prueba.test'].forEach((d, i) => {
    s += rect(rx, 212 + i * 40, W - M - rx, 32, { rx: 8, fill: T.soft })
    s += T.tx(rx + 12, 234 + i * 40, `@${d}`, { size: 15, family: mono, fill: T.accent })
  })
  s += T.tx(rx, 438, 'Reservados por la IETF (RFC 2606):', { size: 13, fill: T.muted })
  s += T.tx(rx, 458, 'no tienen buzones reales.', { size: 13, fill: T.muted })
  const fy = 520
  s += T.tx(M, fy, 'El mismo registro en tres formatos', { size: 18, weight: 700, family: T.titulo })
  const formatos = [['JSON', 'APIs y JavaScript'], ['CSV', 'Excel y Google Sheets'], ['SQL', 'INSERT INTO personas …']]
  const cw = (W - 2 * M - 24) / 3
  formatos.forEach(([a, b], i) => {
    const x = M + i * (cw + 12)
    s += rect(x, fy + 16, cw, 76, { rx: 12, fill: '#FFFFFF', stroke: T.line, sw: 1.5 })
    s += T.tx(x + cw / 2, fy + 48, a, { size: 22, weight: 700, anchor: 'middle', fill: T.accent })
    s += T.tx(x + cw / 2, fy + 76, b, { size: 14, anchor: 'middle', fill: T.muted })
  })
  const n = T.nota(fy + 124, 'Hasta 1000 registros por tanda, con nombres, teléfonos y ciudades de México, España, Colombia o Argentina.')
  return T.lienzo({ alto: Math.round(fy + 124 + n.h + 60), slug: 'generador-datos-prueba', titulo: 'Cómo es un registro de datos de prueba', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 170 Paleta de colores (papel blanco, armonías)
function paleta() {
  const T = tema('papel', { accent: '#2563EB', soft: '#F3F4F6', bg: '#FFFFFF', line: '#E5E7EB' })
  const arm = [['Complementaria', '0° y 180°', ['#2563EB', '#EBAD25']], ['Análoga', 'vecinos a 30°', ['#25C6EB', '#2563EB', '#4A25EB', '#AD25EB']], ['Triádica', 'cada 120°', ['#2563EB', '#EB2563', '#63EB25']], ['Complementaria dividida', '0°, 150° y 210°', ['#2563EB', '#EB4A25', '#C6EB25']], ['Tetrádica', '0°, 60°, 180° y 240°', ['#2563EB', '#AD25EB', '#EBAD25', '#63EB25']], ['Monocromática', 'mismo tono, distinta luz', ['#09235D', '#0F3DA3', '#1558EA', '#5C8AF0', '#A2BCF6']]]
  let s = T.tx(M, 184, 'Seis armonías a partir del azul #2563EB', { size: 19, weight: 700, family: T.titulo })
  const sw = 380
  arm.forEach(([n, d, cols], i) => {
    const y = 206 + i * 70
    s += T.tx(M, y + 26, n, { size: 17, weight: 700 })
    s += T.tx(M, y + 48, d, { size: 14, fill: T.muted })
    const w = sw / cols.length
    cols.forEach((c, k) => { s += rect(W - M - sw + k * w, y, w - 4, 56, { rx: 8, fill: c }) })
  })
  const cy = 206 + 6 * 70 + 20
  s += T.tx(M, cy, 'Comprueba el contraste antes de poner texto encima', { size: 17, weight: 700, family: T.titulo })
  const cw = (W - 2 * M - 16) / 2
  s += rect(M, cy + 16, cw, 70, { rx: 12, fill: '#2563EB' }) + T.tx(M + 20, cy + 60, 'Texto blanco · 5,17:1 ✓ AA', { size: 19, weight: 700, fill: '#FFFFFF' })
  s += rect(M + cw + 16, cy + 16, cw, 70, { rx: 12, fill: '#EBAD25' }) + T.tx(M + cw + 36, cy + 60, 'Texto blanco · 1,99:1 ✗', { size: 19, weight: 700, fill: '#FFFFFF' })
  const n = T.nota(cy + 110, 'WCAG pide al menos 4,5:1 para texto normal. En el ámbar, el texto debe ir en oscuro.')
  return T.lienzo({ alto: Math.round(cy + 110 + n.h + 60), slug: 'generador-paleta-colores', titulo: 'Armonías de color de una misma base', cuerpo: s + n.svg })
}

const pieza = (archivo, alt, fn) => ({ archivo, alt, dibujar: fn })

module.exports = [
  pieza('crecimiento-factorial-digitos', 'Número de dígitos de 5!, 10!, 20!, 52! y 100! y cálculo de los ceros finales de 100!', factorial),
  pieza('desviacion-estandar-paso-a-paso', 'Cálculo a mano de la desviación estándar poblacional y muestral de seis datos', desviacion),
  pieza('tablas-multiplicar-dificultad', 'Tabla pitagórica del 1 al 10 coloreada según las multiplicaciones que más cuestan', tablas),
  pieza('edad-perro-por-tamano-grafica', 'Gráfica de la edad humana de un perro por tamaño y según la fórmula logarítmica', perro),
  pieza('partes-json-web-token', 'Un JWT dividido en header, payload y firma con su contenido decodificado', jwt),
  pieza('csv-a-json-ejemplo-filas', 'Ejemplo de CSV con comillas convertido a JSON y errores habituales al convertir', csv),
  pieza('caracteres-codificacion-url', 'Caracteres especiales y su codificación porcentual en una URL', url),
  pieza('minificar-css-antes-despues', 'Código CSS antes y después de minificarlo y lo que elimina el minificador', minificar),
  pieza('registro-datos-prueba-ficticio', 'Registro de datos de prueba ficticio, dominios de correo reservados y formatos de salida', datosPrueba),
  pieza('armonias-color-paleta', 'Seis armonías de color generadas desde un mismo azul y prueba de contraste de texto', paleta),
]
