import { useState } from 'react'

type AdbStatusResponse = {
  available: boolean
  version?: string
  message?: string
}

function App() {
  const [health, setHealth] = useState<string>('Not checked yet.')
  const [adbStatus, setAdbStatus] = useState<string>('Not checked yet.')
  const [adbVersion, setAdbVersion] = useState<string>('')
  const [checkingBackend, setCheckingBackend] = useState<boolean>(false)
  const [checkingAdb, setCheckingAdb] = useState<boolean>(false)

  async function checkBackend() {
    setCheckingBackend(true)
    setHealth('Checking backend...')

    try {
      const response = await fetch('/api/health')
      if (!response.ok) {
        setHealth('The backend response looked wrong.')
        return
      }

      const data = (await response.json()) as { ok: boolean }
      setHealth(data.ok ? 'Backend is responding.' : 'The backend response looked wrong.')
    } catch {
      setHealth('Could not reach the backend.')
    } finally {
      setCheckingBackend(false)
    }
  }

  async function checkAdb() {
    setCheckingAdb(true)
    setAdbStatus('Checking ADB...')
    setAdbVersion('')

    try {
      const response = await fetch('/api/adb/status')
      if (!response.ok) {
        throw new Error('Bad ADB status response')
      }

      const data = (await response.json()) as AdbStatusResponse

      if (data.available) {
        setAdbStatus('ADB is available.')
        setAdbVersion(data.version ?? '')
        return
      }

      setAdbStatus(data.message ?? 'ADB is not available.')
      setAdbVersion('')
    } catch {
      setAdbStatus('Could not fetch ADB status.')
      setAdbVersion('')
    } finally {
      setCheckingAdb(false)
    }
  }

  return (
    <main>
      <h1>DebloatHub</h1>
      <p>A small local tool for Android ADB experiments.</p>

      <h2>Backend:</h2>
      <button type="button" onClick={checkBackend} disabled={checkingBackend}>
        Check backend
      </button>

      <p>{health}</p>

      <h2>ADB:</h2>
      <button type="button" onClick={checkAdb} disabled={checkingAdb}>
        Check ADB
      </button>

      <p>{adbStatus}</p>
      {adbVersion && <p>{adbVersion}</p>}
    </main>
  )
}

export default App
