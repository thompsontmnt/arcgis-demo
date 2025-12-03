import { jotaiStore } from '@/jotai/jotaiStore'
import {
  activeToolAtom,
  isDrawingAtom,
  triggerHintAtom,
} from '@/state/hintAtoms'

import {
  createModeAtom,
  draftGraphicAtom,
  graphicsLayerAtom,
  selectedGraphicsAtom,
  sketchVMAtom,
} from '../map/atoms'

export function drawPolygonTool() {
  let createHandle: IHandle | null = null

  return {
    id: 'draw-polygon',
    label: 'Draw Polygon',
    icon: 'pen-square',

    activate() {
      const sketch = jotaiStore.get(sketchVMAtom)
      const layer = jotaiStore.get(graphicsLayerAtom)

      if (!sketch || !layer) {
        console.warn('[drawPolygonTool] Missing sketchVM or graphicsLayer')
        return
      }

      // Clean up previous handler
      createHandle?.remove()

      // Clear previous draft + selection
      jotaiStore.set(draftGraphicAtom, null)
      jotaiStore.set(selectedGraphicsAtom, [])
      jotaiStore.set(createModeAtom, false)

      // Initiate sketch create mode
      sketch.create('polygon')

      jotaiStore.set(activeToolAtom, 'draw')
      jotaiStore.set(isDrawingAtom, true)
      jotaiStore.set(
        triggerHintAtom,
        'Click to add points. Double-click to finish.',
      )

      createHandle = sketch.on('create', (e) => {
        if (e.state === 'complete') {
          // Store draft graphic
          jotaiStore.set(draftGraphicAtom, e.graphic)

          // Trigger CreateGraphicForm
          jotaiStore.set(createModeAtom, true)

          // Ensure nothing persists as selected
          jotaiStore.set(selectedGraphicsAtom, [])
          jotaiStore.set(isDrawingAtom, false)
        } else if (e.state === 'cancel') {
          jotaiStore.set(isDrawingAtom, false)
        }
      })
    },

    deactivate() {
      // Clean up
      createHandle?.remove()
      createHandle = null

      const sketch = jotaiStore.get(sketchVMAtom)
      sketch?.cancel()
    },
  }
}
