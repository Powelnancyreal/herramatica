import Link from 'next/link'
import LegalLayout, { Correo, OTROS_LEGALES } from '@/components/LegalLayout'

export const metadata = {
  title: 'Términos de Uso | Herramatica',
  description:
    'Condiciones de uso de Herramatica: herramientas gratuitas con resultados orientativos, uso permitido, propiedad intelectual y límites de responsabilidad.',
  alternates: { canonical: 'https://herramatica.com/terminos' },
}

const L = ({ href, children }) => <Link href={href} className="text-blue-600 underline underline-offset-2">{children}</Link>

const secciones = [
  {
    id: 'aceptacion',
    titulo: 'Qué regulan estos términos',
    cuerpo: (
      <p>
        Estos términos regulan el uso de herramatica.com, de sus herramientas y de sus guías, que edita Herramatica (contacto:{' '}
        <Correo />). Al usar el sitio los aceptas. Si no estás de acuerdo con ellos, te pedimos que no lo uses. El tratamiento de datos
        se explica aparte en la <L href="/privacidad">política de privacidad</L> y en la <L href="/cookies">política de cookies</L>.
      </p>
    ),
  },
  {
    id: 'servicio',
    titulo: 'El servicio',
    cuerpo: (
      <>
        <p>
          Herramatica ofrece calculadoras, generadores, convertidores, herramientas de texto, juegos y guías en español, de uso
          gratuito y sin registro. Las herramientas funcionan en tu navegador.
        </p>
        <p>
          Podemos mejorar, cambiar, sustituir o retirar herramientas y contenidos, por ejemplo cuando cambia la ley en la que se basa un
          cálculo. Procuramos que el sitio esté siempre disponible, pero puede haber interrupciones por mantenimiento o por causas ajenas
          a nosotros.
        </p>
      </>
    ),
  },
  {
    id: 'resultados',
    titulo: 'Los resultados son orientativos',
    cuerpo: (
      <>
        <p>
          Revisamos cada herramienta contra la ley y las cifras oficiales que indica en su propia página, como la UMA y las tablas de ISR
          del SAT en México, la UVT de la DIAN en Colombia, la UIT de la SUNAT en Perú o la UF en Chile. Aun así, sus resultados son{' '}
          <strong>estimaciones</strong>:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Dependen de los datos que introduces y de supuestos generales que cada herramienta explica.</li>
          <li>Pueden no reflejar tu convenio colectivo, tu contrato, reglas especiales de tu sector o cambios legales muy recientes.</li>
          <li>Los tipos de cambio, cotizaciones e indicadores provienen de proveedores externos y pueden llegar con retraso.</li>
          <li>Las calculadoras de salud son informativas y no sustituyen el diagnóstico ni el consejo de un profesional sanitario.</li>
        </ul>
        <p>
          Para decisiones importantes, como reclamar un finiquito, presentar una declaración de impuestos, firmar un crédito o cambiar un
          tratamiento, confirma el resultado con la autoridad competente o con un profesional (contador, abogado laboral, asesor
          financiero o médico). Herramatica no presta asesoría legal, fiscal, financiera ni médica.
        </p>
      </>
    ),
  },
  {
    id: 'uso',
    titulo: 'Uso permitido',
    cuerpo: (
      <>
        <p>Puedes usar las herramientas para fines personales, educativos y profesionales. No está permitido:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Usarlas para cometer fraudes, suplantar a otra persona o engañar a terceros, por ejemplo con datos de prueba o documentos generados presentados como reales.</li>
          <li>Hacer peticiones automatizadas masivas, copiar el sitio de forma sistemática o intentar sobrecargarlo.</li>
          <li>Intentar acceder a partes del sitio o de su infraestructura que no son públicas, o alterar su funcionamiento.</li>
          <li>Usar el sitio de cualquier forma contraria a la ley.</li>
        </ul>
        <p>
          Los generadores de datos de prueba, números o nombres sirven para probar software, aprender o jugar. Los datos que producen no
          son documentos oficiales ni tienen validez legal.
        </p>
      </>
    ),
  },
  {
    id: 'tu-contenido',
    titulo: 'Lo que introduces en las herramientas',
    cuerpo: (
      <p>
        Los textos, imágenes y archivos que usas en las herramientas siguen siendo tuyos y se procesan en tu dispositivo. Eres
        responsable de tener derecho a usarlos. No adquirimos ningún derecho sobre ellos.
      </p>
    ),
  },
  {
    id: 'propiedad',
    titulo: 'Propiedad intelectual',
    cuerpo: (
      <>
        <p>
          Los textos, guías, ilustraciones, diseño y código de Herramatica están protegidos por derechos de autor. Puedes citar fragmentos
          breves y enlazar cualquier página libremente, indicando la fuente. Para reproducir contenidos completos o usar las ilustraciones,
          pídenos permiso en <Correo asunto="Permiso de uso de contenido" />.
        </p>
        <p>
          Las leyes, tablas oficiales e indicadores públicos que citamos pertenecen a sus autores y son de dominio público. Las marcas y
          nombres de organismos, empresas o servicios que mencionamos pertenecen a sus titulares y se usan solo para identificarlos.
        </p>
      </>
    ),
  },
  {
    id: 'enlaces',
    titulo: 'Enlaces a otros sitios',
    cuerpo: (
      <p>
        Enlazamos a fuentes oficiales y a otros sitios cuando ayudan a entender un tema. No controlamos esos sitios ni respondemos de su
        contenido o de sus políticas de privacidad.
      </p>
    ),
  },
  {
    id: 'responsabilidad',
    titulo: 'Responsabilidad',
    cuerpo: (
      <>
        <p>
          Las herramientas se ofrecen gratis y tal como están. En la medida en que la ley lo permita, Herramatica no responde de los
          daños derivados de decisiones tomadas solo con base en sus resultados, de errores en datos de terceros ni de interrupciones del
          servicio.
        </p>
        <p>
          Nada en estos términos limita los derechos que te reconozca la ley de protección al consumidor de tu país y que no puedan
          excluirse por contrato, ni nuestra responsabilidad en los casos en que la ley no permite limitarla.
        </p>
      </>
    ),
  },
  {
    id: 'errores',
    titulo: 'Si encuentras un error',
    cuerpo: (
      <p>
        Si un resultado no coincide con tu recibo, con una tabla oficial o con lo que esperabas, escríbenos a{' '}
        <Correo asunto="Error en una herramienta" /> con el enlace de la herramienta y los datos que usaste. Revisamos cada aviso y, si
        hay un error, lo corregimos y actualizamos la fecha de la página.
      </p>
    ),
  },
  {
    id: 'cambios',
    titulo: 'Cambios en estos términos',
    cuerpo: (
      <p>
        Podemos actualizar estos términos para reflejar cambios en el sitio o en la ley. La versión vigente es siempre la publicada en
        esta página, con su fecha de «Última actualización». Si sigues usando el sitio después de un cambio, se aplicará la nueva versión.
      </p>
    ),
  },
]

export default function TerminosPage() {
  return (
    <LegalLayout
      titulo="Términos de uso"
      migaja="Términos"
      intro="Las reglas para usar Herramatica, escritas para que se entiendan. Lo más importante: las herramientas son gratuitas y sus resultados son estimaciones que conviene confirmar antes de tomar decisiones importantes."
      resumen={[
        'Puedes usar todas las herramientas gratis, sin registro, para fines personales o profesionales.',
        'Los resultados son estimaciones basadas en cifras oficiales; no sustituyen la asesoría de un profesional.',
        'No uses las herramientas para fraudes, suplantaciones ni para sobrecargar el sitio.',
        'Puedes citar y enlazar nuestros contenidos indicando la fuente.',
      ]}
      secciones={secciones}
      otros={OTROS_LEGALES.filter((o) => o.href !== '/terminos')}
    />
  )
}
