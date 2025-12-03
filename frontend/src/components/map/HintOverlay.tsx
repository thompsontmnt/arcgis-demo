import { Box, Text } from '@radix-ui/themes'
import { useAtomValue } from 'jotai'

import { showHintAtom } from '../../state/hintAtoms'

export const HintOverlay = () => {
  const { message, visible } = useAtomValue(showHintAtom)
  return (
    <Box
      px="4"
      py="2"
      style={{
        position: 'fixed',
        left: '50%',
        bottom: '5.5rem',
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
        zIndex: 50,
        transition: 'opacity 0.3s',
        opacity: visible ? 1 : 0,
      }}
      className="bg-black/60 rounded-md shadow-lg"
    >
      <Text size="2" weight="medium">
        {message}
      </Text>
    </Box>
  )
}
