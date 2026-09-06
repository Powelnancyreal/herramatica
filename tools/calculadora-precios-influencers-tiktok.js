'use client'

import { useMemo, useState } from 'react'

const TIPOS_CONTENIDO = [
  { id: 'mencion', label: 'Mención breve dentro de un video', mult: 0.5 },
  { id: 'dedicado', label: 'Video dedicado al producto/marca', mult: 1 },
  { id: 'dedicado_extra', label: 'Video dedicado + repost en Stories/Reels', mult: 1.3 },
  { id: 'paquete3', label: 'Paquete de 3 videos', mult: 2.5 },
]

const NIVELES_TARIFA = [
  { id: 'economico', label: 'Económico (marca pequeña / early-stage)', tarifa: 0.3 },
  { id: 'estandar', label: 'Estándar (mercado general)', tarifa: 0.5 },
  { id: 'premium', label: 'Premium (nicho especializado / alta demanda)', tarifa: 0.8 },
]

function formatMoney(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return n.toLocaleString('es', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function CalculadoraPreciosInfluencersTiktok() {
  const [seguidores, setSeguidores] = useState('')
  const [engagement, setEngagement] = useState('5')
  const [tipoContenido, setTipoContenido] = useState('dedicado')
  const [nivelTarifa, setNivelTarifa] = useState('estandar')

  const resultado = useMemo(() => {
    const s = parseFloat(seguidores)
    const er = parseFloat(engagement)
    if (isNaN(s) || s <= 0 || isNaN(er) || er <= 0) return null
    const mult = TIPOS_CONTENIDO.find((t) => t.id === tipoContenido).mult
    const tarifa = NIVELES_TARIFA.find((n) => n.id === nivelTarifa).tarifa
    const precio = s * (er / 100) * tarifa * mult
    return { precioMin: precio * 0.8, precioMax: precio * 1.3, precio }
  }, [seguidores, engagement, tipoContenido, nivelTarifa])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Seguidores en TikTok</label>
          <input type="number" inputMode="numeric" min="0" value={seguidores} onChange={(e) => setSeguidores(e.target.value)} placeholder="Ej: 50000" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Tasa de engagement (%)</label>
          <input type="number" inputMode="decimal" min="0" step="0.1" value={engagement} onChange={(e) => setEngagement(e.target.value)} placeholder="Ej: 5" className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Tipo de contenido</label>
          <select value={tipoContenido} onChange={(e) => setTipoContenido(e.target.value)} className={inputClass}>
            {TIPOS_CONTENIDO.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Nivel de tarifa</label>
          <select value={nivelTarifa} onChange={(e) => setNivelTarifa(e.target.value)} className={inputClass}>
            {NIVELES_TARIFA.map((n) => (
              <option key={n.id} value={n.id}>
                {n.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Rango de precio estimado</p>
        <p className="text-3xl font-bold text-blue-700">
          {resultado ? `$${formatMoney(resultado.precioMin)} – $${formatMoney(resultado.precioMax)}` : '—'}
        </p>
        {resultado && <p className="text-xs text-gray-500 mt-2">Estimación central: ${formatMoney(resultado.precio)} USD</p>}
      </div>

      <p className="text-xs text-gray-500">
        ⚠️ Este es un cálculo orientativo basado en rangos de mercado citados habitualmente en el sector (seguidores,
        engagement y tipo de contenido), no un precio oficial ni garantizado. Las tarifas reales varían mucho según
        el nicho, la región, el histórico de resultados del creador, los derechos de uso del contenido y la
        negociación con cada marca. Úsalo como punto de partida para una negociación, no como precio final.
      </p>
    </div>
  )
}
