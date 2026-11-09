// Genera el diccionario de la calculadora de anagramas: un archivo por longitud de palabra en
// public/datos/anagramas/es-N.txt. Cada línea agrupa las palabras que tienen exactamente las mismas letras,
// así la herramienta solo descarga las longitudes que necesita y encuentra los anagramas exactos sin recorrer todo.
//
// Origen: paquete npm «an-array-of-spanish-words» 2.0.0 (licencia MIT, © 2016 Zeke Sikelianos), derivado de
// la lista de palabras de Letterpress. Las palabras vienen en minúsculas y sin tildes; la ñ se conserva.
//
// Uso: npm pack an-array-of-spanish-words@2.0.0 en una carpeta temporal, descomprimir y luego
//   node scripts/anagramas/generar-diccionario.js <ruta a package/index.json> <ruta a package/license>

const fs = require('fs')
const path = require('path')

const [entrada, licencia] = process.argv.slice(2)
if (!entrada || !licencia) throw new Error('Uso: node scripts/anagramas/generar-diccionario.js <index.json> <license>')

const SALIDA = path.join(__dirname, '..', '..', 'public', 'datos', 'anagramas')
const palabras = JSON.parse(fs.readFileSync(entrada, 'utf8'))
const valida = /^[a-zñ]{2,}$/

const porLongitud = new Map()
for (const p of palabras) {
  if (!valida.test(p)) continue
  const clave = [...p].sort().join('')
  if (!porLongitud.has(p.length)) porLongitud.set(p.length, new Map())
  const grupos = porLongitud.get(p.length)
  if (!grupos.has(clave)) grupos.set(clave, [])
  grupos.get(clave).push(p)
}

fs.rmSync(SALIDA, { recursive: true, force: true })
fs.mkdirSync(SALIDA, { recursive: true })
let total = 0
const longitudes = [...porLongitud.keys()].sort((a, b) => a - b)
for (const n of longitudes) {
  const lineas = [...porLongitud.get(n).values()].map((g) => g.sort().join(' '))
  lineas.sort()
  fs.writeFileSync(path.join(SALIDA, `es-${n}.txt`), lineas.join('\n') + '\n')
  total += lineas.reduce((s, l) => s + l.split(' ').length, 0)
}
fs.writeFileSync(
  path.join(SALIDA, 'LICENCIA.txt'),
  'Diccionario de la calculadora de anagramas de Herramatica.\n' +
    'Generado a partir de «an-array-of-spanish-words» 2.0.0 (https://github.com/words/an-array-of-spanish-words),\n' +
    'derivado de la lista de palabras de Letterpress. Licencia original:\n\n' +
    fs.readFileSync(licencia, 'utf8')
)
fs.writeFileSync(path.join(SALIDA, 'indice.json'), JSON.stringify({ longitudes, palabras: total }) + '\n')
console.log(`${total} palabras en ${longitudes.length} archivos (longitudes ${longitudes[0]}–${longitudes.at(-1)})`)
