import * as projection from '@arcgis/core/geometry/projection'
import { arcgisToGeoJSON, geojsonToArcGIS } from '@terraformer/arcgis'
import { geojsonToWKT, wktToGeoJSON } from '@terraformer/wkt'

import type { Geometry } from '@arcgis/core/geometry'

/**
 * ArcGIS Geometry → WKT
 */

export function arcgisToWkt(geometry: Geometry): string {
  // 1. Project geometry to WGS84 (EPSG:4326)
  const geographic = projection.project(geometry, {
    wkid: 4326,
  }) as Geometry

  // 2. Convert to REST JSON
  const restJson = geographic.toJSON()

  // 3. Convert REST JSON → GeoJSON
  const geojson = arcgisToGeoJSON(restJson)

  // 4. GeoJSON → WKT
  return geojsonToWKT(geojson)
}
/**
 * WKT → ArcGIS Geometry
 */
export function wktToArcGIS(wkt: string): Geometry {
  if (!wkt) throw new Error('wktToArcGIS: Missing WKT')

  // 1. WKT → GeoJSON
  const geojson = wktToGeoJSON(wkt)

  // 2. GeoJSON → ArcGIS (still in 4326!)
  const geom4326 = geojsonToArcGIS(geojson) as Geometry

  // 3. Project to WebMercator (3857) for MapView rendering
  return projection.project(geom4326, { wkid: 3857 }) as Geometry
}
