import Graphic from '@arcgis/core/Graphic'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import MapView from '@arcgis/core/views/MapView'
import SceneView from '@arcgis/core/views/SceneView'
import { useEffect, useRef } from 'react'

export interface UseGraphicsLayerOptions {
  view: MapView | SceneView | null
  id: string
  title: string
  graphics: Graphic[]
}

export interface UseGraphicsLayerResult {
  layer: GraphicsLayer
}

export function useGraphicsLayer({
  view,
  id,
  title,
  graphics,
}: UseGraphicsLayerOptions): UseGraphicsLayerResult {
  const layerRef = useRef<GraphicsLayer>(new GraphicsLayer({ id, title }))
  const layer = layerRef.current

  // Mount/unmount lifecycle
  useEffect(() => {
    const map = view?.map
    if (!map) return
    map.add(layer)
    return () => {
      map.remove(layer)
    }
  }, [view, layer])

  // Populate graphics
  useEffect(() => {
    layer.removeAll()
    if (graphics?.length) layer.addMany(graphics)
  }, [graphics, layer])

  return {
    layer,
  }
}
