import type { CSSProperties } from 'react'
import { navigate } from '../router'
import type { UsePictaApi } from '../state'
import type { Screen } from '../types'

const STEPS: { key: Screen; label: string }[] = [
  { key: 'entrada', label: 'Lista' },
  { key: 'revisao', label: 'Revisão' },
  { key: 'impressao', label: 'Imprimir' },
]

interface HeaderProps {
  api: UsePictaApi
}

export function Header({ api }: HeaderProps) {
  const { screen, vw, cards, user, justSaved, saveCollection, go, setScreen } = api
  const mob = vw < 640
  const showStepLabel = vw >= 820
  const reached = STEPS.findIndex((s) => s.key === screen)
  const onFlow = reached >= 0
  const canSave = !!cards && (screen === 'revisao' || screen === 'impressao')

  const headerStyle: CSSProperties = {
    flex: 'none',
    background: '#fff',
    borderBottom: '1px solid #d7d0e4',
    padding: `0 ${mob ? 16 : 28}px`,
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  }

  const stepNavStyle: CSSProperties = {
    display: onFlow ? 'flex' : 'none',
    alignItems: 'center',
    gap: mob ? 3 : 6,
  }

  return (
    <header className="app-header" style={headerStyle}>
      <button
        onClick={() => navigate('/')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 11,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
          padding: 0,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: '#6c5fa6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, width: 18, height: 18 }}>
            <div style={{ background: '#fff', borderRadius: 2 }} />
            <div style={{ background: '#c9c0e6', borderRadius: 2 }} />
            <div style={{ background: '#c9c0e6', borderRadius: 2 }} />
            <div style={{ background: '#fff', borderRadius: 2 }} />
          </div>
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1, color: '#2a2733' }}>
            Picta
          </div>
          <div style={{ display: mob ? 'none' : 'block', fontSize: 11, color: '#9a93aa', marginTop: 1 }}>
            comunicar em cartões
          </div>
        </div>
      </button>

      <nav style={stepNavStyle}>
        {STEPS.map((step, i) => {
          const active = step.key === screen
          const done = onFlow && i < reached
          const enabled = step.key === 'entrada' || !!cards
          return (
            <button
              key={step.key}
              onClick={() => enabled && go(step.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                border: 'none',
                cursor: enabled ? 'pointer' : 'default',
                fontFamily: 'inherit',
                fontSize: 14,
                fontWeight: active ? 700 : 600,
                padding: '8px 14px',
                borderRadius: 10,
                background: active ? '#ece8f2' : 'transparent',
                color: active ? '#2a2733' : enabled ? '#6f6a7d' : '#bdb7c9',
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  background: active ? '#6c5fa6' : done ? '#cfc7e4' : '#e4dff0',
                  color: active ? '#fff' : done ? '#5a4f87' : '#a79fc0',
                }}
              >
                {i + 1}
              </span>
              <span style={{ display: showStepLabel ? 'inline' : 'none' }}>{step.label}</span>
            </button>
          )
        })}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {canSave && (
          <button
            onClick={saveCollection}
            style={{
              flex: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: 700,
              borderRadius: 10,
              padding: '9px 14px',
              fontSize: 14,
              background: justSaved ? '#e4f1e9' : '#f1eef8',
              color: justSaved ? '#2f7e44' : '#6c5fa6',
            }}
          >
            {justSaved ? 'Guardado ✓' : mob ? 'Guardar' : 'Guardar coleção'}
          </button>
        )}
        {user ? (
          <>
            <button
              onClick={() => setScreen('colecoes')}
              style={{
                flex: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: 700,
                borderRadius: 10,
                padding: '9px 14px',
                fontSize: 14,
                background: 'transparent',
                color: '#6f6a7d',
                display: mob ? 'none' : 'inline-flex',
              }}
            >
              Coleções
            </button>
            <button
              onClick={() => setScreen('colecoes')}
              title={user.name}
              style={{
                flex: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: 700,
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: '#6c5fa6',
                color: '#fff',
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {user.initials}
            </button>
          </>
        ) : (
          <button
            onClick={() => setScreen('auth')}
            style={{
              flex: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: 700,
              borderRadius: 10,
              padding: '9px 16px',
              fontSize: 14,
              background: '#6c5fa6',
              color: '#fff',
            }}
          >
            Entrar
          </button>
        )}
      </div>
    </header>
  )
}
