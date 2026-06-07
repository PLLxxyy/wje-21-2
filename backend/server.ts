import express from 'express'
import cors from 'cors'
import { db } from './database'
import './init-db'
import authRoutes from './routes/auth'
import spaceRoutes from './routes/spaces'
import itemRoutes from './routes/items'
import familyRoutes from './routes/family'

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json({ limit: '10mb' }))

app.use('/api/auth', authRoutes)
app.use('/api/spaces', spaceRoutes)
app.use('/api/items', itemRoutes)
app.use('/api/family', familyRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
