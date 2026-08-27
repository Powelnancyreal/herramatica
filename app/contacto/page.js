import Link from 'next/link'

export const metadata = {
  title: 'Contacto | Herramatica',
  description:
    'Ponte en contacto con el equipo de Herramatica. Escríbenos a info@herramatica.com para sugerencias, dudas o reportar un problema.',
  alternates: { canonical: 'https://herramatica.com/contacto' },
}

export default function ContactoPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-blue-600">Inicio</Link></li>
          <li className="text-gray-300">/</li>
          <li className="text-gray-700 font-medium">Contacto</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="text-4xl">✉️</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Contacto</h1>
        </div>
        <p className="text-gray-600 text-lg max-w-xl mx-auto">
          ¿Tienes alguna pregunta, sugerencia o encontraste un problema con alguna herramienta? Escríbenos,
          nos encantará ayudarte.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-10 text-center">
        <p className="text-gray-600 mb-2">Puedes contactarnos directamente por correo electrónico:</p>
        <a
          href="mailto:info@herramatica.com"
          className="inline-block text-xl sm:text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          info@herramatica.com
        </a>
        <p className="text-gray-500 text-sm mt-6">
          Intentamos responder todos los mensajes en el menor tiempo posible. Gracias por usar Herramatica.
        </p>
      </div>
    </main>
  )
}
