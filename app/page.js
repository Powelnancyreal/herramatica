import Link from 'next/link'
import Image from 'next/image'
import toolsData from '@/data/tools.json'
import categoriesData from '@/data/categories.json'
import { SITE_DESCRIPTION, hreflang } from '@/lib/seo'
import { EMAIL } from '@/components/LegalLayout'
import HomeSections, { IndiceHerramientas } from '@/components/HomeSections'
import BuscadorHerramientas from '@/components/BuscadorHerramientas'

const iconoCategoria = new Map(categoriesData.map((c) => [c.slug, c.icon]))
// Solo lo que el buscador necesita: el resto de tools.json (FAQs, contenido) no viaja al navegador.
const indiceBusqueda = toolsData.map((t) => ({ slug: t.slug, nombre: t.name, descripcion: t.metaDescription, icono: iconoCategoria.get(t.category) }))
const porSlug = new Map(toolsData.map((t) => [t.slug, t]))

const TITULO = 'Herramatica: herramientas y calculadoras gratis en español'

export const metadata = {
  title: TITULO,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: 'https://herramatica.com',
    languages: hreflang('https://herramatica.com'),
    types: {
      'application/rss+xml': 'https://herramatica.com/feed.xml',
    },
  },
  openGraph: { title: TITULO, description: SITE_DESCRIPTION, url: 'https://herramatica.com' },
}

const categoryColors = {
  generadores: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'bg-blue-100 text-blue-600',
    hover: 'hover:border-blue-400',
  },
  calculadoras: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'bg-green-100 text-green-600',
    hover: 'hover:border-green-400',
  },
  texto: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: 'bg-purple-100 text-purple-600',
    hover: 'hover:border-purple-400',
  },
  juegos: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    icon: 'bg-orange-100 text-orange-600',
    hover: 'hover:border-orange-400',
  },
  convertidores: {
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    icon: 'bg-teal-100 text-teal-600',
    hover: 'hover:border-teal-400',
  },
}

// Textos propios de la portada: categories.json también se usa en la página Acerca de.
const DESCRIPCION_CATEGORIA = {
  generadores: 'Crea contraseñas, códigos QR, nombres y textos de prueba con un clic.',
  calculadoras: 'Haz cuentas de dinero, trabajo, salud, estudios y matemáticas.',
  texto: 'Cuenta palabras, cambia mayúsculas o revisa y ordena un texto.',
  juegos: 'Sorteos, ruletas y juegos para practicar la mente o jugar en grupo.',
  convertidores: 'Pasa monedas, medidas, temperaturas, tallas e imágenes de un formato a otro.',
}

// Cada usuario llega con una tarea concreta: se agrupan por situación, no por tipo de herramienta.
const USOS = [
  {
    titulo: 'Trabajo y sueldo',
    texto: 'Calcula tu aguinaldo, tu finiquito o lo que te descuentan de tu sueldo, con las reglas de tu país.',
    enlaces: [['calcular-aguinaldo', 'Aguinaldo'], ['calculadora-finiquito-mexico', 'Finiquito en México'], ['sueldo-liquido-chile', 'Sueldo líquido en Chile'], ['calcular-indemnizacion-despido', 'Indemnización en Argentina']],
  },
  {
    titulo: 'Compras y dinero',
    texto: 'Saca un descuento, suma o quita el IVA, cambia monedas o compara un préstamo antes de firmar.',
    enlaces: [['calcular-descuento', 'Descuentos'], ['calcular-iva', 'IVA'], ['convertidor-moneda', 'Monedas'], ['calculadora-prestamo', 'Préstamos']],
  },
  {
    titulo: 'Escuela y estudios',
    texto: 'Saca tu promedio, resuelve una regla de tres o repasa las tablas de multiplicar.',
    enlaces: [['calculadora-promedio-ponderado', 'Promedio'], ['calculadora-regla-de-tres', 'Regla de tres'], ['calculadora-fracciones', 'Fracciones'], ['tablas-de-multiplicar', 'Tablas de multiplicar']],
  },
  {
    titulo: 'Casa, salud y día a día',
    texto: 'Cuenta los días entre dos fechas, revisa tu IMC o calcula cuánta agua tomar al día.',
    enlaces: [['calculadora-dias', 'Días entre fechas'], ['calcular-imc', 'IMC'], ['calculadora-agua-diaria', 'Agua diaria'], ['dias-para-navidad', 'Días para Navidad']],
  },
  {
    titulo: 'Textos y redes sociales',
    texto: 'Cuenta las palabras de un trabajo, crea un código QR o prepara los hashtags de tu publicación.',
    enlaces: [['contador-palabras', 'Contador de palabras'], ['generador-qr', 'Código QR'], ['generador-hashtags', 'Hashtags'], ['texto-invisible', 'Texto invisible']],
  },
  {
    titulo: 'Fotos y archivos',
    texto: 'Reduce el peso de una foto, cambia su tamaño o junta varias imágenes en un PDF.',
    enlaces: [['comprimir-imagen', 'Comprimir imagen'], ['redimensionar-imagen', 'Cambiar tamaño'], ['convertidor-imagenes', 'Cambiar formato'], ['imagenes-a-pdf', 'Imágenes a PDF']],
  },
]

const AVISOS = [
  {
    titulo: 'Algunos resultados son aproximados',
    texto:
      'Las calculadoras de sueldos, impuestos, préstamos y salud dan una estimación. Usan cifras y tasas que reunimos de fuentes públicas, como leyes y tablas oficiales, y esos datos cambian. Para un trámite o una decisión importante, confirma el resultado con la fuente oficial o con un profesional.',
  },
  {
    titulo: 'Lo que escribes se queda contigo',
    texto:
      'Casi todas las herramientas hacen el cálculo en tu propio navegador, así que tus datos no se envían ni se guardan. Algunas, como las del dólar o la UF, consultan el valor del día en un servicio externo.',
    enlace: ['/privacidad', 'Lee nuestra política de privacidad'],
  },
  {
    titulo: 'Gratis y sin registro',
    texto: 'No hay cuentas, planes de pago ni límites de uso. Entras, usas la herramienta y listo.',
  },
  {
    titulo: '¿Te falta una herramienta?',
    texto: `Si necesitas una calculadora que no tenemos o encontraste un error, escríbenos a ${EMAIL}. Leemos todos los mensajes.`,
  },
]

function EnlaceHerramienta({ slug, texto }) {
  if (!porSlug.has(slug)) return null
  return (
    <Link href={`/${slug}`} className="text-sm font-medium text-blue-700 hover:text-blue-900 hover:underline">
      {texto}
    </Link>
  )
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            Herramientas online<br className="hidden sm:block" /> gratis en español
          </h1>
          <p className="text-lg text-blue-50 max-w-2xl mx-auto mt-4">
            Calcula, convierte y crea en pocos segundos. Aquí encuentras herramientas para resolver tareas de todos los
            días: sacar un porcentaje, pasar de libras a kilos, saber cuánto te toca de aguinaldo o crear un código QR.
          </p>
          <p className="text-base text-blue-100 max-w-2xl mx-auto mt-3 mb-8">
            Todas son gratis y no tienes que registrarte ni pagar nada. Algunas calculadoras dan un resultado
            aproximado, porque trabajan con datos que reunimos de distintas fuentes públicas: tómalas como una guía.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {categoriesData.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="bg-white text-blue-700 font-semibold px-5 py-2 rounded-full hover:bg-blue-50 transition-colors shadow-sm"
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
          <BuscadorHerramientas herramientas={indiceBusqueda} />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Image
          src="/images/hero-home.webp"
          alt="Herramientas online gratis en español: calculadoras, convertidores y generadores"
          width={1200}
          height={600}
          priority={true}
          unoptimized={true}
          className="w-full rounded-xl my-8"
        />

        {/* Categorías */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900">Elige el tipo de herramienta</h2>
          <p className="text-gray-600 mt-1 mb-6">Cada sección junta herramientas parecidas para que encuentres rápido la que buscas.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {categoriesData.map((cat) => {
              const c = categoryColors[cat.slug] || {}
              return (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className={`group p-6 rounded-2xl border-2 ${c.bg} ${c.border} ${c.hover} transition-all hover:shadow-md`}
                >
                  <Image
                    src={`/images/cat-${cat.slug}.webp`}
                    alt={`${cat.name} online gratis en español`}
                    width={800}
                    height={400}
                    unoptimized={true}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                  <div className={`w-12 h-12 ${c.icon} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                    {cat.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{DESCRIPCION_CATEGORIA[cat.slug] || cat.description}</p>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Usos por situación */}
        <section className="mb-14" aria-labelledby="para-que-sirve">
          <h2 id="para-que-sirve" className="text-2xl font-bold text-gray-900">¿Para qué te puede servir Herramatica?</h2>
          <p className="text-gray-600 mt-1 mb-6 max-w-3xl">
            La mayoría de la gente llega con una duda concreta. Estas son algunas de las cosas que puedes resolver aquí.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {USOS.map((u) => (
              <div key={u.titulo} className="bg-white border border-gray-200 rounded-2xl p-5">
                <h3 className="font-bold text-gray-900">{u.titulo}</h3>
                <p className="text-sm text-gray-600 mt-1">{u.texto}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                  {u.enlaces.map(([slug, texto]) => (
                    <EnlaceHerramienta key={slug} slug={slug} texto={texto} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cómo trabajamos */}
        <section className="mb-16 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8" aria-labelledby="como-las-hacemos">
          <h2 id="como-las-hacemos" className="text-2xl font-bold text-gray-900 mb-4">Cómo hacemos las herramientas</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed max-w-3xl">
            <p>
              Cada herramienta se arma por separado y se prueba antes de publicarla. Comparamos los resultados con
              ejemplos resueltos y con la regla en la que se basan: una ley laboral, una tabla de impuestos o una fórmula
              conocida.
            </p>
            <p>
              Debajo de cada herramienta explicamos cómo se hace el cálculo, con ejemplos y preguntas frecuentes. Cada
              página muestra la fecha de su última actualización y muchas indican también las fuentes que usamos. Cuando
              cambia una cifra oficial, como un salario mínimo o un tramo de impuestos, actualizamos la herramienta.
            </p>
            <p>
              Si quieres entender un tema con más calma, en el <Link href="/blog" className="text-blue-700 font-medium hover:underline">blog</Link>{' '}
              explicamos con ejemplos el aguinaldo, el RFC o las vacaciones por ley.
            </p>
          </div>
          <Link href="/acerca#como-trabajamos" className="inline-block mt-5 text-sm font-semibold text-blue-600 hover:text-blue-700">
            Conoce más sobre cómo trabajamos →
          </Link>
        </section>

        <HomeSections />

        {/* Antes de usar */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-14" aria-labelledby="antes-de-usar">
          <h2 id="antes-de-usar" className="text-2xl font-bold text-gray-900 mb-6">Lo que debes saber antes de usarlas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {AVISOS.map((a) => (
              <div key={a.titulo}>
                <h3 className="font-semibold text-gray-900">{a.titulo}</h3>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">{a.texto}</p>
                {a.enlace && (
                  <Link href={a.enlace[0]} className="inline-block mt-1 text-sm text-blue-600 hover:underline">
                    {a.enlace[1]}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        <IndiceHerramientas />
      </div>
    </>
  )
}
