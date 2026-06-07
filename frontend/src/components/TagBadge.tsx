import { TAG_COLORS } from '@/utils/format'

interface TagBadgeProps {
  tag: string
}

export default function TagBadge({ tag }: TagBadgeProps) {
  const colorClass = TAG_COLORS[tag] || 'bg-gray-100 text-gray-600'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {tag}
    </span>
  )
}
