'use client'

import { useEffect, useState } from 'react'
import { CopyButton, inputClass, Tabs } from '@/components/calc-ui'

const EJEMPLO = `# Receta de guacamole

Un clásico de la **cocina mexicana** listo en *10 minutos*.

## Ingredientes

- 3 aguacates maduros
- 1/2 cebolla picada
- Jugo de 1 limón

## Pasos

1. Machaca los aguacates.
2. Mezcla con la cebolla y el limón.
3. Sirve con totopos.

> Consejo: deja el hueso dentro para que no se oxide.

| Porción | Calorías |
|---------|----------|
| 100 g   | 160      |

Más recetas en [Herramatica](https://herramatica.com).`

const VISTAS = [
  { id: 'vista', label: 'Vista previa' },
  { id: 'html', label: 'Código HTML' },
]

const ESTILO_VISTA = `<style>body{font-family:system-ui,sans-serif;line-height:1.6;color:#111827;padding:8px 16px;margin:0}table{border-collapse:collapse}td,th{border:1px solid #d1d5db;padding:4px 8px}blockquote{border-left:4px solid #d1d5db;margin:0;padding-left:12px;color:#4b5563}pre{background:#f3f4f6;padding:8px;overflow:auto}img{max-width:100%}</style>`

export default function MarkdownAHtml() {
  const [md, setMd] = useState(EJEMPLO)
  const [html, setHtml] = useState('')
  const [vista, setVista] = useState('vista')
  const [gfm, setGfm] = useState(true)
  const [saltos, setSaltos] = useState(false)

  useEffect(() => {
    let vigente = true
    import('marked').then(({ marked }) => {
      const r = marked.parse(md, { gfm, breaks: saltos, async: false })
      if (vigente) setHtml(typeof r === 'string' ? r : '')
    })
    return () => {
      vigente = false
    }
  }, [md, gfm, saltos])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 text-sm text-gray-700">
        <label className="flex items-center gap-1.5"><input type="checkbox" checked={gfm} onChange={(e) => setGfm(e.target.checked)} /> Markdown de GitHub (tablas, tachado)</label>
        <label className="flex items-center gap-1.5"><input type="checkbox" checked={saltos} onChange={(e) => setSaltos(e.target.checked)} /> Un salto de línea = &lt;br&gt;</label>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Markdown</label>
          <textarea value={md} onChange={(e) => setMd(e.target.value)} rows={18} className={`${inputClass} font-mono text-xs`} spellCheck={false} />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Tabs tabs={VISTAS} value={vista} onChange={setVista} />
            <CopyButton text={html} label="Copiar HTML" />
          </div>
          {vista === 'vista' ? (
            // El iframe aislado (sandbox sin scripts) evita que el HTML pegado ejecute código en esta página.
            <iframe title="Vista previa del HTML" sandbox="" srcDoc={ESTILO_VISTA + html} className="w-full h-[26rem] rounded-lg border border-gray-200 bg-white" />
          ) : (
            <textarea readOnly value={html} rows={18} className={`${inputClass} font-mono text-xs bg-gray-50`} aria-label="HTML generado" />
          )}
        </div>
      </div>
    </div>
  )
}
