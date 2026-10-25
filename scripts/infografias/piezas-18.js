// Infografías del lote 18 (herramientas 171 a 180).
const { rect, circle } = require('../illustrations/kit')
const { tema, W, M } = require('./piezas-4').temas

const mono = 'Consolas, monospace'

// ─────────────────────────────────────────────────────────── 171 Selector de color (papel blanco, un color en 5 formatos)
function selectorColor() {
  const T = tema('papel', { accent: '#2563EB', soft: '#EFF6FF', bg: '#FFFFFF', line: '#E5E7EB' })
  let s = rect(M, 180, 230, 300, { rx: 18, fill: '#2563EB' })
  s += T.tx(M + 115, 340, '#2563EB', { size: 26, weight: 700, anchor: 'middle', fill: '#FFFFFF', family: mono })
  const fmts = [['HEX', '#2563EB', 'web y CSS'], ['RGB', 'rgb(37, 99, 235)', 'pantallas: rojo, verde, azul de 0 a 255'], ['HSL', 'hsl(221, 83%, 53%)', 'tono, saturación y luminosidad'], ['HSV', 'hsv(221, 84%, 92%)', 'el modelo de Photoshop y Figma'], ['CMYK', 'cmyk(84%, 58%, 0%, 8%)', 'aproximado para imprenta']]
  const x = M + 256
  fmts.forEach(([a, b, c], i) => {
    const y = 180 + i * 62
    s += rect(x, y, W - M - x, 52, { rx: 10, fill: T.soft })
    s += T.tx(x + 14, y + 22, a, { size: 14, weight: 700, fill: T.accent })
    s += T.tx(x + 76, y + 22, b, { size: 17, weight: 700, family: mono })
    s += T.tx(x + 76, y + 42, c, { size: 13, fill: T.muted })
  })
  const ty = 520
  s += T.tx(M, ty, 'Escala de tonos del mismo color', { size: 18, weight: 700, family: T.titulo })
  const tonos = ['#E8EEFD', '#B9CDF9', '#8AABF4', '#5C8AF0', '#2D69EC', '#134FD2', '#0F3DA3', '#0B2C75', '#061A46']
  const w = (W - 2 * M) / tonos.length
  tonos.forEach((c, i) => { s += rect(M + i * w, ty + 16, w - 4, 60, { rx: 8, fill: c }) })
  const cy = ty + 112
  s += rect(M, cy, (W - 2 * M) / 2 - 8, 64, { rx: 12, fill: '#2563EB' }) + T.tx(M + 18, cy + 40, 'Blanco encima: 5,17:1 ✓', { size: 18, weight: 700, fill: '#FFFFFF' })
  s += rect(M + (W - 2 * M) / 2 + 8, cy, (W - 2 * M) / 2 - 8, 64, { rx: 12, fill: '#2563EB' }) + T.tx(M + (W - 2 * M) / 2 + 26, cy + 40, 'Negro encima: 4,06:1 ✗', { size: 18, weight: 700, fill: '#000000' })
  const n = T.nota(cy + 96, 'Los dos textos se leen, pero solo el blanco supera el 4,5:1 que pide WCAG para texto normal.')
  return T.lienzo({ alto: Math.round(cy + 96 + n.h + 60), slug: 'selector-de-color', titulo: 'Un mismo azul escrito en cinco formatos', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 172 HEX a RGB (plano, aritmética hexadecimal)
function hexRgb() {
  const T = tema('plano', { accent: '#FDE68A', font: 'Segoe UI, Arial, sans-serif' })
  const pares = [['25', '2 × 16 + 5', '37', '#F87171'], ['63', '6 × 16 + 3', '99', '#4ADE80'], ['EB', '14 × 16 + 11', '235', '#60A5FA']]
  let s = T.tx(W / 2, 220, '#  2 5  6 3  E B', { size: 54, weight: 700, anchor: 'middle', fill: '#FFFFFF', family: mono })
  const cw = (W - 2 * M - 32) / 3
  pares.forEach(([h, op, d, c], i) => {
    const x = M + i * (cw + 16)
    s += rect(x, 256, cw, 190, { rx: 12, fill: T.soft, stroke: c, sw: 2 })
    s += T.tx(x + cw / 2, 296, ['Rojo', 'Verde', 'Azul'][i], { size: 17, weight: 700, anchor: 'middle', fill: c })
    s += T.tx(x + cw / 2, 344, h, { size: 34, weight: 700, anchor: 'middle', family: mono })
    s += T.tx(x + cw / 2, 382, op, { size: 16, anchor: 'middle', fill: T.muted, family: mono })
    s += T.tx(x + cw / 2, 426, `= ${d}`, { size: 28, weight: 700, anchor: 'middle', fill: c, family: mono })
  })
  s += T.tx(W / 2, 494, 'rgb(37, 99, 235)', { size: 30, weight: 700, anchor: 'middle', fill: T.accent, family: mono })
  const ty = 540
  s += T.tx(M, ty, 'Letras de la A a la F', { size: 18, weight: 700, fill: '#FFFFFF' })
  const letras = [['A', 10], ['B', 11], ['C', 12], ['D', 13], ['E', 14], ['F', 15]]
  const lw = (W - 2 * M - 50) / 6
  letras.forEach(([l, v], i) => {
    const x = M + i * (lw + 10)
    s += rect(x, ty + 16, lw, 60, { rx: 10, fill: T.soft, stroke: T.line, sw: 1.5 })
    s += T.tx(x + lw / 2, ty + 54, `${l} = ${v}`, { size: 19, weight: 700, anchor: 'middle', family: mono })
  })
  const n = T.nota(ty + 112, 'Cada par va de 00 (0) a FF (255): 256 × 256 × 256 = 16.777.216 colores posibles.')
  return T.lienzo({ alto: Math.round(ty + 112 + n.h + 56), slug: 'conversor-hex-rgb', titulo: 'Cómo un código HEX se convierte en RGB', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 173 Imagen a Base64 (oscuro, data URI)
function base64() {
  const T = tema('oscuro', { accent: '#38BDF8', bg: '#0A1020', soft: '#121C33', line: '#22314F' })
  let s = T.tx(M, 184, 'Anatomía de una imagen en Base64', { size: 19, weight: 700 })
  const partes = [['data:', '#94A3B8'], ['image/png', '#F472B6'], [';base64,', '#FBBF24'], ['iVBORw0KGgoAAAANSUhEUg…', T.accent]]
  let x = M
  partes.forEach(([t, c]) => { s += T.tx(x, 232, t, { size: 20, family: mono, fill: c }); x += t.length * 11.1 })
  const etq = [['esquema', '#94A3B8'], ['tipo de archivo', '#F472B6'], ['codificación', '#FBBF24'], ['los bytes de la imagen como texto', T.accent]]
  etq.forEach(([t, c], i) => { s += rect(M, 258 + i * 34, 14, 14, { rx: 3, fill: c }) + T.tx(M + 24, 270 + i * 34, t, { size: 15, fill: T.muted }) })
  const by = 420
  s += T.tx(M, by, 'Por qué pesa un 33 % más', { size: 19, weight: 700 })
  const cajas = (y, n, w, col, txt) => { let o = ''; for (let i = 0; i < n; i++) o += rect(M + i * (w + 8), y, w, 46, { rx: 8, fill: col }) + T.tx(M + i * (w + 8) + w / 2, y + 30, txt[i], { size: 16, weight: 700, anchor: 'middle', family: mono, fill: '#0A1020' }); return o }
  s += cajas(by + 20, 3, 140, '#A78BFA', ['byte 1', 'byte 2', 'byte 3'])
  s += T.tx(M + 3 * 148 + 10, by + 50, '3 bytes', { size: 16, fill: T.muted })
  s += cajas(by + 84, 4, 101, T.accent, ['i', 'V', 'B', 'O'])
  s += T.tx(M + 4 * 109 + 10, by + 114, '→ 4 caracteres', { size: 16, fill: T.muted })
  const ty = by + 170
  const ej = [['Ícono de 2 KB', '≈ 2,7 KB', 'buena idea: ahorra una petición'], ['Foto de 300 KB', '≈ 400 KB', 'mala idea: no se guarda en caché aparte']]
  ej.forEach(([a, b, c], i) => {
    const y = ty + i * 66
    s += rect(M, y, W - 2 * M, 56, { rx: 10, fill: T.soft })
    s += T.tx(M + 16, y + 35, a, { size: 17, weight: 700 })
    s += T.tx(M + 230, y + 35, b, { size: 17, weight: 700, fill: T.accent, family: mono })
    s += T.tx(W - M - 16, y + 35, c, { size: 14, anchor: 'end', fill: i ? '#FCA5A5' : '#86EFAC' })
  })
  return T.lienzo({ alto: ty + 2 * 66 + 60, slug: 'imagen-a-base64', titulo: 'Qué hay dentro de una imagen en Base64', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 174 Nombres de bebé (pastel rosa, orígenes)
function nombresBebe() {
  const T = tema('pastel', { accent: '#BE185D', soft: '#FCE7F3', bg: '#FFF8FB', ink: '#4A0D2B', line: '#FBCFE8' })
  const datos = [['Latín', 50, 'Valeria, Lucía, Emiliano'], ['Hebreo', 27, 'Santiago, Mateo'], ['Griego', 22, 'Sofía, Sebastián'], ['Germánico', 11, 'Leonardo'], ['Náhuatl', 4, 'Xóchitl, Cuauhtémoc'], ['Otros 10 orígenes', 19, 'Itzel (maya), Iker (vasco)']]
  let s = T.tx(M, 184, 'De dónde vienen los 133 nombres del generador', { size: 19, weight: 700 })
  const maxW = W - 2 * M - 210
  datos.forEach(([o, n, ej], i) => {
    const y = 206 + i * 66
    s += T.tx(M, y + 26, o, { size: 17, weight: 700 })
    s += rect(M + 190, y + 6, (n / 50) * maxW, 30, { rx: 15, fill: i === 0 ? T.accent : '#F9A8D4' })
    s += T.tx(M + 190 + (n / 50) * maxW + 10, y + 28, String(n), { size: 17, weight: 700, fill: T.accent })
    s += T.tx(M + 190, y + 56, ej, { size: 14, fill: T.muted })
  })
  const ty = 206 + 6 * 66 + 24
  const sx = [['65', 'de niña'], ['63', 'de niño'], ['5', 'unisex']]
  const cw = (W - 2 * M - 24) / 3
  sx.forEach(([a, b], i) => {
    const x = M + i * (cw + 12)
    s += rect(x, ty, cw, 84, { rx: 14, fill: T.soft })
    s += T.tx(x + cw / 2, ty + 42, a, { size: 32, weight: 700, anchor: 'middle', fill: T.accent })
    s += T.tx(x + cw / 2, ty + 68, b, { size: 15, anchor: 'middle', fill: T.muted })
  })
  return T.lienzo({ alto: ty + 84 + 76, slug: 'generador-nombres-bebe', titulo: 'El origen de los nombres para bebé', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 175 Apodos (cuaderno, hipocorísticos)
function apodos() {
  const T = tema('cuaderno', { accent: '#9D174D' })
  const pares = [['José', 'Pepe, Chepe', ''], ['Francisco', 'Paco, Pancho', ''], ['Guadalupe', 'Lupe, Lupita', ''], ['Ignacio', 'Nacho', ''], ['Dolores', 'Lola', ''], ['Rosario', 'Charo', ''], ['Enrique', 'Quique', ''], ['Concepción', 'Conchita', '']]
  let s = T.tx(M, 188, 'Hipocorísticos: los apodos de toda la vida', { size: 22, family: T.titulo })
  const cw = (W - 2 * M - 16) / 2
  pares.forEach(([a, b, c], i) => {
    const x = M + (i % 2) * (cw + 16)
    const y = 212 + Math.floor(i / 2) * 76
    s += rect(x, y, cw, 64, { rx: 12, fill: '#FFFFFF', stroke: '#93C5FD', sw: 1.5 })
    s += T.tx(x + 16, y + 28, a, { size: 17, fill: T.muted })
    s += T.tx(x + 16, y + 52, `→ ${b}`, { size: 21, weight: 700, family: T.titulo, fill: T.accent })
    if (c) s += T.tx(x + cw - 12, y + 28, c, { size: 11, anchor: 'end', fill: T.muted })
  })
  const ty = 212 + 4 * 76 + 40
  s += T.tx(M, ty, 'Cuatro formas de crear un apodo nuevo', { size: 20, weight: 700, family: T.titulo })
  const f = [['Acortar', 'Valentina → Vale'], ['Diminutivo', 'Sofía → Sofi, Sofita'], ['Repetir sílaba', 'Natalia → Nana'], ['Rasgo físico', 'pelo rizado → el Chino']]
  f.forEach(([a, b], i) => {
    const y = ty + 20 + i * 40
    s += T.tx(M, y + 22, `• ${a}:`, { size: 18, weight: 700 })
    s += T.tx(M + 190, y + 22, b, { size: 18, family: T.titulo })
  })
  return T.lienzo({ alto: ty + 20 + 4 * 40 + 70, slug: 'generador-apodos', titulo: 'De dónde salen los apodos en español', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 176 Nombre de empresa (banda verde azulado, ruta)
function nombreEmpresa() {
  const T = tema('banda', { accent: '#0F766E', soft: '#F0FDFA' })
  const pasos = [['1', 'Lista corta', '5 a 10 candidatos de 1 a 3 palabras, fáciles de decir y escribir.'], ['2', 'Busca en internet', 'Que no exista un negocio igual en tu ciudad o sector.'], ['3', 'Dominio y redes', 'Comprueba si están libres el .com, el .com.mx y el @usuario.'], ['4', 'Marcas registradas', 'Busca en Marcia, la base de datos del IMPI.'], ['5', 'Denominación social', 'Si vas a constituir sociedad, pide la autorización a la Secretaría de Economía.'], ['6', 'Registra la marca', 'Solicitud ante el IMPI en la clase de tus productos o servicios.']]
  let s = ''
  pasos.forEach(([n, a, b], i) => {
    const y = 184 + i * 82
    if (i < pasos.length - 1) s += `<line x1="${M + 26}" y1="${y + 52}" x2="${M + 26}" y2="${y + 82}" stroke="${T.accent}" stroke-width="3"/>`
    s += circle(M + 26, y + 26, 26, { fill: T.accent }) + T.tx(M + 26, y + 34, n, { size: 22, weight: 700, anchor: 'middle', fill: '#FFFFFF' })
    s += rect(M + 70, y, W - 2 * M - 70, 64, { rx: 12, fill: T.soft })
    s += T.tx(M + 88, y + 27, a, { size: 18, weight: 700, fill: T.accent })
    s += T.tx(M + 88, y + 51, b, { size: 15 })
  })
  const n = T.nota(184 + 6 * 82 + 10, 'Un nombre libre en el generador no está automáticamente libre para usarlo: los pasos 3 a 5 son los que lo confirman.')
  return T.lienzo({ alto: Math.round(184 + 6 * 82 + 10 + n.h + 64), slug: 'generador-nombres-empresa', titulo: 'Del nombre generado al nombre registrado', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 177 Piedra, papel, tijera, lagarto, Spock (pizarra)
function ppt() {
  const T = tema('pizarra')
  const cx = 250
  const cy = 420
  const R = 170
  const nombres = ['Piedra', 'Papel', 'Tijera', 'Lagarto', 'Spock']
  const ang = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / 5
  // orden en el círculo: piedra, spock, papel, lagarto, tijera → cada uno gana a los dos siguientes en sentido horario
  const orden = ['Tijera', 'Papel', 'Piedra', 'Lagarto', 'Spock']
  const pos = (n) => { const i = orden.indexOf(n); return [cx + R * Math.cos(ang(i)), cy + R * Math.sin(ang(i))] }
  const gana = [['Tijera', 'Papel'], ['Papel', 'Piedra'], ['Piedra', 'Lagarto'], ['Lagarto', 'Spock'], ['Spock', 'Tijera'], ['Tijera', 'Lagarto'], ['Lagarto', 'Papel'], ['Papel', 'Spock'], ['Spock', 'Piedra'], ['Piedra', 'Tijera']]
  let s = `<defs><marker id="fl177" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${T.accent}"/></marker></defs>`
  gana.forEach(([a, b], i) => {
    const [x1, y1] = pos(a)
    const [x2, y2] = pos(b)
    const d = Math.hypot(x2 - x1, y2 - y1)
    const ux = (x2 - x1) / d
    const uy = (y2 - y1) / d
    s += `<line x1="${x1 + ux * 46}" y1="${y1 + uy * 46}" x2="${x2 - ux * 50}" y2="${y2 - uy * 50}" stroke="${i < 5 ? T.accent : '#93C5FD'}" stroke-width="3" marker-end="url(#fl177)"/>`
  })
  orden.forEach((n) => {
    const [x, y] = pos(n)
    s += circle(x, y, 44, { fill: T.soft, stroke: T.line, sw: 2 }) + T.tx(x, y + 7, n, { size: 17, weight: 700, anchor: 'middle', family: T.titulo })
  })
  const tx = 470
  s += T.tx(tx, 196, 'Quién gana a quién', { size: 22, weight: 700, family: T.titulo, fill: T.accent })
  const reglas = ['Tijera corta papel', 'Papel envuelve piedra', 'Piedra aplasta lagarto', 'Lagarto envenena a Spock', 'Spock rompe tijera', 'Tijera decapita lagarto', 'Lagarto se come el papel', 'Papel desautoriza a Spock', 'Spock vaporiza piedra', 'Piedra aplasta tijera']
  reglas.forEach((r, i) => { s += T.tx(tx, 232 + i * 32, r, { size: 16 }) })
  const n = T.nota(cy + R + 70, 'Con cinco opciones, cada una gana a dos y pierde contra dos: los empates bajan de 1 de cada 3 rondas a 1 de cada 5.')
  return T.lienzo({ alto: Math.round(cy + R + 70 + n.h + 60), slug: 'piedra-papel-tijera', titulo: 'Las reglas de lagarto y Spock en un diagrama', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 178 Generador de equipos (papel crema, dos modos)
function equipos() {
  const T = tema('papel', { accent: '#15803D', soft: '#DCFCE7', bg: '#FFFDF7' })
  const persona = (x, y, c) => circle(x, y - 14, 9, { fill: c }) + rect(x - 11, y - 3, 22, 20, { rx: 8, fill: c })
  const cols = ['#2563EB', '#DC2626', '#16A34A', '#D97706']
  let s = T.tx(M, 188, '14 personas, dos formas de repartirlas', { size: 20, weight: 700, family: T.titulo })
  const bloque = (y, titulo, tams, nota) => {
    let o = T.tx(M, y, titulo, { size: 17, weight: 700, fill: T.accent })
    let x = M
    tams.forEach((t, k) => {
      const w = t * 34 + 20
      o += rect(x, y + 14, w, 64, { rx: 12, fill: '#FFFFFF', stroke: cols[k], sw: 2 })
      for (let p = 0; p < t; p++) o += persona(x + 27 + p * 34, y + 52, cols[k])
      o += T.tx(x + w / 2, y + 100, `${t} personas`, { size: 13, anchor: 'middle', fill: T.muted })
      x += w + 12
    })
    return o + T.tx(M, y + 130, nota, { size: 15, fill: T.muted })
  }
  s += bloque(230, 'Modo «número de equipos»: pides 3', [5, 5, 4], 'Si no sale exacto, unos equipos quedan con una persona más.')
  s += bloque(400, 'Modo «personas por equipo»: pides 4', [4, 4, 3, 3], '⌈14 ÷ 4⌉ = 4 equipos; las 14 personas se reparten lo más parejo posible.')
  const n = T.nota(570, 'Cada reparto baraja la lista de nuevo con el algoritmo de Fisher-Yates: todas las combinaciones tienen la misma probabilidad.')
  return T.lienzo({ alto: Math.round(570 + n.h + 60), slug: 'generador-equipos', titulo: 'Cómo reparte el generador de equipos', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 179 Tómbola (banda roja, cartón de bingo)
function tombola() {
  const T = tema('banda', { accent: '#B91C1C', soft: '#FEF2F2' })
  const letras = ['B', 'I', 'N', 'G', 'O']
  const carton = [[3, 19, 34, 48, 62], [7, 22, 41, 52, 66], [9, 25, null, 55, 70], [12, 27, 43, 58, 71], [15, 30, 45, 60, 75]]
  const c = 64
  const gx = M
  const gy = 220
  let s = ''
  letras.forEach((l, i) => { s += rect(gx + i * c, gy - 50, c - 4, 44, { rx: 8, fill: T.accent }) + T.tx(gx + i * c + c / 2 - 2, gy - 18, l, { size: 24, weight: 700, anchor: 'middle', fill: '#FFFFFF' }) })
  carton.forEach((fila, f) => fila.forEach((v, k) => {
    s += rect(gx + k * c, gy + f * c, c - 4, c - 4, { rx: 8, fill: v === null ? '#FDE68A' : '#FFFFFF', stroke: '#E5E7EB', sw: 2 })
    s += T.tx(gx + k * c + c / 2 - 2, gy + f * c + c / 2 + 7, v === null ? 'LIBRE' : String(v), { size: v === null ? 13 : 21, weight: 700, anchor: 'middle' })
  }))
  const tx = gx + 5 * c + 40
  s += T.tx(tx, gy - 18, 'Bingo de 75 bolas', { size: 20, weight: 700 })
  const rangos = [['B', '1 a 15'], ['I', '16 a 30'], ['N', '31 a 45'], ['G', '46 a 60'], ['O', '61 a 75']]
  rangos.forEach(([l, r], i) => {
    const y = gy + i * 44
    s += rect(tx, y, W - M - tx, 36, { rx: 8, fill: T.soft })
    s += T.tx(tx + 14, y + 25, l, { size: 18, weight: 700, fill: T.accent }) + T.tx(tx + 50, y + 25, r, { size: 17 })
  })
  s += T.tx(tx, gy + 5 * 44 + 30, 'Bingo de 90 bolas', { size: 20, weight: 700 })
  s += T.tx(tx, gy + 5 * 44 + 58, 'Números del 1 al 90, sin letras.', { size: 15, fill: '#6B7280' })
  s += T.tx(tx, gy + 5 * 44 + 80, 'Es el habitual en España.', { size: 15, fill: '#6B7280' })
  const n = T.nota(gy + 5 * c + 40, 'Cada columna lleva 5 números de su rango y el centro es casilla libre: 24 números por cartón.')
  return T.lienzo({ alto: Math.round(gy + 5 * c + 40 + n.h + 64), slug: 'tombola-online', titulo: 'Cómo está hecho un cartón de bingo', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 180 Verdad o reto (oscuro morado, cartas)
function verdadReto() {
  const T = tema('oscuro', { accent: '#C084FC', bg: '#140A1F', soft: '#22122F', line: '#3B2152' })
  const carta = (x, y, rot, tipo, txt, c) => `<g transform="rotate(${rot} ${x + 110} ${y + 150})">` + rect(x, y, 220, 300, { rx: 18, fill: T.soft, stroke: c, sw: 3 }) + T.tx(x + 110, y + 50, tipo, { size: 26, weight: 700, anchor: 'middle', fill: c }) + txt.map((t, i) => T.tx(x + 110, y + 120 + i * 28, t, { size: 17, anchor: 'middle' })).join('') + '</g>'
  let s = carta(M + 40, 190, -6, 'VERDAD', ['¿Qué superpoder', 'te gustaría tener', 'y por qué?'], '#60A5FA')
  s += carta(M + 300, 190, 5, 'RETO', ['Imita a un animal', 'durante 30 segundos', 'sin reírte.'], '#F472B6')
  const tx = M + 560
  s += T.tx(tx, 210, '84 cartas', { size: 30, weight: 700, fill: T.accent })
  const niveles = [['Familiar', '15 + 15'], ['Amigos', '15 + 15'], ['Pareja', '12 + 12']]
  niveles.forEach(([a, b], i) => {
    const y = 236 + i * 70
    s += rect(tx, y, W - M - tx, 58, { rx: 10, fill: T.soft })
    s += T.tx(tx + 14, y + 25, a, { size: 17, weight: 700 })
    s += T.tx(tx + 14, y + 46, `${b} cartas`, { size: 14, fill: T.muted })
  })
  const n = T.nota(530, 'No se repite ninguna carta hasta agotar las de ese nivel y tipo. Cualquiera puede pasar de turno: el juego es para divertirse, no para incomodar.')
  return T.lienzo({ alto: Math.round(530 + n.h + 60), slug: 'verdad-o-reto', titulo: 'Las cartas de verdad o reto por nivel', cuerpo: s + n.svg })
}

const pieza = (archivo, alt, fn) => ({ archivo, alt, dibujar: fn })

module.exports = [
  pieza('color-en-cinco-formatos', 'Un mismo color azul expresado en HEX, RGB, HSL, HSV y CMYK con su escala de tonos y contraste', selectorColor),
  pieza('conversion-hex-a-rgb-pares', 'Conversión de un código HEX a RGB par por par con aritmética hexadecimal', hexRgb),
  pieza('anatomia-imagen-base64', 'Partes de una data URI en Base64 y por qué el texto ocupa un tercio más que la imagen', base64),
  pieza('origen-nombres-bebe', 'Origen de los nombres para bebé del generador: latín, hebreo, griego, germánico y náhuatl', nombresBebe),
  pieza('hipocoristicos-apodos-espanol', 'Apodos tradicionales en español como Pepe, Paco o Lupe y formas de crear apodos nuevos', apodos),
  pieza('pasos-registrar-nombre-empresa', 'Seis pasos para pasar de un nombre de empresa generado a un nombre y marca registrados en México', nombreEmpresa),
  pieza('reglas-piedra-papel-tijera-lagarto-spock', 'Diagrama de quién gana a quién en piedra, papel, tijera, lagarto, Spock', ppt),
  pieza('modos-reparto-equipos', 'Reparto de 14 personas en equipos según el número de equipos o el tamaño de cada equipo', equipos),
  pieza('carton-bingo-75-bolas', 'Cartón de bingo de 75 bolas con los rangos de cada letra B-I-N-G-O y la casilla libre', tombola),
  pieza('cartas-verdad-o-reto', 'Cartas de verdad o reto de ejemplo y número de cartas por nivel familiar, amigos y pareja', verdadReto),
]
