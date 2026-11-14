import { getAllDays, dateForDay } from '../plan.js'

const modules = import.meta.glob('./week*.js', { eager: true })
export const mocks = {}

for (const path of Object.keys(modules)) {
  const mod = modules[path]
  for (const key of Object.keys(mod)) {
    if (mod[key] && mod[key].id) mocks[mod[key].id] = mod[key]
  }
}

export const mockList = [
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `mock-week${i + 1}`,
    title: `Weekly Mock Test ${i + 1}`,
    desc: `50 questions — mixed subjects (Week ${i + 1})`,
    unlockWeek: i + 1,
  })),
  { id: 'mock-month1', title: 'Monthly Mock Test 1', desc: 'Full-length mixed paper (Weeks 1–4)', unlockWeek: 4 },
  { id: 'mock-month2', title: 'Monthly Mock Test 2', desc: 'Full-length mixed paper (Weeks 5–8)', unlockWeek: 8 },
  { id: 'mock-month3', title: 'Monthly Mock Test 3', desc: 'Full-length mixed paper (Weeks 9–12)', unlockWeek: 12 },
]

// A weekly test opens on the Sunday of its week, or earlier if the whole week is already done.
export function isWeekReady(state, weekId) {
  const wd = getAllDays().filter((d) => d.weekId === weekId && !d.isTest)
  const allDone = wd.length > 0 && wd.every((d) => state.days[d.globalDay]?.completed)
  const sunday = dateForDay(weekId * 7)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return allDone || today.getTime() >= sunday.getTime()
}
