import { CardEditor } from './components/CardEditor'
import { Header } from './components/Header'
import { useRoute } from './router'
import { Colecoes } from './screens/Colecoes'
import { ColecoesGlobais } from './screens/ColecoesGlobais'
import { Entrada } from './screens/Entrada'
import { Impressao } from './screens/Impressao'
import { Landing } from './screens/Landing'
import { Revisao } from './screens/Revisao'
import { usePicta } from './state'

export function App() {
  const route = useRoute()
  return route === 'app' ? <PictaApp /> : <Landing />
}

export function PictaApp() {
  const api = usePicta()
  const { screen, cards, editingId } = api
  const editing = editingId != null ? (cards ?? []).find((c) => c.id === editingId) ?? null : null

  return (
    <div
      className="app-root"
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Hanken Grotesk',system-ui,sans-serif",
        color: '#2a2733',
        background: '#ece8f2',
        overflow: 'hidden',
      }}
    >
      <Header api={api} />
      <main className="app-main" style={{ flex: 1, overflowY: 'auto' }}>
        {screen === 'entrada' && <Entrada api={api} />}
        {screen === 'revisao' && <Revisao api={api} />}
        {screen === 'impressao' && <Impressao api={api} />}
        {screen === 'colecoes' && <Colecoes api={api} />}
        {screen === 'globais' && <ColecoesGlobais api={api} />}
      </main>
      {editing && <CardEditor api={api} card={editing} />}
    </div>
  )
}
