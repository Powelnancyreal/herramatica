import Link from 'next/link'
import { generateBreadcrumbSchema } from '@/lib/schema'
import { EMAIL } from '@/components/LegalLayout'
import { FACEBOOK_URL, REDES } from '@/lib/redes'

const URL = 'https://herramatica.com/contacto'

export const metadata = {
  title: 'Contacto | Herramatica',
  description:
    'Escríbenos a info@herramatica.com para avisar de un error en una herramienta, proponer una nueva, ejercer tus derechos de privacidad o colaborar.',
  alternates: { canonical: URL },
}

const mailto = (asunto, cuerpo) => `mailto:${EMAIL}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`

const MOTIVOS = [
  {
    titulo: 'Avisar de un error',
    texto: 'Un resultado que no cuadra con tu recibo o con una tabla oficial, un texto confuso o algo que no funciona en tu móvil.',
    asunto: 'Error en una herramienta',
    cuerpo: 'Enlace de la herramienta:\nDatos que usé:\nResultado que obtuve:\nResultado que esperaba (y de dónde sale):\nNavegador y dispositivo:\n',
  },
  {
    titulo: 'Proponer una herramienta',
    texto: 'Un cálculo de tu país que no encuentras o una utilidad que usarías a menudo. Cuéntanos para qué la necesitas.',
    asunto: 'Propuesta de herramienta',
    cuerpo: 'Qué herramienta necesito:\nPaís (si aplica):\nPara qué la usaría:\n',
  },
  {
    titulo: 'Privacidad y datos',
    texto: 'Preguntas sobre cómo tratamos los datos o solicitudes de acceso, rectificación o eliminación.',
    asunto: 'Privacidad',
    cuerpo: '',
  },
  {
    titulo: 'Colaboraciones y prensa',
    texto: 'Medios, docentes, organizaciones o sitios que quieran citar, enlazar o colaborar con Herramatica.',
    asunto: 'Colaboración',
    cuerpo: '',
  },
]

export default function ContactoPage() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contacto',
      url: URL,
      inLanguage: 'es',
      mainEntity: {
        '@type': 'Organization',
        name: 'Herramatica',
        url: 'https://herramatica.com',
        email: EMAIL,
        sameAs: REDES.map((r) => r.url),
        contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', email: EMAIL, availableLanguage: 'Spanish' },
      },
    },
    generateBreadcrumbSchema([
      { name: 'Inicio', url: 'https://herramatica.com' },
      { name: 'Contacto', url: URL },
    ]),
  ]

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <nav className="text-sm text-gray-500 mb-6" aria-label="Ruta de navegación">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-blue-600">Inicio</Link></li>
          <li className="text-gray-300">/</li>
          <li className="text-gray-700 font-medium">Contacto</li>
        </ol>
      </nav>

      <header className="max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Contacto</h1>
        <p className="mt-4 text-lg text-gray-700 leading-relaxed">
          Somos un equipo pequeño y leemos todos los mensajes. La forma más rápida de llegar a nosotros es el correo electrónico.
        </p>
      </header>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div>
          <p className="text-sm text-gray-500">Correo electrónico</p>
          <a href={`mailto:${EMAIL}`} className="mt-1 block text-2xl sm:text-3xl font-bold text-blue-600 hover:text-blue-700 break-all">{EMAIL}</a>
          <p className="mt-2 text-sm text-gray-600">Respondemos en español, normalmente en pocos días hábiles.</p>
        </div>
        <a href={`mailto:${EMAIL}`} className="mt-5 sm:mt-0 inline-block shrink-0 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
          Escribir un correo
        </a>
      </div>

      <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div>
          <p className="text-sm text-gray-500">Redes sociales</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">Herramatica en Facebook</p>
          <p className="mt-1 text-sm text-gray-600">Novedades, herramientas nuevas y avisos cuando cambian cifras como la UMA o el salario mínimo.</p>
        </div>
        <a href={FACEBOOK_URL} target="_blank" rel="me noopener noreferrer" className="mt-5 sm:mt-0 inline-block shrink-0 rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-800 hover:border-blue-300 hover:text-blue-700">
          Ir a Facebook
        </a>
      </div>

      <section className="mt-12" aria-labelledby="motivos">
        <h2 id="motivos" className="text-2xl font-bold text-gray-900">¿Sobre qué quieres escribirnos?</h2>
        <p className="mt-2 text-gray-600">Elige un motivo y se abrirá tu correo con el asunto y una pequeña guía ya escritos.</p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {MOTIVOS.map((m) => (
            <li key={m.titulo}>
              <a href={mailto(m.asunto, m.cuerpo)} className="group block h-full rounded-2xl border border-gray-200 bg-white p-5 hover:border-blue-300 hover:shadow-md transition-all">
                <span className="font-semibold text-gray-900 group-hover:text-blue-700">{m.titulo}</span>
                <span className="mt-2 block text-sm text-gray-600 leading-relaxed">{m.texto}</span>
                <span className="mt-3 block text-sm font-medium text-blue-600">Escribir sobre esto →</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 rounded-2xl bg-gray-50 p-6 sm:p-8" aria-labelledby="consejos">
        <h2 id="consejos" className="text-xl font-bold text-gray-900">Para que podamos ayudarte mejor</h2>
        <ul className="mt-4 space-y-2 text-gray-700 list-disc pl-6">
          <li>Si nos avisas de un error, incluye el enlace de la herramienta y los datos que usaste: así podemos reproducirlo.</li>
          <li>No nos envíes contraseñas, números de cuenta ni documentos de identidad. Nunca te los pediremos.</li>
          <li>No damos asesoría legal, fiscal ni médica personalizada, pero sí te explicamos cómo funciona cualquier cálculo del sitio.</li>
        </ul>
        <p className="mt-4 text-sm text-gray-600">
          Lo que nos escribas se trata según nuestra <Link href="/privacidad" className="text-blue-600 underline underline-offset-2">política de privacidad</Link>.
          ¿Quieres saber quiénes somos? Visita <Link href="/acerca" className="text-blue-600 underline underline-offset-2">Acerca de Herramatica</Link>.
        </p>
      </section>
    </main>
  )
}
