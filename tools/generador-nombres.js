'use client'

import { useState } from 'react'

const NOMBRES_M = [
  'Alejandro', 'Mateo', 'Santiago', 'Diego', 'Daniel', 'Sebastián', 'Emiliano', 'Leonardo', 'David', 'Gabriel',
  'Adrián', 'Javier', 'Andrés', 'Rodrigo', 'Miguel', 'Fernando', 'Carlos', 'Luis', 'José', 'Manuel',
  'Pablo', 'Ricardo', 'Eduardo', 'Ángel', 'Iván', 'Marcos', 'Raúl', 'Óscar', 'Hugo', 'Bruno',
]
const NOMBRES_F = [
  'Sofía', 'Valentina', 'Isabella', 'Camila', 'Valeria', 'Ximena', 'Regina', 'Renata', 'María', 'Fernanda',
  'Daniela', 'Paula', 'Andrea', 'Natalia', 'Lucía', 'Emilia', 'Victoria', 'Elena', 'Carmen', 'Adriana',
  'Alejandra', 'Gabriela', 'Patricia', 'Claudia', 'Marina', 'Sara', 'Julia', 'Rosa', 'Laura', 'Ana',
]
const APELLIDOS = [
  'García', 'Martínez', 'López', 'González', 'Hernández', 'Pérez', 'Rodríguez', 'Sánchez', 'Ramírez', 'Torres',
  'Flores', 'Rivera', 'Gómez', 'Díaz', 'Cruz', 'Morales', 'Reyes', 'Jiménez', 'Ortiz', 'Gutiérrez',
  'Vargas', 'Castillo', 'Romero', 'Herrera', 'Medina', 'Aguilar', 'Mendoza', 'Ruiz', 'Vázquez', 'Castro',
]

const NOMBRES_PERRO = [
  'Rocky', 'Max', 'Toby', 'Buddy', 'Bella', 'Luna', 'Coco', 'Nala', 'Simba', 'Thor',
  'Kira', 'Zeus', 'Duke', 'Milo', 'Lola', 'Canela', 'Firulais', 'Sultán', 'Rex', 'Fiona',
]
const NOMBRES_GATO = [
  'Michi', 'Salem', 'Simón', 'Tom', 'Nube', 'Whiskers', 'Garfield', 'Kitty', 'Mimi', 'Oreo',
  'Loki', 'Pelusa', 'Chester', 'Minino', 'Salomón', 'Cielo', 'Blacky', 'Frijol', 'Manchas', 'Copito',
]

const PREFIJOS_FANTASIA = ['Ael', 'Bor', 'Cyn', 'Drak', 'Elar', 'Fen', 'Gor', 'Hal', 'Ith', 'Jor', 'Kael', 'Lor', 'Myr', 'Nyx', 'Or', 'Quel', 'Ryn', 'Sil', 'Thal', 'Vor']
const SUFIJOS_FANTASIA = ['adan', 'wyn', 'thor', 'dral', 'iel', 'ric', 'mir', 'ash', 'ora', 'wen', 'gorn', 'nis', 'thas', 'ael', 'dor', 'ianna', 'ost', 'ryn', 'ven', 'ux']

const PALABRAS_USUARIO = ['Tigre', 'Lobo', 'Fuego', 'Sombra', 'Nube', 'Trueno', 'Fenix', 'Cometa', 'Halcón', 'Onda', 'Estrella', 'Nova', 'Rayo', 'Viento', 'Luna']

function randItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generarPersonas(sexo, cantidad, conApellido) {
  const lista = sexo === 'M' ? NOMBRES_M : sexo === 'F' ? NOMBRES_F : [...NOMBRES_M, ...NOMBRES_F]
  const resultado = []
  for (let i = 0; i < cantidad; i++) {
    const nombre = randItem(lista)
    resultado.push(conApellido ? `${nombre} ${randItem(APELLIDOS)}` : nombre)
  }
  return resultado
}

function generarMascotas(tipo, cantidad) {
  const lista = tipo === 'perro' ? NOMBRES_PERRO : tipo === 'gato' ? NOMBRES_GATO : [...NOMBRES_PERRO, ...NOMBRES_GATO]
  const resultado = []
  for (let i = 0; i < cantidad; i++) resultado.push(randItem(lista))
  return resultado
}

function generarFantasia(cantidad) {
  const resultado = []
  for (let i = 0; i < cantidad; i++) {
    const silabas = 2 + Math.floor(Math.random() * 2)
    let nombre = randItem(PREFIJOS_FANTASIA)
    for (let j = 1; j < silabas; j++) nombre += randItem(SUFIJOS_FANTASIA)
    resultado.push(nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase())
  }
  return resultado
}

function generarUsuarios(cantidad) {
  const resultado = []
  for (let i = 0; i < cantidad; i++) {
    const numero = Math.floor(Math.random() * 9999)
    resultado.push(`${randItem(PALABRAS_USUARIO)}${randItem(PALABRAS_USUARIO)}${numero}`)
  }
  return resultado
}

const TABS = [
  { id: 'personas', label: '👤 Personas' },
  { id: 'mascotas', label: '🐾 Mascotas' },
  { id: 'fantasia', label: '🐉 Fantasía' },
  { id: 'usuario', label: '💻 Usuario' },
]

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function GeneradorNombres() {
  const [tab, setTab] = useState('personas')
  const [sexo, setSexo] = useState('todos')
  const [conApellido, setConApellido] = useState(true)
  const [tipoMascota, setTipoMascota] = useState('todos')
  const [cantidad, setCantidad] = useState(8)
  const [resultados, setResultados] = useState([])

  function generar() {
    if (tab === 'personas') setResultados(generarPersonas(sexo, cantidad, conApellido))
    else if (tab === 'mascotas') setResultados(generarMascotas(tipoMascota, cantidad))
    else if (tab === 'fantasia') setResultados(generarFantasia(cantidad))
    else setResultados(generarUsuarios(cantidad))
  }

  function cambiarTab(id) {
    setTab(id)
    setResultados([])
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => cambiarTab(t.id)}
            className={`px-3.5 py-2 rounded-lg font-semibold text-sm transition-all ${
              tab === t.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'personas' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Sexo</label>
            <select value={sexo} onChange={(e) => setSexo(e.target.value)} className={inputClass}>
              <option value="todos">Cualquiera</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>
          <div className="flex items-end pb-2.5">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={conApellido} onChange={(e) => setConApellido(e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              Incluir apellido
            </label>
          </div>
        </div>
      )}

      {tab === 'mascotas' && (
        <div>
          <label className={labelClass}>Tipo de mascota</label>
          <select value={tipoMascota} onChange={(e) => setTipoMascota(e.target.value)} className={inputClass}>
            <option value="todos">Cualquiera</option>
            <option value="perro">Perro</option>
            <option value="gato">Gato</option>
          </select>
        </div>
      )}

      <div>
        <label className={labelClass}>Cantidad de nombres</label>
        <input
          type="number"
          inputMode="numeric"
          min="1"
          max="30"
          value={cantidad}
          onChange={(e) => setCantidad(Math.min(30, Math.max(1, parseInt(e.target.value, 10) || 1)))}
          className={inputClass}
        />
      </div>

      <button
        onClick={generar}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Generar nombres
      </button>

      {resultados.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {resultados.map((nombre, i) => (
            <div key={i} className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5 text-center text-gray-900 font-medium text-sm">
              {nombre}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
