import { lessons } from '../data/index.js'
import { enrichedDays, fmtDate } from '../data/plan.js'
import QuizRunner from '../components/QuizRunner.jsx'
import { useApp } from '../store.jsx'

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
          ← Back
        </button>
        <div className="card">
          <p>This lesson is not added yet — ask your tutor in the chat.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="row mb">
        <button className="btn ghost" onClick={onBack}>
          ← Back
        </button>
        {dayMeta && (
          <span className={`chip ${dayMeta.completed ? 'done' : 'upcoming'}`}>
            {dayMeta.completed ? '✅ Completed' : '📖 In progress'}
          </span>
        )}
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
                📌 <Rich text={s.note} />
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
          ✅ Mark Day {dayMeta.globalDay} as complete
        </button>
      )}
      {dayMeta && dayMeta.completed && (
        <button className="btn ghost" onClick={() => actions.setDay(dayMeta.globalDay, false)}>
          ↩️ Undo completion
        </button>
      )}

      {dayMeta && dayMeta.completed && nextDay && (
        <div className="note">
          🎉 Day {dayMeta.globalDay} complete. Next: Day {nextDay.globalDay} — {nextDay.title} ({fmtDate(nextDay.date)}).
        </div>
      )}
    </div>
  )
}
