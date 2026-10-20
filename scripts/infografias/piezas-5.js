// Infografías del lote 5 (herramientas 41 a 50), con los temas de piezas-4.
const { rect, circle } = require('../illustrations/kit')
const { tema, W, M, es, mx } = require('./piezas-4').temas

// ─────────────────────────────────────────────────────────── 41 Velocidad, distancia y tiempo (banda verde azulado)
function velocidad() {
  const T = tema('banda', { accent: '#0F766E', soft: '#F0FDFA' })
  const cx = 230
  const top = 190
  const base = 450
  let s = `<path d="M${cx},${top} L${cx + 170},${base} L${cx - 170},${base} Z" fill="${T.soft}" stroke="${T.accent}" stroke-width="4" stroke-linejoin="round"/>`
  s += `<line x1="${cx - 112}" y1="${base - 88}" x2="${cx + 112}" y2="${base - 88}" stroke="${T.accent}" stroke-width="3"/>`
  s += `<line x1="${cx}" y1="${base - 88}" x2="${cx}" y2="${base}" stroke="${T.accent}" stroke-width="3"/>`
  s += T.tx(cx, top + 120, 'd', { size: 64, weight: 700, anchor: 'middle', fill: T.accent })
  s += T.tx(cx - 60, base - 26, 'v', { size: 54, weight: 700, anchor: 'middle', fill: T.accent })
  s += T.tx(cx + 60, base - 26, 't', { size: 54, weight: 700, anchor: 'middle', fill: T.accent })
  s += T.tx(cx, base + 40, 'Tapa lo que buscas y lee el resto', { size: 17, anchor: 'middle', fill: T.muted })
  const fx = 450
  const formulas = [['Distancia', 'd = v × t', '100 km/h × 2,5 h = 250 km'], ['Velocidad', 'v = d ÷ t', '300 km ÷ 4 h = 75 km/h'], ['Tiempo', 't = d ÷ v', '180 km ÷ 120 km/h = 1,5 h']]
  formulas.forEach(([a, f, e], i) => {
    const y = top + i * 104
    s += rect(fx, y, W - M - fx, 92, { rx: 14, fill: '#FFFFFF', stroke: T.line, sw: 2 })
    s += T.tx(fx + 18, y + 28, a, { size: 16, fill: T.muted })
    s += T.tx(fx + 18, y + 58, f, { size: 25, weight: 700 })
    s += T.tx(fx + 18, y + 82, e, { size: 15, fill: T.accent })
  })
  const ay = base + 80
  s += rect(M, ay, W - 2 * M, 84, { rx: 16, fill: '#FEF3C7' })
  s += T.tx(M + 20, ay + 34, '1,5 h no son 1 h 50 min', { size: 21, weight: 700, fill: '#92400E' })
  s += T.tx(M + 20, ay + 64, 'Son 1 h 30 min: multiplica la parte decimal por 60.', { size: 18, fill: '#92400E' })
  return T.lienzo({ alto: ay + 84 + 84, slug: 'calcular-velocidad-distancia-tiempo', titulo: 'El triángulo de la velocidad, la distancia y el tiempo', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 42 Gasolina (papel)
function gasolina() {
  const T = tema('papel', { accent: '#15803D', soft: '#DCFCE7', line: '#E3DCCB' })
  // Carretera
  let s = `<rect x="${M}" y="196" width="${W - 2 * M}" height="40" rx="20" fill="#57534E"/>`
  for (let x = M + 30; x < W - M - 30; x += 60) s += `<rect x="${x}" y="213" width="30" height="6" rx="3" fill="#FDE68A"/>`
  s += circle(M + 20, 216, 14, { fill: T.accent }) + circle(W - M - 20, 216, 14, { fill: '#B45309' })
  s += T.tx(M, 270, 'Origen', { size: 17, fill: T.muted }) + T.tx(W - M, 270, 'Destino · 450 km', { size: 17, fill: T.muted, anchor: 'end' })
  const pasos = [['Litros que necesitas', '450 km × 7 L ÷ 100', '31,5 L'], ['Coste del viaje', '31,5 L × $24.50', '$771.75'], ['Ida y vuelta', '$771.75 × 2', '$1,543.50']]
  pasos.forEach(([a, op, r], i) => {
    const y = 310 + i * 92
    s += `<line x1="${M}" y1="${y - 12}" x2="${W - M}" y2="${y - 12}" stroke="${T.line}" stroke-width="2"/>`
    s += T.tx(M, y + 22, a, { size: 21, weight: 700, family: T.titulo })
    s += T.tx(M, y + 52, op, { size: 18, fill: T.muted })
    s += T.tx(W - M, y + 40, r, { size: 32, weight: 700, anchor: 'end', fill: T.accent, family: T.titulo })
  })
  const cy = 310 + 3 * 92 + 10
  s += rect(M, cy, W - 2 * M, 110, { rx: 16, fill: T.soft })
  s += T.tx(M + 22, cy + 38, 'L/100 km ↔ km/L', { size: 21, weight: 700, family: T.titulo })
  s += T.tx(M + 22, cy + 74, '100 ÷ 7 L/100 km = 14,3 km/L', { size: 20 })
  s += T.tx(M + 22, cy + 98, 'La fórmula es la misma en los dos sentidos: divide 100 entre el valor.', { size: 16, fill: T.muted })
  return T.lienzo({ alto: cy + 110 + 84, slug: 'calcular-gasolina', titulo: 'Cuánto cuesta la gasolina de un viaje', subtitulo: 'Ejemplo: 450 km con un coche que gasta 7 L/100 km y gasolina a $24.50', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 43 Cilindro (banda violeta)
function cilindro() {
  const T = tema('banda', { accent: '#6D28D9', soft: '#F5F3FF' })
  const cx = 200
  const ry = 34
  const rx = 110
  const top = 220
  const h = 240
  let s = `<path d="M${cx - rx},${top} V${top + h} A${rx},${ry} 0 0 0 ${cx + rx},${top + h} V${top}" fill="#DDD6FE" stroke="${T.accent}" stroke-width="3"/>`
  s += `<ellipse cx="${cx}" cy="${top}" rx="${rx}" ry="${ry}" fill="#EDE9FE" stroke="${T.accent}" stroke-width="3"/>`
  s += `<path d="M${cx - rx},${top + h} A${rx},${ry} 0 0 1 ${cx + rx},${top + h}" fill="none" stroke="${T.accent}" stroke-width="2" stroke-dasharray="6 6"/>`
  s += `<line x1="${cx}" y1="${top}" x2="${cx + rx}" y2="${top}" stroke="#DC2626" stroke-width="3"/>`
  s += T.tx(cx + rx / 2, top - 46, 'r = 3 cm', { size: 18, anchor: 'middle', weight: 700, fill: '#DC2626' })
  s += `<line x1="${cx + rx + 26}" y1="${top}" x2="${cx + rx + 26}" y2="${top + h}" stroke="${T.muted}" stroke-width="2"/>`
  s += T.tx(cx + rx + 36, top + h / 2, 'h = 10 cm', { size: 18, weight: 700 })
  const fx = 450
  const datos = [['Volumen', 'V = π × r² × h', '282,74 cm³ = 0,28 L'], ['Área lateral', 'AL = 2 × π × r × h', '188,50 cm²'], ['Área total', 'AT = AL + 2 × π × r²', '245,04 cm²']]
  datos.forEach(([a, f, r], i) => {
    const y = 196 + i * 110
    s += rect(fx, y, W - M - fx, 98, { rx: 14, fill: i === 0 ? T.soft : '#FFFFFF', stroke: T.line, sw: 2 })
    s += T.tx(fx + 18, y + 28, a, { size: 16, fill: T.muted })
    s += T.tx(fx + 18, y + 56, f, { size: 19, weight: 700 })
    s += T.tx(fx + 18, y + 84, r, { size: 20, weight: 700, fill: T.accent })
  })
  const n = T.nota(top + h + 90, 'Para pasar de cm³ a litros divide entre 1.000. Un vaso de 3 cm de radio y 10 cm de alto contiene unos 280 ml.')
  return T.lienzo({ alto: Math.round(top + h + 90 + n.h + 64), slug: 'calcular-volumen-cilindro', titulo: 'Volumen y área de un cilindro', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 44 Ritmo de carrera (oscuro, verde lima)
function ritmo() {
  const T = tema('oscuro', { accent: '#A3E635' })
  const filas = [
    ['4:30', '22:30', '45:00', '1:34:56', '3:09:53'],
    ['5:00', '25:00', '50:00', '1:45:29', '3:30:59'],
    ['5:30', '27:30', '55:00', '1:56:02', '3:52:04'],
    ['6:00', '30:00', '1:00:00', '2:06:35', '4:13:10'],
    ['6:30', '32:30', '1:05:00', '2:17:08', '4:34:16'],
    ['7:00', '35:00', '1:10:00', '2:27:41', '4:55:22'],
  ]
  const cab = ['Ritmo/km', '5K', '10K', 'Media', 'Maratón']
  const xs = [M, M + 190, M + 320, M + 470, W - M]
  let s = ''
  cab.forEach((c, i) => { s += T.tx(xs[i], 184, c, { size: 17, fill: T.muted, anchor: i === 0 ? 'start' : 'end' }) })
  filas.forEach((f, r) => {
    const y = 200 + r * 62
    if (r === 2) s += rect(M - 12, y, W - 2 * M + 24, 54, { rx: 12, fill: '#1A2E05' })
    f.forEach((v, i) => { s += T.tx(xs[i], y + 36, v, { size: i === 0 ? 24 : 22, weight: i === 0 ? 700 : 400, anchor: i === 0 ? 'start' : 'end', fill: i === 0 ? T.accent : T.ink, family: 'Consolas, monospace' }) })
  })
  const y = 200 + 6 * 62 + 30
  const cw = (W - 2 * M - 16) / 2
  s += rect(M, y, cw, 104, { rx: 16, fill: T.soft }) + T.tx(M + 20, y + 36, 'Media maratón', { size: 17, fill: T.muted }) + T.tx(M + 20, y + 76, '21,0975 km', { size: 28, weight: 700 })
  s += rect(M + cw + 16, y, cw, 104, { rx: 16, fill: T.soft }) + T.tx(M + cw + 36, y + 36, 'Maratón', { size: 17, fill: T.muted }) + T.tx(M + cw + 36, y + 76, '42,195 km', { size: 28, weight: 700 })
  const n = T.nota(y + 144, 'Tiempos a ritmo constante. En una maratón real suma algo de margen: el ritmo suele caer en los últimos kilómetros.')
  return T.lienzo({ alto: Math.round(y + 144 + n.h + 60), slug: 'calcular-ritmo', titulo: 'Tabla de ritmos: cuánto tardas en 5K, 10K, media y maratón', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 45 Cronómetro (oscuro, ámbar, display digital)
function cronometro() {
  const T = tema('oscuro', { accent: '#FBBF24', soft: '#1F2937' })
  let s = rect(M, 180, W - 2 * M, 150, { rx: 22, fill: '#000000', stroke: T.line, sw: 3 })
  s += T.tx(W / 2, 286, '00:03:27.45', { size: 72, weight: 700, anchor: 'middle', fill: T.accent, family: 'Consolas, monospace' })
  const etiquetas = [['horas', M + 105], ['minutos', M + 255], ['segundos', M + 405], ['centésimas', M + 580]]
  etiquetas.forEach(([e, x]) => { s += T.tx(x, 360, e, { size: 16, anchor: 'middle', fill: T.muted }) })
  s += T.tx(M, 420, 'Vueltas de una carrera de 1 km en pista', { size: 20, weight: 700 })
  const vueltas = [['1', '1:21.30', '1:21.30'], ['2', '1:24.05', '2:45.35'], ['3', '1:19.88', '4:05.23']]
  s += T.tx(M + 20, 456, 'Vuelta', { size: 15, fill: T.muted }) + T.tx(M + 380, 456, 'Parcial', { size: 15, fill: T.muted, anchor: 'end' }) + T.tx(W - M - 20, 456, 'Acumulado', { size: 15, fill: T.muted, anchor: 'end' })
  vueltas.forEach(([n, p, a], i) => {
    const y = 468 + i * 56
    s += rect(M, y, W - 2 * M, 48, { rx: 10, fill: T.soft })
    s += T.tx(M + 20, y + 32, n, { size: 20, weight: 700 })
    s += T.tx(M + 380, y + 32, p, { size: 20, anchor: 'end', fill: i === 2 ? '#34D399' : T.ink, family: 'Consolas, monospace' })
    s += T.tx(W - M - 20, y + 32, a, { size: 20, anchor: 'end', fill: T.accent, family: 'Consolas, monospace' })
  })
  const n = T.nota(468 + 3 * 56 + 24, 'El parcial es lo que tardaste en esa vuelta; el acumulado, el tiempo total desde que pulsaste iniciar. La vuelta 3 fue la más rápida.')
  return T.lienzo({ alto: Math.round(468 + 3 * 56 + 24 + n.h + 60), slug: 'cronometro-online', titulo: 'Cómo leer el cronómetro y sus vueltas', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 46 Palabras al revés (cuaderno)
function palabrasReves() {
  const T = tema('cuaderno', { accent: '#DB2777' })
  const original = 'hola mundo feliz'
  const modos = [
    ['Invertir todo el texto', [...original].reverse().join('')],
    ['Invertir el orden de las palabras', original.split(' ').reverse().join(' ')],
    ['Invertir cada palabra', original.split(' ').map((p) => [...p].reverse().join('')).join(' ')],
  ]
  let s = T.tx(M, 184, `«${original}»`, { size: 30, family: T.titulo })
  modos.forEach(([m, r], i) => {
    const y = 214 + i * 96
    s += rect(M, y, W - 2 * M, 84, { rx: 14, fill: '#FFFFFF', stroke: '#93C5FD', sw: 2 })
    s += T.tx(M + 18, y + 30, m, { size: 16, fill: T.muted })
    s += T.tx(M + 18, y + 66, r, { size: 28, family: T.titulo, fill: T.accent })
  })
  const py = 214 + 3 * 96 + 36
  s += T.tx(M, py, 'Palíndromos: se leen igual al revés', { size: 22, weight: 700 })
  const pal = ['reconocer', 'Anita lava la tina', 'oso', 'Dábale arroz a la zorra el abad']
  pal.forEach((p, i) => {
    const y = py + 22 + i * 48
    s += circle(M + 10, y + 16, 6, { fill: T.accent })
    s += T.tx(M + 28, y + 24, p, { size: 24, family: T.titulo })
  })
  const n = T.nota(py + 22 + 4 * 48 + 24, 'Para comprobar un palíndromo de varias palabras se ignoran los espacios, las tildes y las mayúsculas.')
  return T.lienzo({ alto: Math.round(py + 22 + 4 * 48 + 24 + n.h + 56), slug: 'palabras-al-reves', titulo: 'Tres formas de escribir al revés', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 47 Celsius a Fahrenheit (banda roja, termómetro)
function celsius() {
  const T = tema('banda', { accent: '#B91C1C', soft: '#FEF2F2' })
  const tx0 = 150
  const yTop = 200
  const yBot = 600
  const min = -40
  const max = 100
  const Y = (c) => yBot - ((c - min) / (max - min)) * (yBot - yTop)
  let s = `<defs><linearGradient id="term" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#2563EB"/><stop offset="0.45" stop-color="#F59E0B"/><stop offset="1" stop-color="#DC2626"/></linearGradient></defs>`
  s += rect(tx0 - 18, yTop - 10, 36, yBot - yTop + 20, { rx: 18, fill: '#F3F4F6', stroke: '#D1D5DB', sw: 2 })
  s += `<rect x="${tx0 - 10}" y="${yTop}" width="20" height="${yBot - yTop}" rx="10" fill="url(#term)"/>`
  s += circle(tx0, yBot + 26, 30, { fill: '#2563EB' })
  const puntos = [[100, 'El agua hierve'], [37, 'Cuerpo humano'], [20, 'Temperatura ambiente'], [0, 'El agua se congela'], [-40, 'Igual en °C y °F']]
  puntos.forEach(([c, d]) => {
    const y = Y(c)
    s += `<line x1="${tx0 + 22}" y1="${y}" x2="${tx0 + 60}" y2="${y}" stroke="#9CA3AF" stroke-width="2"/>`
    s += T.tx(tx0 + 72, y + 7, `${c} °C`, { size: 24, weight: 700, fill: T.accent })
    s += T.tx(tx0 + 200, y + 7, `${es(c * 1.8 + 32, c === 37 ? 1 : 0)} °F`, { size: 24, weight: 700, fill: '#1D4ED8' })
    s += T.tx(tx0 + 330, y + 7, `${es(c + 273.15)} K`, { size: 18, fill: T.muted })
    s += T.tx(W - M, y + 7, d, { size: 17, anchor: 'end', fill: T.ink })
  })
  const fy = yBot + 90
  const cw = (W - 2 * M - 16) / 2
  s += rect(M, fy, cw, 74, { rx: 14, fill: T.soft }) + T.tx(M + cw / 2, fy + 46, '°F = °C × 1,8 + 32', { size: 22, weight: 700, anchor: 'middle', fill: T.accent })
  s += rect(M + cw + 16, fy, cw, 74, { rx: 14, fill: '#EFF6FF' }) + T.tx(M + cw + 16 + cw / 2, fy + 46, 'K = °C + 273,15', { size: 22, weight: 700, anchor: 'middle', fill: '#1D4ED8' })
  return T.lienzo({ alto: fy + 74 + 84, slug: 'celsius-a-fahrenheit', titulo: 'Temperaturas clave en Celsius, Fahrenheit y Kelvin', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 48 Bar a PSI (banda pizarra, manómetro)
function barPsi() {
  const T = tema('banda', { accent: '#334155', soft: '#F1F5F9' })
  const cx = 240
  const cy = 400
  const r = 170
  const ang = (bar) => Math.PI + (bar / 4) * Math.PI // 0 a 4 bar sobre media circunferencia
  const pt = (bar, rr) => [cx + rr * Math.cos(ang(bar)), cy + rr * Math.sin(ang(bar))]
  const arco = (a, b, col, w) => {
    const [x1, y1] = pt(a, r)
    const [x2, y2] = pt(b, r)
    return `<path d="M${x1},${y1} A${r},${r} 0 0 1 ${x2},${y2}" fill="none" stroke="${col}" stroke-width="${w}"/>`
  }
  let s = arco(0, 4, '#E2E8F0', 26) + arco(2.0, 2.6, '#22C55E', 26)
  for (let b = 0; b <= 4; b += 0.5) {
    const [x1, y1] = pt(b, r - 20)
    const [x2, y2] = pt(b, r - 36)
    s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#64748B" stroke-width="${b % 1 ? 2 : 4}"/>`
    if (b % 1 === 0) { const [lx, ly] = pt(b, r - 62); s += T.tx(lx, ly + 7, String(b), { size: 20, weight: 700, anchor: 'middle' }) }
  }
  const [nx, ny] = pt(2.2, r - 30)
  s += `<line x1="${cx}" y1="${cy}" x2="${nx}" y2="${ny}" stroke="#DC2626" stroke-width="6" stroke-linecap="round"/>` + circle(cx, cy, 14, { fill: T.accent })
  s += T.tx(cx, cy + 50, '2,2 bar = 31,9 PSI', { size: 24, weight: 700, anchor: 'middle' })
  s += T.tx(cx, cy + 78, 'presión típica de un turismo', { size: 16, anchor: 'middle', fill: T.muted })
  const tx = 470
  const tabla = [['1 bar', '14,50 PSI'], ['2,0 bar', '29,0 PSI'], ['2,2 bar', '31,9 PSI'], ['2,5 bar', '36,3 PSI'], ['30 PSI', '2,07 bar'], ['35 PSI', '2,41 bar']]
  tabla.forEach(([a, b], i) => {
    const y = 200 + i * 54
    s += rect(tx, y, W - M - tx, 46, { rx: 10, fill: i % 2 ? '#FFFFFF' : T.soft })
    s += T.tx(tx + 16, y + 31, a, { size: 19, weight: 700 })
    s += T.tx(W - M - 16, y + 31, b, { size: 19, anchor: 'end', fill: '#0369A1', weight: 700 })
  })
  const n = T.nota(Math.max(cy + 120, 200 + 6 * 54 + 36), 'La presión correcta de tus neumáticos está en la etiqueta del marco de la puerta o en la tapa del depósito. Mídela en frío.')
  return T.lienzo({ alto: Math.round(Math.max(cy + 120, 200 + 6 * 54 + 36) + n.h + 60), slug: 'bar-a-psi', titulo: 'Presión de neumáticos en bar y PSI', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 49 Medidas de cocina (papel)
function cocina() {
  const T = tema('papel')
  const piezas = [['1 taza', '240 ml', 150], ['1 cucharada', '15 ml', 90], ['1 cucharadita', '5 ml', 60]]
  let s = ''
  let x = M + 10
  piezas.forEach(([n, ml, tam], i) => {
    const y = 330 - tam
    if (i === 0) s += `<path d="M${x},${y} h${tam} l-14,${tam} h-${tam - 28} Z" fill="${T.soft}" stroke="${T.accent}" stroke-width="3"/><path d="M${x + tam},${y + 26} q34,8 0,60" fill="none" stroke="${T.accent}" stroke-width="3"/>`
    else s += `<ellipse cx="${x + tam / 2}" cy="${330 - tam / 3}" rx="${tam / 2}" ry="${tam / 4}" fill="${T.soft}" stroke="${T.accent}" stroke-width="3"/><rect x="${x + tam}" y="${330 - tam / 3 - 4}" width="${tam * 0.9}" height="8" rx="4" fill="${T.accent}"/>`
    s += T.tx(x + tam / 2, 370, n, { size: 20, weight: 700, anchor: 'middle', family: T.titulo })
    s += T.tx(x + tam / 2, 396, ml, { size: 18, anchor: 'middle', fill: T.muted })
    x += tam + (i === 0 ? 120 : 150)
  })
  const ey = 450
  s += `<line x1="${M}" y1="${ey - 20}" x2="${W - M}" y2="${ey - 20}" stroke="${T.line}" stroke-width="2"/>`
  const eq = [['1 taza', '16 cucharadas', '48 cucharaditas'], ['½ taza', '8 cucharadas', '120 ml'], ['¼ taza', '4 cucharadas', '60 ml'], ['1 cucharada', '3 cucharaditas', '15 ml']]
  eq.forEach(([a, b, c], i) => {
    const y = ey + 10 + i * 50
    s += T.tx(M, y + 20, a, { size: 22, weight: 700, family: T.titulo })
    s += T.tx(M + 230, y + 20, `= ${b}`, { size: 20 })
    s += T.tx(W - M, y + 20, `= ${c}`, { size: 20, anchor: 'end', fill: T.accent })
  })
  const gy = ey + 10 + 4 * 50 + 30
  s += rect(M, gy, W - 2 * M, 108, { rx: 16, fill: T.soft })
  s += T.tx(M + 22, gy + 36, 'Una taza en gramos (aproximado)', { size: 19, weight: 700, family: T.titulo })
  s += T.tx(M + 22, gy + 76, 'Harina ≈ 125 g   ·   Azúcar ≈ 200 g   ·   Agua = 240 g', { size: 20 })
  const n = T.nota(gy + 148, 'Medidas de EE. UU., las más usadas en recetas en español. La taza británica y la australiana tienen 250 ml.')
  return T.lienzo({ alto: Math.round(gy + 148 + n.h + 60), slug: 'medidas-de-cocina', titulo: 'Equivalencias de tazas, cucharadas y cucharaditas', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 50 Tipografía para Instagram (oscuro, violeta)
function tipografia() {
  const T = tema('oscuro', { accent: '#C084FC' })
  const desde = (base, txt) => [...txt].map((c) => (/[a-z]/.test(c) ? String.fromCodePoint(base + c.charCodeAt(0) - 97) : c)).join('')
  const desdeM = (baseM, baseMin, txt) => [...txt].map((c) => (/[A-Z]/.test(c) ? String.fromCodePoint(baseM + c.charCodeAt(0) - 65) : /[a-z]/.test(c) ? String.fromCodePoint(baseMin + c.charCodeAt(0) - 97) : c)).join('')
  const palabra = 'Hola'
  const estilos = [
    ['Negrita', desdeM(0x1d400, 0x1d41a, palabra)],
    ['Cursiva', desdeM(0x1d434, 0x1d44e, palabra).replace('h', 'ℎ')],
    ['Script', desdeM(0x1d4d0, 0x1d4ea, palabra)],
    ['Gótico', desdeM(0x1d56c, 0x1d586, palabra)],
    ['Doble rayado', desdeM(0x1d538, 0x1d552, palabra).replace(String.fromCodePoint(0x1d53f), 'ℍ')],
    ['Monoespaciado', desdeM(0x1d670, 0x1d68a, palabra)],
  ]
  let s = ''
  const cw = (W - 2 * M - 16) / 2
  estilos.forEach(([n, ej], i) => {
    const x = M + (i % 2) * (cw + 16)
    const y = 180 + Math.floor(i / 2) * 118
    s += rect(x, y, cw, 104, { rx: 16, fill: T.soft })
    s += T.tx(x + 20, y + 30, n, { size: 16, fill: T.muted })
    s += T.tx(x + 20, y + 80, ej, { size: 40, fill: '#FFFFFF', family: 'Segoe UI Symbol, Cambria Math, sans-serif' })
  })
  const ay = 180 + 3 * 118 + 16
  s += rect(M, ay, W - 2 * M, 118, { rx: 16, fill: '#2E1065' })
  s += T.tx(M + 22, ay + 38, 'No son fuentes, son símbolos', { size: 21, weight: 700, fill: T.accent })
  s += T.tx(M + 22, ay + 72, 'Cada letra es un carácter Unicode distinto. Por eso se copian', { size: 17 })
  s += T.tx(M + 22, ay + 98, 'a cualquier app, pero Instagram no las encuentra al buscar.', { size: 17 })
  return T.lienzo({ alto: ay + 118 + 84, slug: 'tipografia-para-instagram', titulo: 'Estilos de letra para Instagram y cómo funcionan', cuerpo: s })
}

const pieza = (archivo, alt, fn) => ({ archivo, alt, dibujar: fn })

module.exports = [
  pieza('triangulo-velocidad-distancia-tiempo', 'Triángulo para recordar las fórmulas de velocidad, distancia y tiempo con ejemplos', velocidad),
  pieza('costo-gasolina-viaje-ejemplo', 'Cálculo del costo de gasolina de un viaje de 450 km y conversión de L/100 km a km/L', gasolina),
  pieza('volumen-area-cilindro-formulas', 'Fórmulas del volumen, área lateral y área total de un cilindro con un ejemplo', cilindro),
  pieza('tabla-ritmos-carrera-5k-maraton', 'Tabla de ritmos de carrera por kilómetro con tiempos para 5K, 10K, media maratón y maratón', ritmo),
  pieza('cronometro-vueltas-parcial-acumulado', 'Cómo leer el cronómetro online: horas, minutos, segundos, centésimas y vueltas', cronometro),
  pieza('escribir-al-reves-palindromos', 'Tres formas de escribir un texto al revés y ejemplos de palíndromos en español', palabrasReves),
  pieza('temperaturas-celsius-fahrenheit-kelvin', 'Termómetro con temperaturas clave en grados Celsius, Fahrenheit y Kelvin', celsius),
  pieza('presion-neumaticos-bar-psi', 'Manómetro y tabla de equivalencias de presión de neumáticos en bar y PSI', barPsi),
  pieza('equivalencias-medidas-cocina', 'Equivalencias de taza, cucharada y cucharadita en mililitros y gramos aproximados', cocina),
  pieza('estilos-letras-instagram-unicode', 'Estilos de letra para Instagram como negrita, script y gótico creados con símbolos Unicode', tipografia),
]
