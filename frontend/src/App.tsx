import { useState } from 'react'

function App() {
  const [health, setHealth] = useState<string>('Még nincs lekérdezve.')

  async function checkBackend() {
    try {
      const response = await fetch('/api/health')
      const data = (await response.json()) as { ok: boolean }
      setHealth(data.ok ? 'A backend válaszol.' : 'A backend válasza furcsa.')
    } catch {
      setHealth('Nem sikerült elérni a backendet.')
    }
  }

  return (
    <main>
      <h1>DebloatHub</h1>
      <p>Egy nagyon kicsi kezdőprojekt Android ADB kísérletekhez.</p>

      <button type="button" onClick={checkBackend}>
        Backend ellenőrzése
      </button>

      <p>{health}</p>
    </main>
  )
}

export default App
