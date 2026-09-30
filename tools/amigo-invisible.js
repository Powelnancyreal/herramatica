'use client'

import { useEffect, useState } from 'react'
import { barajar, codificarBase64, decodificarBase64 } from '@/lib/calc/dev'
import { buttonClass, CopyButton, ErrorText, inputClass, secondaryButtonClass } from '@/components/calc-ui'

// Busca una asignación en la que nadie se regale a sí mismo ni a alguien excluido.
function sortear(personas, exclusiones) {
  const prohibido = (a, b) => a === b || exclusiones.some(([x, y]) => (x === a && y === b) || (x === b && y === a))
  for (let intento = 0; intento < 5000; intento++) {
    const orden = barajar(personas)
    // Un solo ciclo (A→B→C→…→A) garantiza que no se formen parejas que se regalen entre sí.
    const pares = orden.map((p, i) => [p, orden[(i + 1) % orden.length]])
    if (pares.every(([a, b]) => !prohibido(a, b))) return pares
  }
  return null
}

function Revelar({ datos }) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-6 text-center space-y-3">
      <p className="text-lg">🎁 Hola, <strong>{datos.de}</strong></p>
      {visible ? (
        <>
          <p className="text-sm text-gray-600">Tu amigo invisible es…</p>
          <p className="text-4xl font-bold text-red-700">{datos.para}</p>
          {datos.presupuesto && <p className="text-sm text-gray-700">Presupuesto: {datos.presupuesto}</p>}
          {datos.fecha && <p className="text-sm text-gray-700">Intercambio: {datos.fecha}</p>}
          <p className="text-xs text-gray-500">¡No se lo digas a nadie! 🤫</p>
        </>
      ) : (
        <button type="button" onClick={() => setVisible(true)} className={buttonClass}>Ver a quién le regalo</button>
      )}
    </div>
  )
}

export default function AmigoInvisible() {
  const [texto, setTexto] = useState('')
  const [exclusionesTexto, setExclusionesTexto] = useState('')
  const [presupuesto, setPresupuesto] = useState('')
  const [fecha, setFecha] = useState('')
  const [pares, setPares] = useState(null)
  const [mostrarTodo, setMostrarTodo] = useState(false)
  const [error, setError] = useState('')
  const [revelar, setRevelar] = useState(null)
  const [base, setBase] = useState('')

  useEffect(() => {
    setBase(window.location.origin + window.location.pathname)
    const m = window.location.hash.match(/^#ver=(.+)$/)
    if (m) {
      try {
        setRevelar(JSON.parse(decodificarBase64(m[1])))
      } catch {}
    }
  }, [])

  if (revelar) return <Revelar datos={revelar} />

  const personas = [...new Set(texto.split(/[\n,]+/).map((x) => x.trim()).filter(Boolean))]

  function hacer() {
    if (personas.length < 3) return setError('Se necesitan al menos 3 participantes.')
    const exclusiones = exclusionesTexto
      .split('\n')
      // Separadores admitidos: «Ana - Luis», «Ana, Luis» o «Ana y Luis».
      .map((l) => l.split(/\s*[-–,]\s*|\s+y\s+/i).map((x) => x.trim()).filter(Boolean))
      .filter((p) => p.length === 2)
    const r = sortear(personas, exclusiones)
    if (!r) return setError('No hay forma de sortear con esas exclusiones. Quita alguna e inténtalo de nuevo.')
    setError('')
    setPares(r)
    setMostrarTodo(false)
  }

  const enlace = (de, para) => `${base}#ver=${codificarBase64(JSON.stringify({ de, para, presupuesto, fecha }), true)}`

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Participantes ({personas.length})</label>
          <textarea value={texto} onChange={(e) => setTexto(e.target.value)} rows={7} className={inputClass} placeholder={'Ana\nLuis\nSofía\nCarlos'} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Exclusiones (opcional)</label>
          <textarea value={exclusionesTexto} onChange={(e) => setExclusionesTexto(e.target.value)} rows={7} className={inputClass} placeholder={'Una pareja por línea que no debe regalarse:\nAna - Luis'} />
        </div>
        <input value={presupuesto} onChange={(e) => setPresupuesto(e.target.value)} className={inputClass} placeholder="Presupuesto del regalo (ej: $500)" />
        <input value={fecha} onChange={(e) => setFecha(e.target.value)} className={inputClass} placeholder="Fecha y lugar del intercambio (opcional)" />
      </div>
      <ErrorText>{error}</ErrorText>
      <button type="button" onClick={hacer} className={buttonClass}>🎁 Hacer el sorteo</button>

      {pares && (
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            Envía a cada participante su enlace personal por WhatsApp o correo: al abrirlo verá solo a quién le regala. Así ni
            siquiera tú sabes el resultado.
          </p>
          <div className="space-y-2">
            {pares.map(([de, para]) => (
              <div key={de} className="flex flex-wrap justify-between items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
                <span className="font-medium text-gray-900">{de}{mostrarTodo && <span className="text-gray-500 font-normal"> → {para}</span>}</span>
                <div className="flex gap-2">
                  <CopyButton text={enlace(de, para)} label="Copiar enlace" />
                  <a href={`https://wa.me/?text=${encodeURIComponent(`🎁 Amigo invisible: abre tu enlace para ver a quién le regalas ${enlace(de, para)}`)}`} target="_blank" rel="noopener noreferrer" className={secondaryButtonClass}>WhatsApp</a>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setMostrarTodo((x) => !x)} className="text-sm text-gray-500 underline">{mostrarTodo ? 'Ocultar resultados' : 'Mostrar todos los resultados (el organizador verá quién regala a quién)'}</button>
            <button type="button" onClick={hacer} className="text-sm text-blue-600 font-medium">Repetir sorteo</button>
          </div>
          <p className="text-xs text-gray-500">El resultado va dentro de cada enlace codificado; no se guarda en ningún servidor. Si repites el sorteo, los enlaces anteriores dejan de ser válidos para el nuevo resultado.</p>
        </div>
      )}
    </div>
  )
}
