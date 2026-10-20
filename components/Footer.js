import Link from 'next/link'
import { BotonConfigurarCookies } from '@/components/ConsentimientoCookies'
import { FACEBOOK_URL } from '@/lib/redes'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white mb-3">
              <span className="text-2xl">⚡</span>
              <span>Herramatica</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Herramientas online gratuitas en español. Rápidas, seguras y sin necesidad de registro.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-3">Categorías</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/generadores" className="hover:text-white transition-colors">
                  Generadores
                </Link>
              </li>
              <li>
                <Link href="/calculadoras" className="hover:text-white transition-colors">
                  Calculadoras
                </Link>
              </li>
              <li>
                <Link href="/texto" className="hover:text-white transition-colors">
                  Texto
                </Link>
              </li>
              <li>
                <Link href="/juegos" className="hover:text-white transition-colors">
                  Juegos
                </Link>
              </li>
              <li>
                <Link href="/convertidores" className="hover:text-white transition-colors">
                  Convertidores
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular tools */}
          <div>
            <h3 className="text-white font-semibold mb-3">Herramientas populares</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/texto-invisible" className="hover:text-white transition-colors">
                  Generador de Texto Invisible
                </Link>
              </li>
              <li>
                <Link href="/calculadora-edad" className="hover:text-white transition-colors">
                  Calculadora de Edad
                </Link>
              </li>
              <li>
                <Link href="/calculadora-porcentaje" className="hover:text-white transition-colors">
                  Calculadora de Porcentajes
                </Link>
              </li>
              <li>
                <Link href="/calcular-iva" className="hover:text-white transition-colors">
                  Calculadora de IVA
                </Link>
              </li>
              <li>
                <Link href="/generador-qr" className="hover:text-white transition-colors">
                  Generador de Código QR
                </Link>
              </li>
              <li>
                <Link href="/contador-palabras" className="hover:text-white transition-colors">
                  Contador de Palabras
                </Link>
              </li>
              <li>
                <Link href="/convertidor-moneda" className="hover:text-white transition-colors">
                  Convertidor de Moneda
                </Link>
              </li>
              <li>
                <Link href="/calcular-imc" className="hover:text-white transition-colors">
                  Calculadora de IMC
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacidad" className="hover:text-white transition-colors">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="hover:text-white transition-colors">
                  Términos
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-white transition-colors">
                  Cookies
                </Link>
              </li>
              <li>
                <BotonConfigurarCookies className="hover:text-white transition-colors text-left" />
              </li>
              <li>
                <Link href="/acerca" className="hover:text-white transition-colors">
                  Acerca de
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
          <p>© 2026 Herramatica.com — Todos los derechos reservados</p>
          <p className="mt-2">
            📧{' '}
            <a href="mailto:info@herramatica.com" className="hover:text-white transition-colors">
              info@herramatica.com
            </a>
          </p>
          <p className="mt-3">
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="me noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-white transition-colors"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
              </svg>
              Síguenos en Facebook
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
