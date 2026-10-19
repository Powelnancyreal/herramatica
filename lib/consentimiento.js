// Clave de localStorage con la elección del visitante sobre las cookies de analítica ('aceptadas' o 'rechazadas').
export const CLAVE_CONSENTIMIENTO = 'herramatica-cookies'

// Regiones donde la analítica empieza desactivada hasta que el visitante la acepte (RGPD y normas equivalentes):
// Espacio Económico Europeo, Reino Unido y Suiza.
export const REGION_CONSENTIMIENTO_PREVIO = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
  'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH',
]
