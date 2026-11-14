import { useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'

const letters = ['a', 'b', 'c', 'd']

export function Rich({ text }) {
  const parts = String(text).split('**')
  return (
    <>
      {parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : <span key={i}>{p}</span>))}
    </>
  )
}

export function PracticeSession({ icon: Icon, title, minutes, children }) {
  return (
    <details className="practice-session">
      <summary>
        <span className="dayplan-ico">
          <Icon size={16} strokeWidth={2} />
        </span>
        <span className="dayplan-label">{title}</span>
        <span className="dayplan-time">{minutes} min</span>
      </summary>
      <div className="practice-body">{children}</div>
    </details>
  )
}

export function MiniQuiz({ qs, sid }) {
  const [answers, setAnswers] = useState(() => qs.map(() => null))
  const [checked, setChecked] = useState(false)

  const allAnswered = answers.every((a) => a !== null)
  const score = qs.reduce((s, q, i) => s + (answers[i] === q.answer ? 1 : 0), 0)

  const reset = () => {
    setAnswers(qs.map(() => null))
    setChecked(false)
  }

  if (!checked) {
    return (
      <div>
        {qs.map((q, qi) => (
          <div className="mini-q" key={qi}>
            <p>
              <strong>{qi + 1}.</strong> {q.q}
            </p>
            {q.options.map((o, oi) => (
              <label key={oi} className={answers[qi] === oi ? 'opt sel' : 'opt'}>
                <input
                  type="radio"
                  name={`${sid}-q${qi}`}
                  checked={answers[qi] === oi}
                  onChange={() => setAnswers((a) => a.map((v, i) => (i === qi ? oi : v)))}
                />
                {' '}
                {letters[oi]}) {o}
              </label>
            ))}
          </div>
        ))}
        <button className="btn primary" disabled={!allAnswered} onClick={() => setChecked(true)}>
          Check answers
        </button>
        {!allAnswered && <p className="muted">Answer all questions to check.</p>}
      </div>
    )
  }

  return (
    <div>
      <div className={`score-banner ${score === qs.length ? 'good' : score >= qs.length - 1 ? 'mid' : 'low'}`}>
        {score}/{qs.length} correct
      </div>
      {qs.map((q, qi) => {
        const right = answers[qi] === q.answer
        return (
          <div className="mini-q" key={qi}>
            <p>
              <strong>{qi + 1}.</strong> {q.q}{' '}
              {right ? (
                <CheckCircle2 size={15} strokeWidth={2} className="q-icon ok" />
              ) : (
                <XCircle size={15} strokeWidth={2} className="q-icon bad" />
              )}
            </p>
            {!right && (
              <div className="explain">
                <strong>
                  Correct: {letters[q.answer]}) {q.options[q.answer]}
                </strong>{' '}
                — {q.explain}
              </div>
            )}
          </div>
        )
      })}
      <button className="btn" onClick={reset}>
        Try again
      </button>
    </div>
  )
}
