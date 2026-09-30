// Ley Federal del Trabajo (reforma "vacaciones dignas", vigente desde 2023), LISR y LSS.
export const UMA_DIARIA_2026 = 117.31
export const EXENCION_PRIMA_VACACIONAL = 15 * UMA_DIARIA_2026
export const EXENCION_PTU = 15 * UMA_DIARIA_2026
export const TOPE_SBC_DIARIO = 25 * UMA_DIARIA_2026

// Art. 76 LFT: 12 días el primer año, +2 por año hasta 20 (año 5), después +2 cada 5 años.
export function diasVacacionesPorAntiguedad(aniosCumplidos) {
  if (aniosCumplidos < 1) return 0
  if (aniosCumplidos <= 5) return 10 + 2 * aniosCumplidos
  return 20 + 2 * Math.ceil((aniosCumplidos - 5) / 5)
}

export const TABLA_VACACIONES = [1, 2, 3, 4, 5, '6-10', '11-15', '16-20', '21-25', '26-30', '31-35'].map((rango) => {
  const anio = typeof rango === 'number' ? rango : parseInt(rango.split('-')[0], 10)
  return { rango: String(rango), dias: diasVacacionesPorAntiguedad(anio) }
})

function parseISO(str) {
  const [y, m, d] = str.split('-').map(Number)
  return { y, m, d, t: Date.UTC(y, m - 1, d) }
}

export function aniosCumplidosEntre(fechaIngreso, fechaReferencia) {
  const a = parseISO(fechaIngreso)
  const b = parseISO(fechaReferencia)
  let anios = b.y - a.y
  if (b.m < a.m || (b.m === a.m && b.d < a.d)) anios--
  return Math.max(0, anios)
}

// Días transcurridos desde el último aniversario laboral (para vacaciones proporcionales).
export function diasDesdeUltimoAniversario(fechaIngreso, fechaReferencia) {
  const anios = aniosCumplidosEntre(fechaIngreso, fechaReferencia)
  const a = parseISO(fechaIngreso)
  const aniversario = Date.UTC(a.y + anios, a.m - 1, a.d)
  return Math.round((parseISO(fechaReferencia).t - aniversario) / 86400000)
}

export function calcularVacaciones({ fechaIngreso, fechaReferencia }) {
  const anios = aniosCumplidosEntre(fechaIngreso, fechaReferencia)
  const diasAnioActual = diasVacacionesPorAntiguedad(anios)
  const diasProximoAnio = diasVacacionesPorAntiguedad(anios + 1)
  const diasTranscurridos = diasDesdeUltimoAniversario(fechaIngreso, fechaReferencia)
  // Proporcional del año en curso: se genera sobre los días que corresponderán al cumplir el siguiente aniversario.
  const proporcionales = (diasProximoAnio * diasTranscurridos) / 365
  return { anios, diasAnioActual, diasProximoAnio, diasTranscurridos, proporcionales }
}

export function calcularPrimaVacacional({ salarioDiario, diasVacaciones, porcentajePrima }) {
  const prima = salarioDiario * diasVacaciones * (porcentajePrima / 100)
  const exento = Math.min(prima, EXENCION_PRIMA_VACACIONAL)
  const gravable = Math.max(0, prima - EXENCION_PRIMA_VACACIONAL)
  return { prima, exento, gravable, pagoVacaciones: salarioDiario * diasVacaciones }
}

// Art. 84 LFT y art. 27 LSS: SDI = salario diario × factor de integración (+ prestaciones fijas diarias).
export function calcularSDI({ salarioDiario, diasAguinaldo, diasVacaciones, porcentajePrima, otrasPrestacionesDiarias = 0 }) {
  const factor = 1 + diasAguinaldo / 365 + (diasVacaciones * (porcentajePrima / 100)) / 365
  const sdiSinTope = salarioDiario * factor + otrasPrestacionesDiarias
  const sbc = Math.min(sdiSinTope, TOPE_SBC_DIARIO)
  return { factor, sdi: sdiSinTope, sbc, topado: sdiSinTope > TOPE_SBC_DIARIO }
}

// Art. 123 LFT: 50% por días trabajados y 50% por salarios devengados. Art. 127 fr. VIII: tope de
// 3 meses de salario o el promedio de la PTU de los últimos 3 años, lo que resulte más favorable.
export function calcularPTU({
  ptuTotal,
  diasTotalesTrabajadores,
  salariosTotalesTrabajadores,
  diasTrabajador,
  salarioAnualTrabajador,
  salarioMensualTrabajador,
  promedioPtuTresAnios = 0,
}) {
  const factorDias = (ptuTotal * 0.5) / diasTotalesTrabajadores
  const factorSalario = (ptuTotal * 0.5) / salariosTotalesTrabajadores
  const porDias = factorDias * diasTrabajador
  const porSalario = factorSalario * salarioAnualTrabajador
  const ptuSinTope = porDias + porSalario
  const tope = Math.max(3 * salarioMensualTrabajador, promedioPtuTresAnios)
  const ptu = Math.min(ptuSinTope, tope)
  const exento = Math.min(ptu, EXENCION_PTU)
  return { factorDias, factorSalario, porDias, porSalario, ptuSinTope, tope, ptu, topado: ptuSinTope > tope, exento, gravable: ptu - exento }
}

// Cuotas obreras IMSS (art. 25, 106, 107, 147, 168 LSS). El patrón absorbe la cuota obrera
// cuando el trabajador gana el salario mínimo (art. 36 LSS), caso que esta función no modela.
export const CUOTAS_OBRERAS_IMSS = [
  { concepto: 'Enfermedad y maternidad (excedente de 3 UMA)', tasa: 0.004, soloExcedente: true },
  { concepto: 'Prestaciones en dinero', tasa: 0.0025 },
  { concepto: 'Gastos médicos pensionados', tasa: 0.00375 },
  { concepto: 'Invalidez y vida', tasa: 0.00625 },
  { concepto: 'Cesantía en edad avanzada y vejez', tasa: 0.01125 },
]

export function calcularCuotasIMSS({ sbcDiario, diasPeriodo }) {
  const sbc = Math.min(sbcDiario, TOPE_SBC_DIARIO)
  const excedente = Math.max(0, sbc - 3 * UMA_DIARIA_2026)
  const desglose = CUOTAS_OBRERAS_IMSS.map((c) => ({
    concepto: c.concepto,
    importe: (c.soloExcedente ? excedente : sbc) * c.tasa * diasPeriodo,
  }))
  return { desglose, total: desglose.reduce((s, c) => s + c.importe, 0) }
}

// CAT (Banxico, Circular 21/2009): tasa i por periodo tal que el valor presente de los pagos
// iguala el monto neto recibido; CAT = (1 + i)^periodosPorAño − 1. Se calcula sin IVA.
export const PERIODICIDADES = [
  { id: 'mensual', label: 'Mensual', porAnio: 12 },
  { id: 'quincenal', label: 'Quincenal', porAnio: 24 },
  { id: 'catorcenal', label: 'Catorcenal', porAnio: 26 },
  { id: 'semanal', label: 'Semanal', porAnio: 52 },
]

export function calcularCAT({ monto, comisionApertura = 0, pago, numeroPagos, porAnio }) {
  const neto = monto - comisionApertura
  if (neto <= 0 || pago <= 0 || numeroPagos <= 0) return null
  const totalPagado = pago * numeroPagos
  if (totalPagado <= neto) return { cat: 0, tasaPeriodo: 0, totalPagado, costoTotal: totalPagado - neto }

  const vp = (i) => (pago * (1 - Math.pow(1 + i, -numeroPagos))) / i
  let lo = 1e-9
  let hi = 1
  while (vp(hi) > neto && hi < 1e6) hi *= 2
  for (let k = 0; k < 200; k++) {
    const mid = (lo + hi) / 2
    if (vp(mid) > neto) lo = mid
    else hi = mid
  }
  const tasaPeriodo = (lo + hi) / 2
  return {
    tasaPeriodo,
    cat: Math.pow(1 + tasaPeriodo, porAnio) - 1,
    totalPagado,
    costoTotal: totalPagado - neto,
  }
}

// Pago periódico de un crédito a tasa fija (para estimar el pago a partir de la tasa anual).
export function pagoPeriodico({ monto, tasaAnual, numeroPagos, porAnio }) {
  const i = tasaAnual / 100 / porAnio
  if (i === 0) return monto / numeroPagos
  return (monto * i) / (1 - Math.pow(1 + i, -numeroPagos))
}
