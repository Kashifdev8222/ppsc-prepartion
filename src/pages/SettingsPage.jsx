import { useRef, useState } from 'react'
import { User, Cloud, Download, Upload, AlertTriangle, Info } from 'lucide-react'
import { useApp } from '../store.jsx'
import { isCloud } from '../api.js'
import { todayStr } from '../utils.js'

export default function SettingsPage() {
  const { state, user, actions } = useApp()
  const [name, setName] = useState(state.profile.fullName || '')
  const fileRef = useRef(null)

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ppsc-prep-backup-${todayStr()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importJson = (e) => {
    const f = e.target.files[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        if (!data || typeof data !== 'object') throw new Error('bad')
        actions.importState(data)
        window.alert('Backup imported successfully')
      } catch {
        window.alert('That file is not a valid backup.')
      }
    }
    reader.readAsText(f)
    e.target.value = ''
  }

  const resetAll = () => {
    if (window.confirm('Delete ALL progress, scores and notes? This cannot be undone.')) {
      actions.resetAll()
    }
  }

  return (
    <div>
      <div className="card">
        <h2>
          <User size={18} strokeWidth={2} className="heading-ico" />
          Profile
        </h2>
        <label className="field">
          <span>Full name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        </label>
        <button className="btn primary" onClick={() => actions.saveProfile(name.trim())}>
          Save name
        </button>
      </div>

      <div className="card">
        <h2>
          <Cloud size={18} strokeWidth={2} className="heading-ico" />
          Account
        </h2>
        {isCloud ? (
          <>
            <p>
              Signed in as <strong>{user ? user.email : '—'}</strong>
            </p>
            <p className="muted">Your progress is saved to your account and follows you on any device.</p>
          </>
        ) : (
          <p className="note">
            Running in <strong>local mode</strong> — progress is saved in this browser only. To enable login and cloud
            saving, add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to a .env file (see
            README).
          </p>
        )}
      </div>

      <div className="card">
        <h2>
          <Download size={18} strokeWidth={2} className="heading-ico" />
          Backup
        </h2>
        <p className="muted">Download a copy of all your data as a file.</p>
        <div className="row mt">
          <button className="btn primary" onClick={exportJson}>
            <Download size={15} strokeWidth={2} /> Download backup
          </button>
          {!isCloud && (
            <>
              <button className="btn" onClick={() => fileRef.current.click()}>
                <Upload size={15} strokeWidth={2} /> Import backup
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json"
                style={{ display: 'none' }}
                onChange={importJson}
              />
            </>
          )}
        </div>
        {isCloud && (
          <p className="muted mt">Import is only needed in local mode — your account already has your data.</p>
        )}
      </div>

      <div className="card">
        <h2>
          <AlertTriangle size={18} strokeWidth={2} className="heading-ico" />
          Danger zone
        </h2>
        <button className="btn danger" onClick={resetAll}>
          Reset all progress
        </button>
      </div>

      <div className="card">
        <h2>
          <Info size={18} strokeWidth={2} className="heading-ico" />
          About
        </h2>
        <p className="muted">
          PPSC Prep Coach — a personal study tracker for Punjab Police / Special Branch recruitment preparation.
          Lesson content is added day by day by your AI tutor. Always verify the latest eligibility and syllabus on the
          official website: ppssc.gop.pk
        </p>
      </div>
    </div>
  )
}
