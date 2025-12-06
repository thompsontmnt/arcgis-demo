import { useAtom } from 'jotai'

import { viewModeAtom } from './atoms'
import Map2D from './Map2D'
import Scene3D from './Scene3D'

import type { PropsWithChildren } from 'react'

export default function MapViewContainer({ children }: PropsWithChildren) {
  const [mode] = useAtom(viewModeAtom)

  return mode === '2d' ? (
    <Map2D>{children}</Map2D>
  ) : (
    <Scene3D>{children}</Scene3D>
  )
}
