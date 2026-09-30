// Tasa metabólica basal (kcal/día). Peso en kg, altura en cm, edad en años.
export function tmbMifflin({ sexo, peso, altura, edad }) {
  return 10 * peso + 6.25 * altura - 5 * edad + (sexo === 'hombre' ? 5 : -161)
}

// Harris-Benedict revisada por Roza y Shizgal (1984).
export function tmbHarrisBenedict({ sexo, peso, altura, edad }) {
  return sexo === 'hombre'
    ? 88.362 + 13.397 * peso + 4.799 * altura - 5.677 * edad
    : 447.593 + 9.247 * peso + 3.098 * altura - 4.33 * edad
}

// Katch-McArdle: requiere el porcentaje de grasa corporal.
export function tmbKatchMcArdle({ peso, grasaPct }) {
  return 370 + 21.6 * peso * (1 - grasaPct / 100)
}

export const NIVELES_ACTIVIDAD = [
  { id: 'sedentario', label: 'Sedentario (poco o ningún ejercicio)', factor: 1.2 },
  { id: 'ligero', label: 'Ligero (1-3 días de ejercicio por semana)', factor: 1.375 },
  { id: 'moderado', label: 'Moderado (3-5 días por semana)', factor: 1.55 },
  { id: 'intenso', label: 'Intenso (6-7 días por semana)', factor: 1.725 },
  { id: 'muy-intenso', label: 'Muy intenso (trabajo físico o doble sesión)', factor: 1.9 },
]

// Método de la Marina de EE. UU. (Hodgdon y Beckett), medidas en cm.
export function grasaMarinaEEUU({ sexo, altura, cuello, cintura, cadera }) {
  if (sexo === 'hombre') {
    if (cintura <= cuello) return null
    return 495 / (1.0324 - 0.19077 * Math.log10(cintura - cuello) + 0.15456 * Math.log10(altura)) - 450
  }
  if (cintura + cadera <= cuello) return null
  return 495 / (1.29579 - 0.35004 * Math.log10(cintura + cadera - cuello) + 0.221 * Math.log10(altura)) - 450
}

// Estimación de Deurenberg a partir del IMC (menos precisa, útil sin cinta métrica).
export function grasaDeurenberg({ sexo, peso, altura, edad }) {
  const imc = peso / Math.pow(altura / 100, 2)
  return 1.2 * imc + 0.23 * edad - 10.8 * (sexo === 'hombre' ? 1 : 0) - 5.4
}

// Rangos del American Council on Exercise (ACE).
export function categoriaGrasa(sexo, pct) {
  const cortes = sexo === 'hombre' ? [2, 6, 14, 18, 25] : [10, 14, 21, 25, 32]
  if (pct < cortes[0]) return 'Por debajo de la grasa esencial'
  if (pct < cortes[1]) return 'Grasa esencial'
  if (pct < cortes[2]) return 'Atleta'
  if (pct < cortes[3]) return 'Forma física'
  if (pct < cortes[4]) return 'Promedio'
  return 'Obesidad'
}

// Ciclo menstrual: ovulación ≈ inicio del siguiente periodo − fase lútea (≈14 días).
export function calcularCiclos({ ultimaRegla, duracionCiclo, faseLutea = 14, ciclos = 3 }) {
  const DIA = 86400000
  const inicio = new Date(ultimaRegla + 'T00:00:00Z').getTime()
  return Array.from({ length: ciclos }, (_, k) => {
    const inicioCiclo = inicio + k * duracionCiclo * DIA
    const ovulacion = inicioCiclo + (duracionCiclo - faseLutea) * DIA
    return {
      inicioCiclo: new Date(inicioCiclo),
      fertilInicio: new Date(ovulacion - 5 * DIA),
      ovulacion: new Date(ovulacion),
      fertilFin: new Date(ovulacion + DIA),
      siguienteRegla: new Date(inicioCiclo + duracionCiclo * DIA),
    }
  })
}

// Agua: 35 ml por kg como base, + ejercicio (~0.6 L por hora), + clima caluroso, embarazo o lactancia (EFSA).
export function calcularAgua({ peso, minutosEjercicio = 0, calor = false, condicion = 'ninguna' }) {
  const base = peso * 35
  const ejercicio = (minutosEjercicio / 60) * 600
  const clima = calor ? 500 : 0
  const extra = condicion === 'embarazo' ? 300 : condicion === 'lactancia' ? 700 : 0
  const totalMl = base + ejercicio + clima + extra
  return { base, ejercicio, clima, extra, totalMl, vasos: totalMl / 250 }
}
