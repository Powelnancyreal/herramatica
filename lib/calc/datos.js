// CSV (RFC 4180), JSON y JWT sin dependencias.

export function detectarDelimitador(texto) {
  const muestra = texto.split(/\r?\n/).slice(0, 5).join('\n')
  const candidatos = [',', ';', '\t', '|']
  let mejor = ','
  let max = -1
  for (const c of candidatos) {
    // Cuenta delimitadores fuera de comillas.
    let n = 0
    let dentro = false
    for (const ch of muestra) {
      if (ch === '"') dentro = !dentro
      else if (ch === c && !dentro) n++
    }
    if (n > max) {
      max = n
      mejor = c
    }
  }
  return mejor
}

export function parseCSV(texto, delimitador = ',') {
  const filas = []
  let fila = []
  let campo = ''
  let dentro = false
  for (let i = 0; i < texto.length; i++) {
    const ch = texto[i]
    if (dentro) {
      if (ch === '"') {
        if (texto[i + 1] === '"') {
          campo += '"'
          i++
        } else dentro = false
      } else campo += ch
    } else if (ch === '"' && campo === '') dentro = true
    else if (ch === delimitador) {
      fila.push(campo)
      campo = ''
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && texto[i + 1] === '\n') i++
      fila.push(campo)
      filas.push(fila)
      fila = []
      campo = ''
    } else campo += ch
  }
  if (campo !== '' || fila.length) {
    fila.push(campo)
    filas.push(fila)
  }
  if (dentro) throw new Error('Hay unas comillas sin cerrar en el CSV.')
  return filas.filter((f) => !(f.length === 1 && f[0] === ''))
}

export function convertirValor(v) {
  const t = v.trim()
  if (t === '') return ''
  if (/^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?$/.test(t)) return Number(t)
  if (t === 'true' || t === 'false') return t === 'true'
  if (t === 'null') return null
  return v
}

export function csvAJson(texto, { delimitador, encabezados = true, tipos = true } = {}) {
  const d = delimitador || detectarDelimitador(texto)
  const filas = parseCSV(texto, d)
  if (!filas.length) return { datos: [], delimitador: d, columnas: 0 }
  const valor = (v) => (tipos ? convertirValor(v) : v)
  if (!encabezados) return { datos: filas.map((f) => f.map(valor)), delimitador: d, columnas: filas[0].length }
  const cols = filas[0].map((c, i) => c.trim() || `columna${i + 1}`)
  const datos = filas.slice(1).map((f) => Object.fromEntries(cols.map((c, i) => [c, valor(f[i] ?? '')])))
  return { datos, delimitador: d, columnas: cols.length }
}

function escaparCSV(v, d) {
  if (v === null || v === undefined) return ''
  const s = typeof v === 'object' ? JSON.stringify(v) : String(v)
  return /["\n\r]/.test(s) || s.includes(d) ? `"${s.replace(/"/g, '""')}"` : s
}

export function jsonACsv(texto, delimitador = ',') {
  let datos = JSON.parse(texto)
  if (!Array.isArray(datos)) datos = [datos]
  if (datos.every((x) => Array.isArray(x))) return datos.map((f) => f.map((v) => escaparCSV(v, delimitador)).join(delimitador)).join('\n')
  const cols = [...new Set(datos.flatMap((x) => (x && typeof x === 'object' ? Object.keys(x) : ['valor'])))]
  const filas = datos.map((x) => cols.map((c) => escaparCSV(x && typeof x === 'object' ? x[c] : x, delimitador)).join(delimitador))
  return [cols.map((c) => escaparCSV(c, delimitador)).join(delimitador), ...filas].join('\n')
}

// ── JWT ──
function base64UrlABytes(s) {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '=')
  const bin = atob(b64)
  return Uint8Array.from(bin, (c) => c.charCodeAt(0))
}

export function decodificarJWT(token) {
  const partes = token.trim().replace(/^Bearer\s+/i, '').split('.')
  if (partes.length !== 3) throw new Error(`Un JWT tiene 3 partes separadas por puntos; este tiene ${partes.length}.`)
  const dec = new TextDecoder()
  const leer = (p, nombre) => {
    try {
      return JSON.parse(dec.decode(base64UrlABytes(p)))
    } catch {
      throw new Error(`El ${nombre} no es JSON válido codificado en Base64URL.`)
    }
  }
  return { header: leer(partes[0], 'encabezado'), payload: leer(partes[1], 'payload'), firma: partes[2], partes }
}

const HMAC = { HS256: 'SHA-256', HS384: 'SHA-384', HS512: 'SHA-512' }

export async function verificarHMAC(partes, alg, secreto) {
  const hash = HMAC[alg]
  if (!hash) return null
  const enc = new TextEncoder()
  const clave = await crypto.subtle.importKey('raw', enc.encode(secreto), { name: 'HMAC', hash }, false, ['verify'])
  return crypto.subtle.verify('HMAC', clave, base64UrlABytes(partes[2]), enc.encode(`${partes[0]}.${partes[1]}`))
}
