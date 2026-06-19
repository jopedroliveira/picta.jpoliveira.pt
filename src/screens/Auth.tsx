import type { UsePictaApi } from '../state'

interface AuthProps {
  api: UsePictaApi
}

export function Auth({ api }: AuthProps) {
  const {
    authMode,
    authName,
    authEmail,
    setAuthMode,
    setAuthName,
    setAuthEmail,
    loginAs,
    setScreen,
  } = api
  const isSignup = authMode === 'signup'

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: '48px 24px 80px', animation: 'pictaFade .2s ease' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>
          {isSignup ? 'Criar conta' : 'Entrar na Picta'}
        </div>
        <p style={{ fontSize: 14, color: '#6f6a7d', margin: '8px 0 0', lineHeight: 1.5 }}>
          {isSignup
            ? 'Guarde e partilhe as suas coleções de cartões.'
            : 'Aceda às suas coleções guardadas.'}
        </p>
      </div>

      <div
        style={{
          background: '#fff',
          borderRadius: 18,
          boxShadow: '0 1px 3px rgba(40,30,60,.06)',
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <button
          onClick={() => loginAs('google')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            border: '1px solid #d7d0e4',
            background: '#fff',
            borderRadius: 11,
            padding: 13,
            fontSize: 15,
            fontWeight: 700,
            color: '#2a2733',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              width: 20,
              height: 20,
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              color: '#4285F4',
            }}
          >
            G
          </span>{' '}
          Continuar com Google
        </button>
        <button
          onClick={() => loginAs('apple')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            border: '1px solid #2a2733',
            background: '#161320',
            borderRadius: 11,
            padding: 13,
            fontSize: 15,
            fontWeight: 700,
            color: '#fff',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <svg viewBox="0 0 24 24" width={17} height={17} fill="#fff" aria-hidden="true">
            <path d="M16.37 12.78c.02 2.16 1.9 2.88 1.92 2.89-.02.05-.3 1.03-.99 2.04-.6.88-1.22 1.76-2.2 1.78-.96.02-1.27-.57-2.37-.57-1.1 0-1.44.55-2.35.59-.94.04-1.66-.95-2.27-1.83-1.24-1.79-2.18-5.06-.91-7.27.63-1.1 1.76-1.79 2.98-.81.04 1.18-.55 1.57-.55 2.6 0 .8.48 1.23 1.13 1.62.65-.78 1.09-1.85.95-2.9z" />
            <path d="M14.13 6.04c.54-.65.9-1.56.8-2.46-.78.03-1.71.52-2.27 1.17-.5.58-.94 1.5-.82 2.39.87.07 1.76-.44 2.29-1.1z" />
          </svg>{' '}
          Continuar com Apple
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '6px 0', color: '#b0aaba', fontSize: 12 }}>
          <span style={{ flex: 1, height: 1, background: '#ece8f2' }} />
          ou com email
          <span style={{ flex: 1, height: 1, background: '#ece8f2' }} />
        </div>
        {isSignup && (
          <input
            value={authName}
            onChange={(e) => setAuthName(e.target.value)}
            placeholder="O seu nome"
            style={{
              border: '1px solid #d7d0e4',
              borderRadius: 11,
              padding: 13,
              fontSize: 15,
              fontFamily: 'inherit',
              color: '#2a2733',
            }}
          />
        )}
        <input
          value={authEmail}
          onChange={(e) => setAuthEmail(e.target.value)}
          placeholder="email@exemplo.pt"
          style={{
            border: '1px solid #d7d0e4',
            borderRadius: 11,
            padding: 13,
            fontSize: 15,
            fontFamily: 'inherit',
            color: '#2a2733',
          }}
        />
        <input
          type="password"
          placeholder="Palavra-passe"
          style={{
            border: '1px solid #d7d0e4',
            borderRadius: 11,
            padding: 13,
            fontSize: 15,
            fontFamily: 'inherit',
            color: '#2a2733',
          }}
        />
        <button
          onClick={() => loginAs('email')}
          style={{
            background: '#6c5fa6',
            color: '#fff',
            border: 'none',
            borderRadius: 11,
            padding: 14,
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
            marginTop: 4,
          }}
        >
          {isSignup ? 'Criar conta' : 'Entrar'}
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: 18, fontSize: 14, color: '#6f6a7d' }}>
        {isSignup ? 'Já tem conta?' : 'Ainda não tem conta?'}{' '}
        <button
          onClick={() => setAuthMode(isSignup ? 'login' : 'signup')}
          style={{
            background: 'none',
            border: 'none',
            color: '#6c5fa6',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: 14,
          }}
        >
          {isSignup ? 'Entrar' : 'Criar conta'}
        </button>
      </div>
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <button
          onClick={() => setScreen('entrada')}
          style={{
            background: 'none',
            border: 'none',
            color: '#9a93aa',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: 13,
          }}
        >
          ← Voltar
        </button>
      </div>
    </div>
  )
}
