'use client'

import { useState } from 'react'
import { diagnosticarJSON } from '@/lib/calc/dev'
import { buttonClass, CopyButton, inputClass, secondaryButtonClass } from '@/components/calc-ui'

const EJEMPLO = '{"nombre":"Herramatica","herramientas":96,"gratis":true,"categorias":["calculadoras","generadores"],"contacto":{"email":"info@herramatica.com"}}'

function ordenarClaves(valor) {
  if (Array.isArray(valor)) return valor.map(ordenarClaves)
  if (valor && typeof valor === 'object')
    return Object.fromEntries(Object.keys(valor).sort().map((k) => [k, ordenarClaves(valor[k])]))
  return valor
}

export default function FormateadorJSON() {
  const [entrada, setEntrada] = useState('')
  const [salida, setSalida] = useState('')
  const [sangria, setSangria] = useState('2')
  const [ordenar, setOrdenar] = useState(false)
  const [estado, setEstado] = useState(null)

  function procesar(minificar) {
    const diag = diagnosticarJSON(entrada)
    if (!diag.valido) {
      setSalida('')
      return setEstado({ ok: false, ...diag })
    }
    let datos = JSON.parse(entrada)
    if (ordenar) datos = ordenarClaves(datos)
    const texto = minificar ? JSON.stringify(datos) : JSON.stringify(datos, null, sangria === 'tab' ? '\t' : Number(sangria))
    setSalida(texto)
    setEstado({ ok: true, bytes: new TextEncoder().encode(texto).length, minificado: minificar })
  }

  const lineaError = estado && !estado.ok ? entrada.split('\n')[estado.linea - 1] : null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">JSON de entrada</label>
        <button type="button" className="text-xs text-blue-600 hover:underline" onClick={() => setEntrada(EJEMPLO)}>
          Cargar ejemplo
        </button>
      </div>
      <textarea
        value={entrada}
        onChange={(e) => setEntrada(e.target.value)}
        rows={10}
        spellCheck={false}
        placeholder='{"clave": "valor"}'
        className={`${inputClass} font-mono text-sm`}
      />
      <div className="flex flex-wrap items-center gap-3">
        <select value={sangria} onChange={(e) => setSangria(e.target.value)} className={`${inputClass} w-auto`}>
          <option value="2">Sangría: 2 espacios</option>
          <option value="4">Sangría: 4 espacios</option>
          <option value="tab">Sangría: tabulador</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={ordenar} onChange={(e) => setOrdenar(e.target.checked)} /> Ordenar claves A-Z
        </label>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button onClick={() => procesar(false)} className={buttonClass}>Formatear y validar</button>
        <button onClick={() => procesar(true)} className={`${secondaryButtonClass} py-3`}>Minificar</button>
      </div>

      {estado && !estado.ok && (
        <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4 space-y-2">
          <p className="font-semibold text-red-700">✗ JSON no válido · línea {estado.linea}, columna {estado.columna}</p>
          <p className="text-sm text-red-800">{estado.mensaje}</p>
          {lineaError !== undefined && lineaError !== null && (
            <pre className="text-xs bg-white border border-red-100 rounded p-2 overflow-x-auto">
              {lineaError}
              {'\n'}
              {' '.repeat(Math.max(0, estado.columna - 1))}^
            </pre>
          )}
        </div>
      )}
      {estado?.ok && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-green-700">
              ✓ JSON válido · {estado.bytes.toLocaleString('es-MX')} bytes {estado.minificado ? '(minificado)' : ''}
            </p>
            <CopyButton text={salida} />
          </div>
          <pre className="bg-gray-900 text-green-300 text-sm rounded-lg p-4 overflow-x-auto max-h-[28rem]">{salida}</pre>
        </div>
      )}
      <p className="text-xs text-gray-500">Tu JSON se procesa en tu navegador y nunca se envía a ningún servidor.</p>
    </div>
  )
}
