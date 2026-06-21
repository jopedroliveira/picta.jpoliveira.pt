import { useMemo } from 'react'
import QRCode from 'qrcode'

interface QrSvgProps {
  data: string
  size: number
  margin?: number
}

// Renders a black/white QR as a single SVG path. We collapse every dark module
// into one `path` instead of one rect each so a sheet with many cards stays
// cheap to render and to print.
export function QrSvg({ data, size, margin = 0 }: QrSvgProps) {
  const { d, n } = useMemo(() => {
    const qr = QRCode.create(data, { errorCorrectionLevel: 'M' })
    const n = qr.modules.size
    const cells = qr.modules.data
    let d = ''
    for (let y = 0; y < n; y++) {
      let runStart = -1
      for (let x = 0; x <= n; x++) {
        const on = x < n && cells[y * n + x] === 1
        if (on && runStart === -1) runStart = x
        if (!on && runStart !== -1) {
          d += `M${runStart} ${y}h${x - runStart}v1h${-(x - runStart)}z`
          runStart = -1
        }
      }
    }
    return { d, n }
  }, [data])

  const total = n + margin * 2
  return (
    <svg
      viewBox={`${-margin} ${-margin} ${total} ${total}`}
      width={size}
      height={size}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <rect x={-margin} y={-margin} width={total} height={total} fill="#fff" />
      <path d={d} fill="#000" />
    </svg>
  )
}
