import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isCloud = !!(url && key)
export const supabase = isCloud ? createClient(url, key) : null

const LOCAL_KEY = 'ppsc-prep-state-v2'

export function emptyState() {
  return { days: {}, quizzes: {}, mistakes: {}, routine: {}, notes: {}, profile: { fullName: '' } }
}

// ---------- local storage ----------
function localLoad() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (!raw) return emptyState()
    return { ...emptyState(), ...JSON.parse(raw) }
  } catch {
    return emptyState()
  }
}
export function localSave(s) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(s))
  } catch {
    /* storage full or blocked — ignore */
  }
}
export function localClear() {
  localStorage.removeItem(LOCAL_KEY)
}

// ---------- auth ----------
export async function signUp(fullName, email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  })
  if (error) throw error
  return data
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOutUser() {
  if (supabase) await supabase.auth.signOut()
}

export function onAuthChange(cb) {
  if (!supabase) return () => {}
  const { data } = supabase.auth.onAuthStateChange((_event, session) => cb(session ? session.user : null))
  return () => data.subscription.unsubscribe()
}

export async function currentUser() {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session ? data.session.user : null
}

// ---------- data loading ----------
export async function loadAll(user) {
  if (!isCloud) return localLoad()
  const uid = user.id
  const [dp, qa, rc, ms, nt, pf] = await Promise.all([
    supabase.from('day_progress').select('global_day, completed, completed_at'),
    supabase.from('quiz_attempts').select('*').order('created_at', { ascending: true }),
    supabase.from('routine_checks').select('*'),
    supabase.from('mistakes').select('*').order('created_at', { ascending: true }),
    supabase.from('notes').select('*'),
    supabase.from('profiles').select('*').eq('id', uid).maybeSingle(),
  ])
  if (dp.error) throw dp.error
  if (qa.error) throw qa.error
  if (rc.error) throw rc.error
  if (ms.error) throw ms.error
  if (nt.error) throw nt.error

  const s = emptyState()
  ;(dp.data || []).forEach((r) => {
    s.days[r.global_day] = { completed: r.completed, completedAt: r.completed_at }
  })
  ;(qa.data || []).forEach((r) => {
    s.quizzes[r.lesson_id] = s.quizzes[r.lesson_id] || []
    s.quizzes[r.lesson_id].push({
      score: r.score,
      total: r.total,
      answers: r.answers || [],
      seconds: r.seconds || 0,
      date: (r.created_at || '').slice(0, 10),
      id: r.id,
    })
  })
  ;(rc.data || []).forEach((r) => {
    s.routine[r.date] = r.checks || []
  })
  ;(ms.data || []).forEach((r) => {
    s.mistakes[r.lesson_id] = s.mistakes[r.lesson_id] || []
    s.mistakes[r.lesson_id].push({
      id: r.id,
      q: r.q,
      options: r.options || [],
      given: r.given,
      correct: r.correct,
      explain: r.explain || '',
      resolved: !!r.resolved,
    })
  })
  ;(nt.data || []).forEach((r) => {
    s.notes[r.date] = r.text || ''
  })
  s.profile.fullName =
    (pf.data && pf.data.full_name) || (user.user_metadata && user.user_metadata.full_name) || ''
  return s
}

// ---------- mutations (cloud) ----------
export async function saveDay(user, globalDay, completed) {
  if (!isCloud) return
  await supabase.from('day_progress').upsert({
    user_id: user.id,
    global_day: globalDay,
    completed,
    completed_at: completed ? new Date().toISOString() : null,
  })
}

export async function addAttempt(user, lessonId, attempt) {
  if (!isCloud) return
  const { error } = await supabase.from('quiz_attempts').insert({
    user_id: user.id,
    lesson_id: lessonId,
    score: attempt.score,
    total: attempt.total,
    answers: attempt.answers,
    seconds: attempt.seconds,
  })
  if (error) console.error(error)
}

export async function replaceMistakes(user, lessonId, wrongItems) {
  if (!isCloud) return
  await supabase
    .from('mistakes')
    .update({ resolved: true })
    .eq('user_id', user.id)
    .eq('lesson_id', lessonId)
    .eq('resolved', false)
  if (wrongItems.length) {
    const { error } = await supabase
      .from('mistakes')
      .insert(
        wrongItems.map((m) => ({
          user_id: user.id,
          lesson_id: lessonId,
          q: m.q,
          options: m.options,
          given: m.given,
          correct: m.correct,
          explain: m.explain,
        }))
      )
    if (error) console.error(error)
  }
}

export async function saveRoutine(user, date, checks) {
  if (!isCloud) return
  await supabase.from('routine_checks').upsert({ user_id: user.id, date, checks })
}

export async function saveNotes(user, date, text) {
  if (!isCloud) return
  await supabase.from('notes').upsert({ user_id: user.id, date, text })
}

export async function setMistakeResolved(user, id, resolved) {
  if (!isCloud) return
  await supabase.from('mistakes').update({ resolved }).eq('id', id)
}

export async function saveProfile(user, fullName) {
  if (!isCloud) return
  await supabase.from('profiles').upsert({ id: user.id, full_name: fullName })
}

export async function resetCloud(user) {
  if (!isCloud) {
    localClear()
    return
  }
  const tables = ['day_progress', 'quiz_attempts', 'routine_checks', 'mistakes', 'notes']
  await Promise.all(tables.map((t) => supabase.from(t).delete().eq('user_id', user.id)))
}
