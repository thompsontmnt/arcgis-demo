import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useAtomValue } from 'jotai'

import { createModeAtom, draftGraphicAtom, selectedGraphicsAtom } from './atoms'
import { CreateGraphicForm } from './CreateGraphicForm'
import { SelectedGraphicPanel } from './SelectedGraphicPanel'

export function GraphicInfoPanel() {
  const draftGraphic = useAtomValue(draftGraphicAtom)
  const isCreating = useAtomValue(createModeAtom)
  const selected = useAtomValue(selectedGraphicsAtom)
  console.log('GraphicInfoPanel render', { isCreating, draftGraphic, selected })

  if (isCreating && draftGraphic) {
    return <CreateGraphicForm graphic={draftGraphic} />
  }

  if (selected.length > 0) {
    return <SelectedGraphicPanel graphics={selected} />
  }

  return <VisuallyHidden>No graphic selected</VisuallyHidden>
}
