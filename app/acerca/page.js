import Link from 'next/link'

export const metadata = {
  title: 'Acerca de Nosotros | Herramatica',
  description:
    'Conoce Herramatica: herramientas online gratuitas en español para calcular, generar y transformar contenido, sin registro y desde cualquier dispositivo.',
  alternates: { canonical: 'https://herramatica.com/acerca' },
}

export default function AcercaPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-blue-600">Inicio</Link></li>
          <li className="text-gray-300">/</li>
          <li className="text-gray-700 font-medium">Acerca de</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">⚡</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Acerca de Herramatica</h1>
        </div>
        <p className="text-gray-600 text-lg">
          Herramientas online gratuitas, pensadas para toda la comunidad de habla hispana.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">¿Qué es Herramatica?</h2>
          <p className="text-gray-700 leading-relaxed">
            Herramatica (herramatica.com) es una plataforma de herramientas online gratuitas creada para
            resolver tareas cotidianas de forma rápida, sencilla y sin complicaciones. Desde calculadoras
            precisas hasta generadores de contenido, cada herramienta está diseñada para funcionar
            directamente en tu navegador, sin necesidad de instalar nada ni crear una cuenta.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Nuestra misión</h2>
          <p className="text-gray-700 leading-relaxed">
            Nuestra misión es ofrecer herramientas online gratuitas de calidad para todas las personas de
            habla hispana en el mundo, sin importar el país en el que se encuentren. Creemos que el acceso a
            utilidades digitales prácticas no debería tener barreras de idioma, coste ni registro.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">¿Qué herramientas ofrecemos?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            En Herramatica encontrarás decenas de utilidades organizadas en distintas categorías:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <span className="text-2xl">🔢</span>
              <div>
                <h3 className="font-semibold text-gray-900">Calculadoras</h3>
                <p className="text-sm text-gray-600">
                  Edad, porcentajes, préstamos, impuestos y mucho más.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">✨</span>
              <div>
                <h3 className="font-semibold text-gray-900">Generadores</h3>
                <p className="text-sm text-gray-600">
                  Contraseñas, nombres, códigos QR y texto invisible.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">📝</span>
              <div>
                <h3 className="font-semibold text-gray-900">Herramientas de texto</h3>
                <p className="text-sm text-gray-600">
                  Contador de palabras, conversión de mayúsculas y más.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">🔄</span>
              <div>
                <h3 className="font-semibold text-gray-900">Convertidores</h3>
                <p className="text-sm text-gray-600">
                  Monedas, unidades de medida, imágenes y formatos.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Por qué elegir Herramatica</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex gap-3">
              <span className="text-green-500">✓</span>
              <span>100% gratuito, sin suscripciones ni límites de uso.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-500">✓</span>
              <span>Sin necesidad de registro ni de crear una cuenta.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-500">✓</span>
              <span>Herramientas rápidas y ligeras que funcionan en cualquier navegador.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-500">✓</span>
              <span>Contenido pensado y redactado en español para todos los países hispanohablantes.</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Contacto</h2>
          <p className="text-gray-700 leading-relaxed">
            ¿Tienes sugerencias, comentarios o quieres proponer una nueva herramienta? Escríbenos a{' '}
            <a href="mailto:info@herramatica.com" className="text-blue-600 hover:underline">
              info@herramatica.com
            </a>
            . Nos encantará escucharte.
          </p>
        </section>
      </div>
    </main>
  )
}
