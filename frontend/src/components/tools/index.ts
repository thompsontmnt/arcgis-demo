import { drawPolygonTool } from './drawPolygonTool'
import { selectTool } from './selectTool'

import type MapView from '@arcgis/core/views/MapView'

export type Tool = {
  id: string
  activate: (view: MapView) => void
  deactivate: () => void
}

export type ToolInitializer = (view: MapView) => Tool
export const defaultTools = {
  'draw-polygon': drawPolygonTool,
  select: selectTool,
}
