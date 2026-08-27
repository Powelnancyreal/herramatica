import Link from 'next/link'

export const metadata = {
  title: 'Términos y Condiciones | Herramatica',
  description:
    'Términos y condiciones de uso de Herramatica. Conoce las normas que rigen el uso de nuestras herramientas online gratuitas.',
  alternates: { canonical: 'https://herramatica.com/terminos' },
}

export default function TerminosPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-blue-600">Inicio</Link></li>
          <li className="text-gray-300">/</li>
          <li className="text-gray-700 font-medium">Términos</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">📄</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Términos y Condiciones</h1>
        </div>
        <p className="text-gray-600 text-lg">Última actualización: 2025</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-8">
        <section>
          <p className="text-gray-700 leading-relaxed">
            Estos Términos y Condiciones regulan el acceso y uso del sitio web Herramatica (herramatica.com),
            así como de todas las herramientas y servicios online que ofrecemos. Al acceder o utilizar
            nuestro sitio, aceptas quedar vinculado por estos términos en su totalidad.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Aceptación de los términos</h2>
          <p className="text-gray-700 leading-relaxed">
            El uso de Herramatica implica la aceptación plena y sin reservas de todas y cada una de las
            disposiciones incluidas en estos Términos y Condiciones. Si no estás de acuerdo con alguno de
            los términos aquí descritos, te pedimos que no utilices el sitio ni sus herramientas.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Uso de las herramientas y servicios</h2>
          <p className="text-gray-700 leading-relaxed">
            Herramatica ofrece un conjunto de herramientas online gratuitas (calculadoras, generadores,
            utilidades de texto, convertidores, juegos, entre otras) para uso personal y no comercial. Te
            comprometes a utilizar estas herramientas de forma lícita, sin infringir derechos de terceros y
            sin realizar un uso que pueda dañar, sobrecargar o perjudicar el funcionamiento del sitio.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            Nos reservamos el derecho de modificar, suspender o discontinuar, temporal o permanentemente,
            cualquier herramienta o funcionalidad del sitio, con o sin previo aviso.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">3. Propiedad intelectual</h2>
          <p className="text-gray-700 leading-relaxed">
            Todos los contenidos presentes en Herramatica, incluyendo pero no limitado a textos, diseño,
            código fuente, logotipos, gráficos e imágenes, son propiedad de Herramatica o de sus respectivos
            titulares y están protegidos por las leyes de propiedad intelectual aplicables. Queda prohibida
            la reproducción, distribución o modificación total o parcial del sitio sin autorización previa
            por escrito.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Limitación de responsabilidad</h2>
          <p className="text-gray-700 leading-relaxed">
            Las herramientas de Herramatica se ofrecen "tal cual" y "según disponibilidad", sin garantías de
            ningún tipo, ya sean expresas o implícitas. Aunque nos esforzamos por ofrecer resultados precisos
            y actualizados, no garantizamos que los cálculos, conversiones o contenidos generados estén
            siempre libres de errores.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            Herramatica no será responsable de ningún daño directo, indirecto, incidental o consecuente que
            resulte del uso o la imposibilidad de uso de nuestras herramientas y servicios. El uso del sitio
            y de sus herramientas es bajo tu propia responsabilidad y criterio.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Ley aplicable</h2>
          <p className="text-gray-700 leading-relaxed">
            Estos Términos y Condiciones están redactados de forma general para poder aplicarse a los
            usuarios de habla hispana en cualquier país. En caso de conflicto, se procurará aplicar los
            principios generales del derecho reconocidos en la mayoría de los países de habla hispana,
            buscando siempre una resolución razonable y de buena fe entre las partes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Modificaciones</h2>
          <p className="text-gray-700 leading-relaxed">
            Podemos actualizar estos Términos y Condiciones en cualquier momento. Las modificaciones entrarán
            en vigor desde el momento de su publicación en esta página. El uso continuado del sitio tras la
            publicación de cambios implica la aceptación de los nuevos términos.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Contacto</h2>
          <p className="text-gray-700 leading-relaxed">
            Si tienes alguna duda sobre estos Términos y Condiciones, puedes escribirnos a{' '}
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
