'use client'

import { useEffect, useRef, useState } from 'react'

const RANGOS = {
  facil: { sumaResta: [1, 20], multiplicacion: [1, 5], division: [1, 5], divisionResultado: [1, 10] },
  medio: { sumaResta: [1, 100], multiplicacion: [2, 10], division: [2, 10], divisionResultado: [1, 12] },
  dificil: { sumaResta: [10, 500], multiplicacion: [2, 12], division: [2, 12], divisionResultado: [2, 20] },
}

const OPERACIONES = [
  { id: 'suma', label: 'Suma', simbolo: '+' },
  { id: 'resta', label: 'Resta', simbolo: '−' },
  { id: 'multiplicacion', label: 'Multiplicación', simbolo: '×' },
  { id: 'division', label: 'División', simbolo: '÷' },
]

const DIFICULTADES = [
  { id: 'facil', label: 'Fácil' },
  { id: 'medio', label: 'Medio' },
  { id: 'dificil', label: 'Difícil' },
]

const DURACIONES = [30, 60, 120]

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generarProblema(operaciones, dificultad) {
  const op = operaciones[randInt(0, operaciones.length - 1)]
  const r = RANGOS[dificultad]
  let a, b, respuesta, texto

  if (op === 'suma') {
    ;[a, b] = [randInt(...r.sumaResta), randInt(...r.sumaResta)]
    respuesta = a + b
    texto = `${a} + ${b}`
  } else if (op === 'resta') {
    ;[a, b] = [randInt(...r.sumaResta), randInt(...r.sumaResta)]
    if (b > a) [a, b] = [b, a]
    respuesta = a - b
    texto = `${a} − ${b}`
  } else if (op === 'multiplicacion') {
    ;[a, b] = [randInt(...r.multiplicacion), randInt(...r.multiplicacion)]
    respuesta = a * b
    texto = `${a} × ${b}`
  } else {
    b = randInt(...r.division)
    respuesta = randInt(...r.divisionResultado)
    a = b * respuesta
    texto = `${a} ÷ ${b}`
  }
  return { texto, respuesta, op }
}

const RECORD_KEY = 'herramatica-calculo-mental-mejor-racha'

function leerRecord() {
  try {
    return parseInt(localStorage.getItem(RECORD_KEY) || '0', 10) || 0
  } catch {
    return 0
  }
}
function guardarRecord(valor) {
  try {
    localStorage.setItem(RECORD_KEY, String(valor))
  } catch {
    // localStorage no disponible (modo privado, etc.) — se ignora silenciosamente
  }
}

export default function CalculoMental() {
  const [fase, setFase] = useState('config')
  const [operaciones, setOperaciones] = useState(['suma', 'resta'])
  const [dificultad, setDificultad] = useState('medio')
  const [modo, setModo] = useState('libre')
  const [duracion, setDuracion] = useState(60)

  const [problema, setProblema] = useState(null)
  const [respuesta, setRespuesta] = useState('')
  const [feedback, setFeedback] = useState(null) // 'correcto' | 'incorrecto' | null
  const [aciertos, setAciertos] = useState(0)
  const [fallos, setFallos] = useState(0)
  const [racha, setRacha] = useState(0)
  const [mejorRacha, setMejorRacha] = useState(0)
  const [tiempoRestante, setTiempoRestante] = useState(0)
  const [record, setRecord] = useState(0)
  const [nuevoRecord, setNuevoRecord] = useState(false)

  const inputRef = useRef(null)
  const feedbackTimeoutRef = useRef(null)

  useEffect(() => {
    setRecord(leerRecord())
  }, [])

  useEffect(() => {
    if (fase !== 'juego' || modo !== 'contrarreloj') return
    if (tiempoRestante <= 0) {
      terminarSesion()
      return
    }
    const t = setTimeout(() => setTiempoRestante((s) => s - 1), 1000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fase, modo, tiempoRestante])

  function toggleOperacion(id) {
    setOperaciones((prev) => (prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]))
  }

  function iniciarJuego() {
    if (operaciones.length === 0) return
    setAciertos(0)
    setFallos(0)
    setRacha(0)
    setMejorRacha(0)
    setNuevoRecord(false)
    setTiempoRestante(duracion)
    setProblema(generarProblema(operaciones, dificultad))
    setRespuesta('')
    setFeedback(null)
    setFase('juego')
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  function terminarSesion() {
    if (mejorRacha > record) {
      guardarRecord(mejorRacha)
      setRecord(mejorRacha)
      setNuevoRecord(true)
    }
    setFase('resumen')
  }

  function comprobar() {
    if (respuesta === '' || problema === null) return
    const esCorrecto = parseInt(respuesta, 10) === problema.respuesta

    if (esCorrecto) {
      setAciertos((a) => a + 1)
      setRacha((r) => {
        const nueva = r + 1
        setMejorRacha((m) => Math.max(m, nueva))
        return nueva
      })
      setFeedback('correcto')
    } else {
      setFallos((f) => f + 1)
      setRacha(0)
      setFeedback('incorrecto')
    }

    clearTimeout(feedbackTimeoutRef.current)
    feedbackTimeoutRef.current = setTimeout(() => {
      setFeedback(null)
      setRespuesta('')
      setProblema(generarProblema(operaciones, dificultad))
      inputRef.current?.focus()
    }, esCorrecto ? 350 : 900)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') comprobar()
  }

  const total = aciertos + fallos
  const precision = total > 0 ? Math.round((aciertos / total) * 100) : 0

  return (
    <div className="space-y-5">
      {fase === 'config' && (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Operaciones a practicar</label>
            <div className="grid grid-cols-2 gap-2">
              {OPERACIONES.map((op) => (
                <button
                  key={op.id}
                  onClick={() => toggleOperacion(op.id)}
                  className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    operaciones.includes(op.id)
                      ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-400'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {op.simbolo} {op.label}
                </button>
              ))}
            </div>
            {operaciones.length === 0 && <p className="text-xs text-red-600 mt-1">Elige al menos una operación.</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de dificultad</label>
            <div className="grid grid-cols-3 gap-2">
              {DIFICULTADES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDificultad(d.id)}
                  className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    dificultad === d.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Modo de juego</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setModo('libre')}
                className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  modo === 'libre' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Sin límite de tiempo
              </button>
              <button
                onClick={() => setModo('contrarreloj')}
                className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  modo === 'contrarreloj' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Contrarreloj
              </button>
            </div>
            {modo === 'contrarreloj' && (
              <div className="flex gap-2 mt-2">
                {DURACIONES.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuracion(d)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      duracion === d ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-400' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {d}s
                  </button>
                ))}
              </div>
            )}
          </div>

          {record > 0 && (
            <p className="text-xs text-gray-500 text-center">🏆 Tu mejor racha de aciertos consecutivos: {record}</p>
          )}

          <button
            onClick={iniciarJuego}
            disabled={operaciones.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Comenzar
          </button>
        </div>
      )}

      {fase === 'juego' && problema && (
        <div className="space-y-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              ✅ {aciertos} &nbsp; ❌ {fallos} &nbsp; 🔥 {racha}
            </span>
            {modo === 'contrarreloj' ? (
              <span className={`font-bold ${tiempoRestante <= 10 ? 'text-red-600' : 'text-gray-700'}`}>⏱ {tiempoRestante}s</span>
            ) : (
              <button onClick={terminarSesion} className="text-gray-400 hover:text-red-500 font-medium text-xs">
                Terminar
              </button>
            )}
          </div>

          <div
            className={`rounded-2xl p-10 text-center transition-colors ${
              feedback === 'correcto' ? 'bg-green-100' : feedback === 'incorrecto' ? 'bg-red-100' : 'bg-gray-50'
            }`}
          >
            <p className="text-4xl sm:text-5xl font-bold text-gray-900 mb-1">{problema.texto} = ?</p>
            {feedback === 'incorrecto' && (
              <p className="text-red-600 font-semibold mt-2">Respuesta correcta: {problema.respuesta}</p>
            )}
          </div>

          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="number"
              inputMode="numeric"
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={feedback !== null}
              placeholder="Tu respuesta"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-xl text-center text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-100"
            />
            <button
              onClick={comprobar}
              disabled={feedback !== null || respuesta === ''}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-6 rounded-lg transition-colors"
            >
              Comprobar
            </button>
          </div>
        </div>
      )}

      {fase === 'resumen' && (
        <div className="space-y-5 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
            <p className="text-blue-100 text-sm mb-1">Precisión</p>
            <p className="text-5xl font-bold">{precision}%</p>
            <p className="text-blue-200 mt-1">
              {aciertos} de {total} correctas
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-green-50 border border-green-100 rounded-xl p-3">
              <p className="text-2xl font-bold text-green-600">{aciertos}</p>
              <p className="text-xs text-gray-600 mt-1">Aciertos</p>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-xl p-3">
              <p className="text-2xl font-bold text-red-500">{fallos}</p>
              <p className="text-xs text-gray-600 mt-1">Fallos</p>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
              <p className="text-2xl font-bold text-amber-600">{mejorRacha}</p>
              <p className="text-xs text-gray-600 mt-1">Mejor racha</p>
            </div>
          </div>

          {nuevoRecord && (
            <p className="text-sm font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              🏆 ¡Nuevo récord personal de racha! ({mejorRacha} aciertos seguidos)
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={iniciarJuego}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Jugar de nuevo
            </button>
            <button
              onClick={() => setFase('config')}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
            >
              Cambiar ajustes
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
