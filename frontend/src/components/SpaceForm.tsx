import { useState } from 'react'
import { Space } from '@/types'

interface SpaceFormProps {
  onSubmit: (data: Partial<Space>) => void
  onCancel: () => void
  initial?: Partial<Space>
}

export default function SpaceForm({ onSubmit, onCancel, initial }: SpaceFormProps) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    location: initial?.location || '',
    description: initial?.description || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">{initial ? '编辑空间' : '新增空间'}</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">名称</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} required
          placeholder="如：客厅储物柜"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">位置</label>
        <input type="text" name="location" value={form.location} onChange={handleChange} required
          placeholder="如：客厅沙发旁"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={2}
          placeholder="可选描述"
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
