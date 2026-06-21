import { useEffect, useState } from 'react'
import { isAllowedVideoUrl, videoHostLabel } from '../gestureUrl'
import type { Card } from '../types'

interface GestureVideoUrlFieldProps {
  card: Card
  updateCard: (id: number, patch: Partial<Card>) => void
}

// Parent passes `key={card.id}` so this remounts cleanly when the user
// switches cards.
export function GestureVideoUrlField({ card, updateCard }: GestureVideoUrlFieldProps) {
  const initial = card.gestureVideoUrl ?? ''
  const [draft, setDraft] = useState<string>(initial)

  const trimmed = draft.trim()
  const host = trimmed ? videoHostLabel(trimmed) : null
  const isValid = trimmed && isAllowedVideoUrl(trimmed)
  const isInvalid = !!trimmed && !isValid

  useEffect(() => {
    if (draft === initial) return
    const next = trimmed && isAllowedVideoUrl(trimmed) ? trimmed : null
    if (card.gestureVideoUrl !== next) {
      updateCard(card.id, { gestureVideoUrl: next })
    }
  }, [draft, initial, trimmed, card.id, card.gestureVideoUrl, updateCard])

  const openVideo = () => {
    if (isValid) window.open(trimmed, '_blank', 'noopener')
  }

  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#6f6a7d', marginBottom: 7 }}>
        URL do vídeo (opcional, sobrepõe LGP)
      </div>
      <div style={{ position: 'relative' }}>
        <input
          type="url"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          placeholder="https://youtu.be/… ou drive.google.com/…"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            fontSize: 14,
            padding: '11px 90px 11px 14px',
            borderRadius: 12,
            border: `1px solid ${isValid ? '#bcd6c1' : isInvalid ? '#e2b89a' : '#d7d0e4'}`,
            background: '#faf9fc',
            color: '#2a2733',
            outline: 'none',
          }}
        />
        <button
          type="button"
          onClick={openVideo}
          disabled={!isValid}
          style={{
            position: 'absolute',
            right: 6,
            top: 6,
            bottom: 6,
            padding: '0 12px',
            border: 'none',
            borderRadius: 8,
            background: isValid ? '#6c5fa6' : '#e7e3f1',
            color: isValid ? '#fff' : '#9a93aa',
            fontFamily: 'inherit',
            fontSize: 12,
            fontWeight: 700,
            cursor: isValid ? 'pointer' : 'not-allowed',
          }}
        >
          Abrir
        </button>
      </div>

      <div style={{ marginTop: 8, minHeight: 18, fontSize: 12, lineHeight: 1.45 }}>
        {!trimmed && (
          <span style={{ color: '#9a93aa' }}>
            Pode colar um link YouTube ou Google Drive. O QR no verso aponta para aí em vez da Infopédia.
          </span>
        )}
        {isValid && host && (
          <span style={{ color: '#3f7a4b', fontWeight: 600 }}>
            ✓ {host} · o QR vai apontar para este URL (LGP fica em segundo plano)
          </span>
        )}
        {isInvalid && (
          <span style={{ color: '#9a6b1a', fontWeight: 600 }}>
            ⚠ Só aceito URLs de YouTube ou Google Drive. O QR continua a usar a Infopédia (se houver gesto).
          </span>
        )}
      </div>
    </div>
  )
}
