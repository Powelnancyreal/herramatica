import Link from 'next/link'

export const metadata = {
  title: 'Página no encontrada',
}

export default function NotFound() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <span className="text-6xl">🔍</span>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-6 mb-3">Página no encontrada</h1>
      <p className="text-gray-600 text-lg max-w-md mx-auto mb-8">
        Lo sentimos, la página que buscas no existe o ha sido movida. Prueba a volver al inicio para
        encontrar la herramienta que necesitas.
      </p>
      <Link
        href="/"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
      >
        Volver al inicio
      </Link>
    </main>
  )
}
