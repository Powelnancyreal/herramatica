'use client'

import { useMemo, useState } from 'react'
import { csvAJson, jsonACsv } from '@/lib/calc/datos'
import { CopyButton, inputClass, secondaryButtonClass, Tabs } from '@/components/calc-ui'

const MODOS = [
  { id: 'csv', label: 'CSV → JSON' },
  { id: 'json', label: 'JSON → CSV' },
]
const DELIMITADORES = [
  { id: '', label: 'Detectar automáticamente' },
  { id: ',', label: 'Coma (,)' },
  { id: ';', label: 'Punto y coma (;)' },
  { id: '\t', label: 'Tabulador' },
  { id: '|', label: 'Barra vertical (|)' },
]
const EJEMPLO_CSV = 'nombre,edad,ciudad,activo\nAna Pérez,31,Guadalajara,true\n"López, Luis",27,Monterrey,false\nSofía,45,"Ciudad de México",true'

function descargar(texto, nombre, tipo) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([texto], { type: tipo }))
  a.download = nombre
  a.click()
  URL.revokeObjectURL(a.href)
}

export default function ConversorCsvJson() {
  const [modo, setModo] = useState('csv')
  const [entrada, setEntrada] = useState(EJEMPLO_CSV)
  const [delimitador, setDelimitador] = useState('')
  const [encabezados, setEncabezados] = useState(true)
  const [tipos, setTipos] = useState(true)
  const [compacto, setCompacto] = useState(false)

  const r = useMemo(() => {
    if (!entrada.trim()) return null
    try {
      if (modo === 'csv') {
        const res = csvAJson(entrada, { delimitador, encabezados, tipos })
        return { salida: JSON.stringify(res.datos, null, compacto ? 0 : 2), info: `${res.datos.length} registros · ${res.columnas} columnas · delimitador «${res.delimitador === '\t' ? 'tab' : res.delimitador}»` }
      }
      const salida = jsonACsv(entrada, delimitador || ',')
      return { salida, info: `${salida.split('\n').length - 1} filas de datos` }
    } catch (e) {
      return { error: e.message }
    }
  }, [entrada, modo, delimitador, encabezados, tipos, compacto])

  function cambiarModo(m) {
    if (r?.salida) setEntrada(r.salida)
    setModo(m)
  }

  function cargarArchivo(e) {
    const f = e.target.files?.[0]
    if (!f) return
    f.text().then(setEntrada)
    e.target.value = ''
  }

  return (
    <div className="space-y-4">
      <Tabs tabs={MODOS} value={modo} onChange={cambiarModo} />
      <div className="flex flex-wrap gap-3 items-center text-sm">
        <select value={delimitador} onChange={(e) => setDelimitador(e.target.value)} className={`${inputClass} max-w-[15rem]`} aria-label="Delimitador">
          {DELIMITADORES.filter((d) => modo === 'csv' || d.id).map((d) => (
            <option key={d.label} value={d.id}>{d.label}</option>
          ))}
        </select>
        {modo === 'csv' && (
          <>
            <label className="flex items-center gap-1.5"><input type="checkbox" checked={encabezados} onChange={(e) => setEncabezados(e.target.checked)} /> Primera fila = encabezados</label>
            <label className="flex items-center gap-1.5"><input type="checkbox" checked={tipos} onChange={(e) => setTipos(e.target.checked)} /> Detectar números y booleanos</label>
            <label className="flex items-center gap-1.5"><input type="checkbox" checked={compacto} onChange={(e) => setCompacto(e.target.checked)} /> JSON compacto</label>
          </>
        )}
        <label className={`${secondaryButtonClass} cursor-pointer`}>
          Abrir archivo
          <input type="file" accept={modo === 'csv' ? '.csv,.tsv,.txt' : '.json,.txt'} onChange={cargarArchivo} className="hidden" />
        </label>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{modo === 'csv' ? 'CSV de entrada' : 'JSON de entrada'}</label>
          <textarea value={entrada} onChange={(e) => setEntrada(e.target.value)} rows={14} className={`${inputClass} font-mono text-xs`} spellCheck={false} />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-sm font-medium text-gray-700">{modo === 'csv' ? 'JSON' : 'CSV'}</label>
            {r?.salida && (
              <div className="flex gap-2">
                <CopyButton text={r.salida} />
                <button type="button" className={secondaryButtonClass} onClick={() => descargar(modo === 'csv' ? r.salida : '﻿' + r.salida, modo === 'csv' ? 'datos.json' : 'datos.csv', modo === 'csv' ? 'application/json' : 'text/csv;charset=utf-8')}>
                  Descargar
                </button>
              </div>
            )}
          </div>
          <textarea readOnly value={r?.salida || ''} rows={14} className={`${inputClass} font-mono text-xs bg-gray-50`} />
        </div>
      </div>
      {r?.error && <p className="text-sm text-red-600">Error: {r.error}</p>}
      {r?.info && <p className="text-xs text-gray-500">{r.info}. La conversión se hace en tu navegador.</p>}
    </div>
  )
}
