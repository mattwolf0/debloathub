import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import express from 'express'

const execFileAsync = promisify(execFile)
const app = express()
const port = Number(process.env.PORT ?? 3001)

app.get('/api/health', (_request, response) => {
  response.json({ ok: true })
})

app.get('/api/adb/status', async (_request, response) => {
  try {
    const { stdout } = await execFileAsync('adb', ['version'], {
      timeout: 5000,
      windowsHide: true,
    })

    response.json({
      available: true,
      version: stdout.trim().split('\n')[0],
    })
  } catch (error) {
    const adbError = error as NodeJS.ErrnoException & { killed?: boolean }
    const message =
      adbError.code === 'ENOENT'
        ? 'Az adb nem található a PATH-ban.'
        : adbError.killed
          ? 'Az adb version parancs túllépte az időkorlátot.'
          : adbError.message

    response.json({
      available: false,
      message,
    })
  }
})

app.listen(port, () => {
  console.log(`Backend: http://localhost:${port}`)
})
