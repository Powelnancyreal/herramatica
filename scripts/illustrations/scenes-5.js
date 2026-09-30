// Escenas: desarrollo y diseño, generadores virales y juegos (lote 2).
const k = require('./kit')
const { C, place, text, rect, circle } = k

const MONO = 'Courier New, monospace'
const DARK = '#1E1B4B'

module.exports = [
  {
    slug: 'decodificador-jwt',
    file: 'decodificar-token-jwt-online',
    alt: 'Decodificador JWT',
    draw: () =>
      k.frame('jwt-token') +
      k.ground(400, 400, 560) +
      // Token de tres colores que se separa en encabezado, contenido y firma.
      place(400, 120, rect(-300, -28, 600, 56, { rx: 14, fill: DARK }) + text(-200, 8, 'eyJhbGci', { size: 22, fill: '#FCA5A5', family: MONO }) + text(-110, 8, '.', { size: 22, fill: C.white, family: MONO }) + text(0, 8, 'eyJzdWIi', { size: 22, fill: '#C4B5FD', family: MONO }) + text(110, 8, '.', { size: 22, fill: C.white, family: MONO }) + text(200, 8, 'mntREIYu', { size: 22, fill: '#7DD3FC', family: MONO })) +
      [[C.red, 'HEADER', '"alg":"HS256"'], [C.purple, 'PAYLOAD', '"sub":"1234"'], [C.blue, 'SIGNATURE', 'verificada']].map(([c, t, v], i) => place(160 + i * 240, 270, rect(-100, -70, 200, 140, { rx: 16, fill: C.white, stroke: c, sw: 4 }) + rect(-100, -70, 200, 34, { rx: 16, fill: c }) + rect(-100, -48, 200, 12, { rx: 0, fill: c }) + text(0, -46, t, { size: 15, fill: C.white }) + text(0, 12, v, { size: 16, fill: C.slate, family: MONO }) + (i === 2 ? place(0, 44, k.check({ r: 16 })) : k.lines(-70, 30, [140, 100])))).join(''),
  },
  {
    slug: 'conversor-csv-json',
    file: 'convertir-csv-a-json-online',
    alt: 'Conversor CSV a JSON',
    draw: () =>
      k.frame('csv-json', { blob2: C.greenSoft }) +
      k.ground(400, 400, 560) +
      place(210, 220, k.table({ cols: 3, rows: 4, w: 250, h: 190, head: C.green, stroke: C.green }) + text(0, 120, 'datos.csv', { size: 18, fill: C.green })) +
      k.arrow(350, 220, 440, 220, { color: C.purple, bend: 26 }) +
      place(590, 220, rect(-130, -110, 260, 220, { rx: 16, fill: DARK }) + ['[', '  {"nombre": "Ana",', '   "edad": 31},', '  {"nombre": "Luis",', '   "edad": 27}', ']'].map((l, i) => text(-110, -72 + i * 30, l.replace(/ /g, '&#160;'), { size: 16, fill: [C.white, C.amber, C.greenSoft, C.amber, C.greenSoft, C.white][i], anchor: 'start', family: MONO })).join('') + text(0, 136, 'datos.json', { size: 18, fill: C.purple })),
  },
  {
    slug: 'codificador-url',
    file: 'codificar-y-decodificar-url-online',
    alt: 'Codificador URL',
    draw: () =>
      k.frame('url-encode', { blob2: C.blueSoft }) +
      k.ground(400, 400, 560) +
      place(400, 150, rect(-300, -30, 600, 60, { rx: 30, fill: C.white, stroke: C.purple, sw: 4 }) + place(-262, 0, k.lock({ fill: C.green }), { s: 0.35 }) + text(20, 8, 'herramatica.com/?q=café orgánico', { size: 20, fill: C.slate })) +
      place(400, 240, k.arrow(0, -30, 0, 20, { color: C.purple, bend: 0 })) +
      place(400, 320, rect(-300, -30, 600, 60, { rx: 30, fill: DARK }) + text(0, 8, '?q=caf%C3%A9%20org%C3%A1nico', { size: 20, fill: C.greenSoft, family: MONO })) +
      place(120, 250, k.badge({ r: 30, label: '%', fill: C.amber, tc: C.slate })) + place(690, 250, k.badge({ r: 26, label: '&', fill: C.teal })),
  },
  {
    slug: 'minificador-codigo',
    file: 'minificar-javascript-css-html-online',
    alt: 'Minificador de código',
    draw: () =>
      k.frame('minificar-codigo', { blob2: C.amberSoft }) +
      k.ground(400, 400, 560) +
      // Código largo que se comprime en una línea: prensa.
      place(220, 220, k.browser({ w: 240, h: 240, accent: C.slateMid, content: k.codeLines(-100, -80, [[[0, 60, C.purple], [70, 90, C.slateSoft]], [[20, 120, C.blue]], [[20, 90, C.green], [120, 50, C.slateSoft]], [[40, 110, C.amber]], [[20, 70, C.slateSoft]], [[0, 30, C.purple]]], { gap: 26 }) })) +
      k.arrow(360, 220, 440, 220, { color: C.purple, bend: 0 }) +
      place(590, 190, rect(-140, -28, 280, 56, { rx: 12, fill: DARK }) + k.codeLines(-124, -5, [[[0, 40, C.purple], [44, 60, C.blue], [108, 50, C.green], [162, 80, C.amber]]])) +
      place(590, 290, k.pill({ w: 190, h: 50, label: '−58% tamaño', fill: C.green, size: 20 })),
  },
  {
    slug: 'generador-datos-prueba',
    file: 'generar-datos-falsos-de-prueba-en-espanol',
    alt: 'Generador de datos de prueba',
    draw: () =>
      k.frame('datos-prueba') +
      k.ground(400, 400, 560) +
      // Fichas de personas ficticias saliendo de una base de datos.
      place(170, 240, `<ellipse cx="0" cy="-80" rx="80" ry="24" fill="${C.purple}"/>` + rect(-80, -80, 160, 160, { rx: 0, fill: C.purple }) + `<ellipse cx="0" cy="-26" rx="80" ry="24" fill="none" stroke="${C.purpleSoft}" stroke-width="4"/><ellipse cx="0" cy="28" rx="80" ry="24" fill="none" stroke="${C.purpleSoft}" stroke-width="4"/><ellipse cx="0" cy="80" rx="80" ry="24" fill="${C.purpleDark}"/>`) +
      [0, 1, 2].map((i) => place(430 + i * 110, 200 + (i % 2) * 40, rect(-50, -70, 100, 140, { rx: 14, fill: C.white, stroke: [C.teal, C.amber, C.pink][i], sw: 3 }) + circle(0, -30, 22, { fill: C.skin[i] }) + `<path d="M-22,-34 Q0,-62 22,-34" fill="${C.hair[i]}"/>` + k.lines(-34, 8, [68, 50, 60], { gap: 14, h: 7 }))).join('') +
      k.arrow(260, 190, 370, 190, { color: C.purple, bend: 30 }),
  },
  {
    slug: 'generador-paleta-colores',
    file: 'crear-paleta-de-colores-online',
    alt: 'Generador de paleta de colores',
    draw: () =>
      k.frame('paleta-colores', { blob: C.pinkSoft, blob2: C.amberSoft }) +
      k.ground(400, 400, 560) +
      place(300, 200, k.swatches(['#1E1B4B', C.purpleDark, C.purple, C.purpleSoft, C.amber], { w: 70, h: 180, gap: 8 })) +
      place(300, 320, ['#1E1B4B', '#5B21B6', '#7C3AED', '#DDD6FE', '#FBBF24'].map((h, i) => text(-156 + i * 78, 0, h, { size: 13, fill: C.slateMid, family: MONO })).join('')) +
      // Paleta de pintor.
      place(620, 230, `<path d="M0,-90 Q90,-90 100,-10 Q108,60 40,70 Q10,72 12,40 Q14,14 -16,14 Q-60,16 -80,-10 Q-100,-90 0,-90 Z" fill="${C.amberSoft}" stroke="${C.amberDark}" stroke-width="4"/>` + [[-40, -50, C.red], [0, -62, C.amber], [40, -48, C.teal], [62, -8, C.purple], [44, 30, C.blue]].map(([x, y, c]) => circle(x, y, 14, { fill: c })).join('')),
  },
  {
    slug: 'selector-de-color',
    file: 'selector-de-color-hex-rgb-online',
    alt: 'Selector de color',
    draw: () =>
      k.frame('selector-color') +
      k.ground(400, 400, 560) +
      // Rueda cromática con gotero.
      place(250, 220, [...Array(12)].map((_, i) => { const a0 = (i / 12) * Math.PI * 2; const a1 = ((i + 1) / 12) * Math.PI * 2; return `<path d="M0,0 L${Math.cos(a0) * 120},${Math.sin(a0) * 120} A120,120 0 0,1 ${Math.cos(a1) * 120},${Math.sin(a1) * 120} Z" fill="hsl(${i * 30},75%,58%)"/>` }).join('') + circle(0, 0, 44, { fill: C.white }) + circle(0, 0, 30, { fill: C.purple })) +
      place(380, 110, `<path d="M0,0 L-70,70" stroke="${C.slate}" stroke-width="12" stroke-linecap="round"/>` + rect(-12, -40, 24, 44, { rx: 8, fill: C.slate }).replace('<rect', '<rect transform="rotate(45)"') + circle(-74, 74, 8, { fill: C.purple })) +
      place(600, 220, [['HEX', '#7C3AED'], ['RGB', '124, 58, 237'], ['HSL', '262°, 83%, 58%']].map(([t, v], i) => place(0, -70 + i * 70, rect(-130, -26, 260, 52, { rx: 12, fill: C.white, stroke: C.purple, sw: 3 }) + text(-110, 7, t, { size: 15, fill: C.slateMid, anchor: 'start' }) + text(110, 7, v, { size: 17, fill: C.slate, anchor: 'end', family: MONO }))).join('')),
  },
  {
    slug: 'conversor-hex-rgb',
    file: 'convertir-color-hex-a-rgb',
    alt: 'Conversor HEX a RGB',
    draw: () =>
      k.frame('hex-rgb', { blob2: C.tealSoft }) +
      k.ground(400, 400, 560) +
      place(210, 220, rect(-120, -80, 240, 160, { rx: 20, fill: '#FF5733' }) + rect(-100, 34, 200, 34, { rx: 8, fill: C.white, o: 0.9 }) + text(0, 58, '#FF5733', { size: 22, fill: C.slate, family: MONO })) +
      k.arrow(350, 220, 440, 220, { color: C.purple, bend: 20 }) +
      // Tres canales de color.
      place(590, 220, [['R', 255, '#EF4444'], ['G', 87, '#22C55E'], ['B', 51, '#3B82F6']].map(([l, v, c], i) => place(0, -70 + i * 70, circle(-110, 0, 22, { fill: c }) + text(-110, 7, l, { size: 18, fill: C.white }) + rect(-76, -10, 200, 20, { rx: 10, fill: C.purpleXs }) + rect(-76, -10, (v / 255) * 200, 20, { rx: 10, fill: c }) + text(148, 7, String(v), { size: 18, fill: C.slate }))).join('')),
  },
  {
    slug: 'imagen-a-base64',
    file: 'convertir-imagen-a-base64-online',
    alt: 'Imagen a Base64',
    draw: () =>
      k.frame('imagen-base64', { blob2: C.amberSoft }) +
      k.ground(400, 400, 560) +
      place(220, 220, k.imageIcon({ w: 220, h: 170 })) +
      k.arrow(350, 220, 440, 220, { color: C.purple, bend: 26 }) +
      place(590, 220, rect(-140, -100, 280, 200, { rx: 16, fill: DARK }) + text(-120, -64, 'data:image/png;', { size: 16, fill: C.amber, anchor: 'start', family: MONO }) + ['base64,iVBORw0KGgo', 'AAAANSUhEUgAAAAEA', 'AAABCAYAAAAfFcSJ', 'AAAADUlEQVR42mNk…'].map((l, i) => text(-120, -34 + i * 30, l, { size: 16, fill: C.greenSoft, anchor: 'start', family: MONO })).join('')) +
      place(700, 110, k.badge({ r: 26, label: '64', fill: C.teal, size: 18 })),
  },
  {
    slug: 'generador-nombres-bebe',
    file: 'nombres-de-bebe-con-significado',
    alt: 'Nombres de bebé',
    draw: () =>
      k.frame('nombres-bebe', { blob: C.pinkSoft, blob2: C.blueSoft }) +
      k.ground(300, 400, 360) +
      // Cuna con móvil de estrellas y tarjetas de nombres.
      place(290, 290, rect(-130, -60, 260, 110, { rx: 20, fill: C.white, stroke: C.pink, sw: 5 }) + [...Array(7)].map((_, i) => rect(-110 + i * 36, -60, 8, 110, { rx: 4, fill: C.pinkSoft })).join('') + rect(-140, 50, 280, 16, { rx: 8, fill: C.pink }) + circle(-100, 80, 12, { fill: C.slateSoft }) + circle(100, 80, 12, { fill: C.slateSoft })) +
      place(290, 110, `<line x1="-80" y1="0" x2="80" y2="0" stroke="${C.slateMid}" stroke-width="4"/>` + [-80, -26, 26, 80].map((x, i) => `<line x1="${x}" y1="0" x2="${x}" y2="${30 + (i % 2) * 20}" stroke="${C.slateSoft}" stroke-width="2"/>` + k.sparkle(x, 42 + (i % 2) * 20, 13, [C.amber, C.blue, C.pink, C.teal][i])).join('')) +
      place(590, 160, k.pill({ w: 170, h: 50, label: 'Sofía', fill: C.pink, size: 24 })) + place(610, 230, k.pill({ w: 170, h: 50, label: 'Mateo', fill: C.blue, size: 24 })) + place(590, 300, k.pill({ w: 170, h: 50, label: 'Xóchitl', fill: C.purple, size: 24 })) +
      place(700, 360, k.heart({ fill: C.pink, s: 0.6 })),
  },
  {
    slug: 'generador-apodos',
    file: 'generador-de-apodos-originales',
    alt: 'Generador de apodos',
    draw: () =>
      k.frame('apodos', { blob: C.amberSoft, blob2: C.pinkSoft }) +
      k.ground(260, 400, 300) +
      place(250, 310, k.person({ shirt: C.purple, pose: 'wave', skin: 3, hair: 3 }), { s: 1.05 }) +
      // Etiqueta de nombre «Hola, me llaman…».
      place(250, 250, rect(-44, -28, 88, 56, { rx: 8, fill: C.red }) + rect(-40, -6, 80, 30, { rx: 4, fill: C.white }) + text(0, -12, 'HOLA', { size: 11, fill: C.white }) + text(0, 15, 'Pepe', { size: 16, fill: C.slate })) +
      place(520, 130, k.bubble({ w: 160, h: 56, label: 'Lupita', size: 22 })) + place(610, 220, k.bubble({ w: 180, h: 56, label: 'xXShadowXx', size: 18, stroke: C.teal })) + place(540, 310, k.bubble({ w: 150, h: 56, label: 'Memo', size: 22, stroke: C.amberDark })),
  },
  {
    slug: 'generador-nombres-empresa',
    file: 'ideas-de-nombres-para-empresas-y-negocios',
    alt: 'Generador de nombres para empresas',
    draw: () =>
      k.frame('nombres-empresa') +
      k.ground(400, 400, 560) +
      // Tienda con toldo y letrero en blanco listo para el nombre.
      place(260, 250, rect(-150, -40, 300, 170, { rx: 8, fill: C.white, stroke: C.purple, sw: 4 }) + [...Array(6)].map((_, i) => `<path d="M${-150 + i * 50},-40 H${-100 + i * 50} V0 Q${-125 + i * 50},30 ${-150 + i * 50},0 Z" fill="${i % 2 ? C.white : C.purple}" stroke="${C.purple}" stroke-width="2"/>`).join('') + rect(-120, -110, 240, 56, { rx: 12, fill: C.amber }) + text(0, -74, 'Tu marca', { size: 26, fill: C.slate }) + rect(-40, 50, 80, 80, { rx: 6, fill: C.blueSoft, stroke: C.purple, sw: 3 }) + rect(-130, 30, 70, 60, { rx: 6, fill: C.blueSoft, stroke: C.purple, sw: 3 }) + rect(60, 30, 70, 60, { rx: 6, fill: C.blueSoft, stroke: C.purple, sw: 3 })) +
      place(600, 150, k.bulb({}), { s: 0.8 }) + place(600, 290, ['Nova Labs', 'Sazón Casa', 'Faro Group'].map((n, i) => place(0, i * 40 - 40, k.pill({ w: 170, h: 32, label: n, fill: [C.purple, C.teal, C.slate][i], size: 15 }))).join('')),
  },
  {
    slug: 'piedra-papel-tijera',
    file: 'jugar-piedra-papel-o-tijera-online',
    alt: 'Piedra, papel o tijera',
    draw: () =>
      k.frame('piedra-papel-tijera', { blob2: C.amberSoft }) +
      k.ground(400, 400, 560) +
      // Tres fichas: piedra, papel y tijera, con flechas de quién gana a quién.
      place(200, 250, circle(0, 0, 80, { fill: C.purpleXs, stroke: C.purple, sw: 5 }) + `<path d="M-40,20 Q-50,-20 -20,-36 Q10,-46 36,-26 Q52,-4 40,24 Q20,40 -10,38 Q-34,36 -40,20 Z" fill="${C.slateMid}"/><path d="M-20,-10 Q0,-20 20,-8" stroke="${C.slateSoft}" stroke-width="4" fill="none"/>` + text(0, 116, 'Piedra', { size: 20, fill: C.slate })) +
      place(400, 170, circle(0, 0, 80, { fill: C.blueSoft, stroke: C.blue, sw: 5 }) + rect(-34, -44, 68, 88, { rx: 4, fill: C.white, stroke: C.slateSoft, sw: 3 }) + k.lines(-24, -30, [48, 40, 48, 34], { gap: 16, h: 6 }) + text(0, -96, 'Papel', { size: 20, fill: C.slate })) +
      place(600, 250, circle(0, 0, 80, { fill: C.redSoft, stroke: C.red, sw: 5 }) + circle(-22, 26, 16, { fill: 'none', stroke: C.red, sw: 7 }) + circle(22, 26, 16, { fill: 'none', stroke: C.red, sw: 7 }) + `<path d="M-14,12 L20,-44 M14,12 L-20,-44" stroke="${C.slate}" stroke-width="7" stroke-linecap="round"/>` + text(0, 116, 'Tijera', { size: 20, fill: C.slate })) +
      k.arrow(250, 180, 320, 150, { color: C.slateMid, bend: 16, sw: 3 }) + k.arrow(480, 150, 550, 180, { color: C.slateMid, bend: 16, sw: 3 }) + k.arrow(530, 300, 270, 300, { color: C.slateMid, bend: -20, sw: 3 }),
  },
  {
    slug: 'generador-equipos',
    file: 'hacer-equipos-aleatorios-online',
    alt: 'Generador de equipos',
    draw: () =>
      k.frame('equipos-aleatorios', { blob2: C.tealSoft }) +
      k.ground(400, 400, 600) +
      // Dos equipos con camisetas de colores y un capitán con estrella.
      [0, 1, 2].map((i) => place(120 + i * 90, 320, k.person({ shirt: C.purple, skin: i, hair: i, long: i === 1 }), { s: 0.75 })).join('') +
      [0, 1, 2].map((i) => place(500 + i * 90, 320, k.person({ shirt: C.teal, skin: (i + 2) % 4, hair: (i + 1) % 4, long: i === 2 }), { s: 0.75 })).join('') +
      place(210, 110, k.pill({ w: 150, h: 44, label: 'Águilas', fill: C.purple, size: 20 })) + place(590, 110, k.pill({ w: 150, h: 44, label: 'Jaguares', fill: C.teal, size: 20 })) +
      place(210, 170, k.sparkle(0, 0, 16, C.amber)) + place(590, 170, k.sparkle(0, 0, 16, C.amber)) +
      place(400, 220, circle(0, 0, 34, { fill: C.white, stroke: C.slate, sw: 4 }) + text(0, 10, 'VS', { size: 24, fill: C.slate })),
  },
  {
    slug: 'tombola-online',
    file: 'tombola-y-bingo-online-gratis',
    alt: 'Tómbola online',
    draw: () =>
      k.frame('tombola-bingo', { blob: C.amberSoft, blob2: C.pinkSoft }) +
      k.ground(300, 400, 360) +
      // Tómbola giratoria con bolas de bingo.
      place(290, 230, circle(0, 0, 120, { fill: C.white, stroke: C.purple, sw: 6 }) + `<path d="M-120,0 H120 M0,-120 V120" stroke="${C.purpleSoft}" stroke-width="4"/>` + [[-50, 40, C.red, '12'], [30, 60, C.blue, '47'], [60, -10, C.amber, '68'], [-20, -50, C.teal, '5']].map(([x, y, c, n]) => place(x, y, k.ball({ n, fill: c, r: 26 }))).join('') + rect(-12, 120, 24, 40, { rx: 4, fill: C.slate }) + rect(-90, 158, 180, 18, { rx: 9, fill: C.slate }) + `<path d="M120,0 H170 V60" stroke="${C.slate}" stroke-width="10" fill="none" stroke-linecap="round"/>`) +
      place(600, 160, k.ball({ n: '42', letter: 'G', fill: C.green, r: 60 })) +
      place(600, 320, k.table({ cols: 5, rows: 3, w: 200, h: 110, head: C.purple })),
  },
  {
    slug: 'verdad-o-reto',
    file: 'preguntas-de-verdad-o-reto-online',
    alt: 'Verdad o reto',
    draw: () =>
      k.frame('verdad-reto', { blob: C.pinkSoft, blob2: C.blueSoft }) +
      k.ground(400, 400, 560) +
      // Dos cartas volteadas: verdad y reto, con botella girando.
      place(250, 220, rect(-100, -130, 200, 260, { rx: 20, fill: C.blue }) + rect(-84, -114, 168, 228, { rx: 14, fill: 'none', stroke: C.blueSoft, sw: 3 }) + text(0, -10, 'VERDAD', { size: 30, fill: C.white }) + text(0, 40, '?', { size: 60, fill: C.blueSoft }), { r: -8 }) +
      place(550, 220, rect(-100, -130, 200, 260, { rx: 20, fill: C.red }) + rect(-84, -114, 168, 228, { rx: 14, fill: 'none', stroke: C.redSoft, sw: 3 }) + text(0, -10, 'RETO', { size: 34, fill: C.white }) + text(0, 44, '!', { size: 60, fill: C.redSoft }), { r: 8 }) +
      place(400, 360, `<path d="M-70,-10 Q-70,-24 -40,-24 H30 L60,-12 H80 V12 H60 L30,24 H-40 Q-70,24 -70,10 Z" fill="${C.green}"/>`, { r: -14 }),
  },
  {
    slug: 'ideas-para-historias',
    file: 'generador-de-ideas-para-escribir-historias',
    alt: 'Ideas para historias',
    draw: () =>
      k.frame('ideas-historias', { blob: C.amberSoft }) +
      k.ground(400, 400, 560) +
      // Libro abierto del que salen un castillo, un cohete y una lupa.
      place(360, 300, `<path d="M-200,-40 Q-100,-80 0,-40 Q100,-80 200,-40 V60 Q100,20 0,60 Q-100,20 -200,60 Z" fill="${C.white}" stroke="${C.purple}" stroke-width="5"/><path d="M0,-40 V60" stroke="${C.purple}" stroke-width="4"/>` + k.lines(-170, -20, [140, 120, 130], { gap: 18 }) + k.lines(30, -20, [140, 120, 130], { gap: 18 })) +
      place(240, 150, `<path d="M-40,40 V-10 L-24,-10 V-26 L-8,-26 V-10 H8 V-26 H24 V-10 L40,-10 V40 Z" fill="${C.purpleSoft}" stroke="${C.purple}" stroke-width="3"/>` + rect(-10, 14, 20, 26, { rx: 8, fill: C.purple })) +
      place(380, 120, `<path d="M0,-60 Q24,-30 22,20 H-22 Q-24,-30 0,-60 Z" fill="${C.red}"/>` + circle(0, -14, 9, { fill: C.blueSoft }) + `<path d="M-22,6 L-38,30 H-22 Z M22,6 L38,30 H22 Z" fill="${C.amber}"/><path d="M-12,22 Q0,52 12,22 Z" fill="${C.orange}"/>`) +
      place(510, 160, k.magnifier({ r: 28 }), { r: -10 }) + place(640, 260, k.pencil({ l: 160 }), { r: -60 }) +
      place(650, 110, k.sparkle(0, 0, 18, C.amber)),
  },
]
