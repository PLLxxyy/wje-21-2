import { Router } from 'express'
import { db } from '../database'
import jwt from 'jsonwebtoken'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'pdd-167-secret-key'

function authMiddleware(req: any, res: any, next: any) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: '未登录' })
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch {
    return res.status(401).json({ error: '登录已过期' })
  }
}

router.use(authMiddleware)

router.get('/', (req: any, res) => {
  const spaces = db.prepare(
    'SELECT * FROM spaces WHERE user_id = ? ORDER BY created_at DESC'
  ).all(req.userId)
  res.json(spaces.map((s: any) => ({
    id: s.id,
    userId: s.user_id,
    name: s.name,
    location: s.location,
    description: s.description,
    createdAt: s.created_at
  })))
})

router.get('/:id', (req: any, res) => {
  const space: any = db.prepare(
    'SELECT * FROM spaces WHERE id = ? AND user_id = ?'
  ).get(req.params.id, req.userId)

  if (!space) return res.status(404).json({ error: '空间不存在' })

  res.json({
    id: space.id,
    userId: space.user_id,
    name: space.name,
    location: space.location,
    description: space.description,
    createdAt: space.created_at
  })
})

router.post('/', (req: any, res) => {
  const { name, location, description } = req.body
  if (!name || !location) {
    return res.status(400).json({ error: '请填写名称和位置' })
  }

  const result = db.prepare(
    'INSERT INTO spaces (user_id, name, location, description) VALUES (?, ?, ?, ?)'
  ).run(req.userId, name, location, description || null)

  const space: any = db.prepare('SELECT * FROM spaces WHERE id = ?').get(result.lastInsertRowid)
  res.json({
    id: space.id,
    userId: space.user_id,
    name: space.name,
    location: space.location,
    description: space.description,
    createdAt: space.created_at
  })
})

router.put('/:id', (req: any, res) => {
  const { name, location, description } = req.body
  db.prepare(
    'UPDATE spaces SET name = ?, location = ?, description = ? WHERE id = ? AND user_id = ?'
  ).run(name, location, description || null, req.params.id, req.userId)

  const space: any = db.prepare('SELECT * FROM spaces WHERE id = ?').get(req.params.id)
  res.json({
    id: space.id,
    userId: space.user_id,
    name: space.name,
    location: space.location,
    description: space.description,
    createdAt: space.created_at
  })
})

router.delete('/:id', (req: any, res) => {
  db.prepare('DELETE FROM items WHERE space_id = ?').run(req.params.id)
  db.prepare('DELETE FROM spaces WHERE id = ? AND user_id = ?').run(req.params.id, req.userId)
  res.json({ success: true })
})

router.get('/:id/items', (req: any, res) => {
  const items = db.prepare(
    'SELECT * FROM items WHERE space_id = ? ORDER BY created_at DESC'
  ).all(req.params.id)

  res.json(items.map((i: any) => ({
    id: i.id,
    spaceId: i.space_id,
    name: i.name,
    quantity: i.quantity,
    description: i.description,
    photo: i.photo,
    tags: i.tags,
    layer: i.layer,
    expiryDate: i.expiry_date,
    createdAt: i.created_at
  })))
})

router.post('/:id/items', (req: any, res) => {
  const { name, quantity, description, photo, tags, layer, expiryDate } = req.body
  if (!name) {
    return res.status(400).json({ error: '请填写物品名称' })
  }

  const result = db.prepare(`
    INSERT INTO items (space_id, name, quantity, description, photo, tags, layer, expiry_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(req.params.id, name, quantity || 1, description || null, photo || null, tags || null, layer || null, expiryDate || null)

  const item: any = db.prepare('SELECT * FROM items WHERE id = ?').get(result.lastInsertRowid)
  res.json({
    id: item.id,
    spaceId: item.space_id,
    name: item.name,
    quantity: item.quantity,
    description: item.description,
    photo: item.photo,
    tags: item.tags,
    layer: item.layer,
    expiryDate: item.expiry_date,
    createdAt: item.created_at
  })
})

export default router
