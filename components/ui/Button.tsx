import Link from 'next/link'
import clsx from 'clsx'

interface ButtonProps {
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
  type?: 'button' | 'submit'
}

export function Button({
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  children,
  className,
  type = 'button',
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-semibold rounded transition-colors tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2'
  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }
  const variants = {
    primary: 'bg-forest text-stone hover:bg-forest-light',
    outline: 'border border-forest text-forest hover:bg-forest hover:text-stone',
    ghost: 'border border-sage text-sage hover:bg-sage hover:text-forest',
  }
  const classes = clsx(base, sizes[size], variants[variant], className)
  if (href) return <Link href={href} className={classes}>{children}</Link>
  return <button type={type} onClick={onClick} className={classes}>{children}</button>
}
