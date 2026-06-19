export type FuncKey = 'pedir' | 'recusar' | 'escolher' | 'comentar'
export type CtxKey = 'casa' | 'creche' | 'geral'
export type CardSource = 'picto' | 'photo'
export type Screen =
  | 'entrada'
  | 'revisao'
  | 'impressao'
  | 'auth'
  | 'colecoes'
  | 'comunidade'

export type SizeKey = 'grande' | 'medio' | 'pequeno'
export type PreviewFace = 'frente' | 'verso'
export type AuthMode = 'login' | 'signup'
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
  gestureVideoUrl: string | null
  gestureVideoName: string | null
}

export interface User {
  name: string
  initials: string
  provider: 'google' | 'apple' | 'email'
}

export interface Collection {
  id: string
  name: string
  words: string[]
  wordsText: string
  cards: Card[]
  savedAt: number
  shared: boolean
}
