import express from 'express'
import { getAdbStatus } from './adb/adbStatus.js'

const app = express()

app.get('/api/health', (_request, response) => {
  response.json({ ok: true })
})

app.get('/api/adb/status', async (_request, response) => {
  const status = await getAdbStatus()

  response.json(status)
})

export default app
