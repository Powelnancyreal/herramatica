// Infografías del lote 13 (herramientas 121 a 130).
const { rect, circle } = require('../illustrations/kit')
const { tema, W, M, es } = require('./piezas-4').temas

// ─────────────────────────────────────────────────────────── 121 Contador de caracteres (pastel, SMS)
function caracteres() {
  const T = tema('pastel', { accent: '#0F766E', soft: '#CCFBF1', bg: '#F5FFFD', ink: '#134E4A', line: '#99F6E4' })
  const burbuja = (y, texto, info, col) => rect(M, y, W - 2 * M - 140, 70, { rx: 22, fill: col }) + T.tx(M + 22, y + 44, texto, { size: 20, fill: '#FFFFFF', weight: 700 }) + T.tx(W - M, y + 44, info, { size: 20, anchor: 'end', weight: 700, fill: T.ink })
  let s = T.tx(M, 184, 'Un SMS cambia de límite según los caracteres que uses', { size: 20, weight: 700 })
  s += burbuja(206, 'Nos vemos mañana a las 7', '160 máx.', '#14B8A6')
  s += T.tx(M, 298, 'Solo caracteres del alfabeto GSM (incluye ñ y é)', { size: 15, fill: T.muted })
  s += burbuja(320, 'Llegó el pedido: ¿cuándo pasás?', '70 máx.', '#F97316')
  s += T.tx(M, 412, 'Con á, í, ó, ú o un emoji, todo el SMS pasa a Unicode', { size: 15, fill: T.muted })
  const ty = 460
  s += T.tx(M, ty, 'Otros límites que conviene revisar', { size: 19, weight: 700 })
  const lim = [['Título para Google', '≈ 60'], ['Meta descripción', '≈ 155'], ['Publicación en X', '280'], ['Bio de Instagram', '150']]
  const cw = (W - 2 * M - 36) / 4
  lim.forEach(([a, b], i) => {
    const x = M + i * (cw + 12)
    s += rect(x, ty + 20, cw, 88, { rx: 14, fill: T.soft })
    s += T.tx(x + cw / 2, ty + 58, b, { size: 26, weight: 700, anchor: 'middle', fill: T.accent })
    s += T.tx(x + cw / 2, ty + 88, a, { size: 13, anchor: 'middle', fill: T.ink })
  })
  const n = T.nota(ty + 148, 'Los mensajes largos se dividen en partes de 153 caracteres (GSM) o 67 (Unicode). Un emoji cuenta como 2 caracteres en muchos contadores.')
  return T.lienzo({ alto: Math.round(ty + 148 + n.h + 64), slug: 'contador-caracteres', titulo: 'Por qué tu SMS se corta antes de 160 caracteres', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 122 Sorteo online (oscuro, barajado)
function sorteo() {
  const T = tema('oscuro', { accent: '#FACC15', bg: '#1A1033', soft: '#2A1B4F', line: '#3D2A6B' })
  const nombres = ['Ana', 'Luis', 'Sara', 'Pablo', 'Eva', 'Tomás']
  const fila = (y, lista, marcas, et) => {
    let o = T.tx(M, y - 12, et, { size: 15, fill: T.muted })
    const cw = (W - 2 * M - 50) / 6
    lista.forEach((n, i) => {
      const x = M + i * (cw + 10)
      const m = marcas[i]
      o += rect(x, y, cw, 56, { rx: 12, fill: m === 'g' ? T.accent : m === 's' ? '#A78BFA' : T.soft })
      o += T.tx(x + cw / 2, y + 36, n, { size: 19, weight: 700, anchor: 'middle', fill: m ? '#1A1033' : T.ink })
    })
    return o
  }
  let s = fila(204, nombres, [], '1. La lista tal como la pegas')
  s += T.tx(W / 2, 300, 'barajado Fisher-Yates con el generador criptográfico del navegador', { size: 16, anchor: 'middle', fill: T.muted })
  s += fila(344, ['Eva', 'Pablo', 'Ana', 'Tomás', 'Sara', 'Luis'], ['g', 'g', 's', '', '', ''], '2. La lista mezclada: los primeros ganan')
  const ly = 440
  s += rect(M, ly, 22, 22, { rx: 5, fill: T.accent }) + T.tx(M + 34, ly + 17, 'Ganadores', { size: 17 })
  s += rect(M + 180, ly, 22, 22, { rx: 5, fill: '#A78BFA' }) + T.tx(M + 214, ly + 17, 'Suplente', { size: 17 })
  const cy = 500
  const consejos = [['Quita duplicados', 'Cada persona, una sola vez, salvo que las reglas digan otra cosa.'], ['Graba la pantalla', 'Es la forma más sencilla de demostrar que el sorteo fue limpio.'], ['Elige suplentes', 'Por si un ganador no responde en el plazo que fijaste.']]
  consejos.forEach(([a, b], i) => {
    const y = cy + i * 60
    s += T.tx(M, y + 20, a, { size: 18, weight: 700, fill: T.accent })
    s += T.tx(M + 190, y + 20, b, { size: 16 })
  })
  return T.lienzo({ alto: cy + 3 * 60 + 60, slug: 'sorteo-online', titulo: 'Cómo elige ganadores un sorteo justo', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 123 Números aleatorios (pizarra, dados)
function numeros() {
  const T = tema('pizarra')
  const dado = (x, y, n) => {
    let o = rect(x, y, 84, 84, { rx: 16, fill: '#F8FAFC' })
    const p = { 1: [[42, 42]], 2: [[24, 24], [60, 60]], 3: [[22, 22], [42, 42], [62, 62]], 4: [[24, 24], [60, 24], [24, 60], [60, 60]], 5: [[22, 22], [62, 22], [42, 42], [22, 62], [62, 62]], 6: [[24, 20], [60, 20], [24, 42], [60, 42], [24, 64], [60, 64]] }[n]
    p.forEach(([a, b]) => { o += circle(x + a, y + b, 7, { fill: '#1F2937' }) })
    return o
  }
  let s = ''
  for (let n = 1; n <= 6; n++) s += dado(M + (n - 1) * 116, 186, n) + T.tx(M + (n - 1) * 116 + 42, 300, '1/6', { size: 18, anchor: 'middle', fill: T.accent, family: T.titulo })
  s += T.tx(M, 340, 'Cada cara: 16,7 %. Con dos dados, el 7 es la suma más probable (6 de 36).', { size: 17 })
  const ty = 390
  s += T.tx(M, ty, 'Combinaciones posibles en una lotería', { size: 22, family: T.titulo, fill: T.accent })
  const lot = [['6 de 49', '13.983.816'], ['6 de 56', '32.468.436']]
  const cw = (W - 2 * M - 16) / 2
  lot.forEach(([a, b], i) => {
    const x = M + i * (cw + 16)
    s += rect(x, ty + 20, cw, 100, { rx: 14, fill: T.soft, stroke: T.line, sw: 2 })
    s += T.tx(x + 20, ty + 56, `Elegir ${a}`, { size: 18, fill: T.muted })
    s += T.tx(x + 20, ty + 98, b, { size: 30, weight: 700, family: T.titulo })
  })
  const n = T.nota(ty + 160, 'Los números salen del generador criptográfico del navegador y se descartan los valores que causarían sesgo: ningún número sale más que otro. Ningún generador predice la lotería.')
  return T.lienzo({ alto: Math.round(ty + 160 + n.h + 60), slug: 'generador-numeros-aleatorios', titulo: 'Probabilidad de los dados y de la lotería', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 124 Cara o cruz (banda ámbar)
function caraCruz() {
  const T = tema('banda', { accent: '#B45309', soft: '#FFFBEB' })
  const cx = 160
  let s = circle(cx, 290, 96, { fill: '#FCD34D', stroke: '#B45309', sw: 6 }) + circle(cx, 290, 78, { fill: 'none', stroke: '#D97706', sw: 2 })
  s += T.tx(cx, 302, '50 %', { size: 38, weight: 700, anchor: 'middle', fill: '#78350F' })
  const tx = 320
  s += T.tx(tx, 196, 'Cómo se dice en cada país', { size: 19, weight: 700 })
  const paises = [['México', 'águila o sol (volado)'], ['España', 'cara o cruz'], ['Argentina y Uruguay', 'cara o ceca'], ['Chile, Colombia y Perú', 'cara o sello']]
  paises.forEach(([p, d], i) => {
    const y = 214 + i * 44
    s += rect(tx, y, W - M - tx, 38, { rx: 10, fill: i % 2 ? '#FFFFFF' : T.soft })
    s += T.tx(tx + 12, y + 26, p, { size: 16, weight: 700 })
    s += T.tx(W - M - 12, y + 26, d, { size: 16, anchor: 'end', fill: T.accent })
  })
  const ty = 420
  s += T.tx(M, ty, 'Probabilidad de que salga lo mismo varias veces seguidas', { size: 19, weight: 700 })
  const rachas = [['2 veces', 25], ['3 veces', 12.5], ['5 veces', 3.125], ['10 veces', 0.098]]
  rachas.forEach(([a, p], i) => {
    const y = ty + 22 + i * 50
    s += T.tx(M, y + 26, a, { size: 17 })
    s += rect(M + 110, y + 8, Math.max(6, (p / 25) * (W - 2 * M - 260)), 28, { rx: 8, fill: T.accent })
    s += T.tx(M + 122 + Math.max(6, (p / 25) * (W - 2 * M - 260)), y + 28, `${es(p, p < 1 ? 3 : p % 1 ? 1 : 0)} %`, { size: 17, weight: 700 })
  })
  const n = T.nota(ty + 22 + 4 * 50 + 16, 'Falacia del jugador: tras cinco caras, la siguiente tirada sigue siendo 50 % y 50 %. La moneda no recuerda lo que salió antes.')
  return T.lienzo({ alto: Math.round(ty + 22 + 4 * 50 + 16 + n.h + 64), slug: 'cara-o-cruz', titulo: 'Cara o cruz: probabilidades y nombres por país', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 125 Temporizador (banda tomate, Pomodoro)
function temporizador() {
  const T = tema('banda', { accent: '#DC2626', soft: '#FEF2F2' })
  const bloques = [['25', 'foco', true], ['5', 'pausa', false], ['25', 'foco', true], ['5', 'pausa', false], ['25', 'foco', true], ['5', 'pausa', false], ['25', 'foco', true], ['20', 'pausa larga', false]]
  const total = 135
  const ancho = W - 2 * M
  let x = M
  let s = T.tx(M, 184, 'Un ciclo Pomodoro completo: unas 2 horas y cuarto', { size: 20, weight: 700 })
  bloques.forEach(([m, t, foco]) => {
    const w = (parseInt(m, 10) / total) * ancho
    s += rect(x + 1, 206, w - 2, 70, { rx: 8, fill: foco ? T.accent : t === 'pausa larga' ? '#16A34A' : '#86EFAC' })
    s += T.tx(x + w / 2, 248, m, { size: 20, weight: 700, anchor: 'middle', fill: foco || t === 'pausa larga' ? '#FFFFFF' : '#14532D' })
    x += w
  })
  s += T.tx(M, 300, 'minutos', { size: 14, fill: T.muted })
  const ty = 350
  const pasos = [['Elige una sola tarea', 'Y apaga las notificaciones durante el bloque.'], ['Trabaja 25 minutos', 'Si surge otra idea, anótala y sigue.'], ['Descansa 5 minutos', 'Levántate, bebe agua, no mires el móvil.'], ['Cada 4 bloques, una pausa larga', 'De 15 a 30 minutos.']]
  pasos.forEach(([a, b], i) => {
    const y = ty + i * 64
    s += circle(M + 18, y + 18, 16, { fill: T.accent }) + T.tx(M + 18, y + 25, String(i + 1), { size: 17, weight: 700, anchor: 'middle', fill: '#FFF' })
    s += T.tx(M + 48, y + 22, a, { size: 19, weight: 700 })
    s += T.tx(M + 48, y + 46, b, { size: 16, fill: T.muted })
  })
  return T.lienzo({ alto: ty + 4 * 64 + 70, slug: 'temporizador-online', titulo: 'La técnica Pomodoro con un temporizador', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 126 Criptomonedas (terminal)
function cripto() {
  const T = tema('terminal', { accent: '#F7931A' })
  let s = T.tx(M, 184, '1 BTC = 100.000.000 satoshis', { size: 30, weight: 700, fill: T.accent })
  const filas = [['1 BTC', '100.000.000 sats'], ['0,1 BTC', '10.000.000 sats'], ['0,01 BTC', '1.000.000 sats'], ['0,001 BTC', '100.000 sats'], ['0,00001 BTC', '1.000 sats']]
  filas.forEach(([a, b], i) => {
    const y = 210 + i * 52
    s += rect(M, y, W - 2 * M, 44, { rx: 8, fill: T.soft })
    s += T.tx(M + 16, y + 29, a, { size: 20, fill: '#FDE68A' })
    s += T.tx(W - M - 16, y + 29, b, { size: 20, anchor: 'end' })
  })
  const ty = 210 + 5 * 52 + 30
  s += T.tx(M, ty, '# stablecoins: valen lo mismo que un dólar', { size: 16, fill: T.muted })
  const st = [['USDT', 'Tether'], ['USDC', 'Circle']]
  const cw = (W - 2 * M - 16) / 2
  st.forEach(([a, b], i) => {
    const x = M + i * (cw + 16)
    s += rect(x, ty + 16, cw, 80, { rx: 12, fill: T.soft, stroke: '#26A17B', sw: 2 })
    s += T.tx(x + 20, ty + 52, `1 ${a} ≈ 1 USD`, { size: 22, weight: 700, fill: '#34D399' })
    s += T.tx(x + 20, ty + 80, `emitida por ${b}`, { size: 15, fill: T.muted })
  })
  const n = T.nota(ty + 136, '// precios de referencia de CoinGecko. Tu exchange aplica su propio precio y comisiones; las criptomonedas pueden perder gran parte de su valor.')
  return T.lienzo({ alto: Math.round(ty + 136 + n.h + 60), slug: 'conversor-criptomonedas', titulo: 'Bitcoin, satoshis y stablecoins en una tabla', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 127 Zona horaria (plano)
function zonaHoraria() {
  const T = tema('plano', { accent: '#FCD34D', font: 'Segoe UI, Arial, sans-serif' })
  const ciudades = [['Ciudad de México', '12:00', '12:00', 'UTC−6 todo el año'], ['Bogotá y Lima', '13:00', '13:00', 'UTC−5 todo el año'], ['Santiago de Chile', '15:00', '14:00', 'cambia de horario'], ['Buenos Aires', '15:00', '15:00', 'UTC−3 todo el año'], ['Madrid', '19:00', '20:00', 'cambia de horario']]
  const xs = [M, M + 360, M + 480, W - M]
  let s = T.tx(xs[1], 186, 'enero', { size: 16, anchor: 'middle', fill: T.muted }) + T.tx(xs[2], 186, 'julio', { size: 16, anchor: 'middle', fill: T.muted })
  ciudades.forEach(([c, e, j, n], i) => {
    const y = 200 + i * 66
    s += rect(M, y, W - 2 * M, 58, { rx: 10, fill: i === 0 ? '#1E4D7B' : T.soft })
    s += T.tx(M + 16, y + 26, c, { size: 19, weight: 700, fill: '#FFFFFF' })
    s += T.tx(M + 16, y + 48, n, { size: 14, fill: T.muted })
    s += T.tx(xs[1], y + 37, e, { size: 24, weight: 700, anchor: 'middle', fill: T.accent, family: 'Consolas, monospace' })
    s += T.tx(xs[2], y + 37, j, { size: 24, weight: 700, anchor: 'middle', fill: e === j ? T.accent : '#F472B6', family: 'Consolas, monospace' })
  })
  const n = T.nota(200 + 5 * 66 + 20, 'Misma reunión a las 12:00 de Ciudad de México en enero y en julio. México no cambia de horario desde 2022 (salvo algunas zonas fronterizas); Chile y España sí, en fechas distintas.')
  return T.lienzo({ alto: Math.round(200 + 5 * 66 + 20 + n.h + 60), slug: 'conversor-zona-horaria', titulo: 'Qué hora es en cada país a las 12 de México', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 128 Kilos a libras (papel, maleta)
function kilosLibras() {
  const T = tema('papel', { accent: '#1D4ED8', soft: '#DBEAFE' })
  let s = T.tx(M, 188, '1 kg = 2,2046 lb    ·    1 lb = 0,4536 kg', { size: 24, weight: 700, family: T.titulo, fill: T.accent })
  const filas = [['50 kg', '110,2 lb'], ['60 kg', '132,3 lb'], ['70 kg', '154,3 lb'], ['80 kg', '176,4 lb'], ['90 kg', '198,4 lb'], ['100 kg', '220,5 lb']]
  const cw = (W - 2 * M - 24) / 3
  filas.forEach(([a, b], i) => {
    const x = M + (i % 3) * (cw + 12)
    const y = 214 + Math.floor(i / 3) * 92
    s += rect(x, y, cw, 80, { rx: 14, fill: '#FFFDF8', stroke: T.line, sw: 2 })
    s += T.tx(x + cw / 2, y + 34, a, { size: 18, anchor: 'middle', fill: T.muted })
    s += T.tx(x + cw / 2, y + 64, b, { size: 26, weight: 700, anchor: 'middle', family: T.titulo })
  })
  const my = 214 + 2 * 92 + 30
  s += T.tx(M, my, 'Equipaje facturado', { size: 20, weight: 700, family: T.titulo })
  const mal = [['23 kg', '50,7 lb', 'límite habitual en clase turista'], ['32 kg', '70,5 lb', 'máximo por maleta en casi todas las aerolíneas']]
  mal.forEach(([a, b, c], i) => {
    const y = my + 24 + i * 76
    s += rect(M, y, 70, 60, { rx: 10, fill: T.accent }) + rect(M + 22, y - 10, 26, 12, { rx: 4, fill: 'none', stroke: T.accent, sw: 4 })
    s += T.tx(M + 90, y + 28, `${a} = ${b}`, { size: 22, weight: 700, family: T.titulo })
    s += T.tx(M + 90, y + 52, c, { size: 16, fill: T.muted })
  })
  const n = T.nota(my + 24 + 2 * 76 + 10, 'Una libra tiene 16 onzas. Truco rápido: para pasar kilos a libras, duplica y suma un 10 % (70 → 140 + 14 = 154).')
  return T.lienzo({ alto: Math.round(my + 24 + 2 * 76 + 10 + n.h + 64), slug: 'kilos-a-libras', titulo: 'Tabla de kilos a libras y equipaje en avión', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 129 Tallas de zapatos (banda azul marino)
function tallas() {
  const T = tema('banda', { accent: '#1E3A8A', soft: '#EFF6FF' })
  const filas = [[24.5, 6.5, 5.5, 39], [25, 7, 6, 40], [25.5, 7.5, 6.5, 40.5], [26, 8, 7, 41], [26.5, 8.5, 7.5, 42], [27, 9, 8, 42.5], [27.5, 9.5, 8.5, 43], [28, 10, 9, 44]]
  const cab = ['México (cm)', 'EE. UU.', 'Reino Unido', 'Europa']
  const cw = (W - 2 * M) / 4
  let s = T.tx(M, 184, 'Zapatos de hombre', { size: 20, weight: 700 })
  cab.forEach((c, i) => { s += T.tx(M + i * cw + cw / 2, 216, c, { size: 15, weight: 700, anchor: 'middle', fill: T.muted }) })
  filas.forEach((f, j) => {
    const y = 228 + j * 44
    s += rect(M, y, W - 2 * M, 40, { rx: 8, fill: j === 3 ? '#DBEAFE' : j % 2 ? '#FFFFFF' : T.soft })
    f.forEach((v, i) => { s += T.tx(M + i * cw + cw / 2, y + 27, es(v, v % 1 ? 1 : 0), { size: 19, weight: i === 0 ? 700 : 400, anchor: 'middle', fill: i === 0 ? T.accent : T.ink }) })
  })
  const ty = 228 + filas.length * 44 + 30
  s += rect(M, ty, W - 2 * M, 96, { rx: 14, fill: T.soft })
  s += T.tx(M + 20, ty + 36, 'La talla mexicana es la longitud del pie en centímetros', { size: 18, weight: 700, fill: T.accent })
  s += T.tx(M + 20, ty + 70, 'Mide de talón a dedo más largo, por la tarde y con calcetín.', { size: 17 })
  const n = T.nota(ty + 136, 'Equivalencias orientativas: cada marca horma distinto. Si estás entre dos tallas, elige la mayor en zapatillas deportivas.')
  return T.lienzo({ alto: Math.round(ty + 136 + n.h + 64), slug: 'convertidor-tallas', titulo: 'Equivalencias de tallas de zapato entre países', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 130 Subsidio al empleo (cuaderno)
function subsidio() {
  const T = tema('cuaderno', { accent: '#15803D' })
  let s = T.tx(M, 190, 'Subsidio 2026: $535.65 al mes (febrero a diciembre)', { size: 22, family: T.titulo, fill: T.accent })
  s += T.tx(M, 224, 'Solo si tu ingreso mensual no pasa de $11,492.66', { size: 18 })
  const ey = 260
  s += T.tx(M, ey, 'Ejemplo: sueldo de $10,000 al mes', { size: 20, weight: 700 })
  const pasos = [['ISR según la tarifa', '$729.02'], ['Menos subsidio al empleo', '− $535.65'], ['ISR que te retienen', '$193.37']]
  pasos.forEach(([a, b], i) => {
    const y = ey + 22 + i * 58
    s += rect(M, y, W - 2 * M, 48, { rx: 10, fill: i === 2 ? '#DCFCE7' : '#FFFFFF', stroke: i === 2 ? T.accent : '#93C5FD', sw: 2 })
    s += T.tx(M + 16, y + 31, a, { size: 18 })
    s += T.tx(W - M - 16, y + 32, b, { size: 22, weight: 700, anchor: 'end', family: T.titulo, fill: i === 2 ? T.accent : T.ink })
  })
  const cy = ey + 22 + 3 * 58 + 30
  const cw = (W - 2 * M - 16) / 2
  s += rect(M, cy, cw, 120, { rx: 14, fill: '#FFFFFF', stroke: '#93C5FD', sw: 2 })
  s += T.tx(M + 18, cy + 34, 'Si ganas $11,492.66 o menos', { size: 17, weight: 700 })
  s += T.tx(M + 18, cy + 66, 'El subsidio reduce tu ISR.', { size: 16 })
  s += T.tx(M + 18, cy + 92, 'Nunca se paga en efectivo.', { size: 16, fill: T.muted })
  s += rect(M + cw + 16, cy, cw, 120, { rx: 14, fill: '#FFFFFF', stroke: '#93C5FD', sw: 2 })
  s += T.tx(M + cw + 34, cy + 34, 'Si ganas más', { size: 17, weight: 700 })
  s += T.tx(M + cw + 34, cy + 66, 'No hay subsidio: pagas la', { size: 16 })
  s += T.tx(M + cw + 34, cy + 92, 'tarifa del ISR completa.', { size: 16 })
  return T.lienzo({ alto: cy + 120 + 80, slug: 'calcular-subsidio-empleo', titulo: 'Cómo reduce tu ISR el subsidio al empleo', cuerpo: s })
}

const pieza = (archivo, alt, fn) => ({ archivo, alt, dibujar: fn })

module.exports = [
  pieza('limite-caracteres-sms', 'Límite de caracteres de un SMS: 160 con el alfabeto GSM y 70 con tildes o emojis, y otros límites', caracteres),
  pieza('como-funciona-sorteo-justo', 'Cómo funciona un sorteo justo: lista de participantes barajada para elegir ganadores y suplentes', sorteo),
  pieza('probabilidad-dados-loteria', 'Probabilidad de cada cara de un dado y número de combinaciones de una lotería de 6 números', numeros),
  pieza('cara-o-cruz-probabilidades', 'Probabilidades de cara o cruz, rachas seguidas y nombres del juego en cada país', caraCruz),
  pieza('tecnica-pomodoro-temporizador', 'Ciclo de la técnica Pomodoro con bloques de 25 minutos y pausas', temporizador),
  pieza('bitcoin-satoshis-stablecoins', 'Equivalencia entre bitcoin y satoshis y valor de las stablecoins USDT y USDC', cripto),
  pieza('diferencia-horaria-mexico-latam-espana', 'Hora en Bogotá, Lima, Santiago, Buenos Aires y Madrid cuando son las 12 en Ciudad de México', zonaHoraria),
  pieza('tabla-kilos-a-libras', 'Tabla de conversión de kilos a libras y límites de equipaje de 23 y 32 kg en libras', kilosLibras),
  pieza('equivalencias-tallas-zapato', 'Tabla de equivalencias de tallas de zapato de hombre entre México, Estados Unidos, Reino Unido y Europa', tallas),
  pieza('subsidio-empleo-isr-2026', 'Cómo reduce el subsidio al empleo el ISR de un sueldo de 10 mil pesos en 2026', subsidio),
]
