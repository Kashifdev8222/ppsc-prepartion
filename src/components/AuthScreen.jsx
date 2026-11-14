import { useState } from 'react'
import { signIn, signUp } from '../api.js'
import { Target, Eye, EyeOff } from 'lucide-react'

export default function AuthScreen() {
  const [mode, setMode] = useState('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    setInfo('')
    setBusy(true)
    try {
      if (mode === 'signin') {
        await signIn(email.trim(), password)
      } else {
        const data = await signUp(name.trim(), email.trim(), password)
        if (!data.session) {
          setInfo('Account created. Check your email to confirm it, then sign in.')
        }
      }
    } catch (error) {
      setErr(error.message || 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-logo">
          <Target size={26} strokeWidth={2.2} />
        </div>
        <h1>PPSC Prep Coach</h1>
        <p className="muted">Your daily tutor for Punjab Police &amp; Special Branch recruitment</p>

        <div className="auth-tabs">
          <button
            type="button"
            className={mode === 'signin' ? 'active' : ''}
            onClick={() => {
              setMode('signin')
              setErr('')
              setInfo('')
            }}
          >
            Sign in
          </button>
          <button
            type="button"
            className={mode === 'signup' ? 'active' : ''}
            onClick={() => {
              setMode('signup')
              setErr('')
              setInfo('')
            }}
          >
            Create account
          </button>
        </div>

        {mode === 'signup' && (
          <label className="field">
            <span>Full name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ali Khan" required />
          </label>
        )}
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>
        <label className="field">
          <span>Password</span>
          <div className="password-wrap">
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              minLength={6}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPw((v) => !v)}
              title={showPw ? 'Hide password' : 'Show password'}
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? <EyeOff size={17} strokeWidth={2} /> : <Eye size={17} strokeWidth={2} />}
            </button>
          </div>
        </label>

        {err && <div className="alert danger">{err}</div>}
        {info && <div className="alert info">{info}</div>}

        <button className="btn primary block" disabled={busy}>
          {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create my account'}
        </button>
        <p className="muted small">Your progress is saved to your account — it follows you on any device.</p>
      </form>
    </div>
  )
}
