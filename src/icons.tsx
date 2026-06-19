import type { CSSProperties } from 'react'
import type { FuncKey } from './types'

interface IconProps {
  size?: number
  color?: string
  style?: CSSProperties
}

const stroke = (color: string) => ({
  fill: 'none',
  stroke: color,
  strokeWidth: 1.9,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
})

export function ImageIcon({ size = 24, color = '#6c5fa6', style }: IconProps) {
  const p = stroke(color)
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={style}>
      <rect x="3" y="4" width="18" height="16" rx="2.5" {...p} />
      <circle cx="8.5" cy="9.5" r="1.8" {...p} />
      <path d="M4 18l5-5 4 3 3-3 4 4" {...p} />
    </svg>
  )
}

export function PrinterIcon({ size = 24, color = '#fff', style }: IconProps) {
  const p = stroke(color)
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={style}>
      <path d="M7 9V4h10v5" {...p} />
      <rect x="4.5" y="9" width="15" height="7" rx="1.5" {...p} />
      <rect x="8" y="14" width="8" height="6" rx="1" {...p} />
      <circle cx="16.5" cy="11.5" r="0.7" fill={color} stroke="none" />
    </svg>
  )
}

export function MailIcon({ size = 24, color = '#6c5fa6', style }: IconProps) {
  const p = stroke(color)
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={style}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" {...p} />
      <path d="M4 7.5l8 6 8-6" {...p} />
    </svg>
  )
}

export function LinkIcon({ size = 24, color = '#6c5fa6', style }: IconProps) {
  const p = stroke(color)
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={style}>
      <path d="M10.5 13.5a3.5 3.5 0 0 0 5 0l2.5-2.5a3.5 3.5 0 0 0-5-5l-1.3 1.3" {...p} />
      <path d="M13.5 10.5a3.5 3.5 0 0 0-5 0L6 13a3.5 3.5 0 0 0 5 5l1.3-1.3" {...p} />
    </svg>
  )
}

export function ChatIcon({ size = 24, color = '#3E8E5A', style }: IconProps) {
  const p = stroke(color)
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={style}>
      <path d="M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" {...p} />
    </svg>
  )
}

export function PlusIcon({ size = 18, color = '#6c5fa6', style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={style}>
      <path d="M12 5.5v13M5.5 12h13" {...stroke(color)} />
    </svg>
  )
}

interface FuncIconProps {
  func: FuncKey
  size?: number
  color?: string
}

export function FuncIcon({ func, size = 18, color = '#fff' }: FuncIconProps) {
  const p = {
    fill: 'none',
    stroke: color,
    strokeWidth: 2.2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  if (func === 'pedir') {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
        <path d="M12 20V6" {...p} />
        <path d="M6 12l6-6 6 6" {...p} />
      </svg>
    )
  }
  if (func === 'recusar') {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
        <circle cx="12" cy="12" r="8" {...p} />
        <path d="M7.2 7.2l9.6 9.6" {...p} />
      </svg>
    )
  }
  if (func === 'escolher') {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
        <path d="M4 9h13" {...p} />
        <path d="M14 6l3 3-3 3" {...p} />
        <path d="M20 15H7" {...p} />
        <path d="M10 12l-3 3 3 3" {...p} />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path
        d="M5 5h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-7l-4 4v-4H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"
        {...p}
      />
    </svg>
  )
}

export function PictoPlaceholder({ size = 92 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      <rect x="8" y="8" width="84" height="84" rx="12" fill="#fff" stroke="#cdd2e0" strokeWidth="2.5" strokeDasharray="5 5" />
      <circle cx="50" cy="40" r="16" fill="#bcd6ea" stroke="#2a2733" strokeWidth="2.5" />
      <path d="M26 82 Q26 58 50 58 Q74 58 74 82 Z" fill="#e9d49a" stroke="#2a2733" strokeWidth="2.5" />
    </svg>
  )
}

export function PictoMini({ size = 56 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      <circle cx="50" cy="40" r="16" fill="#bcd6ea" stroke="#2a2733" strokeWidth="3" />
      <path d="M26 82 Q26 58 50 58 Q74 58 74 82 Z" fill="#e9d49a" stroke="#2a2733" strokeWidth="3" />
    </svg>
  )
}

export function QrPlaceholder({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ position: 'absolute', bottom: 5, right: 5 }}>
      <rect x="0.5" y="0.5" width="23" height="23" rx="3" fill="#fff" stroke="#cdc6dc" strokeWidth="1" />
      <rect x="3" y="3" width="6" height="6" fill="none" stroke="#2a2733" strokeWidth="1.4" />
      <rect x="5" y="5" width="2" height="2" fill="#2a2733" />
      <rect x="15" y="3" width="6" height="6" fill="none" stroke="#2a2733" strokeWidth="1.4" />
      <rect x="17" y="5" width="2" height="2" fill="#2a2733" />
      <rect x="3" y="15" width="6" height="6" fill="none" stroke="#2a2733" strokeWidth="1.4" />
      <rect x="5" y="17" width="2" height="2" fill="#2a2733" />
      <rect x="12" y="12" width="1.6" height="1.6" fill="#2a2733" />
      <rect x="15" y="13" width="1.6" height="1.6" fill="#2a2733" />
      <rect x="18" y="15" width="1.6" height="1.6" fill="#2a2733" />
      <rect x="13" y="16.5" width="1.6" height="1.6" fill="#2a2733" />
      <rect x="16.5" y="18" width="1.6" height="1.6" fill="#2a2733" />
      <rect x="11.5" y="19" width="1.6" height="1.6" fill="#2a2733" />
    </svg>
  )
}
