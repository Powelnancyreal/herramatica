import TextoInvisible from './texto-invisible'
import CalculadoraEdad from './calculadora-edad'
import CalculadoraRFC from './calcular-rfc'
import CalculadoraIMC from './calcular-imc'
import CalculadoraAlicia from './calculadora-alicia'
import GeneradorQR from './generador-qr'
import CalculadoraHoras from './calculadora-horas'
import CalculadoraCientifica from './calculadora-cientifica'
import CalculadoraFiniquito from './calculadora-finiquito'
import CalculadoraISR from './calculadora-isr'
import CalcularAguinaldo from './calcular-aguinaldo'
import CalculadoraDias from './calculadora-dias'
import CalcularIVA from './calcular-iva'
import CalculoMental from './calculo-mental'
import CalcularCURP from './calcular-curp'
import CalculadoraPorcentaje from './calculadora-porcentaje'
import ConvertidorMoneda from './convertidor-moneda'
import GeneradorContrasenas from './generador-contrasenas'
import ContadorPalabras from './contador-palabras'
import CalculadoraPropinas from './calculadora-propinas'
import CalculadoraPrestamo from './calculadora-prestamo'
import ConvertidorUnidades from './convertidor-unidades'
import GeneradorNombres from './generador-nombres'
import ConvertidorImagenes from './convertidor-imagenes'
import ImagenesAPDF from './imagenes-a-pdf'
import ConvertidorNumerosALetras from './convertidor-numeros-a-letras'
import ConvertidorFracciones from './convertidor-fracciones'
import ConvertidorMayusculasMinusculas from './convertidor-mayusculas-minusculas'
import ConvertidorBinario from './convertidor-binario'
import CalculadoraIRPF from './calculadora-irpf'
import CalcularHipoteca from './calcular-hipoteca'
import CalcularLetraDNI from './calcular-letra-dni'
import CalculoPensionJubilacion from './calculo-pension-jubilacion'
import CalculadoraApiretal from './calculadora-apiretal'
import CalculadoraDelAmor from './calculadora-del-amor'
import CalcularNIT from './calcular-nit'
import CalcularCUIL from './calcular-cuil'
import CalcularRUT from './calcular-rut'
import CalcularAreaCirculo from './calcular-area-circulo'
import CalcularHexadecimalADecimal from './calcular-hexadecimal-a-decimal'
import CalcularVelocidadDistanciaTiempo from './calcular-velocidad-distancia-tiempo'
import CalcularGasolina from './calcular-gasolina'
import CalcularVolumenCilindro from './calcular-volumen-cilindro'
import CalcularRitmo from './calcular-ritmo'
import CronometroOnline from './cronometro-online'
import PalabrasAlReves from './palabras-al-reves'
import CelsiusAFahrenheit from './celsius-a-fahrenheit'
import BarAPsi from './bar-a-psi'
import MedidasDeCocina from './medidas-de-cocina'
import TipografiaParaInstagram from './tipografia-para-instagram'
import CmAPulgadas from './cm-a-pulgadas'
import ArrobaAKilos from './arroba-a-kilos'
import CalculadoraTiempoLectura from './calculadora-tiempo-lectura'
import CalcularIndemnizacionDespido from './calcular-indemnizacion-despido'
import CalcularSacArgentina from './calcular-sac-argentina'
import CalculadoraAlquilerArgentina from './calculadora-alquiler-argentina'
import CalculadoraPlazoFijo from './calculadora-plazo-fijo'
import CalculadoraInteresCompuesto from './calculadora-interes-compuesto'
import CalculadoraSueldoNetoArgentina from './calculadora-sueldo-neto-argentina'
import CalculadoraArea from './calculadora-area'
import CalculadoraVolumen from './calculadora-volumen'
import CalculadoraCalculosCombinados from './calculadora-calculos-combinados'
import CalculadoraResistencias from './calculadora-resistencias'
import CalculadoraCalorias from './calculadora-calorias'
import CalculadoraEmbarazo from './calculadora-embarazo'
import CalculadoraPesoIdeal from './calculadora-peso-ideal'
import CalculadoraCiclosSueno from './calculadora-ciclos-sueno'
import CalculadoraDeEscalas from './calculadora-de-escalas'
import SopaDeLetras from './sopa-de-letras'
import GeneradorDeLetrasGrandes from './generador-de-letras-grandes'
import GeneradorCodigoDeBarras from './generador-codigo-de-barras'
import GeneradorDeCrucigramas from './generador-de-crucigramas'
import GeneradorDeNombresParaFreeFire from './generador-de-nombres-para-free-fire'
import GeneradorDeLinkDeWhatsapp from './generador-de-link-de-whatsapp'
import CalculadoraEngagementInstagram from './calculadora-engagement-instagram'
import CalculadorDeHorarios from './calculador-de-horarios'
import HexadecimalATexto from './hexadecimal-a-texto'
import RuletaAleatoriaOnline from './ruleta-aleatoria-online'
import CalculadoraPromedioPonderado from './calculadora-promedio-ponderado'
import CalculadoraCtsPeru from './calculadora-cts-peru'
import CalcularGratificacionPeru from './calcular-gratificacion-peru'
import CalculadoraDeIgv from './calculadora-de-igv'
import CalcularDetraccion from './calcular-detraccion'
import CalculadoraDeMatrices from './calculadora-de-matrices'
import CalculadoraDeEcuaciones from './calculadora-de-ecuaciones'
import CalculadoraPreciosInfluencersTiktok from './calculadora-precios-influencers-tiktok'
import CalculadoraIp from './calculadora-ip'
import CalculadoraReglaDeTres from './calculadora-regla-de-tres'
import CalculadoraDePendiente from './calculadora-de-pendiente'
import CalculadoraDerivadasIntegrales from './calculadora-derivadas-integrales'
import CalculadoraLdl from './calculadora-ldl'
import CalculadoraPafi from './calculadora-pafi'
import IndiceDeBarthel from './indice-de-barthel'
import CalculadoraLiquidacionLaboralColombia from './calculadora-liquidacion-laboral-colombia'
import CalculadoraSeguridadSocialColombia from './calculadora-seguridad-social-colombia'
import CalculadoraCdt from './calculadora-cdt'

// Registry: add new tools here as { slug: Component }
export const toolComponents = {
  'texto-invisible': TextoInvisible,
  'calculadora-edad': CalculadoraEdad,
  'calcular-rfc': CalculadoraRFC,
  'calcular-imc': CalculadoraIMC,
  'calculadora-alicia': CalculadoraAlicia,
  'generador-qr': GeneradorQR,
  'calculadora-horas': CalculadoraHoras,
  'calculadora-cientifica': CalculadoraCientifica,
  'calculadora-finiquito': CalculadoraFiniquito,
  'calculadora-isr': CalculadoraISR,
  'calcular-aguinaldo': CalcularAguinaldo,
  'calculadora-dias': CalculadoraDias,
  'calcular-iva': CalcularIVA,
  'calculo-mental': CalculoMental,
  'calcular-curp': CalcularCURP,
  'calculadora-porcentaje': CalculadoraPorcentaje,
  'convertidor-moneda': ConvertidorMoneda,
  'generador-contrasenas': GeneradorContrasenas,
  'contador-palabras': ContadorPalabras,
  'calculadora-propinas': CalculadoraPropinas,
  'calculadora-prestamo': CalculadoraPrestamo,
  'convertidor-unidades': ConvertidorUnidades,
  'generador-nombres': GeneradorNombres,
  'convertidor-imagenes': ConvertidorImagenes,
  'imagenes-a-pdf': ImagenesAPDF,
  'convertidor-numeros-a-letras': ConvertidorNumerosALetras,
  'convertidor-fracciones': ConvertidorFracciones,
  'convertidor-mayusculas-minusculas': ConvertidorMayusculasMinusculas,
  'convertidor-binario': ConvertidorBinario,
  'calculadora-irpf': CalculadoraIRPF,
  'calcular-hipoteca': CalcularHipoteca,
  'calcular-letra-dni': CalcularLetraDNI,
  'calculo-pension-jubilacion': CalculoPensionJubilacion,
  'calculadora-apiretal': CalculadoraApiretal,
  'calculadora-del-amor': CalculadoraDelAmor,
  'calcular-nit': CalcularNIT,
  'calcular-cuil': CalcularCUIL,
  'calcular-rut': CalcularRUT,
  'calcular-area-circulo': CalcularAreaCirculo,
  'calcular-hexadecimal-a-decimal': CalcularHexadecimalADecimal,
  'calcular-velocidad-distancia-tiempo': CalcularVelocidadDistanciaTiempo,
  'calcular-gasolina': CalcularGasolina,
  'calcular-volumen-cilindro': CalcularVolumenCilindro,
  'calcular-ritmo': CalcularRitmo,
  'cronometro-online': CronometroOnline,
  'palabras-al-reves': PalabrasAlReves,
  'celsius-a-fahrenheit': CelsiusAFahrenheit,
  'bar-a-psi': BarAPsi,
  'medidas-de-cocina': MedidasDeCocina,
  'tipografia-para-instagram': TipografiaParaInstagram,
  'cm-a-pulgadas': CmAPulgadas,
  'arroba-a-kilos': ArrobaAKilos,
  'calculadora-tiempo-lectura': CalculadoraTiempoLectura,
  'calcular-indemnizacion-despido': CalcularIndemnizacionDespido,
  'calcular-sac-argentina': CalcularSacArgentina,
  'calculadora-alquiler-argentina': CalculadoraAlquilerArgentina,
  'calculadora-plazo-fijo': CalculadoraPlazoFijo,
  'calculadora-interes-compuesto': CalculadoraInteresCompuesto,
  'calculadora-sueldo-neto-argentina': CalculadoraSueldoNetoArgentina,
  'calculadora-area': CalculadoraArea,
  'calculadora-volumen': CalculadoraVolumen,
  'calculadora-calculos-combinados': CalculadoraCalculosCombinados,
  'calculadora-resistencias': CalculadoraResistencias,
  'calculadora-calorias': CalculadoraCalorias,
  'calculadora-embarazo': CalculadoraEmbarazo,
  'calculadora-peso-ideal': CalculadoraPesoIdeal,
  'calculadora-ciclos-sueno': CalculadoraCiclosSueno,
  'calculadora-de-escalas': CalculadoraDeEscalas,
  'sopa-de-letras': SopaDeLetras,
  'generador-de-letras-grandes': GeneradorDeLetrasGrandes,
  'generador-codigo-de-barras': GeneradorCodigoDeBarras,
  'generador-de-crucigramas': GeneradorDeCrucigramas,
  'generador-de-nombres-para-free-fire': GeneradorDeNombresParaFreeFire,
  'generador-de-link-de-whatsapp': GeneradorDeLinkDeWhatsapp,
  'calculadora-engagement-instagram': CalculadoraEngagementInstagram,
  'calculador-de-horarios': CalculadorDeHorarios,
  'hexadecimal-a-texto': HexadecimalATexto,
  'ruleta-aleatoria-online': RuletaAleatoriaOnline,
  'calculadora-promedio-ponderado': CalculadoraPromedioPonderado,
  'calculadora-cts-peru': CalculadoraCtsPeru,
  'calcular-gratificacion-peru': CalcularGratificacionPeru,
  'calculadora-de-igv': CalculadoraDeIgv,
  'calcular-detraccion': CalcularDetraccion,
  'calculadora-de-matrices': CalculadoraDeMatrices,
  'calculadora-de-ecuaciones': CalculadoraDeEcuaciones,
  'calculadora-precios-influencers-tiktok': CalculadoraPreciosInfluencersTiktok,
  'calculadora-ip': CalculadoraIp,
  'calculadora-regla-de-tres': CalculadoraReglaDeTres,
  'calculadora-de-pendiente': CalculadoraDePendiente,
  'calculadora-derivadas-integrales': CalculadoraDerivadasIntegrales,
  'calculadora-ldl': CalculadoraLdl,
  'calculadora-pafi': CalculadoraPafi,
  'indice-de-barthel': IndiceDeBarthel,
  'calculadora-liquidacion-laboral-colombia': CalculadoraLiquidacionLaboralColombia,
  'calculadora-seguridad-social-colombia': CalculadoraSeguridadSocialColombia,
  'calculadora-cdt': CalculadoraCdt,
}
