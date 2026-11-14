import { BookOpen, Globe2, Calculator, Monitor, Newspaper, History, ClipboardList } from 'lucide-react'
import { PracticeSession, MiniQuiz, Rich } from './PracticeSession.jsx'
import { getPractice, currentAffairsSession } from '../data/practice/index.js'
import { lessons } from '../data/index.js'
import { todayStr, seededPick } from '../utils.js'
import { enrichedDays } from '../data/plan.js'

function ConceptBox({ items }) {
  return (
    <div className="concept-box">
      <p className="concept-title">Read first — understand the concept</p>
      {items.map((c, i) => (
        <p key={i}>
          <Rich text={c} />
        </p>
      ))}
    </div>
  )
}

export default function DailyPractice({ day, state }) {
  if (!day) return null

  const days = enrichedDays(state)
  const dayKey = todayStr(day.date)
  const practicePack = !day.isTest ? getPractice(day.weekId, day.day) : null

  // revision questions: only from lessons of PAST days
  const revisionPool = []
  Object.values(lessons).forEach((l) => {
    const meta = days.find((d) => d.lessonId === l.id)
    if (meta && todayStr(meta.date) < dayKey) {
      l.mcqs.forEach((m) => revisionPool.push({ ...m, src: l.title }))
    }
  })
  const revisionQs = seededPick(revisionPool, dayKey, 3)

  return (
    <div className="card">
      <h2>
        <ClipboardList size={18} strokeWidth={2} className="heading-ico" />
        Steps 2–7 — your six short sessions
      </h2>
      <p className="muted">
        Each session: read the concept first, then answer 10 questions with instant checking. Only the daily quiz (step
        1) is saved to your permanent record.
      </p>

      {day.isTest ? (
        <p className="note mt">
          Sunday is test day — no new sessions. Use this time for the revision questions below and reading the news.
        </p>
      ) : practicePack ? (
        <div className="mt">
          <PracticeSession icon={BookOpen} title={practicePack.english.title} minutes={25}>
            <ConceptBox items={practicePack.english.concept} />
            <MiniQuiz qs={practicePack.english.qs} sid="eng" />
          </PracticeSession>
          <PracticeSession icon={Globe2} title={practicePack.pakgk.title} minutes={20}>
            <ConceptBox items={practicePack.pakgk.concept} />
            <MiniQuiz qs={practicePack.pakgk.qs} sid="gk" />
          </PracticeSession>
          <PracticeSession icon={Calculator} title={practicePack.math.title} minutes={20}>
            <ConceptBox items={practicePack.math.concept} />
            <MiniQuiz qs={practicePack.math.qs} sid="math" />
          </PracticeSession>
          <PracticeSession icon={Monitor} title={practicePack.computer.title} minutes={20}>
            <ConceptBox items={practicePack.computer.concept} />
            <MiniQuiz qs={practicePack.computer.qs} sid="comp" />
          </PracticeSession>
        </div>
      ) : (
        <p className="note mt">This day’s practice pack is being prepared by your tutor — ask in the chat.</p>
      )}

      <PracticeSession icon={Newspaper} title={currentAffairsSession.title} minutes={10}>
        <ul>
          {currentAffairsSession.points.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </PracticeSession>

      <PracticeSession icon={History} title="Revision — older topics" minutes={15}>
        {revisionQs.length > 0 ? (
          <MiniQuiz qs={revisionQs} sid="rev" />
        ) : (
          <p className="muted">
            From Day 2 onwards, this gives you questions from your previous lessons. Today (Day 1), use this time to
            re-read the lesson above from memory.
          </p>
        )}
      </PracticeSession>
    </div>
  )
}
