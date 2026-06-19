import type { PictoCandidate } from './types'

const API_BASE = 'https://api.arasaac.org/api'
const IMG_BASE = 'https://static.arasaac.org/pictograms'

interface ArasaacHit {
  _id: number
  keywords: { keyword: string }[]
}

const cache = new Map<string, Promise<PictoCandidate[]>>()

export function pictoUrl(id: number, size = 300): string {
  return `${IMG_BASE}/${id}/${id}_${size}.png`
}

export async function searchPictos(word: string, lang = 'pt'): Promise<PictoCandidate[]> {
  const key = `${lang}:${word.toLowerCase()}`
  const cached = cache.get(key)
  if (cached) return cached

  const promise = (async () => {
    const term = encodeURIComponent(word.trim())
    if (!term) return []
    try {
      const res = await fetch(`${API_BASE}/pictograms/${lang}/search/${term}`)
      if (!res.ok) return []
      const data: ArasaacHit[] = await res.json()
      return data.slice(0, 6).map((hit) => ({
        id: hit._id,
        url: pictoUrl(hit._id),
        keyword: hit.keywords?.[0]?.keyword ?? word,
      }))
    } catch {
      return []
    }
  })()

  cache.set(key, promise)
  return promise
}
