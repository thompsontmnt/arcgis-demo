import { Flex, IconButton } from '@radix-ui/themes'
import { MousePointerIcon, PencilLineIcon } from 'lucide-react'

import { useToolManager } from '@/context/ToolManagerContext'

import { Panel } from '../ui/Panel'

export default function Toolbar() {
  const { activeTool, setActiveTool } = useToolManager()

  return (
    <Panel className="w-[fit-content] p-2">
      <Flex gap="2" justify="center" px="2">
        <IconButton
          size="1"
          variant={activeTool === 'select' ? 'solid' : 'ghost'}
          onClick={() => setActiveTool('select')}
          aria-label="Select tool"
          highContrast
        >
          <MousePointerIcon />
        </IconButton>
        <IconButton
          size="1"
          variant={activeTool === 'draw-polygon' ? 'solid' : 'ghost'}
          onClick={() => setActiveTool('draw-polygon')}
          aria-label="Draw polygon tool"
          highContrast
        >
          <PencilLineIcon />
        </IconButton>
      </Flex>
    </Panel>
  )
}
