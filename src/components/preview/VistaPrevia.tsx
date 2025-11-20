import { useState, useEffect } from 'react'
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
type Visibility = { images: Record<number, boolean>; videos: Record<number, boolean>; web?: Record<number, boolean>; pdf?: Record<number, boolean> }
export default function VistaPrevia({ slides, metadata }: Props) {
  const [index, setIndex] = useState(0)

  const current = slides && slides.length > 0 ? slides[index] : null

  const [visibility, setVisibility] = useState<Visibility>(() => {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('presentaciones.visibility') : null
      if (raw) {
        const parsed = JSON.parse(raw)
        return { images: parsed?.images || {}, videos: parsed?.videos || {}, web: parsed?.web || {}, pdf: parsed?.pdf || {} }
      }
    } catch {
      // ignore
    }
    return { images: {}, videos: {}, web: {}, pdf: {} }
  })

  // update visibility if changed in another tab/editor
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === 'presentaciones.visibility') {
        try {
          const parsed = e.newValue ? JSON.parse(e.newValue) : null
          if (parsed) setVisibility({ images: parsed?.images || {}, videos: parsed?.videos || {}, web: parsed?.web || {}, pdf: parsed?.pdf || {} })
        } catch { /* ignore */ }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // ensure visibility has entries for all slide indices
  useEffect(() => {
    setTimeout(() => {
      setVisibility(prev => {
        const next = { images: { ...(prev.images || {}) }, videos: { ...(prev.videos || {}) }, web: { ...(prev.web || {}) }, pdf: { ...(prev.pdf || {}) } }
        let changed = false
        for (let i = 0; i < slides.length; i++) {
          if (next.images[i] === undefined) { next.images[i] = false; changed = true }
          if (next.videos[i] === undefined) { next.videos[i] = false; changed = true }
          if (next.web[i] === undefined) { next.web[i] = false; changed = true }
          // if slide contains explicit pdf entries, default visibility for pdf to true
          if (next.pdf[i] === undefined) {
            const s = slides[i] as Slide | undefined
            next.pdf[i] = !!(s && s.pdf && s.pdf.length > 0)
            changed = true
          }
        }
        return changed ? next : prev
      })
    }, 0)
  }, [slides.length])

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
