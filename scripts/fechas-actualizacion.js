// Calcula la fecha real de última modificación de cada página para el <lastmod> del sitemap y la guarda en
// data/fechas.json. Se ejecuta antes de cada build (npm run build → prebuild).
//
// - Herramientas: la fecha cambia solo cuando cambia su contenido visible (textos de tools.json o su componente
//   en tools/). Cambios automáticos como las herramientas relacionadas o la imagen no cuentan.
// - Páginas fijas (legales, categorías, blog, inicio): última fecha de commit de su archivo.
// La primera vez reconstruye las fechas desde el historial de git; después, solo actualiza a hoy lo que cambie.

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const { execSync } = require('child_process')

const ROOT = path.join(__dirname, '..')
const SALIDA = path.join(ROOT, 'data', 'fechas.json')
const CAMPOS = ['name', 'shortName', 'metaTitle', 'metaDescription', 'intro', 'howToUse', 'benefits', 'contentSections', 'faqs']
const hoy = new Date().toISOString().slice(0, 10)

const git = (cmd) => {
  try {
    return execSync(`git ${cmd}`, { cwd: ROOT, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    return ''
  }
}
// Un clon superficial (como el del servidor de despliegue) no tiene el historial completo: sus fechas serían falsas,
// así que en ese caso se conservan las de data/fechas.json.
const hayGit = git('rev-parse --is-inside-work-tree') === 'true' && git('rev-parse --is-shallow-repository') !== 'true'
const fechaArchivo = (rel) => (hayGit && git(`log -1 --format=%cs -- "${rel}"`)) || null
const contenido = (tool) => JSON.stringify(CAMPOS.map((c) => tool[c] ?? null))
const hash = (texto) => crypto.createHash('sha1').update(texto).digest('hex').slice(0, 12)
const componente = (slug) => {
  const f = path.join(ROOT, 'tools', `${slug}.js`)
  return fs.existsSync(f) ? fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n') : ''
}
const mayor = (...fechas) => fechas.filter(Boolean).sort().at(-1) || null

// Primera ejecución: recorre los commits que tocaron tools.json y anota cuándo cambió el contenido de cada herramienta.
function desdeHistorial() {
  const fechas = {}
  const commits = git('log --reverse --format="%H %cs" -- data/tools.json').split('\n').filter(Boolean)
  for (const linea of commits) {
    const [sha, fecha] = linea.replace(/"/g, '').split(' ')
    let tools
    try {
      tools = JSON.parse(git(`show ${sha}:data/tools.json`))
    } catch {
      continue
    }
    for (const t of tools) {
      const h = hash(contenido(t))
      const previo = fechas[t.slug]
      if (!previo) fechas[t.slug] = { creado: fecha, actualizado: fecha, contenido: h }
      else if (previo.contenido !== h) Object.assign(previo, { actualizado: fecha, contenido: h })
    }
  }
  return fechas
}

function main() {
  const tools = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'tools.json'), 'utf8'))
  const previo = fs.existsSync(SALIDA) ? JSON.parse(fs.readFileSync(SALIDA, 'utf8')) : null
  const historial = previo ? null : hayGit ? desdeHistorial() : {}

  const herramientas = {}
  for (const t of tools) {
    const h = hash(contenido(t))
    const hc = hash(componente(t.slug))
    const antes = previo?.herramientas?.[t.slug]
    if (antes) {
      // Ejecuciones siguientes: si cambió el texto o el componente, la página se actualizó hoy.
      const cambio = antes.contenido !== h || antes.componente !== hc
      herramientas[t.slug] = { ...antes, contenido: h, componente: hc, actualizado: cambio ? hoy : antes.actualizado }
    } else {
      const base = historial?.[t.slug]
      const actualizado = mayor(base?.actualizado, fechaArchivo(`tools/${t.slug}.js`)) || hoy
      herramientas[t.slug] = { creado: base?.creado || actualizado, actualizado, contenido: h, componente: hc }
    }
  }

  // Páginas sin datos propios: la fecha de su archivo; si no hay git, se conserva la anterior.
  const archivo = (clave, rel) => fechaArchivo(rel) || previo?.paginas?.[clave] || hoy
  const paginas = {}
  for (const p of ['privacidad', 'terminos', 'cookies', 'acerca', 'contacto']) paginas[p] = archivo(p, `app/${p}/page.js`)
  for (const c of ['calculadoras', 'convertidores', 'generadores', 'juegos', 'texto']) paginas[c] = archivo(c, `app/${c}/page.js`)
  paginas.inicio = archivo('inicio', 'app/page.js')

  fs.writeFileSync(SALIDA, JSON.stringify({ herramientas, paginas }, null, 2) + '\n')
  const dist = {}
  Object.values(herramientas).forEach((h) => { dist[h.actualizado] = (dist[h.actualizado] || 0) + 1 })
  console.log(`Fechas de ${tools.length} herramientas${historial ? ' (reconstruidas desde git)' : ''}:`, dist)
}

main()
