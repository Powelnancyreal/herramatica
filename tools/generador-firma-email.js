'use client'

import { useMemo, useState } from 'react'
import { CopyButton, inputClass, secondaryButtonClass } from '@/components/calc-ui'

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const url = (s) => (/^https?:\/\//i.test(s) ? s : `https://${s}`)

// HTML con tablas y estilos en línea: es lo que mejor respetan Gmail, Outlook y Apple Mail.
function construirHTML(d) {
  const c = /^#[0-9a-f]{6}$/i.test(d.color) ? d.color : '#2563EB'
  const linea = (texto) => (texto ? `<div style="font-size:13px;color:#4b5563;line-height:1.5">${texto}</div>` : '')
  const redes = [
    ['LinkedIn', d.linkedin],
    ['Instagram', d.instagram],
    ['X', d.x],
  ]
    .filter(([, v]) => v)
    .map(([n, v]) => `<a href="${esc(url(v))}" style="color:${c};text-decoration:none;font-size:12px;margin-right:10px">${n}</a>`)
    .join('')
  const foto = d.foto
    ? `<td style="padding-right:14px;vertical-align:top"><img src="${esc(url(d.foto))}" width="72" height="72" alt="${esc(d.nombre)}" style="border-radius:50%;display:block"></td>`
    : ''
  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif">
<tr>${foto}<td style="vertical-align:top;border-left:3px solid ${c};padding-left:12px">
<div style="font-size:16px;font-weight:bold;color:#111827">${esc(d.nombre)}</div>
${linea([d.puesto, d.empresa].filter(Boolean).map(esc).join(' · '))}
${linea(d.telefono ? `📞 <a href="tel:${esc(d.telefono.replace(/[^\d+]/g, ''))}" style="color:#4b5563;text-decoration:none">${esc(d.telefono)}</a>` : '')}
${linea(d.email ? `✉️ <a href="mailto:${esc(d.email)}" style="color:#4b5563;text-decoration:none">${esc(d.email)}</a>` : '')}
${linea(d.web ? `🌐 <a href="${esc(url(d.web))}" style="color:${c};text-decoration:none">${esc(d.web.replace(/^https?:\/\//, ''))}</a>` : '')}
${redes ? `<div style="margin-top:6px">${redes}</div>` : ''}
</td></tr></table>`
    .split('\n')
    .filter((l) => l.trim())
    .join('\n')
}

const CAMPOS = [
  ['nombre', 'Nombre completo', 'Laura Méndez'],
  ['puesto', 'Puesto', 'Directora comercial'],
  ['empresa', 'Empresa', 'Grupo Horizonte'],
  ['telefono', 'Teléfono', '+52 55 1234 5678'],
  ['email', 'Correo', 'laura@empresa.com'],
  ['web', 'Sitio web', 'www.empresa.com'],
  ['linkedin', 'LinkedIn (URL)', 'linkedin.com/in/usuario'],
  ['instagram', 'Instagram (URL)', 'instagram.com/usuario'],
  ['x', 'X / Twitter (URL)', 'x.com/usuario'],
  ['foto', 'URL de tu foto o logo (opcional)', 'https://…/foto.jpg'],
]

export default function GeneradorFirmaEmail() {
  const [d, setD] = useState({ nombre: '', puesto: '', empresa: '', telefono: '', email: '', web: '', linkedin: '', instagram: '', x: '', foto: '', color: '#2563EB' })
  const [copiada, setCopiada] = useState(false)
  const html = useMemo(() => construirHTML({ ...d, nombre: d.nombre || 'Tu nombre' }), [d])

  async function copiarFormato() {
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob([html], { type: 'text/html' }), 'text/plain': new Blob([html], { type: 'text/plain' }) })])
      setCopiada(true)
      setTimeout(() => setCopiada(false), 1500)
    } catch {
      setCopiada(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CAMPOS.map(([k, label, ph]) => (
          <div key={k}>
            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
            <input value={d[k]} onChange={(e) => setD((x) => ({ ...x, [k]: e.target.value }))} className={inputClass} placeholder={ph} />
          </div>
        ))}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Color de acento</label>
          <input type="color" value={d.color} onChange={(e) => setD((x) => ({ ...x, color: e.target.value }))} className="h-11 w-full rounded border border-gray-300 cursor-pointer" />
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 p-5 bg-white">
        <p className="text-xs text-gray-400 mb-3">Vista previa</p>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={copiarFormato} className={secondaryButtonClass}>{copiada ? '¡Firma copiada!' : 'Copiar firma (para pegar en Gmail/Outlook)'}</button>
        <CopyButton text={html} label="Copiar código HTML" />
      </div>
      <p className="text-xs text-gray-500">
        En Gmail: Configuración → Ver todos los ajustes → Firma → pega con Ctrl+V. En Outlook: Archivo → Opciones → Correo → Firmas.
        La foto debe estar publicada en internet (una URL), porque los correos no admiten imágenes locales en la firma.
      </p>
    </div>
  )
}
