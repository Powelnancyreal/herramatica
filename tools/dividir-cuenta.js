'use client'

import { useMemo, useState } from 'react'
import { formatMXN, NumberInput, ResultBox, Row, Rows, secondaryButtonClass, Tabs, inputClass } from '@/components/calc-ui'

const MODOS = [
  { id: 'partes', label: 'Partes iguales' },
  { id: 'consumo', label: 'Cada quien lo suyo' },
]
const PROPINAS = [0, 10, 15, 20]

const persona = (nombre) => ({ id: Math.random().toString(36).slice(2), nombre, consumo: '' })

export default function DividirCuenta() {
  const [modo, setModo] = useState('partes')
  const [total, setTotal] = useState('')
  const [personas, setPersonas] = useState('4')
  const [propina, setPropina] = useState('10')
  const [redondear, setRedondear] = useState(false)
  const [lista, setLista] = useState([persona('Persona 1'), persona('Persona 2'), persona('Persona 3')])
  const [compartido, setCompartido] = useState('')

  const p = parseFloat(propina) || 0
  const redondeo = (x) => (redondear ? Math.ceil(x / 10) * 10 : x)

  const partes = useMemo(() => {
    const t = parseFloat(total)
    const n = parseInt(personas, 10)
    if (!(t > 0 && n >= 1)) return null
    const conPropina = t * (1 + p / 100)
    const cada = conPropina / n
    return { t, n, propina: t * (p / 100), conPropina, cada, cadaRedondeado: redondeo(cada) }
  }, [total, personas, p, redondear])

  const consumo = useMemo(() => {
    const comun = parseFloat(compartido) || 0
    const validos = lista.filter((x) => parseFloat(x.consumo) >= 0 && x.consumo !== '')
    if (!validos.length && !comun) return null
    const porPersonaComun = comun / lista.length
    const filas = lista.map((x) => {
      const propio = parseFloat(x.consumo) || 0
      const sub = propio + porPersonaComun
      return { ...x, propio, sub, total: redondeo(sub * (1 + p / 100)) }
    })
    const subtotal = filas.reduce((s, f) => s + f.sub, 0)
    return { filas, subtotal, conPropina: subtotal * (1 + p / 100), porPersonaComun, cobrado: filas.reduce((s, f) => s + f.total, 0) }
  }, [lista, compartido, p, redondear])

  const cambiar = (id, campo, v) => setLista((l) => l.map((x) => (x.id === id ? { ...x, [campo]: v } : x)))

  return (
    <div className="space-y-5">
      <Tabs tabs={MODOS} value={modo} onChange={setModo} />
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-gray-700">Propina:</span>
        {PROPINAS.map((x) => (
          <button key={x} type="button" onClick={() => setPropina(String(x))} className={`px-3 py-1.5 rounded-lg text-sm border ${p === x ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300 text-gray-700'}`}>
            {x}%
          </button>
        ))}
        <div className="w-24"><NumberInput value={propina} onChange={setPropina} min="0" suffix="%" aria-label="Propina personalizada" /></div>
        <label className="flex items-center gap-1.5 text-sm text-gray-700 ml-2">
          <input type="checkbox" checked={redondear} onChange={(e) => setRedondear(e.target.checked)} /> Redondear a $10
        </label>
      </div>

      {modo === 'partes' ? (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Total de la cuenta</label>
              <NumberInput value={total} onChange={setTotal} prefix="$" min="0" placeholder="Ej: 1850" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Personas</label>
              <NumberInput value={personas} onChange={setPersonas} min="1" step="1" />
            </div>
          </div>
          {partes && (
            <ResultBox label="Paga cada persona" value={formatMXN(partes.cadaRedondeado)}>
              <Rows>
                <Row label="Cuenta" value={formatMXN(partes.t)} />
                <Row label={`Propina (${p}%)`} value={formatMXN(partes.propina)} />
                <Row label="Total con propina" value={formatMXN(partes.conPropina)} bold />
                {redondear && <Row label="Sobra con el redondeo (propina extra)" value={formatMXN(partes.cadaRedondeado * partes.n - partes.conPropina)} />}
              </Rows>
            </ResultBox>
          )}
        </>
      ) : (
        <>
          <div className="space-y-2">
            {lista.map((x) => (
              <div key={x.id} className="flex gap-2 items-center">
                <input value={x.nombre} onChange={(e) => cambiar(x.id, 'nombre', e.target.value)} className={inputClass} aria-label="Nombre" />
                <div className="w-40 flex-shrink-0"><NumberInput value={x.consumo} onChange={(v) => cambiar(x.id, 'consumo', v)} prefix="$" min="0" placeholder="Consumió" /></div>
                {lista.length > 1 && <button type="button" onClick={() => setLista((l) => l.filter((y) => y.id !== x.id))} className="text-red-600 px-1" aria-label="Quitar persona">✕</button>}
              </div>
            ))}
            <button type="button" onClick={() => setLista((l) => [...l, persona(`Persona ${l.length + 1}`)])} className={secondaryButtonClass}>+ Añadir persona</button>
          </div>
          <div className="max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Consumo compartido (entradas, botella…)</label>
            <NumberInput value={compartido} onChange={setCompartido} prefix="$" min="0" placeholder="0" />
          </div>
          {consumo && (
            <ResultBox label="Total con propina" value={formatMXN(consumo.conPropina)}>
              <Rows>
                {consumo.filas.map((f) => (
                  <Row key={f.id} label={`${f.nombre || 'Sin nombre'} (${formatMXN(f.propio)}${consumo.porPersonaComun ? ` + ${formatMXN(consumo.porPersonaComun)} compartido` : ''})`} value={formatMXN(f.total)} bold />
                ))}
                {redondear && <Row label="Sobra con el redondeo" value={formatMXN(consumo.cobrado - consumo.conPropina)} />}
              </Rows>
            </ResultBox>
          )}
        </>
      )}
    </div>
  )
}
