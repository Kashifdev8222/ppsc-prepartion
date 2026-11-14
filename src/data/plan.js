export const WEEK1_START = '2026-11-16' // Monday
export const DAYS_PER_WEEK = 7 // Mon–Sat main-subject days; Sunday = weekly test + revision

// The daily 2.5-hour (150-minute) routine
export const routineSteps = [
  'Main subject of the day — 40 min',
  'English — 25 min',
  'Pakistan Studies / General Knowledge — 20 min',
  'Mathematics and reasoning — 20 min',
  'Computer studies — 20 min',
  'Current affairs — 10 min',
  'MCQs and revision — 15 min',
]

// Main subject rotation: Mon=English … Sat=Islamic/Urdu/Reasoning, Sun=weekly test
const subjectName = {
  1: 'English',
  2: 'Pakistan Studies',
  3: 'Mathematics',
  4: 'Computer Studies',
  5: 'GK & Everyday Science',
  6: 'Islamic Studies, Urdu & Reasoning',
  0: 'Weekly Test & Revision',
}

// Topic per week per day-slot (1=Mon … 6=Sat, 0=Sun)
const weekTopic = {
  1: { 1: 'Parts of Speech', 2: 'Pakistan Movement — Overview', 3: 'Basic Operations & Fractions', 4: 'Computer Fundamentals', 5: 'Everyday Science Basics', 6: 'Islamic Studies Introduction', 0: 'Weekly Test 1' },
  2: { 1: 'Nouns & Pronouns', 2: 'Pakistan Movement — Leaders & Events', 3: 'Percentages', 4: 'Hardware & Software', 5: 'World GK Basics', 6: 'Urdu Grammar Basics', 0: 'Weekly Test 2' },
  3: { 1: 'Tenses — Present', 2: 'Constitutions of Pakistan', 3: 'Ratios & Proportions', 4: 'Operating Systems & Windows', 5: 'Geography of Pakistan', 6: 'Islamic Studies — Beliefs & Worship', 0: 'Weekly Test 3' },
  4: { 1: 'Tenses — Past & Future', 2: 'Constitutional Amendments', 3: 'Averages', 4: 'MS Office', 5: 'World Geography', 6: 'Urdu Comprehension', 0: 'Weekly Test 4' },
  5: { 1: 'Vocabulary — Synonyms & Antonyms', 2: 'Geography of Pakistan', 3: 'Profit & Loss', 4: 'Internet Fundamentals', 5: 'Everyday Science — Physics', 6: 'Islamic Studies — Seerat & History', 0: 'Weekly Test 5' },
  6: { 1: 'Sentence Correction', 2: 'Economy of Pakistan', 3: 'Speed Maths & Age Problems', 4: 'Networking', 5: 'Everyday Science — Chemistry', 6: 'Logical Reasoning Intro', 0: 'Weekly Test 6' },
  7: { 1: 'Reading Comprehension', 2: 'World Organisations', 3: 'Analytical Reasoning', 4: 'Databases', 5: 'Everyday Science — Biology', 6: 'Logical Reasoning — Advanced', 0: 'Weekly Test 7' },
  8: { 1: 'Comprehension — Advanced', 2: 'Current Affairs — Pakistan', 3: 'Data Interpretation', 4: 'Cybersecurity', 5: 'Environment & Space', 6: 'Urdu — Advanced', 0: 'Weekly Test 8' },
  9: { 1: 'Report Writing Basics', 2: 'Pakistan Economy & Budget', 3: 'Quantitative Revision', 4: 'IT Security Practice', 5: 'International Organisations', 6: 'Policing & Criminal Justice Basics', 0: 'Weekly Test 9' },
  10: { 1: 'Vocabulary & Usage', 2: 'Current Affairs — World', 3: 'Mixed Quantitative Practice', 4: 'Full IT Revision', 5: 'Current Affairs — Pakistan', 6: 'Intelligence & Observation Concepts', 0: 'Weekly Test 10' },
  11: { 1: 'Full English Revision', 2: 'Full Pakistan Studies Revision', 3: 'Full Maths Revision', 4: 'Full IT Revision', 5: 'Full GK & Science Revision', 6: 'Full Islamic Studies & Urdu Revision', 0: 'Weekly Test 11' },
  12: { 1: 'Mock Paper — English', 2: 'Mock Paper — Pakistan Studies', 3: 'Mock Paper — Mathematics', 4: 'Mock Paper — IT', 5: 'Mock Paper — GK & Science', 6: 'Full-Length Mock', 0: 'Final Mock Examination' },
}

const weekMeta = {
  1: { phase: 'Foundation', title: 'Foundations I' },
  2: { phase: 'Foundation', title: 'Foundations II' },
  3: { phase: 'Foundation', title: 'Grammar & Quant I' },
  4: { phase: 'Foundation', title: 'Grammar & Quant II' },
  5: { phase: 'Expand', title: 'GK & Sciences I' },
  6: { phase: 'Expand', title: 'GK & Sciences II' },
  7: { phase: 'Expand', title: 'Reasoning & IT I' },
  8: { phase: 'Expand', title: 'Reasoning & IT II' },
  9: { phase: 'Exam', title: 'Current Affairs I' },
  10: { phase: 'Exam', title: 'Current Affairs II' },
  11: { phase: 'Final', title: 'Full Revision' },
  12: { phase: 'Final', title: 'Mock Examinations' },
}

// Authored lessons, keyed by global day number (1 = Mon of Week 1)
const lessonMap = {
  1: 'day01', // Mon W1 — English: Parts of Speech
  2: 'day02', // Tue W1 — Pakistan Studies: Pakistan Movement
  8: 'day08', // Mon W2 — English: Nouns & Pronouns
}

export const weeks = (() => {
  const out = []
  for (let w = 1; w <= 12; w++) {
    const days = []
    for (let d = 1; d <= 7; d++) {
      const dow = d % 7
      const g = (w - 1) * 7 + d
      const isTest = dow === 0
      days.push({
        day: d,
        subject: subjectName[dow],
        title: weekTopic[w][dow],
        isTest,
        mockId: isTest ? `mock-week${w}` : null,
        lessonId: lessonMap[g] || null,
      })
    }
    out.push({
      id: w,
      phase: weekMeta[w].phase,
      title: weekMeta[w].title,
      topics: Object.values(weekTopic[w]),
      days,
    })
  }
  return out
})()

export function dateForDay(globalDay) {
  const start = new Date(WEEK1_START + 'T00:00:00')
  const d = new Date(start)
  d.setDate(start.getDate() + Math.floor((globalDay - 1) / DAYS_PER_WEEK) * 7 + ((globalDay - 1) % DAYS_PER_WEEK))
  return d
}

export function fmtDate(d) {
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function getAllDays() {
  const out = []
  let g = 0
  for (const w of weeks) {
    for (const d of w.days || []) {
      g += 1
      out.push({ ...d, globalDay: g, weekId: w.id, weekTitle: w.title, date: dateForDay(g) })
    }
  }
  return out
}

export function enrichedDays(state) {
  return getAllDays().map((d) => ({
    ...d,
    mockAttempts: d.mockId ? (state.quizzes[d.mockId] || []).length : 0,
    completed:
      !!state.days[d.globalDay]?.completed ||
      (!!d.mockId && (state.quizzes[d.mockId] || []).length > 0),
    completedAt: state.days[d.globalDay]?.completedAt || null,
  }))
}

export function dayStatus(d, state, today = new Date()) {
  const t = new Date(today)
  t.setHours(0, 0, 0, 0)
  const d0 = new Date(d.date)
  d0.setHours(0, 0, 0, 0)
  if (d.completed) return 'done'
  if (d0.getTime() < t.getTime()) return 'missed'
  if (d0.getTime() === t.getTime()) return 'today'
  return 'upcoming'
}

export function weekRange(weekId) {
  const days = getAllDays().filter((d) => d.weekId === weekId)
  if (!days.length) return ''
  return `${fmtDate(days[0].date)} – ${fmtDate(days[days.length - 1].date)}`
}
