import type { CtxKey, FitzKey, FuncKey, SizeKey } from './types'

export interface FuncDef {
  label: string
  color: string
  ink: string
  hc: string
  hcText: string
  soft: string
}

export interface CtxDef {
  label: string
  color: string
}

export interface SizeDef {
  cols: number
  art: number
  word: number
  band: number
  padV: number
}

export const FUNCS: Record<FuncKey, FuncDef> = {
  pedir: { label: 'Pedir', color: '#C77D34', ink: '#5e3309', hc: '#F08C00', hcText: '#1a1208', soft: '#fbf0e4' },
  recusar: { label: 'Recusar', color: '#C0453B', ink: '#611c15', hc: '#E03131', hcText: '#ffffff', soft: '#fae8e6' },
  escolher: { label: 'Escolher', color: '#2F7E8C', ink: '#143a41', hc: '#1098AD', hcText: '#ffffff', soft: '#e3f0f2' },
  comentar: { label: 'Comentar', color: '#3E8E5A', ink: '#1b3f27', hc: '#2F9E44', hcText: '#ffffff', soft: '#e4f1e9' },
}

export const CTX: Record<CtxKey, CtxDef> = {
  casa: { label: 'Casa', color: '#6c5fa6' },
  creche: { label: 'Creche', color: '#C77D34' },
  geral: { label: 'Geral', color: '#2F7E8C' },
}

export const SIZE_MAP: Record<SizeKey, SizeDef> = {
  grande: { cols: 2, art: 118, word: 30, band: 9, padV: 22 },
  medio: { cols: 3, art: 78, word: 21, band: 7, padV: 16 },
  pequeno: { cols: 4, art: 56, word: 16, band: 5, padV: 11 },
}

export const SIZE_LABELS: Record<SizeKey, string> = {
  grande: 'Grande',
  medio: 'Médio',
  pequeno: 'Pequeno',
}

export function guessFunc(word: string): FuncKey {
  const s = word.toLowerCase()
  if (/n[ãa]o|chega|parar?|acab/.test(s)) return 'recusar'
  if (/quero|mais|por favor|dar|água|comer|beber|dormir/.test(s)) return 'pedir'
  if (/ou|escolh|qual|este|esse/.test(s)) return 'escolher'
  return 'comentar'
}

export function guessCtx(word: string): CtxKey {
  const s = word.toLowerCase()
  if (/m[ãa]e|pai|dormir|casa|banho|dentes|leite|p[ãa]o|almo[çc]o/.test(s)) return 'casa'
  if (/creche|escola|brincar|amig|professor/.test(s)) return 'creche'
  return 'geral'
}

export const CHIP_COLORS = ['#efe9fb', '#fbeede', '#e3f0f2', '#e4f1e9']

export interface FitzDef {
  label: string
  short: string
  color: string
  dark: string
  ink: string
}

// Cores standard da Chave de Fitzgerald. Cada categoria tem cor base (fundo do
// cartão em modo solid, ou moldura em modo border), tom escuro (topo/faixa) e
// ink (cor do texto sobre a cor base).
export const FITZ: Record<FitzKey, FitzDef> = {
  pessoas:      { label: 'Pessoas/pronomes',    short: 'Pessoas',    color: '#FFD400', dark: '#8a6d00', ink: '#1a1208' },
  verbos:       { label: 'Verbos',              short: 'Verbos',     color: '#43A047', dark: '#1e5b21', ink: '#ffffff' },
  descritivos:  { label: 'Descritivos',         short: 'Descritivos',color: '#1E88E5', dark: '#0b3d75', ink: '#ffffff' },
  substantivos: { label: 'Substantivos',        short: 'Substantivos',color: '#FB8C00', dark: '#8a4a00', ink: '#1a1208' },
  preposicoes:  { label: 'Preposições',         short: 'Preposições',color: '#8E24AA', dark: '#4a0d5c', ink: '#ffffff' },
  social:       { label: 'Social',              short: 'Social',     color: '#F06292', dark: '#8a1d4a', ink: '#ffffff' },
  misc:         { label: 'Negação / miscelânea',short: 'Negação',    color: '#E0E0E0', dark: '#5c5c5c', ink: '#1a1208' },
}

export const FITZ_ORDER: FitzKey[] = [
  'pessoas',
  'verbos',
  'descritivos',
  'substantivos',
  'preposicoes',
  'social',
  'misc',
]
