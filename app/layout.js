import Script from 'next/script'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/seo'
import { generateOrganizationSchema, generateSiteSchema } from '@/lib/schema'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Herramientas Online Gratuitas en Español`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  manifest: '/manifest.json',
  openGraph: {
    siteName: SITE_NAME,
    description: SITE_DESCRIPTION,
    locale: 'es',
    alternateLocale: ['es_MX', 'es_AR', 'es_CO', 'es_PE', 'es_CL', 'es_ES'],
    type: 'website',
    images: [
      {
        url: 'https://herramatica.com/images/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Herramatica - Herramientas online gratuitas en español',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Herramatica | Herramientas Online Gratuitas en Español',
    description:
      'Más de 90 herramientas online gratuitas en español: calculadoras, generadores, convertidores y más. Sin registro, sin límites.',
    images: ['https://herramatica.com/images/og-image.webp'],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.webp', type: 'image/webp' },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'P5lO-TSNtcjGwlBEiBI9YyKxqxFn9Pd5Xl1WxHQ_X0k',
  },
}

export default function RootLayout({ children }) {
  const organizationSchema = generateOrganizationSchema()
  const siteSchema = generateSiteSchema()

  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
        {/* Google tag (gtag.js) */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-EJC91PS2KH" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EJC91PS2KH');
          `}
        </Script>

        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  )
}
