import { Flame, CheckCircle2, TrendingUp, HelpCircle, AlertTriangle, Newspaper, CalendarDays, BookOpen, ListChecks, ClipboardList } from 'lucide-react'
import { useApp } from '../store.jsx'
import { lessons } from '../data/index.js'
import { enrichedDays, routineSteps, WEEK1_START, fmtDate, dayStatus } from '../data/plan.js'
import { todayStr, calcStreak, scorePct } from '../utils.js'
import { Sparkline } from '../components/charts.jsx'
import { SubjectIcon } from '../icons.jsx'

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

  const howTo = [
    { icon: CalendarDays, text: 'Open the app at your fixed study time — every day, 2.5 hours total.' },
    { icon: BookOpen, text: 'Press "Start today’s lesson" and read it slowly. Make short notes in a notebook.' },
    { icon: HelpCircle, text: 'Attempt the 15 MCQs without looking at the notes.' },
    { icon: CheckCircle2, text: 'Read every wrong answer’s explanation — the app saves them in the Mistake Log.' },
    { icon: ListChecks, text: 'Tick the 7 routine steps below as you finish each one.' },
    { icon: Newspaper, text: 'Write 2–3 lines of current affairs in the notes box.' },
    { icon: ClipboardList, text: 'Sunday: revise the whole week, then take the 50-question weekly test.' },
  ]

  let hero
  if (beforeStart) {
    hero = (
      <div className="hero">
        <div>
          <span className="badge light">
            <CalendarDays size={13} strokeWidth={2} /> Starts Monday
          </span>
          <h2>Your programme begins {fmtDate(new Date(WEEK1_START + 'T00:00:00'))}…</h2>
          <p>Every day: 2.5 hours, 7 short study steps. Day 1 is ready to preview.</p>
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
          <span className="badge light">
            <SubjectIcon subject={todayDay.subject} size={13} /> {todayDay.title}
          </span>
          <h2>Sunday — weekly test day</h2>
          <p>Revise this week’s notes, review the Mistake Log, then attempt the 50-question weekly test.</p>
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
            {todayDay.completed ? <CheckCircle2 size={13} strokeWidth={2} /> : <SubjectIcon subject={todayDay.subject} size={13} />}
            {todayDay.completed ? ' Completed' : ` Today’s main subject`}
          </span>
          <h2>
            {todayDay.subject}: {todayDay.title}
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
          <div className="note light">This lesson is being prepared by your tutor.</div>
        )}
      </div>
    )
  } else {
    hero = (
      <div className="hero">
        <div>
          <span className="badge light">
            <CheckCircle2 size={13} strokeWidth={2} /> Well done
          </span>
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

      <div className="card">
        <h2>
          <BookOpen size={18} strokeWidth={2} className="heading-ico" />
          How to study every day
        </h2>
        <ol className="howto-list">
          {howTo.map((s, i) => {
            const Icon = s.icon
            return (
              <li key={i}>
                <span className="howto-num">{i + 1}</span>
                <span className="howto-ico">
                  <Icon size={16} strokeWidth={2} />
                </span>
                <span>{s.text}</span>
              </li>
            )
          })}
        </ol>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-ico amber">
            <Flame size={19} strokeWidth={2} />
          </span>
          <div>
            <b>{streak}</b>
            <span className="muted">day streak</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-ico green">
            <CheckCircle2 size={19} strokeWidth={2} />
          </span>
          <div>
            <b>
              {doneCount}
              <span className="muted">/{days.length}</span>
            </b>
            <span className="muted">days done</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-ico indigo">
            <TrendingUp size={19} strokeWidth={2} />
          </span>
          <div>
            <b>{avg}%</b>
            <span className="muted">average score</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-ico blue">
            <HelpCircle size={19} strokeWidth={2} />
          </span>
          <div>
            <b>{answered}</b>
            <span className="muted">questions answered</span>
          </div>
        </div>
      </div>

      {missed.length > 0 && (
        <div className="card missed-card">
          <h2>
            <AlertTriangle size={18} strokeWidth={2} className="heading-ico" />
            {missed.length} missed day{missed.length > 1 ? 's' : ''} — catch up
          </h2>
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
                    Mark done
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="card">
        <h2>Today’s 2.5-hour routine</h2>
        <p className="muted">Tick each step as you finish it. Only the first step changes every day.</p>
        <div className="mt">
          {routineSteps.map((step, i) => (
            <label key={i} className={routine[i] ? 'check done' : 'check'}>
              <input type="checkbox" checked={!!routine[i]} onChange={() => toggleRoutine(i)} />
              <span>{routineLabel(i)}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid2">
        <div className="card">
          <h2>
            <TrendingUp size={18} strokeWidth={2} className="heading-ico" />
            Your scores
          </h2>
          <Sparkline points={spark} />
          <p className="muted mt">
            Last {Math.min(spark.length, 8)} attempts · average {avg}%
          </p>
        </div>
        <div className="card">
          <h2>
            <Newspaper size={18} strokeWidth={2} className="heading-ico" />
            Current affairs notes
          </h2>
          <textarea
            placeholder="Write today’s 10-minute current affairs points here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
