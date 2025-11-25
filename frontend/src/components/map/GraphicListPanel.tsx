import { Flex, IconButton, ScrollArea, Spinner, Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue, useSetAtom } from 'jotai'
import { ChevronDownIcon, ChevronUpIcon, LocateIcon } from 'lucide-react'
import { useState } from 'react'

import {
  listGeometriesGeometryGetOptions,
  listGeometriesGeometryGetQueryKey,
} from '@/api/client/@tanstack/react-query.gen'

import { graphicsByIdAtom, selectedGraphicsAtom } from './atoms'
import { viewAtom } from '../map/atoms'
import { Panel } from '../ui/Panel'
import { WktPolygonSvg } from './utils/WktToPolygonSvg'

export function GraphicsListPanel() {
  const [collapsed, setCollapsed] = useState(false)
  const view = useAtomValue(viewAtom)
  const graphicsById = useAtomValue(graphicsByIdAtom)
  const setSelected = useSetAtom(selectedGraphicsAtom)

  const { data, isLoading } = useQuery({
    ...listGeometriesGeometryGetOptions(),
    queryKey: listGeometriesGeometryGetQueryKey(),
  })

  if (isLoading) return <Spinner />
  if (!data?.length)
    return <Text>No records found. Use the draw tool to create a graphic</Text>

  return (
    <Panel>
      <Flex justify="between" align="center">
        <Text size="4" weight="bold">
          All Graphics
        </Text>
        <IconButton
          size="1"
          variant="ghost"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? 'Expand list' : 'Collapse list'}
        >
          {collapsed ? (
            <ChevronDownIcon size="16" />
          ) : (
            <ChevronUpIcon size="16" />
          )}
        </IconButton>
      </Flex>
      {!collapsed && (
        <ScrollArea style={{ maxHeight: 600, width: '100%' }}>
          <Flex direction="column" gap="2" mt="3">
            {data.map((item) => {
              const graphic = graphicsById[item.id]
              return (
                <Flex
                  key={item.id}
                  justify="between"
                  align="center"
                  className="p-2 mr-2 rounded hover:bg-gray-600 cursor-pointer"
                  onClick={() => {
                    setSelected([graphic])
                  }}
                  role="listitem"
                >
                  <Flex direction="row" gap="2" align="center">
                    <WktPolygonSvg wkt={item.wkt} />
                    <Text size="1" color="gray">
                      ID: {item.id}
                    </Text>
                    <Text>{item.label}</Text>
                  </Flex>
                  <IconButton
                    size="1"
                    variant="ghost"
                    onClick={() => {
                      if (view) {
                        view.goTo(graphic)
                      }
                    }}
                    title="Zoom to"
                    highContrast
                  >
                    <LocateIcon size="16" />
                  </IconButton>
                </Flex>
              )
            })}
          </Flex>
        </ScrollArea>
      )}
    </Panel>
  )
}
