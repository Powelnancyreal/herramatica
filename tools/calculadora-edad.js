'use client'

import { useState } from 'react'

const DAYS_OF_WEEK = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
const MONTHS_ES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

function calcAge(birthDateStr) {
  const birth = new Date(birthDateStr + 'T00:00:00')
  const today = new Date()

  let years = today.getFullYear() - birth.getFullYear()
  let months = today.getMonth() - birth.getMonth()
  let days = today.getDate() - birth.getDate()

  if (days < 0) {
    months--
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0)
    days += prevMonth.getDate()
  }
  if (months < 0) {
    years--
    months += 12
  }

  // Total days
  const msPerDay = 1000 * 60 * 60 * 24
  const totalDays = Math.floor((today - birth) / msPerDay)
  const totalWeeks = Math.floor(totalDays / 7)
  const totalHours = totalDays * 24

  // Day of week born
  const dayOfWeek = DAYS_OF_WEEK[birth.getDay()]

  // Next birthday
  const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate())
  if (nextBirthday <= today) nextBirthday.setFullYear(today.getFullYear() + 1)
  const daysUntilBirthday = Math.ceil((nextBirthday - today) / msPerDay)

  return { years, months, days, totalDays, totalWeeks, totalHours, dayOfWeek, daysUntilBirthday, birth }
}

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
      <div className="text-2xl sm:text-3xl font-bold text-blue-600">{value}</div>
      <div className="text-sm font-medium text-gray-700 mt-1">{label}</div>
      {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
    </div>
  )
}

export default function CalculadoraEdad() {
  const [birthDate, setBirthDate] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  function handleCalculate() {
    if (!birthDate) {
      setError('Por favor, introduce tu fecha de nacimiento.')
      return
    }
    if (birthDate > today) {
      setError('La fecha de nacimiento no puede ser en el futuro.')
      return
    }
    setError('')
    setResult(calcAge(birthDate))
  }

  return (
    <div className="space-y-5">
      {/* Input */}
      <div>
        <label htmlFor="birth-date" className="block text-sm font-medium text-gray-700 mb-1.5">
          Fecha de nacimiento
        </label>
        <input
          id="birth-date"
          type="date"
          value={birthDate}
          max={today}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        />
        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
      </div>

      <button
        onClick={handleCalculate}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Calcular edad
      </button>

      {/* Results */}
      {result && (
        <div className="space-y-5 pt-2">
          {/* Primary result */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 text-white text-center">
            <p className="text-blue-100 text-sm mb-1">Tu edad exacta</p>
            <p className="text-4xl font-bold">
              {result.years} <span className="text-2xl font-semibold">años</span>
            </p>
            <p className="text-blue-200 mt-1">
              {result.months} {result.months === 1 ? 'mes' : 'meses'} y {result.days}{' '}
              {result.days === 1 ? 'día' : 'días'}
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <StatCard
              label="Días vividos"
              value={result.totalDays.toLocaleString('es')}
              sub="días totales"
            />
            <StatCard
              label="Semanas"
              value={result.totalWeeks.toLocaleString('es')}
              sub="semanas completas"
            />
            <StatCard
              label="Horas"
              value={result.totalHours.toLocaleString('es')}
              sub="horas aproximadas"
            />
          </div>

          {/* Extra data */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Naciste un</span>
              <span className="text-sm font-semibold text-gray-900 capitalize">{result.dayOfWeek}</span>
            </div>
            <div className="border-t border-gray-200" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Próximo cumpleaños en</span>
              <span className="text-sm font-semibold text-gray-900">
                {result.daysUntilBirthday === 0
                  ? '¡Hoy es tu cumpleaños!'
                  : `${result.daysUntilBirthday} ${result.daysUntilBirthday === 1 ? 'día' : 'días'}`}
              </span>
            </div>
            <div className="border-t border-gray-200" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Fecha de nacimiento</span>
              <span className="text-sm font-semibold text-gray-900">
                {result.birth.getDate()} de {MONTHS_ES[result.birth.getMonth()]} de {result.birth.getFullYear()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
