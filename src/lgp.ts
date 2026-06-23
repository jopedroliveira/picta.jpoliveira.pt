// LGP lookup against the pre-scraped Infopédia word list (public/lgp-words.json).
// The list ships as a static asset and is fetched lazily on first use.

const INFOPEDIA_BASE = 'https://www.infopedia.pt/dicionarios/lingua-gestual/'

// External store for the LGP word list. Components subscribe via
// useSyncExternalStore so the load happens outside React's effect graph.
export type LgpWordsState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'ready'; words: string[] }
  | { kind: 'error'; message: string }

let snapshot: LgpWordsState = { kind: 'idle' }
const subscribers = new Set<() => void>()

function setSnapshot(next: LgpWordsState) {
  snapshot = next
  for (const cb of subscribers) cb()
}

export function startLoadLgpWords(): void {
  if (snapshot.kind === 'ready' || snapshot.kind === 'loading') return
  setSnapshot({ kind: 'loading' })
  fetch('/lgp-words.json')
    .then((r) => {
      if (!r.ok) throw new Error('HTTP ' + r.status)
      return r.json() as Promise<string[]>
    })
    .then((words) => {
      setSnapshot({ kind: 'ready', words })
    })
    .catch((e: unknown) => {
      const message = e instanceof Error ? e.message : String(e)
      setSnapshot({ kind: 'error', message })
    })
}

export function subscribeLgpWords(cb: () => void): () => void {
  subscribers.add(cb)
  return () => subscribers.delete(cb)
}

export function getLgpWordsSnapshot(): LgpWordsState {
  return snapshot
}

export function normalize(s: string): string {
  return s.trim().toLowerCase().normalize('NFC')
}

export function lgpUrl(slug: string): string {
  return INFOPEDIA_BASE + encodeURIComponent(normalize(slug))
}

export function has(words: string[], query: string): boolean {
  return words.includes(normalize(query))
}

// What slug should drive the QR on this card right now?
// - null saved → derive from the card's word (auto-detect)
// - '' saved   → user cleared it explicitly → no QR
// - string     → use it, if it's actually in the dictionary
export function effectiveLgpSlug(
  saved: string | null,
  word: string,
  words: string[] | null,
): string | null {
  if (!words) return null
  if (saved === '') return null
  if (saved !== null) {
    const n = normalize(saved)
    return n && words.includes(n) ? n : null
  }
  const n = normalize(word)
  return n && words.includes(n) ? n : null
}

// Strip diacritics (NFD + remove combining marks). Used so fuzzy match
// treats "mae" and "mãe" as the same prefix family.
function stripDiacritics(s: string): string {
  return s.normalize('NFD').replace(/\p{M}/gu, '')
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length
  const m = a.length
  const n = b.length
  let prev = new Array(n + 1)
  let curr = new Array(n + 1)
  for (let j = 0; j <= n; j++) prev[j] = j
  for (let i = 1; i <= m; i++) {
    curr[0] = i
    const ai = a.charCodeAt(i - 1)
    for (let j = 1; j <= n; j++) {
      const cost = ai === b.charCodeAt(j - 1) ? 0 : 1
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost)
    }
    const t = prev
    prev = curr
    curr = t
  }
  return prev[n]
}

// Returns up to `max` similar words, sorted by edit distance (ascending),
// breaking ties by alphabetical order. Compares both raw and diacritic-
// stripped forms so common typos like "mae" match "mãe".
export function findSimilar(words: string[], query: string, max = 4): string[] {
  const q = normalize(query)
  if (!q) return []
  const qStripped = stripDiacritics(q)
  const maxLenDiff = 3
  const cutoff = q.length <= 4 ? 2 : 3

  const scored: { w: string; d: number }[] = []
  for (const w of words) {
    if (Math.abs(w.length - q.length) > maxLenDiff) continue
    const d = Math.min(levenshtein(q, w), levenshtein(qStripped, stripDiacritics(w)))
    if (d <= cutoff && d > 0) scored.push({ w, d })
  }
  scored.sort((a, b) => a.d - b.d || a.w.localeCompare(b.w, 'pt'))
  return scored.slice(0, max).map((s) => s.w)
}
