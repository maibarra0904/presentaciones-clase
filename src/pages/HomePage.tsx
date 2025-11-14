import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function HomePage() {
  const [id, setId] = useState('')
  const navigate = useNavigate()

  function goToPresentation(e?: React.FormEvent) {
    e?.preventDefault()
    const finalId = id.trim() || 'new'
    navigate(`/presentacion/${finalId}`)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Ir a presentación</h1>
      <form onSubmit={goToPresentation} className="flex gap-2 items-center">
        <input
          aria-label="id-presentacion"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Introduce un id (ej: examen-1)"
          className="border rounded px-3 py-2 flex-1"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Ir</button>
      </form>

      <div className="mt-6">
        <Link to="/generador" className="text-blue-600 underline">Ir al generador de presentaciones</Link>
      </div>
    </div>
  )
}
