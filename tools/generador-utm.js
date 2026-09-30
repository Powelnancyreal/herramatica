'use client'

import { useMemo, useState } from 'react'
import { CopyButton, inputClass } from '@/components/calc-ui'

const CAMPOS = [
  { k: 'utm_source', label: 'Fuente (utm_source) *', ph: 'facebook, google, newsletter', sugerencias: ['facebook', 'instagram', 'google', 'tiktok', 'newsletter', 'whatsapp', 'linkedin'] },
  { k: 'utm_medium', label: 'Medio (utm_medium) *', ph: 'cpc, social, email', sugerencias: ['cpc', 'social', 'email', 'organic', 'referral', 'display', 'sms'] },
  { k: 'utm_campaign', label: 'Campaña (utm_campaign) *', ph: 'buen_fin_2026', sugerencias: [] },
  { k: 'utm_term', label: 'Término (utm_term)', ph: 'zapatos_running', sugerencias: [] },
  { k: 'utm_content', label: 'Contenido (utm_content)', ph: 'banner_azul', sugerencias: [] },
]

const normalizar = (s) =>
  s
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '_')

export default function GeneradorUTM() {
  const [base, setBase] = useState('')
  const [valores, setValores] = useState({})
  const [limpiar, setLimpiar] = useState(true)

  const r = useMemo(() => {
    if (!base.trim()) return null
    let u
    try {
      u = new URL(/^https?:\/\//i.test(base.trim()) ? base.trim() : `https://${base.trim()}`)
    } catch {
      return { error: 'La URL no es válida.' }
    }
    for (const c of CAMPOS) {
      const v = valores[c.k] || ''
      const final = limpiar ? normalizar(v) : v.trim()
      if (final) u.searchParams.set(c.k, final)
      else u.searchParams.delete(c.k)
    }
    const faltan = CAMPOS.slice(0, 3).filter((c) => !valores[c.k]?.trim()).map((c) => c.k)
    return { url: u.toString(), faltan }
  }, [base, valores, limpiar])

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">URL de destino *</label>
        <input value={base} onChange={(e) => setBase(e.target.value)} className={inputClass} placeholder="https://tutienda.com/ofertas" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CAMPOS.map((c) => (
          <div key={c.k}>
            <label className="block text-xs font-medium text-gray-600 mb-1">{c.label}</label>
            <input value={valores[c.k] || ''} onChange={(e) => setValores((v) => ({ ...v, [c.k]: e.target.value }))} className={inputClass} placeholder={c.ph} list={c.sugerencias.length ? `lista-${c.k}` : undefined} />
            {c.sugerencias.length > 0 && (
              <datalist id={`lista-${c.k}`}>
                {c.sugerencias.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            )}
          </div>
        ))}
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={limpiar} onChange={(e) => setLimpiar(e.target.checked)} /> Convertir a minúsculas, quitar acentos y cambiar espacios por guion bajo (recomendado)
      </label>

      {r?.error && <p className="text-sm text-red-600">{r.error}</p>}
      {r?.url && (
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4 space-y-2">
          <p className="font-mono text-sm break-all text-gray-900">{r.url}</p>
          <CopyButton text={r.url} label="Copiar URL con UTM" />
          {r.faltan.length > 0 && <p className="text-xs text-amber-700">Faltan parámetros recomendados: {r.faltan.join(', ')}. Sin ellos, Google Analytics agrupará mal el tráfico.</p>}
        </div>
      )}
    </div>
  )
}
