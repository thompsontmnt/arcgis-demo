import * as geometryEngine from '@arcgis/core/geometry/geometryEngine'

import { formatAreaSqM, formatMeters } from './formatters'

import type Polygon from '@arcgis/core/geometry/Polygon'

export function measurePolygon(poly: Polygon) {
  const area = geometryEngine.geodesicArea(poly, 'square-meters')
  const perimeter = geometryEngine.geodesicLength(poly, 'meters')

  return {
    areaRaw: area,
    perimeterRaw: perimeter,
    area: formatAreaSqM(area),
    perimeter: formatMeters(perimeter),
  }
}
