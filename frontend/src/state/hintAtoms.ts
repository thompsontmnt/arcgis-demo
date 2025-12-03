import { atom } from 'jotai'

export type ToolName = 'none' | 'draw' | 'edit' | 'select'

export const activeToolAtom = atom<ToolName>('none')
export const isDrawingAtom = atom<boolean>(false)
export const hasSelectionAtom = atom<boolean>(false)

export const showHintAtom = atom<{ message: string; visible: boolean }>({
  message: '',
  visible: false,
})

export const hintTimeoutAtom = atom<NodeJS.Timeout | null>(null)
export const shownHintsAtom = atom<Set<string>>(new Set<string>())

export const triggerHintAtom = atom(
  null,
  (get, set, message: string, duration: number = 5000) => {
    const shown = get(shownHintsAtom)
    if (shown.has(message)) {
      return
    }

    set(showHintAtom, { message, visible: true })
    const prevTimeout = get(hintTimeoutAtom)
    if (prevTimeout) clearTimeout(prevTimeout)
    const timeout = setTimeout(() => {
      set(showHintAtom, { message, visible: false })
    }, duration)
    set(hintTimeoutAtom, timeout)
    // Mark this message as shown for the current session
    const nextShown = new Set(shown)
    nextShown.add(message)
    set(shownHintsAtom, nextShown)
  },
)
