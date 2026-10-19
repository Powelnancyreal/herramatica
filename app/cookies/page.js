import Link from 'next/link'
import LegalLayout, { OTROS_LEGALES, Tabla, Correo } from '@/components/LegalLayout'
import { BotonConfigurarCookies } from '@/components/ConsentimientoCookies'

export const metadata = {
  title: 'Política de Cookies | Herramatica',
  description:
    'Las cookies que usa Herramatica: solo de analítica (Google Analytics), ninguna de publicidad. Lista completa, duración y cómo aceptarlas o rechazarlas.',
  alternates: { canonical: 'https://herramatica.com/cookies' },
}

const A = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline underline-offset-2">{children}</a>
)

const secciones = [
  {
    id: 'que-son',
    titulo: 'Qué son las cookies',
    cuerpo: (
      <p>
        Las cookies son pequeños archivos que un sitio web guarda en tu navegador para recordar información entre una visita y otra.
        Algo parecido hace el almacenamiento local (localStorage), que algunas herramientas usan para guardar datos en tu propio
        dispositivo. En esta página te explicamos ambos.
      </p>
    ),
  },
  {
    id: 'cookies-que-usamos',
    titulo: 'Las cookies que usamos',
    cuerpo: (
      <>
        <p>
          Herramatica solo usa cookies de <strong>analítica</strong>, de Google Analytics 4. No usamos cookies de publicidad, de redes
          sociales ni de seguimiento entre sitios. Estas son todas:
        </p>
        <Tabla
          cabeceras={['Cookie', 'Proveedor', 'Finalidad', 'Duración']}
          filas={[
            [<code key="a">_ga</code>, 'Google Analytics', 'Distinguir visitantes de forma anónima para contar cuántas personas usan cada herramienta.', '2 años'],
            [<code key="b">_ga_EJC91PS2KH</code>, 'Google Analytics', 'Mantener el estado de la sesión: qué páginas forman parte de una misma visita.', '2 años'],
          ]}
        />
        <p>
          Estas cookies solo se instalan si las aceptas o, fuera del Espacio Económico Europeo, el Reino Unido y Suiza, mientras no las
          rechaces. Si las rechazas, Google Analytics funciona sin cookies y solo recibe señales agregadas que no permiten
          identificar visitas repetidas.
        </p>
      </>
    ),
  },
  {
    id: 'almacenamiento-local',
    titulo: 'Almacenamiento local de tu navegador',
    cuerpo: (
      <>
        <p>Estos datos se guardan en tu dispositivo, no se envían a ningún servidor y no sirven para seguirte:</p>
        <Tabla
          cabeceras={['Nombre', 'Para qué', 'Duración']}
          filas={[
            [<code key="a">herramatica-cookies</code>, 'Recordar si aceptaste o rechazaste las cookies de analítica, para no preguntarte en cada visita.', 'Hasta que lo borres'],
            [<code key="b">herramatica-presupuesto-mensual</code>, <>Conservar los ingresos y gastos de tu <Link href="/presupuesto-mensual" className="text-blue-600 underline underline-offset-2">presupuesto mensual</Link>.</>, 'Hasta que lo borres'],
            [<code key="c">herramatica-calculo-mental-mejor-racha</code>, <>Guardar tu mejor racha en <Link href="/calculo-mental" className="text-blue-600 underline underline-offset-2">cálculo mental</Link>.</>, 'Hasta que lo borres'],
          ]}
        />
        <p>Son necesarios para que esas funciones hagan lo que pides, por lo que no requieren consentimiento.</p>
      </>
    ),
  },
  {
    id: 'elegir',
    titulo: 'Cómo aceptar o rechazar las cookies',
    cuerpo: (
      <>
        <p>
          La primera vez que entras te mostramos un aviso para aceptar o rechazar las cookies de analítica. Puedes cambiar de opinión
          en cualquier momento con este botón o con el enlace «Configurar cookies» del pie de página:
        </p>
        <BotonConfigurarCookies className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700" />
        <p>También puedes bloquear o borrar las cookies desde tu navegador:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><A href="https://support.google.com/chrome/answer/95647?hl=es">Google Chrome</A></li>
          <li><A href="https://support.mozilla.org/es/kb/Borrar%20cookies">Mozilla Firefox</A></li>
          <li><A href="https://support.apple.com/es-es/guide/safari/sfri11471/mac">Safari</A></li>
          <li><A href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09">Microsoft Edge</A></li>
        </ul>
        <p>
          Google ofrece además un <A href="https://tools.google.com/dlpage/gaoptout?hl=es">complemento para desactivar Google Analytics</A>{' '}
          en todos los sitios. Bloquear las cookies no impide usar ninguna herramienta de Herramatica.
        </p>
      </>
    ),
  },
  {
    id: 'terceros',
    titulo: 'Servicios externos sin cookies',
    cuerpo: (
      <p>
        Algunas herramientas consultan datos públicos, como tipos de cambio o el valor de la UF, a proveedores externos. Esas consultas
        no instalan cookies en tu navegador. Encontrarás la lista completa en la{' '}
        <Link href="/privacidad#servicios-externos" className="text-blue-600 underline underline-offset-2">política de privacidad</Link>.
      </p>
    ),
  },
  {
    id: 'cambios',
    titulo: 'Cambios y contacto',
    cuerpo: (
      <p>
        Si añadimos o quitamos alguna cookie, actualizaremos esta tabla y la fecha de «Última actualización», y volveremos a pedirte
        tu consentimiento cuando sea necesario. Para cualquier duda, escríbenos a <Correo asunto="Cookies" />.
      </p>
    ),
  },
]

export default function CookiesPage() {
  return (
    <LegalLayout
      titulo="Política de cookies"
      migaja="Cookies"
      intro="Usamos muy pocas cookies, y ninguna de publicidad. Aquí tienes la lista completa, para qué sirve cada una y cómo decidir si las aceptas."
      resumen={[
        'Solo usamos cookies de Google Analytics, para contar qué herramientas se usan.',
        'No hay cookies de publicidad, redes sociales ni seguimiento entre sitios.',
        'Puedes rechazarlas sin perder ninguna función.',
      ]}
      secciones={secciones}
      otros={OTROS_LEGALES.filter((o) => o.href !== '/cookies')}
    />
  )
}
