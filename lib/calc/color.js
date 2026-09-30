// Conversión entre formatos de color y contraste WCAG 2.x.

export function limitar(x, a, b) {
  return Math.min(b, Math.max(a, x))
}

// Acepta #RGB, #RGBA, #RRGGBB y #RRGGBBAA (con o sin #).
export function hexARgb(hex) {
  let h = String(hex).trim().replace(/^#/, '')
  if (!/^([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(h)) return null
  if (h.length <= 4) h = [...h].map((c) => c + c).join('')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  const a = h.length === 8 ? Math.round((parseInt(h.slice(6, 8), 16) / 255) * 1000) / 1000 : 1
  return { r, g, b, a }
}

export function rgbAHex({ r, g, b, a = 1 }) {
  const dos = (x) => Math.round(limitar(x, 0, 255)).toString(16).padStart(2, '0')
  return `#${dos(r)}${dos(g)}${dos(b)}${a < 1 ? dos(a * 255) : ''}`.toUpperCase()
}

// Acepta "rgb(10, 20, 30)", "rgba(10,20,30,0.5)", "10 20 30" o "10,20,30".
export function parseRgb(texto) {
  const nums = String(texto).match(/-?\d*\.?\d+%?/g)
  if (!nums || nums.length < 3) return null
  const canal = (v) => (v.endsWith('%') ? (parseFloat(v) / 100) * 255 : parseFloat(v))
  const [r, g, b] = nums.slice(0, 3).map(canal)
  let a = nums[3] !== undefined ? (nums[3].endsWith('%') ? parseFloat(nums[3]) / 100 : parseFloat(nums[3])) : 1
  if ([r, g, b].some((x) => x < 0 || x > 255) || a < 0 || a > 1) return null
  return { r, g, b, a }
}

export function rgbAHsl({ r, g, b }) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0
  let s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0)
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
  }
  return { h, s: s * 100, l: l * 100 }
}

export function hslARgb({ h, s, l }) {
  h = ((h % 360) + 360) % 360
  s /= 100
  l /= 100
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x]
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 }
}

export function rgbAHsv({ r, g, b }) {
  const { h } = rgbAHsl({ r, g, b })
  const max = Math.max(r, g, b) / 255
  const min = Math.min(r, g, b) / 255
  return { h, s: max === 0 ? 0 : ((max - min) / max) * 100, v: max * 100 }
}

export function rgbACmyk({ r, g, b }) {
  const k = 1 - Math.max(r, g, b) / 255
  if (k >= 1) return { c: 0, m: 0, y: 0, k: 100 }
  const f = (x) => ((1 - x / 255 - k) / (1 - k)) * 100
  return { c: f(r), m: f(g), y: f(b), k: k * 100 }
}

export function luminancia({ r, g, b }) {
  const lin = (v) => {
    v /= 255
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

export function contraste(c1, c2) {
  const [a, b] = [luminancia(c1), luminancia(c2)].sort((x, y) => y - x)
  return (a + 0.05) / (b + 0.05)
}

export function nivelWCAG(ratio) {
  return { aaNormal: ratio >= 4.5, aaGrande: ratio >= 3, aaaNormal: ratio >= 7, aaaGrande: ratio >= 4.5 }
}

export const fmtRgb = ({ r, g, b, a = 1 }) =>
  a < 1 ? `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})` : `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
export const fmtHsl = ({ h, s, l }, a = 1) =>
  a < 1 ? `hsla(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%, ${a})` : `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`

// Armonías a partir del tono base (rotaciones en el círculo cromático HSL).
export const ARMONIAS = [
  { id: 'complementaria', label: 'Complementaria', giros: [0, 180] },
  { id: 'analoga', label: 'Análoga', giros: [-30, 0, 30, 60] },
  { id: 'triadica', label: 'Triádica', giros: [0, 120, 240] },
  { id: 'complementaria-dividida', label: 'Complementaria dividida', giros: [0, 150, 210] },
  { id: 'tetradica', label: 'Tetrádica (rectángulo)', giros: [0, 60, 180, 240] },
  { id: 'monocromatica', label: 'Monocromática', giros: null },
]

export function generarArmonia(hex, armoniaId) {
  const base = hexARgb(hex)
  if (!base) return []
  const hsl = rgbAHsl(base)
  const a = ARMONIAS.find((x) => x.id === armoniaId)
  if (!a.giros) {
    return [20, 35, 50, 65, 80].map((l) => rgbAHex(hslARgb({ h: hsl.h, s: hsl.s, l })))
  }
  return a.giros.map((g) => rgbAHex(hslARgb({ ...hsl, h: hsl.h + g })))
}

export function tonos(hex) {
  const base = hexARgb(hex)
  if (!base) return []
  const { h, s } = rgbAHsl(base)
  return [95, 85, 75, 65, 55, 45, 35, 25, 15].map((l) => rgbAHex(hslARgb({ h, s, l })))
}
