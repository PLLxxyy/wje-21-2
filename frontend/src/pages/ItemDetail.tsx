import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '@/utils/api'
import ItemForm from '@/components/ItemForm'
import TagBadge from '@/components/TagBadge'
import { Item } from '@/types'
import { ArrowLeft, Trash2, Edit, Package } from 'lucide-react'

export default function ItemDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState<Item | null>(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/items/${id}`)
        setItem(res.data)
      } finally {
        setLoading(false)
      }
    }
    fetchItem()
  }, [id])

  const handleUpdate = async (data: Partial<Item>) => {
    const res = await api.put(`/items/${id}`, data)
    setItem(res.data)
    setEditing(false)
  }

  const handleDelete = async () => {
    if (!confirm('确定删除这个物品吗？')) return
    await api.delete(`/items/${id}`)
    navigate(-1)
  }

  if (loading) return <div className="text-center py-20 text-gray-500">加载中...</div>
  if (!item) return <div className="text-center py-20 text-gray-500">物品不存在</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">物品详情</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
          >
            <Edit className="w-4 h-4" />
            {editing ? '取消' : '编辑'}
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            删除
          </button>
        </div>
      </div>

      {editing ? (
        <ItemForm
          spaceId={item.spaceId}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
          initial={item}
        />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start gap-6">
            {item.photo ? (
              <img src={item.photo} alt={item.name} className="w-32 h-32 rounded-lg object-cover" />
            ) : (
              <div className="w-32 h-32 rounded-lg bg-gray-100 flex items-center justify-center">
                <Package className="w-12 h-12 text-gray-300" />
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h2>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  <span className="font-medium text-gray-700">数量:</span> {item.quantity}
                </p>
                {item.layer && (
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-700">位置:</span> {item.layer}
                  </p>
                )}
                {item.description && (
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-700">描述:</span> {item.description}
                  </p>
                )}
                {item.tags && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">标签:</span>
                    <div className="flex flex-wrap gap-1">
                      {item.tags.split(',').filter(Boolean).map(tag => (
                        <TagBadge key={tag} tag={tag} />
                      ))}
                    </div>
                  </div>
                )}
                {item.expiryDate && (
                  <p className={`${new Date(item.expiryDate) < new Date() ? 'text-red-500' : 'text-gray-600'}`}>
                    <span className="font-medium text-gray-700">过期日期:</span>{' '}
                    {new Date(item.expiryDate).toLocaleDateString('zh-CN')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
