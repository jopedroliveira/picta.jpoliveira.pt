// Helpers around the optional custom video URL the user can attach to a card.
//
// We intentionally restrict to a small allow-list of hosts that fit the CAA
// use case: YouTube (incl. shortlinks and mobile) for public videos and
// Google Drive for family recordings shared via a private link. Anything
// else is rejected so the QR never points at something unexpected.

import { effectiveLgpSlug, lgpUrl, normalize } from './lgp'
import type { Card } from './types'

const HOST_RULES: { match: RegExp; label: string }[] = [
  { match: /^(?:www\.|m\.)?youtube\.com$/i, label: 'YouTube' },
  { match: /^youtu\.be$/i, label: 'YouTube' },
  { match: /^drive\.google\.com$/i, label: 'Google Drive' },
]

function parseUrl(raw: string): URL | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  try {
    const u = new URL(trimmed)
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null
    return u
  } catch {
    return null
  }
}

export function videoHostLabel(raw: string): string | null {
  const u = parseUrl(raw)
  if (!u) return null
  for (const rule of HOST_RULES) {
    if (rule.match.test(u.hostname)) return rule.label
  }
  return null
}

export function isAllowedVideoUrl(raw: string): boolean {
  return videoHostLabel(raw) !== null
}

export type QrTarget =
  | { kind: 'video'; url: string; host: string }
  | { kind: 'lgp'; url: string; slug: string }

// What should the printed QR point at for this card?
// Custom video URL takes precedence over the LGP autodetect. Returns null
// when neither path yields a scannable URL.
export function resolveQrTarget(card: Card, lgpWords: string[] | null): QrTarget | null {
  if (card.gestureVideoUrl) {
    const host = videoHostLabel(card.gestureVideoUrl)
    if (host) return { kind: 'video', url: card.gestureVideoUrl.trim(), host }
  }
  const slug = effectiveLgpSlug(card.gestureLgpSlug, card.word, lgpWords)
  if (slug) return { kind: 'lgp', url: lgpUrl(slug), slug }
  return null
}

// Does this card's word exist in the LGP dictionary, regardless of whether
// a custom video URL is overriding the QR? Used for the standalone "LGP
// supported" indicator next to the card.
export function cardHasLgpSupport(card: Card, lgpWords: string[] | null): boolean {
  if (!lgpWords) return false
  // If the user explicitly cleared the slug ('') we still consider the word
  // itself as the source of truth for "is there an LGP entry for this".
  const slug = normalize(card.gestureLgpSlug || card.word)
  return !!slug && lgpWords.includes(slug)
}
