import { useState } from 'react'
import { mocks, mockList, isWeekReady } from '../data/mocks/index.js'
import { useApp } from '../store.jsx'
import QuizRunner from '../components/QuizRunner.jsx'

export default function MocksPage() {
  const { state, actions } = useApp()
  const [active, setActive] = useState(null)

  if (active) {
    const mock = mocks[active]
    const meta = mockList.find((m) => m.id === active)
    if (!mock) {
      return (
        <div>
          <button className="btn ghost" onClick={() => setActive(null)}>
            ← Back
          </button>
          <div className="card">
            <h2>{meta ? meta.title : active}</h2>
            <p className="note">Unlocked! Your tutor will add the questions — ask in the chat.</p>
          </div>
        </div>
      )
    }
    return (
      <div>
        <button className="btn ghost" onClick={() => setActive(null)}>
          ← Back to mock tests
        </button>
        <QuizRunner
          key={mock.id}
          storageKey={mock.id}
          title={mock.title}
          questions={mock.questions}
          history={state.quizzes[mock.id]}
          onAttempt={(a, w) => actions.recordAttempt(mock.id, a, w)}
        />
      </div>
    )
  }

  return (
    <div>
      <div className="card">
        <h2>📋 Mock tests</h2>
        <p className="muted">
          Weekly: 50 questions every Sunday · Monthly: full-length after every 4 weeks. Every attempt is saved. Tests
          unlock on the Sunday of their week.
        </p>
      </div>

      {mockList.map((m) => {
        const unlocked = isWeekReady(state, m.unlockWeek)
        const attempts = state.quizzes[m.id] || []
        return (
          <div className={`card ${unlocked ? '' : 'locked-card'}`} key={m.id}>
            <h3>
              {m.title}{' '}
              {attempts.length > 0 && (
                <span className="badge green">
                  best {Math.max(...attempts.map((a) => Math.round((a.score / a.total) * 100)))}%
                </span>
              )}
            </h3>
            <p className="muted">{m.desc}</p>
            <div className="mt">
              {unlocked ? (
                mocks[m.id] ? (
                  <button className="btn primary" onClick={() => setActive(m.id)}>
                    Start test
                  </button>
                ) : (
                  <p className="note">Unlocked! Your tutor will add the questions — ask in the chat.</p>
                )
              ) : (
                <span className="chip upcoming">🔒 Opens Sunday of Week {m.unlockWeek}</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
