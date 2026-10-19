import Link from 'next/link'
import LegalLayout, { Correo, OTROS_LEGALES, Tabla } from '@/components/LegalLayout'

export const metadata = {
  title: 'Política de Privacidad | Herramatica',
  description:
    'Qué datos trata Herramatica y cuáles no: las herramientas calculan en tu navegador, sin cuentas ni formularios. Analítica, servicios externos y tus derechos.',
  alternates: { canonical: 'https://herramatica.com/privacidad' },
}

const A = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline underline-offset-2">{children}</a>
)
const L = ({ href, children }) => <Link href={href} className="text-blue-600 underline underline-offset-2">{children}</Link>

const secciones = [
  {
    id: 'responsable',
    titulo: 'Quién es responsable de tus datos',
    cuerpo: (
      <>
        <p>
          El responsable del tratamiento es Herramatica, el proyecto que edita el sitio web herramatica.com. Para cualquier asunto
          relacionado con tu privacidad puedes escribirnos a <Correo asunto="Privacidad" />. Leemos todos los mensajes y te
          respondemos desde esa misma dirección.
        </p>
        <p>
          Esta política se aplica a herramatica.com y a todas sus herramientas, guías y páginas. No se aplica a los sitios externos a
          los que enlazamos, que tienen sus propias políticas.
        </p>
      </>
    ),
  },
  {
    id: 'lo-que-no',
    titulo: 'Lo que no recopilamos',
    cuerpo: (
      <>
        <p>
          Herramatica no tiene cuentas de usuario, formularios de registro ni base de datos de visitantes. Las calculadoras,
          generadores, convertidores y herramientas de texto hacen sus cálculos <strong>dentro de tu navegador</strong>. Eso significa
          que:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Los datos que escribes (tu sueldo, tu fecha de ingreso, tu peso, un texto, una contraseña generada) no se envían a nuestros servidores ni los vemos.</li>
          <li>Las imágenes, PDF y archivos que cargas en herramientas como el compresor de imágenes o el conversor de imágenes a PDF se procesan en tu dispositivo y no se suben a ningún sitio.</li>
          <li>No pedimos tu nombre, tu correo ni ningún documento de identidad para usar ninguna herramienta.</li>
        </ul>
        <p>
          Algunas herramientas calculan con datos de identificación, como el <L href="/calcular-rfc">RFC</L>, la{' '}
          <L href="/calcular-curp">CURP</L> o el <L href="/calcular-rut">RUT</L>. También en esos casos el cálculo es local: los datos
          que escribes no salen de tu navegador.
        </p>
      </>
    ),
  },
  {
    id: 'lo-que-si',
    titulo: 'Datos que sí se tratan y para qué',
    cuerpo: (
      <>
        <Tabla
          cabeceras={['Qué', 'Para qué', 'Base', 'Cuánto tiempo']}
          filas={[
            [
              'Estadísticas de uso con Google Analytics 4: páginas vistas, herramienta usada, país y ciudad aproximados, tipo de dispositivo, navegador, página de procedencia.',
              'Saber qué herramientas se usan, cuáles fallan o confunden y qué conviene mejorar o crear.',
              'Tu consentimiento en el Espacio Económico Europeo, Reino Unido y Suiza; en el resto, nuestro interés legítimo en mejorar el sitio, con opción de rechazarlo.',
              'Hasta 14 meses, el plazo máximo de conservación de Google Analytics.',
            ],
            [
              'Registros técnicos del servidor: dirección IP, fecha y hora, página pedida y navegador.',
              'Servir las páginas, detectar errores y proteger el sitio frente a abusos.',
              'Interés legítimo en la seguridad y el funcionamiento del sitio.',
              'Un periodo breve fijado por nuestro proveedor de alojamiento.',
            ],
            [
              'Tu correo y lo que nos cuentes cuando nos escribes.',
              'Responderte y, si nos avisas de un error, corregirlo.',
              'Tu solicitud.',
              'Lo necesario para atenderte; como máximo 24 meses después del último mensaje.',
            ],
          ]}
        />
        <p>
          Google Analytics no recibe lo que escribes en las herramientas, solo qué página visitas y cómo navegas. En Google Analytics 4
          las direcciones IP no se registran ni se almacenan. No usamos la analítica para crear perfiles publicitarios ni la cruzamos
          con otras fuentes.
        </p>
      </>
    ),
  },
  {
    id: 'servicios-externos',
    titulo: 'Herramientas que consultan servicios externos',
    cuerpo: (
      <>
        <p>
          Unas pocas herramientas muestran datos que cambian cada día, como tipos de cambio o indicadores económicos. Para obtenerlos,
          tu navegador consulta directamente a un proveedor público. Ese proveedor recibe la petición y, como en cualquier conexión a
          Internet, tu dirección IP; no le enviamos nada de lo que escribes, salvo en el caso que se indica.
        </p>
        <Tabla
          cabeceras={['Herramientas', 'Proveedor', 'Qué recibe']}
          filas={[
            [<><L href="/convertidor-moneda">Convertidor de moneda</L>, <L href="/dolar-a-peso-mexicano">Dólar a peso mexicano</L></>, 'Frankfurter (tipos de referencia del Banco Central Europeo)', 'La petición de tipos de cambio.'],
            [<L href="/dolar-blue" key="b">Dólar blue</L>, 'DolarApi', 'La petición de cotizaciones.'],
            [<L href="/conversor-criptomonedas" key="c">Conversor de criptomonedas</L>, 'CoinGecko', 'La petición de precios.'],
            [<>Calculadoras de Chile, como <L href="/uf-a-pesos">UF a pesos</L> o el <L href="/sueldo-liquido-chile">sueldo líquido</L></>, 'mindicador.cl', 'La petición de los valores de UF, UTM y dólar.'],
            [<L href="/validador-email" key="e">Validador de email</L>, 'Cloudflare DNS', 'Solo el dominio del correo (lo que va después de la @), nunca la dirección completa.'],
          ]}
        />
      </>
    ),
  },
  {
    id: 'almacenamiento-local',
    titulo: 'Lo que se guarda en tu propio dispositivo',
    cuerpo: (
      <>
        <p>
          Algunas funciones guardan información en el almacenamiento local de tu navegador (localStorage) para que no la pierdas.
          Esa información se queda en tu dispositivo, no la recibimos y puedes borrarla cuando quieras desde los ajustes del navegador.
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Tu elección sobre las cookies de analítica.</li>
          <li>Los ingresos y gastos que escribes en el <L href="/presupuesto-mensual">presupuesto mensual</L>, para que sigan ahí cuando vuelvas.</li>
          <li>Tu mejor racha en el juego de <L href="/calculo-mental">cálculo mental</L>.</li>
        </ul>
        <p>Las cookies se explican aparte en la <L href="/cookies">política de cookies</L>.</p>
      </>
    ),
  },
  {
    id: 'destinatarios',
    titulo: 'Con quién compartimos datos',
    cuerpo: (
      <>
        <p>No vendemos, alquilamos ni cedemos datos personales. Solo intervienen los proveedores que necesitamos para que el sitio funcione:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Vercel Inc.</strong>, que aloja el sitio y genera los registros técnicos del servidor.</li>
          <li><strong>Google LLC</strong>, que presta el servicio de Google Analytics.</li>
          <li>Nuestro proveedor de correo electrónico, que gestiona los mensajes que nos envías.</li>
        </ul>
        <p>
          Algunos de estos proveedores tratan datos en Estados Unidos. Las transferencias se amparan en el Marco de Privacidad de Datos
          UE-EE. UU. y en las cláusulas contractuales tipo aprobadas por la Comisión Europea. Solo entregaríamos datos a una autoridad
          si una ley nos obligara a hacerlo.
        </p>
      </>
    ),
  },
  {
    id: 'derechos',
    titulo: 'Tus derechos',
    cuerpo: (
      <>
        <p>
          Puedes pedirnos acceso a tus datos, su rectificación o su eliminación, oponerte a su tratamiento o limitarlo, solicitar su
          portabilidad y retirar tu consentimiento en cualquier momento. Para ejercerlos, escríbenos a <Correo asunto="Derechos sobre mis datos" />{' '}
          indicando qué necesitas. Te responderemos en un plazo máximo de 30 días.
        </p>
        <p>
          Como no tenemos cuentas, normalmente no podemos relacionar los datos de analítica con una persona concreta. Si quieres que
          dejen de recogerse, la forma más rápida es <L href="/cookies">rechazar las cookies de analítica</L> o borrar las cookies de
          herramatica.com en tu navegador.
        </p>
        <p>Según el país en el que vivas, estos derechos están reconocidos por estas normas, y puedes reclamar ante su autoridad:</p>
        <Tabla
          cabeceras={['País', 'Norma', 'Autoridad']}
          filas={[
            ['España y resto de la UE', 'Reglamento General de Protección de Datos (RGPD) y, en España, la LOPDGDD', <A key="e" href="https://www.aepd.es">Agencia Española de Protección de Datos</A>],
            ['México', 'Ley Federal de Protección de Datos Personales en Posesión de los Particulares (derechos ARCO)', 'Secretaría Anticorrupción y Buen Gobierno'],
            ['Argentina', 'Ley 25.326 de Protección de los Datos Personales', 'Agencia de Acceso a la Información Pública'],
            ['Colombia', 'Ley 1581 de 2012 (habeas data)', 'Superintendencia de Industria y Comercio'],
            ['Chile', 'Ley 19.628 sobre protección de la vida privada', 'Consejo para la Transparencia y, cuando entre en funciones, la Agencia de Protección de Datos Personales'],
            ['Perú', 'Ley 29733 de Protección de Datos Personales', 'Autoridad Nacional de Protección de Datos Personales'],
          ]}
        />
        <p>Te agradeceremos que nos escribas primero: casi siempre podemos resolverlo directamente.</p>
      </>
    ),
  },
  {
    id: 'menores',
    titulo: 'Menores de edad',
    cuerpo: (
      <p>
        Muchas herramientas, como las de notas o los juegos de palabras, las usan estudiantes. Como no pedimos datos personales para
        usarlas, no recogemos a sabiendas información de menores. Si eres madre, padre o tutor y crees que un menor nos ha enviado datos
        por correo, escríbenos y los borraremos.
      </p>
    ),
  },
  {
    id: 'seguridad',
    titulo: 'Seguridad',
    cuerpo: (
      <p>
        Todo el sitio funciona sobre HTTPS, por lo que la conexión entre tu navegador y herramatica.com va cifrada. Al no guardar en
        servidores lo que introduces en las herramientas, ese contenido no puede filtrarse desde nuestro lado. Ningún sistema es
        completamente invulnerable; si detectas un problema de seguridad, avísanos en <Correo asunto="Seguridad" />.
      </p>
    ),
  },
  {
    id: 'cambios',
    titulo: 'Cambios en esta política',
    cuerpo: (
      <p>
        Si cambiamos la forma de tratar datos, por ejemplo al añadir un servicio nuevo, actualizaremos esta página y la fecha de
        «Última actualización». Si el cambio es importante, lo indicaremos de forma visible en el sitio antes de que se aplique.
      </p>
    ),
  },
]

export default function PrivacidadPage() {
  return (
    <LegalLayout
      titulo="Política de privacidad"
      migaja="Privacidad"
      intro="Herramatica está hecha para que puedas calcular sin dar tus datos. Aquí te contamos con detalle qué información se trata cuando usas el sitio, quién la recibe y cómo puedes controlarla."
      resumen={[
        'Las herramientas calculan en tu navegador: no vemos ni guardamos lo que escribes ni los archivos que cargas.',
        'No hay cuentas, registro ni formularios. Solo tenemos tu correo si nos escribes.',
        'Usamos Google Analytics para estadísticas de uso, y puedes rechazarlo. No usamos cookies de publicidad.',
        'No vendemos ni cedemos datos a nadie.',
      ]}
      secciones={secciones}
      otros={OTROS_LEGALES.filter((o) => o.href !== '/privacidad')}
    />
  )
}
