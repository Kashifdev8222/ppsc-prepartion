import { ArrowLeft, CheckCircle2, RotateCcw, BookOpen, ClipboardList, Globe2, Calculator, Monitor, Newspaper, HelpCircle } from 'lucide-react'
import { lessons } from '../data/index.js'
import { enrichedDays, fmtDate, routineSteps } from '../data/plan.js'
import QuizRunner from '../components/QuizRunner.jsx'
import { useApp } from '../store.jsx'
import { SubjectIcon } from '../icons.jsx'

function Rich({ text }) {
  const parts = String(text).split('**')
  return (
    <>
      {parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : <span key={i}>{p}</span>))}
    </>
  )
}

export default function LessonPage({ lessonId, onBack }) {
  const { state, actions } = useApp()
  const lesson = lessons[lessonId]
  const dayMeta = enrichedDays(state).find((d) => d.lessonId === lessonId)
  const attempts = state.quizzes[lessonId] || []
  const nextDay = dayMeta ? enrichedDays(state).find((d) => d.globalDay === dayMeta.globalDay + 1) : null

  if (!lesson) {
    return (
      <div>
        <button className="btn ghost" onClick={onBack}>
          <ArrowLeft size={15} strokeWidth={2} /> Back
        </button>
        <div className="card">
          <p>This lesson is not added yet — ask your tutor in the chat.</p>
        </div>
      </div>
    )
  }

  const slotMeta = routineSteps.map((step, i) => {
    const label = i === 0 ? `Main subject (${dayMeta ? dayMeta.subject : 'English'}) — 40 min` : step
    const parts = label.split(' — ')
    return { text: parts.slice(0, -1).join(' — '), time: parts[parts.length - 1] }
  })
  const routineIcons = [null, BookOpen, Globe2, Calculator, Monitor, Newspaper, HelpCircle]

  return (
    <div>
      <div className="row mb">
        <button className="btn ghost" onClick={onBack}>
          <ArrowLeft size={15} strokeWidth={2} /> Back
        </button>
        {dayMeta && (
          <span className={`chip ${dayMeta.completed ? 'done' : 'upcoming'}`}>
            {dayMeta.completed ? <CheckCircle2 size={13} strokeWidth={2} /> : <BookOpen size={13} strokeWidth={2} />}
            {dayMeta.completed ? 'Completed' : 'In progress'}
          </span>
        )}
      </div>

      <div className="card">
        <h2>
          <ClipboardList size={18} strokeWidth={2} className="heading-ico" />
          Your full day — 2.5 hours
        </h2>
        <p className="muted">
          This lesson is step 1 only (40 minutes). The other six steps are the same every day — tick them in the
          routine on the Dashboard.
        </p>
        <div className="dayplan-list mt">
          {slotMeta.map((s, i) => {
            const Icon = routineIcons[i]
            return (
              <div className={`dayplan-row ${i === 0 ? 'main' : ''}`} key={i}>
                <span className="dayplan-ico">
                  {i === 0 ? (
                    <SubjectIcon subject={dayMeta ? dayMeta.subject : 'English'} size={16} />
                  ) : (
                    <Icon size={16} strokeWidth={2} />
                  )}
                </span>
                <span className="dayplan-label">{s.text}</span>
                <span className="dayplan-time">{s.time}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card lesson">
        {dayMeta && (
          <div className="mb">
            <span className="badge blue">Week {dayMeta.weekId}</span>
            <span className="badge green">Day {dayMeta.globalDay}</span>
            <span className="muted"> · {fmtDate(dayMeta.date)}</span>
          </div>
        )}
        <h1>{lesson.title}</h1>
        {lesson.sections.map((s, i) => (
          <section key={i}>
            {s.heading && <h2>{s.heading}</h2>}
            {(s.paragraphs || []).map((p, j) => (
              <p key={j}>
                <Rich text={p} />
              </p>
            ))}
            {s.bullets && (
              <ul>
                {s.bullets.map((b, j) => (
                  <li key={j}>
                    <Rich text={b} />
                  </li>
                ))}
              </ul>
            )}
            {s.note && (
              <div className="note">
                <Rich text={s.note} />
              </div>
            )}
          </section>
        ))}
      </div>

      <QuizRunner
        key={lesson.id}
        storageKey={lesson.id}
        title={`Daily quiz — ${lesson.title}`}
        questions={lesson.mcqs}
        history={attempts}
        onAttempt={(attempt, wrong) => actions.recordAttempt(lesson.id, attempt, wrong)}
      />

      {dayMeta && attempts.length > 0 && !dayMeta.completed && (
        <button className="btn primary" onClick={() => actions.setDay(dayMeta.globalDay, true)}>
          <CheckCircle2 size={16} strokeWidth={2} /> Mark Day {dayMeta.globalDay} as complete
        </button>
      )}
      {dayMeta && dayMeta.completed && (
        <button className="btn ghost" onClick={() => actions.setDay(dayMeta.globalDay, false)}>
          <RotateCcw size={15} strokeWidth={2} /> Undo completion
        </button>
      )}

      {dayMeta && dayMeta.completed && nextDay && (
        <div className="note">
          Day {dayMeta.globalDay} complete. Next: Day {nextDay.globalDay} — {nextDay.title} ({fmtDate(nextDay.date)}).
        </div>
      )}
    </div>
  )
}
