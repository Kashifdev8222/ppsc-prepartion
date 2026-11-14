const modules = import.meta.glob('./week*.js', { eager: true })

export const practice = {}

for (const path of Object.keys(modules)) {
  const mod = modules[path]
  for (const key of Object.keys(mod)) {
    const val = mod[key]
    if (val && typeof val === 'object') Object.assign(practice, val)
  }
}

export function getPractice(weekId, dayInWeek) {
  return (practice[weekId] || {})[dayInWeek] || null
}

export const currentAffairsSession = {
  title: 'Current affairs — read & note',
  points: [
    'Open Dawn.com or Geo News and read the main headlines for 10 minutes.',
    'Focus on: Pakistan politics, economy, sports, and one international story.',
    'Then write 2–3 lines in the Current Affairs notes box on this page.',
    'Every few days, check ppssc.gop.pk for new job advertisements — the most important habit for your goal.',
  ],
}
