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

// ── Salarios mínimos (CONASAMI, resoluciones publicadas en el DOF cada diciembre) ──
export const SALARIOS_MINIMOS = [
  { anio: 2026, general: 315.04, frontera: 440.87 },
  { anio: 2025, general: 278.8, frontera: 419.88 },
  { anio: 2024, general: 248.93, frontera: 374.89 },
  { anio: 2023, general: 207.44, frontera: 312.41 },
  { anio: 2022, general: 172.87, frontera: 260.34 },
  { anio: 2021, general: 141.7, frontera: 213.39 },
  { anio: 2020, general: 123.22, frontera: 185.56 },
  { anio: 2019, general: 102.68, frontera: 176.72 },
]
export const SM_GENERAL_2026 = 315.04
export const SM_FRONTERA_2026 = 440.87
export const UMA_MENSUAL_2026 = UMA_DIARIA_2026 * 30.4

// ── Subsidio para el empleo (decreto publicado en el DOF, vigente en 2026) ──
// Enero de 2026 usa el 15.59% de la UMA mensual de 2025 ($113.14 × 30.4); de febrero a
// diciembre, el 15.02% de la UMA mensual de 2026. Solo reduce el ISR: si el subsidio es
// mayor que el impuesto, la diferencia no se entrega al trabajador.
export const LIMITE_INGRESO_SUBSIDIO = 11492.66
export const SUBSIDIO_2026 = {
  enero: Math.round(113.14 * 30.4 * 0.1559 * 100) / 100,
  febreroDiciembre: Math.round(UMA_MENSUAL_2026 * 0.1502 * 100) / 100,
}

export function calcularSubsidioEmpleo({ ingresoMensual, isrMensual, mes = 'febreroDiciembre' }) {
  const aplica = ingresoMensual > 0 && ingresoMensual <= LIMITE_INGRESO_SUBSIDIO
  const subsidio = aplica ? SUBSIDIO_2026[mes] : 0
  const aplicado = Math.min(subsidio, Math.max(0, isrMensual))
  return { aplica, subsidio, aplicado, isrFinal: Math.max(0, isrMensual - subsidio), noAplicado: subsidio - aplicado }
}

// ISR mensual antes de subsidio con la tarifa del art. 96 LISR (la tabla se recibe como argumento).
export function isrTarifaMensual(tabla, ingreso) {
  if (ingreso <= 0) return 0
  const r = tabla.find((f) => ingreso >= f.limiteInferior && ingreso <= f.limiteSuperior) || tabla[tabla.length - 1]
  return r.cuotaFija + (Math.max(ingreso, r.limiteInferior) - r.limiteInferior) * (r.porcentaje / 100)
}

// ── Cuotas patronales IMSS e Infonavit 2026 (LSS arts. 25, 106, 107, 147, 168, 211; Ley Infonavit art. 29) ──
// Cesantía y vejez patronal: tabla transitoria de la reforma de pensiones (DOF 16/12/2020), fila 2026.
export const CEAV_PATRONAL_2026 = [
  { hastaUMA: 1.5, tasa: 0.03676, etiqueta: '1.01 a 1.50 UMA' },
  { hastaUMA: 2.0, tasa: 0.04851, etiqueta: '1.51 a 2.00 UMA' },
  { hastaUMA: 2.5, tasa: 0.05556, etiqueta: '2.01 a 2.50 UMA' },
  { hastaUMA: 3.0, tasa: 0.06026, etiqueta: '2.51 a 3.00 UMA' },
  { hastaUMA: 3.5, tasa: 0.06361, etiqueta: '3.01 a 3.50 UMA' },
  { hastaUMA: 4.0, tasa: 0.06613, etiqueta: '3.51 a 4.00 UMA' },
  { hastaUMA: Infinity, tasa: 0.07513, etiqueta: '4.01 UMA en adelante' },
]

export function tasaCEAVPatronal(sbcDiario) {
  if (sbcDiario <= SM_GENERAL_2026) return { tasa: 0.0315, etiqueta: '1.00 salario mínimo' }
  const veces = sbcDiario / UMA_DIARIA_2026
  return CEAV_PATRONAL_2026.find((r) => veces <= r.hastaUMA)
}

export const PRIMAS_RIESGO = [
  { clase: 'I', prima: 0.54355, ejemplo: 'Oficinas y comercio' },
  { clase: 'II', prima: 1.13065, ejemplo: 'Manufactura ligera' },
  { clase: 'III', prima: 2.5984, ejemplo: 'Industria y transporte' },
  { clase: 'IV', prima: 4.65325, ejemplo: 'Construcción y metalurgia' },
  { clase: 'V', prima: 7.58875, ejemplo: 'Minería y alto riesgo' },
]

export function calcularCuotasIMSSCompletas({ sbcDiario, diasPeriodo, primaRiesgo = 0.54355, salarioMinimo = false }) {
  const sbc = Math.min(sbcDiario, TOPE_SBC_DIARIO)
  const excedente = Math.max(0, sbc - 3 * UMA_DIARIA_2026)
  const ceav = tasaCEAVPatronal(sbc)
  const d = diasPeriodo
  const filas = [
    { rama: 'Enfermedad y maternidad · cuota fija', patron: UMA_DIARIA_2026 * 0.204 * d, obrero: 0 },
    { rama: 'Enfermedad y maternidad · excedente de 3 UMA', patron: excedente * 0.011 * d, obrero: excedente * 0.004 * d },
    { rama: 'Prestaciones en dinero', patron: sbc * 0.007 * d, obrero: sbc * 0.0025 * d },
    { rama: 'Gastos médicos de pensionados', patron: sbc * 0.0105 * d, obrero: sbc * 0.00375 * d },
    { rama: 'Invalidez y vida', patron: sbc * 0.0175 * d, obrero: sbc * 0.00625 * d },
    { rama: 'Riesgos de trabajo', patron: sbc * (primaRiesgo / 100) * d, obrero: 0 },
    { rama: 'Guarderías y prestaciones sociales', patron: sbc * 0.01 * d, obrero: 0 },
    { rama: 'Retiro (SAR)', patron: sbc * 0.02 * d, obrero: 0 },
    { rama: `Cesantía y vejez (${ceav.etiqueta})`, patron: sbc * ceav.tasa * d, obrero: sbc * 0.01125 * d },
    { rama: 'Infonavit', patron: sbc * 0.05 * d, obrero: 0 },
  ]
  // Art. 36 LSS: quien percibe el salario mínimo no paga cuota obrera; la cubre el patrón.
  if (salarioMinimo) {
    for (const f of filas) {
      f.patron += f.obrero
      f.obrero = 0
    }
  }
  const totalPatron = filas.reduce((s, f) => s + f.patron, 0)
  const totalObrero = filas.reduce((s, f) => s + f.obrero, 0)
  return { sbc, topado: sbcDiario > TOPE_SBC_DIARIO, ceav, filas, totalPatron, totalObrero, total: totalPatron + totalObrero }
}

// ── Pensión por cesantía o vejez, Ley del Seguro Social de 1973 (arts. 167, 168, 171 y transitorios) ──
// Grupo de salario en veces el salario mínimo: [límite superior, cuantía básica %, incremento anual %].
export const TABLA_ART_167 = [
  [1.0, 80.0, 0.563], [1.25, 77.11, 0.814], [1.5, 58.18, 1.178], [1.75, 49.23, 1.43], [2.0, 42.67, 1.615],
  [2.25, 37.65, 1.756], [2.5, 33.68, 1.868], [2.75, 30.48, 1.958], [3.0, 27.83, 2.033], [3.25, 25.6, 2.096],
  [3.5, 23.7, 2.149], [3.75, 22.07, 2.195], [4.0, 20.65, 2.235], [4.25, 19.39, 2.271], [4.5, 18.29, 2.302],
  [4.75, 17.3, 2.33], [5.0, 16.41, 2.355], [5.25, 15.61, 2.377], [5.5, 14.88, 2.398], [5.75, 14.22, 2.416],
  [6.0, 13.62, 2.433], [Infinity, 13.0, 2.45],
]
export const FACTOR_EDAD = { 60: 0.75, 61: 0.8, 62: 0.85, 63: 0.9, 64: 0.95, 65: 1 }
// Modalidad 40 en 2026: invalidez y vida 2.375% + cesantía y vejez 8.638% + gastos médicos
// de pensionados 1.425% + retiro 2%.
export const TASA_MODALIDAD_40_2026 = 0.14438

export function calcularPensionLey73({ semanas, salarioPromedio, edad, conyuge = false, hijos = 0 }) {
  if (semanas < 500) return { error: 'Se necesitan al menos 500 semanas cotizadas para pensionarse por la Ley 73.' }
  const salario = Math.min(salarioPromedio, TOPE_SBC_DIARIO)
  const veces = salario / SM_GENERAL_2026
  const [, basica, incremento] = TABLA_ART_167.find((r) => veces <= r[0])
  const excedentes = semanas - 500
  let aniosIncremento = Math.floor(excedentes / 52)
  const resto = excedentes % 52
  if (resto > 26) aniosIncremento += 1
  else if (resto >= 13) aniosIncremento += 0.5
  const porcentaje = basica + incremento * aniosIncremento
  const cuantia = (salario * porcentaje) / 100
  // Asignaciones familiares (art. 164): 15% cónyuge, 10% por hijo; sin beneficiarios, 15% de ayuda asistencial.
  const pctAsignaciones = conyuge || hijos > 0 ? (conyuge ? 15 : 0) + 10 * hijos : 15
  // Art. 169: la cuantía más asignaciones no puede superar el salario promedio (salvo que la cuantía sola lo haga).
  const conAsignaciones = Math.min(cuantia * (1 + pctAsignaciones / 100), Math.max(salario, cuantia))
  const factorEdad = FACTOR_EDAD[Math.min(65, Math.max(60, edad))]
  // Incremento del 11% (decreto de 2004, art. 14 transitorio).
  const diaria = conAsignaciones * factorEdad * 1.11
  const pensionDiaria = Math.max(diaria, SM_GENERAL_2026)
  return {
    salario, veces, basica, incremento, aniosIncremento, porcentaje, pctAsignaciones, factorEdad,
    pensionMensual: pensionDiaria * 30.4, pensionMinimaAplicada: diaria < SM_GENERAL_2026,
  }
}

export function simularModalidad40({ semanasActuales, salarioPromedioActual, salarioM40, meses, edad, conyuge, hijos }) {
  const sbc40 = Math.min(salarioM40, TOPE_SBC_DIARIO)
  const semanas40 = Math.round((meses * 52) / 12)
  const reemplazo = Math.min(semanas40, 250)
  const nuevoPromedio = (reemplazo * sbc40 + (250 - reemplazo) * salarioPromedioActual) / 250
  const sin = calcularPensionLey73({ semanas: semanasActuales, salarioPromedio: salarioPromedioActual, edad, conyuge, hijos })
  const con = calcularPensionLey73({ semanas: semanasActuales + semanas40, salarioPromedio: nuevoPromedio, edad, conyuge, hijos })
  const pagoMensual = sbc40 * 30.4 * TASA_MODALIDAD_40_2026
  const inversion = pagoMensual * meses
  const ganancia = con.error ? 0 : con.pensionMensual - (sin.error ? 0 : sin.pensionMensual)
  return { sbc40, semanas40, nuevoPromedio, sin, con, pagoMensual, inversion, ganancia, recuperacionMeses: ganancia > 0 ? inversion / ganancia : null }
}

// ── Semanas cotizadas ──
// Ley 97 (reforma de 2020): 750 semanas en 2021, +25 por año hasta 1,000 en 2031.
export function semanasRequeridasLey97(anio) {
  return Math.min(1000, Math.max(750, 750 + 25 * (anio - 2021)))
}

export function contarSemanasPeriodos(periodos) {
  const rangos = periodos
    .map(({ inicio, fin }) => [Date.parse(inicio + 'T00:00:00Z'), Date.parse(fin + 'T00:00:00Z')])
    .filter(([a, b]) => !isNaN(a) && !isNaN(b) && b >= a)
    .sort((x, y) => x[0] - y[0])
  const unidos = []
  for (const r of rangos) {
    const ultimo = unidos[unidos.length - 1]
    if (ultimo && r[0] <= ultimo[1] + 86400000) ultimo[1] = Math.max(ultimo[1], r[1])
    else unidos.push([...r])
  }
  const dias = unidos.reduce((s, [a, b]) => s + (b - a) / 86400000 + 1, 0)
  const diasBrutos = rangos.reduce((s, [a, b]) => s + (b - a) / 86400000 + 1, 0)
  return { dias, semanas: Math.floor(dias / 7), traslapeDias: diasBrutos - dias, periodos: unidos.length }
}

// ── Horas extra (arts. 66, 67 y 68 LFT; exención del art. 93 fr. I LISR) ──
export const JORNADAS = [
  { id: 'diurna', label: 'Diurna (8 horas)', horas: 8 },
  { id: 'mixta', label: 'Mixta (7.5 horas)', horas: 7.5 },
  { id: 'nocturna', label: 'Nocturna (7 horas)', horas: 7 },
]

export function calcularHorasExtra({ salarioDiario, horasJornada, horasExtraSemana, ganaSalarioMinimo = false }) {
  const valorHora = salarioDiario / horasJornada
  const dobles = Math.min(horasExtraSemana, 9)
  const triples = Math.max(0, horasExtraSemana - 9)
  const pagoDobles = dobles * valorHora * 2
  const pagoTriples = triples * valorHora * 3
  const topeExento = 5 * UMA_DIARIA_2026
  const exento = ganaSalarioMinimo ? pagoDobles : Math.min(pagoDobles * 0.5, topeExento)
  const total = pagoDobles + pagoTriples
  return { valorHora, dobles, triples, pagoDobles, pagoTriples, total, exento, gravado: total - exento, topeExento }
}

// ── ISR del aguinaldo: exención de 30 UMA (art. 93 fr. XIV LISR) y dos métodos de retención ──
export const EXENCION_AGUINALDO = 30 * UMA_DIARIA_2026

export function calcularISRAguinaldo({ aguinaldo, sueldoMensual, isrMensual }) {
  const exento = Math.min(aguinaldo, EXENCION_AGUINALDO)
  const gravado = Math.max(0, aguinaldo - EXENCION_AGUINALDO)
  const base = isrMensual(sueldoMensual)
  // Art. 96 LISR: el aguinaldo gravado se suma al sueldo del mes.
  const isr96 = Math.max(0, isrMensual(sueldoMensual + gravado) - base)
  // Art. 174 RLISR: tasa efectiva sobre la parte mensualizada del aguinaldo.
  const proporcional = (gravado / 365) * 30.4
  const diferencia = isrMensual(sueldoMensual + proporcional) - base
  const tasa = proporcional > 0 ? diferencia / proporcional : 0
  const isr174 = gravado * tasa
  return { exento, gravado, isr96, isr174, tasa174: tasa, proporcional, mejor: isr174 < isr96 ? '174' : '96' }
}

// ── Finiquito y liquidación (LFT arts. 48, 50, 76, 79, 80, 87, 162, 485 y 486; exenciones del art. 93 LISR) ──
export const MOTIVOS_SALIDA = [
  { id: 'renuncia', label: 'Renuncia voluntaria' },
  { id: 'injustificado', label: 'Despido injustificado' },
  { id: 'justificado', label: 'Despido justificado o fin de contrato' },
]
export const EXENCION_INDEMNIZACION_POR_ANIO = 90 * UMA_DIARIA_2026

const diasEntre = (desde, hasta) => Math.round((parseISO(hasta).t - parseISO(desde).t) / 86400000) + 1

export function calcularFiniquitoMX({
  salarioDiario,
  fechaIngreso,
  fechaSalida,
  motivo,
  diasSalarioPendientes = 0,
  vacacionesPendientes = 0,
  diasAguinaldo = 15,
  porcentajePrima = 25,
  zonaFrontera = false,
  incluir20Dias = false,
}) {
  const anios = aniosCumplidosEntre(fechaIngreso, fechaSalida)
  const diasServicio = diasEntre(fechaIngreso, fechaSalida)
  const aniosConFraccion = diasServicio / 365

  // Aguinaldo proporcional (art. 87): días trabajados del año calendario de la salida.
  const inicioAnio = `${fechaSalida.slice(0, 4)}-01-01`
  const desdeAguinaldo = fechaIngreso > inicioAnio ? fechaIngreso : inicioAnio
  const diasAnio = diasEntre(desdeAguinaldo, fechaSalida)
  const aguinaldoDias = (diasAguinaldo * diasAnio) / 365

  // Vacaciones (arts. 76 y 79): las del año en curso en proporción + las pendientes de años cumplidos.
  const { proporcionales } = calcularVacaciones({ fechaIngreso, fechaReferencia: fechaSalida })
  const vacacionesDias = proporcionales + vacacionesPendientes

  const conceptos = [
    { id: 'salario', label: 'Salario pendiente', dias: diasSalarioPendientes },
    { id: 'aguinaldo', label: 'Aguinaldo proporcional', dias: aguinaldoDias },
    { id: 'vacaciones', label: 'Vacaciones no disfrutadas', dias: vacacionesDias },
  ].map((c) => ({ ...c, monto: c.dias * salarioDiario }))
  const vacaciones = conceptos.find((c) => c.id === 'vacaciones').monto
  conceptos.push({ id: 'prima', label: `Prima vacacional (${porcentajePrima}%)`, monto: vacaciones * (porcentajePrima / 100) })

  // Prima de antigüedad (art. 162): 12 días por año con salario topado al doble del mínimo (arts. 485 y 486).
  // Por renuncia solo procede con 15 años o más; por despido, siempre.
  const salarioMinimo = zonaFrontera ? SM_FRONTERA_2026 : SM_GENERAL_2026
  const salarioPrima = Math.min(Math.max(salarioDiario, salarioMinimo), 2 * salarioMinimo)
  const procedePrima = motivo !== 'renuncia' || anios >= 15
  if (procedePrima) {
    conceptos.push({ id: 'antiguedad', label: 'Prima de antigüedad (12 días por año)', dias: 12 * aniosConFraccion, monto: 12 * aniosConFraccion * salarioPrima, liquidacion: true })
  }

  // Indemnización por despido injustificado (arts. 48 y 50), con el salario diario integrado.
  let sdi = null
  if (motivo === 'injustificado') {
    sdi = calcularSDI({ salarioDiario, diasAguinaldo, diasVacaciones: diasVacacionesPorAntiguedad(Math.max(1, anios + 1)), porcentajePrima }).sdi
    conceptos.push({ id: 'tres-meses', label: 'Indemnización constitucional (90 días de SDI)', dias: 90, monto: 90 * sdi, liquidacion: true })
    if (incluir20Dias) {
      conceptos.push({ id: 'veinte-dias', label: '20 días de SDI por año de servicio', dias: 20 * aniosConFraccion, monto: 20 * aniosConFraccion * sdi, liquidacion: true })
    }
  }

  const finiquito = conceptos.filter((c) => !c.liquidacion).reduce((s, c) => s + c.monto, 0)
  const liquidacion = conceptos.filter((c) => c.liquidacion).reduce((s, c) => s + c.monto, 0)
  const exencionSeparacion = EXENCION_INDEMNIZACION_POR_ANIO * Math.max(1, Math.round(aniosConFraccion))
  return {
    anios, diasServicio, aniosConFraccion, diasAnio, conceptos, finiquito, liquidacion, total: finiquito + liquidacion,
    sdi, salarioPrima, procedePrima, salarioMinimo,
    exenciones: {
      aguinaldo: Math.min(conceptos.find((c) => c.id === 'aguinaldo').monto, EXENCION_AGUINALDO),
      prima: Math.min(conceptos.find((c) => c.id === 'prima').monto, EXENCION_PRIMA_VACACIONAL),
      separacion: Math.min(liquidacion, exencionSeparacion),
    },
  }
}
