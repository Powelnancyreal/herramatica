'use client'

import { useEffect, useState } from 'react'

// Valores del día de mindicador.cl (fuente: Banco Central de Chile y SII).
export function useIndicadoresChile() {
  const [datos, setDatos] = useState({ estado: 'cargando', uf: null, utm: null, dolar: null, fecha: null })
  useEffect(() => {
    let vigente = true
    fetch('https://mindicador.cl/api')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        if (!vigente) return
        setDatos({ estado: 'listo', uf: d.uf?.valor ?? null, utm: d.utm?.valor ?? null, dolar: d.dolar?.valor ?? null, fecha: d.uf?.fecha ?? null })
      })
      .catch(() => vigente && setDatos((x) => ({ ...x, estado: 'error' })))
    return () => {
      vigente = false
    }
  }, [])
  return datos
}

export function AvisoIndicadores({ datos, que = 'la UF y la UTM' }) {
  if (datos.estado === 'cargando') return <p className="text-sm text-gray-500">Cargando el valor de {que}…</p>
  if (datos.estado === 'error') return <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">No se pudo cargar el valor de {que}. Escríbelo manualmente.</p>
  return null
}
