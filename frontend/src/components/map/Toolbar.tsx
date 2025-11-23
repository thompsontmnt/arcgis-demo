import { Flex, IconButton, Separator, Tooltip } from '@radix-ui/themes'
import { useAtom } from 'jotai'
import { CrosshairIcon, MousePointerIcon, PencilLineIcon } from 'lucide-react'

import { useToolManager } from '@/context/ToolManagerContext'

import { viewAtom } from './atoms'
import { DEFAULT_CENTER, DEFAULT_ZOOM } from './constants'
import { Panel } from '../ui/Panel'

export default function Toolbar() {
  const { activeTool, setActiveTool } = useToolManager()
  const [view] = useAtom(viewAtom)

  return (
    <Panel className="w-[fit-content] p-2">
      <Flex gap="4" justify="center" px="2" align="center">
        <Tooltip content="Select tool" side="top" delayDuration={500}>
          <IconButton
            size="1"
            variant={activeTool === 'select' ? 'solid' : 'ghost'}
            onClick={() => setActiveTool('select')}
            aria-label="Select tool"
            highContrast
          >
            <MousePointerIcon className="w-4 h-4" />
          </IconButton>
        </Tooltip>
        <Tooltip content="Draw polygon" side="top" delayDuration={500}>
          <IconButton
            size="1"
            variant={activeTool === 'draw-polygon' ? 'solid' : 'ghost'}
            onClick={() => setActiveTool('draw-polygon')}
            aria-label="Draw polygon tool"
            highContrast
          >
            <PencilLineIcon className="w-4 h-4" />
          </IconButton>
        </Tooltip>
        <Separator orientation="vertical" />
        <Tooltip content="Re-center map" side="top" delayDuration={500}>
          <IconButton
            size="1"
            variant="ghost"
            onClick={() => {
              if (view) {
                view.goTo({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM })
              }
            }}
            aria-label="Re-center map"
            highContrast
          >
            <CrosshairIcon className="w-4 h-4" />
          </IconButton>
        </Tooltip>
      </Flex>
    </Panel>
  )
}
