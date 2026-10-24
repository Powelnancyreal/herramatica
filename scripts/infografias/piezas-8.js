// Infografías del lote 8 (herramientas 71 a 80).
const { rect, circle } = require('../illustrations/kit')
const { tema, W, M, es } = require('./piezas-4').temas

// ─────────────────────────────────────────────────────────── 71 EAN-13 (banda negra)
function ean() {
  const T = tema('banda', { accent: '#111827', soft: '#F3F4F6' })
  const cod = '7501234567893'.split('')
  const grupos = [[0, 3, 'Prefijo GS1', 'País donde se registró la empresa: 750 es México', '#2563EB'], [3, 12, 'Empresa y producto', 'Lo asigna GS1 a cada empresa', '#7C3AED'], [12, 13, 'Control', 'Detecta errores de lectura', '#DC2626']]
  const bw = 46
  const x0 = (W - 13 * bw - 2 * 10) / 2
  let s = ''
  const xs = []
  let x = x0
  cod.forEach((d, i) => {
    if (i === 3 || i === 12) x += 10
    xs.push(x)
    const g = grupos.find(([a, b]) => i >= a && i < b)
    s += rect(x + 2, 186, bw - 4, 62, { rx: 8, fill: '#FFFFFF', stroke: g[4], sw: 2.5 })
    s += T.tx(x + bw / 2, 228, d, { size: 30, weight: 700, anchor: 'middle', fill: g[4] })
    x += bw
  })
  grupos.forEach(([a, b, n, d, c], i) => {
    const y = 290 + i * 66
    s += rect(M, y, 16, 48, { rx: 4, fill: c })
    s += T.tx(M + 30, y + 20, n, { size: 19, weight: 700 })
    s += T.tx(M + 30, y + 44, d, { size: 16, fill: T.muted })
  })
  const cy = 290 + 3 * 66 + 20
  s += T.tx(M, cy, 'Cálculo del dígito de control', { size: 21, weight: 700 })
  const pasos = [['Cifras en posición impar, × 1', '7 + 0 + 2 + 4 + 6 + 8 = 27'], ['Cifras en posición par, × 3', '(5 + 1 + 3 + 5 + 7 + 9) × 3 = 90'], ['Suma y completa hasta la decena', '27 + 90 = 117 → 120 − 117 = 3']]
  pasos.forEach(([a, b], i) => {
    const y = cy + 22 + i * 58
    s += rect(M, y, W - 2 * M, 48, { rx: 10, fill: i === 2 ? '#FEE2E2' : T.soft })
    s += T.tx(M + 16, y + 31, a, { size: 17, fill: T.muted })
    s += T.tx(W - M - 16, y + 31, b, { size: 19, weight: 700, anchor: 'end', fill: i === 2 ? '#DC2626' : T.ink })
  })
  const n = T.nota(cy + 22 + 3 * 58 + 20, 'Para vender en tiendas necesitas un código registrado en GS1 de tu país. Un número inventado puede coincidir con el de otro producto.')
  return T.lienzo({ alto: Math.round(cy + 22 + 3 * 58 + 20 + n.h + 64), slug: 'generador-codigo-de-barras', titulo: 'Qué significa cada número de un código EAN-13', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 72 Crucigrama (cuaderno)
function crucigrama() {
  const T = tema('cuaderno', { accent: '#0F766E' })
  const c = 54
  const x0 = M + 40
  const y0 = 196
  // LIBRO horizontal en fila 2; LAPIZ vertical desde la L; REGLA vertical desde la R
  const celdas = {}
  ;[...'LIBRO'].forEach((ch, i) => { celdas[`0,${i}`] = ch })
  ;[...'LAPIZ'].forEach((ch, i) => { celdas[`${i},0`] = ch })
  ;[...'REGLA'].forEach((ch, i) => { celdas[`${i},3`] = ch })
  let s = ''
  const numeros = { '0,0': 1, '0,3': 2 }
  Object.entries(celdas).forEach(([k, ch]) => {
    const [f, col] = k.split(',').map(Number)
    const x = x0 + col * c
    const y = y0 + f * c
    const cruce = k === '0,0' || k === '0,3'
    s += rect(x, y, c, c, { rx: 0, fill: cruce ? '#CCFBF1' : '#FFFFFF', stroke: T.ink, sw: 2 })
    s += T.tx(x + c / 2, y + 38, ch, { size: 26, anchor: 'middle', family: T.titulo, fill: cruce ? T.accent : T.ink })
    if (numeros[k]) s += T.tx(x + 4, y + 14, String(numeros[k]), { size: 12, weight: 700 })
  })
  const px = x0 + 6 * c
  s += T.tx(px, 214, 'Horizontal', { size: 18, weight: 700, fill: T.accent })
  s += T.tx(px, 244, '1. Lo lees antes de dormir', { size: 17 })
  s += T.tx(px, 290, 'Vertical', { size: 18, weight: 700, fill: T.accent })
  s += T.tx(px, 320, '1. Escribe y se borra', { size: 17 })
  s += T.tx(px, 348, '2. Sirve para trazar rectas', { size: 17 })
  s += rect(px, 380, W - M - px, 88, { rx: 12, fill: '#CCFBF1', stroke: '#5EEAD4', sw: 2 })
  s += T.tx(px + 14, 412, 'Casillas de cruce', { size: 16, weight: 700, fill: T.accent })
  s += T.tx(px + 14, 438, 'Una letra que comparten', { size: 15 })
  s += T.tx(px + 14, 458, 'dos palabras.', { size: 15 })
  const n = T.nota(y0 + 5 * c + 30, 'El generador busca letras en común entre tus palabras para cruzarlas. Cuantas más vocales repetidas tengan, más fácil es conectarlas.')
  return T.lienzo({ alto: Math.round(y0 + 5 * c + 30 + n.h + 56), slug: 'generador-de-crucigramas', titulo: 'Cómo se cruzan las palabras de un crucigrama', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 73 Nombres Free Fire (oscuro, naranja neón)
function freeFire() {
  const T = tema('oscuro', { accent: '#FB923C', bg: '#120A05', soft: '#2A1608', line: '#4A2A10' })
  const partes = [['Símbolo', '★', '#FDE047'], ['Palabra', 'Fénix', '#FB923C'], ['Número', '77', '#F472B6'], ['Símbolo', '★', '#FDE047']]
  let x = M + 20
  let s = ''
  partes.forEach(([n, v, c], i) => {
    const w = 60 + v.length * 22
    s += rect(x, 190, w, 84, { rx: 14, fill: T.soft, stroke: c, sw: 2.5 })
    s += T.tx(x + w / 2, 246, v, { size: 36, weight: 700, anchor: 'middle', fill: c, family: 'Segoe UI Symbol, Segoe UI, sans-serif' })
    s += T.tx(x + w / 2, 300, n, { size: 15, anchor: 'middle', fill: T.muted })
    x += w + 14
  })
  s += T.tx(x + 10, 244, '= ★Fénix77★', { size: 30, weight: 700, family: 'Segoe UI Symbol, Segoe UI, sans-serif' })
  const ty = 360
  s += T.tx(M, ty, 'Ideas por estilo', { size: 21, weight: 700 })
  const ideas = [['Agresivo', 'Lobo Sombra · Rayo Letal'], ['Misterioso', 'Niebla · Fantasma Gris'], ['Con tu nombre', 'Carlos_77 · xKarlaX'], ['Corto', 'Nova · Kai · Zero']]
  const cw = (W - 2 * M - 16) / 2
  ideas.forEach(([a, b], i) => {
    const xx = M + (i % 2) * (cw + 16)
    const y = ty + 20 + Math.floor(i / 2) * 92
    s += rect(xx, y, cw, 80, { rx: 14, fill: T.soft })
    s += T.tx(xx + 18, y + 32, a, { size: 16, fill: T.accent, weight: 700 })
    s += T.tx(xx + 18, y + 62, b, { size: 20 })
  })
  const n = T.nota(ty + 20 + 2 * 92 + 20, 'El juego limita la longitud del nombre y no admite algunos símbolos. Si te da error, quita un símbolo o acorta la palabra.')
  return T.lienzo({ alto: Math.round(ty + 20 + 2 * 92 + 20 + n.h + 60), slug: 'generador-de-nombres-para-free-fire', titulo: 'Cómo se arma un nombre para Free Fire', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 74 Link de WhatsApp (banda verde WhatsApp)
function whatsapp() {
  const T = tema('banda', { accent: '#128C7E', soft: '#ECFDF5' })
  const partes = [['https://wa.me/', '#6B7280', 'Dirección corta oficial de WhatsApp'], ['573001234567', '#128C7E', 'Número con código de país, sin +, espacios ni guiones'], ['?text=Hola%2C%20quiero%20info', '#B45309', 'Mensaje que aparece ya escrito (opcional)']]
  let s = rect(M, 186, W - 2 * M, 72, { rx: 14, fill: '#FFFFFF', stroke: '#D1D5DB', sw: 2 })
  let x = M + 18
  partes.forEach(([t, c]) => {
    s += T.tx(x, 232, t, { size: 19, weight: 700, fill: c, family: 'Consolas, monospace' })
    x += t.length * 10.6
  })
  partes.forEach(([t, c, d], i) => {
    const y = 290 + i * 70
    s += rect(M, y, 14, 52, { rx: 4, fill: c })
    s += T.tx(M + 28, y + 22, t.replace('?text=', 'text='), { size: 17, weight: 700, fill: c, family: 'Consolas, monospace' })
    s += T.tx(M + 28, y + 46, d, { size: 16, fill: T.muted })
  })
  const py = 290 + 3 * 70 + 20
  s += T.tx(M, py, 'Códigos de país más usados', { size: 20, weight: 700 })
  const paises = [['México', '52'], ['Colombia', '57'], ['Argentina', '54 9'], ['Chile', '56'], ['Perú', '51'], ['España', '34']]
  const cw = (W - 2 * M - 40) / 6
  paises.forEach(([p, c], i) => {
    const xx = M + i * (cw + 8)
    s += rect(xx, py + 18, cw, 74, { rx: 12, fill: T.soft })
    s += T.tx(xx + cw / 2, py + 50, c, { size: 22, weight: 700, anchor: 'middle', fill: T.accent })
    s += T.tx(xx + cw / 2, py + 78, p, { size: 14, anchor: 'middle', fill: T.muted })
  })
  const n = T.nota(py + 130, 'En Argentina los móviles llevan un 9 entre el 54 y el código de área. Los espacios del mensaje se escriben como %20, pero el generador lo hace por ti.')
  return T.lienzo({ alto: Math.round(py + 130 + n.h + 60), slug: 'generador-de-link-de-whatsapp', titulo: 'Las partes de un enlace de WhatsApp', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 75 Engagement Instagram (pastel)
function engagement() {
  const T = tema('pastel', { accent: '#BE185D', soft: '#FCE7F3', bg: '#FFF8FB', ink: '#4A044E' })
  let s = rect(M, 180, W - 2 * M, 100, { rx: 18, fill: T.soft })
  s += T.tx(W / 2, 222, 'interacciones ÷ seguidores × 100', { size: 25, weight: 700, anchor: 'middle', fill: T.accent })
  s += T.tx(W / 2, 258, 'likes + comentarios + guardados + compartidos', { size: 17, anchor: 'middle', fill: T.muted })
  const datos = [['420', 'likes'], ['35', 'comentarios'], ['20', 'guardados'], ['15', 'compartidos']]
  const cw = (W - 2 * M - 36) / 4
  datos.forEach(([v, n], i) => {
    const x = M + i * (cw + 12)
    s += rect(x, 306, cw, 86, { rx: 14, fill: '#FFFFFF', stroke: T.line, sw: 2 })
    s += T.tx(x + cw / 2, 344, v, { size: 28, weight: 700, anchor: 'middle', fill: T.accent })
    s += T.tx(x + cw / 2, 372, n, { size: 15, anchor: 'middle', fill: T.muted })
  })
  s += T.tx(M, 432, '490 interacciones ÷ 10.000 seguidores = 4,9 %', { size: 21, weight: 700 })
  const tramos = [['Menos de 1 %', 'Bajo', '#FBCFE8'], ['1 a 3 %', 'Normal', '#F9A8D4'], ['3 a 6 %', 'Bueno', '#F472B6'], ['Más de 6 %', 'Muy alto', '#DB2777']]
  const tw = (W - 2 * M) / 4
  tramos.forEach(([r, n, c], i) => {
    s += rect(M + i * tw, 460, tw, 56, { rx: 0, fill: c })
    s += T.tx(M + i * tw + tw / 2, 494, n, { size: 18, weight: 700, anchor: 'middle', fill: i > 1 ? '#FFFFFF' : T.ink })
    s += T.tx(M + i * tw + tw / 2, 540, r, { size: 15, anchor: 'middle', fill: T.muted })
  })
  const mx = M + tw * 2 + tw * ((4.9 - 3) / 3)
  s += `<path d="M${mx - 10},448 L${mx + 10},448 L${mx},460 Z" fill="${T.ink}"/>`
  const n = T.nota(580, 'Referencias orientativas: las cuentas pequeñas suelen tener más engagement que las grandes. Compárate con cuentas de tu tamaño y tu nicho.')
  return T.lienzo({ alto: Math.round(580 + n.h + 60), slug: 'calculadora-engagement-instagram', titulo: 'Cómo se calcula el engagement de Instagram', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 76 Horarios (papel, cuadrícula semanal)
function horarios() {
  const T = tema('papel', { accent: '#7C2D12', line: '#E6D9C2' })
  const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie']
  const horas = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00']
  const x0 = M + 70
  const cw = (W - M - x0) / 5
  const ch = 54
  const y0 = 200
  let s = ''
  dias.forEach((d, i) => { s += T.tx(x0 + i * cw + cw / 2, y0 - 14, d, { size: 18, weight: 700, anchor: 'middle', family: T.titulo }) })
  horas.forEach((h, j) => {
    s += T.tx(x0 - 12, y0 + j * ch + 20, h, { size: 15, anchor: 'end', fill: T.muted })
    s += `<line x1="${x0}" y1="${y0 + j * ch}" x2="${W - M}" y2="${y0 + j * ch}" stroke="${T.line}" stroke-width="1.5"/>`
  })
  const bloques = [
    [0, 0, 2, 'Matemáticas', '#93C5FD'], [2, 0, 2, 'Matemáticas', '#93C5FD'], [1, 0, 1, 'Inglés', '#FCA5A5'], [3, 0, 1, 'Inglés', '#FCA5A5'],
    [0, 3, 1, 'Recreo', '#E5E7EB'], [1, 3, 1, 'Recreo', '#E5E7EB'], [2, 3, 1, 'Recreo', '#E5E7EB'], [3, 3, 1, 'Recreo', '#E5E7EB'], [4, 3, 1, 'Recreo', '#E5E7EB'],
    [1, 1, 2, 'Lengua', '#FDE68A'], [3, 1, 2, 'Lengua', '#FDE68A'], [4, 0, 3, 'Ciencias', '#A7F3D0'], [0, 4, 2, 'Historia', '#DDD6FE'], [2, 4, 2, 'Ed. Física', '#FDBA74'], [4, 4, 2, 'Arte', '#F9A8D4'],
  ]
  bloques.forEach(([d, h, n, t, c]) => {
    s += rect(x0 + d * cw + 3, y0 + h * ch + 3, cw - 6, n * ch - 6, { rx: 8, fill: c })
    s += T.tx(x0 + d * cw + cw / 2, y0 + h * ch + (n * ch) / 2 + 6, t, { size: 15, weight: 700, anchor: 'middle' })
  })
  const n = T.nota(y0 + 7 * ch + 30, 'Un color por asignatura o tarea ayuda a ver de un vistazo cómo se reparte la semana. Deja huecos libres: un horario sin descansos no se cumple.')
  return T.lienzo({ alto: Math.round(y0 + 7 * ch + 30 + n.h + 64), slug: 'calculador-de-horarios', titulo: 'Un horario semanal organizado por colores', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 77 Hexadecimal a texto (terminal)
function hexTexto() {
  const T = tema('terminal', { accent: '#F472B6' })
  let s = T.tx(M, 180, '$ hex2text 48 6F 6C 61', { size: 22, fill: '#34D399' })
  const pares = [['48', 'H'], ['6F', 'o'], ['6C', 'l'], ['61', 'a']]
  const cw = (W - 2 * M - 36) / 4
  pares.forEach(([h, l], i) => {
    const x = M + i * (cw + 12)
    s += rect(x, 206, cw, 160, { rx: 12, fill: T.soft, stroke: T.line, sw: 2 })
    s += T.tx(x + cw / 2, 254, h, { size: 34, weight: 700, anchor: 'middle', fill: '#FDE68A' })
    s += T.tx(x + cw / 2, 282, `= ${parseInt(h, 16)}`, { size: 16, anchor: 'middle', fill: T.muted })
    s += T.tx(x + cw / 2, 344, l, { size: 46, weight: 700, anchor: 'middle', fill: T.accent })
  })
  const uy = 420
  s += T.tx(M, uy, '# UTF-8: los caracteres especiales usan varios bytes', { size: 18, fill: T.muted })
  const esp = [['ñ', 'C3 B1', '2 bytes'], ['á', 'C3 A1', '2 bytes'], ['€', 'E2 82 AC', '3 bytes']]
  esp.forEach(([c, h, b], i) => {
    const y = uy + 24 + i * 62
    s += rect(M, y, W - 2 * M, 52, { rx: 10, fill: T.soft })
    s += T.tx(M + 24, y + 36, c, { size: 28, weight: 700, fill: T.accent })
    s += T.tx(M + 110, y + 35, h, { size: 24, fill: '#FDE68A' })
    s += T.tx(W - M - 20, y + 34, b, { size: 17, anchor: 'end', fill: T.muted })
  })
  const n = T.nota(uy + 24 + 3 * 62 + 16, '// Por eso un hexadecimal con un número impar de cifras da error: cada byte necesita exactamente dos.')
  return T.lienzo({ alto: Math.round(uy + 24 + 3 * 62 + 16 + n.h + 60), slug: 'hexadecimal-a-texto', titulo: 'Cómo se convierte hexadecimal en texto', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 78 Ruleta aleatoria (oscuro, colores)
function ruleta() {
  const T = tema('oscuro', { accent: '#FACC15', bg: '#0F172A' })
  const cx = 230
  const cy = 380
  const r = 170
  const ops = [['Pizza', '#3B82F6'], ['Tacos', '#EF4444'], ['Sushi', '#F59E0B'], ['Pasta', '#10B981'], ['Burger', '#8B5CF6'], ['Ensalada', '#EC4899']]
  let s = ''
  ops.forEach(([n, c], i) => {
    const a1 = (i / 6) * 2 * Math.PI - Math.PI / 2
    const a2 = ((i + 1) / 6) * 2 * Math.PI - Math.PI / 2
    const p = (a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)]
    const [x1, y1] = p(a1)
    const [x2, y2] = p(a2)
    s += `<path d="M${cx},${cy} L${x1},${y1} A${r},${r} 0 0 1 ${x2},${y2} Z" fill="${c}" stroke="#0F172A" stroke-width="3"/>`
    const am = (a1 + a2) / 2
    s += T.tx(cx + r * 0.62 * Math.cos(am), cy + r * 0.62 * Math.sin(am) + 6, n, { size: 17, weight: 700, anchor: 'middle', fill: '#FFFFFF' })
  })
  s += circle(cx, cy, 26, { fill: '#F8FAFC' }) + `<path d="M${cx - 14},${cy - r - 22} L${cx + 14},${cy - r - 22} L${cx},${cy - r + 6} Z" fill="${T.accent}"/>`
  const tx = 450
  s += T.tx(tx, 230, '6 opciones', { size: 22, weight: 700 })
  s += T.tx(tx, 290, '1 ÷ 6 =', { size: 26 })
  s += T.tx(tx, 350, '16,7 %', { size: 54, weight: 700, fill: T.accent })
  s += T.tx(tx, 386, 'de probabilidad cada una', { size: 17, fill: T.muted })
  s += T.tx(tx, 448, 'Con 10 opciones:  10 %', { size: 19 })
  s += T.tx(tx, 480, 'Con 20 opciones:  5 %', { size: 19 })
  const n = T.nota(cy + r + 40, 'El ganador se decide al azar antes de que la ruleta empiece a girar; la animación solo lo muestra. Repetir una opción en la lista le da más probabilidad.')
  return T.lienzo({ alto: Math.round(cy + r + 40 + n.h + 60), slug: 'ruleta-aleatoria-online', titulo: 'Qué probabilidad tiene cada opción de la ruleta', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 79 Promedio ponderado (cuaderno)
function ponderado() {
  const T = tema('cuaderno', { accent: '#7C3AED' })
  const cursos = [['Cálculo', 15, 4], ['Física', 12, 3], ['Programación', 17, 5], ['Inglés', 10, 2]]
  const cols = [M + 10, M + 300, M + 420, W - M - 10]
  let s = ''
  ;['Curso', 'Nota', 'Créditos', 'Nota × créditos'].forEach((c, i) => { s += T.tx(cols[i], 188, c, { size: 16, fill: T.muted, anchor: i === 0 ? 'start' : i === 3 ? 'end' : 'middle' }) })
  cursos.forEach(([n, nota, cr], i) => {
    const y = 200 + i * 56
    s += rect(M, y, W - 2 * M, 48, { rx: 10, fill: '#FFFFFF', stroke: '#93C5FD', sw: 1.5 })
    s += T.tx(cols[0], y + 32, n, { size: 21, family: T.titulo })
    s += T.tx(cols[1], y + 32, String(nota), { size: 22, anchor: 'middle', weight: 700 })
    s += T.tx(cols[2], y + 32, String(cr), { size: 22, anchor: 'middle', weight: 700, fill: T.accent })
    s += T.tx(cols[3], y + 32, String(nota * cr), { size: 22, anchor: 'end', weight: 700 })
  })
  const ty = 200 + 4 * 56 + 10
  s += T.tx(cols[2], ty + 24, '14', { size: 22, anchor: 'middle', weight: 700, fill: T.accent }) + T.tx(cols[3], ty + 24, '201', { size: 22, anchor: 'end', weight: 700 })
  s += `<line x1="${M}" y1="${ty}" x2="${W - M}" y2="${ty}" stroke="${T.ink}" stroke-width="2"/>`
  const ry = ty + 60
  const cw = (W - 2 * M - 16) / 2
  s += rect(M, ry, cw, 120, { rx: 16, fill: '#EDE9FE', stroke: T.accent, sw: 2 })
  s += T.tx(M + cw / 2, ry + 34, 'Promedio ponderado', { size: 17, anchor: 'middle', fill: T.muted })
  s += T.tx(M + cw / 2, ry + 76, '201 ÷ 14 = 14,36', { size: 26, anchor: 'middle', weight: 700, family: T.titulo, fill: T.accent })
  s += rect(M + cw + 16, ry, cw, 120, { rx: 16, fill: '#FFFFFF', stroke: '#93C5FD', sw: 2 })
  s += T.tx(M + cw + 16 + cw / 2, ry + 34, 'Promedio simple', { size: 17, anchor: 'middle', fill: T.muted })
  s += T.tx(M + cw + 16 + cw / 2, ry + 76, '54 ÷ 4 = 13,50', { size: 26, anchor: 'middle', family: T.titulo })
  const n = T.nota(ry + 160, 'Programación, el curso con más créditos (5), tiene un 17 y arrastra el promedio hacia arriba. Notas en escala de 0 a 20, la usada en Perú.')
  return T.lienzo({ alto: Math.round(ry + 160 + n.h + 56), slug: 'calculadora-promedio-ponderado', titulo: 'Promedio ponderado frente a promedio simple', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 80 CTS Perú (banda roja Perú)
function cts() {
  const T = tema('banda', { accent: '#B91C1C', soft: '#FEF2F2' })
  let s = rect(M, 180, W - 2 * M, 92, { rx: 16, fill: T.soft })
  s += T.tx(W / 2, 220, 'Remuneración computable = sueldo + 1/6 de la gratificación', { size: 21, weight: 700, anchor: 'middle', fill: T.accent })
  s += T.tx(W / 2, 252, 'S/ 2.000 + S/ 2.000 ÷ 6 = S/ 2.333,33', { size: 19, anchor: 'middle' })
  s += T.tx(M, 318, 'CTS por un semestre completo (6 meses)', { size: 20, weight: 700 })
  s += T.tx(M, 350, 'S/ 2.333,33 ÷ 12 × 6 =', { size: 24 })
  s += T.tx(W - M, 350, 'S/ 1.166,67', { size: 34, weight: 700, anchor: 'end', fill: T.accent })
  const ty = 410
  s += T.tx(M, ty, 'Calendario de depósitos', { size: 20, weight: 700 })
  const per = [['Noviembre a abril', 'se deposita hasta el 15 de mayo'], ['Mayo a octubre', 'se deposita hasta el 15 de noviembre']]
  const cw = (W - 2 * M - 16) / 2
  per.forEach(([a, b], i) => {
    const x = M + i * (cw + 16)
    s += rect(x, ty + 20, cw, 100, { rx: 16, fill: '#FFFFFF', stroke: '#FCA5A5', sw: 2 })
    s += T.tx(x + 20, ty + 60, a, { size: 21, weight: 700, fill: T.accent })
    s += T.tx(x + 20, ty + 92, b, { size: 16, fill: T.muted })
  })
  const n = T.nota(ty + 160, 'Si trabajaste menos del semestre completo, se calcula por meses y días: remuneración computable ÷ 12 por mes y ÷ 360 por día.')
  return T.lienzo({ alto: Math.round(ty + 160 + n.h + 64), slug: 'calculadora-cts-peru', titulo: 'Cómo se calcula el depósito de CTS en Perú', cuerpo: s + n.svg })
}

const pieza = (archivo, alt, fn) => ({ archivo, alt, dibujar: fn })

module.exports = [
  pieza('partes-codigo-barras-ean13', 'Partes de un código de barras EAN-13 y cálculo de su dígito de control', ean),
  pieza('como-se-cruzan-palabras-crucigrama', 'Ejemplo de crucigrama con palabras cruzadas y pistas horizontales y verticales', crucigrama),
  pieza('como-armar-nombre-free-fire', 'Cómo armar un nombre para Free Fire con símbolos, palabras y números', freeFire),
  pieza('partes-enlace-whatsapp-wa-me', 'Partes de un enlace de WhatsApp wa.me con número, mensaje y códigos de país', whatsapp),
  pieza('calculo-engagement-instagram', 'Cálculo de la tasa de engagement de Instagram con un ejemplo y rangos de referencia', engagement),
  pieza('horario-semanal-por-colores', 'Ejemplo de horario semanal de clases organizado por colores', horarios),
  pieza('hexadecimal-a-texto-utf8', 'Conversión de hexadecimal a texto: 48 6F 6C 61 es Hola, y bytes UTF-8 de la ñ, la á y el euro', hexTexto),
  pieza('probabilidad-ruleta-aleatoria', 'Ruleta aleatoria de seis opciones con 16,7 por ciento de probabilidad cada una', ruleta),
  pieza('promedio-ponderado-vs-simple', 'Cálculo del promedio ponderado por créditos frente al promedio simple con cuatro cursos', ponderado),
  pieza('calculo-cts-peru-deposito', 'Cálculo de la CTS en Perú con la remuneración computable y fechas de depósito de mayo y noviembre', cts),
]
