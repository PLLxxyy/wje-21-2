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

router.get('/search', (req: any, res) => {
  const q = req.query.q as string
  if (!q) return res.json([])

  const items = db.prepare(`
    SELECT i.*, s.name as space_name
    FROM items i
    JOIN spaces s ON i.space_id = s.id
    WHERE s.user_id = ? AND (i.name LIKE ? OR i.description LIKE ?)
    ORDER BY i.created_at DESC
  `).all(req.userId, `%${q}%`, `%${q}%`)

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
    spaceName: i.space_name,
    createdAt: i.created_at
  })))
})

router.get('/:id', (req: any, res) => {
  const item: any = db.prepare(`
    SELECT i.* FROM items i
    JOIN spaces s ON i.space_id = s.id
    WHERE i.id = ? AND s.user_id = ?
  `).get(req.params.id, req.userId)

  if (!item) return res.status(404).json({ error: '物品不存在' })

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

router.put('/:id', (req: any, res) => {
  const { name, quantity, description, photo, tags, layer, expiryDate } = req.body

  const itemCheck: any = db.prepare(`
    SELECT i.* FROM items i
    JOIN spaces s ON i.space_id = s.id
    WHERE i.id = ? AND s.user_id = ?
  `).get(req.params.id, req.userId)

  if (!itemCheck) return res.status(404).json({ error: '物品不存在' })

  db.prepare(`
    UPDATE items SET
    name = ?, quantity = ?, description = ?, photo = ?, tags = ?, layer = ?, expiry_date = ?
    WHERE id = ?
  `).run(name, quantity || 1, description || null, photo || null, tags || null, layer || null, expiryDate || null, req.params.id)

  const item: any = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id)
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

router.delete('/:id', (req: any, res) => {
  const itemCheck: any = db.prepare(`
    SELECT i.* FROM items i
    JOIN spaces s ON i.space_id = s.id
    WHERE i.id = ? AND s.user_id = ?
  `).get(req.params.id, req.userId)

  if (!itemCheck) return res.status(404).json({ error: '物品不存在' })

  db.prepare('DELETE FROM items WHERE id = ?').run(req.params.id)
  res.json({ success: true })
})

export default router
