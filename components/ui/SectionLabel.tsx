import clsx from 'clsx'

export function SectionLabel({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <p className={clsx(
      'text-xs tracking-[0.2em] uppercase font-medium mb-2',
      light ? 'text-sage' : 'text-sage-dark'
    )}>
      {children}
    </p>
  )
}
