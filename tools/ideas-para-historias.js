'use client'

import { useState } from 'react'
import { enteroAleatorio } from '@/lib/calc/dev'
import { buttonClass, CopyButton, inputClass } from '@/components/calc-ui'

const GENEROS = {
  fantasia: {
    label: 'Fantasía',
    protagonistas: ['una aprendiz de hechicera que no sabe leer', 'el último guardián de un dragón dormido', 'un herrero que forja espadas que hablan', 'una princesa exiliada que trabaja como cartógrafa', 'un ladrón que roba recuerdos'],
    lugares: ['un reino construido sobre el lomo de una tortuga gigante', 'una biblioteca infinita bajo el mar', 'un bosque donde los árboles votan', 'una ciudad que desaparece cada luna nueva', 'unas montañas donde la magia está prohibida'],
    conflictos: ['la magia empieza a agotarse y solo quedan tres hechizos en el mundo', 'debe devolver una corona robada antes del solsticio', 'su sombra se ha rebelado y actúa por su cuenta', 'un pacto antiguo exige el sacrificio de su nombre', 'los dioses han desaparecido y alguien ocupa su lugar'],
  },
  misterio: {
    label: 'Misterio y policiaco',
    protagonistas: ['una detective jubilada que odia los misterios', 'un cerrajero con memoria fotográfica', 'una periodista de nota roja en Guadalajara', 'el portero de un edificio antiguo en la Roma', 'una forense que escucha a los muertos… o eso cree'],
    lugares: ['un tren nocturno entre Chihuahua y Los Mochis', 'una hacienda aislada por una tormenta', 'un congreso de magos en un hotel de lujo', 'un pueblo donde nadie ha muerto en cien años', 'una isla con un faro abandonado'],
    conflictos: ['alguien confiesa un crimen que todavía no ha ocurrido', 'todos los testigos describen a un culpable distinto', 'desaparece un cuadro y aparece una copia perfecta firmada por el protagonista', 'recibe cartas escritas con su propia letra', 'el cadáver del caso resulta estar vivo al día siguiente'],
  },
  ciencia: {
    label: 'Ciencia ficción',
    protagonistas: ['una ingeniera que repara androides en un mercado de Tepito del año 2150', 'el único humano en una colonia de inteligencias artificiales', 'una astronauta que despierta 300 años tarde', 'un niño que puede hablar con las máquinas', 'una clon que descubre que es la número 47'],
    lugares: ['una estación espacial en órbita de Júpiter', 'una Ciudad de México cubierta por una cúpula', 'una nave generacional que olvidó su destino', 'un planeta donde siempre es de noche', 'un mundo virtual más real que el real'],
    conflictos: ['la IA que gobierna la ciudad pide asilo político', 'llega una señal que es la voz de su madre muerta', 'el tiempo empieza a correr hacia atrás en un solo barrio', 'descubre que los recuerdos se venden en el mercado negro', 'la Tierra deja de responder los mensajes'],
  },
  terror: {
    label: 'Terror',
    protagonistas: ['una niñera en su primera noche de trabajo', 'un estudiante que se muda a una casa muy barata', 'una enfermera del turno nocturno', 'un grupo de amigos que juega a la ouija por broma', 'un restaurador de muñecas antiguas'],
    lugares: ['un hospital cerrado desde 1985', 'un pueblo fantasma en la sierra', 'un elevador que baja a un piso que no existe', 'una casa con una habitación que no sale en los planos', 'un bosque donde se escuchan voces conocidas'],
    conflictos: ['cada noche aparece una foto nueva en su celular, tomada mientras duerme', 'la voz del intercomunicador sabe cosas que nadie más sabe', 'los vecinos repiten la misma conversación todos los días', 'su reflejo tarda un segundo en imitarlo', 'algo llama a la puerta con el ritmo de su canción favorita'],
  },
  romance: {
    label: 'Romance',
    protagonistas: ['una chef que odia el amor', 'un traductor de cartas de amor ajenas', 'dos rivales de concursos de repostería', 'una arquitecta que vuelve a su pueblo natal', 'un músico callejero en Madrid'],
    lugares: ['una librería de viejo en Coyoacán', 'una boda en la playa donde nada sale bien', 'un tren entre Barcelona y París', 'un viñedo en Valle de Guadalupe', 'un edificio donde los vecinos se escriben notas'],
    conflictos: ['se enamora de la persona que le está comprando la casa de su abuela', 'tiene que fingir un noviazgo durante un fin de semana familiar', 'recibe cartas de un admirador que resulta ser su jefe', 'comparten departamento sin saber que se conocieron de niños', 'una apuesta con sus amigos se sale de control'],
  },
  aventura: {
    label: 'Aventura',
    protagonistas: ['una arqueóloga con miedo a las alturas', 'un piloto de avioneta que transporta cosas raras', 'dos hermanos que heredan un mapa incompleto', 'una guía de turistas en la selva lacandona', 'un cartero que entrega en lugares que no existen'],
    lugares: ['un cenote que conecta con otro continente', 'la cima de un volcán dormido', 'un barco hundido que aparece en la marea baja', 'una ciudad perdida bajo el desierto', 'un circo que viaja entre países'],
    conflictos: ['tienen siete días para encontrar un tesoro antes que una empresa sin escrúpulos', 'el mapa cambia cada vez que lo miran', 'deben escoltar a un animal que nadie ha visto antes', 'un rival conoce todos sus movimientos', 'la única salida es a través de un laberinto que se mueve'],
  },
}

const GIROS = ['el villano resulta ser la versión futura del protagonista', 'el narrador ha estado mintiendo desde el principio', 'el objeto que buscaban siempre estuvo en su bolsillo', 'el aliado más fiel es quien empezó todo', 'todo ocurre en un solo día que se repite', 'el protagonista descubre que es un personaje de un libro', 'la víctima y el culpable son la misma persona', 'el final ocurre al principio de la historia']
const PRIMERAS = ['Nadie en el pueblo recordaba la última vez que había llovido hacia arriba.', 'La carta llegó con veinte años de retraso y con mi nombre escrito a lápiz.', 'Aquella noche el reloj de la plaza dio trece campanadas.', 'Lo primero que noté fue que mi perro ya no me reconocía.', 'Nunca debí contestar esa llamada de un número que era el mío.', 'El mapa tenía una isla más que la noche anterior.']

const elegir = (l) => l[enteroAleatorio(0, l.length - 1)]

export default function IdeasParaHistorias() {
  const [genero, setGenero] = useState('fantasia')
  const [idea, setIdea] = useState(null)

  function generar() {
    const clave = genero === 'sorpresa' ? elegir(Object.keys(GENEROS)) : genero
    const g = GENEROS[clave]
    setIdea({ genero: g.label, protagonista: elegir(g.protagonistas), lugar: elegir(g.lugares), conflicto: elegir(g.conflictos), giro: elegir(GIROS), primera: elegir(PRIMERAS) })
  }

  const texto = idea
    ? `Género: ${idea.genero}\nProtagonista: ${idea.protagonista}\nLugar: ${idea.lugar}\nConflicto: ${idea.conflicto}\nGiro: ${idea.giro}\nPrimera línea: ${idea.primera}`
    : ''

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <select value={genero} onChange={(e) => setGenero(e.target.value)} className={inputClass} aria-label="Género">
          {Object.entries(GENEROS).map(([k, g]) => (
            <option key={k} value={k}>{g.label}</option>
          ))}
          <option value="sorpresa">Sorpréndeme</option>
        </select>
        <button type="button" onClick={generar} className={buttonClass}>✍️ Generar idea</button>
      </div>
      {idea && (
        <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-5 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wide text-amber-700">{idea.genero}</p>
          <p className="text-lg text-gray-900 leading-relaxed">
            La historia de <strong>{idea.protagonista}</strong> en <strong>{idea.lugar}</strong>, donde <strong>{idea.conflicto}</strong>. Giro final: {idea.giro}.
          </p>
          <p className="text-sm text-gray-700 italic border-l-4 border-amber-300 pl-3">«{idea.primera}»</p>
          <div className="flex gap-2">
            <CopyButton text={texto} label="Copiar idea" />
            <button type="button" onClick={generar} className="text-sm text-blue-600 font-medium">Otra idea</button>
          </div>
        </div>
      )}
    </div>
  )
}
