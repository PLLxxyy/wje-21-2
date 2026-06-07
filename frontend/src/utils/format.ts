export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-CN')
}

export const TAG_COLORS: Record<string, string> = {
  '季节性': 'bg-blue-100 text-blue-700',
  '常用': 'bg-green-100 text-green-700',
  '易碎': 'bg-red-100 text-red-700',
  '贵重': 'bg-yellow-100 text-yellow-700',
  '食品': 'bg-orange-100 text-orange-700',
  '药品': 'bg-purple-100 text-purple-700',
}
