// Utilidades matemáticas puras para las calculadoras escolares.

// Acepta números separados por comas, punto y coma, espacios o saltos de línea; admite coma decimal ("7,5").
export function parseNumeros(texto) {
  const partes = texto
    .replace(/(\d),(\d)/g, (m, a, b) => (/[;\n\t ]/.test(texto) ? `${a}.${b}` : m))
    .split(/[\s,;]+/)
    .filter(Boolean)
  const numeros = []
  const invalidos = []
  for (const p of partes) {
    const n = Number(p)
    if (Number.isFinite(n)) numeros.push(n)
    else invalidos.push(p)
  }
  return { numeros, invalidos }
}

export function estadisticas(xs) {
  const n = xs.length
  if (n === 0) return null
  const orden = [...xs].sort((a, b) => a - b)
  const suma = xs.reduce((s, x) => s + x, 0)
  const media = suma / n
  const mediana = n % 2 ? orden[(n - 1) / 2] : (orden[n / 2 - 1] + orden[n / 2]) / 2
  const frec = new Map()
  for (const x of xs) frec.set(x, (frec.get(x) || 0) + 1)
  const maxF = Math.max(...frec.values())
  const moda = maxF > 1 ? [...frec.entries()].filter(([, f]) => f === maxF).map(([x]) => x).sort((a, b) => a - b) : []
  const sc = xs.reduce((s, x) => s + (x - media) ** 2, 0)
  const varPob = sc / n
  const varMuestra = n > 1 ? sc / (n - 1) : null
  const geometrica = xs.every((x) => x > 0) ? Math.exp(xs.reduce((s, x) => s + Math.log(x), 0) / n) : null
  const armonica = xs.every((x) => x > 0) ? n / xs.reduce((s, x) => s + 1 / x, 0) : null
  return {
    n, suma, media, mediana, moda, min: orden[0], max: orden[n - 1], rango: orden[n - 1] - orden[0], orden,
    sumaCuadrados: sc, varPob, varMuestra, desvPob: Math.sqrt(varPob), desvMuestra: varMuestra === null ? null : Math.sqrt(varMuestra),
    geometrica, armonica,
  }
}

// ── Enteros ──
export function mcd2(a, b) {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) [a, b] = [b, a % b]
  return a
}

export function pasosEuclides(a, b) {
  const pasos = []
  a = Math.abs(a)
  b = Math.abs(b)
  if (a < b) [a, b] = [b, a]
  while (b) {
    pasos.push({ a, b, q: Math.floor(a / b), r: a % b })
    ;[a, b] = [b, a % b]
  }
  return pasos
}

export function factorizar(n) {
  const f = new Map()
  n = Math.abs(n)
  for (let p = 2; p * p <= n; p++) {
    while (n % p === 0) {
      f.set(p, (f.get(p) || 0) + 1)
      n /= p
    }
  }
  if (n > 1) f.set(n, (f.get(n) || 0) + 1)
  return f
}

export function formatearFactores(f) {
  if (f.size === 0) return '1'
  return [...f.entries()].map(([p, e]) => (e > 1 ? `${p}^${e}` : `${p}`)).join(' × ')
}

export function mcdMcm(numeros) {
  const mcd = numeros.reduce((g, x) => mcd2(g, x))
  let mcm = 1n
  // El MCM crece rápido: se calcula con BigInt para no perder precisión.
  for (const x of numeros) {
    const bx = BigInt(Math.abs(x))
    mcm = (mcm * bx) / gcdBig(mcm, bx)
  }
  return { mcd, mcm }
}

function gcdBig(a, b) {
  while (b) [a, b] = [b, a % b]
  return a
}

// ── Fracciones (numerador y denominador enteros, con signo en el numerador) ──
export function simplificar(n, d) {
  if (d === 0) return null
  if (d < 0) {
    n = -n
    d = -d
  }
  const g = mcd2(n, d) || 1
  return { n: n / g, d: d / g }
}

export function operarFracciones(a, op, b) {
  let n, d
  if (op === '+') [n, d] = [a.n * b.d + b.n * a.d, a.d * b.d]
  else if (op === '-') [n, d] = [a.n * b.d - b.n * a.d, a.d * b.d]
  else if (op === '×') [n, d] = [a.n * b.n, a.d * b.d]
  else {
    if (b.n === 0) return null
    ;[n, d] = [a.n * b.d, a.d * b.n]
  }
  return { sinSimplificar: { n, d }, resultado: simplificar(n, d) }
}

export function aMixto({ n, d }) {
  const signo = n < 0 ? '-' : ''
  const abs = Math.abs(n)
  const entero = Math.floor(abs / d)
  const resto = abs % d
  return { signo, entero, resto, d }
}

// ── Factorial exacto con BigInt ──
export function factorial(n) {
  let r = 1n
  for (let i = 2n; i <= BigInt(n); i++) r *= i
  return r
}

export function cerosFinalesFactorial(n) {
  let c = 0
  for (let p = 5; p <= n; p *= 5) c += Math.floor(n / p)
  return c
}

// ── Edad de perro ──
// Fórmula logarítmica de Wang et al. (Cell Systems, 2020): edad humana = 16 · ln(edad canina) + 31 (para perros de 1 año o más).
export function edadPerroLogaritmica(anios) {
  if (anios <= 0) return 0
  return 16 * Math.log(anios) + 31
}

// Método por tamaño (tablas veterinarias habituales): 15 años el primero, 9 el segundo y
// luego 4, 5, 6 o 7 por año según el tamaño adulto del perro.
export const TAMANOS_PERRO = [
  { id: 'pequeno', label: 'Pequeño (hasta 9 kg)', porAnio: 4, esperanza: '14 a 16 años' },
  { id: 'mediano', label: 'Mediano (10 a 22 kg)', porAnio: 5, esperanza: '12 a 14 años' },
  { id: 'grande', label: 'Grande (23 a 40 kg)', porAnio: 6, esperanza: '10 a 12 años' },
  { id: 'gigante', label: 'Gigante (más de 40 kg)', porAnio: 7, esperanza: '8 a 10 años' },
]

export function edadPerroPorTamano(anios, tamanoId) {
  const t = TAMANOS_PERRO.find((x) => x.id === tamanoId)
  if (anios <= 1) return anios * 15
  if (anios <= 2) return 15 + (anios - 1) * 9
  return 24 + (anios - 2) * t.porAnio
}
