import { AlertDialog, Box, Button, Flex } from '@radix-ui/themes'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { toast } from 'sonner'
import { useEventListener } from 'usehooks-ts'

import {
  deleteGeometryGeometryGeomIdDeleteMutation,
  listGeometriesGeometryGetOptions,
} from '@/api/client/@tanstack/react-query.gen'
import { selectedGraphicsAtom } from '@/components/map/atoms'

export function useDeleteSelectedGeometry() {
  const [selectedGraphics, setSelectedGraphics] = useAtom(selectedGraphicsAtom)
  const [open, setOpen] = useState(false)
  const qc = useQueryClient()

  const deleteGeometry = useMutation({
    ...deleteGeometryGeometryGeomIdDeleteMutation(),
    onSuccess: () => {
      toast.success('Graphic deleted')
      qc.invalidateQueries(listGeometriesGeometryGetOptions())
      setSelectedGraphics([])
      setOpen(false)
    },
    onError: () => {
      setOpen(false)
      toast.error('Failed to delete graphic')
    },
  })

  useEventListener('keydown', (e) => {
    if (
      (e.key === 'Delete' || e.key === 'Backspace') &&
      selectedGraphics.length > 0
    ) {
      setOpen(true)
    }
  })

  const modal = open ? (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Content>
        <AlertDialog.Title>Delete Graphic?</AlertDialog.Title>
        <AlertDialog.Description>
          Are you sure you want to delete the selected graphic? This action
          cannot be undone.
        </AlertDialog.Description>
        <Box mt="4">
          <Flex gap="3" justify="end">
            <AlertDialog.Action>
              <Button
                color="red"
                onClick={() => {
                  if (selectedGraphics.length > 0) {
                    const graphic = selectedGraphics[0]
                    deleteGeometry.mutate({
                      path: {
                        geom_id: graphic.attributes.id,
                      },
                    })
                  }
                }}
              >
                Delete
              </Button>
            </AlertDialog.Action>
            <AlertDialog.Cancel>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
            </AlertDialog.Cancel>
          </Flex>
        </Box>
      </AlertDialog.Content>
    </AlertDialog.Root>
  ) : null

  return modal
}
