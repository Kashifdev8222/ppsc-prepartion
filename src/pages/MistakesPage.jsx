import { useState } from 'react'
import { enrichedDays } from '../data/plan.js'
import { useApp } from '../store.jsx'

const letters = ['a', 'b', 'c', 'd']

export default function MistakesPage() {
  const { state, actions } = useApp()
  const days = enrichedDays(state)
  const lessonTitle = (id) => {
    const meta = days.find((d) => d.lessonId === id)
    return meta ? `Day ${meta.globalDay} — ${meta.title}` : id
  }

  const all = []
  Object.entries(state.mistakes).forEach(([lessonId, list]) => {
    list.forEach((m) => all.push({ lessonId, ...m }))
  })
  const openItems = all.filter((m) => !m.resolved)
  const resolvedItems = all.filter((m) => m.resolved)

  const [filter, setFilter] = useState('all')
  const groups = [...new Set(openItems.map((m) => m.lessonId))]
  const visible = filter === 'all' ? openItems : openItems.filter((m) => m.lessonId === filter)
  const [showResolved, setShowResolved] = useState(false)

  return (
    <div>
      <div className="card">
        <h2>❌ Mistake log</h2>
        <p className="muted">
          Every wrong answer from your quizzes lands here. Review these before the weekly mock test. Reviewed mistakes
          stay in your history.
        </p>
        {openItems.length > 0 && (
          <div className="row mt">
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All lessons ({openItems.length})</option>
              {groups.map((g) => (
                <option key={g} value={g}>
                  {lessonTitle(g)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {openItems.length === 0 ? (
        <div className="card">
          <p>🎉 No open mistakes — great work.</p>
        </div>
      ) : (
        visible.map((m, i) => (
          <div className="card" key={m.id || i}>
            <p className="muted">{lessonTitle(m.lessonId)}</p>
            <p>
              <strong>Q:</strong> {m.q}
            </p>
            <p>
              Your answer:{' '}
              <span style={{ color: '#b91c1c' }}>
                {m.given === null || m.given === undefined
                  ? 'not answered'
                  : `${letters[m.given]}) ${m.options[m.given]}`}
              </span>
            </p>
            <p>
              Correct: <span style={{ color: '#166534' }}>{letters[m.correct]}) {m.options[m.correct]}</span>
            </p>
            <p className="explain">{m.explain}</p>
            <button className="btn ghost mt" onClick={() => actions.toggleMistake(m.lessonId, m.id)}>
              ✓ Mark reviewed
            </button>
          </div>
        ))
      )}

      {resolvedItems.length > 0 && (
        <div className="card">
          <button className="btn ghost" onClick={() => setShowResolved((v) => !v)}>
            {showResolved ? '▲ Hide' : '▼ Show'} reviewed mistakes ({resolvedItems.length})
          </button>
          {showResolved && (
            <div className="mt">
              {resolvedItems.map((m, i) => (
                <p key={m.id || i} className="muted small-history">
                  {lessonTitle(m.lessonId)} — {m.q} → correct: {letters[m.correct]}) {m.options[m.correct]}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
