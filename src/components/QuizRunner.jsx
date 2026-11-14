import { useEffect, useState } from 'react'
import { todayStr, fmtDur, scorePct } from '../utils.js'

const letters = ['a', 'b', 'c', 'd']

export default function QuizRunner({ storageKey, title, questions, onAttempt, history }) {
  const [answers, setAnswers] = useState(() => questions.map(() => null))
  const [startedAt, setStartedAt] = useState(() => Date.now())
  const [elapsed, setElapsed] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(null)

  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000)
    return () => clearInterval(t)
  }, [startedAt])

  const allAnswered = answers.every((a) => a !== null)
  const suggested = Math.round(questions.length * 1.67 * 60) // ≈25 min for 15 questions
  const overTime = elapsed > suggested

  const submit = () => {
    const s = questions.reduce((acc, m, i) => acc + (answers[i] === m.answer ? 1 : 0), 0)
    const wrong = questions
      .map((m, i) =>
        answers[i] !== m.answer
          ? { q: m.q, options: m.options, given: answers[i], correct: m.answer, explain: m.explain }
          : null
      )
      .filter(Boolean)
    setScore(s)
    setSubmitted(true)
    onAttempt({ score: s, total: questions.length, answers: [...answers], seconds: elapsed, date: todayStr() }, wrong)
  }

  const retake = () => {
    setAnswers(questions.map(() => null))
    setStartedAt(Date.now())
    setElapsed(0)
    setSubmitted(false)
    setScore(null)
  }

  const pct = score !== null ? scorePct(score, questions.length) : 0
  const bannerClass = pct >= 80 ? 'good' : pct >= 60 ? 'mid' : 'low'
  const message =
    pct >= 80
      ? 'Excellent — very strong result!'
      : pct >= 60
        ? 'Good effort — read the explanations below carefully.'
        : 'Keep going — re-read the lesson notes and try again.'

  const best = history && history.length ? Math.max(...history.map((a) => scorePct(a.score, a.total))) : null

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const ss = String(elapsed % 60).padStart(2, '0')

  return (
    <div className="card">
      <div className="quiz-head">
        <div>
          <h2>📝 {title}</h2>
          <p className="muted">
            {questions.length} questions · suggested time {Math.round(suggested / 60)} min
          </p>
        </div>
        <div className="quiz-meta">
          {!submitted && (
            <span className={`timer ${overTime ? 'warn' : ''}`} title="Time taken">
              ⏱ {mm}:{ss}
            </span>
          )}
          {best !== null && <span className="badge green">Best {best}%</span>}
        </div>
      </div>

      {!submitted ? (
        <>
          {questions.map((m, qi) => (
            <div className="qblock" key={qi}>
              <p>
                <strong>{qi + 1}.</strong> {m.q}
              </p>
              {m.options.map((o, oi) => (
                <label key={oi} className={answers[qi] === oi ? 'opt sel' : 'opt'}>
                  <input
                    type="radio"
                    name={`${storageKey}-q${qi}`}
                    checked={answers[qi] === oi}
                    onChange={() => setAnswers((a) => a.map((v, i) => (i === qi ? oi : v)))}
                  />
                  {' '}
                  {letters[oi]}) {o}
                </label>
              ))}
            </div>
          ))}
          <button className="btn primary" disabled={!allAnswered} onClick={submit}>
            Submit answers
          </button>
          {!allAnswered && <p className="muted">Answer all questions to submit.</p>}
        </>
      ) : (
        <>
          <div className={`score-banner ${bannerClass}`}>
            Score: {score}/{questions.length} ({pct}%) — {message}
          </div>
          {questions.map((m, qi) => {
            const right = answers[qi] === m.answer
            return (
              <div className={`qblock ${right ? 'qright' : 'qwrong'}`} key={qi}>
                <p>
                  <strong>{qi + 1}.</strong> {m.q} {right ? '✅' : '❌'}
                </p>
                <div className="locked">
                  {m.options.map((o, oi) => {
                    const cls = oi === m.answer ? 'opt correct' : oi === answers[qi] ? 'opt wrongpick' : 'opt'
                    return (
                      <div className={cls} key={oi}>
                        {letters[oi]}) {o}
                      </div>
                    )
                  })}
                </div>
                {!right && (
                  <div className="explain">
                    <strong>
                      Correct answer: {letters[m.answer]}) {m.options[m.answer]}
                    </strong>
                    <div>{m.explain}</div>
                  </div>
                )}
              </div>
            )
          })}
          <button className="btn mt" onClick={retake}>
            🔁 Retake (saved as a new attempt)
          </button>
        </>
      )}

      {history && history.length > 0 && (
        <div className="attempts">
          <h3>📜 Attempt history — every attempt is saved</h3>
          {history.map((a, i) => (
            <div className="attempt-row" key={i}>
              <span className="badge green">
                {a.score}/{a.total} · {scorePct(a.score, a.total)}%
              </span>
              <span className="muted">
                {a.date} · {fmtDur(a.seconds || 0)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
