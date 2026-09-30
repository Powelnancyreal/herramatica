'use client'

import { useMemo, useState } from 'react'
import { estadisticas, parseNumeros } from '@/lib/calc/mates'
import { formatNumber, inputClass, Note, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

export default function CalculadoraPromedio() {
  const [texto, setTexto] = useState('8, 9, 7.5, 10, 6')
  const [minimo, setMinimo] = useState('6')
  const [escala, setEscala] = useState('10')

  const { numeros, invalidos } = useMemo(() => parseNumeros(texto), [texto])
  const e = useMemo(() => estadisticas(numeros), [numeros])
  const aprobatoria = parseFloat(minimo)

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Números o calificaciones</label>
        <textarea
          value={texto}
          onChange={(ev) => setTexto(ev.target.value)}
          rows={4}
          className={inputClass}
          placeholder="Separa con comas, espacios o saltos de línea: 8, 9, 7.5, 10"
        />
        {invalidos.length > 0 && <p className="text-sm text-amber-700 mt-1">Se ignoraron valores no numéricos: {invalidos.slice(0, 5).join(', ')}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Calificación mínima aprobatoria</label>
          <NumberInput value={minimo} onChange={setMinimo} step="0.1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Escala máxima</label>
          <NumberInput value={escala} onChange={setEscala} step="1" />
        </div>
      </div>

      {e && (
        <ResultBox label={`Promedio de ${e.n} ${e.n === 1 ? 'valor' : 'valores'}`} value={formatNumber(e.media, 2)}>
          <Rows>
            <Row label="Suma" value={formatNumber(e.suma, 4)} />
            <Row label="Media aritmética (suma ÷ cantidad)" value={formatNumber(e.media, 4)} bold />
            <Row label="Mediana (valor central)" value={formatNumber(e.mediana, 4)} />
            <Row label="Moda (el más repetido)" value={e.moda.length ? e.moda.map((m) => formatNumber(m, 4)).join(', ') : 'No hay (ninguno se repite)'} />
            <Row label="Mínimo · Máximo" value={`${formatNumber(e.min, 4)} · ${formatNumber(e.max, 4)}`} />
            <Row label="Rango" value={formatNumber(e.rango, 4)} />
            {e.geometrica !== null && <Row label="Media geométrica" value={formatNumber(e.geometrica, 4)} />}
            {parseFloat(escala) > 0 && <Row label={`Promedio en escala de 100`} value={formatNumber((e.media / parseFloat(escala)) * 100, 2)} />}
          </Rows>
          {!isNaN(aprobatoria) && (
            <p className={`text-sm font-medium ${e.media >= aprobatoria ? 'text-green-700' : 'text-red-700'}`}>
              {e.media >= aprobatoria
                ? `Aprobado: tu promedio supera el mínimo por ${formatNumber(e.media - aprobatoria, 2)} puntos.`
                : `Reprobado: te faltan ${formatNumber(aprobatoria - e.media, 2)} puntos de promedio para llegar a ${formatNumber(aprobatoria, 2)}.`}
            </p>
          )}
          <Note>Operación: ({e.orden.map((x) => formatNumber(x, 4)).join(' + ')}) ÷ {e.n} = {formatNumber(e.media, 4)}</Note>
        </ResultBox>
      )}
    </div>
  )
}
