import { useState } from 'react'
import { Home, CalendarDays, ClipboardList, AlertCircle, TrendingUp, Settings, Flame, LogOut, Target } from 'lucide-react'
import { useApp } from '../store.jsx'
import { calcStreak, initials } from '../utils.js'
import Dashboard from '../pages/Dashboard.jsx'
import PlanPage from '../pages/PlanPage.jsx'
import MocksPage from '../pages/MocksPage.jsx'
import MistakesPage from '../pages/MistakesPage.jsx'
import ProgressPage from '../pages/ProgressPage.jsx'
import SettingsPage from '../pages/SettingsPage.jsx'
import LessonPage from '../pages/LessonPage.jsx'

const nav = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'plan', label: 'Study Plan', icon: CalendarDays },
  { id: 'mocks', label: 'Mock Tests', icon: ClipboardList },
  { id: 'mistakes', label: 'Mistakes', icon: AlertCircle },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const titles = {
  dashboard: 'Today',
  plan: 'Study Plan',
  mocks: 'Mock Tests',
  mistakes: 'Mistake Log',
  progress: 'Progress Report',
  settings: 'Settings',
}

export default function Layout() {
  const { user, state, actions, signOut } = useApp()
  const [page, setPage] = useState('dashboard')
  const [lessonId, setLessonId] = useState(null)

  const streak = calcStreak(state)
  const openMistakes = Object.values(state.mistakes)
    .flat()
    .filter((m) => !m.resolved).length

  const openLesson = (id) => {
    setLessonId(id)
    window.scrollTo(0, 0)
  }

  const goPage = (id) => {
    setPage(id)
    setLessonId(null)
    window.scrollTo(0, 0)
  }

  const displayName = state.profile.fullName || (user && user.email) || 'Student'
  const firstName = displayName.split(/[\s@]/)[0]

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-logo">
            <Target size={20} strokeWidth={2.2} />
          </span>
          <span>PPSC Prep Coach</span>
        </div>
        <nav className="nav">
          {nav.map((n) => {
            const Icon = n.icon
            return (
              <button
                key={n.id}
                className={`nav-btn ${page === n.id ? 'active' : ''}`}
                onClick={() => goPage(n.id)}
              >
                <Icon size={18} strokeWidth={2} />
                <span className="nav-label">{n.label}</span>
                {n.id === 'mistakes' && openMistakes > 0 && <span className="nav-count">{openMistakes}</span>}
              </button>
            )
          })}
        </nav>
        <div className="user-chip">
          <div className="avatar">{initials(state.profile.fullName)}</div>
          <div className="user-meta">
            <b>{firstName}</b>
            <span>{user ? user.email : 'Local mode'}</span>
          </div>
          {user && (
            <button className="icon-btn" title="Sign out" onClick={signOut}>
              <LogOut size={16} strokeWidth={2} />
            </button>
          )}
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h1>{titles[page]}</h1>
            <p className="muted">
              {new Date().toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <div className="streak-chip" title="Day streak">
            <Flame size={16} strokeWidth={2} className="streak-flame" />
            <span>
              {streak} day{streak === 1 ? '' : 's'}
            </span>
          </div>
        </header>

        <div className="content">
          {lessonId ? (
            <LessonPage lessonId={lessonId} onBack={() => setLessonId(null)} />
          ) : (
            <>
              {page === 'dashboard' && <Dashboard openLesson={openLesson} goPage={goPage} />}
              {page === 'plan' && <PlanPage openLesson={openLesson} goPage={goPage} />}
              {page === 'mocks' && <MocksPage />}
              {page === 'mistakes' && <MistakesPage />}
              {page === 'progress' && <ProgressPage />}
              {page === 'settings' && <SettingsPage />}
            </>
          )}
        </div>

        <footer className="foot muted">
          Study reference only — always verify the latest syllabus and eligibility on the official PPSC website
          (ppssc.gop.pk).
        </footer>
      </main>
    </div>
  )
}
