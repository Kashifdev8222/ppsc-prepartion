import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import {
  isCloud,
  emptyState,
  localSave,
  loadAll,
  saveDay,
  addAttempt,
  replaceMistakes,
  saveRoutine,
  saveNotes,
  setMistakeResolved,
  saveProfile as saveProfileApi,
  resetCloud,
  onAuthChange,
  currentUser,
  signOutUser,
} from './api.js'

const AppCtx = createContext(null)

export function useApp() {
  return useContext(AppCtx)
}

const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `m-${Date.now()}-${Math.random()}`)

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(false)
  const [state, setState] = useState(emptyState())
  const [loading, setLoading] = useState(false)
  const stateRef = useRef(state)
  useEffect(() => {
    stateRef.current = state
  }, [state])

  // auth initialisation
  useEffect(() => {
    if (!isCloud) {
      setAuthReady(true)
      return undefined
    }
    const off = onAuthChange(setUser)
    currentUser().then((u) => {
      setUser(u)
      setAuthReady(true)
    })
    return off
  }, [])

  // load data when a user is signed in (or immediately in local mode)
  useEffect(() => {
    if (isCloud && !user) return undefined
    let alive = true
    setLoading(true)
    loadAll(user)
      .then((s) => {
        if (alive) {
          setState(s)
          setLoading(false)
        }
      })
      .catch((e) => {
        console.error(e)
        if (alive) {
          setState(emptyState())
          setLoading(false)
        }
      })
    return () => {
      alive = false
    }
  }, [user])

  // local mode: persist the whole state blob
  useEffect(() => {
    if (!isCloud) localSave(state)
  }, [state])

  const doSignOut = useCallback(async () => {
    await signOutUser()
    setUser(null)
    setState(emptyState())
  }, [])

  const actions = {
    recordAttempt(lessonId, attempt, wrongItems) {
      setState((s) => {
        const n = structuredClone(s)
        n.quizzes[lessonId] = [...(n.quizzes[lessonId] || []), attempt]
        const rest = (n.mistakes[lessonId] || []).map((m) => ({ ...m, resolved: true }))
        n.mistakes[lessonId] = [
          ...rest,
          ...wrongItems.map((m) => ({ ...m, resolved: false, id: uid() })),
        ]
        return n
      })
      if (isCloud) {
        addAttempt(user, lessonId, attempt).catch(console.error)
        replaceMistakes(user, lessonId, wrongItems).catch(console.error)
      }
    },
    setDay(globalDay, completed) {
      const completedAt = completed ? new Date().toISOString() : null
      setState((s) => {
        const n = structuredClone(s)
        n.days[globalDay] = { completed, completedAt }
        return n
      })
      if (isCloud) saveDay(user, globalDay, completed).catch(console.error)
    },
    toggleRoutine(date, i) {
      const cur = stateRef.current.routine[date] || []
      const len = Math.max(cur.length, i + 1, 7)
      const next = Array.from({ length: len }, (_, j) => (j === i ? !cur[j] : !!cur[j]))
      setState((s) => {
        const n = structuredClone(s)
        n.routine[date] = next
        return n
      })
      if (isCloud) saveRoutine(user, date, next).catch(console.error)
    },
    setNotes(date, text) {
      setState((s) => {
        const n = structuredClone(s)
        n.notes[date] = text
        return n
      })
      if (isCloud) saveNotes(user, date, text).catch(console.error)
    },
    toggleMistake(lessonId, id) {
      const m = (stateRef.current.mistakes[lessonId] || []).find((x) => x.id === id)
      if (!m) return
      const target = !m.resolved
      setState((s) => {
        const n = structuredClone(s)
        const item = (n.mistakes[lessonId] || []).find((x) => x.id === id)
        if (item) item.resolved = target
        return n
      })
      if (isCloud) setMistakeResolved(user, id, target).catch(console.error)
    },
    saveProfile(fullName) {
      setState((s) => {
        const n = structuredClone(s)
        n.profile.fullName = fullName
        return n
      })
      if (isCloud) saveProfileApi(user, fullName).catch(console.error)
    },
    importState(data) {
      setState({ ...emptyState(), ...data })
    },
    resetAll() {
      setState(emptyState())
      resetCloud(user).catch(console.error)
    },
  }

  const value = { user, authReady, loading, state, actions, signOut: doSignOut }
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}
