import { fmtDate, type UsePictaApi } from '../state'
import { CHIP_COLORS } from '../theme'

interface ColecoesProps {
  api: UsePictaApi
}

export function Colecoes({ api }: ColecoesProps) {
  const { collections, vw, setWordsText, setScreen, openCollection, deleteCollection } = api
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
            As suas coleções
          </div>
          <h1 style={{ fontSize: mob ? 25 : 30, fontWeight: 800, letterSpacing: '-0.02em', margin: '8px 0 8px' }}>
            Guardadas neste dispositivo
          </h1>
          <p style={{ fontSize: 15, color: '#6f6a7d', margin: 0 }}>
            Tudo o que crias fica em `localStorage` e nunca sai daqui. Abre uma coleção para continuar a editar.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => setScreen('globais')}
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
            Coleções globais
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
            Crie uma coleção do zero, ou copie uma das coleções globais para começar.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setScreen('globais')}
              style={{
                background: '#fff',
                border: '1px solid #d7d0e4',
                borderRadius: 11,
                padding: '12px 20px',
                fontSize: 15,
                fontWeight: 700,
                color: '#6c5fa6',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Ver coleções globais
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
                <span style={{ fontSize: 16, fontWeight: 700 }}>{col.name}</span>
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
                  onClick={() => deleteCollection(col.id)}
                  style={{
                    flex: 'none',
                    border: 'none',
                    background: '#faf9fc',
                    padding: '11px 18px',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#C0453B',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Apagar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
