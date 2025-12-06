import { Box, Flex } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'
import { useEffect, useMemo, useRef } from 'react'

import { listGeometriesGeometryGetOptions } from '@/api/client/@tanstack/react-query.gen'
import { useDeleteSelectedGeometry } from '@/hooks/useDeleteGeometry'

import { graphicsLayerAtom } from './atoms'
import { GraphicInfoPanel } from './GraphicInfoPanel'
import { GraphicsListPanel } from './GraphicListPanel'
import { HintOverlay } from './HintOverlay'
import MapViewContainer from './MapViewContainer'
import Toolbar from './Toolbar'
import { createGraphicFromWkt } from './utils/createGraphicFromWkt'
import { createGraphicsLayer } from './utils/createGraphicsLayer'
import { simpleFillSymbol } from './utils/symbols'
import AddressSearch from '../ui/AddressSearch'

export default function MapView() {
  const setGraphicsLayer = useSetAtom(graphicsLayerAtom)
  const deleteModal = useDeleteSelectedGeometry()
  const { data: geometries } = useQuery(listGeometriesGeometryGetOptions())

  // Graphics conversion
  const graphics = useMemo(() => {
    if (!Array.isArray(geometries)) return []
    return geometries.map((g) =>
      createGraphicFromWkt({
        id: g.id.toString(),
        geometry: g.wkt,
        attributes: { ...g },
        symbol: simpleFillSymbol,
      }),
    )
  }, [geometries])

  // Create layer once
  const layerRef = useRef(
    createGraphicsLayer('global-graphics', 'Global Graphics'),
  )
  const { layer, sync } = layerRef.current

  // Sync graphics to layer
  useEffect(() => {
    sync(graphics)
  }, [graphics, sync])

  // Provide layer via Jotai
  useEffect(() => {
    setGraphicsLayer(layer)
  }, [layer, setGraphicsLayer])

  return (
    <>
      <MapViewContainer>
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
      </MapViewContainer>

      <HintOverlay />
      {deleteModal}
    </>
  )
}
