import Link from 'next/link'
import toolsData from '@/data/tools.json'
import temas from '@/data/temas-herramientas.json'
import { hreflang } from '@/lib/seo'
import { generateBreadcrumbSchema } from '@/lib/schema'

const URL = 'https://herramatica.com/calculadoras'
const calculadoras = toolsData.filter((t) => t.category === 'calculadoras')

export const metadata = {
  title: { absolute: `Calculadoras Online Gratis: más de ${Math.floor(calculadoras.length / 10) * 10}` },
  description: 'Directorio de calculadoras online gratis: finanzas, sueldo e impuestos por país, salud, matemáticas, notas y fechas. Sin registro y con resultados al instante.',
  alternates: { canonical: URL, languages: hreflang(URL) },
}

const PAISES = { MX: 'México', AR: 'Argentina', CO: 'Colombia', CL: 'Chile', PE: 'Perú', EC: 'Ecuador', UY: 'Uruguay', ES: 'España' }
const LABORALES = new Set(['laboral', 'impuestos', 'pension', 'despido', 'vacaciones'])

// Cada calculadora va a un solo grupo según su primer tema; las de sueldo e impuestos se agrupan por país.
const GRUPOS = [
  { id: 'laboral', titulo: 'Sueldo, impuestos y prestaciones por país', intro: 'Aguinaldo, finiquito, vacaciones, nómina e impuestos con las leyes y cifras de cada país.', temas: [...LABORALES], porPais: true },
  { id: 'finanzas', titulo: 'Finanzas personales y préstamos', intro: 'Créditos, hipotecas, ahorro, inversión y gastos del día a día.', temas: ['finanzas', 'credito', 'inversion', 'gastos', 'comercio', 'moneda', 'vivienda', 'ecologia'] },
  { id: 'salud', titulo: 'Salud y bienestar', intro: 'Peso, calorías, embarazo, sueño e índices clínicos.', temas: ['salud', 'peso', 'clinica', 'bebe'] },
  { id: 'mates', titulo: 'Matemáticas y geometría', intro: 'Desde porcentajes y fracciones hasta ecuaciones, matrices y derivadas.', temas: ['mates', 'geometria', 'algebra', 'estadistica'] },
  { id: 'escuela', titulo: 'Notas y estudios', intro: 'Promedios, notas necesarias y puntajes de admisión.', temas: ['escuela'] },
  { id: 'tiempo', titulo: 'Fechas, horas y tiempo', intro: 'Edad, días entre fechas, horas trabajadas y cuentas regresivas.', temas: ['fechas', 'tiempo'] },
]

function agrupar() {
  const asignadas = new Set()
  const grupos = GRUPOS.map((g) => {
    const lista = calculadoras.filter((t) => {
      const tm = (temas[t.slug] || []).filter((x) => !PAISES[x])
      const primero = tm[0]
      if (asignadas.has(t.slug) || !g.temas.includes(primero)) return false
      if (g.id !== 'laboral' && LABORALES.has(primero)) return false
      asignadas.add(t.slug)
      return true
    })
    return { ...g, lista }
  })
  const resto = calculadoras.filter((t) => !asignadas.has(t.slug))
  if (resto.length) grupos.push({ id: 'otras', titulo: 'Otras calculadoras', intro: 'Herramientas de uso variado.', lista: resto })
  return grupos.filter((g) => g.lista.length)
}

const pais = (t) => (temas[t.slug] || []).find((x) => PAISES[x]) || 'GEN'
const ordenar = (lista) => [...lista].sort((a, b) => (a.shortName || a.name).localeCompare(b.shortName || b.name, 'es'))

function Tarjeta({ tool }) {
  return (
    <li>
      <Link href={`/${tool.slug}`} className="group block h-full bg-white border border-gray-200 rounded-xl p-4 hover:border-green-300 hover:shadow-md transition-all">
        <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors leading-snug">{tool.name}</h3>
        <p className="text-sm text-gray-500 mt-1.5 line-clamp-2">{tool.metaDescription}</p>
      </Link>
    </li>
  )
}

export default function CalculadorasPage() {
  const grupos = agrupar()
  const breadcrumb = generateBreadcrumbSchema([
    { name: 'Inicio', url: 'https://herramatica.com' },
    { name: 'Calculadoras', url: URL },
  ])

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <nav className="text-sm text-gray-500 mb-6" aria-label="Ruta de navegación">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-blue-600">Inicio</Link></li>
          <li className="text-gray-300">/</li>
          <li className="text-gray-700 font-medium">Calculadoras</li>
        </ol>
      </nav>

      <header className="mb-8 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Calculadoras online gratis</h1>
        <p className="text-gray-600 text-lg mt-3">
          {calculadoras.length} calculadoras en español para resolver cuentas reales: tu sueldo y tus impuestos según tu país, préstamos e
          inversiones, salud, matemáticas, notas y fechas. Todas funcionan en tu navegador, sin registro y con el cálculo explicado paso a paso.
        </p>
      </header>

      <nav aria-label="Grupos de calculadoras" className="mb-12 flex flex-wrap gap-2">
        {grupos.map((g) => (
          <a key={g.id} href={`#${g.id}`} className="px-4 py-2 rounded-full bg-green-50 text-green-800 text-sm font-medium border border-green-200 hover:bg-green-100">
            {g.titulo} <span className="text-green-600">({g.lista.length})</span>
          </a>
        ))}
      </nav>

      {grupos.map((g) => (
        <section key={g.id} id={g.id} className="mb-14 scroll-mt-24" aria-labelledby={`titulo-${g.id}`}>
          <h2 id={`titulo-${g.id}`} className="text-2xl font-bold text-gray-900">{g.titulo}</h2>
          <p className="text-gray-600 mt-1 mb-5">{g.intro}</p>
          {g.porPais ? (
            Object.keys(PAISES).map((codigo) => {
              const lista = ordenar(g.lista.filter((t) => pais(t) === codigo))
              if (!lista.length) return null
              return (
                <div key={codigo} className="mb-8">
                  <p className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">{PAISES[codigo]}</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {lista.map((t) => <Tarjeta key={t.slug} tool={t} />)}
                  </ul>
                </div>
              )
            })
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ordenar(g.lista).map((t) => <Tarjeta key={t.slug} tool={t} />)}
            </ul>
          )}
        </section>
      ))}

      <section className="mt-6 max-w-3xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Calculadoras pensadas para cada país</h2>
        <p className="text-gray-700 leading-relaxed">
          Un mismo concepto cambia de un país a otro: el aguinaldo de México no se calcula como el de Uruguay, y el finiquito de Chile no
          sigue las reglas del de México. Por eso nuestras calculadoras laborales y fiscales usan la ley y las cifras oficiales de cada país
          para 2026, como la UMA mexicana, la UF chilena, la UVT colombiana o la UIT peruana, y explican de dónde sale cada número. Si
          prefieres entender el cálculo antes de hacerlo, en el <Link href="/blog" className="text-blue-600 underline">blog</Link> tienes guías
          paso a paso con ejemplos.
        </p>
      </section>
    </main>
  )
}
