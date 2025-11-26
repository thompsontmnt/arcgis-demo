import Polygon from '@arcgis/core/geometry/Polygon'
import { Box, Button, DataList, Text } from '@radix-ui/themes'
import { useState } from 'react'

import { measurePolygon } from './utils/measureGeometry'

import type Graphic from '@arcgis/core/Graphic'

export function SelectedGraphicPanel({
  graphics,
}: {
  graphics: Array<Graphic>
}) {
  if (!graphics.length) return null

  const [expandedWkt, setExpandedWkt] = useState<Record<number, boolean>>({})

  return (
    <Box>
      <Text size="4" weight="bold">
        Selected Graphic
      </Text>

      {graphics.map((graphic, i) => {
        const { geometry, attributes } = graphic
        const wkt = attributes?.wkt

        let measurements: ReturnType<typeof measurePolygon> | null = null

        if (geometry instanceof Polygon) {
          measurements = measurePolygon(geometry)
        }

        return (
          <Box key={i} p="2" className="rounded-md bg-gray-2">
            <DataList.Root mt="3">
              <DataList.Item>
                <DataList.Label>Geometry Type</DataList.Label>
                <DataList.Value>{geometry?.type}</DataList.Value>
              </DataList.Item>

              {measurements && (
                <>
                  <DataList.Item>
                    <DataList.Label>Area</DataList.Label>
                    <DataList.Value>{measurements.area}</DataList.Value>
                  </DataList.Item>

                  <DataList.Item>
                    <DataList.Label>Perimeter</DataList.Label>
                    <DataList.Value>{measurements.perimeter}</DataList.Value>
                  </DataList.Item>
                </>
              )}

              {Object.entries(attributes || {})
                .filter(([key]) => key !== 'wkt' && key !== 'externalId')
                .map(([key, value]) => (
                  <DataList.Item key={key}>
                    <DataList.Label>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </DataList.Label>
                    <DataList.Value className="break-words">
                      {String(value)}
                    </DataList.Value>
                  </DataList.Item>
                ))}
            </DataList.Root>

            <Box mt="3">
              <Button
                variant="ghost"
                size="1"
                onClick={() =>
                  setExpandedWkt((prev) => ({ ...prev, [i]: !prev[i] }))
                }
              >
                {expandedWkt[i] ? 'Hide WKT' : 'Show WKT'}
              </Button>

              {expandedWkt[i] && (
                <Box
                  mt="2"
                  p="2"
                  className="bg-gray-3 rounded-sm text-[11px] whitespace-pre-wrap"
                >
                  {wkt}
                </Box>
              )}
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}
