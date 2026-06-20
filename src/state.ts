import { useCallback, useEffect, useMemo, useState } from 'react'
import { pictoUrl, searchPictos } from './arasaac'
import { CTX, FUNCS, guessCtx, guessFunc } from './theme'
import type {
  Card,
  Collection,
  EditorTab,
  GlobalCollection,
  GlobalCollectionIndex,
  GlobalCollectionMeta,
  PreviewFace,
  Screen,
  SizeKey,
} from './types'

const LS_COLLECTIONS = 'picta_collections'

function loadCollections(): Collection[] {
  try {
    const raw = localStorage.getItem(LS_COLLECTIONS)
    if (!raw) return []
    const arr = JSON.parse(raw) as Collection[]
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

function persistCollections(cols: Collection[]) {
  try {
    localStorage.setItem(LS_COLLECTIONS, JSON.stringify(cols))
  } catch {
    /* ignore */
  }
}

export function buildCards(wordsText: string): Card[] {
  return wordsText
    .split('\n')
    .map((w) => w.trim())
    .filter(Boolean)
    .map((word, i): Card => ({
      id: i,
      word,
      func: guessFunc(word),
      ctx: guessCtx(word),
      source: 'picto',
      pictoIndex: 0,
      pictoCandidates: null,
      photoUrl: null,
      gestureImg: null,
      gestureVideoUrl: null,
      gestureVideoName: null,
    }))
}

// Build editable Card[] from a global collection. The arasaacId becomes the
// first (and currently only) pictoCandidate, so the card is already showing
// the curator's chosen picto without an extra round-trip.
function cardsFromGlobal(g: GlobalCollection): Card[] {
  return g.cards.map((c, i): Card => ({
    id: i,
    word: c.word,
    func: c.function,
    ctx: guessCtx(c.word),
    source: 'picto',
    pictoIndex: 0,
    pictoCandidates: [{ id: c.arasaacId, url: pictoUrl(c.arasaacId), keyword: c.word }],
    photoUrl: null,
    gestureImg: null,
    gestureVideoUrl: null,
    gestureVideoName: null,
  }))
}

export interface UsePictaApi {
  // state
  screen: Screen
  wordsText: string
  cards: Card[] | null
  size: SizeKey
  contrast: boolean
  includeBack: boolean
  previewFace: PreviewFace
  editingId: number | null
  editorTab: EditorTab
  collections: Collection[]
  currentCollectionId: string | null
  collectionName: string
  justSaved: boolean
  vw: number

  // global collections
  globalIndex: GlobalCollectionMeta[] | null
  globalIndexError: string | null
  previewingGlobalId: string | null
  previewingGlobal: GlobalCollection | null
  previewingGlobalLoading: boolean
  previewingGlobalError: string | null

  // setters
  setScreen: (s: Screen) => void
  setWordsText: (text: string) => void
  setSize: (s: SizeKey) => void
  setContrast: (b: boolean) => void
  setIncludeBack: (b: boolean) => void
  setPreviewFace: (f: PreviewFace) => void
  setEditingId: (id: number | null) => void
  setEditorTab: (t: EditorTab) => void

  // actions
  go: (screen: Screen) => void
  updateCard: (id: number, patch: Partial<Card>) => void
  loadExample: () => void
  openEditor: (id: number) => void
  closeEditor: () => void
  saveCollection: () => void
  openCollection: (col: Collection) => void
  deleteCollection: (id: string) => void
  openGlobalPreview: (id: string) => void
  closeGlobalPreview: () => void
  copiarParaAsMinhas: (g: GlobalCollection) => void
}

export function usePicta(): UsePictaApi {
  const [screen, setScreen] = useState<Screen>('entrada')
  const [wordsText, setWordsTextRaw] = useState<string>(
    'água\nquero mais\nnão\ngosto\na mãe\ndormir',
  )
  const [cards, setCards] = useState<Card[] | null>(null)
  const [size, setSize] = useState<SizeKey>('medio')
  const [contrast, setContrast] = useState(false)
  const [includeBack, setIncludeBack] = useState(false)
  const [previewFace, setPreviewFace] = useState<PreviewFace>('frente')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editorTab, setEditorTab] = useState<EditorTab>('picto')
  const [collections, setCollections] = useState<Collection[]>(() => loadCollections())
  const [currentCollectionId, setCurrentCollectionId] = useState<string | null>(null)
  const [collectionName, setCollectionName] = useState<string>('')
  const [justSaved, setJustSaved] = useState(false)
  const [vw, setVw] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1100,
  )

  // global collections
  const [globalIndex, setGlobalIndex] = useState<GlobalCollectionMeta[] | null>(null)
  const [globalIndexError, setGlobalIndexError] = useState<string | null>(null)
  const [previewingGlobalId, setPreviewingGlobalId] = useState<string | null>(null)
  const [previewingGlobal, setPreviewingGlobal] = useState<GlobalCollection | null>(null)
  const [previewingGlobalLoading, setPreviewingGlobalLoading] = useState(false)
  const [previewingGlobalError, setPreviewingGlobalError] = useState<string | null>(null)

  useEffect(() => {
    const handler = () => setVw(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  // Fetch the index lazily the first time the user lands on the gallery
  useEffect(() => {
    if (screen !== 'globais' || globalIndex !== null || globalIndexError !== null) return
    fetch('/collections/index.json')
      .then((r) => {
        if (!r.ok) throw new Error('HTTP ' + r.status)
        return r.json() as Promise<GlobalCollectionIndex>
      })
      .then((data) => setGlobalIndex(data.collections ?? []))
      .catch((e) => setGlobalIndexError(String(e)))
  }, [screen, globalIndex, globalIndexError])

  const setWordsText = useCallback((text: string) => {
    setWordsTextRaw(text)
    setCards(null)
  }, [])

  const go = useCallback(
    (next: Screen) => {
      if (next === 'revisao' && !cards) {
        const built = buildCards(wordsText)
        setCards(built)
        setScreen(next)
        for (const card of built) {
          void searchPictos(card.word).then((list) => {
            if (list.length === 0) return
            setCards((prev) => {
              if (!prev) return prev
              return prev.map((c) =>
                c.id === card.id ? { ...c, pictoCandidates: list, pictoIndex: 0 } : c,
              )
            })
          })
        }
      } else {
        setScreen(next)
      }
    },
    [cards, wordsText],
  )

  const updateCard = useCallback((id: number, patch: Partial<Card>) => {
    setCards((prev) => (prev ? prev.map((c) => (c.id === id ? { ...c, ...patch } : c)) : prev))
  }, [])

  const loadExample = useCallback(() => {
    setWordsTextRaw(
      'bom dia\nquero o pequeno-almoço\nleite\npão\nmais\nnão quero\nvestir\nlavar os dentes\na mãe\nvamos',
    )
    setCards(null)
  }, [])

  const openEditor = useCallback(
    (id: number) => {
      const c = cards?.find((x) => x.id === id)
      setEditingId(id)
      setEditorTab(c?.source === 'photo' ? 'foto' : 'picto')
      if (c && (c.pictoCandidates === null || c.pictoCandidates.length === 0)) {
        void searchPictos(c.word).then((list) => {
          setCards((prev) => {
            if (!prev) return prev
            return prev.map((card) =>
              card.id === id
                ? {
                    ...card,
                    pictoCandidates: list,
                    pictoIndex: list.length > 0 ? Math.min(card.pictoIndex, list.length - 1) : 0,
                  }
                : card,
            )
          })
        })
      }
    },
    [cards],
  )

  const closeEditor = useCallback(() => setEditingId(null), [])

  const saveCollection = useCallback(() => {
    const current = cards ?? buildCards(wordsText)
    const words = current.map((c) => c.word)
    const name = (collectionName || '').trim() || words[0] || 'Coleção'
    const now = Date.now()
    setCollections((prev) => {
      const existing = currentCollectionId != null ? prev.findIndex((c) => c.id === currentCollectionId) : -1
      const id = currentCollectionId ?? 'col_' + now
      const rec: Collection = { id, name, words, wordsText, cards: current, savedAt: now }
      const next = existing >= 0 ? prev.map((c, i) => (i === existing ? rec : c)) : [rec, ...prev]
      persistCollections(next)
      setCurrentCollectionId(id)
      return next
    })
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 1800)
  }, [cards, collectionName, currentCollectionId, wordsText])

  const openCollection = useCallback((col: Collection) => {
    setWordsTextRaw(col.wordsText || col.words.join('\n'))
    setCards(col.cards ?? null)
    setCurrentCollectionId(col.id)
    setCollectionName(col.name)
    setScreen('revisao')
  }, [])

  const deleteCollection = useCallback(
    (id: string) => {
      setCollections((prev) => {
        const next = prev.filter((c) => c.id !== id)
        persistCollections(next)
        return next
      })
      if (currentCollectionId === id) setCurrentCollectionId(null)
    },
    [currentCollectionId],
  )

  const openGlobalPreview = useCallback(
    (id: string) => {
      setPreviewingGlobalId(id)
      setPreviewingGlobalError(null)
      setPreviewingGlobal(null)
      setPreviewingGlobalLoading(true)
      fetch(`/collections/${id}.json`)
        .then((r) => {
          if (!r.ok) throw new Error('HTTP ' + r.status)
          return r.json() as Promise<GlobalCollection>
        })
        .then((data) => {
          setPreviewingGlobal(data)
          setPreviewingGlobalLoading(false)
        })
        .catch((e) => {
          setPreviewingGlobalError(String(e))
          setPreviewingGlobalLoading(false)
        })
    },
    [],
  )

  const closeGlobalPreview = useCallback(() => {
    setPreviewingGlobalId(null)
    setPreviewingGlobal(null)
    setPreviewingGlobalError(null)
    setPreviewingGlobalLoading(false)
  }, [])

  const copiarParaAsMinhas = useCallback((g: GlobalCollection) => {
    const newCards = cardsFromGlobal(g)
    const words = newCards.map((c) => c.word)
    setWordsTextRaw(words.join('\n'))
    setCards(newCards)
    setCurrentCollectionId(null)
    setCollectionName(g.title + ' (cópia)')
    setPreviewingGlobalId(null)
    setPreviewingGlobal(null)
    setScreen('revisao')
  }, [])

  return useMemo<UsePictaApi>(
    () => ({
      screen,
      wordsText,
      cards,
      size,
      contrast,
      includeBack,
      previewFace,
      editingId,
      editorTab,
      collections,
      currentCollectionId,
      collectionName,
      justSaved,
      vw,
      globalIndex,
      globalIndexError,
      previewingGlobalId,
      previewingGlobal,
      previewingGlobalLoading,
      previewingGlobalError,
      setScreen,
      setWordsText,
      setSize,
      setContrast,
      setIncludeBack,
      setPreviewFace,
      setEditingId,
      setEditorTab,
      go,
      updateCard,
      loadExample,
      openEditor,
      closeEditor,
      saveCollection,
      openCollection,
      deleteCollection,
      openGlobalPreview,
      closeGlobalPreview,
      copiarParaAsMinhas,
    }),
    [
      screen,
      wordsText,
      cards,
      size,
      contrast,
      includeBack,
      previewFace,
      editingId,
      editorTab,
      collections,
      currentCollectionId,
      collectionName,
      justSaved,
      vw,
      globalIndex,
      globalIndexError,
      previewingGlobalId,
      previewingGlobal,
      previewingGlobalLoading,
      previewingGlobalError,
      setWordsText,
      go,
      updateCard,
      loadExample,
      openEditor,
      closeEditor,
      saveCollection,
      openCollection,
      deleteCollection,
      openGlobalPreview,
      closeGlobalPreview,
      copiarParaAsMinhas,
    ],
  )
}

export function fmtDate(ts: number): string {
  try {
    return new Date(ts).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })
  } catch {
    return ''
  }
}

// re-exported for screens that need raw constants
export { CTX, FUNCS }
