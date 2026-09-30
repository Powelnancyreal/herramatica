'use client'

import { useEffect, useMemo, useState } from 'react'
import { formatMXN, formatNumber, inputClass, Note, NumberInput, secondaryButtonClass } from '@/components/calc-ui'

const CLAVE = 'herramatica-presupuesto-mensual'
const TIPOS = {
  necesidad: { label: 'Necesidades', meta: 50, color: 'bg-blue-500' },
  deseo: { label: 'Gustos', meta: 30, color: 'bg-amber-500' },
  ahorro: { label: 'Ahorro y deudas', meta: 20, color: 'bg-green-500' },
}
const INICIALES = [
  ['Renta o hipoteca', 'necesidad'], ['Súper y comida', 'necesidad'], ['Luz, agua y gas', 'necesidad'],
  ['Transporte y gasolina', 'necesidad'], ['Internet y celular', 'necesidad'], ['Salud y medicinas', 'necesidad'],
  ['Restaurantes y salidas', 'deseo'], ['Streaming y suscripciones', 'deseo'], ['Ropa y compras', 'deseo'],
  ['Ahorro de emergencia', 'ahorro'], ['Pago extra a deudas', 'ahorro'],
].map(([nombre, tipo], i) => ({ id: i, nombre, tipo, monto: '' }))

export default function PresupuestoMensual() {
  const [ingreso, setIngreso] = useState('')
  const [gastos, setGastos] = useState(INICIALES)
  const [cargado, setCargado] = useState(false)

  useEffect(() => {
    try {
      const guardado = JSON.parse(localStorage.getItem(CLAVE) || 'null')
      if (guardado?.gastos) {
        setIngreso(guardado.ingreso || '')
        setGastos(guardado.gastos)
      }
    } catch {}
    setCargado(true)
  }, [])

  useEffect(() => {
    if (!cargado) return
    try {
      localStorage.setItem(CLAVE, JSON.stringify({ ingreso, gastos }))
    } catch {}
  }, [ingreso, gastos, cargado])

  const cambiar = (id, campo, valor) => setGastos((g) => g.map((x) => (x.id === id ? { ...x, [campo]: valor } : x)))
  const agregar = () => setGastos((g) => [...g, { id: Date.now(), nombre: '', tipo: 'necesidad', monto: '' }])

  const r = useMemo(() => {
    const ing = parseFloat(ingreso) || 0
    const porTipo = { necesidad: 0, deseo: 0, ahorro: 0 }
    for (const g of gastos) porTipo[g.tipo] += parseFloat(g.monto) || 0
    const total = porTipo.necesidad + porTipo.deseo + porTipo.ahorro
    return { ing, porTipo, total, disponible: ing - total }
  }, [ingreso, gastos])

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Ingreso mensual neto (lo que te depositan)</label>
        <NumberInput value={ingreso} onChange={setIngreso} prefix="$" min="0" placeholder="Ej: 22000" />
      </div>

      <div className="space-y-2">
        {gastos.map((g) => (
          <div key={g.id} className="grid grid-cols-12 gap-2 items-center">
            <input value={g.nombre} onChange={(e) => cambiar(g.id, 'nombre', e.target.value)} className={`${inputClass} col-span-12 sm:col-span-5`} placeholder="Concepto" />
            <select value={g.tipo} onChange={(e) => cambiar(g.id, 'tipo', e.target.value)} className={`${inputClass} col-span-5 sm:col-span-3`}>
              {Object.entries(TIPOS).map(([k, t]) => (
                <option key={k} value={k}>{t.label}</option>
              ))}
            </select>
            <div className="col-span-6 sm:col-span-3">
              <NumberInput value={g.monto} onChange={(v) => cambiar(g.id, 'monto', v)} prefix="$" min="0" placeholder="0" />
            </div>
            <button type="button" onClick={() => setGastos((x) => x.filter((y) => y.id !== g.id))} className="col-span-1 text-red-600" aria-label={`Eliminar ${g.nombre || 'gasto'}`}>
              ✕
            </button>
          </div>
        ))}
        <div className="flex gap-2">
          <button type="button" onClick={agregar} className={secondaryButtonClass}>+ Añadir gasto</button>
          <button type="button" onClick={() => { setGastos(INICIALES); setIngreso('') }} className={secondaryButtonClass}>Reiniciar</button>
        </div>
      </div>

      {r.ing > 0 && (
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 space-y-4">
          <div className="flex flex-wrap justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Gastos planeados</p>
              <p className="text-2xl font-bold text-gray-900">{formatMXN(r.total)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-500 uppercase">{r.disponible >= 0 ? 'Te sobra' : 'Te falta'}</p>
              <p className={`text-2xl font-bold ${r.disponible >= 0 ? 'text-green-700' : 'text-red-700'}`}>{formatMXN(Math.abs(r.disponible))}</p>
            </div>
          </div>
          <div className="flex h-4 rounded overflow-hidden bg-white">
            {Object.entries(TIPOS).map(([k, t]) => (
              <div key={k} className={t.color} style={{ width: `${Math.min(100, (r.porTipo[k] / Math.max(r.ing, r.total)) * 100)}%` }} />
            ))}
          </div>
          <div className="space-y-2 text-sm">
            {Object.entries(TIPOS).map(([k, t]) => {
              const pct = (r.porTipo[k] / r.ing) * 100
              const meta = (r.ing * t.meta) / 100
              const fuera = k === 'ahorro' ? pct < t.meta - 0.5 : pct > t.meta + 0.5
              return (
                <div key={k} className="flex justify-between gap-3 bg-white rounded-lg px-3 py-2">
                  <span className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${t.color}`} /> {t.label}
                  </span>
                  <span className={fuera ? 'text-red-700 font-medium' : 'text-gray-700'}>
                    {formatMXN(r.porTipo[k])} · {formatNumber(pct, 1)}% (meta {t.meta}%: {formatMXN(meta)})
                  </span>
                </div>
              )
            })}
          </div>
          <Note>
            Regla 50/30/20: máximo 50% del ingreso para necesidades, 30% para gustos y al menos 20% para ahorro y pago de
            deudas. Tus datos se guardan solo en este navegador.
          </Note>
        </div>
      )}
    </div>
  )
}
