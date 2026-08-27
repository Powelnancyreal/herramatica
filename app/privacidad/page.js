import Link from 'next/link'

export const metadata = {
  title: 'Política de Privacidad | Herramatica',
  description:
    'Conoce cómo Herramatica recopila, utiliza y protege tus datos personales. Información sobre cookies, servicios de terceros y tus derechos como usuario.',
  alternates: { canonical: 'https://herramatica.com/privacidad' },
}

export default function PrivacidadPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-blue-600">Inicio</Link></li>
          <li className="text-gray-300">/</li>
          <li className="text-gray-700 font-medium">Privacidad</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">🔒</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Política de Privacidad</h1>
        </div>
        <p className="text-gray-600 text-lg">Última actualización: 2025</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-8">
        <section>
          <p className="text-gray-700 leading-relaxed">
            En Herramatica (herramatica.com) nos tomamos muy en serio la privacidad de nuestros usuarios.
            Esta Política de Privacidad explica qué información recopilamos, cómo la utilizamos y qué
            derechos tienes en relación con tus datos personales al usar nuestro sitio web y nuestras
            herramientas online gratuitas.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Recopilación y uso de datos</h2>
          <p className="text-gray-700 leading-relaxed">
            La gran mayoría de las herramientas disponibles en Herramatica funcionan directamente en tu
            navegador (del lado del cliente). Esto significa que los datos que introduces en nuestras
            calculadoras, generadores y utilidades de texto no se envían ni se almacenan en nuestros
            servidores, salvo que se indique expresamente lo contrario en la propia herramienta.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            Podemos recopilar de forma automática cierta información técnica no identificativa, como el
            tipo de navegador, el dispositivo utilizado, las páginas visitadas y el tiempo de permanencia
            en el sitio, con el fin de mejorar el funcionamiento y la experiencia de uso de Herramatica.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Uso de cookies</h2>
          <p className="text-gray-700 leading-relaxed">
            Herramatica puede utilizar cookies propias y de terceros para mejorar la experiencia de
            navegación, recordar tus preferencias y analizar el uso del sitio. Puedes consultar información
            detallada en nuestra{' '}
            <Link href="/cookies" className="text-blue-600 hover:underline">
              Política de Cookies
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">3. Servicios de terceros</h2>
          <p className="text-gray-700 leading-relaxed">
            Es posible que utilicemos servicios de terceros, como Google Analytics, para analizar el tráfico
            y el comportamiento de los usuarios en nuestro sitio de forma anónima y agregada. Estos servicios
            pueden instalar sus propias cookies y recopilar datos conforme a sus propias políticas de
            privacidad. Te recomendamos consultar la política de privacidad de Google para más información
            sobre cómo tratan los datos.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            No vendemos, alquilamos ni compartimos tus datos personales con terceros con fines comerciales.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Tus derechos</h2>
          <p className="text-gray-700 leading-relaxed">
            Como usuario, tienes derecho a acceder, rectificar, cancelar y oponerte al tratamiento de tus
            datos personales, así como a solicitar la limitación o portabilidad de los mismos, en la medida
            en que Herramatica trate dicha información. Para ejercer cualquiera de estos derechos, puedes
            ponerte en contacto con nosotros a través del correo electrónico indicado a continuación.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Seguridad de la información</h2>
          <p className="text-gray-700 leading-relaxed">
            Adoptamos medidas técnicas y organizativas razonables para proteger la información que
            eventualmente pudiéramos recopilar frente a accesos no autorizados, pérdida o alteración.
            Ninguna transmisión de datos por Internet puede garantizarse como 100% segura, por lo que no
            podemos asegurar una seguridad absoluta.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Cambios en esta política</h2>
          <p className="text-gray-700 leading-relaxed">
            Podemos actualizar esta Política de Privacidad ocasionalmente para reflejar cambios en nuestras
            prácticas o por motivos legales. Te recomendamos revisar esta página periódicamente para estar
            informado de cualquier actualización.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Contacto</h2>
          <p className="text-gray-700 leading-relaxed">
            Si tienes alguna pregunta sobre esta Política de Privacidad o sobre el tratamiento de tus datos,
            puedes escribirnos a{' '}
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
