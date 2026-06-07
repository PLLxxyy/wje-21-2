import { useState, useEffect, useCallback } from 'react'
import api from '@/utils/api'
import { Space } from '@/types'

export function useSpaces() {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [loading, setLoading] = useState(false)

  const fetchSpaces = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/spaces')
      setSpaces(res.data)
    } finally {
      setLoading(false)
    }
  }, [])

  const createSpace = async (data: Partial<Space>) => {
    const res = await api.post('/spaces', data)
    setSpaces(prev => [res.data, ...prev])
    return res.data
  }

  const updateSpace = async (id: number, data: Partial<Space>) => {
    const res = await api.put(`/spaces/${id}`, data)
    setSpaces(prev => prev.map(s => s.id === id ? res.data : s))
    return res.data
  }

  const deleteSpace = async (id: number) => {
    await api.delete(`/spaces/${id}`)
    setSpaces(prev => prev.filter(s => s.id !== id))
  }

  useEffect(() => {
    fetchSpaces()
  }, [fetchSpaces])

  return { spaces, loading, fetchSpaces, createSpace, updateSpace, deleteSpace }
}
