interface TCSLogoProps {
  className?: string
  size?: number
}

export function TCSLogo({ className, size = 36 }: TCSLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background badge */}
      <rect width="36" height="36" rx="6" fill="#2C3E2D" />

      {/* Carpenter's square mark — top-right corner detail */}
      <path
        d="M24 6 L30 6 L30 12"
        stroke="#A8C5A0"
        strokeWidth="1.5"
        strokeLinecap="square"
        fill="none"
      />

      {/* T */}
      <path
        d="M7 13 L15 13 M11 13 L11 23"
        stroke="#F7F5F2"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* C */}
      <path
        d="M22.5 14.5 C21 13 18.5 13 17.5 15.5 C16.5 18 17.5 23 20.5 23 C21.5 23 22.5 22.5 23 21.5"
        stroke="#F7F5F2"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* S */}
      <path
        d="M29 14 C27.5 13 25 13.5 25 15.5 C25 17.5 27.5 17.5 28.5 19 C29.5 20.5 28 23 26 23"
        stroke="#F7F5F2"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
