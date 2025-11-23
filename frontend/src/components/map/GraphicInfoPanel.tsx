import { Box } from '@radix-ui/themes'
import { useAtomValue } from 'jotai'

import { createModeAtom, draftGraphicAtom, selectedGraphicsAtom } from './atoms'
import { CreateGraphicForm } from './CreateGraphicForm'
import { SelectedGraphicPanel } from './SelectedGraphicPanel'
import { Panel } from '../ui/Panel'

export function GraphicInfoPanel() {
  const isCreating = useAtomValue(createModeAtom)
  const draftGraphic = useAtomValue(draftGraphicAtom)
  const selected = useAtomValue(selectedGraphicsAtom)

  const visible = isCreating || draftGraphic !== null || selected.length > 0

  return (
    <Panel
      className={`absolute top-2 right-2 w-[300px] ${visible ? '' : 'hidden'}`}
    >
      <Box className={isCreating && draftGraphic ? 'block' : 'hidden'}>
        {draftGraphic && <CreateGraphicForm graphic={draftGraphic} />}
      </Box>

      <Box className={!isCreating && selected.length > 0 ? 'block' : 'hidden'}>
        <SelectedGraphicPanel graphics={selected} />
      </Box>
    </Panel>
  )
}
