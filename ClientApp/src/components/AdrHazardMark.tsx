type Props = {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function AdrHazardMark({ className = '', size = 'md' }: Props) {
  const dims = size === 'sm' ? 'h-10 w-10' : size === 'lg' ? 'h-20 w-20' : 'h-14 w-14'

  return (
    <div className={`${dims} ${className}`} aria-label="ADR tehlikeli madde" role="img">
      <svg viewBox="0 0 100 100" className="h-full w-full">
        {/* Diamond */}
        <path
          d="M50 6 L82 34 L94 50 L82 66 L50 94 L18 66 L6 50 L18 34 Z"
          fill="#fff"
          stroke="#dc2626"
          strokeWidth="8"
          strokeLinejoin="round"
        />
        <text x="50" y="52" textAnchor="middle" fontSize="22" fontWeight="900" fill="#dc2626">
          ADR
        </text>
        <circle cx="50" cy="71" r="10" fill="#dc2626" />
        <text x="50" y="76" textAnchor="middle" fontSize="18" fontWeight="900" fill="#fff">
          !
        </text>
      </svg>
    </div>
  )
}

