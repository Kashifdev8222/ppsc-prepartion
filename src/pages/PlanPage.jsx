import { useState } from 'react'
import { CheckCircle2, XCircle, PlayCircle, Clock, ChevronDown, ChevronUp, CalendarDays } from 'lucide-react'
import { weeks, enrichedDays, fmtDate, dayStatus, weekRange } from '../data/plan.js'
import { lessons } from '../data/index.js'
import { useApp } from '../store.jsx'
import { SubjectIcon } from '../icons.jsx'

const phaseClass = { Foundation: 'blue', Expand: 'amber', Exam: 'green', Final: 'green' }

const rotation = [
  { day: 'Monday', subject: 'English' },
  { day: 'Tuesday', subject: 'Pakistan Studies' },
  { day: 'Wednesday', subject: 'Mathematics' },
  { day: 'Thursday', subject: 'Computer Studies' },
  { day: 'Friday', subject: 'GK & Everyday Science' },
  { day: 'Saturday', subject: 'Islamic Studies, Urdu & Reasoning' },
  { day: 'Sunday', subject: 'Weekly Test & Revision' },
]

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
        <h2>How your plan works</h2>
        <p className="muted">Every day has the same 7 study steps (2.5 hours). Only the 40-minute main subject changes:</p>
        <div className="slot-grid mt">
          {rotation.map((r) => (
            <div className="slot-card" key={r.day}>
              <span className="slot-ico">
                <SubjectIcon subject={r.subject} size={18} />
              </span>
              <div>
                <b>{r.day}</b>
                <span className="muted">{r.subject}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="note mt">
          General Knowledge is always covered: Friday’s main subject is GK &amp; Everyday Science, and every single
          day includes a 20-minute Pakistan Studies / General Knowledge slot in your routine.
        </p>
      </div>

      <div className="card">
        <h2>12-week programme</h2>
        <p className="muted">
          Past papers are only a reference — always check ppssc.gop.pk when a vacancy is announced.
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
              <div className="week-title">
                <span className={`badge ${phaseClass[w.phase]}`}>{w.phase}</span>
                <strong>
                  Week {w.id} — {w.title}
                </strong>
                {range && <span className="muted"> · {range}</span>}
              </div>
              <span className="muted">{isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
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
                const StatusIcon =
                  st === 'done' ? CheckCircle2 : st === 'missed' ? XCircle : st === 'today' ? PlayCircle : Clock
                return (
                  <div className={`day-row ${st === 'today' ? 'today' : ''}`} key={d.globalDay}>
                    <div className="day-main">
                      <span className={`chip ${st}`}>
                        <StatusIcon size={13} strokeWidth={2} />
                        {st === 'done' ? 'Done' : st === 'missed' ? 'Missed' : st === 'today' ? 'Today' : 'Upcoming'}
                      </span>
                      <span className="subject-chip">
                        <SubjectIcon subject={d.subject} size={14} />
                        {d.isTest ? 'Weekly Test' : d.subject}
                      </span>
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
