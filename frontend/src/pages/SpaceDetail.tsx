import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '@/utils/api'
import ItemForm from '@/components/ItemForm'
import TagBadge from '@/components/TagBadge'
import { Item, Space } from '@/types'
import { ArrowLeft, Plus, Trash2, Package } from 'lucide-react'

export default function SpaceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [space, setSpace] = useState<Space | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [spaceRes, itemsRes] = await Promise.all([
          api.get(`/spaces/${id}`),
          api.get(`/spaces/${id}/items`)
        ])
        setSpace(spaceRes.data)
        setItems(itemsRes.data)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleCreateItem = async (data: Partial<Item>) => {
    const res = await api.post(`/spaces/${id}/items`, data)
    setItems(prev => [res.data, ...prev])
    setShowForm(false)
  }

  const handleDeleteItem = async (itemId: number) => {
    if (!confirm('确定删除这个物品吗？')) return
    await api.delete(`/items/${itemId}`)
    setItems(prev => prev.filter(i => i.id !== itemId))
  }

  if (loading) return <div className="text-center py-20 text-gray-500">加载中...</div>
  if (!space) return <div className="text-center py-20 text-gray-500">空间不存在</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{space.name}</h1>
            <p className="text-sm text-gray-500">{space.location}</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          添加物品
        </button>
      </div>

      {showForm && (
        <ItemForm
          spaceId={space.id}
          onSubmit={handleCreateItem}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {item.photo ? (
                  <img src={item.photo} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Package className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-500">数量: {item.quantity}</p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {item.layer && (
              <p className="text-sm text-gray-500 mb-2">位置: {item.layer}</p>
            )}

            {item.description && (
              <p className="text-sm text-gray-500 mb-2">{item.description}</p>
            )}

            {item.tags && (
              <div className="flex flex-wrap gap-1 mb-2">
                {item.tags.split(',').filter(Boolean).map(tag => (
                  <TagBadge key={tag} tag={tag} />
                ))}
              </div>
            )}

            {item.expiryDate && (
              <p className={`text-xs ${new Date(item.expiryDate) < new Date() ? 'text-red-500' : 'text-gray-400'}`}>
                过期: {new Date(item.expiryDate).toLocaleDateString('zh-CN')}
              </p>
            )}
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>这个空间还没有物品</p>
          <p className="text-sm mt-1">点击上方按钮添加第一件物品</p>
        </div>
      )}
    </div>
  )
}
