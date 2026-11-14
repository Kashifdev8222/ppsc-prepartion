// Hand-rolled, dependency-free charts (SVG + CSS).
// Status colours are always paired with icons/labels; the trend line is a single series.

export function Sparkline({ points }) {
  if (!points || points.length < 2) return <span className="muted">No data yet</span>
  const W = 170
  const H = 48
  const P = 6
  const x = (i) => P + (i * (W - 2 * P)) / (points.length - 1)
  const y = (v) => H - P - (v / 100) * (H - 2 * P)
  const pts = points.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  const last = points[points.length - 1]
  return (
    <svg className="spark" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Score trend, latest ${last} percent`}>
      <polyline points={pts} className="trendline" />
      <circle cx={x(points.length - 1)} cy={y(last)} r="4" className="dot" />
    </svg>
  )
}

export function TrendChart({ points }) {
  if (!points || points.length < 2) {
    return <p className="muted">Attempt at least two quizzes to see your trend.</p>
  }
  const W = 680
  const H = 250
  const PL = 42
  const PR = 14
  const PT = 16
  const PB = 42
  const x = (i) => PL + (i * (W - PL - PR)) / (points.length - 1)
  const y = (v) => PT + (1 - v / 100) * (H - PT - PB)
  const pts = points.map((p, i) => `${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ')
  const step = Math.max(1, Math.ceil(points.length / 8))
  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Quiz score trend over time">
      {[0, 50, 100].map((g) => (
        <g key={g}>
          <line x1={PL} x2={W - PR} y1={y(g)} y2={y(g)} className="gridline" />
          <text x={PL - 8} y={y(g) + 4} className="axis" textAnchor="end">
            {g}%
          </text>
        </g>
      ))}
      <polyline points={pts} className="trendline" />
      {points.map((p, i) => (
        <circle key={i} cx={x(i)} cy={y(p.value)} r="4" className="dot">
          <title>{`${p.label} — ${p.value}%`}</title>
        </circle>
      ))}
      {points.map((p, i) =>
        i % step === 0 ? (
          <text key={`x${i}`} x={x(i)} y={H - 14} className="axis" textAnchor="middle">
            {p.label}
          </text>
        ) : null
      )}
    </svg>
  )
}

export function SubjectBars({ rows }) {
  if (!rows || !rows.length) return <p className="muted">No quiz data yet.</p>
  const max = Math.max(...rows.map((r) => r.value), 1)
  return (
    <div className="sbars">
      {rows.map((r) => (
        <div className="sbar-row" key={r.label}>
          <span className="sbar-label">{r.label}</span>
          <div className="sbar-track">
            <div className="sbar-fill" style={{ width: `${Math.max(4, (r.value / max) * 100)}%` }} />
          </div>
          <span className="sbar-val">
            {r.value}% · {r.n} {r.n === 1 ? 'attempt' : 'attempts'}
          </span>
        </div>
      ))}
    </div>
  )
}
