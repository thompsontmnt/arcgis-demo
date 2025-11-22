import { Box, Flex, Text } from '@radix-ui/themes'

import type Graphic from '@arcgis/core/Graphic'

interface SelectedGraphicPanelProps {
  graphics: Array<Graphic>
}

export function SelectedGraphicPanel({ graphics }: SelectedGraphicPanelProps) {
  if (graphics.length === 0) return null

  return (
    <Box>
      <Text size="4" weight="bold">
        Selected Graphic
      </Text>

      {graphics.map((graphic, i) => (
        <Flex key={i} direction="column" gap="2" mt="3">
          <Text>Type: {graphic.geometry?.type}</Text>
          <pre style={{ fontSize: '12px', margin: 0 }}>
            {JSON.stringify(graphic.attributes, null, 2)}
          </pre>
        </Flex>
      ))}
    </Box>
  )
}
