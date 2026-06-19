import { useEffect, useState } from 'react'

export type Route = 'landing' | 'app'

function pathToRoute(path: string): Route {
  return path.startsWith('/app') ? 'app' : 'landing'
}

export function navigate(path: string) {
  if (window.location.pathname === path) return
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => pathToRoute(window.location.pathname))

  useEffect(() => {
    const handler = () => setRoute(pathToRoute(window.location.pathname))
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [])

  return route
}
