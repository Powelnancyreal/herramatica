'use client'

import { useMemo, useState } from 'react'
import { analizarSMS } from '@/lib/calc/dev'
import { inputClass } from '@/components/calc-ui'

const LIMITES = [
  { id: 'title', label: 'Título SEO (Google)', max: 60 },
  { id: 'meta', label: 'Meta descripción (Google)', max: 160 },
  { id: 'x', label: 'Publicación en X (Twitter)', max: 280 },
  { id: 'ig-bio', label: 'Biografía de Instagram', max: 150 },
  { id: 'ig', label: 'Pie de foto de Instagram', max: 2200 },
  { id: 'yt-title', label: 'Título de YouTube', max: 100 },
  { id: 'linkedin', label: 'Publicación de LinkedIn', max: 3000 },
]

function contarGrafemas(texto) {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    let n = 0
    for (const _ of new Intl.Segmenter('es', { granularity: 'grapheme' }).segment(texto)) n++
    return n
  }
  return Array.from(texto).length
}

export default function ContadorCaracteres() {
  const [texto, setTexto] = useState('')

  const s = useMemo(() => {
    const caracteres = contarGrafemas(texto)
    return {
      caracteres,
      sinEspacios: contarGrafemas(texto.replace(/\s/g, '')),
      palabras: texto.trim() ? texto.trim().split(/\s+/).length : 0,
      lineas: texto ? texto.split('\n').length : 0,
      parrafos: texto.split(/\n\s*\n/).filter((p) => p.trim()).length,
      bytes: new TextEncoder().encode(texto).length,
      sms: analizarSMS(texto),
    }
  }, [texto])

  return (
    <div className="space-y-4">
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        rows={8}
        placeholder="Escribe o pega tu texto aquí…"
        className={`${inputClass} text-base`}
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          ['Caracteres', s.caracteres],
          ['Sin espacios', s.sinEspacios],
          ['Palabras', s.palabras],
          ['Líneas', s.lineas],
          ['Párrafos', s.parrafos],
          ['Bytes (UTF-8)', s.bytes],
        ].map(([l, v]) => (
          <div key={l} className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-center">
            <p className="text-2xl font-bold text-blue-700">{v.toLocaleString('es-MX')}</p>
            <p className="text-xs text-gray-600">{l}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Límites de caracteres</h3>
        <div className="space-y-2">
          {LIMITES.map((l) => {
            const pct = Math.min((s.caracteres / l.max) * 100, 100)
            const excede = s.caracteres > l.max
            return (
              <div key={l.id}>
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="text-gray-700">{l.label}</span>
                  <span className={excede ? 'text-red-600 font-semibold' : 'text-gray-500'}>
                    {s.caracteres.toLocaleString('es-MX')} / {l.max.toLocaleString('es-MX')}
                    {excede && ` (sobran ${(s.caracteres - l.max).toLocaleString('es-MX')})`}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div className={`h-full ${excede ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 p-4 text-sm space-y-1">
        <p className="font-semibold text-gray-900">SMS</p>
        <p className="text-gray-700">
          Codificación: <strong>{s.sms.codificacion}</strong> · {s.sms.unidades} de {s.sms.limite} caracteres por mensaje ·{' '}
          <strong>{s.sms.segmentos}</strong> SMS
        </p>
        {s.sms.noGSM.length > 0 && (
          <p className="text-xs text-amber-700">
            Estos caracteres obligan a usar Unicode y reducen el límite a 70 por SMS: {s.sms.noGSM.slice(0, 15).join(' ')}
          </p>
        )}
      </div>
    </div>
  )
}
