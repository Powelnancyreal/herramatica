'use client'

import { useState } from 'react'
import { bytes, minificarCSS, minificarHTML } from '@/lib/calc/minificar'
import { buttonClass, CopyButton, formatNumber, inputClass, Tabs } from '@/components/calc-ui'

const LENGUAJES = [
  { id: 'js', label: 'JavaScript' },
  { id: 'css', label: 'CSS' },
  { id: 'html', label: 'HTML' },
]

const EJEMPLOS = {
  js: `// Calcula el total con IVA
function calcularTotal(precios, tasaIva) {
  const subtotal = precios.reduce((suma, precio) => suma + precio, 0);
  const iva = subtotal * tasaIva;
  return { subtotal, iva, total: subtotal + iva };
}

console.log(calcularTotal([120, 80, 45.5], 0.16));`,
  css: `/* Botón principal */
.boton-principal {
  background-color: #2563eb;
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 8px;
  font-family: "Helvetica Neue", Arial, sans-serif;
}

.boton-principal:hover {
  background-color: #1d4ed8;
}`,
  html: `<!DOCTYPE html>
<html lang="es">
  <head>
    <!-- Metadatos -->
    <meta charset="utf-8">
    <title>Mi página</title>
  </head>
  <body>
    <h1>Hola, mundo</h1>
    <p>
      Texto de ejemplo con <strong>negritas</strong>.
    </p>
  </body>
</html>`,
}

function formatoBytes(n) {
  return n < 1024 ? `${n} B` : `${formatNumber(n / 1024, 2)} KB`
}

export default function MinificadorCodigo() {
  const [lenguaje, setLenguaje] = useState('js')
  const [codigo, setCodigo] = useState(EJEMPLOS.js)
  const [salida, setSalida] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [manglar, setManglar] = useState(true)
  const [quitarConsole, setQuitarConsole] = useState(false)

  function cambiarLenguaje(l) {
    setLenguaje(l)
    if (Object.values(EJEMPLOS).includes(codigo) || !codigo.trim()) setCodigo(EJEMPLOS[l])
    setSalida('')
    setError('')
  }

  async function minificar() {
    setError('')
    setCargando(true)
    try {
      if (lenguaje === 'css') setSalida(minificarCSS(codigo))
      else if (lenguaje === 'html') setSalida(minificarHTML(codigo))
      else {
        const { minify } = await import('terser')
        const r = await minify(codigo, {
          compress: { drop_console: quitarConsole, passes: 2 },
          mangle: manglar,
          format: { comments: /^!|@license|@preserve/ },
        })
        setSalida(r.code || '')
      }
    } catch (e) {
      const linea = e.line ? ` (línea ${e.line}, columna ${e.col + 1})` : ''
      setError(`No se pudo minificar: ${e.message}${linea}. Revisa que el código no tenga errores de sintaxis.`)
      setSalida('')
    } finally {
      setCargando(false)
    }
  }

  const antes = bytes(codigo)
  const despues = bytes(salida)

  return (
    <div className="space-y-4">
      <Tabs tabs={LENGUAJES} value={lenguaje} onChange={cambiarLenguaje} />
      <textarea value={codigo} onChange={(e) => setCodigo(e.target.value)} rows={12} className={`${inputClass} font-mono text-xs`} spellCheck={false} aria-label="Código original" />
      {lenguaje === 'js' && (
        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          <label className="flex items-center gap-1.5"><input type="checkbox" checked={manglar} onChange={(e) => setManglar(e.target.checked)} /> Acortar nombres de variables</label>
          <label className="flex items-center gap-1.5"><input type="checkbox" checked={quitarConsole} onChange={(e) => setQuitarConsole(e.target.checked)} /> Eliminar console.log</label>
        </div>
      )}
      <button onClick={minificar} disabled={cargando || !codigo.trim()} className={buttonClass}>
        {cargando ? 'Minificando…' : `Minificar ${LENGUAJES.find((l) => l.id === lenguaje).label}`}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {salida && (
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4 space-y-3">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <p className="text-sm text-gray-800">
              {formatoBytes(antes)} → <strong>{formatoBytes(despues)}</strong> · ahorro del{' '}
              <strong className="text-green-700">{formatNumber(antes ? (1 - despues / antes) * 100 : 0, 1)}%</strong>
            </p>
            <CopyButton text={salida} label="Copiar código minificado" />
          </div>
          <textarea readOnly value={salida} rows={8} className={`${inputClass} font-mono text-xs bg-white`} aria-label="Código minificado" />
        </div>
      )}
    </div>
  )
}
