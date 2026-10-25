// Infografías del lote 12 (herramientas 111 a 120).
const { rect, circle } = require('../illustrations/kit')
const { tema, W, M, es } = require('./piezas-4').temas

// ─────────────────────────────────────────────────────────── 111 TMB (pastel naranja, tres fórmulas)
function tmb() {
  const T = tema('pastel', { accent: '#C2410C', soft: '#FFEDD5', bg: '#FFFAF5', ink: '#431407', line: '#FED7AA' })
  let s = T.tx(M, 184, 'Hombre de 30 años, 80 kg y 1,78 m', { size: 20, weight: 700 })
  const formulas = [
    ['Mifflin-St Jeor', 'Recomendada para la mayoría', 1768, '#EA580C'],
    ['Harris-Benedict revisada', 'Clásica; suele dar un poco más', 1844, '#FB923C'],
    ['Katch-McArdle', 'Necesita tu % de grasa (aquí, 18 %)', 1787, '#9A3412'],
  ]
  const ancho = W - 2 * M - 160
  formulas.forEach(([n, d, v, c], i) => {
    const y = 210 + i * 104
    s += T.tx(M, y + 22, n, { size: 20, weight: 700 })
    s += T.tx(M, y + 46, d, { size: 15, fill: T.muted })
    s += rect(M, y + 58, ((v - 1200) / 700) * ancho, 30, { rx: 8, fill: c })
    s += T.tx(M + ((v - 1200) / 700) * ancho + 12, y + 81, `${v.toLocaleString('es-ES', { useGrouping: 'always' })} kcal`, { size: 20, weight: 700, fill: c })
  })
  const ty = 210 + 3 * 104 + 16
  s += rect(M, ty, W - 2 * M, 110, { rx: 16, fill: T.soft })
  s += T.tx(M + 20, ty + 36, 'TMB × actividad = gasto diario total', { size: 20, weight: 700, fill: T.accent })
  s += T.tx(M + 20, ty + 70, '1.768 × 1,55 (ejercicio 3–5 días) = 2.740 kcal al día', { size: 18 })
  s += T.tx(M + 20, ty + 96, 'Comer menos que tu TMB de forma sostenida no es recomendable.', { size: 15, fill: T.muted })
  return T.lienzo({ alto: ty + 110 + 80, slug: 'calculadora-tmb', titulo: 'Tres fórmulas del metabolismo basal, una persona', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 112 Grasa corporal (banda violeta)
function grasa() {
  const T = tema('banda', { accent: '#6D28D9', soft: '#F5F3FF' })
  // Silueta simple con las medidas
  const cx = 150
  let s = circle(cx, 220, 30, { fill: '#DDD6FE' })
  s += rect(cx - 16, 248, 32, 18, { rx: 4, fill: '#DDD6FE' })
  s += `<path d="M${cx - 60},270 h120 l-10,150 h-100 Z" fill="#DDD6FE"/>`
  s += `<rect x="${cx - 45}" y="420" width="36" height="120" rx="12" fill="#DDD6FE"/><rect x="${cx + 9}" y="420" width="36" height="120" rx="12" fill="#DDD6FE"/>`
  s += `<line x1="${cx - 20}" y1="258" x2="${cx + 20}" y2="258" stroke="${T.accent}" stroke-width="4"/>` + T.tx(cx + 30, 262, 'cuello', { size: 15, weight: 700, fill: T.accent })
  s += `<line x1="${cx - 56}" y1="350" x2="${cx + 56}" y2="350" stroke="${T.accent}" stroke-width="4"/>` + T.tx(cx + 66, 354, 'cintura (ombligo)', { size: 15, weight: 700, fill: T.accent })
  s += `<line x1="${cx - 54}" y1="408" x2="${cx + 54}" y2="408" stroke="#DB2777" stroke-width="4" stroke-dasharray="6 4"/>` + T.tx(cx + 64, 412, 'cadera (mujeres)', { size: 15, weight: 700, fill: '#DB2777' })
  const tx = 400
  s += T.tx(tx, 196, 'Rangos de grasa corporal', { size: 19, weight: 700 })
  s += T.tx(tx + 210, 226, 'Hombres', { size: 14, fill: T.muted, anchor: 'middle' }) + T.tx(tx + 310, 226, 'Mujeres', { size: 14, fill: T.muted, anchor: 'middle' })
  const filas = [['Esencial', '2–5 %', '10–13 %'], ['Atleta', '6–13 %', '14–20 %'], ['Forma física', '14–17 %', '21–24 %'], ['Promedio', '18–24 %', '25–31 %'], ['Obesidad', '25 % +', '32 % +']]
  filas.forEach(([n, h, m], i) => {
    const y = 240 + i * 50
    s += rect(tx, y, W - M - tx, 42, { rx: 10, fill: i === 2 ? '#EDE9FE' : i % 2 ? '#FFFFFF' : T.soft })
    s += T.tx(tx + 12, y + 28, n, { size: 17, weight: 700 })
    s += T.tx(tx + 210, y + 28, h, { size: 17, anchor: 'middle' })
    s += T.tx(tx + 310, y + 28, m, { size: 17, anchor: 'middle' })
  })
  const ey = 560
  s += rect(M, ey, W - 2 * M, 70, { rx: 14, fill: T.accent })
  s += T.tx(M + 20, ey + 44, 'Hombre de 1,78 m, cuello 38 cm, cintura 86 cm → 17,2 %: forma física', { size: 19, weight: 700, fill: '#FFFFFF' })
  const n = T.nota(ey + 110, 'Método de la Marina de Estados Unidos con cinta métrica. Mide por la mañana, en ayunas y siempre en el mismo sitio para comparar.')
  return T.lienzo({ alto: Math.round(ey + 110 + n.h + 64), slug: 'calculadora-grasa-corporal', titulo: 'Dónde medir y qué porcentaje de grasa es saludable', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 113 Agua diaria (pastel azul, vasos)
function agua() {
  const T = tema('pastel', { accent: '#0369A1', soft: '#E0F2FE', bg: '#F5FBFF', ink: '#0C4A6E', line: '#BAE6FD' })
  const vaso = (x, y, lleno, col) => `<path d="M${x},${y} h36 l-5,52 h-26 Z" fill="${lleno ? col : '#FFFFFF'}" stroke="${T.accent}" stroke-width="2.5"/>`
  let s = T.tx(M, 184, 'Persona de 70 kg', { size: 22, weight: 700 })
  const filas = [
    ['Base: 70 kg × 35 ml', '2.450 ml', 10, '#7DD3FC'],
    ['+ 45 minutos de ejercicio', '+ 450 ml', 2, '#38BDF8'],
    ['+ día caluroso', '+ 500 ml', 2, '#0EA5E9'],
  ]
  let y = 214
  filas.forEach(([t, v, n, c]) => {
    s += T.tx(M, y + 20, t, { size: 18 })
    s += T.tx(W - M, y + 20, v, { size: 20, weight: 700, anchor: 'end', fill: T.accent })
    for (let i = 0; i < n; i++) s += vaso(M + i * 48, y + 34, true, c)
    y += 112
  })
  s += rect(M, y, W - 2 * M, 80, { rx: 16, fill: T.accent })
  s += T.tx(M + 20, y + 50, 'Total: 3.400 ml ≈ 13–14 vasos de 250 ml', { size: 24, weight: 700, fill: '#FFFFFF' })
  const n = T.nota(y + 120, 'Incluye el agua de la comida, que aporta en torno al 20 %. Embarazo: +300 ml; lactancia: +700 ml. Si tienes una enfermedad renal o cardíaca, sigue la indicación de tu médico.')
  return T.lienzo({ alto: Math.round(y + 120 + n.h + 64), slug: 'calculadora-agua-diaria', titulo: 'Cuánta agua beber al día según tu peso', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 114 JSON (terminal)
function json() {
  const T = tema('terminal', { accent: '#F472B6' })
  let s = T.tx(M, 180, '# minificado', { size: 16, fill: T.muted })
  s += rect(M, 192, W - 2 * M, 50, { rx: 8, fill: T.soft })
  s += T.tx(M + 14, 224, '{"nombre":"Ana","edad":31,"activa":true,"tags":["mx","pro"]}', { size: 17, fill: '#E5E7EB' })
  s += T.tx(M, 276, '# formateado', { size: 16, fill: T.muted })
  const lineas = [['{', T.ink], ['  "nombre": "Ana",', '#FDE68A'], ['  "edad": 31,', '#93C5FD'], ['  "activa": true,', '#34D399'], ['  "tags": ["mx", "pro"]', '#FDE68A'], ['}', T.ink]]
  lineas.forEach(([l, c], i) => { s += T.tx(M + 14, 306 + i * 28, l, { size: 18, fill: c }) })
  const ey = 306 + 6 * 28 + 30
  s += T.tx(M, ey, '# errores más comunes', { size: 16, fill: T.muted })
  const errores = [["{'nombre': 'Ana'}", 'comillas simples', 'usa comillas dobles'], ['{"a": 1, "b": 2,}', 'coma sobrante', 'quita la última coma'], ['{nombre: "Ana"}', 'clave sin comillas', 'las claves van entre comillas'], ['{"a": 1 // nota}', 'comentario', 'JSON no admite comentarios']]
  errores.forEach(([c, e, f], i) => {
    const y = ey + 18 + i * 56
    s += rect(M, y, W - 2 * M, 48, { rx: 8, fill: T.soft })
    s += T.tx(M + 14, y + 31, c, { size: 17, fill: '#F87171' })
    s += T.tx(M + 330, y + 22, e, { size: 15, fill: T.accent })
    s += T.tx(M + 330, y + 40, f, { size: 14, fill: T.muted })
  })
  return T.lienzo({ alto: ey + 18 + 4 * 56 + 70, slug: 'formateador-json', titulo: 'JSON formateado, minificado y sus errores típicos', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 115 Base64 (plano)
function base64() {
  const T = tema('plano', { accent: '#FCD34D' })
  let s = T.tx(M, 186, 'texto  →  bytes  →  grupos de 6 bits  →  Base64', { size: 18, fill: T.muted })
  const letras = ['H', 'o', 'l', 'a']
  const bits = ['01001000', '01101111', '01101100', '01100001']
  const cw = (W - 2 * M - 36) / 4
  letras.forEach((l, i) => {
    const x = M + i * (cw + 12)
    s += rect(x, 206, cw, 100, { rx: 10, fill: T.soft, stroke: T.line, sw: 2 })
    s += T.tx(x + cw / 2, 244, l, { size: 30, weight: 700, anchor: 'middle', fill: '#FFFFFF', family: T.titulo })
    s += T.tx(x + cw / 2, 286, bits[i], { size: 18, anchor: 'middle', fill: T.muted })
  })
  const seis = ['010010', '000110', '111101', '101100', '011000', '01']
  const sal = ['S', 'G', '9', 's', 'Y', 'Q']
  const sw = (W - 2 * M - 50) / 6
  seis.forEach((g, i) => {
    const x = M + i * (sw + 10)
    s += rect(x, 340, sw, 96, { rx: 10, fill: '#123A63', stroke: i === 5 ? '#F87171' : T.line, sw: 2 })
    s += T.tx(x + sw / 2, 372, i === 5 ? '01 + 0000' : g, { size: 15, anchor: 'middle', fill: T.muted })
    s += T.tx(x + sw / 2, 418, sal[i], { size: 34, weight: 700, anchor: 'middle', fill: T.accent })
  })
  s += rect(M, 470, W - 2 * M, 70, { rx: 14, fill: T.soft, stroke: T.accent, sw: 2 })
  s += T.tx(W / 2, 514, '"Hola"  →  SG9sYQ==', { size: 30, weight: 700, anchor: 'middle', fill: '#FFFFFF' })
  const n = T.nota(580, 'Los «=» rellenan hasta un múltiplo de 4 caracteres. Base64 ocupa un 33 % más que el original y no cifra nada: cualquiera puede decodificarlo.')
  return T.lienzo({ alto: Math.round(580 + n.h + 60), slug: 'codificador-base64', titulo: 'Cómo se convierte un texto a Base64', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 116 UUID (oscuro)
function uuid() {
  const T = tema('oscuro', { accent: '#A78BFA' })
  const fila = (y, etiqueta, partes, desc) => {
    let o = T.tx(M, y, etiqueta, { size: 20, weight: 700, fill: T.accent })
    let x = M
    partes.forEach(([t, c], i) => {
      o += T.tx(x, y + 44, t, { size: 26, family: 'Consolas, monospace', fill: c })
      x += t.length * 14.4
      if (i < partes.length - 1) { o += T.tx(x, y + 44, '-', { size: 26, family: 'Consolas, monospace', fill: T.muted }); x += 14.4 }
    })
    o += T.tx(M, y + 76, desc, { size: 16, fill: T.muted })
    return o
  }
  let s = fila(190, 'UUID v4 (aleatorio)', [['3f2b8c1e', '#E5E7EB'], ['9d4a', '#E5E7EB'], ['4e7c', '#F472B6'], ['b1a2', '#34D399'], ['5d6e7f8a9b0c', '#E5E7EB']], '122 bits al azar: la probabilidad de repetir uno es prácticamente nula.')
  s += fila(320, 'UUID v7 (ordenado por tiempo)', [['019a1b2c', '#FDE68A'], ['3d4e', '#FDE68A'], ['7f01', '#F472B6'], ['8a2b', '#34D399'], ['3c4d5e6f7a8b', '#E5E7EB']], 'Los primeros 48 bits son la fecha en milisegundos: se ordenan solos.')
  const ly = 450
  const ley = [['#F472B6', 'La primera cifra del tercer bloque es la versión: 4 o 7'], ['#34D399', 'El cuarto bloque empieza por 8, 9, a o b (variante)'], ['#FDE68A', 'En v7, la marca de tiempo']]
  ley.forEach(([c, t], i) => { s += rect(M, ly + i * 38, 22, 22, { rx: 5, fill: c }) + T.tx(M + 34, ly + i * 38 + 17, t, { size: 17 }) })
  const ty = ly + 3 * 38 + 20
  const cw = (W - 2 * M - 16) / 2
  s += rect(M, ty, cw, 96, { rx: 14, fill: T.soft }) + T.tx(M + 18, ty + 34, 'Usa v4 para', { size: 16, fill: T.muted }) + T.tx(M + 18, ty + 66, 'tokens, nombres de archivo', { size: 18, weight: 700 })
  s += rect(M + cw + 16, ty, cw, 96, { rx: 14, fill: T.soft }) + T.tx(M + cw + 34, ty + 34, 'Usa v7 para', { size: 16, fill: T.muted }) + T.tx(M + cw + 34, ty + 66, 'claves de bases de datos', { size: 18, weight: 700 })
  return T.lienzo({ alto: ty + 96 + 80, slug: 'generador-uuid', titulo: 'Cómo leer un UUID v4 y un UUID v7', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 117 Regex (cuaderno, chuleta)
function regex() {
  const T = tema('cuaderno', { accent: '#DC2626' })
  const items = [
    ['\\d', 'un dígito', '\\d{3} → 123'], ['\\w', 'letra, número o _', '\\w+ → hola_1'], ['\\s', 'espacio o salto', 'a\\sb → a b'], ['.', 'cualquier carácter', 'c.sa → casa'],
    ['^  $', 'inicio y fin', '^Hola$'], ['*  +  ?', '0+, 1+, 0 o 1', 'colou?r'], ['{n,m}', 'entre n y m veces', '\\d{2,4}'], ['[abc]', 'uno de la lista', '[aeiou]'],
    ['[^abc]', 'ninguno de la lista', '[^0-9]'], ['( )', 'grupo a reutilizar', '(\\d+)-(\\d+)'], ['a|b', 'una u otra', 'sí|no'], ['\\b', 'borde de palabra', '\\bsol\\b'],
  ]
  const cw = (W - 2 * M - 24) / 3
  let s = ''
  items.forEach(([p, d, e], i) => {
    const x = M + (i % 3) * (cw + 12)
    const y = 180 + Math.floor(i / 3) * 102
    s += rect(x, y, cw, 90, { rx: 12, fill: '#FFFFFF', stroke: '#93C5FD', sw: 2 })
    s += T.tx(x + 16, y + 36, p, { size: 26, weight: 700, fill: T.accent, family: 'Consolas, monospace' })
    s += T.tx(x + 16, y + 60, d, { size: 15 })
    s += T.tx(x + 16, y + 80, e, { size: 14, fill: T.muted, family: 'Consolas, monospace' })
  })
  const fy = 180 + 4 * 102 + 10
  s += rect(M, fy, W - 2 * M, 64, { rx: 12, fill: '#FEF2F2', stroke: '#FCA5A5', sw: 2 })
  s += T.tx(M + 18, fy + 40, 'Banderas: g todas · i sin mayúsculas · m multilínea · u Unicode', { size: 16, family: 'Consolas, monospace' })
  const n = T.nota(fy + 104, 'Para letras con tilde y ñ usa [a-záéíóúüñ] o, con la bandera u, \\p{L} para cualquier letra.')
  return T.lienzo({ alto: Math.round(fy + 104 + n.h + 56), slug: 'probador-regex', titulo: 'Chuleta de expresiones regulares', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 118 Hash (oscuro, efecto avalancha)
function hash() {
  const T = tema('oscuro', { accent: '#F87171', bg: '#0F0F14', soft: '#1C1C26', line: '#2C2C3A' })
  let s = T.tx(M, 184, 'SHA-256: cambia una sola letra y cambia todo', { size: 20, weight: 700 })
  const caja = (y, t, h, c) => rect(M, y, W - 2 * M, 96, { rx: 14, fill: T.soft }) + T.tx(M + 18, y + 34, `"${t}"`, { size: 22, weight: 700, fill: c }) + T.tx(M + 18, y + 64, h.slice(0, 32), { size: 18, family: 'Consolas, monospace', fill: T.ink }) + T.tx(M + 18, y + 86, h.slice(32), { size: 18, family: 'Consolas, monospace', fill: T.ink })
  s += caja(204, 'hola', 'b221d9dbb083a7f33428d7c2a3c3198ae925614d70210e28716ccaa7cd4ddb79', '#60A5FA')
  s += caja(314, 'Hola', 'e633f4fc79badea1dc5db970cf397c8248bac47cc3acf9915ba60b5d76b0e88f', T.accent)
  const ty = 440
  s += T.tx(M, ty, 'Longitud de cada algoritmo (en hexadecimal)', { size: 18, weight: 700 })
  const algs = [['MD5', 32, 'obsoleto', '#9CA3AF'], ['SHA-1', 40, 'obsoleto', '#9CA3AF'], ['SHA-256', 64, 'recomendado', '#34D399'], ['SHA-512', 128, 'más largo', '#60A5FA']]
  const max = 128
  const ancho = W - 2 * M - 230
  algs.forEach(([n, l, e, c], i) => {
    const y = ty + 20 + i * 48
    s += T.tx(M, y + 26, n, { size: 18, weight: 700 })
    s += rect(M + 100, y + 8, (l / max) * ancho, 26, { rx: 6, fill: c })
    s += T.tx(M + 110 + (l / max) * ancho, y + 27, `${l} · ${e}`, { size: 15, fill: c })
  })
  const n = T.nota(ty + 20 + 4 * 48 + 16, 'Un hash no se puede «descifrar»: es una huella de un solo sentido. Para guardar contraseñas se usan algoritmos lentos como bcrypt o Argon2, no MD5.')
  return T.lienzo({ alto: Math.round(ty + 20 + 4 * 48 + 16 + n.h + 60), slug: 'generador-hash', titulo: 'Qué es un hash y por qué cambia con una sola letra', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 119 Lorem ipsum (papel)
function lorem() {
  const T = tema('papel', { accent: '#7C2D12' })
  let s = T.tx(M, 188, '«Lorem ipsum dolor sit amet, consectetur adipiscing elit…»', { size: 22, family: T.titulo, fill: T.accent })
  s += T.tx(M, 224, 'Viene de un texto real, desordenado a propósito:', { size: 18, fill: T.muted })
  s += rect(M, 244, W - 2 * M, 110, { rx: 14, fill: T.soft })
  s += T.tx(M + 20, 282, '«De finibus bonorum et malorum»', { size: 22, weight: 700, family: T.titulo })
  s += T.tx(M + 20, 314, 'Cicerón, año 45 a. C. «Dolorem ipsum» significa «el dolor mismo».', { size: 17 })
  s += T.tx(M + 20, 338, 'Un impresor lo usó como relleno en el siglo XVI y se popularizó en el XX.', { size: 15, fill: T.muted })
  const ty = 400
  s += T.tx(M, ty, '¿Cuánto texto de relleno necesito?', { size: 20, weight: 700, family: T.titulo })
  const usos = [['Titular', '3 a 8 palabras'], ['Tarjeta de producto', '20 a 40 palabras'], ['Párrafo de blog', '50 a 100 palabras'], ['Página de servicios', '300 a 600 palabras']]
  usos.forEach(([a, b], i) => {
    const y = ty + 24 + i * 52
    s += `<line x1="${M}" y1="${y + 40}" x2="${W - M}" y2="${y + 40}" stroke="${T.line}" stroke-width="1.5"/>`
    s += T.tx(M, y + 28, a, { size: 19, family: T.titulo })
    s += T.tx(W - M, y + 28, b, { size: 19, weight: 700, anchor: 'end', fill: T.accent })
  })
  const n = T.nota(ty + 24 + 4 * 52 + 20, 'Sustituye todo el texto de relleno antes de publicar: una página con Lorem Ipsum parece inacabada a los usuarios y a los buscadores.')
  return T.lienzo({ alto: Math.round(ty + 24 + 4 * 52 + 20 + n.h + 64), slug: 'generador-lorem-ipsum', titulo: 'De dónde viene el Lorem Ipsum y cuánto usar', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 120 Validador de email (banda índigo)
function email() {
  const T = tema('banda', { accent: '#4338CA', soft: '#EEF2FF' })
  const partes = [['maria.lopez', 'usuario', '#4338CA'], ['@', '', '#6B7280'], ['empresa', 'dominio', '#0D9488'], ['.com.mx', 'extensión', '#B45309']]
  let x = M + 20
  let s = ''
  partes.forEach(([t, n, c]) => {
    const w = t.length * 19 + 20
    if (n) s += rect(x, 190, w, 70, { rx: 12, fill: '#FFFFFF', stroke: c, sw: 3 })
    s += T.tx(x + w / 2, 236, t, { size: 30, weight: 700, anchor: 'middle', fill: c })
    if (n) s += T.tx(x + w / 2, 286, n, { size: 15, anchor: 'middle', fill: T.muted })
    x += w + 6
  })
  const checks = [['Formato', 'Una sola @, sin espacios ni caracteres prohibidos, con extensión.', true], ['Errores típicos', 'gmial.com, hotmial.com, .con en lugar de .com.', true], ['Dominio con correo', 'Consulta los registros MX: ¿ese dominio puede recibir correo?', true], ['El buzón existe', 'Ningún validador web puede confirmarlo sin enviar un correo.', false]]
  checks.forEach(([t, d, ok], i) => {
    const y = 320 + i * 74
    s += circle(M + 18, y + 22, 16, { fill: ok ? '#16A34A' : '#9CA3AF' }) + T.tx(M + 18, y + 29, ok ? '✓' : '?', { size: 18, weight: 700, anchor: 'middle', fill: '#FFF' })
    s += T.tx(M + 48, y + 24, t, { size: 20, weight: 700 })
    s += T.tx(M + 48, y + 50, d, { size: 16, fill: T.muted })
  })
  const n = T.nota(320 + 4 * 74 + 10, 'Para las búsquedas de MX se envía solo el dominio a un servicio DNS público; la dirección completa no sale de tu navegador.')
  return T.lienzo({ alto: Math.round(320 + 4 * 74 + 10 + n.h + 64), slug: 'validador-email', titulo: 'Qué comprueba un validador de correo electrónico', cuerpo: s + n.svg })
}

const pieza = (archivo, alt, fn) => ({ archivo, alt, dibujar: fn })

module.exports = [
  pieza('formulas-metabolismo-basal-comparadas', 'Comparación de las fórmulas de metabolismo basal Mifflin-St Jeor, Harris-Benedict y Katch-McArdle', tmb),
  pieza('medidas-y-rangos-grasa-corporal', 'Dónde medir cuello, cintura y cadera y rangos saludables de grasa corporal en hombres y mujeres', grasa),
  pieza('agua-diaria-segun-peso', 'Cálculo del agua diaria para una persona de 70 kg con ejercicio y calor, en vasos de 250 ml', agua),
  pieza('json-formateado-errores-comunes', 'JSON minificado frente a formateado y los errores de sintaxis más comunes', json),
  pieza('como-funciona-base64', 'Cómo se convierte la palabra Hola a Base64 paso a paso con bytes y grupos de 6 bits', base64),
  pieza('anatomia-uuid-v4-v7', 'Partes de un UUID v4 aleatorio y de un UUID v7 ordenado por tiempo', uuid),
  pieza('chuleta-expresiones-regulares', 'Chuleta de expresiones regulares con los símbolos más usados y ejemplos', regex),
  pieza('hash-sha256-efecto-avalancha', 'Hash SHA-256 de hola y Hola y longitud de MD5, SHA-1, SHA-256 y SHA-512', hash),
  pieza('origen-lorem-ipsum', 'Origen del Lorem Ipsum en Cicerón y cuánto texto de relleno usar según el elemento', lorem),
  pieza('que-comprueba-validador-email', 'Partes de una dirección de correo y qué comprueba un validador de email', email),
]
