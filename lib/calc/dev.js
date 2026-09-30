// ─── MD5 (RFC 1321). Web Crypto no incluye MD5, así que se implementa aquí. ───
const S = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
  4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21]
const K = Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) >>> 0)

export function md5(bytes) {
  const len = bytes.length
  const totalLen = (((len + 8) >>> 6) + 1) * 64
  const buf = new Uint8Array(totalLen)
  buf.set(bytes)
  buf[len] = 0x80
  const bitLen = len * 8
  const view = new DataView(buf.buffer)
  view.setUint32(totalLen - 8, bitLen >>> 0, true)
  view.setUint32(totalLen - 4, Math.floor(bitLen / 2 ** 32), true)

  let a0 = 0x67452301
  let b0 = 0xefcdab89
  let c0 = 0x98badcfe
  let d0 = 0x10325476
  const M = new Uint32Array(16)

  for (let off = 0; off < totalLen; off += 64) {
    for (let j = 0; j < 16; j++) M[j] = view.getUint32(off + j * 4, true)
    let A = a0
    let B = b0
    let C = c0
    let D = d0
    for (let i = 0; i < 64; i++) {
      let F
      let g
      if (i < 16) {
        F = (B & C) | (~B & D)
        g = i
      } else if (i < 32) {
        F = (D & B) | (~D & C)
        g = (5 * i + 1) % 16
      } else if (i < 48) {
        F = B ^ C ^ D
        g = (3 * i + 5) % 16
      } else {
        F = C ^ (B | ~D)
        g = (7 * i) % 16
      }
      F = (F + A + K[i] + M[g]) >>> 0
      A = D
      D = C
      C = B
      B = (B + ((F << S[i]) | (F >>> (32 - S[i])))) >>> 0
    }
    a0 = (a0 + A) >>> 0
    b0 = (b0 + B) >>> 0
    c0 = (c0 + C) >>> 0
    d0 = (d0 + D) >>> 0
  }

  const out = new DataView(new ArrayBuffer(16))
  ;[a0, b0, c0, d0].forEach((v, i) => out.setUint32(i * 4, v, true))
  return bytesToHex(new Uint8Array(out.buffer))
}

export function bytesToHex(bytes) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

// ─── Base64 con soporte UTF-8 (btoa/atob solo aceptan Latin-1) ───
export function bytesToBase64(bytes) {
  let binario = ''
  const CHUNK = 0x8000
  for (let i = 0; i < bytes.length; i += CHUNK) binario += String.fromCharCode(...bytes.subarray(i, i + CHUNK))
  return btoa(binario)
}

export function codificarBase64(texto, urlSafe = false) {
  const b64 = bytesToBase64(new TextEncoder().encode(texto))
  return urlSafe ? b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') : b64
}

export function decodificarBase64(b64) {
  let limpio = b64.trim().replace(/^data:[^,]*,/, '').replace(/\s/g, '').replace(/-/g, '+').replace(/_/g, '/')
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(limpio)) throw new Error('El texto contiene caracteres que no pertenecen a Base64.')
  while (limpio.length % 4) limpio += '='
  const binario = atob(limpio)
  const bytes = Uint8Array.from(binario, (c) => c.charCodeAt(0))
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
}

// ─── UUID ───
function bytesAleatorios(n) {
  return crypto.getRandomValues(new Uint8Array(n))
}

function formatearUUID(bytes) {
  const h = bytesToHex(bytes)
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

export function uuidv4() {
  const b = bytesAleatorios(16)
  b[6] = (b[6] & 0x0f) | 0x40
  b[8] = (b[8] & 0x3f) | 0x80
  return formatearUUID(b)
}

// RFC 9562: 48 bits de marca de tiempo Unix en ms, versión 7, variante 10.
export function uuidv7(ms = Date.now()) {
  const b = bytesAleatorios(16)
  let t = ms
  for (let i = 5; i >= 0; i--) {
    b[i] = t % 256
    t = Math.floor(t / 256)
  }
  b[6] = (b[6] & 0x0f) | 0x70
  b[8] = (b[8] & 0x3f) | 0x80
  return formatearUUID(b)
}

export function fechaDeUUIDv7(uuid) {
  const hex = uuid.replace(/-/g, '').slice(0, 12)
  return new Date(parseInt(hex, 16))
}

// ─── Números aleatorios sin sesgo (rechazo de muestras) ───
export function enteroAleatorio(min, max) {
  const rango = max - min + 1
  if (rango <= 0 || rango > 2 ** 32) throw new Error('Rango no válido')
  const limite = Math.floor(2 ** 32 / rango) * rango
  const buf = new Uint32Array(1)
  let x
  do {
    crypto.getRandomValues(buf)
    x = buf[0]
  } while (x >= limite)
  return min + (x % rango)
}

export function barajar(lista) {
  const a = [...lista]
  for (let i = a.length - 1; i > 0; i--) {
    const j = enteroAleatorio(0, i)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── Correo electrónico ───
const DOMINIOS_COMUNES = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'yahoo.com.mx', 'yahoo.es', 'hotmail.es', 'live.com', 'icloud.com', 'protonmail.com', 'prodigy.net.mx', 'outlook.es']
const DESECHABLES = new Set(['mailinator.com', '10minutemail.com', 'guerrillamail.com', 'temp-mail.org', 'yopmail.com', 'trashmail.com', 'sharklasers.com', 'getnada.com', 'maildrop.cc', 'dispostable.com'])

function levenshtein(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
  for (let j = 1; j <= b.length; j++) d[0][j] = j
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
  return d[a.length][b.length]
}

export function validarEmail(entrada) {
  const email = entrada.trim()
  const errores = []
  const partes = email.split('@')
  if (partes.length !== 2) {
    errores.push(partes.length < 2 ? 'Falta el símbolo @.' : 'Solo puede haber un símbolo @.')
    return { email, valido: false, errores }
  }
  const [local, dominio] = partes
  if (!local) errores.push('Falta el nombre de usuario antes de la @.')
  else {
    if (local.length > 64) errores.push('La parte antes de la @ supera los 64 caracteres.')
    if (!/^[A-Za-z0-9!#$%&'*+/=?^_`{|}~.-]+$/.test(local)) errores.push('El usuario contiene caracteres no permitidos (como espacios, comas o acentos).')
    if (local.startsWith('.') || local.endsWith('.')) errores.push('El usuario no puede empezar ni terminar con punto.')
    if (local.includes('..')) errores.push('El usuario no puede tener dos puntos seguidos.')
  }
  const dom = dominio.toLowerCase()
  if (!dom) errores.push('Falta el dominio después de la @.')
  else {
    const etiquetas = dom.split('.')
    if (etiquetas.length < 2) errores.push('El dominio necesita una extensión, como .com o .mx.')
    if (etiquetas.some((e) => !e)) errores.push('El dominio tiene puntos vacíos o seguidos.')
    if (etiquetas.some((e) => e && !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(e))) errores.push('El dominio contiene caracteres no válidos.')
    const tld = etiquetas[etiquetas.length - 1]
    if (tld && !/^(?:[a-z]{2,63}|xn--[a-z0-9-]+)$/.test(tld)) errores.push('La extensión del dominio no es válida.')
  }
  if (email.length > 254) errores.push('El correo supera los 254 caracteres permitidos.')

  let sugerencia = null
  if (dom && !DOMINIOS_COMUNES.includes(dom)) {
    const cercano = DOMINIOS_COMUNES.map((d) => ({ d, dist: levenshtein(dom, d) })).sort((a, b) => a.dist - b.dist)[0]
    if (cercano.dist > 0 && cercano.dist <= 2) sugerencia = `${local}@${cercano.d}`
  }
  return { email, local, dominio: dom, valido: errores.length === 0, errores, sugerencia, desechable: DESECHABLES.has(dom) }
}

// ─── SMS: alfabeto GSM 03.38 ───
const GSM_BASICO = new Set(
  "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà"
)
const GSM_EXTENDIDO = new Set('^{}\\[~]|€\f')

export function analizarSMS(texto) {
  let unidadesGSM = 0
  const noGSM = new Set()
  for (const ch of texto) {
    if (GSM_BASICO.has(ch)) unidadesGSM += 1
    else if (GSM_EXTENDIDO.has(ch)) unidadesGSM += 2
    else noGSM.add(ch)
  }
  if (noGSM.size === 0) {
    const segmentos = unidadesGSM === 0 ? 0 : unidadesGSM <= 160 ? 1 : Math.ceil(unidadesGSM / 153)
    return { codificacion: 'GSM-7', unidades: unidadesGSM, limite: segmentos <= 1 ? 160 : 153, segmentos, noGSM: [] }
  }
  const unidades = texto.length
  const segmentos = unidades <= 70 ? 1 : Math.ceil(unidades / 67)
  return { codificacion: 'Unicode (UCS-2)', unidades, limite: segmentos <= 1 ? 70 : 67, segmentos, noGSM: [...noGSM] }
}

// ─── JSON: validador propio para ubicar el error (V8 ya no informa la posición) ───
export function diagnosticarJSON(texto) {
  let i = 0
  const falla = (mensaje, pos = i) => {
    const antes = texto.slice(0, pos).split('\n')
    const error = new Error(mensaje)
    error.linea = antes.length
    error.columna = antes[antes.length - 1].length + 1
    throw error
  }
  const ws = () => {
    while (i < texto.length && ' \t\n\r'.includes(texto[i])) i++
  }
  const describir = () => (i >= texto.length ? 'el final del texto' : `"${texto[i]}"`)

  function cadena() {
    const inicio = i
    i++
    while (i < texto.length) {
      const c = texto[i]
      if (c === '"') return i++
      if (c === '\\') {
        const e = texto[i + 1]
        if (e === 'u') {
          if (!/^[0-9a-fA-F]{4}$/.test(texto.slice(i + 2, i + 6))) falla('Secuencia \\u no válida: debe tener 4 dígitos hexadecimales.')
          i += 6
        } else if ('"\\/bfnrt'.includes(e)) i += 2
        else falla(`Secuencia de escape no válida: \\${e ?? ''}.`)
      } else if (c.charCodeAt(0) < 0x20) falla('Las cadenas no pueden contener saltos de línea ni tabuladores sin escapar (usa \\n o \\t).')
      else i++
    }
    falla('Cadena sin cerrar: falta la comilla doble final.', inicio)
  }

  function valor() {
    ws()
    const c = texto[i]
    if (c === '{') return objeto()
    if (c === '[') return arreglo()
    if (c === '"') return cadena()
    for (const lit of ['true', 'false', 'null']) if (texto.startsWith(lit, i)) return (i += lit.length)
    const num = /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/y
    num.lastIndex = i
    if ((c === '-' || (c >= '0' && c <= '9')) && num.test(texto)) return (i = num.lastIndex)
    if (c === "'") falla('JSON solo admite comillas dobles ("), no simples.')
    if (c === undefined) falla('Falta un valor: el texto termina antes de tiempo.')
    falla(`Valor no válido: se encontró ${describir()}. Se esperaba un objeto, arreglo, texto, número, true, false o null.`)
  }

  function objeto() {
    i++
    ws()
    if (texto[i] === '}') return i++
    for (;;) {
      ws()
      if (texto[i] !== '"') falla(texto[i] === "'" ? 'Las claves deben ir entre comillas dobles ("), no simples.' : `Se esperaba una clave entre comillas dobles y se encontró ${describir()}.`)
      cadena()
      ws()
      if (texto[i] !== ':') falla(`Se esperaban dos puntos (:) después de la clave y se encontró ${describir()}.`)
      i++
      valor()
      ws()
      if (texto[i] === ',') {
        i++
        ws()
        if (texto[i] === '}') falla('Coma sobrante antes de "}": JSON no permite comas finales.')
        continue
      }
      if (texto[i] === '}') return i++
      falla(`Se esperaba una coma (,) o "}" y se encontró ${describir()}.`)
    }
  }

  function arreglo() {
    i++
    ws()
    if (texto[i] === ']') return i++
    for (;;) {
      valor()
      ws()
      if (texto[i] === ',') {
        i++
        ws()
        if (texto[i] === ']') falla('Coma sobrante antes de "]": JSON no permite comas finales.')
        continue
      }
      if (texto[i] === ']') return i++
      falla(`Se esperaba una coma (,) o "]" y se encontró ${describir()}.`)
    }
  }

  try {
    if (!texto.trim()) return { valido: false, mensaje: 'El texto está vacío.', linea: 1, columna: 1 }
    valor()
    ws()
    if (i < texto.length) falla(`Contenido extra después del JSON: ${describir()}.`)
    return { valido: true }
  } catch (e) {
    return { valido: false, mensaje: e.message, linea: e.linea, columna: e.columna }
  }
}

// ─── Lorem ipsum ───
const PALABRAS_LOREM = (
  'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ' +
  'enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in ' +
  'reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa ' +
  'qui officia deserunt mollit anim id est laborum pellentesque habitant morbi tristique senectus netus malesuada fames ac ' +
  'turpis egestas vestibulum tortor quam feugiat vitae ultricies eget tempor sit amet ante donec eu libero sit amet quam ' +
  'egestas semper aenean ultricies mi vitae est mauris placerat eleifend leo quisque sit amet est et sapien ullamcorper ' +
  'pharetra vestibulum erat wisi condimentum sed commodo vitae ornare sit amet wisi integer gravida'
).split(' ')

const azar = (min, max) => min + Math.floor(Math.random() * (max - min + 1))

function oracionLorem(largo) {
  const palabras = Array.from({ length: largo }, () => PALABRAS_LOREM[azar(0, PALABRAS_LOREM.length - 1)])
  if (largo > 8) palabras[azar(3, largo - 4)] += ','
  const s = palabras.join(' ')
  return s.charAt(0).toUpperCase() + s.slice(1) + '.'
}

export function generarLorem({ tipo, cantidad, empezarConLorem = true }) {
  const INICIO = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  if (tipo === 'palabras') {
    const palabras = Array.from({ length: cantidad }, () => PALABRAS_LOREM[azar(0, PALABRAS_LOREM.length - 1)])
    if (empezarConLorem) ['lorem', 'ipsum', 'dolor', 'sit', 'amet'].slice(0, cantidad).forEach((w, i) => (palabras[i] = w))
    const s = palabras.join(' ')
    return [s.charAt(0).toUpperCase() + s.slice(1)]
  }
  if (tipo === 'oraciones') {
    const oraciones = Array.from({ length: cantidad }, () => oracionLorem(azar(8, 15)))
    if (empezarConLorem) oraciones[0] = INICIO
    return [oraciones.join(' ')]
  }
  const parrafos = Array.from({ length: cantidad }, () =>
    Array.from({ length: azar(4, 7) }, () => oracionLorem(azar(8, 15))).join(' ')
  )
  if (empezarConLorem) parrafos[0] = `${INICIO} ${parrafos[0]}`
  return parrafos
}
