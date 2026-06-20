import { pictoUrl } from '../arasaac'
import type { UsePictaApi } from '../state'
import { FUNCS } from '../theme'

interface ColecoesGlobaisProps {
  api: UsePictaApi
}

export function ColecoesGlobais({ api }: ColecoesGlobaisProps) {
  const {
    vw,
    globalIndex,
    globalIndexError,
    previewingGlobalId,
    previewingGlobal,
    previewingGlobalLoading,
    previewingGlobalError,
    openGlobalPreview,
    closeGlobalPreview,
    copiarParaAsMinhas,
    setScreen,
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
            Coleções globais
          </div>
          <h1 style={{ fontSize: mob ? 25 : 30, fontWeight: 800, letterSpacing: '-0.02em', margin: '8px 0 8px' }}>
            Pontos de partida prontos a copiar
          </h1>
          <p style={{ fontSize: 15, color: '#6f6a7d', margin: 0, maxWidth: 620 }}>
            Coleções curadas pela Picta. Abre uma para pré-visualizar, depois copia para as tuas para editar à vontade.
          </p>
        </div>
        <button
          onClick={() => setScreen('entrada')}
          style={{
            flex: 'none',
            background: '#fff',
            border: '1px solid #d7d0e4',
            borderRadius: 11,
            padding: '13px 18px',
            fontSize: 15,
            fontWeight: 700,
            color: '#6c5fa6',
            cursor: 'pointer',
            fontFamily: 'inherit',
            width: mob ? '100%' : 'auto',
          }}
        >
          Começar do zero
        </button>
      </div>

      {globalIndexError && (
        <ErrorPanel message={`Não foi possível carregar o índice (${globalIndexError}).`} />
      )}

      {!globalIndex && !globalIndexError && (
        <div style={{ fontSize: 14, color: '#9a93aa', padding: 24 }}>A carregar coleções globais…</div>
      )}

      {globalIndex && globalIndex.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${vw < 560 ? 1 : narrow ? 2 : 3},1fr)`,
            gap: mob ? 14 : 18,
          }}
        >
          {globalIndex.map((meta) => (
            <button
              key={meta.id}
              onClick={() => openGlobalPreview(meta.id)}
              style={{
                textAlign: 'left',
                background: '#fff',
                border: '1px solid #e4dff0',
                borderRadius: 16,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                fontFamily: 'inherit',
                padding: 0,
              }}
            >
              <div
                style={{
                  background: '#f5f2fb',
                  padding: 22,
                  borderBottom: '1px solid #ece8f2',
                  minHeight: 92,
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 700, color: '#2a2733', marginBottom: 6 }}>
                  {meta.title}
                </div>
                <div style={{ fontSize: 13, color: '#6f6a7d', lineHeight: 1.5 }}>{meta.description}</div>
              </div>
              <div
                style={{
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: 12,
                  color: '#9a93aa',
                }}
              >
                <span>
                  {meta.cardCount} cartões · {meta.language}
                </span>
                <span style={{ color: '#6c5fa6', fontWeight: 700 }}>Pré-visualizar →</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {globalIndex && globalIndex.length === 0 && (
        <div style={{ fontSize: 14, color: '#9a93aa', padding: 24 }}>
          Sem coleções globais para já. Volta cá daqui a uns dias.
        </div>
      )}

      {previewingGlobalId && (
        <PreviewOverlay
          loading={previewingGlobalLoading}
          error={previewingGlobalError}
          collection={previewingGlobal}
          onClose={closeGlobalPreview}
          onCopy={(g) => copiarParaAsMinhas(g)}
          mob={mob}
        />
      )}
    </div>
  )
}

function ErrorPanel({ message }: { message: string }) {
  return (
    <div
      style={{
        background: '#fae8e6',
        border: '1px solid #f3c4bf',
        borderRadius: 12,
        padding: 16,
        fontSize: 14,
        color: '#611c15',
      }}
    >
      {message}
    </div>
  )
}

interface PreviewOverlayProps {
  loading: boolean
  error: string | null
  collection: ReturnType<typeof Object> | null // narrowed inline below
  onClose: () => void
  onCopy: (g: NonNullable<UsePictaApi['previewingGlobal']>) => void
  mob: boolean
}

function PreviewOverlay(props: PreviewOverlayProps) {
  const { loading, error, onClose, onCopy, mob } = props
  const collection = props.collection as UsePictaApi['previewingGlobal']

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(26,19,32,.5)',
        zIndex: 40,
        display: 'flex',
        alignItems: mob ? 'stretch' : 'center',
        justifyContent: 'center',
        padding: mob ? 0 : 20,
        animation: 'pictaFade .15s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          width: mob ? '100%' : 'min(720px,100%)',
          maxHeight: mob ? '100%' : '90vh',
          height: mob ? '100%' : 'auto',
          borderRadius: mob ? 0 : 20,
          overflowY: 'auto',
          animation: mob ? 'pictaFade .2s ease' : 'pictaPop .2s ease',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            background: '#fff',
            zIndex: 2,
            padding: '22px 24px 14px',
            borderBottom: '1px solid #ece8f2',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#9a93aa',
              }}
            >
              Coleção global
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 4 }}>
              {collection?.title ?? 'A carregar…'}
            </div>
            {collection && (
              <div style={{ fontSize: 13, color: '#6f6a7d', marginTop: 6, maxWidth: 520 }}>
                {collection.description}
              </div>
            )}
            {collection && (
              <div style={{ fontSize: 12, color: '#9a93aa', marginTop: 8 }}>
                por {collection.author} · {collection.cards.length} cartões · {collection.language}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            style={{
              flex: 'none',
              width: 34,
              height: 34,
              borderRadius: 10,
              border: 'none',
              background: '#f1eef8',
              color: '#6f6a7d',
              fontSize: 18,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '22px 24px 16px', flex: 1 }}>
          {loading && (
            <div style={{ fontSize: 14, color: '#9a93aa', padding: 16 }}>A carregar pictogramas…</div>
          )}
          {error && <ErrorPanel message={`Não foi possível carregar a coleção (${error}).`} />}
          {collection && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))',
                gap: 14,
              }}
            >
              {collection.cards.map((c, i) => {
                const f = FUNCS[c.function]
                return (
                  <div
                    key={i}
                    style={{
                      background: '#fff',
                      border: '2px solid #2a2733',
                      borderRadius: 14,
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div
                      style={{
                        background: f.color,
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '6px 9px',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {f.label.toUpperCase()}
                    </div>
                    <div
                      style={{
                        background: '#f7f5fb',
                        padding: 12,
                        height: 110,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={pictoUrl(c.arasaacId)}
                        alt=""
                        style={{ maxWidth: '100%', maxHeight: 90, objectFit: 'contain' }}
                      />
                    </div>
                    <div
                      style={{
                        padding: '8px 6px',
                        textAlign: 'center',
                        borderTop: '1px solid #ece8f2',
                        fontFamily: "'Atkinson Hyperlegible',sans-serif",
                        fontSize: 16,
                        fontWeight: 700,
                        color: '#161320',
                      }}
                    >
                      {c.word}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {collection && (
          <div
            style={{
              padding: '14px 24px 22px',
              borderTop: '1px solid #ece8f2',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 10,
              position: 'sticky',
              bottom: 0,
              background: '#fff',
            }}
          >
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 14,
                fontWeight: 600,
                color: '#6f6a7d',
                padding: '12px 16px',
              }}
            >
              Cancelar
            </button>
            <button
              onClick={() => onCopy(collection)}
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
              Copiar para as minhas →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
