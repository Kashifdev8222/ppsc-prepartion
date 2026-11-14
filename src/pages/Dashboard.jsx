import { useApp } from '../store.jsx'
import { lessons } from '../data/index.js'
import { enrichedDays, routineSteps, WEEK1_START, fmtDate, dayStatus } from '../data/plan.js'
import { todayStr, calcStreak, scorePct } from '../utils.js'
import { Sparkline } from '../components/charts.jsx'

export default function Dashboard({ openLesson, goPage }) {
  const { state, actions } = useApp()
  const days = enrichedDays(state)
  const today = new Date()
  const todayKey = todayStr(today)
  const todayDay = days.find((d) => todayStr(d.date) === todayKey)
  const beforeStart = today < new Date(WEEK1_START + 'T00:00:00')

  const doneCount = days.filter((d) => d.completed).length
  const missed = days.filter((d) => dayStatus(d, state) === 'missed')
  const routine = state.routine[todayKey] || []
  const streak = calcStreak(state)

  const allAttempts = Object.entries(state.quizzes)
    .flatMap(([k, arr]) => arr.map((a) => ({ ...a, key: k })))
    .sort((a, b) => (a.date < b.date ? -1 : 1))
  const spark = allAttempts.slice(-8).map((a) => scorePct(a.score, a.total))
  const avg =
    allAttempts.length > 0
      ? Math.round(allAttempts.reduce((s, a) => s + scorePct(a.score, a.total), 0) / allAttempts.length)
      : 0
  const answered = allAttempts.reduce((s, a) => s + a.total, 0)

  const toggleRoutine = (i) => actions.toggleRoutine(todayKey, i)
  const notes = state.notes[todayKey] || ''
  const setNotes = (v) => actions.setNotes(todayKey, v)

  let hero
  if (beforeStart) {
    hero = (
      <div className="hero">
        <div>
          <span className="badge light">📅 Starts Monday</span>
          <h2>Your programme begins {fmtDate(new Date(WEEK1_START + 'T00:00:00'))}…</h2>
          <p>
            Daily routine: 2.5 hours — main subject + English + Pak Studies/GK + Maths + Computer + Current affairs +
            MCQs. Day 1 is ready to preview.
          </p>
        </div>
        <button className="btn white" onClick={() => openLesson('day01')}>
          Preview Day 1
        </button>
      </div>
    )
  } else if (todayDay && todayDay.isTest) {
    hero = (
      <div className="hero">
        <div>
          <span className="badge light">☀️ {todayDay.title}</span>
          <h2>Sunday — weekly test &amp; revision day</h2>
          <p>Revise this week’s notes, review the ❌ Mistake Log, then attempt the 50-question weekly test.</p>
        </div>
        <button className="btn white" onClick={() => goPage('mocks')}>
          Open Mock Tests
        </button>
      </div>
    )
  } else if (todayDay) {
    const hasLesson = !!lessons[todayDay.lessonId]
    hero = (
      <div className="hero">
        <div>
          <span className={`badge ${todayDay.completed ? 'green' : 'light'}`}>
            {todayDay.completed ? '✅ Completed' : '📖 Today’s main subject'}
          </span>
          <h2>
            {todayDay.subject} — {todayDay.title}
          </h2>
          <p>
            Day {todayDay.globalDay} · Week {todayDay.weekId} · {fmtDate(todayDay.date)}
          </p>
        </div>
        {hasLesson ? (
          <button className="btn white" onClick={() => openLesson(todayDay.lessonId)}>
            {todayDay.completed ? 'Review lesson' : 'Start today’s lesson'}
          </button>
        ) : (
          <div className="note light">📝 This lesson is being prepared by your tutor.</div>
        )}
      </div>
    )
  } else {
    hero = (
      <div className="hero">
        <div>
          <span className="badge light">🎉</span>
          <h2>All scheduled days done</h2>
          <p>Revise weak areas, retake old quizzes, or ask your tutor for extra practice.</p>
        </div>
      </div>
    )
  }

  const routineLabel = (i) => (i === 0 && todayDay ? `Main subject (${todayDay.subject}) — 40 min` : routineSteps[i])

  return (
    <div>
      {hero}

      <div className="stats-grid">
        <div className="stat-card">
          <b>🔥 {streak}</b>
          <span className="muted">day streak</span>
        </div>
        <div className="stat-card">
          <b>
            {doneCount}
            <span className="muted">/{days.length}</span>
          </b>
          <span className="muted">days done</span>
        </div>
        <div className="stat-card">
          <b>{avg}%</b>
          <span className="muted">average score</span>
        </div>
        <div className="stat-card">
          <b>{answered}</b>
          <span className="muted">questions answered</span>
        </div>
      </div>

      {missed.length > 0 && (
        <div className="card missed-card">
          <h2>⚠️ {missed.length} missed day{missed.length > 1 ? 's' : ''} — catch up</h2>
          {missed.map((d) => {
            const hasLesson = !!lessons[d.lessonId]
            return (
              <div className="missed-row" key={d.globalDay}>
                <div>
                  <strong>
                    Day {d.globalDay} — {d.title}
                  </strong>
                  <span className="muted"> · {fmtDate(d.date)}</span>
                </div>
                <div className="row">
                  {d.isTest ? (
                    <button className="btn" onClick={() => goPage('mocks')}>
                      Open tests
                    </button>
                  ) : (
                    hasLesson && (
                      <button className="btn" onClick={() => openLesson(d.lessonId)}>
                        Open lesson
                      </button>
                    )
                  )}
                  <button className="btn ghost" onClick={() => actions.setDay(d.globalDay, true)}>
                    ✓ Mark done
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="card">
        <h2>✅ Today’s 2.5-hour routine (150 minutes)</h2>
        {routineSteps.map((step, i) => (
          <label key={i} className={routine[i] ? 'check done' : 'check'}>
            <input type="checkbox" checked={!!routine[i]} onChange={() => toggleRoutine(i)} />
            <span>{routineLabel(i)}</span>
          </label>
        ))}
      </div>

      <div className="grid2">
        <div className="card">
          <h2>📈 Recent scores</h2>
          <Sparkline points={spark} />
          <p className="muted mt">
            Last {Math.min(spark.length, 8)} attempts · average {avg}%
          </p>
        </div>
        <div className="card">
          <h2>🗞️ Current affairs notes</h2>
          <textarea
            placeholder="Jot today’s 10-minute current affairs points here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
