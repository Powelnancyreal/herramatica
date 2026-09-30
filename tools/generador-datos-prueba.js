'use client'

import { useState } from 'react'
import { aSQL, CAMPOS, generarPersona, PAISES } from '@/lib/calc/datos-prueba'
import { jsonACsv } from '@/lib/calc/datos'
import { buttonClass, CopyButton, inputClass, NumberInput, secondaryButtonClass, Tabs } from '@/components/calc-ui'

const FORMATOS = [
  { id: 'json', label: 'JSON' },
  { id: 'csv', label: 'CSV' },
  { id: 'sql', label: 'SQL' },
]
const PREDETERMINADOS = ['id', 'nombre', 'apellidos', 'email', 'telefono', 'fechaNacimiento', 'ciudad']

export default function GeneradorDatosPrueba() {
  const [paisId, setPaisId] = useState('mx')
  const [cantidad, setCantidad] = useState('10')
  const [campos, setCampos] = useState(PREDETERMINADOS)
  const [formato, setFormato] = useState('json')
  const [tabla, setTabla] = useState('personas')
  const [registros, setRegistros] = useState([])

  const toggle = (id) => setCampos((c) => (c.includes(id) ? c.filter((x) => x !== id) : CAMPOS.map((x) => x.id).filter((x) => c.includes(x) || x === id)))

  function generar() {
    const n = Math.min(1000, Math.max(1, parseInt(cantidad, 10) || 10))
    const pais = PAISES.find((p) => p.id === paisId)
    setRegistros(Array.from({ length: n }, (_, i) => generarPersona(i, pais, campos)))
  }

  const salida = !registros.length ? '' : formato === 'json' ? JSON.stringify(registros, null, 2) : formato === 'csv' ? jsonACsv(JSON.stringify(registros)) : aSQL(registros, tabla.replace(/[^\w]/g, '') || 'personas')

  function descargar() {
    const ext = { json: 'json', csv: 'csv', sql: 'sql' }[formato]
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([formato === 'csv' ? '﻿' + salida : salida], { type: 'text/plain;charset=utf-8' }))
    a.download = `datos-de-prueba.${ext}`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">País de los datos</label>
          <select value={paisId} onChange={(e) => setPaisId(e.target.value)} className={inputClass}>
            {PAISES.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Número de registros (máx. 1000)</label>
          <NumberInput value={cantidad} onChange={setCantidad} min="1" max="1000" step="1" />
        </div>
        {formato === 'sql' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre de la tabla</label>
            <input value={tabla} onChange={(e) => setTabla(e.target.value)} className={`${inputClass} font-mono`} />
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Campos</p>
        <div className="flex flex-wrap gap-2">
          {CAMPOS.map((c) => (
            <button key={c.id} type="button" onClick={() => toggle(c.id)} aria-pressed={campos.includes(c.id)} className={`px-3 py-1.5 rounded-full text-sm border ${campos.includes(c.id) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>
      <Tabs tabs={FORMATOS} value={formato} onChange={setFormato} />
      <button onClick={generar} disabled={!campos.length} className={buttonClass}>Generar datos de prueba</button>

      {salida && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <CopyButton text={salida} />
            <button type="button" onClick={descargar} className={secondaryButtonClass}>Descargar .{formato}</button>
          </div>
          <textarea readOnly value={salida} rows={14} className={`${inputClass} font-mono text-xs bg-gray-50`} aria-label="Datos generados" />
          <p className="text-xs text-gray-500">
            Datos ficticios generados al azar: los correos usan dominios reservados para pruebas y cualquier parecido con personas
            reales es coincidencia. No los uses para suplantar identidades.
          </p>
        </div>
      )}
    </div>
  )
}
