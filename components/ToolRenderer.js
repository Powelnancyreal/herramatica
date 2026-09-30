'use client'

import { toolComponents } from '@/tools/index'

// El registro usa next/dynamic; al elegir la herramienta desde un componente cliente, cada
// página descarga solo el chunk de su herramienta (el HTML se sigue prerenderizando en el build).
export default function ToolRenderer({ slug }) {
  const ToolComponent = toolComponents[slug]
  return ToolComponent ? <ToolComponent /> : null
}
