import { enteroAleatorio, uuidv4 } from './dev.js'

export const NOMBRES_H = ['José', 'Luis', 'Juan', 'Carlos', 'Miguel', 'Jorge', 'Alejandro', 'Diego', 'Fernando', 'Ricardo', 'Andrés', 'Javier', 'Daniel', 'Sergio', 'Pablo', 'Emilio', 'Mateo', 'Santiago', 'Sebastián', 'Tomás', 'Héctor', 'Raúl', 'Óscar', 'Iván', 'Adrián', 'Gabriel', 'Rodrigo', 'Eduardo', 'Arturo', 'Manuel']
export const NOMBRES_M = ['María', 'Guadalupe', 'Ana', 'Sofía', 'Valentina', 'Camila', 'Daniela', 'Fernanda', 'Lucía', 'Paula', 'Andrea', 'Mariana', 'Gabriela', 'Isabel', 'Carmen', 'Laura', 'Elena', 'Regina', 'Ximena', 'Renata', 'Natalia', 'Patricia', 'Verónica', 'Claudia', 'Rocío', 'Alejandra', 'Victoria', 'Julia', 'Martina', 'Adriana']
export const APELLIDOS = ['García', 'Hernández', 'Martínez', 'López', 'González', 'Pérez', 'Rodríguez', 'Sánchez', 'Ramírez', 'Cruz', 'Flores', 'Gómez', 'Morales', 'Vázquez', 'Reyes', 'Jiménez', 'Torres', 'Díaz', 'Gutiérrez', 'Ruiz', 'Mendoza', 'Aguilar', 'Ortiz', 'Castillo', 'Romero', 'Álvarez', 'Chávez', 'Ramos', 'Herrera', 'Medina', 'Vargas', 'Castro', 'Guerrero', 'Rojas', 'Navarro', 'Domínguez', 'Molina', 'Suárez', 'Delgado', 'Ortega']
export const CIUDADES = {
  mx: [['Ciudad de México', 'CDMX', '0'], ['Guadalajara', 'Jalisco', '44'], ['Monterrey', 'Nuevo León', '64'], ['Puebla', 'Puebla', '72'], ['Querétaro', 'Querétaro', '76'], ['Mérida', 'Yucatán', '97'], ['León', 'Guanajuato', '37'], ['Tijuana', 'Baja California', '22'], ['Cancún', 'Quintana Roo', '77'], ['Oaxaca', 'Oaxaca', '68']],
  es: [['Madrid', 'Madrid', '28'], ['Barcelona', 'Barcelona', '08'], ['Valencia', 'Valencia', '46'], ['Sevilla', 'Sevilla', '41'], ['Zaragoza', 'Zaragoza', '50'], ['Málaga', 'Málaga', '29'], ['Bilbao', 'Bizkaia', '48'], ['Granada', 'Granada', '18']],
  co: [['Bogotá', 'Cundinamarca', '11'], ['Medellín', 'Antioquia', '05'], ['Cali', 'Valle del Cauca', '76'], ['Barranquilla', 'Atlántico', '08'], ['Cartagena', 'Bolívar', '13']],
  ar: [['Buenos Aires', 'CABA', 'C1'], ['Córdoba', 'Córdoba', 'X5'], ['Rosario', 'Santa Fe', 'S2'], ['Mendoza', 'Mendoza', 'M5'], ['La Plata', 'Buenos Aires', 'B1']],
}
export const PAISES = [
  { id: 'mx', label: 'México', lada: '+52', dominio: 'com.mx' },
  { id: 'es', label: 'España', lada: '+34', dominio: 'es' },
  { id: 'co', label: 'Colombia', lada: '+57', dominio: 'com.co' },
  { id: 'ar', label: 'Argentina', lada: '+54', dominio: 'com.ar' },
]
const CALLES = ['Av. Juárez', 'Calle Hidalgo', 'Av. Reforma', 'Calle Morelos', 'Av. Insurgentes', 'Calle de la Paz', 'Calle Mayor', 'Av. de la Constitución', 'Calle Real', 'Av. Libertad', 'Calle Allende', 'Paseo de los Pinos']
const EMPRESAS_A = ['Grupo', 'Soluciones', 'Servicios', 'Comercializadora', 'Industrias', 'Consultores', 'Distribuidora', 'Tecnologías']
const EMPRESAS_B = ['Alfa', 'del Valle', 'Horizonte', 'Delta', 'Atlas', 'Sierra', 'Pacífico', 'Nova', 'Andina', 'Aurora']
// Dominios reservados para documentación y pruebas (RFC 2606): nunca pertenecen a nadie.
const DOMINIOS_EMAIL = ['example.com', 'example.org', 'example.net', 'correo.test', 'prueba.test']
const PUESTOS = ['Analista', 'Gerente de ventas', 'Desarrolladora', 'Contador', 'Diseñadora', 'Coordinador', 'Asistente administrativa', 'Ingeniero de soporte', 'Jefa de compras', 'Ejecutivo de cuenta']

const elegir = (lista) => lista[enteroAleatorio(0, lista.length - 1)]
const sinAcentos = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '')

export const CAMPOS = [
  { id: 'id', label: 'ID numérico' },
  { id: 'uuid', label: 'UUID' },
  { id: 'nombre', label: 'Nombre' },
  { id: 'apellidos', label: 'Apellidos' },
  { id: 'sexo', label: 'Sexo' },
  { id: 'email', label: 'Correo electrónico' },
  { id: 'telefono', label: 'Teléfono' },
  { id: 'fechaNacimiento', label: 'Fecha de nacimiento' },
  { id: 'edad', label: 'Edad' },
  { id: 'calle', label: 'Dirección' },
  { id: 'ciudad', label: 'Ciudad' },
  { id: 'estado', label: 'Estado o provincia' },
  { id: 'codigoPostal', label: 'Código postal' },
  { id: 'empresa', label: 'Empresa' },
  { id: 'puesto', label: 'Puesto' },
  { id: 'salario', label: 'Salario mensual' },
  { id: 'activo', label: 'Activo (booleano)' },
]

export function generarPersona(i, pais, campos) {
  const mujer = enteroAleatorio(0, 1) === 1
  const nombre = elegir(mujer ? NOMBRES_M : NOMBRES_H)
  const ap1 = elegir(APELLIDOS)
  const ap2 = elegir(APELLIDOS)
  const [ciudad, estado, prefijoCP] = elegir(CIUDADES[pais.id])
  // Fecha de nacimiento al azar entre 18 y 75 años atrás, y edad calculada a partir de ella.
  const hoy = new Date()
  const maxMs = Date.UTC(hoy.getUTCFullYear() - 18, hoy.getUTCMonth(), hoy.getUTCDate())
  const minMs = Date.UTC(hoy.getUTCFullYear() - 76, hoy.getUTCMonth(), hoy.getUTCDate() + 1)
  const nacimiento = new Date(minMs + Math.floor((enteroAleatorio(0, 1e6) / 1e6) * (maxMs - minMs)))
  const cumplioEsteAnio =
    hoy.getUTCMonth() > nacimiento.getUTCMonth() || (hoy.getUTCMonth() === nacimiento.getUTCMonth() && hoy.getUTCDate() >= nacimiento.getUTCDate())
  const edadReal = hoy.getUTCFullYear() - nacimiento.getUTCFullYear() - (cumplioEsteAnio ? 0 : 1)
  const digitos = (n) => Array.from({ length: n }, () => enteroAleatorio(0, 9)).join('')
  // Longitud del código postal: 5 en México y España, 6 en Colombia; en Argentina, CPA de letra + 4 dígitos.
  const largo = pais.id === 'co' ? 6 : 5
  const cp = pais.id === 'ar' ? `${prefijoCP}${digitos(3)}` : `${prefijoCP}${digitos(largo - prefijoCP.length)}`
  const valores = {
    id: i + 1,
    uuid: uuidv4(),
    nombre,
    apellidos: pais.id === 'mx' || pais.id === 'es' || pais.id === 'co' ? `${ap1} ${ap2}` : ap1,
    sexo: mujer ? 'M' : 'H',
    email: `${sinAcentos(nombre)}.${sinAcentos(ap1)}${enteroAleatorio(1, 99)}@${elegir(DOMINIOS_EMAIL)}`,
    telefono: `${pais.lada} ${
      {
        mx: `55 ${digitos(4)} ${digitos(4)}`,
        es: `6${digitos(2)} ${digitos(3)} ${digitos(3)}`,
        co: `3${digitos(2)} ${digitos(3)} ${digitos(4)}`,
        ar: `9 11 ${digitos(4)}-${digitos(4)}`,
      }[pais.id]
    }`,
    fechaNacimiento: nacimiento.toISOString().slice(0, 10),
    edad: edadReal,
    calle: `${elegir(CALLES)} ${enteroAleatorio(1, 999)}`,
    ciudad,
    estado,
    codigoPostal: cp,
    empresa: `${elegir(EMPRESAS_A)} ${elegir(EMPRESAS_B)}`,
    puesto: elegir(PUESTOS),
    salario: enteroAleatorio(80, 900) * 100,
    activo: enteroAleatorio(0, 4) > 0,
  }
  return Object.fromEntries(campos.map((c) => [c, valores[c]]))
}

export function aSQL(registros, tabla = 'personas') {
  if (!registros.length) return ''
  const cols = Object.keys(registros[0])
  const val = (v) => (typeof v === 'number' ? v : typeof v === 'boolean' ? (v ? 'TRUE' : 'FALSE') : `'${String(v).replace(/'/g, "''")}'`)
  return registros.map((r) => `INSERT INTO ${tabla} (${cols.join(', ')}) VALUES (${cols.map((c) => val(r[c])).join(', ')});`).join('\n')
}
