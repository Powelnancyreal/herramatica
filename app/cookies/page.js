import Link from 'next/link'

export const metadata = {
  title: 'Política de Cookies | Herramatica',
  description:
    'Información sobre el uso de cookies en Herramatica: qué son, qué tipos utilizamos y cómo puedes gestionarlas o desactivarlas.',
  alternates: { canonical: 'https://herramatica.com/cookies' },
}

export default function CookiesPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-blue-600">Inicio</Link></li>
          <li className="text-gray-300">/</li>
          <li className="text-gray-700 font-medium">Cookies</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">🍪</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Política de Cookies</h1>
        </div>
        <p className="text-gray-600 text-lg">Última actualización: 2025</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">1. ¿Qué son las cookies?</h2>
          <p className="text-gray-700 leading-relaxed">
            Las cookies son pequeños archivos de texto que los sitios web almacenan en tu navegador o
            dispositivo cuando los visitas. Se utilizan ampliamente para que los sitios web funcionen de
            manera más eficiente, recordar tus preferencias y proporcionar información a los propietarios
            del sitio sobre cómo se utiliza.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Tipos de cookies que utilizamos</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            En Herramatica podemos utilizar los siguientes tipos de cookies:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex gap-3">
              <span className="text-blue-500">•</span>
              <span>
                <strong>Cookies técnicas o necesarias:</strong> imprescindibles para el correcto
                funcionamiento del sitio web y sus herramientas.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-500">•</span>
              <span>
                <strong>Cookies de preferencias:</strong> permiten recordar información para que el sitio se
                comporte de una manera más personalizada, como ajustes o configuraciones previas.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-500">•</span>
              <span>
                <strong>Cookies analíticas:</strong> nos ayudan a entender cómo interactúan los usuarios con
                el sitio (por ejemplo, mediante Google Analytics), de forma agregada y anónima, para mejorar
                nuestros contenidos y herramientas.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-500">•</span>
              <span>
                <strong>Cookies de terceros:</strong> pueden ser instaladas por servicios externos integrados
                en el sitio, como herramientas de análisis o publicidad, sujetas a sus propias políticas de
                privacidad.
              </span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">3. Cómo gestionar las cookies</h2>
          <p className="text-gray-700 leading-relaxed">
            Puedes permitir, bloquear o eliminar las cookies instaladas en tu dispositivo a través de la
            configuración de tu navegador. A continuación, algunos enlaces de ayuda de los navegadores más
            populares:
          </p>
          <ul className="space-y-2 text-gray-700 mt-3">
            <li className="flex gap-3">
              <span className="text-blue-500">•</span>
              <span>Google Chrome: Configuración → Privacidad y seguridad → Cookies</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-500">•</span>
              <span>Mozilla Firefox: Opciones → Privacidad y seguridad → Cookies</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-500">•</span>
              <span>Safari: Preferencias → Privacidad</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-500">•</span>
              <span>Microsoft Edge: Configuración → Cookies y permisos del sitio</span>
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-3">
            Ten en cuenta que desactivar ciertas cookies puede afectar al funcionamiento o a la experiencia
            de uso de algunas herramientas del sitio.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Contacto</h2>
          <p className="text-gray-700 leading-relaxed">
            Si tienes preguntas sobre nuestra Política de Cookies, escríbenos a{' '}
            <a href="mailto:info@herramatica.com" className="text-blue-600 hover:underline">
              info@herramatica.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  )
}
