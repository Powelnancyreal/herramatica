// Escenas: salud, desarrollo, azar y conversores (lote 1, segunda parte).
const k = require('./kit')
const { C, place, text, rect, circle } = k

const MONO = 'Courier New, monospace'

module.exports = [
  {
    slug: 'validador-iban',
    file: 'validar-numero-iban-cuenta-bancaria',
    alt: 'Validador IBAN',
    draw: () =>
      k.frame('iban-banco', { blob2: C.greenSoft }) +
      k.ground(400, 395, 480) +
      // Fachada de banco con columnas y la tarjeta IBAN validada.
      place(210, 250, `<path d="M-120,-60 L0,-130 L120,-60 Z" fill="${C.purple}"/>` + rect(-110, -60, 220, 16, { rx: 3, fill: C.purpleDark }) + [-80, -27, 27, 80].map((x) => rect(x - 12, -40, 24, 120, { rx: 4, fill: C.purpleSoft })).join('') + rect(-120, 80, 240, 20, { rx: 4, fill: C.purpleDark })) +
      place(540, 210, rect(-180, -56, 360, 112, { rx: 16, fill: C.white, stroke: C.green, sw: 4 }) + text(-150, -18, 'IBAN', { size: 16, fill: C.slateMid, anchor: 'start' }) + text(0, 22, 'ES91 2100 0418 4502 0005', { size: 21, fill: C.slate, family: MONO })) +
      place(700, 160, k.check({ r: 28 })) + place(560, 330, k.flag('EU', 90)),
  },
  {
    slug: 'calculadora-ovulacion',
    file: 'calcular-dias-fertiles-y-ovulacion',
    alt: 'Calculadora de ovulación',
    draw: () =>
      k.frame('ovulacion-fertil', { blob: C.pinkSoft, blob2: C.purpleXs }) +
      k.ground(390, 395, 460) +
      place(260, 225, k.calendar({ w: 250, h: 220, head: C.pink, month: 'CICLO', cols: 7, rows: 4, mark: [11, 12, 13, 14, 15], markColor: C.pink })) +
      place(560, 200, circle(0, 0, 70, { fill: C.white, stroke: C.pink, sw: 5 }) + k.heart({ fill: C.pink, s: 1.1 })) +
      place(560, 320, k.pill({ w: 190, label: 'Días fértiles', fill: C.pink })) + place(680, 120, k.sparkle(0, 0, 16, C.amber)),
  },
  {
    slug: 'calculadora-tmb',
    file: 'calcular-metabolismo-basal-tmb',
    alt: 'Calculadora TMB',
    draw: () =>
      k.frame('tmb-metabolismo', { blob: C.amberSoft, blob2: C.redSoft }) +
      k.ground(400, 395, 460) +
      // Cuerpo en reposo quemando energía: llama y kilocalorías.
      place(250, 300, k.person({ shirt: C.orange, skin: 3 }), { s: 1.05 }) +
      place(430, 200, `<path d="M0,-80 Q50,-30 36,20 Q26,60 0,64 Q-26,60 -36,20 Q-44,-20 -10,-50 Q-4,-20 12,-18 Q10,-50 0,-80 Z" fill="${C.orange}"/><path d="M0,-20 Q24,8 16,34 Q10,50 0,50 Q-12,50 -16,34 Q-20,14 0,-20 Z" fill="${C.amber}"/>`) +
      place(610, 210, rect(-100, -60, 200, 120, { rx: 18, fill: C.white, stroke: C.orange, sw: 4 }) + text(0, -12, 'TMB', { size: 20, fill: C.slateMid }) + text(0, 30, '1,650 kcal', { size: 30, fill: C.orange })),
  },
  {
    slug: 'calculadora-grasa-corporal',
    file: 'calcular-porcentaje-de-grasa-corporal',
    alt: 'Calculadora de grasa corporal',
    draw: () =>
      k.frame('grasa-corporal', { blob2: C.tealSoft }) +
      k.ground(380, 395, 460) +
      place(230, 290, k.person({ shirt: C.teal, hair: 2 }), { s: 1.05 }) +
      // Cinta métrica alrededor de la cintura.
      `<path d="M185,262 Q230,284 276,262" fill="none" stroke="${C.amber}" stroke-width="9"/>` + place(300, 270, rect(0, -7, 60, 14, { rx: 4, fill: C.amber })) +
      place(530, 210, k.pie({ r: 90, parts: [[0.22, C.amber], [0.78, C.tealSoft]], hole: 50 }) + text(0, 10, '22%', { size: 30, fill: C.slate })) +
      place(660, 330, k.ruler({ w: 200 }), { r: -20 }),
  },
  {
    slug: 'calculadora-agua-diaria',
    file: 'cuanta-agua-debo-tomar-al-dia',
    alt: 'Calculadora de agua diaria',
    draw: () =>
      k.frame('agua-diaria', { blob: C.blueSoft, blob2: C.tealSoft }) +
      k.ground(400, 400, 460) +
      // Botella medidora con marcas y vasos.
      place(270, 230, rect(-50, -130, 100, 250, { rx: 30, fill: C.white, stroke: C.blue, sw: 5 }) + rect(-44, -20, 88, 134, { rx: 24, fill: C.blue, o: 0.35 }) + rect(-24, -160, 48, 34, { rx: 8, fill: C.blue }) + [0, 1, 2, 3].map((i) => rect(20, -90 + i * 50, 22, 4, { rx: 2, fill: C.blue })).join('')) +
      [0, 1, 2, 3, 4].map((i) => place(420 + i * 62, 320, `<path d="M-22,-34 L-18,30 H18 L22,-34 Z" fill="${i < 3 ? C.blueSoft : C.white}" stroke="${C.blue}" stroke-width="3"/>`)).join('') +
      place(560, 130, k.droplet({ s: 0.9 })) + text(560, 238, '2.4 L', { size: 30, fill: C.blue }),
  },
  {
    slug: 'formateador-json',
    file: 'formatear-y-validar-json-online',
    alt: 'Formateador JSON',
    draw: () =>
      k.frame('json-formato') +
      k.ground(400, 400, 560) +
      place(240, 220, k.browser({ w: 260, h: 220, accent: C.slateMid, content: text(-110, -40, '{"a":1,"b":[2,3],"c":{"d":"x"}}', { size: 12, fill: C.slateMid, anchor: 'start', family: MONO }) + k.codeLines(-110, -10, [[[0, 180, C.slateSoft]], [[0, 150, C.slateSoft]], [[0, 190, C.slateSoft]]], { gap: 24 }) })) +
      k.arrow(385, 220, 440, 220, { color: C.purple, bend: 0 }) +
      place(590, 220, k.browser({ w: 260, h: 220, content: text(-110, -44, '{', { size: 22, fill: C.purple, anchor: 'start', family: MONO }) + k.codeLines(-90, -30, [[[0, 40, C.purple], [48, 60, C.green]], [[0, 40, C.purple], [48, 40, C.amber]], [[0, 40, C.purple], [48, 80, C.blue]]], { gap: 26 }) + text(-110, 64, '}', { size: 22, fill: C.purple, anchor: 'start', family: MONO }) })) +
      place(700, 110, k.check({ r: 26 })),
  },
  {
    slug: 'codificador-base64',
    file: 'codificar-y-decodificar-base64-online',
    alt: 'Codificador Base64',
    draw: () =>
      k.frame('base64-codifica', { blob2: C.tealSoft }) +
      k.ground(400, 395, 520) +
      place(210, 220, rect(-110, -70, 220, 140, { rx: 16, fill: C.white, stroke: C.purple, sw: 4 }) + text(0, 10, 'Hola', { size: 44, fill: C.slate })) +
      // Engranaje central que transforma el texto.
      place(400, 220, circle(0, 0, 38, { fill: C.purple }) + [...Array(8)].map((_, i) => rect(-9, -54, 18, 22, { rx: 4, fill: C.purple }).replace('<rect', `<rect transform="rotate(${i * 45})"`)).join('') + circle(0, 0, 14, { fill: C.white })) +
      k.arrow(320, 150, 480, 150, { color: C.teal, bend: 30 }) + k.arrow(480, 300, 320, 300, { color: C.amberDark, bend: -30 }) +
      place(600, 220, rect(-120, -70, 240, 140, { rx: 16, fill: '#1E1B4B' }) + text(0, 12, 'SG9sYQ==', { size: 30, fill: C.greenSoft, family: MONO })),
  },
  {
    slug: 'generador-uuid',
    file: 'generar-uuid-v4-online',
    alt: 'Generador UUID',
    draw: () =>
      k.frame('uuid-unico') +
      k.ground(400, 400, 560) +
      [0, 1, 2].map((i) => place(380 + i * 18, 150 + i * 70, rect(-250, -26, 500, 52, { rx: 14, fill: i === 1 ? C.purple : C.white, stroke: C.purple, sw: 3 }) + text(0, 8, ['3f2b9c1e-7a4d-4e8b-9c21-5d6f0a1b2c3d', '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', '6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b'][i], { size: 19, fill: i === 1 ? C.white : C.slate, family: MONO }))).join('') +
      place(120, 330, k.badge({ r: 38, label: 'v4', fill: C.amber, tc: C.slate })) + place(690, 360, k.badge({ r: 30, label: 'v7', fill: C.teal })),
  },
  {
    slug: 'probador-regex',
    file: 'probar-expresiones-regulares-online',
    alt: 'Probador regex',
    draw: () =>
      k.frame('regex-patron', { blob2: C.amberSoft }) +
      k.ground(400, 400, 560) +
      place(400, 130, k.pill({ w: 360, h: 56, label: '/\\d{3}-\\d{4}/g', fill: '#1E1B4B', tc: C.amber, size: 26 })) +
      // Texto con coincidencias resaltadas.
      place(400, 270, rect(-280, -70, 560, 140, { rx: 16, fill: C.white, stroke: C.purple, sw: 3 }) + rect(-189, -38, 112, 34, { rx: 6, fill: C.amberSoft }) + rect(-136, 10, 112, 34, { rx: 6, fill: C.amberSoft }) + text(-250, -14, 'Tel: 555-1234 y', { size: 22, fill: C.slate, anchor: 'start', family: MONO }) + text(-250, 34, 'oficina: 555-9876.', { size: 22, fill: C.slate, anchor: 'start', family: MONO })) +
      place(690, 120, k.magnifier({ r: 34 })),
  },
  {
    slug: 'generador-hash',
    file: 'generar-hash-md5-sha256-online',
    alt: 'Generador de hash',
    draw: () =>
      k.frame('hash-sha256', { blob2: C.greenSoft }) +
      k.ground(400, 395, 520) +
      place(190, 230, k.doc({ w: 150, h: 190, title: 'ARCHIVO' })) +
      place(400, 220, k.lock({ fill: C.purple }), { s: 1.3 }) +
      k.arrow(275, 230, 340, 230, { color: C.slateMid, bend: 0 }) + k.arrow(460, 230, 520, 230, { color: C.slateMid, bend: 0 }) +
      place(640, 200, rect(-110, -80, 220, 160, { rx: 16, fill: '#1E1B4B' }) + text(0, -38, 'SHA-256', { size: 18, fill: C.amber }) + ['a3f5 9c2e 71b0', '4d8e 02fa c61b', 'e97d 3f10 8a2c'].map((l, i) => text(0, -4 + i * 28, l, { size: 18, fill: C.greenSoft, family: MONO })).join('')) +
      place(640, 330, k.pill({ w: 110, label: 'MD5', fill: C.teal })),
  },
  {
    slug: 'generador-lorem-ipsum',
    file: 'generar-texto-lorem-ipsum-de-relleno',
    alt: 'Generador lorem ipsum',
    draw: () =>
      k.frame('lorem-ipsum', { blob2: C.pinkSoft }) +
      k.ground(400, 400, 560) +
      // Maqueta de página con bloques de texto de relleno.
      place(330, 220, k.browser({ w: 380, h: 260, content: place(-90, -52, k.imageIcon({ w: 130, h: 76 })) + text(10, -70, 'Lorem ipsum', { size: 22, fill: C.slate, anchor: 'start' }) + k.lines(10, -50, [150, 130, 160]) + k.lines(-170, 20, [340, 300, 330, 260], { gap: 18 })  })) +
      place(640, 170, rect(-80, -70, 160, 140, { rx: 18, fill: C.purple }) + text(0, 16, '“ ”', { size: 60, fill: C.white })) +
      place(640, 330, k.pencil({ l: 170 }), { r: -18 }),
  },
  {
    slug: 'validador-email',
    file: 'validar-correo-electronico-online',
    alt: 'Validador de email',
    draw: () =>
      k.frame('email-valido', { blob2: C.greenSoft }) +
      k.ground(400, 400, 520) +
      place(260, 220, k.envelope({ w: 230 })) + place(350, 150, k.check({ r: 30 })) +
      place(580, 170, rect(-150, -30, 300, 60, { rx: 30, fill: C.white, stroke: C.green, sw: 3 }) + text(0, 8, 'ana@gmail.com', { size: 22, fill: C.slate })) +
      place(580, 270, rect(-150, -30, 300, 60, { rx: 30, fill: C.white, stroke: C.red, sw: 3 }) + text(-10, 8, 'ana@gmial.con', { size: 22, fill: C.slateMid }) + place(125, 0, k.cross({ r: 18 }))) +
      place(580, 340, text(0, 0, '¿Quisiste decir gmail.com?', { size: 16, fill: C.amberDark })),
  },
  {
    slug: 'contador-caracteres',
    file: 'contar-caracteres-de-un-texto-online',
    alt: 'Contador de caracteres',
    draw: () =>
      k.frame('contador-caracteres') +
      k.ground(400, 400, 560) +
      place(300, 220, rect(-200, -110, 400, 220, { rx: 18, fill: C.white, stroke: C.purple, sw: 4 }) + ['A', 'b', 'c', '1', '2', '!', 'ñ', 'é'].map((ch, i) => place(-150 + (i % 4) * 100, -52 + Math.floor(i / 4) * 90, rect(-34, -34, 68, 68, { rx: 12, fill: [C.purpleXs, C.blueSoft, C.amberSoft, C.greenSoft][i % 4] }) + text(0, 12, ch, { size: 32, fill: C.slate }))).join('')) +
      place(620, 180, rect(-90, -60, 180, 120, { rx: 18, fill: C.purple }) + text(0, -10, 'Caracteres', { size: 16, fill: C.purpleSoft }) + text(0, 34, '155/160', { size: 34, fill: C.white })) +
      place(620, 320, k.pill({ w: 160, label: 'SMS: 1', fill: C.teal })),
  },
  {
    slug: 'sorteo-online',
    file: 'hacer-sorteo-de-nombres-online',
    alt: 'Sorteo online',
    draw: () =>
      k.frame('sorteo-nombres', { blob: C.amberSoft, blob2: C.pinkSoft }) +
      k.ground(400, 400, 480) +
      // Urna transparente con papelitos y el ganador.
      place(280, 240, circle(0, 0, 120, { fill: C.white, stroke: C.purple, sw: 5, o: 0.95 }) + [[-50, -30, C.amber, 20], [20, 40, C.pink, -30], [50, -40, C.teal, 40], [-30, 60, C.blue, 10], [0, -70, C.purpleSoft, -15]].map(([x, y, c, r]) => place(x, y, rect(-30, -14, 60, 28, { rx: 4, fill: c }), { r })).join('') + rect(-40, 110, 80, 40, { rx: 8, fill: C.purple })) +
      place(580, 190, k.trophy({}), { s: 0.9 }) + place(580, 320, k.pill({ w: 220, h: 50, label: '¡Ganó Ana!', fill: C.purple, size: 22 })) +
      place(460, 110, k.sparkle(0, 0, 18, C.amber)) + place(700, 250, k.sparkle(0, 0, 14, C.pink)),
  },
  {
    slug: 'generador-numeros-aleatorios',
    file: 'generar-numeros-aleatorios-y-dados-online',
    alt: 'Generador de números aleatorios',
    draw: () =>
      k.frame('numeros-aleatorios', { blob2: C.amberSoft }) +
      k.ground(400, 400, 520) +
      place(220, 250, k.dice({ n: 5, s: 110 }), { r: -14 }) + place(360, 290, k.dice({ n: 3, s: 90, dot: C.red }), { r: 16 }) +
      place(590, 190, rect(-140, -70, 280, 140, { rx: 18, fill: C.white, stroke: C.purple, sw: 4 }) + ['17', '42', '8', '93'].map((n, i) => place(-96 + i * 64, 0, circle(0, 0, 26, { fill: [C.purple, C.teal, C.amber, C.pink][i] }) + text(0, 8, n, { size: 20, fill: C.white }))).join('')) +
      place(590, 320, k.pill({ w: 200, label: 'del 1 al 100', fill: C.slate })),
  },
  {
    slug: 'cara-o-cruz',
    file: 'lanzar-moneda-cara-o-cruz-online',
    alt: 'Cara o cruz',
    draw: () =>
      k.frame('cara-cruz', { blob: C.amberSoft }) +
      k.ground(400, 400, 360) +
      // Moneda en el aire con estela de giro.
      `<path d="M300,330 Q330,160 400,130" fill="none" stroke="${C.slateSoft}" stroke-width="4" stroke-dasharray="10 12"/>` +
      place(420, 150, `<ellipse cx="0" cy="0" rx="80" ry="80" fill="${C.amber}" stroke="${C.amberDark}" stroke-width="5"/>` + circle(0, 0, 62, { fill: 'none', stroke: C.amberDark, sw: 2, o: 0.5 }) + text(0, 14, 'CARA', { size: 28, fill: C.amberDark }), { r: 12 }) +
      place(250, 300, k.bubble({ w: 180, h: 64, label: '¿Cara o cruz?', size: 20 })) +
      place(620, 320, `<ellipse cx="0" cy="0" rx="56" ry="56" fill="${C.slateSoft}" stroke="${C.slateMid}" stroke-width="4"/>` + text(0, 10, 'CRUZ', { size: 20, fill: C.slate })),
  },
  {
    slug: 'temporizador-online',
    file: 'temporizador-cuenta-regresiva-online',
    alt: 'Temporizador online',
    draw: () =>
      k.frame('temporizador-cuenta') +
      k.ground(400, 400, 460) +
      place(280, 230, k.stopwatch({ r: 110, frac: 0.7 })) +
      place(560, 200, rect(-120, -60, 240, 120, { rx: 20, fill: '#1E1B4B' }) + text(0, 22, '05:00', { size: 58, fill: C.greenSoft, family: MONO })) +
      place(560, 320, k.pill({ w: 150, label: '▶ Iniciar', fill: C.purple })) +
      place(690, 110, `<path d="M-24,10 Q-24,-24 0,-28 Q24,-24 24,10 L32,22 H-32 Z" fill="${C.amber}"/>` + circle(0, 30, 8, { fill: C.amber })),
  },
  {
    slug: 'conversor-criptomonedas',
    file: 'convertir-bitcoin-a-pesos-y-dolares',
    alt: 'Conversor de criptomonedas',
    draw: () =>
      k.frame('cripto-bitcoin', { blob: C.amberSoft, blob2: C.blueSoft }) +
      k.ground(400, 400, 520) +
      place(230, 220, k.coin({ r: 90, label: '₿', fill: C.orange, rim: '#C2410C', tc: C.white })) +
      place(360, 330, k.coin({ r: 44, label: 'Ξ', fill: '#818CF8', rim: C.purpleDark, tc: C.white })) +
      k.arrow(340, 170, 470, 170, { color: C.purple, bend: 36 }) + k.arrow(470, 240, 340, 240, { color: C.teal, bend: -36 }) +
      place(600, 210, k.bill({ w: 160, h: 86, label: 'MXN' })) + place(640, 320, k.bill({ w: 140, h: 76, fill: C.blueSoft, stroke: C.blue, label: 'USD' }), { r: 8 }),
  },
  {
    slug: 'conversor-zona-horaria',
    file: 'convertir-hora-entre-paises',
    alt: 'Conversor de zona horaria',
    draw: () =>
      k.frame('zona-horaria') +
      k.ground(400, 400, 520) +
      place(400, 220, k.globe({ r: 100 })) +
      place(170, 190, k.clock({ r: 64, h: 9, m: 0 })) + text(170, 290, 'CDMX', { size: 20, fill: C.slate }) +
      place(630, 190, k.clock({ r: 64, h: 4, m: 0, stroke: C.purple })) + text(630, 290, 'Madrid', { size: 20, fill: C.slate }) +
      k.arrow(250, 150, 550, 150, { color: C.amberDark, bend: 60, dash: '10 10' }) + place(400, 350, k.pill({ w: 140, label: '+8 horas', fill: C.amber, tc: C.slate })),
  },
  {
    slug: 'kilos-a-libras',
    file: 'convertir-kilos-a-libras',
    alt: 'Kilos a libras',
    draw: () =>
      k.frame('kilos-libras', { blob2: C.greenSoft }) +
      k.ground(400, 400, 520) +
      // Pesas: kilogramo y libras.
      place(240, 250, `<path d="M-70,70 L-50,-40 H50 L70,70 Z" fill="${C.slate}"/>` + rect(-24, -70, 48, 34, { rx: 17, fill: 'none', stroke: C.slate, sw: 10 }) + text(0, 30, '1 kg', { size: 34, fill: C.white })) +
      text(400, 244, '=', { size: 56, fill: C.purple }) +
      place(560, 250, `<path d="M-60,60 L-44,-30 H44 L60,60 Z" fill="${C.purple}"/>` + rect(-20, -56, 40, 28, { rx: 14, fill: 'none', stroke: C.purple, sw: 9 }) + text(0, 26, '2.2 lb', { size: 28, fill: C.white })) +
      place(690, 330, `<path d="M-30,28 L-22,-14 H22 L30,28 Z" fill="${C.purpleSoft}"/>` + text(0, 16, 'lb', { size: 16, fill: C.purple })),
  },
  {
    slug: 'convertidor-tallas',
    file: 'tabla-de-tallas-de-ropa-y-zapatos-mexico-usa-europa',
    alt: 'Convertidor de tallas',
    draw: () =>
      k.frame('tallas-ropa', { blob: C.pinkSoft }) +
      k.ground(400, 400, 540) +
      // Camiseta y zapato con etiquetas de talla por país.
      place(220, 220, `<path d="M-60,-80 L-100,-50 L-80,-10 L-60,-24 V90 H60 V-24 L80,-10 L100,-50 L60,-80 Q0,-50 -60,-80 Z" fill="${C.purple}"/>` + rect(-30, -10, 60, 34, { rx: 6, fill: C.white }) + text(0, 14, 'M', { size: 22, fill: C.purple })) +
      place(430, 300, `<path d="M-90,20 Q-90,-40 -60,-50 L-40,-20 Q10,-10 60,0 Q96,8 96,30 V40 H-90 Z" fill="${C.teal}"/>` + rect(-90, 34, 186, 14, { rx: 6, fill: C.slate })) +
      place(630, 200, [['MX', '26'], ['US', '8'], ['EU', '41']].map(([c, t], i) => place(0, -70 + i * 70, k.flag(c, 60) + place(70, 0, k.pill({ w: 64, h: 34, label: t, fill: C.white, tc: C.slate, size: 18 })))).join('')),
  },
]
