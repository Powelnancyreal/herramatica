import fs from 'fs'
import path from 'path'
import Image from 'next/image'
import FAQ from '@/components/FAQ'
import RelatedTools from '@/components/RelatedTools'

const toolImageOverrides = {
  'generador-qr': 'tool-qr',
}

function getToolImage(slug) {
  const baseName = toolImageOverrides[slug] || `tool-${slug}`
  const filePath = path.join(process.cwd(), 'public', 'images', `${baseName}.webp`)
  return fs.existsSync(filePath) ? `/images/${baseName}.webp` : null
}

function getToolBottomImage(slug) {
  const filePath = path.join(process.cwd(), 'public', 'images', 'tools', `${slug}.webp`)
  return fs.existsSync(filePath) ? `/images/tools/${slug}.webp` : null
}

function cleanToolName(name) {
  return name.replace(/\s*\(([^)]*)\)\s*$/, ' $1').replace(/,\s+/g, ' ')
}

const toolBottomImageAltOverrides = {
  'cm-a-pulgadas': 'Convertidor de centímetros a pulgadas con regla comparativa',
  'arroba-a-kilos': 'Convertidor de arroba a kilos con balanza tradicional',
  'calculadora-tiempo-lectura': 'Calculadora de tiempo de lectura con libro y cronómetro',
  'calcular-indemnizacion-despido': 'Calculadora de indemnización por despido laboral Argentina',
  'calcular-sac-argentina': 'Calculadora de SAC aguinaldo Argentina junio diciembre',
  'calculadora-alquiler-argentina': 'Calculadora de ajuste de alquiler Argentina ICL IPC CVS',
  'calculadora-plazo-fijo': 'Calculadora de plazo fijo con crecimiento de inversión',
  'calculadora-interes-compuesto': 'Calculadora de interés compuesto con curva exponencial',
  'calculadora-sueldo-neto-argentina': 'Calculadora de sueldo neto Argentina con desglose AFIP',
  'calculadora-area': 'Calculadora de área de figuras geométricas cuadrado rectángulo triángulo',
  'calculadora-volumen': 'Calculadora de volumen de cubo esfera cono y prisma rectangular',
  'calculadora-calculos-combinados': 'Calculadora de cálculos combinados con orden de operaciones PEMDAS',
  'calculadora-resistencias': 'Calculadora de resistencias con código de colores y ley de Ohm',
  'calculadora-calorias': 'Calculadora de calorías diarias TDEE y macronutrientes',
  'calculadora-embarazo': 'Calculadora de embarazo semanas de gestación y fecha de parto',
  'calculadora-peso-ideal': 'Calculadora de peso ideal según altura e IMC saludable OMS',
  'calculadora-ciclos-sueno': 'Calculadora de ciclos de sueño para despertar descansado',
  'calculadora-de-escalas': 'Calculadora de escalas para planos mapas y maquetas',
  'sopa-de-letras': 'Generador de sopa de letras personalizada para imprimir gratis',
  'generador-de-letras-grandes': 'Generador de letras grandes grafiti script y molde para imprimir',
  'generador-codigo-de-barras': 'Generador de código de barras EAN-13 gratis online',
  'generador-de-crucigramas': 'Generador de crucigramas personalizado para imprimir gratis',
  'generador-de-nombres-para-free-fire': 'Generador de nombres para Free Fire con símbolos decorativos',
  'generador-de-link-de-whatsapp': 'Generador de link de WhatsApp sin guardar número gratis',
  'calculadora-engagement-instagram': 'Calculadora de engagement de Instagram por publicación',
  'calculador-de-horarios': 'Calculador de horarios semanales para clases y trabajo',
  'hexadecimal-a-texto': 'Convertidor de hexadecimal a texto con soporte UTF-8 español',
  'ruleta-aleatoria-online': 'Ruleta aleatoria online personalizada para sorteos y decisiones',
  'calculadora-promedio-ponderado': 'Calculadora de promedio ponderado universitario por créditos',
  'calculadora-cts-peru': 'Calculadora de CTS Perú depósito mayo noviembre gratis',
  'calcular-gratificacion-peru': 'Calculadora de gratificación Perú julio diciembre ley 27735',
  'calculadora-de-igv': 'Calculadora de IGV Perú 18 por ciento agregar o extraer SUNAT',
  'calcular-detraccion': 'Calculadora de detracción SUNAT Perú porcentaje por categoría',
  'calculadora-de-matrices': 'Calculadora de matrices suma resta multiplicación determinante inversa',
  'calculadora-de-ecuaciones': 'Calculadora de ecuaciones lineales y cuadráticas con fórmula general',
  'calculadora-precios-influencers-tiktok': 'Calculadora de precios para influencers de TikTok por engagement',
  'calculadora-ip': 'Calculadora de IP y subredes CIDR red máscara broadcast hosts',
  'calculadora-regla-de-tres': 'Calculadora de regla de tres directa e inversa con ejemplos',
  'calculadora-de-pendiente': 'Calculadora de pendiente de una recta entre dos puntos con ecuación',
  'calculadora-derivadas-integrales': 'Calculadora de límites derivadas e integrales definidas online gratis',
  'calculadora-ldl': 'Calculadora de colesterol LDL con fórmula de Friedewald online',
  'calculadora-pafi': 'Calculadora de índice PaFi PaO2 FiO2 para gasometría arterial',
  'indice-de-barthel': 'Índice de Barthel evaluación independencia funcional actividades diarias',
  'calculadora-liquidacion-laboral-colombia': 'Calculadora de liquidación laboral Colombia cesantías prima vacaciones',
  'calculadora-seguridad-social-colombia': 'Calculadora de seguridad social Colombia salud pensión empleado independiente',
  'calculadora-cdt': 'Calculadora de CDT Colombia rendimiento tasa plazo fijo bancario',
}

export default function ToolLayout({ tool, children }) {
  const toolImage = getToolImage(tool.slug)
  const toolBottomImage = getToolBottomImage(tool.slug)
  const toolNameForAlt = cleanToolName(tool.name)
  const toolBottomImageAlt =
    toolBottomImageAltOverrides[tool.slug] || `${toolNameForAlt} - herramienta online gratis en español`

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4" aria-label="Ruta de navegación">
        <ol className="flex items-center gap-2">
          <li>
            <a href="/" className="hover:text-blue-600 transition-colors">
              Inicio
            </a>
          </li>
          <li className="text-gray-300">/</li>
          <li>
            <a href={`/${tool.category}`} className="hover:text-blue-600 capitalize transition-colors">
              {tool.category}
            </a>
          </li>
          <li className="text-gray-300">/</li>
          <li className="text-gray-700 font-medium truncate">{tool.shortName}</li>
        </ol>
      </nav>

      {/* H1 */}
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">{tool.name}</h1>

      {toolImage && (
        <Image
          src={toolImage}
          alt={`${tool.name} - herramienta online gratis`}
          width={800}
          height={450}
          unoptimized={true}
          className="w-full rounded-xl my-6"
        />
      )}

      {/* Tool UI */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-6 mb-8">
        {children}
      </div>

      {/* Tool Image - SEO & UX */}
      {toolBottomImage && (
        <div className="my-8">
          <Image
            src={toolBottomImage}
            alt={toolBottomImageAlt}
            width={800}
            height={450}
            unoptimized={true}
            className="w-full rounded-xl shadow-md"
            loading="lazy"
          />
        </div>
      )}

      {/* Intro */}
      <section className="mb-8">
        <p className="text-gray-700 leading-relaxed text-base sm:text-lg">{tool.intro}</p>
      </section>

      {/* Cómo usar */}
      {tool.howToUse && tool.howToUse.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cómo usar</h2>
          <ol className="space-y-3">
            {tool.howToUse.map((step, i) => (
              <li key={i} className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </span>
                <p className="text-gray-700 pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Beneficios */}
      {tool.benefits && tool.benefits.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Beneficios</h2>
          <ul className="space-y-2">
            {tool.benefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">{benefit}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Extended SEO content sections (optional, per-tool) */}
      {tool.contentSections && tool.contentSections.map((section, i) => (
        <section key={i} className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{section.title}</h2>
          <p className="text-gray-700 leading-relaxed">{section.body}</p>
        </section>
      ))}

      {/* FAQ */}
      <FAQ faqs={tool.faqs} />

      {/* Related tools */}
      <RelatedTools relatedSlugs={tool.relatedTools} />
    </main>
  )
}
