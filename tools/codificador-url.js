'use client'

import { useMemo, useState } from 'react'
import { CopyButton, inputClass, secondaryButtonClass, Tabs } from '@/components/calc-ui'

const MODOS = [
  { id: 'codificar', label: 'Codificar' },
  { id: 'decodificar', label: 'Decodificar' },
  { id: 'analizar', label: 'Analizar URL' },
]

export default function CodificadorURL() {
  const [modo, setModo] = useState('codificar')
  const [texto, setTexto] = useState('búsqueda=camión rojo & precio<500')
  const [completa, setCompleta] = useState(false)
  const [espaciosMas, setEspaciosMas] = useState(false)

  const r = useMemo(() => {
    try {
      if (modo === 'codificar') {
        let s = completa ? encodeURI(texto) : encodeURIComponent(texto)
        if (espaciosMas) s = s.replace(/%20/g, '+')
        return { salida: s }
      }
      if (modo === 'decodificar') {
        const t = espaciosMas ? texto.replace(/\+/g, ' ') : texto
        return { salida: decodeURIComponent(t) }
      }
      const u = new URL(texto.trim())
      return {
        url: u,
        params: [...u.searchParams.entries()],
      }
    } catch (e) {
      return {
        error:
          modo === 'analizar'
            ? 'No es una URL completa. Debe empezar con http:// o https://'
            : 'El texto contiene una secuencia % inválida (por ejemplo, «%E0%A4%A» incompleta o «%ZZ»).',
      }
    }
  }, [texto, modo, completa, espaciosMas])

  function cambiar(m) {
    if (m === 'decodificar' && modo === 'codificar' && r.salida) setTexto(r.salida)
    else if (m === 'codificar' && modo === 'decodificar' && r.salida) setTexto(r.salida)
    else if (m === 'analizar' && !/^https?:\/\//.test(texto)) setTexto('https://herramatica.com/buscar?q=caf%C3%A9%20org%C3%A1nico&pagina=2&orden=precio#resultados')
    setModo(m)
  }

  return (
    <div className="space-y-4">
      <Tabs tabs={MODOS} value={modo} onChange={cambiar} />
      <textarea value={texto} onChange={(e) => setTexto(e.target.value)} rows={4} className={`${inputClass} font-mono text-sm`} spellCheck={false} />
      {modo !== 'analizar' && (
        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          {modo === 'codificar' && (
            <label className="flex items-center gap-1.5">
              <input type="checkbox" checked={completa} onChange={(e) => setCompleta(e.target.checked)} /> Es una URL completa (conservar : / ? & =)
            </label>
          )}
          <label className="flex items-center gap-1.5">
            <input type="checkbox" checked={espaciosMas} onChange={(e) => setEspaciosMas(e.target.checked)} /> Espacios como + (formularios)
          </label>
        </div>
      )}

      {r.error && <p className="text-sm text-red-600">{r.error}</p>}
      {r.salida !== undefined && (
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4 space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-gray-900">Resultado</p>
            <div className="flex gap-2">
              <CopyButton text={r.salida} />
              <button type="button" className={secondaryButtonClass} onClick={() => setTexto(r.salida)}>Usar como entrada</button>
            </div>
          </div>
          <p className="font-mono text-sm break-all bg-white rounded-lg p-3 border border-blue-100">{r.salida || '—'}</p>
        </div>
      )}
      {r.url && (
        <div className="rounded-xl border border-gray-200 divide-y divide-gray-100 text-sm">
          {[
            ['Protocolo', r.url.protocol],
            ['Dominio', r.url.hostname],
            ['Puerto', r.url.port || '(predeterminado)'],
            ['Ruta', decodeURIComponent(r.url.pathname)],
            ['Fragmento', r.url.hash ? decodeURIComponent(r.url.hash) : '—'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3 px-4 py-2">
              <span className="text-gray-600">{k}</span>
              <span className="font-mono text-right break-all">{v}</span>
            </div>
          ))}
          <div className="px-4 py-2">
            <p className="text-gray-600 mb-1">Parámetros ({r.params.length})</p>
            {r.params.length === 0 ? (
              <p className="text-gray-400">La URL no tiene parámetros.</p>
            ) : (
              <table className="w-full text-xs font-mono">
                <tbody>
                  {r.params.map(([k, v], i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="py-1 pr-3 text-blue-700">{k}</td>
                      <td className="py-1 break-all">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
