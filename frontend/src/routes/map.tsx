import { Box, IconButton } from '@radix-ui/themes'
import { createFileRoute } from '@tanstack/react-router'

import MapView from '@/components/map/MapView'
import { ToolManagerProvider } from '@/context/ToolManagerContext'
import GithubIcon from '@/github.svg'

export const Route = createFileRoute('/map')({
  component: () => (
    <Box p="3" height="100vh" width="100vw" position="relative">
      <Box position="absolute" bottom="6" right="4" style={{ zIndex: 1000 }}>
        <IconButton
          asChild
          variant="solid"
          size="3"
          highContrast
          title="Source code"
        >
          <a
            href="https://github.com/thompsontmnt/arcgis-demo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={GithubIcon} alt="GitHub" width={22} height={22} />
          </a>
        </IconButton>
      </Box>
      <ToolManagerProvider>
        <MapView />
      </ToolManagerProvider>
    </Box>
  ),
})
