import { fmtDate, type UsePictaApi } from '../state'
import { CHIP_COLORS } from '../theme'

interface ColecoesProps {
  api: UsePictaApi
}

export function Colecoes({ api }: ColecoesProps) {
  const {
    user,
    collections,
    vw,
    setWordsText,
    setScreen,
    openCollection,
    deleteCollection,
    logout,
  } = api
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
            {user?.name ?? 'Conta'}
          </div>
          <h1 style={{ fontSize: mob ? 25 : 30, fontWeight: 800, letterSpacing: '-0.02em', margin: '8px 0 8px' }}>
            As suas coleções
          </h1>
          <p style={{ fontSize: 15, color: '#6f6a7d', margin: 0 }}>
            Guardadas neste dispositivo. Abra para continuar a editar ou partilhe com a comunidade.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => setScreen('comunidade')}
            style={{
              background: '#fff',
              border: '1px solid #d7d0e4',
              borderRadius: 11,
              padding: '13px 18px',
              fontSize: 15,
              fontWeight: 700,
              color: '#6c5fa6',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Comunidade
          </button>
          <button
            onClick={() => {
              setWordsText('')
              setScreen('entrada')
            }}
            style={{
              background: '#6c5fa6',
              color: '#fff',
              border: 'none',
              borderRadius: 11,
              padding: '13px 20px',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            + Nova coleção
          </button>
        </div>
      </div>

      {collections.length === 0 ? (
        <div
          style={{
            background: '#fff',
            border: '2px dashed #d7d0e4',
            borderRadius: 18,
            padding: '48px 24px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Ainda não guardou nada</div>
          <p style={{ fontSize: 14, color: '#6f6a7d', margin: '0 0 18px' }}>
            Crie uma coleção de cartões e guarde-a para reutilizar e partilhar.
          </p>
          <button
            onClick={() => {
              setWordsText('')
              setScreen('entrada')
            }}
            style={{
              background: '#6c5fa6',
              color: '#fff',
              border: 'none',
              borderRadius: 11,
              padding: '12px 22px',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            + Nova coleção
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${vw < 560 ? 1 : narrow ? 2 : 3},1fr)`,
            gap: mob ? 14 : 18,
          }}
        >
          {collections.map((col) => (
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
              <button
                onClick={() => openCollection(col)}
                style={{
                  border: 'none',
                  background: '#f5f2fb',
                  padding: 18,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
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
              </button>
              <div
                style={{
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  borderTop: '1px solid #ece8f2',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 700 }}>{col.name}</span>
                  {col.shared && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: '#3E8E5A',
                        background: '#e4f1e9',
                        borderRadius: 6,
                        padding: '2px 7px',
                      }}
                    >
                      Partilhada
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: '#9a93aa' }}>
                  {col.words.length} cartões · {fmtDate(col.savedAt)}
                </div>
              </div>
              <div style={{ display: 'flex', borderTop: '1px solid #ece8f2' }}>
                <button
                  onClick={() => openCollection(col)}
                  style={{
                    flex: 1,
                    border: 'none',
                    background: '#faf9fc',
                    padding: 11,
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#6c5fa6',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    borderRight: '1px solid #ece8f2',
                  }}
                >
                  Abrir
                </button>
                <button
                  onClick={() => api.setShareFor(col.id)}
                  style={{
                    flex: 1,
                    border: 'none',
                    background: '#faf9fc',
                    padding: 11,
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#6c5fa6',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    borderRight: '1px solid #ece8f2',
                  }}
                >
                  Partilhar
                </button>
                <button
                  onClick={() => deleteCollection(col.id)}
                  style={{
                    flex: 'none',
                    border: 'none',
                    background: '#faf9fc',
                    padding: '11px 14px',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#C0453B',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 32 }}>
        <button
          onClick={logout}
          style={{
            background: 'none',
            border: 'none',
            color: '#9a93aa',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: 13,
          }}
        >
          Terminar sessão
        </button>
      </div>
    </div>
  )
}
