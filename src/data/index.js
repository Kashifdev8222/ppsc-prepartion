const modules = import.meta.glob('./lessons/day*.js', { eager: true })

export const lessons = {}

for (const path of Object.keys(modules)) {
  const mod = modules[path]
  for (const key of Object.keys(mod)) {
    if (mod[key] && mod[key].id) lessons[mod[key].id] = mod[key]
  }
}
