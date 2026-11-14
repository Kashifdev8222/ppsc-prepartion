import { useState } from 'react'
import { weeks, enrichedDays, fmtDate, dayStatus, weekRange } from '../data/plan.js'
import { lessons } from '../data/index.js'
import { useApp } from '../store.jsx'

const phaseClass = { Foundation: 'blue', Expand: 'amber', Exam: 'green', Final: 'green' }

const statusLabel = {
  done: '✅ Done',
  today: '▶️ Today',
  missed: '❌ Missed',
  upcoming: '⏳ Upcoming',
}

export default function PlanPage({ openLesson, goPage }) {
  const { state } = useApp()
  const days = enrichedDays(state)
  const byWeek = {}
  days.forEach((d) => {
    if (!byWeek[d.weekId]) byWeek[d.weekId] = []
    byWeek[d.weekId].push(d)
  })
  const [open, setOpen] = useState({ 1: true })

  return (
    <div>
      <div className="card">
        <h2>🗺️ 12-week programme</h2>
        <p className="muted">
          One main subject every day on a fixed weekly rotation: Monday English · Tuesday Pakistan Studies · Wednesday
          Mathematics · Thursday Computer · Friday GK &amp; Everyday Science · Saturday Islamic Studies, Urdu &amp;
          Reasoning · Sunday weekly test. The other six short sessions run every day.
        </p>
        <p className="muted mt">
          Past patterns are only a reference — always check ppssc.gop.pk when a vacancy is announced.
        </p>
      </div>

      {weeks.map((w) => {
        const wd = byWeek[w.id] || []
        const done = wd.filter((d) => d.completed).length
        const isOpen = !!open[w.id]
        const range = weekRange(w.id)
        return (
          <div className="card" key={w.id}>
            <div className="weekhead" onClick={() => setOpen((o) => ({ ...o, [w.id]: !isOpen }))}>
              <div>
                <span className={`badge ${phaseClass[w.phase]}`}>{w.phase}</span>
                <strong>
                  Week {w.id} — {w.title}
                </strong>
                {range && <span className="muted"> · {range}</span>}
              </div>
              <span className="muted">{isOpen ? '▲' : '▼'}</span>
            </div>

            <div className="chips">
              {w.topics.map((t, i) => (
                <span className="chip-grey" key={i}>
                  {t}
                </span>
              ))}
            </div>

            <div className="bar">
              <div className="fill" style={{ width: `${done ? (done / wd.length) * 100 : 0}%` }} />
            </div>
            <p className="muted">
              {done}/{wd.length} days done
            </p>

            {isOpen &&
              wd.map((d) => {
                const st = dayStatus(d, state)
                const hasLesson = !!lessons[d.lessonId]
                return (
                  <div className={`day-row ${st === 'today' ? 'today' : ''}`} key={d.globalDay}>
                    <div className="day-main">
                      <span className={`chip ${st}`}>{statusLabel[st]}</span>
                      <span className="chip-grey">{d.isTest ? '☀️ Test' : d.subject}</span>
                      <span>
                        <strong>
                          Day {d.globalDay} — {d.title}
                        </strong>
                        <span className="muted"> · {fmtDate(d.date)}</span>
                      </span>
                    </div>
                    {d.isTest ? (
                      <button className="btn" onClick={() => goPage('mocks')}>
                        Mock tests
                      </button>
                    ) : hasLesson ? (
                      <button className="btn" onClick={() => openLesson(d.lessonId)}>
                        Open
                      </button>
                    ) : (
                      <span className="muted">coming soon</span>
                    )}
                  </div>
                )
              })}
          </div>
        )
      })}
    </div>
  )
}
