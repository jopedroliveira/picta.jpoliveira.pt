import type { UsePictaApi } from '../state'

interface EntradaProps {
  api: UsePictaApi
}

export function Entrada({ api }: EntradaProps) {
  const { wordsText, vw, setWordsText, go, loadExample, setScreen } = api
  const mob = vw < 640
  const words = wordsText
    .split('\n')
    .map((w) => w.trim())
    .filter(Boolean)

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: mob ? '34px 16px 80px' : '56px 32px 80px' }}>
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: '#9a93aa',
        }}
      >
        Nova coleção
      </div>
      <h1
        style={{
          fontSize: mob ? 26 : 34,
          fontWeight: 800,
          letterSpacing: '-0.02em',
          margin: '10px 0 8px',
        }}
      >
        Que palavras quer transformar em cartões?
      </h1>
      <p style={{ fontSize: 16, color: '#6f6a7d', margin: '0 0 28px', lineHeight: 1.5, maxWidth: 560 }}>
        Cole ou escreva uma lista, uma palavra por linha. A Picta procura o pictograma de cada uma no ARASAAC
        e prepara os cartões para rever.
      </p>

      <div
        style={{
          background: '#fff',
          borderRadius: 18,
          boxShadow: '0 1px 3px rgba(40,30,60,.06)',
          overflow: 'hidden',
        }}
      >
        <textarea
          value={wordsText}
          onChange={(e) => setWordsText(e.target.value)}
          placeholder={'água\nquero mais\nnão\ngosto\na mãe\ndormir'}
          style={{
            width: '100%',
            minHeight: 240,
            border: 'none',
            resize: 'vertical',
            padding: 24,
            fontFamily: "'Hanken Grotesk',sans-serif",
            fontSize: 18,
            lineHeight: 1.7,
            color: '#2a2733',
            background: 'transparent',
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
            borderTop: '1px solid #ece8f2',
            background: '#faf9fc',
          }}
        >
          <div style={{ fontSize: 13, color: '#9a93aa' }}>{words.length} palavras · uma por linha</div>
          <button
            onClick={() => go('revisao')}
            disabled={words.length === 0}
            style={{
              background: words.length === 0 ? '#bdb7c9' : '#6c5fa6',
              color: '#fff',
              border: 'none',
              borderRadius: 11,
              padding: '13px 24px',
              fontSize: 16,
              fontWeight: 700,
              cursor: words.length === 0 ? 'default' : 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            Procurar pictogramas →
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 18, flexWrap: 'wrap' }}>
        <button
          onClick={loadExample}
          style={{
            background: '#fff',
            border: '1px solid #d7d0e4',
            borderRadius: 10,
            padding: '10px 16px',
            fontSize: 14,
            fontWeight: 600,
            color: '#6c5fa6',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Usar exemplo: rotina da manhã
        </button>
        <button
          onClick={() => setScreen('globais')}
          style={{
            background: '#fff',
            border: '1px solid #d7d0e4',
            borderRadius: 10,
            padding: '10px 16px',
            fontSize: 14,
            fontWeight: 600,
            color: '#6c5fa6',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Ver coleções globais
        </button>
      </div>

      <p style={{ fontSize: 12, color: '#a39db3', marginTop: 40, lineHeight: 1.6, maxWidth: 560 }}>
        Pictogramas de Sergio Palao para o ARASAAC, propriedade do Governo de Aragão, licença CC BY-NC-SA.
        As fotografias que adicionar ficam no seu dispositivo e não são partilhadas.
      </p>
    </div>
  )
}
