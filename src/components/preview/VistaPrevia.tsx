import { useState } from 'react'
import type { Slide } from '../../services/grok'
import SlideViewClassic from './SlideViewClassic'

type Meta = {
  subject?: string
  teacher?: string
  logo?: string
  unit?: string
  topics?: string[]
}

type Props = {
  slides: Slide[]
  metadata?: Meta
}
export default function VistaPrevia({ slides, metadata }: Props) {
  const [index, setIndex] = useState(0)

  const current = slides && slides.length > 0 ? slides[index] : null

  // read visibility maps from localStorage (set by SlideEditor)
  const visibility: { images: Record<number, boolean>, videos: Record<number, boolean> } = (() => {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('presentaciones.visibility') : null
      if (raw) {
        const parsed = JSON.parse(raw)
        return { images: parsed?.images || {}, videos: parsed?.videos || {} }
      }
    } catch {
      // ignore parse errors
    }
    return { images: {}, videos: {} }
  })()

  function renderSlide() {
    if (!current) return <div className="p-6 text-gray-500">No hay diapositivas para previsualizar</div>
    return <SlideViewClassic slide={current} index={index} metadata={metadata} visibility={visibility} />
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-end gap-3 mb-4">
        <div className="flex items-center gap-2">
          <button onClick={() => setIndex(i => Math.max(0, i - 1))} className="px-3 py-1 bg-gray-200 rounded">Anterior</button>
          <div className="text-sm text-gray-600">{index + 1} / {slides.length}</div>
          <button onClick={() => setIndex(i => Math.min(slides.length - 1, i + 1))} className="px-3 py-1 bg-gray-200 rounded">Siguiente</button>
        </div>
      </div>

      <div className="mb-4">
        {renderSlide()}
      </div>

      <div className="grid grid-cols-6 gap-2">
        {slides.map((s, i) => (
          <button key={i} onClick={() => setIndex(i)} className={`p-1 border rounded ${i === index ? 'ring-2 ring-blue-400' : 'bg-white'}`}>
            <div className="text-xs font-semibold truncate w-24">{s.title}</div>
            <div className="text-xs text-gray-400 truncate w-24">{s.content.slice(0,40)}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
