import { AppProvider, useApp } from './store.jsx'
import { isCloud } from './api.js'
import AuthScreen from './components/AuthScreen.jsx'
import Layout from './components/Layout.jsx'

function Shell() {
  const { authReady, loading, user } = useApp()

  if (!authReady || loading) {
    return (
      <div className="splash">
        <div className="splash-logo">🎯</div>
        <h2>PPSC Prep Coach</h2>
        <div className="spinner" />
      </div>
    )
  }

  if (isCloud && !user) return <AuthScreen />
  return <Layout />
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}
