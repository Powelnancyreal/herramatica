'use client'

import { useState } from 'react'

export const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
export const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'
export const buttonClass =
  'w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50'
export const secondaryButtonClass =
  'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm'

export function formatMXN(n) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 }).format(n)
}

export function formatNumber(n, decimals = 2) {
  return new Intl.NumberFormat('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: decimals }).format(n)
}

// Con `id`, la etiqueta queda asociada al campo (pásale el mismo id al input).
export function Field({ label, hint, id, children }) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  )
}

export function NumberInput({ value, onChange, prefix, suffix, ...props }) {
  return (
    <div className="relative">
      {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{prefix}</span>}
      <input
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} ${prefix ? 'pl-7' : ''} ${suffix ? 'pr-12' : ''}`}
        {...props}
      />
      {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{suffix}</span>}
    </div>
  )
}

export function ErrorText({ children }) {
  if (!children) return null
  return <p className="text-sm text-red-600">{children}</p>
}

export function ResultBox({ label, value, children }) {
  return (
    <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 space-y-4">
      {label && (
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
          <p className="text-4xl font-bold text-blue-700 leading-none break-words">{value}</p>
        </div>
      )}
      {children}
    </div>
  )
}

export function Rows({ children }) {
  return <div className="bg-white rounded-lg border border-blue-100 divide-y divide-gray-100 text-sm">{children}</div>
}

export function Row({ label, value, bold, highlight }) {
  return (
    <div className={`flex items-center justify-between gap-4 px-4 py-2.5 ${highlight ? 'bg-blue-50' : ''}`}>
      <span className={`text-gray-600 ${bold ? 'font-semibold text-gray-900' : ''}`}>{label}</span>
      <span className={`flex-shrink-0 text-right ${bold ? 'font-bold text-gray-900' : 'text-gray-700'} ${highlight ? 'text-blue-700' : ''}`}>
        {value}
      </span>
    </div>
  )
}

export function Note({ children }) {
  return (
    <p className="text-xs text-gray-600 bg-white/70 border border-blue-100 rounded-lg px-3 py-2">{children}</p>
  )
}

export function MedicalDisclaimer() {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
      ⚕️ <strong>Aviso médico:</strong> Esta herramienta es solo para fines educativos e informativos. Consulta siempre con
      un profesional de la salud antes de tomar decisiones médicas.
    </div>
  )
}

export function CopyButton({ text, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }
  return (
    <button type="button" onClick={copy} disabled={!text} className={secondaryButtonClass}>
      {copied ? '¡Copiado!' : label}
    </button>
  )
}

export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
            value === t.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
