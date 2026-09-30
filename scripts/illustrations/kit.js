// Kit de ilustración de Herramatica: piezas planas con la paleta del sitio (morado #7C3AED como color de marca).
// Todas las piezas se dibujan centradas en (0, 0); se colocan con place().

const C = {
  purple: '#7C3AED', purpleDark: '#5B21B6', purpleSoft: '#DDD6FE', purpleXs: '#EDE9FE',
  blue: '#2563EB', blueSoft: '#DBEAFE', green: '#059669', greenSoft: '#D1FAE5', teal: '#0D9488', tealSoft: '#CCFBF1',
  amber: '#FBBF24', amberDark: '#D97706', amberSoft: '#FEF3C7', red: '#DC2626', redSoft: '#FEE2E2', pink: '#EC4899', pinkSoft: '#FCE7F3',
  orange: '#F97316', slate: '#334155', slateMid: '#64748B', slateSoft: '#CBD5E1', line: '#E2E8F0', paper: '#F8FAFC', bg: '#F8F7FF', white: '#FFFFFF',
  skin: ['#F2C7A5', '#D9A07A', '#8D5A3B', '#F5D0B5'], hair: ['#1F2937', '#78350F', '#111827', '#B45309'],
}
const FONT = 'Arial, Helvetica, sans-serif'

// Generador pseudoaleatorio determinista por herramienta: la misma herramienta siempre produce el mismo dibujo.
function rng(seed) {
  let h = 2166136261
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  return () => {
    h += 0x6d2b79f5
    let t = h
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const place = (x, y, body, { s = 1, r = 0, o } = {}) =>
  `<g transform="translate(${x},${y})${r ? ` rotate(${r})` : ''}${s !== 1 ? ` scale(${s})` : ''}"${o !== undefined ? ` opacity="${o}"` : ''}>${body}</g>`
// Escapa &, < y > salvo las entidades ya escritas (como &#160;).
const esc = (t) => String(t).replace(/&(?!#?\w+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const text = (x, y, t, { size = 18, fill = C.slate, weight = 700, anchor = 'middle', family = FONT } = {}) =>
  `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${esc(t)}</text>`
const rect = (x, y, w, h, { rx = 10, fill = C.white, stroke, sw = 3, o } = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${sw}"` : ''}${o !== undefined ? ` opacity="${o}"` : ''}/>`
const circle = (x, y, r, { fill = C.white, stroke, sw = 3, o } = {}) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${sw}"` : ''}${o !== undefined ? ` opacity="${o}"` : ''}/>`
const lines = (x, y, widths, { gap = 16, h = 8, fill = C.slateSoft } = {}) => widths.map((w, i) => rect(x, y + i * gap, w, h, { rx: h / 2, fill })).join('')

// ── Fondo con manchas orgánicas, suelo y decoración dispersa ──
function frame(seed, { bg = C.white, blob = C.purpleXs, blob2 = C.blueSoft, deco = true } = {}) {
  const r = rng(seed)
  const bx = 140 + r() * 520
  const by = 120 + r() * 200
  const blobPath = (cx, cy, s) =>
    `<path d="M${cx - 170 * s},${cy} C${cx - 170 * s},${cy - 110 * s} ${cx - 60 * s},${cy - 150 * s} ${cx + 40 * s},${cy - 130 * s} C${cx + 150 * s},${cy - 110 * s} ${cx + 190 * s},${cy - 20 * s} ${cx + 160 * s},${cy + 70 * s} C${cx + 130 * s},${cy + 150 * s} ${cx - 40 * s},${cy + 150 * s} ${cx - 110 * s},${cy + 110 * s} C${cx - 160 * s},${cy + 80 * s} ${cx - 170 * s},${cy + 50 * s} ${cx - 170 * s},${cy} Z"`
  let out = `<rect width="800" height="450" fill="${bg}"/>`
  out += `${blobPath(bx, by, 1.05 + r() * 0.35)} fill="${blob}"/>`
  out += `${blobPath(800 - bx * 0.6, 330 - r() * 60, 0.45 + r() * 0.2)} fill="${blob2}" opacity="0.7"/>`
  if (deco) {
    const pts = [[60, 60], [740, 70], [70, 390], [735, 385], [400, 40], [620, 410], [180, 420]]
    pts.forEach(([x, y], i) => {
      const k = r()
      const xx = x + (r() - 0.5) * 40
      const yy = y + (r() - 0.5) * 30
      if (k < 0.33) out += sparkle(xx, yy, 7 + r() * 5, [C.amber, C.purple, C.teal][i % 3])
      else if (k < 0.66) out += circle(xx, yy, 4 + r() * 4, { fill: [C.purpleSoft, C.amber, C.blueSoft][i % 3] })
      else out += plus(xx, yy, 8, [C.purple, C.teal, C.pink][i % 3])
    })
  }
  return out
}
const ground = (x, y, w, o = 0.07) => `<ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="${w / 14}" fill="#1E1B4B" opacity="${o}"/>`
const sparkle = (x, y, s, fill) =>
  `<path d="M${x},${y - s} Q${x + s * 0.18},${y - s * 0.18} ${x + s},${y} Q${x + s * 0.18},${y + s * 0.18} ${x},${y + s} Q${x - s * 0.18},${y + s * 0.18} ${x - s},${y} Q${x - s * 0.18},${y - s * 0.18} ${x},${y - s} Z" fill="${fill}"/>`
const plus = (x, y, s, stroke) => `<path d="M${x - s},${y} H${x + s} M${x},${y - s} V${y + s}" stroke="${stroke}" stroke-width="3" stroke-linecap="round"/>`
const arrow = (x1, y1, x2, y2, { color = C.purple, bend = 40, sw = 4, dash } = {}) => {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2 - bend
  const ang = Math.atan2(y2 - my, x2 - mx)
  const a1 = ang + Math.PI - 0.5
  const a2 = ang + Math.PI + 0.5
  return `<path d="M${x1},${y1} Q${mx},${my} ${x2},${y2}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/><path d="M${x2 + 14 * Math.cos(a1)},${y2 + 14 * Math.sin(a1)} L${x2},${y2} L${x2 + 14 * Math.cos(a2)},${y2 + 14 * Math.sin(a2)}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`
}

// ── Objetos ──
function calculator({ w = 110, h = 150, accent = C.purple, screen = '1,024', keyAccent = C.amber } = {}) {
  let k = ''
  const cols = 3
  const kw = (w - 36) / cols - 6
  for (let row = 0; row < 3; row++) for (let c = 0; c < cols; c++) {
    const last = row === 2 && c === 2
    k += rect(-w / 2 + 14 + c * (kw + 8), -h / 2 + 62 + row * (kw + 6), kw, kw, { rx: 5, fill: last ? keyAccent : C.purpleSoft })
  }
  return rect(-w / 2, -h / 2, w, h, { rx: 16, fill: C.white, stroke: accent, sw: 4 }) + rect(-w / 2 + 12, -h / 2 + 14, w - 24, 36, { rx: 8, fill: C.slate }) + text(w / 2 - 20, -h / 2 + 39, screen, { size: 16, fill: C.white, anchor: 'end', family: 'Courier New, monospace' }) + k
}

function doc({ w = 150, h = 190, accent = C.purple, head = C.purpleSoft, title, rows = [100, 80, 110, 70, 90], stamp, total } = {}) {
  let out = rect(-w / 2, -h / 2, w, h, { rx: 12, fill: C.paper, stroke: accent, sw: 3 })
  out += rect(-w / 2, -h / 2, w, 36, { rx: 12, fill: head }) + rect(-w / 2, -h / 2 + 24, w, 12, { rx: 0, fill: head })
  if (title) out += text(0, -h / 2 + 24, title, { size: 14, fill: accent })
  out += lines(-w / 2 + 18, -h / 2 + 52, rows.map((r) => Math.min(r, w - 36)))
  if (total) out += rect(-w / 2 + 18, h / 2 - 40, w - 36, 24, { rx: 6, fill: C.amberSoft }) + text(0, h / 2 - 23, total, { size: 14, fill: C.amberDark })
  if (stamp) out += place(w / 2 - 22, h / 2 - 22, circle(0, 0, 20, { fill: C.white, stroke: C.green, sw: 3 }) + `<path d="M-9,0 L-3,7 L10,-7" fill="none" stroke="${C.green}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`)
  return out
}

function coin({ r = 34, label = '$', fill = C.amber, rim = C.amberDark, tc = C.amberDark } = {}) {
  return circle(0, 0, r, { fill, stroke: rim, sw: 3 }) + circle(0, 0, r - 8, { fill: 'none', stroke: rim, sw: 2, o: 0.5 }) + text(0, r * 0.32, label, { size: r * 0.9, fill: tc })
}
function coinStack(n = 4, { w = 70 } = {}) {
  let out = ''
  for (let i = 0; i < n; i++) out += `<ellipse cx="0" cy="${-i * 12}" rx="${w / 2}" ry="12" fill="${C.amber}" stroke="${C.amberDark}" stroke-width="3"/>`
  return out + `<ellipse cx="0" cy="${-(n - 1) * 12}" rx="${w / 2 - 10}" ry="6" fill="none" stroke="${C.amberDark}" stroke-width="2" opacity="0.5"/>`
}
function bill({ w = 120, h = 64, fill = C.greenSoft, stroke = C.green, label = '$' } = {}) {
  return rect(-w / 2, -h / 2, w, h, { rx: 8, fill, stroke, sw: 3 }) + circle(0, 0, h / 3.2, { fill: C.white, stroke, sw: 2 }) + text(0, 7, label, { size: 18, fill: stroke }) + rect(-w / 2 + 10, -h / 2 + 10, 14, 6, { rx: 3, fill: stroke, o: 0.5 }) + rect(w / 2 - 24, h / 2 - 16, 14, 6, { rx: 3, fill: stroke, o: 0.5 })
}
function billStack({ n = 3, label = '$' } = {}) {
  let out = ''
  for (let i = 0; i < n; i++) out += place(i * 8, -i * 10, bill({ label }), { r: -4 + i * 3 })
  return out
}

function calendar({ w = 150, h = 140, head = C.purple, month = '', mark = [], markColor = C.red, cols = 5, rows = 3 } = {}) {
  let out = rect(-w / 2, -h / 2, w, h, { rx: 14, fill: C.white, stroke: head, sw: 4 }) + rect(-w / 2, -h / 2, w, 34, { rx: 14, fill: head }) + rect(-w / 2, -h / 2 + 20, w, 14, { rx: 0, fill: head })
  if (month) out += text(0, -h / 2 + 24, month, { size: 15, fill: C.white })
  out += rect(-w / 2 + 26, -h / 2 - 10, 8, 22, { rx: 4, fill: C.slate }) + rect(w / 2 - 34, -h / 2 - 10, 8, 22, { rx: 4, fill: C.slate })
  const cw = (w - 30) / cols
  const ch = (h - 54) / rows
  let i = 0
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    out += rect(-w / 2 + 15 + c * cw + 3, -h / 2 + 44 + r * ch + 2, cw - 6, ch - 6, { rx: 4, fill: mark.includes(i) ? markColor : C.purpleXs })
    i++
  }
  return out
}

function clock({ r = 60, h = 10, m = 2, stroke = C.blue, fill = C.white } = {}) {
  let ticks = ''
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2
    ticks += `<line x1="${Math.sin(a) * (r - 10)}" y1="${-Math.cos(a) * (r - 10)}" x2="${Math.sin(a) * (r - (i % 3 ? 14 : 18))}" y2="${-Math.cos(a) * (r - (i % 3 ? 14 : 18))}" stroke="${C.slateSoft}" stroke-width="3" stroke-linecap="round"/>`
  }
  const ah = ((h % 12) / 12) * Math.PI * 2 + (m / 60) * (Math.PI / 6)
  const am = (m / 60) * Math.PI * 2
  return circle(0, 0, r, { fill, stroke, sw: 5 }) + ticks + `<line x1="0" y1="0" x2="${Math.sin(ah) * r * 0.45}" y2="${-Math.cos(ah) * r * 0.45}" stroke="${C.slate}" stroke-width="6" stroke-linecap="round"/><line x1="0" y1="0" x2="${Math.sin(am) * r * 0.7}" y2="${-Math.cos(am) * r * 0.7}" stroke="${C.purple}" stroke-width="4" stroke-linecap="round"/>` + circle(0, 0, 6, { fill: C.slate })
}

function stopwatch({ r = 60, color = C.purple, frac = 0.3 } = {}) {
  const a = frac * Math.PI * 2
  const x = Math.sin(a) * (r - 12)
  const y = -Math.cos(a) * (r - 12)
  return rect(-12, -r - 24, 24, 16, { rx: 4, fill: color }) + rect(-5, -r - 10, 10, 12, { rx: 2, fill: color }) + circle(0, 0, r, { fill: C.white, stroke: color, sw: 6 }) + `<path d="M0,0 L0,${-(r - 12)} A${r - 12},${r - 12} 0 ${frac > 0.5 ? 1 : 0},1 ${x},${y} Z" fill="${C.purpleSoft}"/>` + `<line x1="0" y1="0" x2="${x}" y2="${y}" stroke="${C.red}" stroke-width="4" stroke-linecap="round"/>` + circle(0, 0, 6, { fill: C.slate })
}

function phone({ w = 120, h = 220, color = C.slate, screen = C.white, content = '' } = {}) {
  return rect(-w / 2, -h / 2, w, h, { rx: 20, fill: color }) + rect(-w / 2 + 8, -h / 2 + 18, w - 16, h - 36, { rx: 10, fill: screen }) + rect(-16, -h / 2 + 7, 32, 5, { rx: 2.5, fill: C.slateMid }) + content
}

function browser({ w = 300, h = 200, accent = C.purple, content = '', dark = false } = {}) {
  return rect(-w / 2, -h / 2, w, h, { rx: 14, fill: dark ? '#1E1B4B' : C.white, stroke: accent, sw: 3 }) + rect(-w / 2, -h / 2, w, 30, { rx: 14, fill: accent }) + rect(-w / 2, -h / 2 + 16, w, 14, { rx: 0, fill: accent }) + circle(-w / 2 + 18, -h / 2 + 15, 5, { fill: C.redSoft }) + circle(-w / 2 + 34, -h / 2 + 15, 5, { fill: C.amberSoft }) + circle(-w / 2 + 50, -h / 2 + 15, 5, { fill: C.greenSoft }) + content
}

function barChart({ vals = [0.4, 0.7, 0.5, 0.9], w = 180, h = 130, colors = [C.purpleSoft, C.purple, C.blue, C.teal], axis = true } = {}) {
  const bw = w / vals.length - 12
  let out = axis ? `<path d="M${-w / 2},${-h / 2} V${h / 2} H${w / 2}" fill="none" stroke="${C.slateSoft}" stroke-width="3" stroke-linecap="round"/>` : ''
  vals.forEach((v, i) => {
    out += rect(-w / 2 + 12 + i * (bw + 12), h / 2 - v * (h - 10), bw, v * (h - 10), { rx: 6, fill: colors[i % colors.length] })
  })
  return out
}
function pie({ r = 70, parts = [[0.5, C.purple], [0.3, C.blue], [0.2, C.amber]], hole = 0 } = {}) {
  let a0 = -Math.PI / 2
  let out = ''
  for (const [v, c] of parts) {
    const a1 = a0 + v * Math.PI * 2
    const large = v > 0.5 ? 1 : 0
    out += `<path d="M0,0 L${Math.cos(a0) * r},${Math.sin(a0) * r} A${r},${r} 0 ${large},1 ${Math.cos(a1) * r},${Math.sin(a1) * r} Z" fill="${c}" stroke="${C.white}" stroke-width="3"/>`
    a0 = a1
  }
  return out + (hole ? circle(0, 0, hole, { fill: C.white }) : '')
}
function lineChart({ pts = [0.2, 0.35, 0.3, 0.55, 0.5, 0.8], w = 200, h = 120, color = C.green, fillArea = true } = {}) {
  const xy = pts.map((p, i) => [-w / 2 + (i * w) / (pts.length - 1), h / 2 - p * h])
  const d = xy.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ')
  return (fillArea ? `<path d="${d} L${w / 2},${h / 2} L${-w / 2},${h / 2} Z" fill="${color}" opacity="0.15"/>` : '') + `<path d="${d}" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>` + xy.map((p) => circle(p[0], p[1], 5, { fill: C.white, stroke: color, sw: 3 })).join('')
}

// Personaje plano simple (cabeza, cabello, torso); pose: 'stand' | 'wave' | 'hold'
function person({ skin = 0, hair = 0, shirt = C.purple, pants = C.slate, pose = 'stand', long = false, s = 1 } = {}) {
  const sk = C.skin[skin % C.skin.length]
  const hr = C.hair[hair % C.hair.length]
  const armL = pose === 'wave' ? `<path d="M-30,-58 Q-58,-90 -52,-120" stroke="${sk}" stroke-width="13" stroke-linecap="round" fill="none"/>` : `<path d="M-30,-58 Q-44,-20 -36,6" stroke="${sk}" stroke-width="13" stroke-linecap="round" fill="none"/>`
  const armR = pose === 'hold' ? `<path d="M30,-58 Q52,-40 40,-18" stroke="${sk}" stroke-width="13" stroke-linecap="round" fill="none"/>` : `<path d="M30,-58 Q44,-20 36,6" stroke="${sk}" stroke-width="13" stroke-linecap="round" fill="none"/>`
  const body = `<path d="M-32,-70 Q0,-84 32,-70 L36,10 L-36,10 Z" fill="${shirt}"/>` + rect(-30, 8, 26, 70, { rx: 10, fill: pants }) + rect(4, 8, 26, 70, { rx: 10, fill: pants })
  const head = circle(0, -104, 26, { fill: sk }) + `<path d="M-27,-106 Q-26,-138 2,-136 Q28,-136 27,-104 Q18,-122 -4,-120 Q-18,-118 -27,-106 Z" fill="${hr}"/>` + (long ? `<path d="M-27,-106 Q-34,-70 -18,-62 L-20,-100 Z M27,-106 Q34,-70 18,-62 L20,-100 Z" fill="${hr}"/>` : '') + circle(-9, -102, 3, { fill: C.slate }) + circle(9, -102, 3, { fill: C.slate }) + `<path d="M-8,-92 Q0,-86 8,-92" fill="none" stroke="${C.slate}" stroke-width="2.5" stroke-linecap="round"/>`
  return `<g transform="scale(${s})">${armL}${armR}${body}${head}</g>`
}

// Banderas simplificadas (proporción 3:2)
function flag(code, w = 90) {
  const h = (w * 2) / 3
  const x = -w / 2
  const y = -h / 2
  const band = (arr, dir = 'h') =>
    arr.map(([c, f0, f1]) => (dir === 'h' ? `<rect x="${x}" y="${y + f0 * h}" width="${w}" height="${(f1 - f0) * h}" fill="${c}"/>` : `<rect x="${x + f0 * w}" y="${y}" width="${(f1 - f0) * w}" height="${h}" fill="${c}"/>`)).join('')
  const F = {
    MX: band([['#006847', 0, 1 / 3], ['#FFFFFF', 1 / 3, 2 / 3], ['#CE1126', 2 / 3, 1]], 'v') + circle(0, 0, h * 0.12, { fill: '#8B5A2B', o: 0.8 }),
    ES: band([['#AA151B', 0, 0.25], ['#F1BF00', 0.25, 0.75], ['#AA151B', 0.75, 1]]),
    AR: band([['#74ACDF', 0, 1 / 3], ['#FFFFFF', 1 / 3, 2 / 3], ['#74ACDF', 2 / 3, 1]]) + circle(0, 0, h * 0.1, { fill: '#F6B40E' }),
    CL: band([['#FFFFFF', 0, 0.5], ['#D52B1E', 0.5, 1]]) + `<rect x="${x}" y="${y}" width="${w / 3}" height="${h / 2}" fill="#0039A6"/>` + sparkle(x + w / 6, y + h / 4, h * 0.12, '#FFFFFF'),
    CO: band([['#FCD116', 0, 0.5], ['#003893', 0.5, 0.75], ['#CE1126', 0.75, 1]]),
    PE: band([['#D91023', 0, 1 / 3], ['#FFFFFF', 1 / 3, 2 / 3], ['#D91023', 2 / 3, 1]], 'v'),
    EC: band([['#FFDD00', 0, 0.5], ['#034EA2', 0.5, 0.75], ['#ED1C24', 0.75, 1]]) + circle(0, h * 0.02, h * 0.1, { fill: '#8B5A2B', o: 0.8 }),
    UY: [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => `<rect x="${x}" y="${y + (i * h) / 9}" width="${w}" height="${h / 9}" fill="${i % 2 ? '#0038A8' : '#FFFFFF'}"/>`).join('') + `<rect x="${x}" y="${y}" width="${w * 0.36}" height="${(h * 5) / 9}" fill="#FFFFFF"/>` + circle(x + w * 0.18, y + h * 0.28, h * 0.13, { fill: '#FCD116' }),
    US: [0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="${x}" y="${y + (i * h) / 7}" width="${w}" height="${h / 7}" fill="${i % 2 ? '#FFFFFF' : '#B22234'}"/>`).join('') + `<rect x="${x}" y="${y}" width="${w * 0.42}" height="${(h * 4) / 7}" fill="#3C3B6E"/>`,
    EU: `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#003399"/>` + [...Array(12)].map((_, i) => sparkle(Math.cos((i / 12) * Math.PI * 2) * h * 0.3, Math.sin((i / 12) * Math.PI * 2) * h * 0.3, h * 0.05, '#FFCC00')).join(''),
  }
  return `<g><clipPath id="f${code}${w}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6"/></clipPath><g clip-path="url(#f${code}${w})">${F[code]}</g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="none" stroke="#0F172A" stroke-opacity="0.15" stroke-width="2"/></g>`
}

const badge = ({ r = 30, label = '%', fill = C.purple, tc = C.white, size } = {}) => circle(0, 0, r, { fill, stroke: C.white, sw: 4 }) + text(0, (size || r * 0.7) * 0.36, label, { size: size || r * 0.7, fill: tc })
const pill = ({ w = 120, h = 36, label = '', fill = C.purple, tc = C.white, size = 16 } = {}) => rect(-w / 2, -h / 2, w, h, { rx: h / 2, fill }) + text(0, size * 0.36, label, { size, fill: tc })
const check = ({ r = 24, fill = C.green } = {}) => circle(0, 0, r, { fill }) + `<path d="M${-r * 0.4},0 L${-r * 0.1},${r * 0.32} L${r * 0.45},${-r * 0.32}" fill="none" stroke="${C.white}" stroke-width="${r * 0.2}" stroke-linecap="round" stroke-linejoin="round"/>`
const cross = ({ r = 24, fill = C.red } = {}) => circle(0, 0, r, { fill }) + `<path d="M${-r * 0.32},${-r * 0.32} L${r * 0.32},${r * 0.32} M${r * 0.32},${-r * 0.32} L${-r * 0.32},${r * 0.32}" stroke="${C.white}" stroke-width="${r * 0.2}" stroke-linecap="round"/>`
const bubble = ({ w = 140, h = 70, fill = C.white, stroke = C.purple, label = '', size = 18, tc = C.slate, tail = 'left' } = {}) =>
  rect(-w / 2, -h / 2, w, h, { rx: 18, fill, stroke, sw: 3 }) + `<path d="M${tail === 'left' ? -w / 2 + 24 : w / 2 - 40},${h / 2 - 2} l${tail === 'left' ? -10 : 26},22 l${tail === 'left' ? 30 : -6},-22 Z" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/><rect x="${tail === 'left' ? -w / 2 + 16 : w / 2 - 44}" y="${h / 2 - 5}" width="34" height="6" fill="${fill}"/>` + (label ? text(0, size * 0.36, label, { size, fill: tc }) : '')

function piggy({ fill = C.pink, s = 1 } = {}) {
  return `<g transform="scale(${s})"><ellipse cx="0" cy="0" rx="80" ry="60" fill="${fill}"/><circle cx="70" cy="-8" r="22" fill="${fill}"/><ellipse cx="86" cy="-6" rx="12" ry="10" fill="#F9A8D4"/><circle cx="83" cy="-8" r="2.5" fill="${C.slate}"/><circle cx="90" cy="-8" r="2.5" fill="${C.slate}"/><circle cx="58" cy="-24" r="4" fill="${C.slate}"/><path d="M40,-52 L52,-78 L64,-50 Z" fill="${fill}"/>${rect(-50, 44, 18, 30, { rx: 8, fill })}${rect(28, 44, 18, 30, { rx: 8, fill })}${rect(-24, -64, 44, 10, { rx: 5, fill: C.slate })}<path d="M-80,-6 q-22,-4 -18,-24" stroke="${fill}" stroke-width="6" fill="none" stroke-linecap="round"/></g>`
}
function house({ w = 150, roof = C.purple, wall = C.white, door = C.amber } = {}) {
  return `<path d="M${-w / 2 - 16},-10 L0,${-w * 0.62} L${w / 2 + 16},-10 Z" fill="${roof}"/>` + rect(-w / 2, -14, w, w * 0.62, { rx: 6, fill: wall, stroke: roof, sw: 4 }) + rect(-16, w * 0.62 - 64, 32, 50, { rx: 6, fill: door }) + rect(-w / 2 + 16, 8, 30, 28, { rx: 4, fill: C.blueSoft, stroke: roof, sw: 3 }) + rect(w / 2 - 46, 8, 30, 28, { rx: 4, fill: C.blueSoft, stroke: roof, sw: 3 })
}
function car({ fill = C.blue, w = 200 } = {}) {
  return `<path d="M${-w / 2},10 Q${-w / 2},-20 ${-w / 2 + 30},-24 L${-w / 4},-26 Q${-w / 8},-60 ${w / 8},-60 Q${w / 4},-60 ${w / 3},-26 L${w / 2 - 10},-20 Q${w / 2},-16 ${w / 2},10 Z" fill="${fill}"/>` + `<path d="M${-w / 5},-28 Q${-w / 8},-52 ${w / 10},-52 L${w / 10},-28 Z M${w / 7},-52 Q${w / 4},-52 ${w / 3.4},-28 L${w / 7},-28 Z" fill="${C.blueSoft}"/>` + circle(-w / 3.2, 12, 22, { fill: C.slate }) + circle(-w / 3.2, 12, 9, { fill: C.slateSoft }) + circle(w / 3.2, 12, 22, { fill: C.slate }) + circle(w / 3.2, 12, 9, { fill: C.slateSoft }) + rect(w / 2 - 18, -12, 14, 8, { rx: 3, fill: C.amber })
}
const shield = ({ fill = C.green, s = 1 } = {}) => `<path d="M0,${-60 * s} L${48 * s},${-42 * s} Q${48 * s},${30 * s} 0,${60 * s} Q${-48 * s},${30 * s} ${-48 * s},${-42 * s} Z" fill="${fill}"/>` + `<path d="M${-18 * s},0 L${-4 * s},${14 * s} L${20 * s},${-14 * s}" fill="none" stroke="${C.white}" stroke-width="${8 * s}" stroke-linecap="round" stroke-linejoin="round"/>`
const lock = ({ fill = C.purple } = {}) => `<path d="M-22,-20 V-38 Q-22,-62 0,-62 Q22,-62 22,-38 V-20" fill="none" stroke="${C.slate}" stroke-width="9"/>` + rect(-36, -24, 72, 62, { rx: 10, fill }) + circle(0, 4, 8, { fill: C.white }) + rect(-3, 4, 6, 16, { rx: 3, fill: C.white })
const magnifier = ({ r = 40, stroke = C.purple, fill = C.blueSoft } = {}) => circle(0, 0, r, { fill, stroke, sw: 7 }) + `<line x1="${r * 0.72}" y1="${r * 0.72}" x2="${r * 1.55}" y2="${r * 1.55}" stroke="${C.slate}" stroke-width="12" stroke-linecap="round"/>` + `<path d="M${-r * 0.5},${-r * 0.2} Q${-r * 0.45},${-r * 0.5} ${-r * 0.15},${-r * 0.55}" stroke="${C.white}" stroke-width="5" fill="none" stroke-linecap="round"/>`
function gift({ w = 120, box = C.purple, lid = C.purpleDark, ribbon = C.amber } = {}) {
  return rect(-w / 2, -w * 0.15, w, w * 0.75, { rx: 8, fill: box }) + rect(-w / 2 - 8, -w * 0.38, w + 16, w * 0.26, { rx: 8, fill: lid }) + rect(-w * 0.1, -w * 0.38, w * 0.2, w * 0.98, { rx: 0, fill: ribbon }) + `<path d="M-6,${-w * 0.38} Q${-w * 0.45},${-w * 0.8} ${-w * 0.08},${-w * 0.66} Q${-w * 0.02},${-w * 0.5} -6,${-w * 0.38} Z M6,${-w * 0.38} Q${w * 0.45},${-w * 0.8} ${w * 0.08},${-w * 0.66} Q${w * 0.02},${-w * 0.5} 6,${-w * 0.38} Z" fill="${ribbon}"/>`
}
const tag = ({ label = '-20%', fill = C.red, w = 130 } = {}) => `<path d="M${-w / 2},-28 H${w / 2 - 24} L${w / 2},0 L${w / 2 - 24},28 H${-w / 2} Q${-w / 2 - 6},28 ${-w / 2 - 6},22 V-22 Q${-w / 2 - 6},-28 ${-w / 2},-28 Z" fill="${fill}"/>` + circle(w / 2 - 24, 0, 6, { fill: C.white }) + text(-10, 9, label, { size: 24, fill: C.white })
const pencil = ({ l = 150, fill = C.amber } = {}) => rect(-l / 2, -11, l - 30, 22, { rx: 3, fill }) + rect(-l / 2 - 16, -11, 20, 22, { rx: 5, fill: C.pink }) + `<path d="M${l / 2 - 30},-11 L${l / 2},0 L${l / 2 - 30},11 Z" fill="#FDE68A"/><path d="M${l / 2 - 10},-4 L${l / 2},0 L${l / 2 - 10},4 Z" fill="${C.slate}"/>`
const book = ({ fill = C.blue, w = 120, h = 150 } = {}) => rect(-w / 2, -h / 2, w, h, { rx: 8, fill }) + rect(-w / 2 + 10, -h / 2, 8, h, { rx: 0, fill: C.white, o: 0.4 }) + rect(-w / 2 + 30, -h / 2 + 24, w - 50, 22, { rx: 4, fill: C.white, o: 0.9 })
const thermometer = ({ level = 0.6, fill = C.red } = {}) => rect(-14, -110, 28, 170, { rx: 14, fill: C.white, stroke: C.slate, sw: 4 }) + rect(-6, -100 + (1 - level) * 150, 12, level * 150 + 10, { rx: 6, fill }) + circle(0, 72, 26, { fill, stroke: C.slate, sw: 4 }) + [0, 1, 2, 3, 4].map((i) => rect(16, -90 + i * 32, 14, 4, { rx: 2, fill: C.slateSoft })).join('')
const ruler = ({ w = 260, fill = C.amber } = {}) => rect(-w / 2, -24, w, 48, { rx: 6, fill, stroke: C.amberDark, sw: 3 }) + [...Array(Math.floor(w / 13))].map((_, i) => rect(-w / 2 + 10 + i * 13, -24, 3, i % 5 ? 12 : 22, { rx: 1, fill: C.amberDark })).join('')
const scale = ({ tilt = 0, fill = C.purple } = {}) =>
  rect(-6, -90, 12, 140, { rx: 6, fill: C.slate }) + rect(-50, 44, 100, 16, { rx: 8, fill: C.slate }) + place(0, -86, `<line x1="-110" y1="0" x2="110" y2="0" stroke="${C.slate}" stroke-width="8" stroke-linecap="round"/>` + place(-100, 0, `<line x1="0" y1="0" x2="-26" y2="60" stroke="${C.slateMid}" stroke-width="3"/><line x1="0" y1="0" x2="26" y2="60" stroke="${C.slateMid}" stroke-width="3"/><path d="M-44,60 Q0,94 44,60 Z" fill="${fill}"/>`) + place(100, 0, `<line x1="0" y1="0" x2="-26" y2="60" stroke="${C.slateMid}" stroke-width="3"/><line x1="0" y1="0" x2="26" y2="60" stroke="${C.slateMid}" stroke-width="3"/><path d="M-44,60 Q0,94 44,60 Z" fill="${C.teal}"/>`), { r: tilt }) + circle(0, -86, 10, { fill: C.amber })
const cup = ({ fill = C.blueSoft, level = 0.6 } = {}) => `<path d="M-60,-70 L-48,80 Q-46,92 -34,92 H34 Q46,92 48,80 L60,-70 Z" fill="${C.white}" stroke="${C.blue}" stroke-width="4"/>` + `<path d="M${-60 + 12 * (1 - level)},${80 - level * 150} L-48,80 Q-46,92 -34,92 H34 Q46,92 48,80 L${60 - 12 * (1 - level)},${80 - level * 150} Z" fill="${fill}"/>` + [0, 1, 2].map((i) => rect(20, -40 + i * 38, 26, 4, { rx: 2, fill: C.blue })).join('') + `<path d="M58,-40 Q92,-36 88,0 Q84,30 52,30" fill="none" stroke="${C.blue}" stroke-width="7"/>`
const globe = ({ r = 70, fill = C.blueSoft, land = C.green } = {}) => circle(0, 0, r, { fill, stroke: C.blue, sw: 4 }) + `<path d="M${-r * 0.6},${-r * 0.3} q${r * 0.3},${-r * 0.4} ${r * 0.6},${-r * 0.1} q${r * 0.1},${r * 0.3} ${-r * 0.2},${r * 0.45} q${-r * 0.3},${r * 0.1} ${-r * 0.4},${-r * 0.35} Z M${r * 0.15},${r * 0.2} q${r * 0.4},${-r * 0.15} ${r * 0.55},${r * 0.2} q${-r * 0.1},${r * 0.4} ${-r * 0.45},${r * 0.35} Z" fill="${land}"/>` + `<ellipse cx="0" cy="0" rx="${r * 0.45}" ry="${r}" fill="none" stroke="${C.blue}" stroke-width="2" opacity="0.4"/><line x1="${-r}" y1="0" x2="${r}" y2="0" stroke="${C.blue}" stroke-width="2" opacity="0.4"/>`
function dice({ n = 5, s = 80, fill = C.white, dot = C.purple } = {}) {
  const P = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] }
  return rect(-s / 2, -s / 2, s, s, { rx: s * 0.2, fill, stroke: dot, sw: 4 }) + P[n].map(([x, y]) => circle(x * s * 0.25, y * s * 0.25, s * 0.08, { fill: dot })).join('')
}
const ring = ({ r = 50, metal = C.amber, gem = C.blue } = {}) => circle(0, 16, r, { fill: 'none', stroke: metal, sw: 12 }) + `<path d="M-20,${16 - r - 2} L-12,${16 - r - 30} H12 L20,${16 - r - 2} Z" fill="${metal}"/>` + `<path d="M-20,${16 - r - 30} L0,${16 - r - 58} L20,${16 - r - 30} Z" fill="${gem}"/>` + `<path d="M-20,${16 - r - 30} H20 L0,${16 - r - 8} Z" fill="${gem}" opacity="0.7"/>`
const bulb = ({ fill = C.amber } = {}) => `<path d="M0,-70 Q48,-70 48,-22 Q48,6 24,24 L24,40 H-24 L-24,24 Q-48,6 -48,-22 Q-48,-70 0,-70 Z" fill="${fill}"/>` + rect(-24, 40, 48, 12, { rx: 4, fill: C.slateMid }) + rect(-18, 54, 36, 10, { rx: 5, fill: C.slate }) + `<path d="M-12,20 L-6,-14 L0,6 L6,-14 L12,20" fill="none" stroke="${C.white}" stroke-width="4" stroke-linejoin="round"/>` + [-1, 0, 1].map((k) => `<line x1="${k * 70}" y1="${-72 - Math.abs(k) * -20}" x2="${k * 84}" y2="${-86 - Math.abs(k) * -20}" stroke="${fill}" stroke-width="5" stroke-linecap="round"/>`).join('')
const leaf = ({ fill = C.green, s = 1, r = 0 } = {}) => `<path transform="rotate(${r}) scale(${s})" d="M0,0 Q40,-60 0,-120 Q-40,-60 0,0 Z M0,-10 V-110" fill="${fill}" stroke="${C.white}" stroke-width="3"/>`
const tree = ({ fill = C.green } = {}) => rect(-10, 0, 20, 70, { rx: 6, fill: '#92400E' }) + circle(0, -30, 50, { fill }) + circle(-36, 0, 32, { fill }) + circle(36, 0, 32, { fill })
function gauge({ v = 0.7, r = 80, color = C.purple } = {}) {
  const a = Math.PI + v * Math.PI
  return `<path d="M${-r},0 A${r},${r} 0 0,1 ${r},0" fill="none" stroke="${C.purpleXs}" stroke-width="22" stroke-linecap="round"/>` + `<path d="M${-r},0 A${r},${r} 0 0,1 ${Math.cos(a) * r},${Math.sin(a) * r}" fill="none" stroke="${color}" stroke-width="22" stroke-linecap="round"/>` + `<line x1="0" y1="0" x2="${Math.cos(a) * (r - 30)}" y2="${Math.sin(a) * (r - 30)}" stroke="${C.slate}" stroke-width="7" stroke-linecap="round"/>` + circle(0, 0, 10, { fill: C.slate })
}
const ball = ({ n = '7', fill = C.purple, r = 34, letter = '' } = {}) => circle(0, 0, r, { fill }) + circle(0, 0, r * 0.62, { fill: C.white }) + (letter ? text(0, -r * 0.16, letter, { size: r * 0.3, fill }) : '') + text(0, letter ? r * 0.34 : r * 0.24, n, { size: letter ? r * 0.5 : r * 0.64, fill: C.slate }) + `<path d="M${-r * 0.6},${-r * 0.5} Q${-r * 0.3},${-r * 0.85} ${r * 0.05},${-r * 0.82}" stroke="${C.white}" stroke-width="4" fill="none" opacity="0.6" stroke-linecap="round"/>`
const trophy = ({ fill = C.amber } = {}) => `<path d="M-50,-70 H50 V-30 Q50,20 0,26 Q-50,20 -50,-30 Z" fill="${fill}"/>` + `<path d="M-50,-56 Q-84,-56 -80,-26 Q-76,0 -44,0 M50,-56 Q84,-56 80,-26 Q76,0 44,0" fill="none" stroke="${fill}" stroke-width="9"/>` + rect(-10, 24, 20, 30, { rx: 3, fill: C.amberDark }) + rect(-40, 52, 80, 20, { rx: 6, fill: C.slate })
const heart = ({ fill = C.pink, s = 1 } = {}) => `<path transform="scale(${s})" d="M0,30 C-50,0 -50,-40 -22,-44 C-10,-46 -2,-38 0,-30 C2,-38 10,-46 22,-44 C50,-40 50,0 0,30 Z" fill="${fill}"/>`
const envelope = ({ w = 150, fill = C.white, stroke = C.purple } = {}) => rect(-w / 2, -w * 0.33, w, w * 0.66, { rx: 10, fill, stroke, sw: 4 }) + `<path d="M${-w / 2 + 4},${-w * 0.3} L0,${w * 0.06} L${w / 2 - 4},${-w * 0.3}" fill="none" stroke="${stroke}" stroke-width="4" stroke-linejoin="round"/>`
const card = ({ w = 170, fill = C.purple } = {}) => rect(-w / 2, -w * 0.31, w, w * 0.62, { rx: 14, fill }) + rect(-w / 2, -w * 0.14, w, 22, { rx: 0, fill: C.slate, o: 0.6 }) + rect(-w / 2 + 18, w * 0.05, 34, 24, { rx: 5, fill: C.amber }) + lines(-w / 2 + 18, w * 0.2, [70, 40], { fill: C.white, h: 7, gap: 14 })
const hourglass = ({ fill = C.amber } = {}) => rect(-50, -84, 100, 14, { rx: 6, fill: C.purpleDark }) + rect(-50, 70, 100, 14, { rx: 6, fill: C.purpleDark }) + `<path d="M-40,-70 H40 Q40,-20 6,0 Q40,20 40,70 H-40 Q-40,20 -6,0 Q-40,-20 -40,-70 Z" fill="${C.blueSoft}" stroke="${C.purple}" stroke-width="4"/>` + `<path d="M-26,-40 H26 Q20,-18 0,-6 Q-20,-18 -26,-40 Z M-34,70 Q-30,40 0,32 Q30,40 34,70 Z" fill="${fill}"/>`
const gradCap = ({ fill = C.slate } = {}) => `<path d="M-90,0 L0,-40 L90,0 L0,40 Z" fill="${fill}"/>` + `<path d="M-54,16 V52 Q0,80 54,52 V16 L0,40 Z" fill="${fill}" opacity="0.85"/>` + `<path d="M60,6 V56" stroke="${C.amber}" stroke-width="4"/>` + circle(60, 60, 8, { fill: C.amber })
const paw = ({ fill = C.amberDark, s = 1 } = {}) => `<g transform="scale(${s})"><ellipse cx="0" cy="12" rx="26" ry="22" fill="${fill}"/>${circle(-26, -18, 11, { fill })}${circle(-8, -32, 11, { fill })}${circle(12, -32, 11, { fill })}${circle(28, -18, 11, { fill })}</g>`
const bolt = ({ fill = C.amber, s = 1 } = {}) => `<path transform="scale(${s})" d="M10,-60 L-34,8 H-4 L-14,60 L34,-12 H4 Z" fill="${fill}"/>`
const droplet = ({ fill = C.blue, s = 1 } = {}) => `<path transform="scale(${s})" d="M0,-60 Q40,-10 40,20 A40,40 0 0,1 -40,20 Q-40,-10 0,-60 Z" fill="${fill}"/>` + `<path transform="scale(${s})" d="M-18,14 Q-18,34 0,40" stroke="${C.white}" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.7"/>`
const codeLines = (x, y, specs, { gap = 22 } = {}) =>
  specs.map((row, i) => row.map(([dx, w, c]) => rect(x + dx, y + i * gap, w, 10, { rx: 5, fill: c })).join('')).join('')
const swatches = (cols, { w = 50, h = 110, gap = 6 } = {}) => cols.map((c, i) => rect(-(cols.length * (w + gap)) / 2 + i * (w + gap), -h / 2, w, h, { rx: 10, fill: c })).join('')
const imageIcon = ({ w = 150, h = 110, stroke = C.purple, sky = C.blueSoft } = {}) => rect(-w / 2, -h / 2, w, h, { rx: 12, fill: sky, stroke, sw: 4 }) + circle(w / 4, -h / 5, h / 9, { fill: C.amber }) + `<path d="M${-w / 2 + 4},${h / 2 - 4} L${-w / 8},${-h / 12} L${w / 8},${h / 4} L${w / 4},${h / 10} L${w / 2 - 4},${h / 2 - 4} Z" fill="${C.green}"/>`
const checklist = ({ w = 150, n = 4, done = 2, stroke = C.purple } = {}) =>
  rect(-w / 2, -n * 22 - 16, w, n * 44 + 32, { rx: 12, fill: C.white, stroke, sw: 3 }) + [...Array(n)].map((_, i) => rect(-w / 2 + 16, -n * 22 + i * 44, 22, 22, { rx: 5, fill: i < done ? C.green : C.white, stroke: i < done ? C.green : C.slateSoft, sw: 3 }) + (i < done ? `<path d="M${-w / 2 + 21},${-n * 22 + i * 44 + 11} l5,5 l8,-9" stroke="${C.white}" stroke-width="3" fill="none" stroke-linecap="round"/>` : '') + rect(-w / 2 + 50, -n * 22 + i * 44 + 7, w - 70 - (i % 2) * 20, 8, { rx: 4, fill: C.slateSoft })).join('')
const table = ({ cols = 3, rows = 4, w = 220, h = 150, head = C.purple, stroke = C.purple } = {}) => {
  let out = rect(-w / 2, -h / 2, w, h, { rx: 10, fill: C.white, stroke, sw: 3 }) + rect(-w / 2, -h / 2, w, h / (rows + 1), { rx: 10, fill: head }) + rect(-w / 2, -h / 2 + h / (rows + 1) - 10, w, 10, { rx: 0, fill: head })
  for (let r = 1; r <= rows; r++) out += `<line x1="${-w / 2}" y1="${-h / 2 + (r * h) / (rows + 1)}" x2="${w / 2}" y2="${-h / 2 + (r * h) / (rows + 1)}" stroke="${C.line}" stroke-width="2"/>`
  for (let c = 1; c < cols; c++) out += `<line x1="${-w / 2 + (c * w) / cols}" y1="${-h / 2}" x2="${-w / 2 + (c * w) / cols}" y2="${h / 2}" stroke="${C.line}" stroke-width="2"/>`
  for (let r = 1; r <= rows; r++) for (let c = 0; c < cols; c++) out += rect(-w / 2 + (c * w) / cols + 12, -h / 2 + (r * h) / (rows + 1) + 10, w / cols - 30 - ((r + c) % 2) * 10, 8, { rx: 4, fill: C.slateSoft })
  return out
}
const cake = () => rect(-70, -20, 140, 70, { rx: 10, fill: C.pinkSoft, stroke: C.pink, sw: 3 }) + `<path d="M-70,0 Q-52,16 -35,0 Q-18,16 0,0 Q18,16 35,0 Q52,16 70,0" fill="none" stroke="${C.pink}" stroke-width="4"/>` + [-30, 0, 30].map((x) => rect(x - 4, -52, 8, 32, { rx: 3, fill: C.blue }) + `<path d="M${x},-66 q7,8 0,14 q-7,-6 0,-14 Z" fill="${C.amber}"/>`).join('')

// Envoltura final: 800 × 450 como el resto de ilustraciones del sitio.
const svg = (body, title) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450" role="img" aria-label="${title}">${body}</svg>`

module.exports = {
  C, FONT, rng, place, text, rect, circle, lines, frame, ground, sparkle, plus, arrow,
  calculator, doc, coin, coinStack, bill, billStack, calendar, clock, stopwatch, phone, browser, barChart, pie, lineChart,
  person, flag, badge, pill, check, cross, bubble, piggy, house, car, shield, lock, magnifier, gift, tag, pencil, book,
  thermometer, ruler, scale, cup, globe, dice, ring, bulb, leaf, tree, gauge, ball, trophy, heart, envelope, card, hourglass,
  gradCap, paw, bolt, droplet, codeLines, swatches, imageIcon, checklist, table, cake, svg,
}
