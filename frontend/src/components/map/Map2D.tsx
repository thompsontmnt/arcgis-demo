import '@arcgis/map-components/components/arcgis-map'
import '@arcgis/map-components/components/arcgis-placement'
import { useAtom, useSetAtom } from 'jotai'
import { useCallback } from 'react'

import { graphicsLayerAtom, viewAtom } from './atoms'
import { DEFAULT_CENTER, DEFAULT_ZOOM, MINIMUM_MAP_ZOOM } from './constants'

import type { ArcgisMapCustomEvent } from '@arcgis/map-components'
import type { PropsWithChildren } from 'react'

export default function Map2D({ children }: PropsWithChildren) {
  const setView = useSetAtom(viewAtom)
  const [graphicsLayer] = useAtom(graphicsLayerAtom)

  const handleReady = useCallback(
    (e: ArcgisMapCustomEvent<void>) => {
      const mapEl = e.target
      const newView = mapEl.view

      newView.goTo({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM })
      newView.constraints = { minZoom: MINIMUM_MAP_ZOOM }

      if (graphicsLayer && !newView.map?.layers.includes(graphicsLayer)) {
        newView.map?.add(graphicsLayer)
      }

      setView(newView)
    },
    [graphicsLayer, setView],
  )

  return (
    <arcgis-map basemap="satellite" onarcgisViewReadyChange={handleReady}>
      {children}
    </arcgis-map>
  )
}
