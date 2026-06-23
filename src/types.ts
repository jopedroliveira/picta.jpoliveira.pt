export type FuncKey = 'pedir' | 'recusar' | 'escolher' | 'comentar'
export type CtxKey = 'casa' | 'creche' | 'geral'
export type CardSource = 'picto' | 'photo'
export type Screen =
  | 'entrada'
  | 'revisao'
  | 'impressao'
  | 'colecoes'
  | 'globais'

export type SizeKey = 'grande' | 'medio' | 'pequeno'
export type PreviewFace = 'frente' | 'verso'
export type EditorTab = 'picto' | 'foto'

export interface PictoCandidate {
  id: number
  url: string
  keyword: string
}

export interface Card {
  id: number
  word: string
  func: FuncKey
  ctx: CtxKey
  source: CardSource
  pictoIndex: number
  pictoCandidates: PictoCandidate[] | null
  photoUrl: string | null
  gestureImg: string | null
  gestureLgpSlug: string | null
  gestureVideoUrl: string | null
}

export interface Collection {
  id: string
  name: string
  words: string[]
  wordsText: string
  cards: Card[]
  savedAt: number
}

export interface GlobalCollectionMeta {
  id: string
  title: string
  description: string
  language: string
  author: string
  cardCount: number
}

export interface GlobalCollectionIndex {
  version: number
  collections: GlobalCollectionMeta[]
}

export interface GlobalCollectionCard {
  word: string
  arasaacId: number
  function: FuncKey
}

export interface GlobalCollection {
  id: string
  title: string
  description: string
  language: string
  author: string
  cards: GlobalCollectionCard[]
}
