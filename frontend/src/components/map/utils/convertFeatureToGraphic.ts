import type { Geometry } from '@arcgis/core/geometry'
import * as jsonUtils from '@arcgis/core/geometry/support/jsonUtils.js'
import Graphic from '@arcgis/core/Graphic'
import { geojsonToArcGIS } from '@terraformer/arcgis'
import { wktToGeoJSON } from '@terraformer/wkt'

type WktString = string

export interface Feature {
  id?: string
  geometry: WktString | Geometry
  attributes?: Record<string | number | symbol, unknown>
  symbol?: __esri.Graphic['symbol']
}

export function convertFeatureToGraphic({
  id,
  geometry,
  attributes,
  symbol,
}: Feature): Graphic {
  return new Graphic({
    attributes: {
      externalId: id,
      ...attributes,
    },
    geometry:
      typeof geometry === 'string'
        ? jsonUtils.fromJSON(geojsonToArcGIS(wktToGeoJSON(geometry)))
        : geometry,
    symbol,
  })
}
