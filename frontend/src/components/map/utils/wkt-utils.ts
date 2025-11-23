import * as projection from '@arcgis/core/geometry/projection'
import { arcgisToGeoJSON, geojsonToArcGIS } from '@terraformer/arcgis'
import { geojsonToWKT, wktToGeoJSON } from '@terraformer/wkt'

import type { Geometry } from '@arcgis/core/geometry'

export function arcgisToWkt(geometry: Geometry): string {
  const geographic = projection.project(geometry, {
    wkid: 4326,
  }) as Geometry

  const restJson = geographic.toJSON()

  const geojson = arcgisToGeoJSON(restJson)

  return geojsonToWKT(geojson)
}

export function wktToArcGIS(wkt: string): Geometry {
  if (!wkt) throw new Error('wktToArcGIS: Missing WKT')

  const geojson = wktToGeoJSON(wkt)

  const geom4326 = geojsonToArcGIS(geojson) as Geometry

  return projection.project(geom4326, { wkid: 3857 }) as Geometry
}
