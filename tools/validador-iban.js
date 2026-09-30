'use client'

import { useMemo, useState } from 'react'
import { validarIBAN } from '@/lib/calc/iban'
import { CopyButton, Field, inputClass, Row, Rows } from '@/components/calc-ui'

export default function ValidadorIBAN() {
  const [texto, setTexto] = useState('')
  const r = useMemo(() => (texto.replace(/\s/g, '').length >= 5 ? validarIBAN(texto) : null), [texto])

  return (
    <div className="space-y-5">
      <Field label="Número IBAN" hint="Puedes pegarlo con o sin espacios. Ej: ES91 2100 0418 4502 0005 1332">
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="ES00 0000 0000 0000 0000 0000"
          autoComplete="off"
          spellCheck={false}
          className={`${inputClass} font-mono tracking-wide uppercase`}
        />
      </Field>

      {r && (
        <div
          className={`rounded-xl border-2 p-5 space-y-4 ${r.valido ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
        >
          <p className={`text-2xl font-bold ${r.valido ? 'text-green-700' : 'text-red-700'}`}>
            {r.valido ? '✓ IBAN válido' : '✗ IBAN no válido'}
          </p>
          {r.errores.length > 0 && (
            <ul className="list-disc pl-5 text-sm text-red-800 space-y-1">
              {r.errores.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          )}
          {r.formateado && (
            <Rows>
              <Row label="IBAN formateado" value={<span className="font-mono">{r.formateado}</span>} />
              <Row label="País" value={`${r.nombrePais} (${r.pais})`} />
              <Row label="Dígitos de control IBAN" value={r.iban.slice(2, 4)} />
              <Row label="Suma de verificación (módulo 97)" value={r.checksumOk ? 'Correcta' : 'Incorrecta'} />
              {r.espana && (
                <>
                  <Row label="Entidad" value={r.espana.entidad ? `${r.espana.entidad} (${r.espana.banco})` : r.espana.banco} />
                  <Row label="Oficina" value={r.espana.sucursal} />
                  <Row label="Dígitos de control de la cuenta" value={`${r.espana.dc} ${r.espana.valido ? '✓' : `✗ (debería ser ${r.espana.dcEsperado})`}`} />
                  <Row label="Número de cuenta" value={r.espana.cuenta} />
                </>
              )}
            </Rows>
          )}
          {r.valido && <CopyButton text={r.formateado} label="Copiar IBAN formateado" />}
          <p className="text-xs text-gray-600">
            La validación comprueba el formato y los dígitos de control; no confirma que la cuenta exista ni quién es su
            titular. El cálculo se hace en tu navegador: el IBAN no se envía a ningún servidor.
          </p>
        </div>
      )}
    </div>
  )
}
