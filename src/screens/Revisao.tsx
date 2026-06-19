import type { UsePictaApi } from '../state'
import { FUNCS } from '../theme'
import { FuncIcon, PictoPlaceholder } from '../icons'
import type { Card } from '../types'

interface RevisaoProps {
  api: UsePictaApi
}

function CardArt({ card }: { card: Card }) {
  if (card.source === 'photo' && card.photoUrl) {
    return (
      <img
        src={card.photoUrl}
        alt=""
        style={{ maxWidth: '100%', maxHeight: 120, objectFit: 'contain', borderRadius: 6 }}
      />
    )
  }
  const picto = card.pictoCandidates?.[card.pictoIndex]
  if (picto) {
    return (
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={picto.url} alt="" style={{ width: 110, height: 110, objectFit: 'contain' }} />
        <span
          style={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            fontFamily: 'monospace',
            fontSize: 9,
            color: '#9a93aa',
            background: '#f2eff8',
            borderRadius: 5,
            padding: '1px 5px',
          }}
        >
          ARASAAC #{picto.id}
        </span>
      </div>
    )
  }
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <PictoPlaceholder size={92} />
      <span
        style={{
          position: 'absolute',
          bottom: -2,
          right: -2,
          fontFamily: 'monospace',
          fontSize: 9,
          color: '#9a93aa',
          background: '#f2eff8',
          borderRadius: 5,
          padding: '1px 5px',
        }}
      >
        a procurar…
      </span>
    </div>
  )
}

export function Revisao({ api }: RevisaoProps) {
  const { cards, vw, go, openEditor } = api
  const mob = vw < 640
  const narrow = vw < 960
  const list = cards ?? []

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
            Revisão
          </div>
          <h1 style={{ fontSize: mob ? 25 : 30, fontWeight: 800, letterSpacing: '-0.02em', margin: '8px 0 8px' }}>
            Confirme cada cartão
          </h1>
          <p style={{ fontSize: 15, color: '#6f6a7d', margin: 0, maxWidth: 620 }}>
            Toque num cartão para editar: trocar o pictograma, usar uma foto sua, ou anexar a ilustração e o vídeo
            do gesto.
          </p>
        </div>
        <button
          onClick={() => go('impressao')}
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
          Imprimir →
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${vw < 560 ? 2 : narrow ? 3 : 4},1fr)`,
          gap: mob ? 12 : 18,
        }}
      >
        {list.map((c) => {
          const f = FUNCS[c.func]
          const gestureBits: string[] = []
          if (c.gestureImg) gestureBits.push('ilustração')
          if (c.gestureVideoUrl) gestureBits.push('vídeo')
          const hasGesture = gestureBits.length > 0
          return (
            <button
              key={c.id}
              onClick={() => openEditor(c.id)}
              style={{
                textAlign: 'left',
                padding: 0,
                cursor: 'pointer',
                fontFamily: 'inherit',
                background: '#fff',
                border: '2px solid #2a2733',
                borderRadius: 16,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <div
                style={{
                  background: f.color,
                  padding: '8px 13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    background: 'rgba(255,255,255,.22)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FuncIcon func={c.func} size={16} color="#fff" />
                </span>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 13, letterSpacing: '0.02em' }}>
                  {f.label.toUpperCase()}
                </span>
              </div>
              <div
                style={{
                  background: '#f7f5fb',
                  height: 148,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 10,
                }}
              >
                <CardArt card={c} />
              </div>
              <div style={{ padding: '11px 12px 8px', textAlign: 'center', borderTop: '1px solid #ece8f2', width: '100%' }}>
                <div
                  style={{
                    fontFamily: "'Atkinson Hyperlegible',sans-serif",
                    fontSize: 22,
                    fontWeight: 700,
                    color: '#161320',
                    lineHeight: 1.1,
                  }}
                >
                  {c.word}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    marginTop: 3,
                    color: hasGesture ? '#3E8E5A' : '#b0aaba',
                  }}
                >
                  {hasGesture ? '✓ verso: ' + gestureBits.join(' + ') : 'sem verso'}
                </div>
              </div>
              <div style={{ padding: '0 12px 12px', width: '100%' }}>
                <div
                  style={{
                    border: '1px solid #e4dff0',
                    background: '#faf9fc',
                    borderRadius: 9,
                    padding: 8,
                    textAlign: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#6c5fa6',
                  }}
                >
                  Editar cartão
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <p style={{ fontSize: 12, color: '#a39db3', marginTop: 32, lineHeight: 1.6, maxWidth: 600 }}>
        Pictogramas: ARASAAC (Sergio Palao) · CC BY-NC-SA. As fotos, ilustrações e vídeos que adicionar ficam no
        seu dispositivo.
      </p>
    </div>
  )
}
