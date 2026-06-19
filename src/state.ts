import { useCallback, useEffect, useMemo, useState } from 'react'
import { searchPictos } from './arasaac'
import { CTX, FUNCS, guessCtx, guessFunc } from './theme'
import type {
  AuthMode,
  Card,
  Collection,
  EditorTab,
  PreviewFace,
  Screen,
  SizeKey,
  User,
} from './types'

const LS_USER = 'picta_user'
const LS_COLLECTIONS = 'picta_collections'

function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(LS_USER)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

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

function persistUser(user: User | null) {
  try {
    if (user) localStorage.setItem(LS_USER, JSON.stringify(user))
    else localStorage.removeItem(LS_USER)
  } catch {
    /* ignore */
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
  user: User | null
  collections: Collection[]
  currentCollectionId: string | null
  collectionName: string
  authMode: AuthMode
  authName: string
  authEmail: string
  shareFor: string | null
  copied: boolean
  justSaved: boolean
  vw: number

  // setters
  setScreen: (s: Screen) => void
  setWordsText: (text: string) => void
  setSize: (s: SizeKey) => void
  setContrast: (b: boolean) => void
  setIncludeBack: (b: boolean) => void
  setPreviewFace: (f: PreviewFace) => void
  setEditingId: (id: number | null) => void
  setEditorTab: (t: EditorTab) => void
  setAuthMode: (m: AuthMode) => void
  setAuthName: (n: string) => void
  setAuthEmail: (e: string) => void
  setShareFor: (id: string | null) => void
  setCopied: (b: boolean) => void

  // actions
  go: (screen: Screen) => void
  updateCard: (id: number, patch: Partial<Card>) => void
  loadExample: () => void
  openEditor: (id: number) => void
  closeEditor: () => void
  loginAs: (provider: User['provider']) => void
  logout: () => void
  saveCollection: () => void
  openCollection: (col: Collection) => void
  deleteCollection: (id: string) => void
  toggleShared: (id: string) => void
  useCommunity: (col: { name: string; words: string[] }) => void
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
  const [user, setUser] = useState<User | null>(() => loadUser())
  const [collections, setCollections] = useState<Collection[]>(() => loadCollections())
  const [currentCollectionId, setCurrentCollectionId] = useState<string | null>(null)
  const [collectionName, setCollectionName] = useState<string>('')
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [authName, setAuthName] = useState<string>('')
  const [authEmail, setAuthEmail] = useState<string>('')
  const [shareFor, setShareFor] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [justSaved, setJustSaved] = useState(false)
  const [vw, setVw] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1100,
  )

  useEffect(() => {
    const handler = () => setVw(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

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

  const loginAs = useCallback(
    (provider: User['provider']) => {
      const name = authName.trim() || 'Ana Ribeiro'
      const initials = name
        .split(/\s+/)
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
      const u: User = { name, initials, provider }
      setUser(u)
      persistUser(u)
      setScreen('colecoes')
    },
    [authName],
  )

  const logout = useCallback(() => {
    setUser(null)
    setScreen('entrada')
    setCurrentCollectionId(null)
    persistUser(null)
  }, [])

  const saveCollection = useCallback(() => {
    if (!user) {
      setScreen('auth')
      setAuthMode('login')
      return
    }
    const current = cards ?? buildCards(wordsText)
    const words = current.map((c) => c.word)
    const name = (collectionName || '').trim() || words[0] || 'Coleção'
    const now = Date.now()
    setCollections((prev) => {
      const existing = currentCollectionId != null ? prev.findIndex((c) => c.id === currentCollectionId) : -1
      const id = currentCollectionId ?? 'col_' + now
      const rec: Collection = {
        id,
        name,
        words,
        wordsText,
        cards: current,
        savedAt: now,
        shared: existing >= 0 ? prev[existing].shared : false,
      }
      const next = existing >= 0 ? prev.map((c, i) => (i === existing ? rec : c)) : [rec, ...prev]
      persistCollections(next)
      setCurrentCollectionId(id)
      return next
    })
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 1800)
  }, [cards, collectionName, currentCollectionId, user, wordsText])

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

  const toggleShared = useCallback((id: string) => {
    setCollections((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, shared: !c.shared } : c))
      persistCollections(next)
      return next
    })
  }, [])

  const useCommunity = useCallback((col: { name: string; words: string[] }) => {
    setWordsTextRaw(col.words.join('\n'))
    setCards(null)
    setCurrentCollectionId(null)
    setCollectionName(col.name + ' (cópia)')
    setScreen('entrada')
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
      user,
      collections,
      currentCollectionId,
      collectionName,
      authMode,
      authName,
      authEmail,
      shareFor,
      copied,
      justSaved,
      vw,
      setScreen,
      setWordsText,
      setSize,
      setContrast,
      setIncludeBack,
      setPreviewFace,
      setEditingId,
      setEditorTab,
      setAuthMode,
      setAuthName,
      setAuthEmail,
      setShareFor,
      setCopied,
      go,
      updateCard,
      loadExample,
      openEditor,
      closeEditor,
      loginAs,
      logout,
      saveCollection,
      openCollection,
      deleteCollection,
      toggleShared,
      useCommunity,
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
      user,
      collections,
      currentCollectionId,
      collectionName,
      authMode,
      authName,
      authEmail,
      shareFor,
      copied,
      justSaved,
      vw,
      setWordsText,
      go,
      updateCard,
      loadExample,
      openEditor,
      closeEditor,
      loginAs,
      logout,
      saveCollection,
      openCollection,
      deleteCollection,
      toggleShared,
      useCommunity,
    ],
  )
}

export const COMMUNITY_FIXTURES = [
  { id: 'c1', name: 'Rotina da manhã', author: 'Equipa Picta', words: ['bom dia', 'leite', 'pão', 'vestir', 'dentes', 'vamos'] },
  { id: 'c2', name: 'Pedidos na sala', author: 'CRI de Aveiro', words: ['quero', 'mais', 'ajuda', 'acabou', 'água'] },
  { id: 'c3', name: 'Emoções básicas', author: 'Terapeuta Sofia', words: ['feliz', 'triste', 'zangado', 'cansado', 'assustado', 'calmo'] },
  { id: 'c4', name: 'Hora da refeição', author: 'JI do Sol', words: ['comer', 'beber', 'mais', 'não quero', 'obrigado'] },
]

export function fmtDate(ts: number): string {
  try {
    return new Date(ts).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })
  } catch {
    return ''
  }
}

// re-exported for screens that need raw constants
export { CTX, FUNCS }
