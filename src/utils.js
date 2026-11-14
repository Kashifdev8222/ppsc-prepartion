export function todayStr(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

export function calcStreak(s) {
  const active = new Set()
  Object.entries(s.routine || {}).forEach(([d, r]) => {
    if (Array.isArray(r) && r.length > 0 && r.every(Boolean)) active.add(d)
  })
  Object.entries(s.quizzes || {}).forEach(([, arr]) => {
    if (Array.isArray(arr)) arr.forEach((a) => a && a.date && active.add(a.date))
  })
  let streak = 0
  const d = new Date()
  if (!active.has(todayStr(d))) d.setDate(d.getDate() - 1)
  while (active.has(todayStr(d))) {
    streak += 1
    d.setDate(d.getDate() - 1)
  }
  return streak
}

export function fmtDur(sec) {
  const s = Math.max(0, Math.floor(sec || 0))
  const m = Math.floor(s / 60)
  const ss = s % 60
  return `${m}m ${String(ss).padStart(2, '0')}s`
}

export function scorePct(score, total) {
  return total ? Math.round((score / total) * 100) : 0
}

export function initials(name) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  return parts.slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}
