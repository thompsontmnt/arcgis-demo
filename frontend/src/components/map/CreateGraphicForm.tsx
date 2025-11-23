import { Box, Button, Text, TextField } from '@radix-ui/themes'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'
import { useState } from 'react'
import { toast } from 'sonner'

import type { CreateGeometryGeometryPostData } from '@/api/client'
import {
  createGeometryGeometryPostMutation,
  listGeometriesGeometryGetQueryKey,
} from '@/api/client/@tanstack/react-query.gen'

import { createModeAtom, draftGraphicAtom } from './atoms'
import { arcgisToWkt } from './utils/wkt-utils'

import type Graphic from '@arcgis/core/Graphic'

interface CreateGraphicFormProps {
  graphic: Graphic
}

export function CreateGraphicForm({ graphic }: CreateGraphicFormProps) {
  const [label, setLabel] = useState('')
  const setDraft = useSetAtom(draftGraphicAtom)
  const setCreateMode = useSetAtom(createModeAtom)

  const queryClient = useQueryClient()

  const createGeometry = useMutation({
    ...createGeometryGeometryPostMutation(),
    onSuccess: () => {
      toast.success('Geometry saved!')

      queryClient.invalidateQueries({
        queryKey: listGeometriesGeometryGetQueryKey(),
      })

      setDraft(null)
      setCreateMode(false)
      setLabel('')
    },
    onError: (error) => {
      console.error(error)
      toast.error('Failed to save geometry')
    },
  })

  const handleSave = () => {
    if (!graphic.geometry) {
      toast.error('Missing geometry')
      return
    }

    const wkt = arcgisToWkt(graphic.geometry)

    const data: CreateGeometryGeometryPostData = {
      body: {
        wkt,
        label,
      },
      url: '/geometry/',
    }

    createGeometry.mutate(data)
  }

  return (
    <Box>
      <Text size="4" weight="bold">
        Create Geometry
      </Text>

      <TextField.Root
        value={label}
        placeholder="Label"
        onChange={(e) => setLabel(e.target.value)}
        mt="3"
      />

      <Box mt="3">
        <Button
          onClick={handleSave}
          disabled={!label || createGeometry.isPending}
        >
          {createGeometry.isPending ? 'Saving…' : 'Save'}
        </Button>

        <Button
          variant="soft"
          ml="2"
          onClick={() => {
            setDraft(null)
            setCreateMode(false)
          }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  )
}
