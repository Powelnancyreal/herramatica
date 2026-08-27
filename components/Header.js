'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <span className="text-2xl">⚡</span>
            <span>Herramatica</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/generadores" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Generadores
            </Link>
            <Link href="/calculadoras" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Calculadoras
            </Link>
            <Link href="/texto" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Texto
            </Link>
            <Link href="/juegos" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Juegos
            </Link>
            <Link href="/convertidores" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Convertidores
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            <Link
              href="/generadores"
              className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Generadores
            </Link>
            <Link
              href="/calculadoras"
              className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Calculadoras
            </Link>
            <Link
              href="/texto"
              className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Texto
            </Link>
            <Link
              href="/juegos"
              className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Juegos
            </Link>
            <Link
              href="/convertidores"
              className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Convertidores
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
