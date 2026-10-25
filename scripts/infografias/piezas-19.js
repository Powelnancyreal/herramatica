// Infografías del lote 19 (herramientas 181 a 190).
const { rect, circle } = require('../illustrations/kit')
const { tema, W, M } = require('./piezas-4').temas

const mono = 'Consolas, monospace'

// ─────────────────────────────────────────────────────────── 181 Ideas para historias (papel sepia, fórmula)
function historias() {
  const T = tema('papel', { accent: '#92400E', soft: '#FEF3C7', bg: '#FBF6EC' })
  const piezas = [['Protagonista', 'una astronauta que despierta 300 años tarde', '#FDE68A'], ['Lugar', 'una ciudad sumergida bajo el lago de Texcoco', '#BFDBFE'], ['Conflicto', 'alguien borra los recuerdos de todo el pueblo', '#FBCFE8'], ['Giro', 'el narrador ha estado mintiendo desde el principio', '#BBF7D0']]
  let s = T.tx(M, 188, 'Una historia en cuatro piezas', { size: 21, weight: 700, family: T.titulo })
  piezas.forEach(([a, b, c], i) => {
    const y = 212 + i * 92
    s += rect(M, y, W - 2 * M, 78, { rx: 14, fill: c })
    s += T.tx(M + 20, y + 32, a, { size: 15, weight: 700, fill: T.muted })
    s += T.tx(M + 20, y + 60, `«${b}»`, { size: 20, family: T.titulo })
    if (i < 3) s += T.tx(W / 2, y + 88, '+', { size: 22, weight: 700, anchor: 'middle', fill: T.accent })
  })
  const ty = 212 + 4 * 92 + 26
  s += T.tx(M, ty, 'Seis géneros', { size: 18, weight: 700, family: T.titulo })
  const g = ['Fantasía', 'Misterio', 'Ciencia ficción', 'Terror', 'Romance', 'Aventura']
  let x = M
  g.forEach((t) => { const w = t.length * 8.6 + 26; s += rect(x, ty + 16, w, 38, { rx: 19, fill: '#FFFFFF', stroke: T.line, sw: 1.5 }) + T.tx(x + w / 2, ty + 41, t, { size: 15, anchor: 'middle' }); x += w + 8 })
  const n = T.nota(ty + 92, 'Si una pieza no te convence, cámbiala por otra y conserva las demás: muchas buenas historias nacen de una combinación rara.')
  return T.lienzo({ alto: Math.round(ty + 92 + n.h + 60), slug: 'ideas-para-historias', titulo: 'La fórmula detrás de cada idea para una historia', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 182 Hashtags (banda rosa, pirámide)
function hashtags() {
  const T = tema('banda', { accent: '#DB2777', soft: '#FDF2F8' })
  const niveles = [['Masivos', '#comida', 'millones de publicaciones: tu foto se pierde en minutos', 360], ['Temáticos', '#tacos  #comidamexicana', 'compites con menos y llegas a interesados', 520], ['De nicho', '#tacosalpastor  #taqueria', 'público pequeño pero muy afín', 640], ['Locales', '#comidacdmx  #tacosguadalajara', 'gente que puede visitarte', W - 2 * M]]
  let s = ''
  niveles.forEach(([a, b, c, w], i) => {
    const y = 190 + i * 96
    const x = (W - w) / 2
    s += rect(x, y, w, 84, { rx: 12, fill: i === 0 ? '#FBCFE8' : i === 1 ? '#F9A8D4' : i === 2 ? '#F472B6' : T.accent })
    s += T.tx(W / 2, y + 30, `${a}: ${b}`, { size: 18, weight: 700, anchor: 'middle', fill: i > 1 ? '#FFFFFF' : '#500724' })
    s += T.tx(W / 2, y + 58, c, { size: 14, anchor: 'middle', fill: i > 1 ? '#FFFFFF' : '#831843' })
  })
  const ty = 190 + 4 * 96 + 20
  s += rect(M, ty, W - 2 * M, 96, { rx: 12, fill: T.soft })
  s += T.tx(M + 18, ty + 32, 'Una mezcla que funciona', { size: 17, weight: 700, fill: T.accent })
  s += T.tx(M + 18, ty + 60, '1 o 2 masivos + 2 o 3 temáticos + 2 de nicho + 1 local + el de tu marca', { size: 16 })
  s += T.tx(M + 18, ty + 82, 'Sin acentos ni espacios: #comidamexicana, no #comida mexicana.', { size: 14, fill: '#6B7280' })
  return T.lienzo({ alto: ty + 96 + 72, slug: 'generador-hashtags', titulo: 'Los cuatro tipos de hashtag que conviene mezclar', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 183 Bio de Instagram (pastel lila, maqueta de perfil)
function bio() {
  const T = tema('pastel', { accent: '#7C3AED', soft: '#EDE9FE', bg: '#FAF8FF', ink: '#2E1065', line: '#DDD6FE' })
  const px = M
  const pw = 420
  let s = rect(px, 180, pw, 400, { rx: 24, fill: '#FFFFFF', stroke: T.line, sw: 2 })
  s += circle(px + 70, 250, 42, { fill: '#C4B5FD' })
  ;[['128', 'publicaciones'], ['4.320', 'seguidores'], ['310', 'seguidos']].forEach(([a, b], i) => { s += T.tx(px + 170 + i * 82, 246, a, { size: 18, weight: 700, anchor: 'middle' }) + T.tx(px + 170 + i * 82, 266, b, { size: 11, anchor: 'middle', fill: T.muted }) })
  const lineas = [['Mariana Ríos | Fotografía', 700, '#111827', 'nombre'], ['📷 Fotógrafa de bodas y XV años', 400, '#111827', 'qué haces'], ['📍 Guadalajara · Viajo a todo México', 400, '#111827', 'dónde'], ['✨ +200 bodas fotografiadas', 400, '#111827', 'prueba'], ['👇 Agenda tu sesión', 400, '#111827', 'acción'], ['marianarios.mx/agenda', 700, '#1D4ED8', 'enlace']]
  const cols = ['#7C3AED', '#2563EB', '#059669', '#D97706', '#DB2777', '#1D4ED8']
  lineas.forEach(([t, w, c], i) => {
    const y = 330 + i * 38
    s += T.tx(px + 28, y, t, { size: 16, weight: w, fill: c })
  })
  const lx = px + pw + 30
  lineas.forEach(([, , , e], i) => {
    const y = 330 + i * 38
    s += `<line x1="${px + pw - 10}" y1="${y - 6}" x2="${lx - 6}" y2="${y - 6}" stroke="${cols[i]}" stroke-width="2" stroke-dasharray="4 3"/>`
    s += rect(lx, y - 22, W - M - lx, 30, { rx: 8, fill: T.soft }) + T.tx(lx + 12, y - 2, e, { size: 14, weight: 700, fill: cols[i] })
  })
  const n = T.nota(612, 'La bio admite 150 caracteres: el nombre y el enlace no cuentan, así que úsalos para palabras clave y para llevar a tu web.')
  return T.lienzo({ alto: Math.round(612 + n.h + 60), slug: 'generador-bio-instagram', titulo: 'Las partes de una bio de Instagram que convierte', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 184 Firma de email (papel blanco, maqueta de correo)
function firma() {
  const T = tema('papel', { accent: '#256BC0', soft: '#F3F4F6', bg: '#F9FAFB', line: '#E5E7EB' })
  let s = rect(M, 176, W - 2 * M, 340, { rx: 14, fill: '#FFFFFF', stroke: T.line, sw: 2 })
  s += rect(M, 176, W - 2 * M, 44, { rx: 14, fill: '#F3F4F6' }) + rect(M, 204, W - 2 * M, 16, { fill: '#F3F4F6' })
  ;['#F87171', '#FBBF24', '#34D399'].forEach((c, i) => { s += circle(M + 24 + i * 22, 198, 7, { fill: c }) })
  s += T.tx(M + 24, 256, 'Hola, Andrés:', { size: 16, fill: '#374151' })
  s += T.tx(M + 24, 284, 'Te comparto la propuesta revisada. Quedo atenta a tus comentarios.', { size: 16, fill: '#374151' })
  s += T.tx(M + 24, 312, 'Saludos,', { size: 16, fill: '#374151' })
  const fy = 350
  s += `<line x1="${M + 24}" y1="${fy}" x2="${W - M - 24}" y2="${fy}" stroke="${T.line}" stroke-width="1.5"/>`
  s += circle(M + 70, fy + 70, 42, { fill: '#BFDBFE' }) + T.tx(M + 70, fy + 78, 'LM', { size: 22, weight: 700, anchor: 'middle', fill: T.accent })
  s += `<line x1="${M + 130}" y1="${fy + 26}" x2="${M + 130}" y2="${fy + 122}" stroke="${T.accent}" stroke-width="3"/>`
  const fx = M + 148
  s += T.tx(fx, fy + 44, 'Laura Méndez', { size: 21, weight: 700, fill: '#111827' })
  s += T.tx(fx, fy + 68, 'Directora comercial · Grupo Horizonte', { size: 15, fill: '#4B5563' })
  s += T.tx(fx, fy + 94, '+52 55 1234 5678  ·  www.empresa.com', { size: 14, fill: T.accent })
  ;['in', 'IG', 'X'].forEach((t, i) => { s += rect(fx + i * 40, fy + 108, 32, 26, { rx: 6, fill: T.accent }) + T.tx(fx + 16 + i * 40, fy + 126, t, { size: 13, weight: 700, anchor: 'middle', fill: '#FFFFFF' }) })
  const ty = 560
  const reglas = [['Máximo 4 o 5 líneas', 'nombre, puesto, empresa y un solo teléfono'], ['Foto o logo alojados en internet', 'los adjuntos no se ven en muchos correos'], ['Un solo color de acento', 'el de tu marca'], ['Sin frases largas ni avisos legales eternos', 'se leen en el celular']]
  reglas.forEach(([a, b], i) => {
    const y = ty + i * 40
    s += T.tx(M, y, `✓ ${a}`, { size: 16, weight: 700, fill: '#111827' })
    s += T.tx(W - M, y, b, { size: 14, anchor: 'end', fill: T.muted })
  })
  return T.lienzo({ alto: ty + 4 * 40 + 50, slug: 'generador-firma-email', titulo: 'Cómo se ve una firma de correo profesional', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 185 Eslóganes (oscuro ámbar, fórmulas)
function esloganes() {
  const T = tema('oscuro', { accent: '#FBBF24', bg: '#17120A', soft: '#261D10', line: '#3D2F17' })
  const tipos = [['Beneficio', 'Despierta con sabor de verdad.', 'Dice qué ganas.'], ['Promesa', 'Tu café, en 10 minutos o es gratis.', 'Compromiso medible.'], ['Origen', 'Café de Veracruz, tostado esta semana.', 'Lo que te hace distinto.'], ['Rima', 'Si es de Café Lumbre, es costumbre.', 'Fácil de recordar.'], ['Invitación', 'Haz una pausa. Tómate un Lumbre.', 'Un verbo en imperativo.']]
  let s = T.tx(M, 186, 'Cinco fórmulas para una cafetería ficticia', { size: 19, weight: 700 })
  tipos.forEach(([a, b, c], i) => {
    const y = 208 + i * 86
    s += rect(M, y, W - 2 * M, 74, { rx: 12, fill: T.soft, stroke: T.line, sw: 1.5 })
    s += rect(M, y, 8, 74, { rx: 4, fill: T.accent })
    s += T.tx(M + 24, y + 28, a, { size: 15, weight: 700, fill: T.accent })
    s += T.tx(W - M - 18, y + 28, c, { size: 13, anchor: 'end', fill: T.muted })
    s += T.tx(M + 24, y + 58, `«${b}»`, { size: 21, weight: 700 })
  })
  const n = T.nota(208 + 5 * 86 + 16, 'Lee tus favoritos en voz alta: si se traban o pasan de ocho palabras, recórtalos.')
  return T.lienzo({ alto: Math.round(208 + 5 * 86 + 16 + n.h + 60), slug: 'generador-esloganes', titulo: 'Tipos de eslogan con ejemplos', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 186 UTM (terminal, URL coloreada)
function utm() {
  const T = tema('terminal', { accent: '#FBBF24' })
  const partes = [['https://tienda.mx/ofertas', T.ink], ['?utm_source=facebook', '#60A5FA'], ['&utm_medium=social', '#34D399'], ['&utm_campaign=buen_fin_2026', '#F472B6'], ['&utm_content=video_15s', '#FBBF24']]
  let s = T.tx(M, 182, '$ enlace', { size: 20, fill: '#34D399' })
  partes.forEach(([t, c], i) => { s += T.tx(M + (i ? 24 : 0), 220 + i * 30, t, { size: 19, family: mono, fill: c }) })
  const ty = 400
  const filas = [['utm_source', 'quién envía la visita', 'facebook, google, newsletter', '#60A5FA'], ['utm_medium', 'el tipo de canal', 'social, cpc, email', '#34D399'], ['utm_campaign', 'la campaña', 'buen_fin_2026', '#F472B6'], ['utm_term', 'la palabra clave pagada (opcional)', 'zapatos_running', '#A78BFA'], ['utm_content', 'qué anuncio o enlace (opcional)', 'video_15s, banner_azul', '#FBBF24']]
  filas.forEach(([a, b, c, col], i) => {
    const y = ty + i * 56
    s += rect(M, y, W - 2 * M, 48, { rx: 8, fill: T.soft })
    s += T.tx(M + 14, y + 30, a, { size: 17, weight: 700, fill: col, family: mono })
    s += T.tx(M + 190, y + 21, b, { size: 15 })
    s += T.tx(M + 190, y + 40, `# ${c}`, { size: 13, fill: T.muted, family: mono })
  })
  const n = T.nota(ty + 5 * 56 + 20, '// usa siempre minúsculas y guiones bajos: Facebook y facebook aparecen como dos fuentes distintas en Analytics.')
  return T.lienzo({ alto: Math.round(ty + 5 * 56 + 20 + n.h + 60), slug: 'generador-utm', titulo: 'Qué significa cada parámetro UTM', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 187 Markdown (plano, sintaxis → resultado)
function markdown() {
  const T = tema('plano', { accent: '#A7F3D0', font: 'Segoe UI, Arial, sans-serif' })
  const filas = [['# Título', 'Título', 'h1', { size: 24, weight: 700 }], ['## Subtítulo', 'Subtítulo', 'h2', { size: 20, weight: 700 }], ['**negrita**', 'negrita', 'strong', { size: 17, weight: 700 }], ['*cursiva*', 'cursiva', 'em', { size: 17, style: 'italic' }], ['- elemento', '• elemento', 'ul / li', { size: 17 }], ['1. paso', '1. paso', 'ol / li', { size: 17 }], ['[texto](https://…)', 'texto', 'a', { size: 17, fill: '#93C5FD' }], ['`código`', 'código', 'code', { size: 17, family: mono }], ['> cita', '│ cita', 'blockquote', { size: 17 }]]
  const cw = (W - 2 * M - 120) / 2
  let s = T.tx(M, 188, 'Escribes', { size: 17, weight: 700, fill: T.accent }) + T.tx(M + cw + 20, 188, 'Se ve', { size: 17, weight: 700, fill: T.accent }) + T.tx(W - M, 188, 'Etiqueta HTML', { size: 15, weight: 700, anchor: 'end', fill: T.accent })
  filas.forEach(([a, b, c, est], i) => {
    const y = 204 + i * 50
    s += rect(M, y, W - 2 * M, 42, { rx: 8, fill: T.soft, stroke: T.line, sw: 1 })
    s += T.tx(M + 12, y + 28, a, { size: 16, family: mono, fill: '#FDE68A' })
    const extra = est.style ? ` font-style="${est.style}"` : ''
    s += T.tx(M + cw + 20, y + 28, b, { ...est, fill: est.fill || '#FFFFFF' }).replace('<text ', `<text${extra} `)
    s += T.tx(W - M - 12, y + 28, `<${c}>`, { size: 14, anchor: 'end', fill: T.muted, family: mono })
  })
  const n = T.nota(204 + 9 * 50 + 16, 'Para separar párrafos deja una línea en blanco: un solo salto de línea no basta.')
  return T.lienzo({ alto: Math.round(204 + 9 * 50 + 16 + n.h + 56), slug: 'markdown-a-html', titulo: 'Chuleta de Markdown y su HTML', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 188 Paro (banda azul, línea temporal)
function paro() {
  const T = tema('banda', { accent: '#1D4ED8', soft: '#EFF6FF' })
  let s = T.tx(M, 190, 'Base reguladora de 1.800 €/mes y 2 años cotizados → 240 días de paro', { size: 17, weight: 700 })
  const x0 = M
  const ww = W - 2 * M
  const seg = [[180, '70 %', 'días 1 a 180', '1.225 €*', '#1D4ED8'], [60, '60 %', 'días 181 a 240', '1.080 €', '#60A5FA']]
  let x = x0
  seg.forEach(([d, p, r, v, c]) => {
    const w = (d / 240) * ww
    s += rect(x, 214, w - 6, 96, { rx: 12, fill: c })
    s += T.tx(x + 18, 250, p, { size: 26, weight: 700, fill: '#FFFFFF' })
    s += T.tx(x + 18, 280, r, { size: 15, fill: '#FFFFFF' })
    s += T.tx(x + 18, 300, `${v}/mes`, { size: 15, weight: 700, fill: '#FFFFFF' })
    x += w
  })
  s += T.tx(M, 336, '* El 70 % serían 1.260 €, pero sin hijos el máximo es 1.225 €.', { size: 14, fill: '#6B7280' })
  const ty = 380
  s += T.tx(M, ty, 'Límites mensuales en 2026 (IPREM 600 €)', { size: 18, weight: 700 })
  const cab = ['', 'Mínimo', 'Máximo']
  const filas = [['Sin hijos', '560 €', '1.225 €'], ['1 hijo', '749 €', '1.400 €'], ['2 o más hijos', '749 €', '1.575 €']]
  const cx = [M, M + 330, M + 520]
  cab.forEach((c, i) => { s += T.tx(cx[i], ty + 36, c, { size: 15, weight: 700, fill: '#6B7280' }) })
  filas.forEach((f, i) => {
    const y = ty + 50 + i * 46
    s += rect(M - 8, y, W - 2 * M + 16, 40, { rx: 8, fill: i % 2 ? '#FFFFFF' : T.soft })
    f.forEach((v, k) => { s += T.tx(cx[k], y + 27, v, { size: 17, weight: k ? 700 : 400, fill: k ? T.accent : '#111827' }) })
  })
  const dy = ty + 50 + 3 * 46 + 30
  s += T.tx(M, dy, 'Duración según lo cotizado', { size: 18, weight: 700 })
  const dur = [['360 días', '120'], ['720', '240'], ['1.080', '360'], ['1.440', '480'], ['1.800', '600'], ['2.160+', '720']]
  const dw = (W - 2 * M - 50) / 6
  dur.forEach(([a, b], i) => {
    const xx = M + i * (dw + 10)
    s += rect(xx, dy + 14, dw, 70, { rx: 10, fill: T.soft })
    s += T.tx(xx + dw / 2, dy + 40, a, { size: 13, anchor: 'middle', fill: '#6B7280' })
    s += T.tx(xx + dw / 2, dy + 68, `${b} días`, { size: 16, weight: 700, anchor: 'middle', fill: T.accent })
  })
  return T.lienzo({ alto: dy + 84 + 66, slug: 'calcular-paro', titulo: 'Cuánto se cobra de paro mes a mes en 2026', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 189 Cuota de autónomos (papel, barras por tramos)
function autonomos() {
  const T = tema('papel', { accent: '#B45309', soft: '#FEF3C7' })
  const tramos = [['≤ 670 €', 205.88], ['670–900', 226.47], ['900–1.167', 267.65], ['1.167–1.300', 299.56], ['1.300–1.700', 302.65], ['1.700–1.850', 360.29], ['1.850–2.030', 380.88], ['2.030–2.330', 401.47], ['2.330–2.760', 427.21], ['2.760–3.190', 452.94], ['3.190–3.620', 478.68], ['3.620–4.050', 504.41], ['4.050–6.000', 545.59], ['> 6.000', 607.35]]
  let s = T.tx(M, 186, 'Cuota mínima mensual según tus rendimientos netos', { size: 19, weight: 700, family: T.titulo })
  const maxW = W - 2 * M - 220
  tramos.forEach(([a, v], i) => {
    const y = 206 + i * 36
    s += T.tx(M + 130, y + 21, a, { size: 14, anchor: 'end', fill: T.muted })
    s += rect(M + 145, y + 4, (v / 607.35) * maxW, 24, { rx: 5, fill: i < 3 ? '#FCD34D' : T.accent })
    s += T.tx(M + 155 + (v / 607.35) * maxW, y + 22, `${v.toFixed(2).replace('.', ',')} €`, { size: 14, weight: 700 })
  })
  const ly = 206 + tramos.length * 36 + 10
  s += rect(M + 145, ly, 18, 14, { rx: 3, fill: '#FCD34D' }) + T.tx(M + 170, ly + 12, 'tabla reducida', { size: 13, fill: T.muted })
  s += rect(M + 310, ly, 18, 14, { rx: 3, fill: T.accent }) + T.tx(M + 335, ly + 12, 'tabla general', { size: 13, fill: T.muted })
  const n = T.nota(ly + 44, 'Base mínima de cada tramo × 31,5 %. Los nuevos autónomos pagan 80 € al mes durante 12 meses con la tarifa plana.')
  return T.lienzo({ alto: Math.round(ly + 44 + n.h + 60), slug: 'cuota-autonomo', titulo: 'Cuota de autónomos por tramos en 2026', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 190 Plusvalía (pastel verde, dos métodos)
function plusvalia() {
  const T = tema('pastel', { accent: '#047857', soft: '#D1FAE5', bg: '#F6FFFB', ink: '#022C22', line: '#A7F3D0' })
  let s = T.tx(M, 184, 'Piso comprado por 150.000 € y vendido por 200.000 € a los 10 años', { size: 17, weight: 700 })
  s += T.tx(M, 210, 'Valor catastral: 100.000 €, de los que 40.000 € son suelo (40 %) · tipo municipal 30 %', { size: 14, fill: T.muted })
  const cw = (W - 2 * M - 20) / 2
  const metodo = (x, tit, l1, l2, base, cuota, gana) => rect(x, 236, cw, 230, { rx: 16, fill: gana ? T.soft : '#FFFFFF', stroke: gana ? T.accent : T.line, sw: gana ? 3 : 2 }) + T.tx(x + 20, 272, tit, { size: 19, weight: 700, fill: T.accent }) + T.tx(x + 20, 306, l1, { size: 15 }) + T.tx(x + 20, 330, l2, { size: 15 }) + T.tx(x + 20, 370, `Base: ${base}`, { size: 17, weight: 700 }) + T.tx(x + 20, 420, cuota, { size: 34, weight: 700, fill: gana ? T.accent : T.muted }) + (gana ? T.tx(x + 20, 450, '← pagas este, el menor', { size: 14, weight: 700, fill: T.accent }) : '')
  s += metodo(M, 'Método objetivo', 'Suelo catastral × coeficiente', '40.000 × 0,12 (10 años)', '4.800 €', '1.440 €', true)
  s += metodo(M + cw + 20, 'Método real', 'Ganancia × % de suelo', '50.000 × 40 %', '20.000 €', '6.000 €', false)
  const gy = 510
  s += T.tx(M, gy, 'Coeficientes máximos según los años', { size: 17, weight: 700 })
  const co = [0.15, 0.15, 0.14, 0.15, 0.16, 0.18, 0.19, 0.2, 0.19, 0.15, 0.12, 0.1, 0.09, 0.09, 0.09, 0.09, 0.1, 0.13, 0.17, 0.23, 0.4]
  const bw = (W - 2 * M) / co.length
  const base = gy + 160
  co.forEach((c, i) => {
    const h = (c / 0.4) * 120
    s += rect(M + i * bw + 2, base - h, bw - 4, h, { rx: 4, fill: i === 10 ? T.accent : '#6EE7B7' })
    if (i % 5 === 0 || i === 20) s += T.tx(M + i * bw + bw / 2, base + 20, i === 0 ? '<1' : i === 20 ? '20+' : String(i), { size: 13, anchor: 'middle', fill: T.muted })
  })
  s += T.tx(M + 10 * bw + bw / 2, base - (0.12 / 0.4) * 120 - 8, '', { size: 12 })
  const n = T.nota(base + 64, 'Si vendes por menos de lo que compraste, no hay plusvalía que pagar. El ayuntamiento puede fijar coeficientes y tipo más bajos.')
  return T.lienzo({ alto: Math.round(base + 64 + n.h + 60), slug: 'calcular-plusvalia', titulo: 'Plusvalía municipal: método objetivo o real', cuerpo: s + n.svg })
}

const pieza = (archivo, alt, fn) => ({ archivo, alt, dibujar: fn })

module.exports = [
  pieza('formula-idea-para-historia', 'Una idea para una historia construida con protagonista, lugar, conflicto y giro, y los seis géneros disponibles', historias),
  pieza('tipos-de-hashtag-piramide', 'Pirámide de hashtags masivos, temáticos, de nicho y locales con una mezcla recomendada', hashtags),
  pieza('partes-bio-instagram', 'Maqueta de una bio de Instagram con sus partes: nombre, qué haces, ubicación, prueba social, llamada a la acción y enlace', bio),
  pieza('ejemplo-firma-correo-profesional', 'Ejemplo de firma de correo electrónico profesional con foto, datos de contacto y redes', firma),
  pieza('formulas-eslogan-ejemplos', 'Cinco tipos de eslogan con ejemplos para una cafetería ficticia', esloganes),
  pieza('parametros-utm-explicados', 'Un enlace con parámetros UTM coloreados y qué significa cada parámetro', utm),
  pieza('chuleta-markdown-html', 'Tabla de sintaxis Markdown con su resultado y la etiqueta HTML que genera', markdown),
  pieza('calculo-paro-2026-tramos', 'Ejemplo de prestación por desempleo con los porcentajes del 70 y 60 %, límites de 2026 y duración según días cotizados', paro),
  pieza('cuota-autonomos-tramos-2026', 'Cuota mínima mensual de autónomos en 2026 para cada tramo de rendimientos netos', autonomos),
  pieza('plusvalia-municipal-metodos', 'Comparación del método objetivo y el método real de la plusvalía municipal y coeficientes máximos por años', plusvalia),
]
