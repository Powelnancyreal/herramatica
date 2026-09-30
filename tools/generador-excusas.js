'use client'

import { useState } from 'react'
import { enteroAleatorio } from '@/lib/calc/dev'
import { CopyButton, secondaryButtonClass, Tabs } from '@/components/calc-ui'

const SITUACIONES = {
  trabajo: {
    label: '💼 Llegar tarde al trabajo',
    creibles: ['Hubo un accidente en la avenida y el tráfico estuvo detenido casi media hora.', 'Se me descargó el celular y no sonó la alarma.', 'El transporte público tuvo una falla y tuvimos que bajar y esperar el siguiente.', 'Tuve que llevar a mi hijo al médico a primera hora.', 'Se cortó el agua en mi edificio y tardé en arreglarme.', 'Me quedé esperando al técnico de internet que dijo que llegaría temprano.'],
    absurdas: ['Un pato cruzó la calle con sus diez patitos y nadie se atrevió a interrumpirlos.', 'Mi gato escondió las llaves y no quiso decirme dónde.', 'Me quedé atrapado en un bucle temporal y llegué justo a tiempo… de ayer.', 'El elevador decidió que hoy era su día de descanso.', 'Me distraje ayudando a una señora a buscar a su perico, que resultó estar en su bolsa.'],
  },
  escuela: {
    label: '📚 No hice la tarea',
    creibles: ['Guardé el archivo en la computadora de mi casa y olvidé mandármelo por correo.', 'La impresora se quedó sin tinta a medianoche.', 'Entendí mal la fecha de entrega y pensé que era la próxima clase.', 'Se fue la luz en mi colonia toda la tarde.', 'Tuve un compromiso familiar que no pude cancelar.'],
    absurdas: ['Mi perro se comió la tarea… y luego pidió más.', 'La terminé, pero el viento se la llevó y ahora vive en otra colonia.', 'La escribí con tinta invisible por seguridad y todavía no encuentro la linterna UV.', 'Mi hermano pequeño la usó para hacer un avión de papel que sigue volando.', 'Resolví la tarea tan rápido que el papel se incendió.'],
  },
  cita: {
    label: '💔 Cancelar una cita',
    creibles: ['Me surgió un pendiente de trabajo que no puedo dejar para mañana.', 'No me siento bien y prefiero descansar para no contagiar a nadie.', 'Tengo una emergencia familiar; te escribo en cuanto se resuelva.', 'Me equivoqué de fecha en mi agenda y ya tenía otro compromiso.', 'Mi auto no arranca y el mecánico no llega hasta tarde.'],
    absurdas: ['Mi horóscopo dice que hoy no debo salir con signos de agua.', 'Me inscribí sin querer en un maratón de telenovelas y no puedo abandonar a los protagonistas.', 'Mi planta está pasando por un momento difícil y necesita compañía.', 'Estoy entrenando para ser el campeón mundial de siestas.', 'Olvidé cómo se usan los zapatos.'],
  },
  fiesta: {
    label: '🎉 No ir a una fiesta',
    creibles: ['Tengo que levantarme muy temprano mañana y necesito dormir.', 'Estoy agotado de la semana y prefiero quedarme en casa.', 'Ya me había comprometido a visitar a mi familia.', 'Tengo que terminar un proyecto antes del lunes.', 'Me duele la cabeza desde la tarde.'],
    absurdas: ['Mi pez dorado cumple años y organicé una fiesta acuática.', 'Estoy aprendiendo a tocar el triángulo y el concierto es hoy.', 'Le prometí a mi sofá que pasaríamos la noche juntos.', 'Me invitaron a otra fiesta… en mis sueños.', 'Mi gato y yo tenemos noche de spa.'],
  },
  gym: {
    label: '🏋️ No ir al gimnasio',
    creibles: ['Estoy dejando descansar el músculo para evitar una lesión.', 'Tengo una molestia en la rodilla y prefiero no forzarla.', 'Hoy me toca día de descanso activo: caminaré un rato.', 'Se me hizo tarde en el trabajo y el gimnasio ya cerró.'],
    absurdas: ['Mis músculos están en huelga y exigen más proteína.', 'Levantar el ánimo también cuenta como pesas.', 'Hoy entreno el músculo más importante: el de la paciencia en el sofá.', 'La báscula y yo no nos hablamos desde el martes.'],
  },
}
const TONOS = [
  { id: 'creibles', label: 'Creíble' },
  { id: 'absurdas', label: 'Absurda' },
]

export default function GeneradorExcusas() {
  const [situacion, setSituacion] = useState('trabajo')
  const [tono, setTono] = useState('creibles')
  const [excusa, setExcusa] = useState('')

  function generar(s = situacion, t = tono) {
    const lista = SITUACIONES[s][t]
    let nueva = lista[enteroAleatorio(0, lista.length - 1)]
    if (lista.length > 1) while (nueva === excusa) nueva = lista[enteroAleatorio(0, lista.length - 1)]
    setExcusa(nueva)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {Object.entries(SITUACIONES).map(([k, v]) => (
          <button key={k} type="button" onClick={() => { setSituacion(k); generar(k, tono) }} className={`px-3 py-1.5 rounded-full text-sm border ${situacion === k ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`}>
            {v.label}
          </button>
        ))}
      </div>
      <Tabs tabs={TONOS} value={tono} onChange={(t) => { setTono(t); generar(situacion, t) }} />
      <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-6 min-h-[8rem] flex items-center justify-center text-center" aria-live="polite">
        <p className="text-xl font-medium text-gray-900">{excusa || 'Elige una situación y pulsa el botón.'}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <button type="button" onClick={() => generar()} className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg">🎲 Dame otra excusa</button>
        {excusa && <CopyButton text={excusa} />}
        {excusa && <a href={`https://wa.me/?text=${encodeURIComponent(excusa)}`} target="_blank" rel="noopener noreferrer" className={secondaryButtonClass}>Enviar por WhatsApp</a>}
      </div>
      <p className="text-xs text-gray-500 text-center">Para reír, no para engañar: la honestidad casi siempre funciona mejor que la excusa perfecta.</p>
    </div>
  )
}
