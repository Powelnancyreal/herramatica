// Reescribe relatedTools en data/tools.json para que cada herramienta enlace como máximo a 8 herramientas
// del mismo tema. Uso: node scripts/curar-relacionadas.js [--dry-run]
// Al añadir herramientas nuevas, asígnales temas (y país si aplica) en data/temas-herramientas.json y vuelve a ejecutarlo.

const fs = require('fs')
const path = require('path')

const MAX = 8
const MIN = 4

// data/temas-herramientas.json → slug: [temas por orden de importancia, país opcional como "MX", "ES", ...].
// Lo usan este script y la página /calculadoras para agrupar las herramientas.
const TEMAS = require('../data/temas-herramientas.json')

// Listas fijadas a mano: se respetan tal cual.
const FIJAS = {
  'calculadora-porcentaje': ['calcular-iva', 'calcular-descuento', 'calculadora-propinas', 'calculadora-roi', 'calculadora-comision-ventas', 'dividir-cuenta', 'calculadora-prestamo', 'calculadora-nota-necesaria'],
}

const PAISES = new Set(['MX', 'ES', 'AR', 'CO', 'PE', 'CL', 'EC', 'UY'])
const info = (slug) => {
  const t = TEMAS[slug]
  return { temas: t.filter((x) => !PAISES.has(x)), pais: t.find((x) => PAISES.has(x)) || null }
}

// Afinidad entre dos herramientas: tema principal compartido pesa más que uno secundario;
// el mismo país suma, y un país distinto en temas locales (laboral, impuestos...) resta.
function afinidad(a, b, { relajada = false } = {}) {
  const A = info(a)
  const B = info(b)
  let s = 0
  A.temas.forEach((t, i) => {
    const j = B.temas.indexOf(t)
    if (j !== -1) s += (i === 0 ? 4 : 2) + (j === 0 ? 2 : 0)
  })
  const mismoPais = A.pais && A.pais === B.pais
  // Dentro de un mismo país, nómina, impuestos y pensiones forman un solo bloque aunque no compartan tema.
  if (s === 0) return mismoPais && BLOQUE_PAIS.has(A.temas[0]) && BLOQUE_PAIS.has(B.temas[0]) ? 4 : 0
  if (A.pais && B.pais) s += mismoPais ? 4 : !relajada && SOLO_SU_PAIS.has(A.temas[0]) ? -6 : -1
  else if (A.pais || B.pais) s -= 1
  return s
}
const BLOQUE_PAIS = new Set(['laboral', 'impuestos', 'pension', 'despido', 'vacaciones', 'moneda'])
// Temas cuya ley cambia por país: una herramienta de otro país casi nunca le sirve al mismo usuario.
const SOLO_SU_PAIS = new Set(['laboral', 'impuestos', 'pension', 'despido', 'vacaciones'])

function main() {
  const dryRun = process.argv.includes('--dry-run')
  const file = path.join(__dirname, '..', 'data', 'tools.json')
  const tools = JSON.parse(fs.readFileSync(file, 'utf8'))
  const faltan = tools.filter((t) => !TEMAS[t.slug]).map((t) => t.slug)
  if (faltan.length) throw new Error(`Faltan temas para: ${faltan.join(', ')}`)

  const UMBRAL = 4
  let cambios = 0
  for (const t of tools) {
    const antes = t.relatedTools || []
    let nueva
    if (FIJAS[t.slug]) {
      nueva = FIJAS[t.slug]
    } else {
      const posicion = new Map(antes.map((s, i) => [s, i]))
      // Candidatas: todas las herramientas afines; las que ya estaban elegidas a mano ganan en empate.
      nueva = tools
        .filter((o) => o.slug !== t.slug)
        .map((o) => ({ slug: o.slug, base: afinidad(t.slug, o.slug) }))
        .filter((o) => o.base >= UMBRAL)
        .map((o) => ({ ...o, s: o.base + (posicion.has(o.slug) ? 1.5 : 0) }))
        .sort((x, y) => y.s - x.s || (posicion.get(x.slug) ?? 99) - (posicion.get(y.slug) ?? 99))
        .slice(0, MAX)
        .map((o) => o.slug)
      if (nueva.length < MIN) {
        // Tema muy pequeño (p. ej. un país con dos herramientas): completa con las más cercanas, ya sin castigar
        // otro país, y prefiriendo las que ya estaban elegidas a mano.
        const extra = tools
          .filter((o) => o.slug !== t.slug && !nueva.includes(o.slug))
          .map((o) => ({ slug: o.slug, s: afinidad(t.slug, o.slug, { relajada: true }) }))
          .filter((o) => o.s > 0)
          .map((o) => ({ ...o, s: o.s + (posicion.has(o.slug) ? 1.5 : 0) }))
          .sort((x, y) => y.s - x.s)
        nueva = nueva.concat(extra.slice(0, MIN - nueva.length).map((o) => o.slug))
      }
    }
    if (JSON.stringify(nueva) !== JSON.stringify(antes)) cambios++
    t.relatedTools = nueva
  }

  const dist = {}
  tools.forEach((t) => { dist[t.relatedTools.length] = (dist[t.relatedTools.length] || 0) + 1 })
  console.log(`${cambios} herramientas cambiadas. Relacionadas por herramienta:`, dist)
  if (!dryRun) fs.writeFileSync(file, JSON.stringify(tools, null, 2) + '\n')
}

module.exports = { TEMAS, afinidad }
if (require.main === module) main()
