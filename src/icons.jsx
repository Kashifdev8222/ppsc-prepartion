import {
  BookOpen,
  Landmark,
  Calculator,
  Monitor,
  Globe2,
  Moon,
  Sun,
} from 'lucide-react'

const map = {
  English: BookOpen,
  'Pakistan Studies': Landmark,
  Mathematics: Calculator,
  'Computer Studies': Monitor,
  'GK & Everyday Science': Globe2,
  'Islamic Studies, Urdu & Reasoning': Moon,
  'Weekly Test & Revision': Sun,
}

export function SubjectIcon({ subject, size = 16 }) {
  const Icon = map[subject] || BookOpen
  return <Icon size={size} strokeWidth={2} />
}
