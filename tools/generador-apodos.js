'use client'

import { useState } from 'react'
import { barajar, enteroAleatorio } from '@/lib/calc/dev'
import { buttonClass, CopyButton, inputClass, Tabs } from '@/components/calc-ui'

const ESTILOS = [
  { id: 'carinosos', label: '💕 Cariñosos' },
  { id: 'graciosos', label: '😂 Graciosos' },
  { id: 'gamer', label: '🎮 Gamer' },
  { id: 'elegantes', label: '✨ Con estilo' },
]

// Apodos tradicionales en español para nombres frecuentes.
const HIPOCORISTICOS = {
  jose: ['Pepe', 'Chepe', 'Pepito'], francisco: ['Paco', 'Pancho', 'Curro'], guadalupe: ['Lupe', 'Lupita'],
  maria: ['Mari', 'Mayi'], manuel: ['Manolo', 'Manu'], ignacio: ['Nacho'], enrique: ['Quique'], jesus: ['Chuy', 'Chucho'],
  alejandro: ['Álex', 'Jandro'], alejandra: ['Ale', 'Jandra'], rosario: ['Charo', 'Chayo'], concepcion: ['Conchita', 'Concha'],
  dolores: ['Lola', 'Loles'], mercedes: ['Meche', 'Merche'], roberto: ['Beto', 'Rober'], alberto: ['Beto', 'Albert'],
  guillermo: ['Memo', 'Guille'], eduardo: ['Lalo', 'Edu'], antonio: ['Toño', 'Toni'], antonia: ['Toña', 'Toñi'],
  fernando: ['Fer', 'Nando'], fernanda: ['Fer', 'Fercha'], ricardo: ['Richi', 'Ricky'], rodrigo: ['Rodri', 'Rorro'],
  santiago: ['Santi', 'Chago'], sebastian: ['Sebas', 'Chano'], gabriela: ['Gaby', 'Gabi'], daniela: ['Dani'],
  daniel: ['Dani'], isabel: ['Isa', 'Chabela'], elizabeth: ['Eli', 'Liz', 'Betty'], margarita: ['Mago', 'Marga'],
  valentina: ['Vale', 'Tina'], camila: ['Cami', 'Mila'], natalia: ['Nati', 'Naty'], carlos: ['Charly', 'Carlitos'],
  luis: ['Lucho', 'Luisito'], jorge: ['Coque', 'Jorgito'], javier: ['Javi'], miguel: ['Migue', 'Mike'],
  sofia: ['Sofi'], lucia: ['Lu', 'Luchi'], ana: ['Anita', 'Anny'], andrea: ['Andy'], adriana: ['Adri'],
}

const quitarAcentos = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '')
const elegir = (l) => l[enteroAleatorio(0, l.length - 1)]

// Diminutivos según la terminación: Ana → Anita, Pablo → Pablito, José → Josecito, Carlos → Carlitos.
function diminutivos(n) {
  const sin = quitarAcentos(n)
  const r = []
  if (/a$/i.test(sin)) r.push(`${n.slice(0, -1)}ita`, `${n.slice(0, -1)}illa`)
  else if (/os$/i.test(sin)) r.push(`${n.slice(0, -2)}itos`)
  else if (/o$/i.test(sin)) r.push(`${n.slice(0, -1)}ito`, `${n.slice(0, -1)}illo`)
  else if (/e$/i.test(sin)) r.push(`${sin.slice(0, 1).toUpperCase()}${sin.slice(1)}cito`)
  const silaba = (n.match(/^[^aeiouáéíóú]*[aeiouáéíóú]/i) || [''])[0]
  if (silaba.length >= 2) r.push(`${silaba}${silaba.toLowerCase()}`)
  return r
}

const GENERICOS = {
  carinosos: ['Corazón', 'Cariño', 'Bombón', 'Cielito', 'Solecito', 'Terrón de azúcar', 'Osito', 'Pichoncito', 'Mi vida', 'Tesoro', 'Chiquitín', 'Muñeca'],
  graciosos: ['Chispitas', 'Torbellino', 'Pulga', 'Cacahuate', 'Frijolito', 'Tamalito', 'Güero', 'Pelón', 'Chaparro', 'Mapache', 'Siestas', 'Terremoto'],
  gamer: ['xXShadowXx', 'NeoStorm', 'LordPixel', 'ZeroGG', 'NinjaRex', 'CapitánOP', 'DarkNova99', 'MrLag', 'TóxicoMX', 'ProSniper777', 'NovaLegend', 'StormKiller'],
  elegantes: ['Aurora', 'Brisa', 'Luna de Plata', 'Estrella', 'Duque', 'Dama', 'Sol de Oro', 'Vibes', 'Musa', 'Nube', 'Cometa', 'Faro'],
}

function generar(nombre, estilo) {
  const limpio = nombre.trim().split(/\s+/)[0] || ''
  if (!limpio) return barajar(GENERICOS[estilo])
  const N = limpio.charAt(0).toUpperCase() + limpio.slice(1).toLowerCase()
  const clave = quitarAcentos(N).toLowerCase()
  const tradicionales = HIPOCORISTICOS[clave] || []
  const corto = N.length > 4 ? N.slice(0, Math.max(3, Math.ceil(N.length / 2))) : N
  const ascii = quitarAcentos(N)
  let lista = []
  if (estilo === 'carinosos') {
    lista = [...tradicionales, ...diminutivos(N), `${corto}i`, `Mi ${elegir(['cielo', 'sol', 'vida', 'tesoro'])} ${N}`, ...GENERICOS.carinosos.slice(0, 6)]
  } else if (estilo === 'graciosos') {
    lista = [...tradicionales.map((t) => `${t} el Terrible`), `${N}zilla`, `${corto}nator`, `${corto}tronic`, `${N} Maravilla`, `Súper ${N}`, `${corto}zote`, `${N} Supremo`, ...GENERICOS.graciosos.slice(0, 6)]
  } else if (estilo === 'gamer') {
    const pre = ['xX', 'Dark', 'Shadow', 'Pro', 'Neo', 'Mr', 'Lord', 'Capitán', 'Ninja', 'Tóxico', 'Nova', 'Zero']
    const suf = ['Xx', 'MX', '_YT', 'GG', '777', '_TTV', 'Legend', 'Killer', 'Rex', 'Storm', 'OP', '99']
    lista = Array.from({ length: 14 }, () => {
      const t = enteroAleatorio(0, 3)
      if (t === 0) return `${elegir(pre)}${ascii}${elegir(suf)}`
      if (t === 1) return `${ascii}_${elegir(suf)}`
      if (t === 2) return `${elegir(pre)}_${ascii.slice(0, 4)}${enteroAleatorio(10, 99)}`
      return `${[...ascii].map((c, i) => (i % 2 ? c.toUpperCase() : c.toLowerCase())).join('')}${enteroAleatorio(1, 999)}`
    })
  } else {
    lista = [...tradicionales, `${N} de Oro`, `Lady ${N}`, `Don ${N}`, `${N} ${elegir(['Luz', 'Estrella', 'Aurora', 'Brisa', 'Sol'])}`, `${corto}ette`, `${ascii.toUpperCase()}`, `${N}.`, `${N}_oficial`, `La ${N}`, `El ${N}`, `${N} Vibes`, `Soy ${N}`, `${corto}`]
  }
  return barajar([...new Set(lista.filter((x) => x && x.trim().length > 1))]).slice(0, 12)
}

export default function GeneradorApodos() {
  const [nombre, setNombre] = useState('')
  const [estilo, setEstilo] = useState('carinosos')
  const [apodos, setApodos] = useState([])

  const crear = (e) => {
    e?.preventDefault()
    setApodos(generar(nombre, estilo))
  }

  return (
    <div className="space-y-5">
      <form onSubmit={crear} className="space-y-4">
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} className={inputClass} placeholder="Escribe un nombre (opcional): Guadalupe, Francisco, Ana…" maxLength={30} />
        <Tabs tabs={ESTILOS} value={estilo} onChange={(v) => { setEstilo(v); setApodos(generar(nombre, v)) }} />
        <button type="submit" className={buttonClass}>Generar apodos</button>
      </form>
      {apodos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {apodos.map((a) => (
            <div key={a} className="flex justify-between items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
              <span className="font-semibold text-gray-900 break-all">{a}</span>
              <CopyButton text={a} />
            </div>
          ))}
        </div>
      )}
      {apodos.length > 0 && <p className="text-xs text-gray-500">¿No te convencen? Pulsa otra vez: cada vez salen combinaciones distintas.</p>}
    </div>
  )
}
