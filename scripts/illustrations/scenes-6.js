// Escenas: texto y marketing, utilidades (lote 2).
const k = require('./kit')
const { C, place, text, rect, circle } = k

const MONO = 'Courier New, monospace'
const DARK = '#1E1B4B'

module.exports = [
  {
    slug: 'generador-hashtags',
    file: 'generador-de-hashtags-para-instagram',
    alt: 'Generador de hashtags',
    draw: () =>
      k.frame('hashtags', { blob: C.pinkSoft, blob2: C.amberSoft }) +
      k.ground(300, 400, 360) +
      place(270, 220, k.phone({ w: 170, h: 300, content: rect(-72, -120, 144, 140, { rx: 8, fill: `url(#ig)` }) + `<defs><linearGradient id="ig" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.amber}"/><stop offset="0.5" stop-color="${C.pink}"/><stop offset="1" stop-color="${C.purple}"/></linearGradient></defs>` + place(0, -50, k.heart({ fill: C.white, s: 0.9 })) + text(-66, 50, '#tacos', { size: 14, fill: C.blue, anchor: 'start' }) + text(-66, 72, '#comidamexicana', { size: 14, fill: C.blue, anchor: 'start' }) + text(-66, 94, '#foodie', { size: 14, fill: C.blue, anchor: 'start' }) })) +
      place(560, 180, circle(0, 0, 80, { fill: C.purple }) + text(0, 34, '#', { size: 110, fill: C.white })) +
      place(560, 310, ['#viajes', '#cdmx'].map((h, i) => place(i * 120 - 60, 0, k.pill({ w: 110, h: 38, label: h, fill: [C.pink, C.teal][i], size: 16 }))).join('')),
  },
  {
    slug: 'generador-bio-instagram',
    file: 'ideas-de-biografia-para-instagram',
    alt: 'Bio para Instagram',
    draw: () =>
      k.frame('bio-instagram', { blob: C.pinkSoft }) +
      k.ground(400, 400, 520) +
      // Perfil de Instagram con foto, estadísticas y biografía.
      place(400, 220, rect(-250, -140, 500, 280, { rx: 24, fill: C.white, stroke: C.purple, sw: 4 }) + circle(-160, -60, 54, { fill: `url(#ring)` }) + `<defs><linearGradient id="ring" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="${C.amber}"/><stop offset="0.5" stop-color="${C.pink}"/><stop offset="1" stop-color="${C.purple}"/></linearGradient></defs>` + circle(-160, -60, 46, { fill: C.purpleXs }) + place(-160, -46, k.person({ shirt: C.pink, long: true, skin: 1, hair: 1 }), { s: 0.36 }) + [['1,204', 'publicaciones'], ['18.5K', 'seguidores'], ['312', 'seguidos']].map(([n, t], i) => text(-40 + i * 110, -70, n, { size: 22, fill: C.slate }) + text(-40 + i * 110, -48, t, { size: 12, fill: C.slateMid })).join('') + text(-210, 30, 'Lucía · Fotógrafa', { size: 20, fill: C.slate, anchor: 'start' }) + text(-210, 60, 'Historias reales, sin poses', { size: 16, fill: C.slateMid, anchor: 'start' }) + text(-210, 88, 'Guadalajara · Agenda tu sesión', { size: 16, fill: C.slateMid, anchor: 'start' }) + text(230, 118, '138/150', { size: 14, fill: C.green, anchor: 'end' })),
  },
  {
    slug: 'generador-firma-email',
    file: 'crear-firma-de-correo-para-gmail-y-outlook',
    alt: 'Generador de firma de email',
    draw: () =>
      k.frame('firma-email', { blob2: C.blueSoft }) +
      k.ground(400, 400, 560) +
      place(380, 220, k.browser({ w: 540, h: 280, content: k.lines(-240, -90, [300, 260, 320], { gap: 20 }) + text(-240, -10, 'Saludos,', { size: 16, fill: C.slateMid, anchor: 'start' }) + circle(-200, 60, 40, { fill: C.purpleXs }) + place(-200, 76, k.person({ shirt: C.blue, skin: 2 }), { s: 0.28 }) + rect(-150, 20, 4, 90, { rx: 2, fill: C.purple }) + text(-135, 40, 'Laura Méndez', { size: 20, fill: C.slate, anchor: 'start' }) + text(-135, 64, 'Directora comercial · Grupo Horizonte', { size: 14, fill: C.slateMid, anchor: 'start' }) + text(-135, 88, '+52 55 1234 5678 · empresa.com', { size: 14, fill: C.purple, anchor: 'start' }) })) +
      place(728, 250, k.envelope({ w: 90 }), { r: 8 }),
  },
  {
    slug: 'generador-esloganes',
    file: 'ideas-de-esloganes-para-negocios',
    alt: 'Generador de eslóganes',
    draw: () =>
      k.frame('esloganes', { blob2: C.amberSoft }) +
      k.ground(360, 400, 460) +
      // Megáfono con frase publicitaria.
      place(230, 250, `<path d="M-80,-40 L60,-110 V110 L-80,40 Z" fill="${C.purple}"/>` + rect(-110, -44, 40, 88, { rx: 10, fill: C.purpleDark }) + rect(60, -110, 20, 220, { rx: 8, fill: C.amber }) + `<path d="M-90,40 L-70,110 H-40 L-56,40 Z" fill="${C.slate}"/>`) +
      [0, 1, 2].map((i) => `<path d="M${340 + i * 26},${190 - i * 40} Q${360 + i * 30},250 ${340 + i * 26},${310 + i * 40}" fill="none" stroke="${C.amber}" stroke-width="6" stroke-linecap="round"/>`).join('') +
      place(590, 170, k.bubble({ w: 260, h: 80, label: '¡Sabor de casa!', size: 26, stroke: C.purple, tail: 'left' })) +
      place(600, 310, k.pill({ w: 230, h: 44, label: 'Calidad que se nota', fill: C.teal, size: 18 })),
  },
  {
    slug: 'generador-utm',
    file: 'crear-enlaces-con-parametros-utm',
    alt: 'Generador UTM',
    draw: () =>
      k.frame('utm-campanas', { blob2: C.greenSoft }) +
      k.ground(400, 400, 560) +
      place(400, 110, rect(-320, -26, 640, 52, { rx: 26, fill: C.white, stroke: C.purple, sw: 3 }) + text(0, 7, 'tienda.com/?utm_source=facebook&utm_medium=cpc&utm_campaign=buen_fin', { size: 14, fill: C.slate, family: MONO })) +
      // Embudo de fuentes a analítica.
      [['facebook', C.blue], ['google', C.amber], ['email', C.teal]].map(([n, c], i) => place(160, 200 + i * 60, k.pill({ w: 140, h: 40, label: n, fill: c, size: 17 })) + k.arrow(236, 200 + i * 60, 330, 260, { color: C.slateSoft, bend: (i - 1) * -20, sw: 3 })).join('') +
      place(460, 260, `<path d="M-100,-70 H100 L30,20 V80 L-30,100 V20 Z" fill="${C.purple}"/>`) +
      place(650, 270, k.barChart({ vals: [0.8, 0.5, 0.35], w: 150, h: 120, colors: [C.blue, C.amber, C.teal] })),
  },
  {
    slug: 'markdown-a-html',
    file: 'convertir-markdown-a-html-online',
    alt: 'Markdown a HTML',
    draw: () =>
      k.frame('markdown-html') +
      k.ground(400, 400, 560) +
      place(210, 220, rect(-130, -120, 260, 240, { rx: 16, fill: C.white, stroke: C.slateMid, sw: 3 }) + text(-110, -80, '# Título', { size: 20, fill: C.purple, anchor: 'start', family: MONO }) + text(-110, -46, '**negrita**', { size: 18, fill: C.slate, anchor: 'start', family: MONO }) + text(-110, -14, '- lista', { size: 18, fill: C.slate, anchor: 'start', family: MONO }) + text(-110, 18, '- elemento', { size: 18, fill: C.slate, anchor: 'start', family: MONO }) + text(-110, 50, '[enlace](url)', { size: 18, fill: C.blue, anchor: 'start', family: MONO }) + place(84, 90, rect(-40, -20, 80, 40, { rx: 8, fill: C.slate }) + text(0, 8, 'M↓', { size: 20, fill: C.white }))) +
      k.arrow(355, 220, 440, 220, { color: C.purple, bend: 26 }) +
      place(590, 220, rect(-140, -120, 280, 240, { rx: 16, fill: DARK }) + ['<h1>Título</h1>', '<strong>negrita</strong>', '<ul>', '  <li>lista</li>', '</ul>'].map((l, i) => text(-120, -76 + i * 32, l.replace(/ /g, '&#160;'), { size: 16, fill: [C.amber, C.greenSoft, C.pink, C.greenSoft, C.pink][i], anchor: 'start', family: MONO })).join('') + text(0, 108, '</>', { size: 20, fill: C.purpleSoft })),
  },
  {
    slug: 'validar-curp',
    file: 'validar-curp-online-gratis',
    alt: 'Validar CURP',
    draw: () =>
      k.frame('validar-curp', { blob2: C.greenSoft }) +
      k.ground(400, 400, 560) +
      // Credencial con la CURP resaltada y validada.
      place(320, 220, rect(-220, -130, 440, 260, { rx: 20, fill: C.white, stroke: C.green, sw: 4 }) + rect(-220, -130, 440, 50, { rx: 20, fill: C.green }) + rect(-220, -96, 440, 16, { rx: 0, fill: C.green }) + text(0, -97, 'CLAVE ÚNICA DE REGISTRO DE POBLACIÓN', { size: 15, fill: C.white }) + rect(-196, -60, 110, 130, { rx: 10, fill: C.purpleXs }) + place(-141, 36, k.person({ shirt: C.purple, skin: 1 }), { s: 0.42 }) + k.lines(-66, -54, [230, 180, 200], { gap: 22 }) + rect(-66, 20, 266, 46, { rx: 10, fill: C.amberSoft }) + text(67, 51, 'GODE561231HDFRRN04', { size: 20, fill: C.slate, family: MONO })) +
      place(600, 130, k.check({ r: 34 })) + place(640, 320, k.flag('MX', 90)),
  },
  {
    slug: 'dividir-cuenta',
    file: 'dividir-la-cuenta-del-restaurante-con-propina',
    alt: 'Dividir la cuenta',
    draw: () =>
      k.frame('dividir-cuenta', { blob: C.amberSoft, blob2: C.greenSoft }) +
      k.ground(400, 400, 560) +
      // Ticket de restaurante partido en cuatro.
      place(400, 200, rect(-90, -130, 180, 250, { rx: 6, fill: C.white, stroke: C.slateSoft, sw: 3 }) + `<path d="M-90,120 l15,14 l15,-14 l15,14 l15,-14 l15,14 l15,-14 l15,14 l15,-14 l15,14 l15,-14 l15,14 l15,-14" fill="${C.white}" stroke="${C.slateSoft}" stroke-width="3"/>` + text(0, -96, 'CUENTA', { size: 18, fill: C.slate }) + k.lines(-60, -70, [120, 100, 110, 90], { gap: 22 }) + text(-60, 40, 'Propina 10%', { size: 14, fill: C.slateMid, anchor: 'start' }) + text(0, 84, '$1,760', { size: 28, fill: C.purple })) +
      [[140, 170], [140, 320], [660, 170], [660, 320]].map(([x, y], i) => place(x, y, circle(0, 0, 50, { fill: C.purpleXs }) + place(0, 36, k.person({ shirt: [C.purple, C.teal, C.amber, C.pink][i], skin: i, hair: i, long: i % 2 === 1 }), { s: 0.4 }) + place(0, 66, k.pill({ w: 90, h: 30, label: '$440', fill: C.green, size: 15 })))).join(''),
  },
  {
    slug: 'hora-militar',
    file: 'convertir-hora-de-12-a-24-horas',
    alt: 'Hora militar',
    draw: () =>
      k.frame('hora-militar', { blob2: C.tealSoft }) +
      k.ground(400, 400, 560) +
      place(220, 220, k.clock({ r: 110, h: 2, m: 30, stroke: C.slate })) + place(220, 355, k.pill({ w: 130, label: '2:30 p. m.', fill: C.slate })) +
      k.arrow(350, 200, 450, 200, { color: C.purple, bend: 30 }) +
      place(590, 200, rect(-140, -70, 280, 140, { rx: 20, fill: DARK }) + text(0, 30, '14:30', { size: 76, fill: C.greenSoft, family: MONO })) +
      place(590, 330, k.pill({ w: 250, h: 44, label: 'catorce treinta horas', fill: C.teal, size: 17 })),
  },
]
