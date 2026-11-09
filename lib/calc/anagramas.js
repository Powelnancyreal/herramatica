// Cálculos de la calculadora de anagramas. Las letras se comparan sin tildes ni diéresis, pero la ñ es
// una letra distinta de la n (igual que en el diccionario que usa la herramienta).

export const ALFABETO = 'abcdefghijklmnñopqrstuvwxyz'
const POSICION = new Map([...ALFABETO].map((l, i) => [l, i]))
export const MAX_COMODINES = 2

// Minúsculas, sin tildes y solo letras. Con `comodines`, conserva los signos «?» como letras desconocidas.
export function normalizar(texto, { comodines = false } = {}) {
  const t = String(texto || '')
    .toLowerCase()
    .replace(/ñ/g, '\u0000')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\u0000/g, 'ñ')
  return t.replace(comodines ? /[^a-zñ?]/g : /[^a-zñ]/g, '')
}

export function contar(letras) {
  const c = new Array(ALFABETO.length).fill(0)
  for (const l of letras) {
    const i = POSICION.get(l)
    if (i !== undefined) c[i]++
  }
  return c
}

export const clave = (letras) => [...letras].sort().join('')

// Cuántas veces aparece cada letra, en el orden de la palabra: [['a', 2], ['c', 1], ['s', 1]].
export function frecuencias(letras) {
  const m = new Map()
  for (const l of letras) m.set(l, (m.get(l) || 0) + 1)
  return [...m.entries()]
}

const factorial = (n) => {
  let r = 1n
  for (let i = 2n; i <= BigInt(n); i++) r *= i
  return r
}

// Ordenaciones distintas de las letras (permutaciones con repetición): n! / (a! · b! · …).
export function ordenaciones(letras) {
  const f = frecuencias(letras)
  const repetidas = f.filter(([, n]) => n > 1)
  const divisor = repetidas.reduce((d, [, n]) => d * factorial(n), 1n)
  return { n: letras.length, total: factorial(letras.length) / divisor, numerador: factorial(letras.length), divisor, repetidas }
}

// ¿Se puede formar `palabra` con las letras disponibles más `comodines` letras libres?
export function cabe(conteoPalabra, conteoLetras, comodines = 0) {
  let faltan = 0
  for (let i = 0; i < conteoPalabra.length; i++) {
    const d = conteoPalabra[i] - conteoLetras[i]
    if (d > 0) {
      faltan += d
      if (faltan > comodines) return false
    }
  }
  return true
}

// Patrón por posiciones: «c?s?» = cuatro letras, c en la primera y s en la tercera. «?» acepta cualquier letra.
export function coincidePatron(palabra, patron) {
  if (!patron) return true
  if (palabra.length !== patron.length) return false
  for (let i = 0; i < patron.length; i++) if (patron[i] !== '?' && patron[i] !== palabra[i]) return false
  return true
}

// Comparación de dos textos: si son anagramas y, si no, qué letras sobran en cada uno.
export function comparar(a, b) {
  const ca = contar(normalizar(a))
  const cb = contar(normalizar(b))
  const soloA = []
  const soloB = []
  for (let i = 0; i < ALFABETO.length; i++) {
    const d = ca[i] - cb[i]
    if (d > 0) soloA.push([ALFABETO[i], d])
    if (d < 0) soloB.push([ALFABETO[i], -d])
  }
  const letrasA = ca.reduce((s, x) => s + x, 0)
  const letrasB = cb.reduce((s, x) => s + x, 0)
  return { anagramas: letrasA > 0 && soloA.length === 0 && soloB.length === 0, letrasA, letrasB, soloA, soloB }
}

// Desordena una palabra para un ejercicio, procurando que no quede igual que la original.
export function desordenar(palabra, barajar) {
  const letras = [...palabra]
  if (new Set(letras).size < 2) return palabra
  for (let intento = 0; intento < 20; intento++) {
    const r = barajar(letras).join('')
    if (r !== palabra) return r
  }
  return letras.reverse().join('')
}
