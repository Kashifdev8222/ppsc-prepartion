import { useState } from 'react'
import { useApp } from '../store.jsx'
import { enrichedDays, dayStatus } from '../data/plan.js'
import { TrendChart, SubjectBars } from '../components/charts.jsx'
import { scorePct, fmtDur, todayStr, calcStreak } from '../utils.js'

export default function ProgressPage() {
  const { state } = useApp()
  const days = enrichedDays(state)

  const attempts = []
  Object.entries(state.quizzes).forEach(([k, arr]) => {
    arr.forEach((a) => attempts.push({ ...a, key: k }))
  })
  attempts.sort((a, b) => (a.date < b.date ? -1 : 1))

  const trend = attempts.map((a) => ({ label: a.date.slice(5), value: scorePct(a.score, a.total) }))

  const byLesson = {}
  attempts.forEach((a) => {
    const meta = days.find((d) => d.lessonId === a.key)
    const label = meta ? meta.title : a.key
    if (!byLesson[label]) byLesson[label] = { n: 0, sum: 0 }
    byLesson[label].n += 1
    byLesson[label].sum += scorePct(a.score, a.total)
  })
  const rows = Object.entries(byLesson)
    .map(([label, v]) => ({ label, value: Math.round(v.sum / v.n), n: v.n }))
    .sort((a, b) => b.value - a.value)

  const answered = attempts.reduce((s, a) => s + a.total, 0)
  const correct = attempts.reduce((s, a) => s + a.score, 0)
  const timeSpent = attempts.reduce((s, a) => s + (a.seconds || 0), 0)
  const avg = answered ? Math.round((correct / answered) * 100) : 0

  const doneCount = days.filter((d) => d.completed).length
  const missedCount = days.filter((d) => dayStatus(d, state) === 'missed').length
  const streak = calcStreak(state)
  const openMistakes = Object.values(state.mistakes)
    .flat()
    .filter((m) => !m.resolved).length

  const todayKey = todayStr()
  const todayDay = days.find((d) => todayStr(d.date) === todayKey)
  const firstOpen = days.find((d) => !d.completed)
  const current = todayDay || firstOpen

  const report = `PPSC PREP — PROGRESS REPORT
Date: ${todayKey}
Current: Week ${current ? current.weekId : '—'}, Day ${current ? current.globalDay : '—'} — ${current ? current.title : '—'}
Days completed: ${doneCount}/${days.length} · Missed: ${missedCount}
Streak: ${streak} days
Quiz attempts: ${attempts.length} · Average score: ${avg}% · Questions answered: ${answered}
Open mistakes: ${openMistakes}
Subject performance: ${rows.length ? rows.map((r) => `${r.label}: ${r.value}%`).join(' | ') : 'no quizzes yet'}`

  const [copied, setCopied] = useState(false)
  const copyReport = async () => {
    try {
      await navigator.clipboard.writeText(report)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy this report:', report)
    }
  }

  const byWeek = {}
  days.forEach((d) => {
    if (!byWeek[d.weekId]) byWeek[d.weekId] = []
    byWeek[d.weekId].push(d)
  })

  return (
    <div>
      <div className="card">
        <h2>📄 Progress report — share with your coach</h2>
        <p className="muted">Copy this and send it to ChatGPT (or keep it in your notebook) at the end of each week.</p>
        <pre className="report">{report}</pre>
        <button className="btn primary" onClick={copyReport}>
          {copied ? '✓ Copied' : '📋 Copy report'}
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <b>{answered}</b>
          <span className="muted">questions answered</span>
        </div>
        <div className="stat-card">
          <b>{correct}</b>
          <span className="muted">correct answers</span>
        </div>
        <div className="stat-card">
          <b>{avg}%</b>
          <span className="muted">overall accuracy</span>
        </div>
        <div className="stat-card">
          <b>{fmtDur(timeSpent)}</b>
          <span className="muted">time practising</span>
        </div>
      </div>

      <div className="card">
        <h2>📈 Score trend</h2>
        <p className="muted">Every attempt you ever made, in order. Hover a dot for details.</p>
        <div className="chart-wrap">
          <TrendChart points={trend} />
        </div>
      </div>

      <div className="card">
        <h2>📚 Performance by topic</h2>
        <p className="muted">Average of all your attempts per lesson.</p>
        <div className="mt">
          <SubjectBars rows={rows} />
        </div>
      </div>

      <div className="card">
        <h2>🗓️ Consistency — daily habit</h2>
        <p className="muted">✅ done · ❌ missed · ▶️ today · ⏳ upcoming · ☀️ weekly test</p>
        <div className="heat-grid mt">
          {Object.keys(byWeek)
            .sort((a, b) => a - b)
            .map((wid) => (
              <div className="heat-row" key={wid}>
                <span className="heat-label">Week {wid}</span>
                {byWeek[wid].map((d) => {
                  const st = dayStatus(d, state)
                  const cls =
                    st === 'done' ? 'done' : st === 'missed' ? 'missed' : st === 'today' ? 'today' : 'future'
                  return (
                    <div
                      className={`heat-cell ${cls}`}
                      key={d.globalDay}
                      title={`Day ${d.globalDay} — ${d.title} — ${d.date.toDateString()}`}
                    >
                      {d.isTest ? '☀️' : d.globalDay}
                    </div>
                  )
                })}
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
