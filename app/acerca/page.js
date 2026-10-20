import Link from 'next/link'
import toolsData from '@/data/tools.json'
import categoriesData from '@/data/categories.json'
import blogData from '@/data/blog.json'
import temas from '@/data/temas-herramientas.json'
import { generateBreadcrumbSchema } from '@/lib/schema'
import { EMAIL } from '@/components/LegalLayout'
import { FACEBOOK_URL, REDES } from '@/lib/redes'

const URL = 'https://herramatica.com/acerca'
const decena = (n) => Math.floor(n / 10) * 10

export const metadata = {
  title: 'Acerca de Herramatica: quiénes somos y cómo trabajamos',
  description:
    'Herramatica crea calculadoras y herramientas gratis en español con la ley y las cifras oficiales de cada país. Cómo las hacemos, verificamos y actualizamos.',
  alternates: { canonical: URL },
}

const PAISES = [
  {
    codigo: 'MX', nombre: 'México', fuentes: 'Ley Federal del Trabajo, SAT, DOF, IMSS e INEGI (UMA)',
    destacadas: [['calcular-aguinaldo', 'Aguinaldo'], ['calculadora-isr', 'ISR'], ['calcular-vacaciones', 'Vacaciones']],
  },
  {
    codigo: 'AR', nombre: 'Argentina', fuentes: 'Ley de Contrato de Trabajo, ARCA, BCRA y convenios colectivos',
    destacadas: [['calcular-indemnizacion-despido', 'Indemnización'], ['calcular-sac-argentina', 'Aguinaldo (SAC)'], ['monotributo', 'Monotributo']],
  },
  {
    codigo: 'CO', nombre: 'Colombia', fuentes: 'Código Sustantivo del Trabajo, DIAN (UVT) y Ministerio del Trabajo',
    destacadas: [['calculadora-liquidacion-laboral-colombia', 'Liquidación'], ['prima-de-servicios', 'Prima'], ['calcular-cesantias', 'Cesantías']],
  },
  {
    codigo: 'CL', nombre: 'Chile', fuentes: 'Código del Trabajo, SII, Dirección del Trabajo y Banco Central (UF y UTM)',
    destacadas: [['sueldo-liquido-chile', 'Sueldo líquido'], ['finiquito-chile', 'Finiquito'], ['uf-a-pesos', 'UF a pesos']],
  },
  {
    codigo: 'PE', nombre: 'Perú', fuentes: 'Ministerio de Trabajo, SUNAT (UIT) y SUNARP',
    destacadas: [['calculadora-cts-peru', 'CTS'], ['calcular-gratificacion-peru', 'Gratificación'], ['renta-quinta-categoria', 'Renta de quinta']],
  },
  {
    codigo: 'ES', nombre: 'España', fuentes: 'Estatuto de los Trabajadores, BOE, Agencia Tributaria y Seguridad Social',
    destacadas: [['calculadora-finiquito', 'Finiquito'], ['calculadora-irpf', 'IRPF'], ['calcular-paro', 'Paro']],
  },
  {
    codigo: 'EC', nombre: 'Ecuador', fuentes: 'Código del Trabajo, SRI e IESS',
    destacadas: [['decimo-tercer-sueldo', 'Décimo tercero'], ['decimo-cuarto-sueldo', 'Décimo cuarto'], ['fondos-de-reserva', 'Fondos de reserva']],
  },
  {
    codigo: 'UY', nombre: 'Uruguay', fuentes: 'BPS y DGI',
    destacadas: [['aguinaldo-uruguay', 'Aguinaldo'], ['irpf-uruguay', 'IRPF']],
  },
]

const PASOS = [
  {
    titulo: 'Partimos de la fuente oficial',
    texto: 'Antes de escribir una línea de código leemos la ley, el reglamento o la tabla publicada: el artículo de la Ley Federal del Trabajo, la tabla de ISR del SAT, la resolución que fija la UVT. Si una cifra no tiene fuente oficial, no entra en la calculadora.',
  },
  {
    titulo: 'Lo probamos con casos reales',
    texto: 'Cada cálculo se contrasta con ejemplos resueltos: el ejemplo oficial de la autoridad cuando existe, recibos de nómina y casos límite como un trabajador con menos de un año de antigüedad o un sueldo en el tope de cotización.',
  },
  {
    titulo: 'Explicamos de dónde sale cada número',
    texto: 'Un resultado sin explicación no sirve para reclamar ni para planificar. Por eso cada herramienta muestra el desglose del cálculo, la fórmula y los supuestos que usa, y la guía que la acompaña lo explica con ejemplos.',
  },
  {
    titulo: 'Lo actualizamos cuando cambia la ley',
    texto: 'Salarios mínimos, UMA, UIT, UVT, tramos de impuestos y valores de índices cambian cada año. Revisamos esas cifras cuando se publican y cada página muestra la fecha de su última actualización.',
  },
]

const COMPROMISOS = [
  ['Gratis de verdad', 'Todas las herramientas son gratuitas y completas. No hay versión de pago ni límite de usos.'],
  ['Sin registro', 'No te pedimos correo, cuenta ni datos personales para usar nada.'],
  ['Privadas por diseño', 'Los cálculos se hacen en tu navegador. No vemos tu sueldo, tus archivos ni lo que escribes.'],
  ['Pensadas para el móvil', 'La mayoría de las consultas llegan desde el teléfono, así que cada herramienta se diseña primero para pantallas pequeñas.'],
  ['Español de cada país', 'Hablamos de aguinaldo, SAC, gratificación o décimo tercero según dónde vivas, con los términos que usa tu recibo.'],
  ['Errores corregidos rápido', 'Si nos avisas de un error, lo revisamos, lo corregimos y lo indicamos con una nueva fecha de actualización.'],
]

export default function AcercaPage() {
  const herramientas = toolsData.length
  const calculadoras = toolsData.filter((t) => t.category === 'calculadoras').length
  const porPais = (codigo) => Object.values(temas).filter((t) => t.includes(codigo)).length
  const existe = new Set(toolsData.map((t) => t.slug))

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: metadata.title,
      description: metadata.description,
      url: URL,
      inLanguage: 'es',
      mainEntity: {
        '@type': 'Organization',
        name: 'Herramatica',
        url: 'https://herramatica.com',
        email: EMAIL,
        sameAs: REDES.map((r) => r.url),
        logo: 'https://herramatica.com/images/logo.svg',
        foundingDate: '2026-08',
        knowsLanguage: 'es',
        contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', email: EMAIL, availableLanguage: 'Spanish' },
      },
    },
    generateBreadcrumbSchema([
      { name: 'Inicio', url: 'https://herramatica.com' },
      { name: 'Acerca de', url: URL },
    ]),
  ]

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Portada */}
      <section className="bg-gradient-to-b from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14">
          <nav className="text-sm text-gray-500 mb-10" aria-label="Ruta de navegación">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-blue-600">Inicio</Link></li>
              <li className="text-gray-300">/</li>
              <li className="text-gray-700 font-medium">Acerca de</li>
            </ol>
          </nav>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Acerca de Herramatica</p>
          <h1 className="mt-3 max-w-3xl text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
            Cuentas claras para todo el mundo hispanohablante
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-gray-700 leading-relaxed">
            Hacemos calculadoras y herramientas gratuitas que usan la ley y las cifras oficiales de tu país, explican cada resultado y
            funcionan en tu navegador sin pedirte ningún dato.
          </p>

          <dl className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200">
            {[
              [`${decena(herramientas)}+`, 'herramientas gratuitas'],
              [`${decena(calculadoras)}+`, 'calculadoras'],
              [String(PAISES.length), 'países con cálculos propios'],
              [String(blogData.length), 'guías paso a paso'],
            ].map(([n, t]) => (
              <div key={t} className="bg-white px-5 py-5">
                <dt className="sr-only">{t}</dt>
                <dd>
                  <span className="block text-3xl font-bold text-gray-900 tabular-nums">{n}</span>
                  <span className="text-sm text-gray-600">{t}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Por qué existe */}
        <section className="py-14 grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Por qué existe Herramatica</h2>
          <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
            <p>
              Buscar «calcular aguinaldo» desde Lima, Bogotá o Montevideo suele llevar a una calculadora hecha para otro país. El
              resultado parece correcto, pero usa otra ley: en México el aguinaldo son 15 días de salario, en Uruguay es la doceava parte
              de lo ganado en el semestre y en Perú ni siquiera se llama así. Un número equivocado puede hacerte aceptar un finiquito
              menor del que te corresponde.
            </p>
            <p>
              Herramatica nace para resolver eso: herramientas en español, construidas país por país, con las cifras oficiales de este
              año y con el cálculo a la vista para que puedas comprobarlo. Y, junto a ellas, utilidades para el día a día, desde
              convertir unidades hasta contar palabras, hechas con el mismo cuidado.
            </p>
          </div>
        </section>

        {/* Cómo trabajamos */}
        <section className="py-14 border-t border-gray-100" aria-labelledby="como-trabajamos">
          <h2 id="como-trabajamos" className="text-2xl sm:text-3xl font-bold text-gray-900">Cómo hacemos cada herramienta</h2>
          <p className="mt-3 max-w-2xl text-gray-600 text-lg">El mismo proceso para una calculadora de finiquito que para un conversor de unidades.</p>
          <ol className="mt-10 grid gap-6 sm:grid-cols-2">
            {PASOS.map((p, i) => (
              <li key={p.titulo} className="relative rounded-2xl border border-gray-200 bg-white p-6">
                <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold">{i + 1}</span>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{p.titulo}</h3>
                <p className="mt-2 text-gray-600 leading-relaxed">{p.texto}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Países */}
        <section className="py-14 border-t border-gray-100" aria-labelledby="paises">
          <h2 id="paises" className="text-2xl sm:text-3xl font-bold text-gray-900">Hechas para cada país</h2>
          <p className="mt-3 max-w-2xl text-gray-600 text-lg">
            Estas son las fuentes oficiales con las que construimos las herramientas laborales y fiscales de cada país.
          </p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PAISES.map((p) => (
              <li key={p.codigo} className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5">
                <div className="flex items-center gap-3">
                  <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 text-xs font-bold text-white">{p.codigo}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{p.nombre}</h3>
                    <p className="text-xs text-gray-500">{porPais(p.codigo)} herramientas</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed flex-1">{p.fuentes}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.destacadas.filter(([s]) => existe.has(s)).map(([slug, nombre]) => (
                    <Link key={slug} href={`/${slug}`} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100">
                      {nombre}
                    </Link>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Compromisos */}
        <section className="py-14 border-t border-gray-100" aria-labelledby="compromisos">
          <h2 id="compromisos" className="text-2xl sm:text-3xl font-bold text-gray-900">Lo que puedes esperar de nosotros</h2>
          <dl className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {COMPROMISOS.map(([t, d]) => (
              <div key={t} className="border-l-2 border-blue-600 pl-4">
                <dt className="font-semibold text-gray-900">{t}</dt>
                <dd className="mt-1 text-gray-600 leading-relaxed">{d}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-10 text-gray-600">
            Los detalles están en nuestra <Link href="/privacidad" className="text-blue-600 underline underline-offset-2">política de privacidad</Link> y
            en los <Link href="/terminos" className="text-blue-600 underline underline-offset-2">términos de uso</Link>.
          </p>
        </section>

        {/* Categorías */}
        <section className="py-14 border-t border-gray-100" aria-labelledby="categorias">
          <h2 id="categorias" className="text-2xl sm:text-3xl font-bold text-gray-900">Qué vas a encontrar</h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoriesData.map((c) => (
              <li key={c.slug}>
                <Link href={`/${c.slug}`} className="group block h-full rounded-2xl border border-gray-200 bg-white p-5 hover:border-blue-300 hover:shadow-md transition-all">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="font-semibold text-gray-900 group-hover:text-blue-700">{c.name}</span>
                    <span className="text-sm text-gray-500 tabular-nums">{toolsData.filter((t) => t.category === c.slug).length}</span>
                  </span>
                  <span className="mt-2 block text-sm text-gray-600 leading-relaxed">{c.description}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link href="/blog" className="group block h-full rounded-2xl border border-gray-200 bg-white p-5 hover:border-blue-300 hover:shadow-md transition-all">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold text-gray-900 group-hover:text-blue-700">Blog</span>
                  <span className="text-sm text-gray-500 tabular-nums">{blogData.length}</span>
                </span>
                <span className="mt-2 block text-sm text-gray-600 leading-relaxed">
                  Guías paso a paso para entender tu aguinaldo, tu finiquito o tus impuestos antes de calcularlos.
                </span>
              </Link>
            </li>
          </ul>
        </section>

        {/* Contacto */}
        <section className="my-14 rounded-3xl bg-gray-900 px-6 py-10 sm:px-12 sm:py-12 text-white">
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">¿Encontraste un error o te falta una herramienta?</h2>
              <p className="mt-3 text-gray-300 text-lg leading-relaxed">
                Muchas de nuestras herramientas existen porque alguien las pidió, y muchos cálculos son más precisos porque alguien
                comparó el resultado con su recibo y nos escribió. Leemos todos los mensajes.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <a href={`mailto:${EMAIL}`} className="rounded-xl bg-white px-5 py-3 text-center font-semibold text-gray-900 hover:bg-blue-50">
                {EMAIL}
              </a>
              <a href={FACEBOOK_URL} target="_blank" rel="me noopener noreferrer" className="rounded-xl border border-gray-600 px-5 py-3 text-center font-medium text-gray-200 hover:border-gray-400">
                Síguenos en Facebook
              </a>
              <Link href="/contacto" className="rounded-xl border border-gray-600 px-5 py-3 text-center font-medium text-gray-200 hover:border-gray-400">
                Ver formas de contacto
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
