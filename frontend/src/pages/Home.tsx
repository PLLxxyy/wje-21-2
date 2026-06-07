import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSpaces } from '@/hooks/useSpaces'
import SpaceForm from '@/components/SpaceForm'
import { Plus, Trash2, Edit, Box, MapPin } from 'lucide-react'

export default function Home() {
  const { spaces, loading, createSpace, deleteSpace } = useSpaces()
  const [showForm, setShowForm] = useState(false)

  if (loading) return <div className="text-center py-20 text-gray-500">加载中...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">我的空间</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          新增空间
        </button>
      </div>

      {showForm && (
        <SpaceForm
          onSubmit={async (data) => {
            await createSpace(data)
            setShowForm(false)
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {spaces.map(space => (
          <Link
            key={space.id}
            to={`/spaces/${space.id}`}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Box className="w-6 h-6 text-emerald-600" />
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (confirm('确定删除这个空间吗？')) {
                    deleteSpace(space.id)
                  }
                }}
                className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{space.name}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="w-3 h-3" />
              {space.location}
            </div>
            {space.description && (
              <p className="mt-2 text-sm text-gray-400">{space.description}</p>
            )}
          </Link>
        ))}
      </div>

      {spaces.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Box className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>暂无空间</p>
          <p className="text-sm mt-1">点击上方按钮添加第一个收纳空间</p>
        </div>
      )}
    </div>
  )
}
