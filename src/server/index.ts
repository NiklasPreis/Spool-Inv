import express from 'express'
import { join } from 'path'
import { getAllSpools, addSpool, updateSpool, deleteSpool, getStats } from './database'

const app = express()
const PORT = parseInt(process.env.PORT ?? '3000', 10)

app.use(express.json())

app.get('/api/spools/stats', (_req, res) => {
  res.json(getStats())
})

app.get('/api/spools', (_req, res) => {
  res.json(getAllSpools())
})

app.post('/api/spools', (req, res) => {
  const spool = addSpool(req.body)
  res.status(201).json(spool)
})

app.put('/api/spools/:id', (req, res) => {
  const id = parseInt(req.params.id, 10)
  const result = updateSpool(id, req.body)
  if (!result) { res.status(404).json({ error: 'Not found' }); return }
  res.json(result)
})

app.delete('/api/spools/:id', (req, res) => {
  deleteSpool(parseInt(req.params.id, 10))
  res.status(204).end()
})

if (process.env.NODE_ENV === 'production') {
  const staticDir = join(__dirname, '../renderer')
  app.use(express.static(staticDir))
  app.get('*', (_req, res) => {
    res.sendFile(join(staticDir, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`SpoolInv running on http://localhost:${PORT}`)
})
