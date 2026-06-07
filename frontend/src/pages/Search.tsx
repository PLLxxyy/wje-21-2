import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '@/utils/api'
import TagBadge from '@/components/TagBadge'
import { Item } from '@/types'
import { Search as SearchIcon, Package, MapPin } from 'lucide-react'

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (query.trim()) {
        setLoading(true)
        try {
          const res = await api.get(`/items/search?q=${encodeURIComponent(query)}`)
          setResults(res.data)
        } finally {
          setLoading(false)
        }
      } else {
        setResults([])
      }
    }, 300)
    return () => clearTimeout(timeout)
  }, [query])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">搜索物品</h1>

      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="搜索物品名称或描述..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      {loading && <p className="text-center text-gray-500">搜索中...</p>}

      {results.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500">找到 {results.length} 个结果</p>
          {results.map((item: any) => (
            <Link
              key={item.id}
              to={`/items/${item.id}`}
              className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {item.photo ? (
                  <img src={item.photo} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <MapPin className="w-3 h-3" />
                    {item.space_name} {item.layer && `· ${item.layer}`}
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                  )}
                  {item.tags && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tags.split(',').filter(Boolean).map((tag: string) => (
                        <TagBadge key={tag} tag={tag} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {query && !loading && results.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <SearchIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>未找到相关物品</p>
        </div>
      )}
    </div>
  )
}
