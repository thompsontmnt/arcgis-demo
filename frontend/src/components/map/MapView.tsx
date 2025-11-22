import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel'
import { Box } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'
import { useCallback, useMemo } from 'react'
import '@arcgis/map-components/components/arcgis-map'
import '@arcgis/map-components/components/arcgis-placement'
import '@arcgis/map-components'

import { listGeometriesGeometryGetOptions } from '@/api/client/@tanstack/react-query.gen'
import { useGraphicsLayer } from '@/hooks/useGraphicsLayer'

import { graphicsLayerAtom, sketchVMAtom, viewAtom } from './atoms'
import { GraphicInfoPanel } from './GraphicInfoPanel'
import Toolbar from './Toolbar'
import { convertFeatureToGraphic } from './utils/convertFeatureToGraphic'
import { simpleFillSymbol } from './utils/symbols'
import AddressSearch from '../ui/controls/AddressSearch'

import type { ArcgisMapCustomEvent } from '@arcgis/map-components'

export default function MapView() {
  const setViewAtom = useSetAtom(viewAtom)
  const setGraphicsLayer = useSetAtom(graphicsLayerAtom)
  const setSketchVM = useSetAtom(sketchVMAtom)

  const { data: geometries } = useQuery(listGeometriesGeometryGetOptions())

  const graphics = useMemo(() => {
    if (!Array.isArray(geometries)) return []
    return geometries.map(({ id, wkt, label }) =>
      convertFeatureToGraphic({
        id: id.toString(),
        geometry: wkt,
        attributes: { label },
        symbol: simpleFillSymbol,
      }),
    )
  }, [geometries])

  const { layer } = useGraphicsLayer({
    view: null,
    id: 'global-graphics',
    title: 'Global Graphics',
    graphics,
  })

  const handleReady = useCallback(
    (e: ArcgisMapCustomEvent<void>) => {
      const map = e.target
      const view = map.view

      setViewAtom(view)

      // Add layer to map if not already present
      if (view.map && !view.map.layers.includes(layer)) {
        view.map.add(layer)
      }
      setGraphicsLayer(layer)

      const sketch = new SketchViewModel({
        view,
        layer,
        defaultUpdateOptions: { tool: 'reshape', toggleToolOnClick: false },
      })
      setSketchVM(sketch)
    },
    [layer, setGraphicsLayer, setSketchVM, setViewAtom],
  )

  return (
    <arcgis-map
      basemap="satellite"
      zoom={4}
      center={[-98.5795, 39.8283]}
      onarcgisViewReadyChange={handleReady}
    >
      <arcgis-placement slot="top-left">
        <AddressSearch />
      </arcgis-placement>
      <arcgis-placement slot="top-right">
        <GraphicInfoPanel />
      </arcgis-placement>

      <Box
        position="absolute"
        bottom="5"
        left="50%"
        style={{ transform: 'translateX(-50%)' }}
      >
        <Toolbar />
      </Box>
    </arcgis-map>
  )
}
