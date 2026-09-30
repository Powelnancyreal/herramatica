'use client'

import { useMemo, useState } from 'react'
import { formatMXN, formatNumber, inputClass, NumberInput, secondaryButtonClass } from '@/components/calc-ui'

const UNIDADES = {
  g: { tipo: 'peso', factor: 0.001, label: 'g' },
  kg: { tipo: 'peso', factor: 1, label: 'kg' },
  oz: { tipo: 'peso', factor: 0.028349523125, label: 'oz' },
  lb: { tipo: 'peso', factor: 0.45359237, label: 'lb' },
  ml: { tipo: 'volumen', factor: 0.001, label: 'ml' },
  l: { tipo: 'volumen', factor: 1, label: 'L' },
  pz: { tipo: 'piezas', factor: 1, label: 'pzas' },
}
const REFERENCIA = { peso: 'kg', volumen: 'litro', piezas: 'pieza' }

const fila = (nombre, precio, cantidad, unidad, paquetes = '1') => ({ id: Math.random().toString(36).slice(2), nombre, precio, cantidad, unidad, paquetes })

export default function ComparadorPrecios() {
  const [productos, setProductos] = useState([fila('Presentación chica', '', '', 'g'), fila('Presentación grande', '', '', 'g')])
  const cambiar = (id, campo, valor) => setProductos((p) => p.map((x) => (x.id === id ? { ...x, [campo]: valor } : x)))

  const calculados = useMemo(() => {
    const lista = productos.map((p) => {
      const precio = parseFloat(p.precio)
      const cant = parseFloat(p.cantidad) * (parseFloat(p.paquetes) || 1)
      const u = UNIDADES[p.unidad]
      if (!(precio > 0 && cant > 0)) return { ...p, unitario: null, tipo: u.tipo }
      return { ...p, unitario: precio / (cant * u.factor), tipo: u.tipo }
    })
    const tipos = new Set(lista.filter((p) => p.unitario !== null).map((p) => p.tipo))
    const validos = lista.filter((p) => p.unitario !== null)
    const mejor = tipos.size === 1 && validos.length ? Math.min(...validos.map((p) => p.unitario)) : null
    return { lista, mejor, mezcla: tipos.size > 1 }
  }, [productos])

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        {calculados.lista.map((p) => {
          const esMejor = calculados.mejor !== null && p.unitario !== null && Math.abs(p.unitario - calculados.mejor) < 1e-9
          const extra = calculados.mejor && p.unitario ? (p.unitario / calculados.mejor - 1) * 100 : 0
          return (
            <div key={p.id} className={`rounded-lg border-2 p-3 space-y-2 ${esMejor ? 'border-green-400 bg-green-50' : 'border-gray-200'}`}>
              <div className="flex gap-2">
                <input value={p.nombre} onChange={(e) => cambiar(p.id, 'nombre', e.target.value)} className={inputClass} placeholder="Producto o marca" />
                <button type="button" onClick={() => setProductos((x) => x.filter((y) => y.id !== p.id))} className="text-red-600 px-2" aria-label="Quitar producto">✕</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <NumberInput value={p.precio} onChange={(v) => cambiar(p.id, 'precio', v)} prefix="$" min="0" placeholder="Precio" />
                <NumberInput value={p.cantidad} onChange={(v) => cambiar(p.id, 'cantidad', v)} min="0" placeholder="Contenido" />
                <select value={p.unidad} onChange={(e) => cambiar(p.id, 'unidad', e.target.value)} className={inputClass}>
                  {Object.entries(UNIDADES).map(([k, u]) => (
                    <option key={k} value={k}>{u.label}</option>
                  ))}
                </select>
                <NumberInput value={p.paquetes} onChange={(v) => cambiar(p.id, 'paquetes', v)} min="1" step="1" suffix="unid." />
              </div>
              {p.unitario !== null && (
                <p className="text-sm">
                  <strong>{formatMXN(p.unitario)}</strong> por {REFERENCIA[p.tipo]}
                  {esMejor ? <span className="ml-2 text-green-700 font-semibold">✓ Conviene más</span> : extra > 0.05 && <span className="ml-2 text-red-600">{formatNumber(extra, 1)}% más caro</span>}
                </p>
              )}
            </div>
          )
        })}
        <button type="button" onClick={() => setProductos((p) => [...p, fila('', '', '', p[p.length - 1]?.unidad || 'g')])} className={secondaryButtonClass}>+ Añadir producto</button>
      </div>
      {calculados.mezcla && (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          Estás comparando unidades de distinto tipo (peso, volumen o piezas). Usa el mismo tipo para saber cuál conviene.
        </p>
      )}
      <p className="text-xs text-gray-500">
        En «unid.» indica cuántos paquetes incluye la oferta (por ejemplo, 3 latas de 400 g). El precio por kilo, litro o pieza
        se calcula al instante.
      </p>
    </div>
  )
}
