// Longitudes oficiales por país según el registro IBAN (ISO 13616, SWIFT).
export const LONGITUDES_IBAN = {
  AD: 24, AE: 23, AL: 28, AT: 20, AZ: 28, BA: 20, BE: 16, BG: 22, BH: 22, BR: 29, BY: 28, CH: 21, CR: 22,
  CY: 28, CZ: 24, DE: 22, DK: 18, DO: 28, EE: 20, EG: 29, ES: 24, FI: 18, FO: 18, FR: 27, GB: 22, GE: 22,
  GI: 23, GL: 18, GR: 27, GT: 28, HR: 21, HU: 28, IE: 22, IL: 23, IQ: 23, IS: 26, IT: 27, JO: 30, KW: 30,
  KZ: 20, LB: 28, LC: 32, LI: 21, LT: 20, LU: 20, LV: 21, MC: 27, MD: 24, ME: 22, MK: 19, MR: 27, MT: 31,
  MU: 30, NL: 18, NO: 15, PK: 24, PL: 28, PS: 29, PT: 25, QA: 29, RO: 24, RS: 22, SA: 24, SC: 31, SE: 24,
  SI: 19, SK: 24, SM: 27, ST: 25, SV: 28, TL: 23, TN: 24, TR: 26, UA: 29, VA: 22, VG: 24, XK: 20,
}

export const NOMBRES_PAIS = {
  ES: 'España', DE: 'Alemania', FR: 'Francia', IT: 'Italia', PT: 'Portugal', GB: 'Reino Unido', NL: 'Países Bajos',
  BE: 'Bélgica', CH: 'Suiza', AT: 'Austria', IE: 'Irlanda', LU: 'Luxemburgo', AD: 'Andorra', BR: 'Brasil',
  CR: 'Costa Rica', DO: 'República Dominicana', GT: 'Guatemala', SV: 'El Salvador', PL: 'Polonia', SE: 'Suecia',
  DK: 'Dinamarca', NO: 'Noruega', FI: 'Finlandia', GR: 'Grecia', RO: 'Rumanía', CZ: 'República Checa', TR: 'Turquía',
}

// Entidades más habituales en España (código de banco de 4 dígitos).
export const BANCOS_ES = {
  '0049': 'Banco Santander', '0182': 'BBVA', '2100': 'CaixaBank', '0081': 'Banco Sabadell', '0128': 'Bankinter',
  '1465': 'ING', '0073': 'Openbank', '2085': 'Ibercaja', '2080': 'Abanca', '3058': 'Cajamar', '2095': 'Kutxabank',
  '2103': 'Unicaja', '0019': 'Deutsche Bank', '1491': 'Triodos Bank', '0239': 'EVO Banco', '0186': 'Banco Mediolanum',
}

export function normalizarIBAN(texto) {
  return texto.replace(/^IBAN/i, '').replace(/[\s-]/g, '').toUpperCase()
}

export function formatearIBAN(iban) {
  return iban.replace(/(.{4})/g, '$1 ').trim()
}

// Módulo 97 sobre la representación numérica (A=10 … Z=35), procesando por trozos para no desbordar.
export function mod97(iban) {
  const reordenado = iban.slice(4) + iban.slice(0, 4)
  let resto = 0
  for (const ch of reordenado) {
    const valor = /[A-Z]/.test(ch) ? String(ch.charCodeAt(0) - 55) : ch
    for (const digito of valor) resto = (resto * 10 + Number(digito)) % 97
  }
  return resto
}

export function calcularDigitosControlIBAN(pais, bban) {
  const resto = mod97(`${pais}00${bban}`)
  return String(98 - resto).padStart(2, '0')
}

// Dígitos de control nacionales españoles (CCC): pesos 1,2,4,8,5,10,9,7,3,6 módulo 11.
function dcEspanol(cadena10) {
  const pesos = [1, 2, 4, 8, 5, 10, 9, 7, 3, 6]
  const suma = cadena10.split('').reduce((s, d, i) => s + Number(d) * pesos[i], 0)
  const dc = 11 - (suma % 11)
  return dc === 11 ? 0 : dc === 10 ? 1 : dc
}

export function validarCCCEspana(bban) {
  const banco = bban.slice(0, 4)
  const sucursal = bban.slice(4, 8)
  const dc = bban.slice(8, 10)
  const cuenta = bban.slice(10, 20)
  const esperado = `${dcEspanol(`00${banco}${sucursal}`)}${dcEspanol(cuenta)}`
  return { banco, sucursal, dc, cuenta, dcEsperado: esperado, valido: dc === esperado, entidad: BANCOS_ES[banco] || null }
}

export function validarIBAN(texto) {
  const iban = normalizarIBAN(texto)
  const errores = []
  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(iban)) {
    errores.push('Un IBAN empieza con 2 letras de país y 2 dígitos de control, seguidos solo de letras y números.')
    return { iban, valido: false, errores }
  }
  const pais = iban.slice(0, 2)
  const longitudEsperada = LONGITUDES_IBAN[pais]
  if (!longitudEsperada) errores.push(`El código de país "${pais}" no usa IBAN o no es válido.`)
  else if (iban.length !== longitudEsperada)
    errores.push(`Un IBAN de ${NOMBRES_PAIS[pais] || pais} tiene ${longitudEsperada} caracteres y este tiene ${iban.length}.`)

  const checksumOk = mod97(iban) === 1
  if (!checksumOk) errores.push('Los dígitos de control no coinciden: hay algún carácter mal escrito o faltante.')

  let espana = null
  if (pais === 'ES' && iban.length === 24) {
    espana = validarCCCEspana(iban.slice(4))
    if (!espana.valido) errores.push(`Los dígitos de control de la cuenta española no son válidos (se esperaban ${espana.dcEsperado}).`)
  }

  return {
    iban,
    formateado: formatearIBAN(iban),
    pais,
    nombrePais: NOMBRES_PAIS[pais] || pais,
    longitudEsperada,
    checksumOk,
    espana,
    valido: errores.length === 0,
    errores,
  }
}
