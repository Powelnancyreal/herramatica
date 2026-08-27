import Link from 'next/link'

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
          <p>© 2025 Herramatica.com — Todos los derechos reservados</p>
        </div>
      </div>
    </footer>
  )
}
