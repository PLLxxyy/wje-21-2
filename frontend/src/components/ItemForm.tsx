import { useState } from 'react'
import { Item } from '@/types'
import { TAG_COLORS } from '@/utils/format'

interface ItemFormProps {
  spaceId: number
  onSubmit: (data: Partial<Item>) => void
  onCancel: () => void
  initial?: Partial<Item>
}

const AVAILABLE_TAGS = Object.keys(TAG_COLORS)

export default function ItemForm({ spaceId, onSubmit, onCancel, initial }: ItemFormProps) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    quantity: initial?.quantity || 1,
    description: initial?.description || '',
    photo: initial?.photo || '',
    layer: initial?.layer || '',
    expiryDate: initial?.expiryDate || '',
    tags: initial?.tags ? initial.tags.split(',').filter(Boolean) : [] as string[],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const toggleTag = (tag: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, photo: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      spaceId,
      name: form.name,
      quantity: Number(form.quantity),
      description: form.description,
      photo: form.photo,
      layer: form.layer,
      expiryDate: form.expiryDate || undefined,
      tags: form.tags.join(','),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">{initial ? '编辑物品' : '新增物品'}</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">名称</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">数量</label>
          <input type="number" name="quantity" value={form.quantity} onChange={handleChange} min={1}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">所在层/位置</label>
        <input type="text" name="layer" value={form.layer} onChange={handleChange}
          placeholder="如：第2层"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">照片</label>
        <input type="file" accept="image/*" onChange={handlePhotoChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        {form.photo && (
          <img src={form.photo} alt="预览" className="mt-2 w-32 h-32 object-cover rounded-lg" />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">标签</label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_TAGS.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                form.tags.includes(tag)
                  ? TAG_COLORS[tag]
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">过期日期（可选）</label>
        <input type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
      </div>

      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          取消
        </button>
        <button type="submit"
          className="px-4 py-2 text-sm text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors">
          保存
        </button>
      </div>
    </form>
  )
}
