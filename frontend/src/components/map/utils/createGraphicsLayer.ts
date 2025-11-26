import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'

import type Graphic from '@arcgis/core/Graphic'

/**
 * Creates a persistent GraphicsLayer and exposes helpers
 * to sync graphics with it.
 */
export function createGraphicsLayer(id: string, title: string) {
  const layer = new GraphicsLayer({ id, title })

  return {
    layer,

    sync(graphics: Array<Graphic>) {
      layer.removeAll()
      if (graphics.length) layer.addMany(graphics)
    },
  }
}
