// Promedios ponderados de calificaciones: nota de un curso por evaluaciones y promedio de un ciclo por créditos.

// evaluaciones: [{ nombre, peso (en %), nota (número o null si aún no se rinde) }]
export function notaPorEvaluaciones(evaluaciones, { minimo, maximo, aprobatoria }) {
  const pesoTotal = evaluaciones.reduce((s, e) => s + e.peso, 0)
  const rendidas = evaluaciones.filter((e) => e.nota !== null)
  const pesoRendido = rendidas.reduce((s, e) => s + e.peso, 0)
  const acumulado = rendidas.reduce((s, e) => s + (e.nota * e.peso) / 100, 0)
  const pesoPendiente = pesoTotal - pesoRendido
  // Nota mínima que hace falta en promedio en las evaluaciones pendientes para llegar a la aprobatoria.
  const necesaria = pesoPendiente > 0 ? ((aprobatoria - acumulado) * 100) / pesoPendiente : null
  return {
    pesoTotal,
    pesoRendido,
    pesoPendiente,
    acumulado,
    final: pesoPendiente === 0 ? acumulado : null,
    necesaria,
    imposible: necesaria !== null && necesaria > maximo,
    asegurada: necesaria !== null && necesaria <= minimo,
  }
}

// cursos: [{ nombre, nota, creditos }]
export function promedioPorCreditos(cursos, aprobatoria) {
  const creditos = cursos.reduce((s, c) => s + c.creditos, 0)
  const suma = cursos.reduce((s, c) => s + c.nota * c.creditos, 0)
  const aprobados = cursos.filter((c) => c.nota >= aprobatoria).reduce((s, c) => s + c.creditos, 0)
  return { creditos, suma, promedio: creditos ? suma / creditos : 0, creditosAprobados: aprobados }
}

// Redondeo de la nota: las fracciones de 0.5 o más suben (con un margen para errores de coma flotante).
export const redondear = (nota, decimales = 0) => {
  const f = 10 ** decimales
  return Math.floor(nota * f + 0.5 + 1e-9) / f
}
