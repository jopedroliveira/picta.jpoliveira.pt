import { COMMUNITY_FIXTURES, type UsePictaApi } from '../state'
import { CHIP_COLORS } from '../theme'

interface ComunidadeProps {
  api: UsePictaApi
}

export function Comunidade({ api }: ComunidadeProps) {
  const { vw, setScreen, useCommunity } = api
  const mob = vw < 640
  const narrow = vw < 960

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: mob ? '26px 16px 90px' : '40px 32px 100px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: mob ? 'stretch' : 'flex-end',
          flexDirection: mob ? 'column' : 'row',
          justifyContent: 'space-between',
          gap: mob ? 16 : 24,
          marginBottom: 24,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#9a93aa',
            }}
          >
            Comunidade
          </div>
          <h1 style={{ fontSize: mob ? 25 : 30, fontWeight: 800, letterSpacing: '-0.02em', margin: '8px 0 8px' }}>
            Coleções partilhadas
          </h1>
          <p style={{ fontSize: 15, color: '#6f6a7d', margin: 0 }}>
            Coleções criadas por educadores e terapeutas. Use qualquer uma como ponto de partida.
          </p>
        </div>
        <button
          onClick={() => setScreen('entrada')}
          style={{
            flex: 'none',
            background: '#6c5fa6',
            color: '#fff',
            border: 'none',
            borderRadius: 11,
            padding: '13px 24px',
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
            width: mob ? '100%' : 'auto',
          }}
        >
          + Criar a minha
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${vw < 560 ? 1 : narrow ? 2 : 3},1fr)`,
          gap: mob ? 14 : 18,
        }}
      >
        {COMMUNITY_FIXTURES.map((col) => (
          <div
            key={col.id}
            style={{
              background: '#fff',
              border: '1px solid #e4dff0',
              borderRadius: 16,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                background: '#f5f2fb',
                padding: 18,
                display: 'flex',
                gap: 6,
                flexWrap: 'wrap',
                minHeight: 88,
                alignContent: 'flex-start',
              }}
            >
              {col.words.slice(0, 6).map((w, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: "'Atkinson Hyperlegible',sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#2a2733',
                    background: CHIP_COLORS[i % CHIP_COLORS.length],
                    borderRadius: 7,
                    padding: '4px 9px',
                  }}
                >
                  {w}
                </span>
              ))}
            </div>
            <div style={{ padding: '14px 16px', borderTop: '1px solid #ece8f2' }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{col.name}</div>
              <div style={{ fontSize: 12, color: '#9a93aa', marginTop: 2 }}>
                por {col.author} · {col.words.length} cartões
              </div>
            </div>
            <button
              onClick={() => useCommunity(col)}
              style={{
                border: 'none',
                borderTop: '1px solid #ece8f2',
                background: '#faf9fc',
                padding: 12,
                fontSize: 13,
                fontWeight: 700,
                color: '#6c5fa6',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Usar como base
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
