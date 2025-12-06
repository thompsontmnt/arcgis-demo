import '@arcgis/map-components/components/arcgis-scene'
import '@arcgis/map-components/components/arcgis-placement'
import { useAtom, useSetAtom } from 'jotai'
import { useCallback } from 'react'

import { graphicsLayerAtom, viewAtom } from './atoms'
import { DEFAULT_CENTER, DEFAULT_ZOOM, MINIMUM_MAP_ZOOM } from './constants'

import type { ArcgisSceneCustomEvent } from '@arcgis/map-components'
import type { PropsWithChildren } from 'react'

export default function Scene3D({ children }: PropsWithChildren) {
  const setView = useSetAtom(viewAtom)
  const [graphicsLayer] = useAtom(graphicsLayerAtom)

  const handleReady = useCallback(
    (e: ArcgisSceneCustomEvent<void>) => {
      const sceneEl = e.target as any
      const newView = sceneEl.view

      newView.goTo({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM })
      newView.constraints = { minZoom: MINIMUM_MAP_ZOOM }

      if (graphicsLayer && !newView.map.layers.includes(graphicsLayer)) {
        newView.map.add(graphicsLayer)

        graphicsLayer.elevationInfo = {
          mode: 'on-the-ground',
        }
      }

      setView(newView)
    },
    [graphicsLayer, setView],
  )

  return (
    <arcgis-scene
      basemap="satellite"
      onarcgisViewReadyChange={handleReady}
      quality-profile="high"
    >
      {children}
    </arcgis-scene>
  )
}
