import { useMemo } from 'react'
import QRCode from 'qrcode'

interface QrSvgProps {
  data: string
  size: number
  margin?: number
}

const BRAND = '#6c5fa6'
const BG = '#ffffff'

// Coordinates of the three finder patterns (top-left, top-right, bottom-left)
// inside a QR matrix of size n. Each occupies a 7x7 block.
function finderOrigins(n: number): [number, number][] {
  return [
    [0, 0],
    [n - 7, 0],
    [0, n - 7],
  ]
}

function isInFinder(x: number, y: number, n: number): boolean {
  for (const [fx, fy] of finderOrigins(n)) {
    if (x >= fx && x < fx + 7 && y >= fy && y < fy + 7) return true
  }
  return false
}

// Square (in module units) centred on the QR that the logo will sit on top of.
// We blank out modules inside this so they don't show through the logo plate.
// Error-correction H buys ~30% safety; staying at ~18% leaves comfortable
// headroom for less generous scanners.
function logoBoundsModules(n: number): { x: number; y: number; side: number } {
  let side = Math.round(n * 0.18)
  if (side % 2 !== n % 2) side += 1 // keep centred on an integer/half boundary
  const x = (n - side) / 2
  return { x, y: x, side }
}

// Standard QR quiet zone is 4 modules. We default to 2 since the card art
// already gives the QR plenty of whitespace around it.
export function QrSvg({ data, size, margin = 2 }: QrSvgProps) {
  const { dots, n, logo } = useMemo(() => {
    const qr = QRCode.create(data, { errorCorrectionLevel: 'H' })
    const n = qr.modules.size
    const cells = qr.modules.data
    const logo = logoBoundsModules(n)

    const dots: { x: number; y: number }[] = []
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        if (cells[y * n + x] !== 1) continue
        if (isInFinder(x, y, n)) continue
        // Skip modules under the logo plate.
        if (x >= logo.x && x < logo.x + logo.side && y >= logo.y && y < logo.y + logo.side) continue
        dots.push({ x, y })
      }
    }
    return { dots, n, logo }
  }, [data])

  const total = n + margin * 2

  // Logo plate sized in module units, then re-expressed in the same SVG units
  // as the rest of the QR. We pad a little so the plate eats one extra module
  // ring of whitespace around the mark and feels like a coaster.
  const platePad = 0.6
  const plateX = logo.x - platePad
  const plateY = logo.y - platePad
  const plateSide = logo.side + platePad * 2

  // Inline the Picta tile mark from public/picta.svg, scaled to the plate.
  // The source SVG is 64x64 with the four 14x14 tiles laid out as a 32x32
  // block centred inside it (offset 16 on each axis, 4u gap). Keeping u as
  // markSide/64 preserves those proportions exactly.
  const markPad = 0.5
  const markX = logo.x + markPad
  const markY = logo.y + markPad
  const markSide = logo.side - markPad * 2
  const u = markSide / 64

  return (
    <svg
      viewBox={`${-margin} ${-margin} ${total} ${total}`}
      width={size}
      height={size}
      shapeRendering="geometricPrecision"
      aria-hidden="true"
    >
      <rect x={-margin} y={-margin} width={total} height={total} fill={BG} />

      {/* Module dots */}
      <g fill={BRAND}>
        {dots.map(({ x, y }) => (
          <circle key={`${x}-${y}`} cx={x + 0.5} cy={y + 0.5} r={0.46} />
        ))}
      </g>

      {/* Rounded finder "eyes" */}
      {finderOrigins(n).map(([fx, fy], i) => (
        <g key={`f-${i}`}>
          <rect x={fx} y={fy} width={7} height={7} rx={2.2} fill={BRAND} />
          <rect x={fx + 1} y={fy + 1} width={5} height={5} rx={1.6} fill={BG} />
          <rect x={fx + 2} y={fy + 2} width={3} height={3} rx={1} fill={BRAND} />
        </g>
      ))}

      {/* Logo plate + Picta tile mark */}
      <rect
        x={plateX}
        y={plateY}
        width={plateSide}
        height={plateSide}
        rx={plateSide * 0.22}
        fill={BG}
      />
      <g>
        <rect
          x={markX}
          y={markY}
          width={markSide}
          height={markSide}
          rx={14 * u}
          fill={BRAND}
        />
        <g transform={`translate(${markX + 16 * u} ${markY + 16 * u})`}>
          <rect x={0} y={0} width={14 * u} height={14 * u} rx={2 * u} fill="#ffffff" />
          <rect x={18 * u} y={0} width={14 * u} height={14 * u} rx={2 * u} fill="#c9c0e6" />
          <rect x={0} y={18 * u} width={14 * u} height={14 * u} rx={2 * u} fill="#c9c0e6" />
          <rect x={18 * u} y={18 * u} width={14 * u} height={14 * u} rx={2 * u} fill="#ffffff" />
        </g>
      </g>
    </svg>
  )
}
