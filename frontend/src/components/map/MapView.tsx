import { Box, Flex } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { useAtom, useSetAtom } from 'jotai'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import '@arcgis/map-components/components/arcgis-map'
import '@arcgis/map-components/components/arcgis-placement'

import { listGeometriesGeometryGetOptions } from '@/api/client/@tanstack/react-query.gen'
import { useDeleteSelectedGeometry } from '@/hooks/useDeleteGeometry'

import { graphicsLayerAtom, viewAtom } from './atoms'
import { DEFAULT_CENTER, DEFAULT_ZOOM, MINIMUM_MAP_ZOOM } from './constants'
import { GraphicInfoPanel } from './GraphicInfoPanel'
import { GraphicsListPanel } from './GraphicListPanel'
import Toolbar from './Toolbar'
import { createGraphicFromWkt } from './utils/createGraphicFromWkt'
import { createGraphicsLayer } from './utils/createGraphicsLayer'
import { simpleFillSymbol } from './utils/symbols'
import AddressSearch from '../ui/AddressSearch'

import type { ArcgisMapCustomEvent } from '@arcgis/map-components'

export default function MapView() {
  const [view, setView] = useAtom(viewAtom)
  const setGraphicsLayer = useSetAtom(graphicsLayerAtom)

  const { data: geometries } = useQuery(listGeometriesGeometryGetOptions())
  const deleteModal = useDeleteSelectedGeometry()

  const graphics = useMemo(() => {
    if (!Array.isArray(geometries)) return []
    return geometries.map((geometry) =>
      createGraphicFromWkt({
        id: geometry.id.toString(),
        geometry: geometry.wkt,
        attributes: { ...geometry },
        symbol: simpleFillSymbol,
      }),
    )
  }, [geometries])

  const layerRef = useRef<ReturnType<typeof createGraphicsLayer> | null>(null)

  if (!layerRef.current) {
    layerRef.current = createGraphicsLayer('global-graphics', 'Global Graphics')
  }

  const { layer, sync } = layerRef.current

  // Add layer to map on mount
  useEffect(() => {
    if (!view) return
    view.map?.add(layer)
    return () => {
      view.map?.remove(layer)
    }
  }, [view, layer])

  // Sync graphics to layer
  useEffect(() => {
    sync(graphics)
  }, [graphics, sync])

  // Expose layer globally through Jotai
  useEffect(() => {
    setGraphicsLayer(layer)
  }, [layer])

  // Map ready handler
  const handleReady = useCallback(
    (e: ArcgisMapCustomEvent<void>) => {
      if (view) return

      const map = e.target
      const nextView = map.view

      nextView.goTo({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM })
      nextView.constraints = { minZoom: MINIMUM_MAP_ZOOM }

      setView(nextView)
      setGraphicsLayer(layer)
    },
    [layer, setView, setGraphicsLayer],
  )

  return (
    <>
      <arcgis-map basemap="satellite" onarcgisViewReadyChange={handleReady}>
        <arcgis-placement slot="top-left">
          <Flex direction="column" gap="2">
            <AddressSearch />
            <GraphicsListPanel graphics={graphics} />
          </Flex>
        </arcgis-placement>

        <arcgis-placement slot="top-right">
          <GraphicInfoPanel />
        </arcgis-placement>

        <Box
          position="absolute"
          bottom="5"
          className="left-1/2 -translate-x-1/2"
        >
          <Toolbar />
        </Box>
      </arcgis-map>

      {deleteModal}
    </>
  )
}
