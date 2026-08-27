'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

// ─── Content types ─────────────────────────────────────────────────
const TYPES = [
  { id: 'texto', label: 'Texto / URL', icon: '🔗' },
  { id: 'wifi', label: 'WiFi', icon: '📶' },
  { id: 'email', label: 'Email', icon: '✉️' },
  { id: 'telefono', label: 'Teléfono', icon: '📞' },
  { id: 'sms', label: 'SMS', icon: '💬' },
  { id: 'whatsapp', label: 'WhatsApp', icon: '🟢' },
  { id: 'vcard', label: 'Contacto', icon: '👤' },
]

const SIZES = [200, 300, 400, 500, 600]

const ERROR_LEVELS = [
  { id: 'L', label: 'Baja (L) — ~7%' },
  { id: 'M', label: 'Media (M) — ~15%' },
  { id: 'Q', label: 'Alta (Q) — ~25%' },
  { id: 'H', label: 'Máxima (H) — ~30%' },
]

// Escapes reserved characters inside a WIFI: QR payload
function escapeWifi(s) {
  return s.replace(/([\\;,:"])/g, '\\$1')
}

// ─── Component ──────────────────────────────────────────────────────

export default function GeneradorQR() {
  const [type, setType] = useState('texto')

  const [texto, setTexto] = useState('')
  const [wifi, setWifi] = useState({ ssid: '', password: '', encryption: 'WPA', hidden: false })
  const [email, setEmail] = useState({ to: '', subject: '', body: '' })
  const [telefono, setTelefono] = useState('')
  const [sms, setSms] = useState({ numero: '', mensaje: '' })
  const [whatsapp, setWhatsapp] = useState({ numero: '', mensaje: '' })
  const [vcard, setVcard] = useState({ nombre: '', telefono: '', email: '', empresa: '' })

  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [size, setSize] = useState(300)
  const [errorLevel, setErrorLevel] = useState('M')
  const [logo, setLogo] = useState(null)
  const [logoName, setLogoName] = useState('')

  const [svgString, setSvgString] = useState('')
  const [error, setError] = useState('')
  const canvasRef = useRef(null)

  function getContent() {
    switch (type) {
      case 'texto':
        return texto.trim() || null

      case 'wifi': {
        if (!wifi.ssid.trim()) return null
        const pass = wifi.encryption === 'nopass' ? '' : escapeWifi(wifi.password)
        return `WIFI:T:${wifi.encryption};S:${escapeWifi(wifi.ssid)};P:${pass};H:${wifi.hidden ? 'true' : 'false'};;`
      }

      case 'email': {
        if (!email.to.trim()) return null
        const params = []
        if (email.subject) params.push(`subject=${encodeURIComponent(email.subject)}`)
        if (email.body) params.push(`body=${encodeURIComponent(email.body)}`)
        return `mailto:${email.to.trim()}${params.length ? '?' + params.join('&') : ''}`
      }

      case 'telefono':
        return telefono.trim() ? `tel:${telefono.trim()}` : null

      case 'sms':
        if (!sms.numero.trim()) return null
        return `sms:${sms.numero.trim()}${sms.mensaje ? '?body=' + encodeURIComponent(sms.mensaje) : ''}`

      case 'whatsapp': {
        if (!whatsapp.numero.trim()) return null
        const digits = whatsapp.numero.replace(/[^\d]/g, '')
        return `https://wa.me/${digits}${whatsapp.mensaje ? '?text=' + encodeURIComponent(whatsapp.mensaje) : ''}`
      }

      case 'vcard': {
        if (!vcard.nombre.trim()) return null
        let v = `BEGIN:VCARD\nVERSION:3.0\nFN:${vcard.nombre.trim()}\n`
        if (vcard.empresa.trim()) v += `ORG:${vcard.empresa.trim()}\n`
        if (vcard.telefono.trim()) v += `TEL:${vcard.telefono.trim()}\n`
        if (vcard.email.trim()) v += `EMAIL:${vcard.email.trim()}\n`
        v += 'END:VCARD'
        return v
      }

      default:
        return null
    }
  }

  const content = getContent()

  useEffect(() => {
    if (!content) {
      setSvgString('')
      const canvas = canvasRef.current
      if (canvas) canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)
      return
    }

    setError('')
    const opts = {
      width: size,
      margin: 1,
      errorCorrectionLevel: errorLevel,
      color: { dark: fgColor, light: bgColor },
    }

    QRCode.toCanvas(canvasRef.current, content, opts, (err) => {
      if (err) {
        setError('No se pudo generar el código QR. Revisa el contenido introducido.')
        return
      }
      if (logo && canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d')
        const img = new Image()
        img.onload = () => {
          const logoSize = size * 0.22
          const x = (size - logoSize) / 2
          const y = (size - logoSize) / 2
          const pad = logoSize * 0.12
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(x - pad, y - pad, logoSize + pad * 2, logoSize + pad * 2)
          ctx.drawImage(img, x, y, logoSize, logoSize)
        }
        img.src = logo
      }
    })

    QRCode.toString(
      content,
      { type: 'svg', margin: 1, errorCorrectionLevel: errorLevel, color: { dark: fgColor, light: bgColor } },
      (err, svg) => {
        if (!err) setSvgString(svg)
      }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, texto, wifi, email, telefono, sms, whatsapp, vcard, fgColor, bgColor, size, errorLevel, logo])

  function handleLogoUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('El logo debe ser un archivo de imagen.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('El logo no puede superar los 2 MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setLogo(reader.result)
      setLogoName(file.name)
      if (errorLevel === 'L' || errorLevel === 'M') setErrorLevel('H')
    }
    reader.readAsDataURL(file)
  }

  function removeLogo() {
    setLogo(null)
    setLogoName('')
  }

  function downloadPNG() {
    if (!content || !canvasRef.current) return
    const a = document.createElement('a')
    a.href = canvasRef.current.toDataURL('image/png')
    a.download = 'codigo-qr.png'
    a.click()
  }

  function downloadSVG() {
    if (!content || !svgString) return
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'codigo-qr.svg'
    a.click()
    URL.revokeObjectURL(url)
  }

  const inputClass =
    'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

  return (
    <div className="space-y-6">
      {/* Type tabs */}
      <div className="flex gap-2 flex-wrap">
        {TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => setType(t.id)}
            className={`px-3.5 py-2 rounded-lg font-semibold text-sm transition-all ${
              type === t.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Dynamic fields */}
      <div className="space-y-4">
        {type === 'texto' && (
          <div>
            <label className={labelClass}>Texto o URL</label>
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Ej: https://miweb.com o cualquier texto"
              rows={3}
              className={inputClass}
            />
          </div>
        )}

        {type === 'wifi' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nombre de la red (SSID)</label>
              <input
                type="text"
                value={wifi.ssid}
                onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })}
                placeholder="Ej: MiRedWiFi"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Tipo de seguridad</label>
              <select
                value={wifi.encryption}
                onChange={(e) => setWifi({ ...wifi, encryption: e.target.value })}
                className={inputClass}
              >
                <option value="WPA">WPA / WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">Red abierta (sin contraseña)</option>
              </select>
            </div>
            {wifi.encryption !== 'nopass' && (
              <div>
                <label className={labelClass}>Contraseña</label>
                <input
                  type="text"
                  value={wifi.password}
                  onChange={(e) => setWifi({ ...wifi, password: e.target.value })}
                  placeholder="Contraseña de la red"
                  className={inputClass}
                />
              </div>
            )}
            <label className="flex items-center gap-2 text-sm text-gray-700 sm:mt-7">
              <input
                type="checkbox"
                checked={wifi.hidden}
                onChange={(e) => setWifi({ ...wifi, hidden: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Red oculta
            </label>
          </div>
        )}

        {type === 'email' && (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Correo destinatario</label>
              <input
                type="email"
                value={email.to}
                onChange={(e) => setEmail({ ...email, to: e.target.value })}
                placeholder="ejemplo@correo.com"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Asunto (opcional)</label>
              <input
                type="text"
                value={email.subject}
                onChange={(e) => setEmail({ ...email, subject: e.target.value })}
                placeholder="Asunto del mensaje"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Mensaje (opcional)</label>
              <textarea
                value={email.body}
                onChange={(e) => setEmail({ ...email, body: e.target.value })}
                placeholder="Cuerpo del mensaje"
                rows={2}
                className={inputClass}
              />
            </div>
          </div>
        )}

        {type === 'telefono' && (
          <div>
            <label className={labelClass}>Número de teléfono</label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Ej: +34600000000"
              className={inputClass}
            />
          </div>
        )}

        {type === 'sms' && (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Número de teléfono</label>
              <input
                type="tel"
                value={sms.numero}
                onChange={(e) => setSms({ ...sms, numero: e.target.value })}
                placeholder="Ej: +34600000000"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Mensaje (opcional)</label>
              <textarea
                value={sms.mensaje}
                onChange={(e) => setSms({ ...sms, mensaje: e.target.value })}
                placeholder="Texto del SMS"
                rows={2}
                className={inputClass}
              />
            </div>
          </div>
        )}

        {type === 'whatsapp' && (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Número de WhatsApp (con prefijo de país)</label>
              <input
                type="tel"
                value={whatsapp.numero}
                onChange={(e) => setWhatsapp({ ...whatsapp, numero: e.target.value })}
                placeholder="Ej: 34600000000"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Mensaje predefinido (opcional)</label>
              <textarea
                value={whatsapp.mensaje}
                onChange={(e) => setWhatsapp({ ...whatsapp, mensaje: e.target.value })}
                placeholder="Hola, quería preguntarte..."
                rows={2}
                className={inputClass}
              />
            </div>
          </div>
        )}

        {type === 'vcard' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nombre completo</label>
              <input
                type="text"
                value={vcard.nombre}
                onChange={(e) => setVcard({ ...vcard, nombre: e.target.value })}
                placeholder="Ej: Ana García"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Empresa (opcional)</label>
              <input
                type="text"
                value={vcard.empresa}
                onChange={(e) => setVcard({ ...vcard, empresa: e.target.value })}
                placeholder="Nombre de la empresa"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Teléfono (opcional)</label>
              <input
                type="tel"
                value={vcard.telefono}
                onChange={(e) => setVcard({ ...vcard, telefono: e.target.value })}
                placeholder="Ej: +34600000000"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Email (opcional)</label>
              <input
                type="email"
                value={vcard.email}
                onChange={(e) => setVcard({ ...vcard, email: e.target.value })}
                placeholder="ejemplo@correo.com"
                className={inputClass}
              />
            </div>
          </div>
        )}
      </div>

      {/* Customization */}
      <div className="border-t border-gray-100 pt-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Personalización</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className={labelClass}>Color QR</label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-2 py-1.5 bg-white">
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
              />
              <span className="text-xs text-gray-500 uppercase">{fgColor}</span>
            </div>
          </div>
          <div>
            <label className={labelClass}>Color fondo</label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-2 py-1.5 bg-white">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
              />
              <span className="text-xs text-gray-500 uppercase">{bgColor}</span>
            </div>
          </div>
          <div>
            <label className={labelClass}>Tamaño</label>
            <select value={size} onChange={(e) => setSize(Number(e.target.value))} className={inputClass}>
              {SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}×{s}px
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Corrección de errores</label>
            <select value={errorLevel} onChange={(e) => setErrorLevel(e.target.value)} className={inputClass}>
              {ERROR_LEVELS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className={labelClass}>Logo en el centro (opcional)</label>
          <div className="flex items-center gap-3 flex-wrap">
            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm px-4 py-2 rounded-lg transition-colors">
              Elegir imagen
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
            {logoName && (
              <span className="text-sm text-gray-500 flex items-center gap-2">
                {logoName}
                <button onClick={removeLogo} className="text-red-500 hover:text-red-700 font-medium">
                  Quitar
                </button>
              </span>
            )}
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Preview */}
      <div className="flex flex-col items-center gap-4 border-t border-gray-100 pt-6">
        <div className="relative bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-center min-h-[220px] w-full max-w-[320px]">
          <canvas ref={canvasRef} className="max-w-full h-auto" />
          {!content && (
            <p className="absolute text-sm text-gray-400 text-center px-6">
              Introduce el contenido para generar tu código QR
            </p>
          )}
        </div>

        <div className="flex gap-3 w-full max-w-[320px]">
          <button
            onClick={downloadPNG}
            disabled={!content}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
          >
            Descargar PNG
          </button>
          <button
            onClick={downloadSVG}
            disabled={!content}
            className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed text-gray-700 font-semibold py-2.5 px-4 rounded-lg transition-colors"
          >
            Descargar SVG
          </button>
        </div>
      </div>
    </div>
  )
}
