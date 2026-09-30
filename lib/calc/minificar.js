// Minificadores de CSS y HTML sin dependencias. El de JavaScript usa terser (se carga bajo demanda).

// Separa el texto en trozos de cadena ("..." o '...') y de código, para no tocar el contenido de las cadenas.
function trozosCSS(css) {
  const trozos = []
  let i = 0
  let codigo = ''
  while (i < css.length) {
    const ch = css[i]
    if (ch === '"' || ch === "'") {
      let j = i + 1
      while (j < css.length && css[j] !== ch) j += css[j] === '\\' ? 2 : 1
      trozos.push({ codigo })
      trozos.push({ cadena: css.slice(i, j + 1) })
      codigo = ''
      i = j + 1
    } else if (ch === '/' && css[i + 1] === '*') {
      const fin = css.indexOf('*/', i + 2)
      const comentario = css.slice(i, fin === -1 ? css.length : fin + 2)
      // Los comentarios /*! ... */ suelen ser licencias: se conservan.
      if (comentario.startsWith('/*!')) {
        trozos.push({ codigo })
        trozos.push({ cadena: comentario })
        codigo = ''
      }
      i = fin === -1 ? css.length : fin + 2
    } else {
      codigo += ch
      i++
    }
  }
  trozos.push({ codigo })
  return trozos
}

export function minificarCSS(css) {
  return trozosCSS(css)
    .map((t) =>
      t.cadena !== undefined
        ? t.cadena
        : t.codigo
            .replace(/\s+/g, ' ')
            .replace(/\s*([{};,])\s*/g, '$1')
            .replace(/:\s+/g, ':')
            .replace(/;}/g, '}')
    )
    .join('')
    .trim()
}

const PRESERVAR = /<(pre|textarea|script|style)\b[\s\S]*?<\/\1>/gi

export function minificarHTML(html, { quitarComentarios = true } = {}) {
  const guardados = []
  let s = html.replace(PRESERVAR, (m) => {
    const tag = m.slice(1, m.search(/[\s>]/)).toLowerCase()
    let bloque = m
    if (tag === 'style') bloque = m.replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/i, (_, a, b, c) => a + minificarCSS(b) + c)
    guardados.push(bloque)
    return `\u0000${guardados.length - 1}\u0000`
  })
  if (quitarComentarios) s = s.replace(/<!--(?!\[if)[\s\S]*?-->/g, '')
  s = s
    .replace(/>\s*\n\s*</g, '><')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+>/g, '>')
    .trim()
  return s.replace(/\u0000(\d+)\u0000/g, (_, n) => guardados[Number(n)])
}

export function bytes(texto) {
  return new TextEncoder().encode(texto).length
}
