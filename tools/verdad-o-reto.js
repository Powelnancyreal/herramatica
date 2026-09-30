'use client'

import { useState } from 'react'
import { enteroAleatorio } from '@/lib/calc/dev'
import { inputClass, secondaryButtonClass } from '@/components/calc-ui'

const PREGUNTAS = {
  familiar: {
    verdad: [
      '¿Cuál es el apodo más raro que te han puesto?', '¿Qué comida odiabas de niño y ahora te encanta?', '¿Cuál ha sido tu momento más vergonzoso en la escuela?',
      '¿Qué superpoder te gustaría tener y por qué?', '¿Alguna vez culpaste a otra persona de algo que hiciste tú?', '¿Cuál es tu canción favorita para cantar en la regadera?',
      '¿Qué es lo más raro que has comido?', '¿A qué personaje famoso te gustaría conocer?', '¿Cuál es tu mayor miedo?', '¿Qué harías si fueras invisible por un día?',
      '¿Cuál ha sido el mejor regalo que has recibido?', '¿Qué es lo último que buscaste en internet?', '¿A quién de aquí llamarías si tuvieras un problema?',
      '¿Qué te hace reír siempre, aunque no quieras?', '¿Cuál fue tu primer trabajo o tu primera forma de ganar dinero?',
    ],
    reto: [
      'Imita a un animal durante 30 segundos sin reírte.', 'Canta el coro de una canción que elija el grupo.', 'Habla con acento de otro país hasta tu próximo turno.',
      'Haz 10 sentadillas mientras dices el abecedario.', 'Cuenta un chiste; si nadie se ríe, cuenta otro.', 'Baila sin música durante 20 segundos.',
      'Di un trabalenguas tres veces seguidas sin equivocarte.', 'Haz tu mejor imitación de otra persona del grupo.', 'Mantén una cuchara en la nariz durante 10 segundos.',
      'Dibuja a la persona de tu derecha con los ojos cerrados.', 'Habla solo con preguntas hasta tu próximo turno.', 'Haz una pose de estatua hasta que alguien te haga reír.',
      'Recita los meses del año al revés.', 'Inventa un comercial de 20 segundos para un objeto de la mesa.', 'Camina como modelo de pasarela de un lado a otro.',
    ],
  },
  amigos: {
    verdad: [
      '¿Cuál es el mensaje más vergonzoso que has enviado por error?', '¿Quién fue tu primer amor platónico?', '¿Qué es lo más loco que has hecho por impresionar a alguien?',
      '¿Alguna vez has fingido estar enfermo para no ir a algo? ¿A qué?', '¿Cuál es tu hábito más raro que nadie conoce?', '¿Qué opinión impopular defiendes?',
      '¿Cuál es la mentira más grande que le has dicho a tus papás?', '¿A quién de este grupo le contarías un secreto?', '¿Cuál ha sido tu peor cita?',
      '¿Qué app usas más y cuántas horas al día?', '¿Has stalkeado a un ex en redes? ¿Qué encontraste?', '¿Qué es lo que más te arrepientes de haber comprado?',
      '¿Cuál es tu placer culposo en series o música?', '¿Qué es lo más atrevido que has hecho en una fiesta?', '¿Qué cambiarías de ti si pudieras?',
    ],
    reto: [
      'Deja que el grupo lea tu última conversación de WhatsApp (tú eliges con quién).', 'Publica una historia con la foto que elija el grupo.', 'Llama a alguien y cántale «Las Mañanitas».',
      'Deja que alguien escriba un estado en tu red social.', 'Habla como narrador de fútbol describiendo lo que hace el grupo durante un minuto.', 'Cuenta tu anécdota más vergonzosa con todo detalle.',
      'Envía un mensaje de voz a tu mejor amigo diciendo solo «ya sé lo que hiciste».', 'Haz 15 lagartijas o bebe un vaso de agua de golpe.', 'Deja que el grupo te peine como quiera.',
      'Muestra la última foto de tu galería.', 'Habla con voz de robot hasta tu próximo turno.', 'Declárale tu amor a un objeto de la habitación de forma dramática.',
      'Deja que alguien elija tu foto de perfil por una hora.', 'Haz una reseña de restaurante de lo último que comiste.', 'Escribe un poema de cuatro versos sobre el grupo.',
    ],
  },
  pareja: {
    verdad: [
      '¿Qué fue lo primero que pensaste de mí?', '¿Cuál ha sido nuestra mejor cita?', '¿Qué canción te recuerda a mí?', '¿Qué es lo que más te gusta de nuestra relación?',
      '¿Cuándo te diste cuenta de que te gustaba?', '¿Qué viaje sueñas hacer juntos?', '¿Qué es algo que te da pena decirme?', '¿Cuál es tu recuerdo favorito conmigo?',
      '¿Qué hábito mío te parece tierno?', '¿Qué es lo más romántico que alguien ha hecho por ti?', '¿Qué te gustaría que hiciéramos más seguido?', '¿Cuál es tu idea de un domingo perfecto?',
    ],
    reto: [
      'Dame un masaje de hombros de un minuto.', 'Imita cómo me enojo.', 'Dime tres cosas que te gustan de mí mirándome a los ojos.', 'Baila conmigo una canción lenta.',
      'Escríbeme una nota de amor de cinco líneas.', 'Recréame nuestra primera conversación.', 'Planea en voz alta nuestra próxima cita sorpresa.', 'Dame un beso en la frente.',
      'Cuéntame un chiste malo y hazme reír.', 'Canta nuestra canción, aunque sea desafinado.', 'Hazme un cumplido con rima.', 'Elige la próxima película y convénceme en 30 segundos.',
    ],
  },
}
const NIVELES = [
  { id: 'familiar', label: 'Familiar (todas las edades)' },
  { id: 'amigos', label: 'Amigos y fiestas' },
  { id: 'pareja', label: 'Parejas (romántico)' },
]

export default function VerdadOReto() {
  const [nivel, setNivel] = useState('familiar')
  const [jugadoresTexto, setJugadoresTexto] = useState('')
  const [turno, setTurno] = useState(0)
  const [carta, setCarta] = useState(null)
  const [usadas, setUsadas] = useState({})

  const jugadores = jugadoresTexto.split(/[,\n]+/).map((x) => x.trim()).filter(Boolean)
  const actual = jugadores.length ? jugadores[turno % jugadores.length] : null

  function sacar(tipo) {
    const t = tipo === 'azar' ? (enteroAleatorio(0, 1) ? 'verdad' : 'reto') : tipo
    const lista = PREGUNTAS[nivel][t]
    const clave = `${nivel}-${t}`
    let vistas = usadas[clave] || []
    if (vistas.length >= lista.length) vistas = []
    const libres = lista.map((_, i) => i).filter((i) => !vistas.includes(i))
    const idx = libres[enteroAleatorio(0, libres.length - 1)]
    setUsadas((u) => ({ ...u, [clave]: [...vistas, idx] }))
    setCarta({ tipo: t, texto: lista[idx], jugador: actual })
    setTurno((x) => x + 1)
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <select value={nivel} onChange={(e) => setNivel(e.target.value)} className={inputClass} aria-label="Nivel">
          {NIVELES.map((n) => (
            <option key={n.id} value={n.id}>{n.label}</option>
          ))}
        </select>
        <input value={jugadoresTexto} onChange={(e) => setJugadoresTexto(e.target.value)} className={inputClass} placeholder="Jugadores separados por comas (opcional)" />
      </div>

      {actual && <p className="text-center text-sm text-gray-600">Turno de <strong className="text-gray-900">{actual}</strong></p>}
      <div className="grid grid-cols-3 gap-3">
        <button type="button" onClick={() => sacar('verdad')} className="py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg">Verdad</button>
        <button type="button" onClick={() => sacar('azar')} className="py-4 rounded-xl bg-gray-800 hover:bg-gray-900 text-white font-bold text-lg">🎲</button>
        <button type="button" onClick={() => sacar('reto')} className="py-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-lg">Reto</button>
      </div>

      <div className={`rounded-2xl p-6 min-h-[10rem] flex flex-col justify-center text-center border-2 ${carta ? (carta.tipo === 'verdad' ? 'border-blue-300 bg-blue-50' : 'border-rose-300 bg-rose-50') : 'border-dashed border-gray-300'}`} aria-live="polite">
        {carta ? (
          <>
            <p className={`text-xs font-bold uppercase tracking-wide ${carta.tipo === 'verdad' ? 'text-blue-700' : 'text-rose-700'}`}>{carta.jugador ? `${carta.jugador} · ` : ''}{carta.tipo}</p>
            <p className="text-xl sm:text-2xl font-semibold text-gray-900 mt-2">{carta.texto}</p>
          </>
        ) : (
          <p className="text-gray-500">Elige verdad, reto o deja que decida el dado.</p>
        )}
      </div>
      {carta && (
        <p className="text-center">
          <button type="button" onClick={() => sacar(carta.tipo)} className={secondaryButtonClass}>Cambiar por otra {carta.tipo === 'verdad' ? 'pregunta' : 'prueba'}</button>
        </p>
      )}
      <p className="text-xs text-gray-500 text-center">Las preguntas no se repiten hasta que salen todas las del nivel. Nadie está obligado a hacer un reto que le incomode.</p>
    </div>
  )
}
