import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import {
  findSimilar,
  getLgpWordsSnapshot,
  has,
  lgpUrl,
  normalize,
  startLoadLgpWords,
  subscribeLgpWords,
} from '../lgp'
import type { Card } from '../types'

interface GestureLgpFieldProps {
  card: Card
  updateCard: (id: number, patch: Partial<Card>) => void
}

// Parent passes `key={card.id}` so this component remounts cleanly when the
// user switches cards. That avoids stale draft state without an effect to
// resync from props.
export function GestureLgpField({ card, updateCard }: GestureLgpFieldProps) {
  // Kick off the (cached) load on first mount.
  startLoadLgpWords()
  const state = useSyncExternalStore(subscribeLgpWords, getLgpWordsSnapshot, getLgpWordsSnapshot)

  // Default: show the card's word, autodetected. If the user previously edited
  // the slug, show what they wrote (including the empty string for "off").
  const initial = card.gestureLgpSlug ?? card.word
  const [draft, setDraft] = useState<string>(initial)

  const normalized = normalize(draft)
  const isMatch = state.kind === 'ready' && !!normalized && has(state.words, normalized)
  const suggestions = useMemo(() => {
    if (state.kind !== 'ready' || isMatch || !normalized) return []
    return findSimilar(state.words, normalized, 4)
  }, [state, normalized, isMatch])

  // Persist whatever the user actually typed once they edit the field. We
  // only persist on real edits — if they open the editor and click Concluído
  // without touching the input, the saved slug stays null (autodetect).
  useEffect(() => {
    if (draft === initial) return
    const next = normalized || ''
    if (card.gestureLgpSlug !== next) {
      updateCard(card.id, { gestureLgpSlug: next })
    }
  }, [draft, initial, normalized, card.id, card.gestureLgpSlug, updateCard])

  const openGesture = () => {
    if (isMatch) window.open(lgpUrl(normalized), '_blank', 'noopener')
  }

  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#6f6a7d', marginBottom: 7 }}>
        Gesto LGP (Infopédia)
      </div>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            fontSize: 14,
            padding: '11px 90px 11px 14px',
            borderRadius: 12,
            border: `1px solid ${isMatch ? '#bcd6c1' : '#d7d0e4'}`,
            background: '#faf9fc',
            color: '#2a2733',
            outline: 'none',
          }}
        />
        <button
          type="button"
          onClick={openGesture}
          disabled={!isMatch}
          style={{
            position: 'absolute',
            right: 6,
            top: 6,
            bottom: 6,
            padding: '0 12px',
            border: 'none',
            borderRadius: 8,
            background: isMatch ? '#6c5fa6' : '#e7e3f1',
            color: isMatch ? '#fff' : '#9a93aa',
            fontFamily: 'inherit',
            fontSize: 12,
            fontWeight: 700,
            cursor: isMatch ? 'pointer' : 'not-allowed',
          }}
        >
          Abrir
        </button>
      </div>

      <div style={{ marginTop: 8, minHeight: 18, fontSize: 12, lineHeight: 1.45 }}>
        {state.kind === 'loading' && <span style={{ color: '#9a93aa' }}>A carregar dicionário…</span>}
        {state.kind === 'error' && (
          <span style={{ color: '#C0453B' }}>
            Não consegui carregar o dicionário ({state.message}). O cartão imprime sem QR.
          </span>
        )}
        {state.kind === 'ready' && !normalized && (
          <span style={{ color: '#9a93aa' }}>
            Sem gesto associado. O cartão imprime sem QR.
          </span>
        )}
        {state.kind === 'ready' && isMatch && (
          <span style={{ color: '#3f7a4b', fontWeight: 600 }}>
            ✓ Disponível na Infopédia
          </span>
        )}
        {state.kind === 'ready' && normalized && !isMatch && (
          <div style={{ color: '#9a6b1a' }}>
            <div style={{ fontWeight: 600 }}>
              ⚠ "{normalized}" não está no dicionário LGP. O cartão imprime sem QR.
            </div>
            {suggestions.length > 0 && (
              <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                <span style={{ color: '#6f6a7d', alignSelf: 'center' }}>Talvez:</span>
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setDraft(s)}
                    style={{
                      border: '1px solid #d7d0e4',
                      background: '#fff',
                      color: '#2a2733',
                      padding: '3px 9px',
                      borderRadius: 999,
                      fontSize: 12,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
