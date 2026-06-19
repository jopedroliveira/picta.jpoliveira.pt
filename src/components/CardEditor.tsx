import type { ChangeEvent } from 'react'
import { FuncIcon, ImageIcon, PlusIcon } from '../icons'
import type { UsePictaApi } from '../state'
import { FUNCS } from '../theme'
import type { Card, FuncKey } from '../types'

interface CardEditorProps {
  api: UsePictaApi
  card: Card
}

function readFile(file: File | undefined, onLoad: (url: string, file: File) => void) {
  if (!file) return
  const r = new FileReader()
  r.onload = () => onLoad(String(r.result), file)
  r.readAsDataURL(file)
}

export function CardEditor({ api, card }: CardEditorProps) {
  const { editorTab, vw, setEditorTab, closeEditor, updateCard } = api
  const mob = vw < 640
  const useFull = mob

  const overlayStyle = {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(26,19,32,.5)',
    zIndex: 40,
    display: 'flex',
    ...(useFull
      ? { alignItems: 'stretch' as const, justifyContent: 'center' }
      : { alignItems: 'center' as const, justifyContent: 'center', padding: 20 }),
    animation: 'pictaFade .15s ease',
  }

  const panelStyle = {
    background: '#fff',
    overflowY: 'auto' as const,
    ...(useFull
      ? { width: '100%', height: '100%', borderRadius: 0, animation: 'pictaFade .2s ease' }
      : { width: 'min(540px,100%)', maxHeight: '90vh', borderRadius: 20, animation: 'pictaPop .2s ease' }),
  }

  const handleClose = () => closeEditor()
  const stop = (e: React.MouseEvent) => e.stopPropagation()

  return (
    <div className="editor-overlay" onClick={handleClose} style={overlayStyle}>
      <div onClick={stop} style={panelStyle}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 12,
            padding: '22px 22px 14px',
            borderBottom: '1px solid #ece8f2',
            position: 'sticky',
            top: 0,
            background: '#fff',
            zIndex: 2,
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
              Editar cartão
            </div>
            <div
              style={{
                fontFamily: "'Atkinson Hyperlegible',sans-serif",
                fontSize: 26,
                fontWeight: 700,
                lineHeight: 1.1,
                marginTop: 3,
              }}
            >
              {card.word}
            </div>
          </div>
          <button
            onClick={handleClose}
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

        <div style={{ padding: '20px 22px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <section>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Imagem da frente</div>
            <div
              style={{
                display: 'inline-flex',
                background: '#efedf6',
                borderRadius: 10,
                padding: 3,
                gap: 2,
                marginBottom: 14,
              }}
            >
              <TabBtn active={editorTab === 'picto'} onClick={() => setEditorTab('picto')}>
                Pictograma
              </TabBtn>
              <TabBtn active={editorTab === 'foto'} onClick={() => setEditorTab('foto')}>
                Foto própria
              </TabBtn>
            </div>

            {editorTab === 'picto' ? (
              <div>
                <div style={{ fontSize: 12, color: '#9a93aa', marginBottom: 10 }}>
                  Resultados ARASAAC para "{card.word}". Toque para escolher.
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                  {(card.pictoCandidates ?? []).map((p, i) => {
                    const selected = card.source === 'picto' && card.pictoIndex === i
                    return (
                      <button
                        key={p.id}
                        onClick={() => updateCard(card.id, { source: 'picto', pictoIndex: i })}
                        style={{
                          position: 'relative',
                          background: '#f7f5fb',
                          border: `2px solid ${selected ? '#6c5fa6' : '#e7e3f1'}`,
                          borderRadius: 12,
                          padding: '8px 6px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 4,
                          fontFamily: 'inherit',
                        }}
                      >
                        <img src={p.url} alt="" style={{ width: 64, height: 64, objectFit: 'contain' }} />
                        <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#9a93aa' }}>#{p.id}</span>
                        {selected && (
                          <span
                            style={{
                              position: 'absolute',
                              top: 6,
                              right: 6,
                              width: 18,
                              height: 18,
                              borderRadius: '50%',
                              background: '#6c5fa6',
                              color: '#fff',
                              fontSize: 11,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            ✓
                          </span>
                        )}
                      </button>
                    )
                  })}
                  {card.pictoCandidates === null && (
                    <div style={{ gridColumn: '1 / -1', fontSize: 13, color: '#9a93aa', textAlign: 'center', padding: 24 }}>
                      A procurar pictogramas…
                    </div>
                  )}
                  {card.pictoCandidates?.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', fontSize: 13, color: '#9a93aa', textAlign: 'center', padding: 24 }}>
                      Sem resultados ARASAAC. Pode usar uma foto sua no separador ao lado.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                {card.photoUrl ? (
                  <div style={{ border: '1px solid #e4dff0', borderRadius: 12, overflow: 'hidden' }}>
                    <div
                      style={{
                        background: '#f7f5fb',
                        padding: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={card.photoUrl}
                        alt=""
                        style={{ maxWidth: '100%', maxHeight: 180, objectFit: 'contain', borderRadius: 6 }}
                      />
                    </div>
                    <button
                      onClick={() => updateCard(card.id, { source: 'picto', photoUrl: null })}
                      style={{
                        width: '100%',
                        border: 'none',
                        borderTop: '1px solid #ece8f2',
                        background: '#fff',
                        padding: 11,
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#C0453B',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      Remover foto
                    </button>
                  </div>
                ) : (
                  <label
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      border: '2px dashed #d7d0e4',
                      borderRadius: 12,
                      padding: 28,
                      cursor: 'pointer',
                      background: '#faf9fc',
                      textAlign: 'center',
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        readFile(e.target.files?.[0], (url) =>
                          updateCard(card.id, { source: 'photo', photoUrl: url }),
                        )
                      }
                      style={{ display: 'none' }}
                    />
                    <ImageIcon size={30} color="#6c5fa6" />
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#6c5fa6' }}>Carregar uma foto</span>
                    <span style={{ fontSize: 12, color: '#9a93aa' }}>
                      JPG ou PNG, fica só no seu dispositivo
                    </span>
                  </label>
                )}
              </div>
            )}
          </section>

          <section>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Função comunicativa</div>
            <div style={{ fontSize: 12, color: '#9a93aa', marginBottom: 12 }}>Define a cor da faixa do cartão.</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
              {(['pedir', 'recusar', 'escolher', 'comentar'] as FuncKey[]).map((k) => {
                const f = FUNCS[k]
                const active = card.func === k
                return (
                  <button
                    key={k}
                    onClick={() => updateCard(card.id, { func: k })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 9,
                      border: `2px solid ${active ? f.color : '#e7e3f1'}`,
                      background: active ? f.color : '#fff',
                      color: active ? '#fff' : '#2a2733',
                      borderRadius: 12,
                      padding: '12px 14px',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    <span style={{ display: 'inline-flex' }}>
                      <FuncIcon func={k} size={18} color={active ? '#fff' : f.color} />
                    </span>
                    {f.label}
                  </button>
                )
              })}
            </div>
          </section>

          <section>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Verso — gesto</div>
            <div style={{ fontSize: 12, color: '#9a93aa', marginBottom: 12 }}>
              Apoio multimodal: a ilustração imprime-se no verso; o vídeo fica acessível por QR.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#6f6a7d', marginBottom: 7 }}>
                  Ilustração do gesto
                </div>
                {card.gestureImg ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      border: '1px solid #e4dff0',
                      borderRadius: 12,
                      padding: 10,
                    }}
                  >
                    <img
                      src={card.gestureImg}
                      alt=""
                      style={{
                        width: 56,
                        height: 56,
                        objectFit: 'contain',
                        background: '#f7f5fb',
                        borderRadius: 8,
                      }}
                    />
                    <span style={{ flex: 1, fontSize: 13, color: '#2a2733' }}>Ilustração anexada</span>
                    <button
                      onClick={() => updateCard(card.id, { gestureImg: null })}
                      style={{
                        border: 'none',
                        background: 'none',
                        color: '#C0453B',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      border: '1px dashed #d7d0e4',
                      borderRadius: 12,
                      padding: '13px 14px',
                      cursor: 'pointer',
                      background: '#faf9fc',
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        readFile(e.target.files?.[0], (url) => updateCard(card.id, { gestureImg: url }))
                      }
                      style={{ display: 'none' }}
                    />
                    <PlusIcon size={18} color="#6c5fa6" />
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#6c5fa6' }}>
                      Carregar ilustração (imagem)
                    </span>
                  </label>
                )}
              </div>

              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#6f6a7d', marginBottom: 7 }}>
                  Vídeo do gesto
                </div>
                {card.gestureVideoUrl ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      border: '1px solid #e4dff0',
                      borderRadius: 12,
                      padding: 10,
                    }}
                  >
                    <video
                      src={card.gestureVideoUrl}
                      muted
                      style={{
                        width: 72,
                        height: 56,
                        objectFit: 'cover',
                        background: '#161320',
                        borderRadius: 8,
                      }}
                    />
                    <span
                      style={{
                        flex: 1,
                        minWidth: 0,
                        fontSize: 13,
                        color: '#2a2733',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {card.gestureVideoName}
                    </span>
                    <button
                      onClick={() => updateCard(card.id, { gestureVideoUrl: null, gestureVideoName: null })}
                      style={{
                        border: 'none',
                        background: 'none',
                        color: '#C0453B',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      border: '1px dashed #d7d0e4',
                      borderRadius: 12,
                      padding: '13px 14px',
                      cursor: 'pointer',
                      background: '#faf9fc',
                    }}
                  >
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        readFile(e.target.files?.[0], (url, file) =>
                          updateCard(card.id, { gestureVideoUrl: url, gestureVideoName: file.name }),
                        )
                      }
                      style={{ display: 'none' }}
                    />
                    <PlusIcon size={18} color="#6c5fa6" />
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#6c5fa6' }}>
                      Carregar vídeo do gesto
                    </span>
                  </label>
                )}
              </div>
            </div>
          </section>

          <button
            onClick={handleClose}
            style={{
              background: '#6c5fa6',
              color: '#fff',
              border: 'none',
              borderRadius: 11,
              padding: 14,
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Concluído
          </button>
        </div>
      </div>
    </div>
  )
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      style={{
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontSize: 13,
        fontWeight: 600,
        padding: '7px 16px',
        borderRadius: 8,
        background: active ? '#fff' : 'transparent',
        color: active ? '#2a2733' : '#6f6a7d',
        boxShadow: active ? '0 1px 2px rgba(40,30,60,.1)' : 'none',
      }}
    >
      {children}
    </button>
  )
}
