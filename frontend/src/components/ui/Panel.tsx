import { Card } from '@radix-ui/themes'

import { cn } from '@/lib/utils'

interface PanelProps {
  children: React.ReactNode
  className?: string
}

export function Panel({ children, className }: PanelProps) {
  return <Card className={cn(' w-[360px] panel', className)}>{children}</Card>
}
