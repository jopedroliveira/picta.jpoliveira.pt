import { useEffect, useState } from 'react'
import { navigate } from '../router'

const FUNCS = [
  { func: 'PEDIR', color: '#C77D34', icon: '↑', word: 'água' },
  { func: 'RECUSAR', color: '#C0453B', icon: '✕', word: 'não' },
  { func: 'ESCOLHER', color: '#2F7E8C', icon: '⇄', word: 'mais' },
  { func: 'COMENTAR', color: '#3E8E5A', icon: '“', word: 'gosto' },
]

function goToApp(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault()
  navigate('/app')
}

export function Landing() {
  const [i, setI] = useState(0)
  const [vw, setVw] = useState<number>(() => (typeof window !== 'undefined' ? window.innerWidth : 1100))

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % FUNCS.length), 2200)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const handler = () => setVw(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const f = FUNCS[i]
  const mob = vw < 720
  const sm = vw < 520

  return (
    <div style={{ fontFamily: "'Hanken Grotesk',system-ui,sans-serif", color: '#2a2733', background: '#ece8f2' }}>
      <Nav sm={sm} mob={mob} />
      <Hero f={f} sm={sm} mob={mob} />
      <ComoFunciona sm={sm} mob={mob} />
      <OCartao sm={sm} mob={mob} />
      <DoisPublicos sm={sm} mob={mob} />
      <Principios sm={sm} mob={mob} />
      <CtaFinal sm={sm} mob={mob} />
      <Footer mob={mob} />
    </div>
  )
}

function BrandMark({ size = 34, swatch = 18 }: { size?: number; swatch?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.3),
        background: '#6c5fa6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, width: swatch, height: swatch }}>
        <div style={{ background: '#fff', borderRadius: 2 }} />
        <div style={{ background: '#c9c0e6', borderRadius: 2 }} />
        <div style={{ background: '#c9c0e6', borderRadius: 2 }} />
        <div style={{ background: '#fff', borderRadius: 2 }} />
      </div>
    </div>
  )
}

function Nav({ sm, mob }: { sm: boolean; mob: boolean }) {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(236,232,242,.85)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #d7d0e4',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: `0 ${sm ? 18 : 28}px`,
          height: 66,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <BrandMark />
          <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>Picta</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <nav style={{ display: sm ? 'none' : 'flex', alignItems: 'center', gap: mob ? 16 : 28 }}>
            <a href="#como" style={navLinkStyle}>
              Como funciona
            </a>
            <a href="#cartao" style={navLinkStyle}>
              O cartão
            </a>
            <a href="#principios" style={navLinkStyle}>
              Princípios
            </a>
          </nav>
          <a
            href="/app"
            onClick={goToApp}
            style={{
              background: '#6c5fa6',
              color: '#fff',
              fontSize: 15,
              fontWeight: 700,
              padding: '10px 18px',
              borderRadius: 10,
              whiteSpace: 'nowrap',
            }}
          >
            Criar cartões
          </a>
        </div>
      </div>
    </header>
  )
}

const navLinkStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 600,
  color: '#6f6a7d',
  whiteSpace: 'nowrap',
}

function Hero({
  f,
  sm,
  mob,
}: {
  f: (typeof FUNCS)[number]
  sm: boolean
  mob: boolean
}) {
  return (
    <section
      style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: mob ? '48px 18px 52px' : '84px 28px 72px',
        display: 'grid',
        gridTemplateColumns: mob ? '1fr' : '1.1fr 0.9fr',
        gap: mob ? 40 : 56,
        alignItems: 'center',
      }}
    >
      <div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#fff',
            border: '1px solid #d7d0e4',
            borderRadius: 100,
            padding: '7px 14px',
            fontSize: 13,
            fontWeight: 600,
            color: '#6c5fa6',
            marginBottom: 24,
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3E8E5A' }} />
          Gratuito e comunitário · pt-PT
        </div>
        <h1
          style={{
            fontSize: sm ? 34 : mob ? 44 : 54,
            lineHeight: 1.05,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            margin: '0 0 20px',
          }}
        >
          Comunicar em cartões, ao alcance de cada família.
        </h1>
        <p
          style={{
            fontSize: mob ? 17 : 19,
            lineHeight: 1.55,
            color: '#6f6a7d',
            margin: '0 0 32px',
            maxWidth: 520,
          }}
        >
          A Picta transforma uma lista de palavras em cartões de comunicação claros, prontos a ver, imprimir,
          plastificar e usar no dia a dia com crianças que usam CAA.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <a
            href="/app"
            onClick={goToApp}
            style={{
              background: '#6c5fa6',
              color: '#fff',
              fontSize: 17,
              fontWeight: 700,
              padding: '15px 28px',
              borderRadius: 12,
            }}
          >
            Criar os meus cartões →
          </a>
          <a
            href="#como"
            style={{ fontSize: 17, fontWeight: 700, color: '#2a2733', padding: '15px 8px' }}
          >
            Ver como funciona
          </a>
        </div>
        <div style={{ marginTop: 34, fontSize: 14, color: '#9a93aa' }}>Picta, comunicar em cartões.</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', ...(mob ? { order: -1 } : null) }}>
        <div
          style={{
            width: 280,
            background: '#fff',
            border: '2px solid #2a2733',
            borderRadius: 22,
            overflow: 'hidden',
            boxShadow: '0 24px 60px -20px rgba(54,40,80,.4)',
            transform: 'rotate(-2deg)',
          }}
        >
          <div
            style={{
              background: f.color,
              padding: '11px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              transition: 'background .4s ease',
            }}
          >
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: 7,
                background: 'rgba(255,255,255,.25)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              {f.icon}
            </span>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 15, letterSpacing: '0.02em' }}>
              {f.func}
            </span>
          </div>
          <div
            style={{
              background: '#f7f5fb',
              padding: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg viewBox="0 0 100 100" width={150} height={150} aria-hidden="true">
              <rect
                x="6"
                y="6"
                width="88"
                height="88"
                rx="12"
                fill="#fff"
                stroke="#cdd2e0"
                strokeWidth="2"
                strokeDasharray="5 5"
              />
              <circle cx="50" cy="38" r="16" fill="#9ec7e0" stroke="#2a2733" strokeWidth="3" />
              <path
                d="M26 82 Q26 56 50 56 Q74 56 74 82 Z"
                fill="#f0c27a"
                stroke="#2a2733"
                strokeWidth="3"
              />
            </svg>
          </div>
          <div style={{ padding: 18, textAlign: 'center', borderTop: '1px solid #ece8f2' }}>
            <span
              style={{
                fontFamily: "'Atkinson Hyperlegible',sans-serif",
                fontSize: 34,
                fontWeight: 700,
                color: '#161320',
              }}
            >
              {f.word}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

function ComoFunciona({ sm: _sm, mob }: { sm: boolean; mob: boolean }) {
  void _sm
  const steps = [
    {
      n: 1,
      title: 'Cole a lista',
      body: 'Escreva ou cole as palavras, uma por linha. A Picta procura o pictograma de cada uma no ARASAAC.',
    },
    {
      n: 2,
      title: 'Reveja e ajuste',
      body: 'Confirme cada cartão. Troque por outro pictograma ou use uma foto sua, a mãe, o copo da criança.',
    },
    {
      n: 3,
      title: 'Imprima',
      body: 'Veja a folha final, ajuste o tamanho e o contraste, e imprima para recortar e plastificar.',
    },
  ]
  const sm2 = window.innerWidth < 520
  return (
    <section
      id="como"
      style={{ background: '#faf9fc', borderTop: '1px solid #d7d0e4', borderBottom: '1px solid #d7d0e4' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: mob ? '56px 18px' : '84px 28px' }}>
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 56px' }}>
          <Eyebrow>Como funciona</Eyebrow>
          <h2
            style={{
              fontSize: 38,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              margin: '14px 0 14px',
            }}
          >
            Da lista de palavras à folha pronta a imprimir
          </h2>
          <p style={{ fontSize: 17, color: '#6f6a7d', lineHeight: 1.55, margin: 0 }}>
            Três passos calmos. Sem conta, sem instalação, sem ruído. Pensado para quem tem pouco tempo.
          </p>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${sm2 ? 1 : mob ? 2 : 3},1fr)`,
            gap: mob ? 14 : 20,
          }}
        >
          {steps.map((s) => (
            <div
              key={s.n}
              style={{
                background: '#fff',
                border: '1px solid #e4dff0',
                borderRadius: 18,
                padding: 26,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 11,
                  background: '#ece8f2',
                  color: '#6c5fa6',
                  fontWeight: 800,
                  fontSize: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {s.n}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: '18px 0 8px' }}>{s.title}</h3>
              <p style={{ fontSize: 15, color: '#6f6a7d', lineHeight: 1.5, margin: 0 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function OCartao({ sm, mob }: { sm: boolean; mob: boolean }) {
  return (
    <section id="cartao" style={{ maxWidth: 1100, margin: '0 auto', padding: mob ? '56px 18px' : '88px 28px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: mob ? '1fr' : '0.95fr 1.05fr',
          gap: mob ? 40 : 64,
          alignItems: 'center',
        }}
      >
        <div>
          <Eyebrow>O cartão primeiro</Eyebrow>
          <h2
            style={{
              fontSize: sm ? 28 : mob ? 32 : 38,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              margin: '14px 0 18px',
              lineHeight: 1.1,
            }}
          >
            O verdadeiro produto é o que a criança vê.
          </h2>
          <p style={{ fontSize: 17, color: '#6f6a7d', lineHeight: 1.6, margin: '0 0 26px' }}>
            Tudo o que é decorativo na app desaparece no cartão. A área do símbolo e da palavra mantém-se sempre
            limpa e de contraste máximo. A cor da função vive apenas numa faixa fina, numa aresta, nunca sobre o
            pictograma.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Bullet color="#C77D34" title="Pista redundante." body="A função leva sempre ícone e palavra, não só cor, funciona com daltonismo e baixa visão." />
            <Bullet color="#2F7E8C" title="Rótulo legível." body="A palavra em Atkinson Hyperlegible, alto contraste, para apresentação multimodal." />
            <Bullet color="#3E8E5A" title="Modos de acessibilidade." body="Alto contraste / baixa visão e foto real, quando reconhecer a foto é mais fácil." />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 22, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          <CardStandard />
          <CardHighContrast />
        </div>
      </div>
    </section>
  )
}

function Bullet({ color, title, body }: { color: string; title: string; body: string }) {
  return (
    <div style={{ display: 'flex', gap: 13, alignItems: 'flex-start' }}>
      <div style={{ width: 11, height: 11, borderRadius: '50%', background: color, marginTop: 5, flex: 'none' }} />
      <div>
        <span style={{ fontWeight: 700 }}>{title}</span>{' '}
        <span style={{ color: '#6f6a7d' }}>{body}</span>
      </div>
    </div>
  )
}

function CardStandard() {
  return (
    <div style={{ width: 210, background: '#fff', border: '2px solid #2a2733', borderRadius: 18, overflow: 'hidden' }}>
      <div style={{ background: '#C77D34', padding: '9px 15px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            width: 21,
            height: 21,
            borderRadius: 6,
            background: 'rgba(255,255,255,.25)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          ↑
        </span>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>PEDIR</span>
      </div>
      <div style={{ background: '#f7f5fb', padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 100 100" width={108} height={108} aria-hidden="true">
          <circle cx="50" cy="38" r="15" fill="#9ec7e0" stroke="#2a2733" strokeWidth="3" />
          <path d="M28 80 Q28 56 50 56 Q72 56 72 80 Z" fill="#f0c27a" stroke="#2a2733" strokeWidth="3" />
        </svg>
      </div>
      <div style={{ padding: 13, textAlign: 'center', borderTop: '1px solid #ece8f2' }}>
        <span style={{ fontFamily: "'Atkinson Hyperlegible',sans-serif", fontSize: 26, fontWeight: 700 }}>água</span>
      </div>
      <div style={{ fontSize: 11, color: '#9a93aa', textAlign: 'center', padding: '0 0 11px' }}>padrão</div>
    </div>
  )
}

function CardHighContrast() {
  return (
    <div style={{ width: 210, background: '#fff', border: '3px solid #000', borderRadius: 18, overflow: 'hidden' }}>
      <div
        style={{
          background: '#F08C00',
          padding: '11px 15px',
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          borderBottom: '3px solid #000',
        }}
      >
        <span style={{ color: '#1a1208', fontWeight: 700, fontSize: 17 }}>↑ PEDIR</span>
      </div>
      <div style={{ background: '#fff', padding: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 100 100" width={116} height={116} aria-hidden="true">
          <circle cx="50" cy="38" r="17" fill="#fff" stroke="#000" strokeWidth="5" />
          <path d="M24 82 Q24 54 50 54 Q76 54 76 82 Z" fill="#fff" stroke="#000" strokeWidth="5" />
        </svg>
      </div>
      <div style={{ padding: 13, textAlign: 'center', borderTop: '3px solid #000' }}>
        <span style={{ fontFamily: "'Atkinson Hyperlegible',sans-serif", fontSize: 30, fontWeight: 700, color: '#000' }}>
          água
        </span>
      </div>
      <div style={{ fontSize: 11, color: '#9a93aa', textAlign: 'center', padding: '0 0 11px' }}>alto contraste</div>
    </div>
  )
}

function DoisPublicos({ sm, mob }: { sm: boolean; mob: boolean }) {
  return (
    <section style={{ background: '#6c5fa6', color: '#fff' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: mob ? '56px 18px' : '80px 28px' }}>
        <div style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto 48px' }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#c9c0e6',
            }}
          >
            Duas camadas, um propósito
          </div>
          <h2
            style={{
              fontSize: sm ? 28 : mob ? 32 : 38,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              margin: '14px 0',
            }}
          >
            Quem opera e quem usa têm necessidades opostas.
          </h2>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: mob ? '1fr' : '1fr 1fr',
            gap: mob ? 16 : 22,
          }}
        >
          <div style={publicoCard}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#c9c0e6', marginBottom: 10 }}>
              Adultos · operam a app
            </div>
            <p style={publicoText}>
              Pais e técnicos, muitas vezes cansados e sem tempo. A interface deles é calma, simples e acolhedora,
              nunca clínica nem fria.
            </p>
          </div>
          <div style={publicoCard}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#c9c0e6', marginBottom: 10 }}>
              Crianças · usam os cartões
            </div>
            <p style={publicoText}>
              Algumas com baixa visão. No cartão mandam o contraste alto, o tamanho generoso, um símbolo por
              cartão e zero ruído visual.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

const publicoCard: React.CSSProperties = {
  background: 'rgba(255,255,255,.08)',
  border: '1px solid rgba(255,255,255,.18)',
  borderRadius: 18,
  padding: 30,
}
const publicoText: React.CSSProperties = { fontSize: 17, lineHeight: 1.55, margin: 0, color: '#f0edf7' }

function Principios({ sm, mob }: { sm: boolean; mob: boolean }) {
  const items = [
    {
      bg: '#fbf0e4',
      color: '#C77D34',
      glyph: '◎',
      title: 'Acessibilidade como ponto de partida',
      body:
        'Não é um acabamento. Vale para a interface, legibilidade, alvos de toque grandes, bom contraste, e, de forma extrema, para os cartões.',
    },
    {
      bg: '#fae8e6',
      color: '#C0453B',
      glyph: '♡',
      title: 'Calmo e humano',
      body:
        'As famílias que chegam aqui vivem muitas vezes situações difíceis. O produto transmite confiança e cuidado, sem hospital nem infantilização.',
    },
    {
      bg: '#e3f0f2',
      color: '#2F7E8C',
      glyph: '▣',
      title: 'O cartão primeiro',
      body:
        'Todas as decisões visuais se subordinam à clareza do cartão final. Se algo não ajuda a criança a comunicar, não entra no cartão.',
    },
    {
      bg: '#e4f1e9',
      color: '#3E8E5A',
      glyph: '⎙',
      title: 'Pronto para imprimir',
      body:
        'Muitas famílias imprimem e plastificam. O resultado tem de ficar impecável em papel, não só no ecrã. Português primeiro, pronto para mais línguas.',
    },
  ]
  return (
    <section id="principios" style={{ maxWidth: 1100, margin: '0 auto', padding: mob ? '56px 18px' : '88px 28px' }}>
      <div style={{ maxWidth: 640, margin: '0 0 52px' }}>
        <Eyebrow>Princípios e valores</Eyebrow>
        <h2
          style={{
            fontSize: sm ? 28 : mob ? 32 : 38,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            margin: '14px 0',
          }}
        >
          O que nos guia em cada decisão
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: mob ? 16 : 22 }}>
        {items.map((p) => (
          <div
            key={p.title}
            style={{ background: '#fff', border: '1px solid #e4dff0', borderRadius: 18, padding: 30 }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: p.bg,
                color: p.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
              }}
            >
              {p.glyph}
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, margin: '18px 0 8px' }}>{p.title}</h3>
            <p style={{ fontSize: 16, color: '#6f6a7d', lineHeight: 1.55, margin: 0 }}>{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function CtaFinal({ sm, mob }: { sm: boolean; mob: boolean }) {
  return (
    <section
      id="comecar"
      style={{ maxWidth: 1100, margin: '0 auto', padding: mob ? '68px 18px' : '96px 28px', textAlign: 'center' }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: 17,
          background: '#6c5fa6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 26px',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, width: 32, height: 32 }}>
          <div style={{ background: '#fff', borderRadius: 4 }} />
          <div style={{ background: '#c9c0e6', borderRadius: 4 }} />
          <div style={{ background: '#c9c0e6', borderRadius: 4 }} />
          <div style={{ background: '#fff', borderRadius: 4 }} />
        </div>
      </div>
      <h2
        style={{
          fontSize: sm ? 30 : mob ? 36 : 42,
          fontWeight: 800,
          letterSpacing: '-0.025em',
          margin: '0 0 16px',
        }}
      >
        Comece a primeira coleção de cartões.
      </h2>
      <p style={{ fontSize: 18, color: '#6f6a7d', lineHeight: 1.55, maxWidth: 520, margin: '0 auto 34px' }}>
        Gratuito, sem conta. Da lista à folha pronta a plastificar em poucos minutos.
      </p>
      <a
        href="/app"
        onClick={goToApp}
        style={{
          display: 'inline-block',
          background: '#6c5fa6',
          color: '#fff',
          fontSize: 18,
          fontWeight: 700,
          padding: '17px 34px',
          borderRadius: 13,
        }}
      >
        Criar os meus cartões →
      </a>
    </section>
  )
}

function Footer({ mob }: { mob: boolean }) {
  return (
    <footer style={{ background: '#2a2733', color: '#b8b2c4' }}>
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: mob ? '34px 18px' : '44px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <BrandMark size={30} swatch={16} />
          <span style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>Picta</span>
          <span style={{ fontSize: 14, color: '#8a8497', marginLeft: 6 }}>comunicar em cartões</span>
        </div>
        <div
          style={{
            fontSize: 13,
            color: '#8a8497',
            lineHeight: 1.6,
            textAlign: mob ? 'left' : 'right',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              justifyContent: mob ? 'flex-start' : 'flex-end',
              flexWrap: 'wrap',
            }}
          >
            <span>
              Projeto opensource por{' '}
              <a
                href="https://jpoliveira.pt"
                target="_blank"
                rel="noreferrer"
                style={{ color: '#c9c0e6', textDecoration: 'underline' }}
              >
                jpoliveira.pt
              </a>
            </span>
            <a
              href="mailto:pedro@jpoliveira.pt"
              aria-label="Email: pedro@jpoliveira.pt"
              title="pedro@jpoliveira.pt"
              style={{ color: '#c9c0e6', display: 'inline-flex', alignItems: 'center' }}
            >
              <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2.5" />
                <path d="M4 7.5l8 6 8-6" />
              </svg>
            </a>
            <a
              href="https://github.com/jopedroliveira/picta.jpoliveira.pt"
              target="_blank"
              rel="noreferrer"
              aria-label="Código no GitHub"
              title="GitHub"
              style={{ color: '#c9c0e6', display: 'inline-flex', alignItems: 'center' }}
            >
              <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true" fill="currentColor">
                <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.56 9.56 0 0 1 12 6.8c.85 0 1.71.11 2.51.33 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />
              </svg>
            </a>
          </div>
          <div style={{ marginTop: 4 }}>
            Pictogramas: ARASAAC (Sergio Palao) · CC BY-NC-SA · gratuito e não comercial
          </div>
        </div>
      </div>
    </footer>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#6c5fa6',
      }}
    >
      {children}
    </div>
  )
}
