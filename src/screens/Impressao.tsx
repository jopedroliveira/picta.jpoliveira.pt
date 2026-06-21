import { useSyncExternalStore } from 'react'
import { PictoMini, PrinterIcon } from '../icons'
import { QrSvg } from '../components/QrSvg'
import { resolveQrTarget } from '../gestureUrl'
import { getLgpWordsSnapshot, startLoadLgpWords, subscribeLgpWords } from '../lgp'
import type { UsePictaApi } from '../state'
import { FUNCS, SIZE_LABELS, SIZE_MAP } from '../theme'
import type { Card, FuncKey, SizeKey } from '../types'

interface ImpressaoProps {
  api: UsePictaApi
}

function orderedCards(cards: Card[]): Card[] {
  const keys = Object.keys(FUNCS) as FuncKey[]
  const out: Card[] = []
  for (const k of keys) {
    for (const c of cards) {
      if (c.func === k) out.push(c)
    }
  }
  return out
}

export function Impressao({ api }: ImpressaoProps) {
  const {
    cards,
    vw,
    size,
    contrast,
    includeBack,
    previewFace,
    setSize,
    setContrast,
    setIncludeBack,
    setPreviewFace,
  } = api
  startLoadLgpWords()
  const lgp = useSyncExternalStore(subscribeLgpWords, getLgpWordsSnapshot, getLgpWordsSnapshot)
  const lgpWords = lgp.kind === 'ready' ? lgp.words : null
  const mob = vw < 640
  const narrow = vw < 960
  const list = cards ?? []
  const previewVerso = includeBack && previewFace === 'verso'
  const ordered = orderedCards(list)

  return (
    <div
      className="print-layout"
      style={{
        maxWidth: 1080,
        margin: '0 auto',
        padding: mob ? '26px 16px 90px' : '40px 32px 100px',
        display: 'grid',
        gridTemplateColumns: narrow ? '1fr' : '280px 1fr',
        gap: narrow ? 24 : 36,
        alignItems: 'start',
      }}
    >
      <div
        className="print-controls"
        style={{
          ...(narrow ? {} : { position: 'sticky', top: 24 }),
          display: 'flex',
          flexDirection: 'column',
          gap: mob ? 14 : 20,
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
            Imprimir
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', margin: '8px 0 0' }}>
            A sua folha
          </h1>
        </div>

        <Panel title="Tamanho do cartão">
          <div style={{ display: 'flex', gap: 6 }}>
            {(['grande', 'medio', 'pequeno'] as SizeKey[]).map((k) => (
              <button
                key={k}
                onClick={() => setSize(k)}
                style={{
                  flex: 1,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 13,
                  fontWeight: 600,
                  padding: 9,
                  borderRadius: 8,
                  background: size === k ? '#6c5fa6' : '#f1eef8',
                  color: size === k ? '#fff' : '#6f6a7d',
                }}
              >
                {SIZE_LABELS[k]}
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="Modo de contraste" subtitle="A faixa de função vira bloco sólido com a palavra grande.">
          <Toggle on={contrast} onClick={() => setContrast(!contrast)} label={contrast ? 'Ativado' : 'Desativado'} />
        </Panel>

        <Panel
          title="Verso com gesto"
          subtitle="Imprime uma segunda página com a ilustração do gesto. Quando há gesto LGP associado, junta um QR para o vídeo na Infopédia. Para impressão duplex."
        >
          <Toggle
            on={includeBack}
            onClick={() => {
              setIncludeBack(!includeBack)
              setPreviewFace('frente')
            }}
            label={includeBack ? 'Ativado' : 'Desativado'}
          />
        </Panel>

        <button
          onClick={() => window.print()}
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 9,
          }}
        >
          <PrinterIcon size={20} color="#fff" />
          Imprimir / PDF
        </button>
        <div style={{ fontSize: 11, color: '#a39db3', lineHeight: 1.6 }}>
          Atribuição ARASAAC (CC BY-NC-SA) impressa no rodapé da folha. Projeto gratuito e não comercial.
        </div>
      </div>

      {/* Interactive preview. Visible on screen only; hidden when printing. */}
      <Sheet
        className="print-sheet"
        cards={ordered}
        size={size}
        contrast={contrast}
        verso={previewVerso}
        mob={mob}
        narrow={narrow}
        lgpWords={lgpWords}
        header={
          <>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#6c5fa6' }}>Picta</span>
            {includeBack && (
              <div style={{ display: 'inline-flex', background: '#efedf6', borderRadius: 9, padding: 3, gap: 2 }}>
                <FaceTab on={!previewVerso} onClick={() => setPreviewFace('frente')} label="Frente" />
                <FaceTab on={previewVerso} onClick={() => setPreviewFace('verso')} label="Verso" />
              </div>
            )}
            <span style={{ fontSize: 11, color: '#b0aaba' }}>{list.length} cartões</span>
          </>
        }
      />

      {/* Print-only sheets. Always rendered when there are cards, regardless of
          previewFace, so that window.print() always emits the full front and
          (when includeBack) back, aligned in the same card order for duplex. */}
      <Sheet
        className="print-front-sheet"
        cards={ordered}
        size={size}
        contrast={contrast}
        verso={false}
        mob={mob}
        narrow={narrow}
        lgpWords={lgpWords}
        header={
          <>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#6c5fa6' }}>Picta</span>
            <span style={{ fontSize: 11, color: '#b0aaba' }}>frente · {list.length} cartões</span>
          </>
        }
      />
      {includeBack && (
        <Sheet
          className="print-back-sheet"
          cards={ordered}
          size={size}
          contrast={contrast}
          verso
          mob={mob}
          narrow={narrow}
          lgpWords={lgpWords}
          header={
            <>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#6c5fa6' }}>Picta</span>
              <span style={{ fontSize: 11, color: '#b0aaba' }}>verso · {list.length} cartões</span>
            </>
          }
        />
      )}
    </div>
  )
}

interface SheetProps {
  className: string
  cards: Card[]
  size: SizeKey
  contrast: boolean
  verso: boolean
  mob: boolean
  narrow: boolean
  header: React.ReactNode
  lgpWords: string[] | null
}

function Sheet({ className, cards, size, contrast, verso, mob, narrow, header, lgpWords }: SheetProps) {
  const sz = SIZE_MAP[size]
  return (
    <div
      className={className}
      style={{
        background: '#fff',
        borderRadius: 6,
        boxShadow: '0 8px 30px rgba(40,30,60,.14)',
        padding: mob ? 20 : 34,
        ...(narrow ? {} : { aspectRatio: '1/1.414' }),
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
          paddingBottom: 14,
          borderBottom: '1px solid #ece8f2',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        {header}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${sz.cols},1fr)`, gap: 12 }}>
        {cards.map((c) => (
          <SheetCard
            key={c.id}
            card={c}
            size={size}
            contrast={contrast}
            verso={verso}
            lgpWords={lgpWords}
          />
        ))}
      </div>
      <div
        style={{
          marginTop: 18,
          paddingTop: 12,
          borderTop: '1px solid #ece8f2',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 8,
          color: '#b8b2c4',
        }}
      >
        <span>Picta · comunicar em cartões</span>
        <span>Pictogramas: ARASAAC (Sergio Palao) · CC BY-NC-SA</span>
      </div>
    </div>
  )
}

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: 18, boxShadow: '0 1px 3px rgba(40,30,60,.06)' }}>
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: subtitle ? 4 : 10 }}>{title}</div>
      {subtitle && (
        <div style={{ fontSize: 12, color: '#9a93aa', marginBottom: 12, lineHeight: 1.4 }}>{subtitle}</div>
      )}
      {children}
    </div>
  )
}

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'inherit',
        background: on ? '#e7e3f1' : '#f1eef8',
        borderRadius: 24,
        padding: '5px 14px 5px 5px',
        width: '100%',
      }}
    >
      <span
        style={{
          width: 26,
          height: 26,
          borderRadius: '50%',
          background: on ? '#6c5fa6' : '#fff',
          boxShadow: '0 1px 3px rgba(40,30,60,.2)',
          flex: 'none',
          transition: '.15s',
        }}
      />
      <span style={{ fontSize: 13, fontWeight: 600, color: on ? '#2a2733' : '#9a93aa' }}>{label}</span>
    </button>
  )
}

function FaceTab({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontSize: 12,
        fontWeight: 600,
        padding: '5px 14px',
        borderRadius: 7,
        background: on ? '#fff' : 'transparent',
        color: on ? '#2a2733' : '#6f6a7d',
        boxShadow: on ? '0 1px 2px rgba(40,30,60,.1)' : 'none',
      }}
    >
      {label}
    </button>
  )
}

function SheetCard({
  card,
  size,
  contrast,
  verso,
  lgpWords,
}: {
  card: Card
  size: SizeKey
  contrast: boolean
  verso: boolean
  lgpWords: string[] | null
}) {
  const sz = SIZE_MAP[size]
  const f = FUNCS[card.func as FuncKey]
  const photoFront = !verso && card.source === 'photo' && card.photoUrl
  const picto = card.pictoCandidates?.[card.pictoIndex]
  const qr = resolveQrTarget(card, lgpWords)
  const captionLabel =
    qr?.kind === 'video'
      ? `vídeo: ${qr.host.toLowerCase()}`
      : qr?.kind === 'lgp' && qr.slug !== card.word.toLowerCase()
        ? `gesto: ${qr.slug}`
        : null

  const bandStyle = contrast
    ? {
        background: f.hc,
        color: f.hcText,
        fontWeight: 700,
        fontSize: sz.band + 5,
        textAlign: 'center' as const,
        padding: '7px 4px',
        letterSpacing: '0.02em',
        borderBottom: '3px solid #000',
      }
    : {
        background: f.color,
        color: '#fff',
        fontWeight: 700,
        fontSize: Math.max(9, sz.band + 2),
        padding: sz.band < 7 ? '4px 8px' : '5px 11px',
        letterSpacing: '0.06em',
        textAlign: 'center' as const,
        whiteSpace: 'nowrap' as const,
      }

  const artStyle = verso
    ? {
        backgroundImage: 'repeating-linear-gradient(45deg,#eceaf2 0 9px,#f5f3fa 9px 18px)',
        height: sz.art + sz.padV * 2,
        boxSizing: 'border-box' as const,
        padding: `${sz.padV}px 0`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative' as const,
      }
    : {
        background: '#fff',
        height: sz.art + sz.padV * 2,
        boxSizing: 'border-box' as const,
        padding: `${sz.padV}px 0`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }

  return (
    <div
      style={{
        border: `${contrast ? 3 : 2}px solid #000`,
        borderRadius: 10,
        overflow: 'hidden',
        background: '#fff',
        breakInside: 'avoid',
      }}
    >
      <div style={bandStyle}>{f.label.toUpperCase()}</div>
      <div style={artStyle}>
        {verso ? (
          <>
            {card.gestureImg ? (
              <img
                src={card.gestureImg}
                alt=""
                style={{ maxWidth: '88%', maxHeight: sz.art, objectFit: 'contain' }}
              />
            ) : qr ? null : (
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: Math.max(7, Math.round(sz.art * 0.115)),
                  color: '#7a7488',
                  textAlign: 'center',
                  lineHeight: 1.45,
                  textTransform: 'lowercase',
                }}
              >
                gesto
                <br />
                ilustração ou QR
              </div>
            )}
            {qr && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 5,
                  right: 5,
                  background: '#fff',
                  padding: 2,
                  borderRadius: 3,
                  lineHeight: 0,
                }}
              >
                <QrSvg
                  data={qr.url}
                  size={Math.round(sz.art * (card.gestureImg ? 0.32 : 0.62))}
                />
              </div>
            )}
          </>
        ) : photoFront ? (
          <img
            src={card.photoUrl!}
            alt=""
            style={{ maxWidth: '90%', maxHeight: sz.art, objectFit: 'contain' }}
          />
        ) : picto ? (
          <img src={picto.url} alt="" style={{ width: sz.art, height: sz.art, objectFit: 'contain' }} />
        ) : (
          <PictoMini size={sz.art} />
        )}
      </div>
      <div
        style={{
          fontFamily: "'Atkinson Hyperlegible',sans-serif",
          fontWeight: 700,
          fontSize: sz.word,
          color: '#000',
          textAlign: 'center',
          padding: verso && captionLabel ? '6px 6px 2px' : 6,
          borderTop: `${contrast ? 3 : 1}px solid ${contrast ? '#000' : '#ece8f2'}`,
          background: '#fff',
        }}
      >
        {card.word}
        {verso && captionLabel && (
          <div
            style={{
              fontSize: Math.max(7, Math.round(sz.word * 0.42)),
              fontWeight: 500,
              color: '#6f6a7d',
              letterSpacing: '0.02em',
              marginTop: 2,
              paddingBottom: 4,
            }}
          >
            {captionLabel}
          </div>
        )}
      </div>
    </div>
  )
}
