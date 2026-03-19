import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

/* Overlapping CC block art — 13 cols × 6 rows
   Back C (darker), overlap zone (brightest), front C (lighter) */

const CELL = 2
const GAP = 0.5
const PITCH = CELL + GAP
const PAD = 1.5

const BACK: [number, number][] = [[0,0],[0,1],[0,2],[0,3],[0,4],[1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[3,0],[3,1],[3,4],[3,5],[4,0],[4,1],[4,4],[4,5],[5,5]]
const OVERLAP: [number, number][] = [[5,0],[5,1],[5,4],[6,0],[6,1],[6,4],[6,5],[7,1],[7,4],[7,5]]
const FRONT: [number, number][] = [[5,2],[5,3],[6,2],[6,3],[7,0],[7,2],[7,3],[8,0],[8,1],[8,4],[8,5],[9,0],[9,1],[9,4],[9,5],[10,0],[10,1],[10,4],[10,5],[11,0],[11,1],[11,4],[11,5],[12,1],[12,4],[12,5]]

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0D1117',
          borderRadius: 6,
          position: 'relative',
        }}
      >
        {/* Back C — darker green */}
        {BACK.map(([c, r], i) => (
          <div
            key={`b${i}`}
            style={{
              position: 'absolute',
              left: PAD + c * PITCH,
              top: PAD + r * PITCH + 4,
              width: CELL,
              height: CELL,
              background: '#3A9A5A',
              borderRadius: 0.5,
            }}
          />
        ))}
        {/* Overlap — brightest */}
        {OVERLAP.map(([c, r], i) => (
          <div
            key={`o${i}`}
            style={{
              position: 'absolute',
              left: PAD + c * PITCH,
              top: PAD + r * PITCH + 4,
              width: CELL,
              height: CELL,
              background: '#6FD98F',
              borderRadius: 0.5,
            }}
          />
        ))}
        {/* Front C — green */}
        {FRONT.map(([c, r], i) => (
          <div
            key={`f${i}`}
            style={{
              position: 'absolute',
              left: PAD + c * PITCH,
              top: PAD + r * PITCH + 4,
              width: CELL,
              height: CELL,
              background: '#4EC373',
              borderRadius: 0.5,
            }}
          />
        ))}
      </div>
    ),
    { ...size }
  )
}
