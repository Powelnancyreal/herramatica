Si vendes productos o servicios en México, tarde o temprano tendrás que emitir una factura a alguien que no te da su RFC. Para esos casos, el SAT definió dos claves especiales: el **RFC genérico nacional** y el **RFC genérico extranjero**. Usarlos bien evita que tus facturas sean rechazadas; usarlos mal puede costarte una multa. Aquí te explicamos qué son, cuándo usar cada uno y cómo llenar el CFDI 4.0.

> **Respuesta rápida:** el RFC genérico es una clave que sustituye al RFC del cliente cuando este no lo proporciona. Para clientes en México se usa **XAXX010101000** (público en general) y para clientes residentes en el extranjero sin RFC mexicano, **XEXX010101000**. Las facturas con RFC genérico llevan uso de CFDI **S01 (sin efectos fiscales)**, así que el comprador no puede deducirlas.

## Qué es el RFC genérico

El RFC genérico es una clave de 13 caracteres que el SAT acepta en el campo del receptor de una factura electrónica cuando la operación no se hace con un contribuyente identificado. No pertenece a ninguna persona: es una etiqueta que le indica al SAT que la venta fue con alguien que no requiere comprobante a su nombre.

| Clave | Nombre común | Para quién |
|---|---|---|
| XAXX010101000 | RFC genérico nacional o RFC público en general | Personas en México que no te dan RFC y operaciones con el público en general |
| XEXX010101000 | RFC genérico extranjero | Residentes en el extranjero sin RFC mexicano |

## Cuándo usar el RFC genérico nacional (XAXX010101000)

Usa la clave **XAXX010101000** en dos situaciones:

1. **Factura global.** Si vendes a muchas personas que no piden factura, por ejemplo en una tienda o restaurante, al final del día, la semana, el mes o el bimestre emites una **factura global** que agrupa todas esas ventas. Esa factura se emite al RFC genérico.
2. **Un cliente concreto que no quiere dar sus datos.** Si una persona te pide un comprobante pero no te proporciona su RFC, puedes emitir la factura con la clave genérica, sabiendo que no podrá deducirla.

### Cómo se llena el CFDI 4.0 con RFC genérico nacional

| Campo del receptor | Valor |
|---|---|
| RFC | XAXX010101000 |
| Nombre | PUBLICO EN GENERAL (en mayúsculas y sin acento) |
| Código postal | El mismo código postal del emisor |
| Régimen fiscal | 616 · Sin obligaciones fiscales |
| Uso del CFDI | S01 · Sin efectos fiscales |

En la factura global se añade además el nodo de información global con la periodicidad (diaria, semanal, quincenal, mensual o bimestral), el mes y el año de las operaciones que ampara.

## Cuándo usar el RFC genérico extranjero (XEXX010101000)

La clave **XEXX010101000** es para operaciones con personas o empresas **residentes en el extranjero** que no tienen RFC en México, por ejemplo cuando exportas un servicio de diseño a un cliente en Estados Unidos.

A diferencia del genérico nacional, en este caso debes identificar al cliente: el CFDI incluye su **nombre o razón social**, su **país de residencia fiscal** y su **número de registro de identificación fiscal** en ese país. El código postal del receptor es el del emisor, el régimen es 616 y el uso del CFDI es S01.

## Ejemplo práctico

Una cafetería en Guadalajara vende $85,000 en octubre a clientes que no pidieron factura. Al cierre del mes, dentro del plazo que fija la Resolución Miscelánea Fiscal, emite una factura global con:

- RFC del receptor: XAXX010101000 y nombre PUBLICO EN GENERAL.
- Código postal del receptor: el de la cafetería.
- Periodicidad mensual, mes 10, año 2026.
- Un concepto por cada ticket o grupo de tickets, con el IVA desglosado.

El mismo mes, una clienta pide factura de su consumo de $420 y da su RFC: esa venta se factura a su nombre y **no** se incluye en la global.

## Errores comunes con el RFC genérico

- **Usarlo con un cliente que sí necesita deducir.** Si una empresa te pide factura, necesitas su RFC con homoclave real; con el genérico no podrá deducir el gasto. Si tu cliente no recuerda su clave, puede consultarla como explicamos en [qué es la homoclave del RFC](/blog/homoclave-del-rfc).
- **Escribir otro nombre con XAXX010101000.** El nombre debe ser exactamente PUBLICO EN GENERAL; cualquier variación hace que la factura sea rechazada.
- **Poner el código postal del cliente.** En las facturas con RFC genérico va el código postal del emisor.
- **Usar el genérico extranjero para clientes nacionales.** XEXX010101000 es solo para residentes en el extranjero.
- **Duplicar ventas.** Una venta facturada a nombre de un cliente no debe aparecer también en la factura global.

## RFC genérico frente a RFC personal

El RFC genérico no sustituye la obligación de inscribirte si tú eres quien vende o trabaja: necesitas tu propio RFC para facturar y para que tu patrón timbre tu nómina. Si aún no lo tienes, sigue los pasos de [cómo sacar mi RFC por primera vez](/blog/como-sacar-mi-rfc). Y si solo quieres saber cómo queda la clave base de una persona a partir de su nombre y fecha de nacimiento, usa nuestra [calculadora de RFC](/calcular-rfc).
