import { useState, useEffect } from 'react'
// import SlideStyleSelector from './SlideStyleSelector'
import SlideEditor from './SlideEditor'
import { generateSlides } from '../services/grok'
import { toYouTubeEmbed } from '../services/media'
import type { Slide } from '../services/grok'

type Meta = { unit?: string; subject?: string; teacher?: string; logo?: string; topics?: string[]; slidesCount?: number; style?: 'text' | 'images' | 'advanced' }
type SlidesWrapper = { metadata?: Meta; slides?: Slide[] }

export default function PresentationGenerator() {
  const formKey = 'presentaciones.form'
  const slidesKey = 'presentaciones.slides'

  // Load persisted form if any
  const savedFormRaw = typeof localStorage !== 'undefined' ? localStorage.getItem(formKey) : null
  const savedForm = savedFormRaw ? JSON.parse(savedFormRaw) : null
  // Try to read slides wrapper to extract metadata if form not present
  let parsedSlidesForInit: SlidesWrapper | null = null
  try {
    const rawSlides = typeof localStorage !== 'undefined' ? localStorage.getItem(slidesKey) : null
    if (rawSlides) parsedSlidesForInit = JSON.parse(rawSlides) as SlidesWrapper
  } catch {
    /* ignore parse errors */
  }

  const [unit, setUnit] = useState<string>(savedForm?.unit || parsedSlidesForInit?.metadata?.unit || 'Introducción')
  const [topics, setTopics] = useState<string[]>(savedForm?.topics && savedForm.topics.length >= 2 ? savedForm.topics : (savedForm?.topics || ['Tema 1', 'Tema 2']))
  const [slidesCount, setSlidesCount] = useState<number>(savedForm?.slidesCount ?? 5)
  const [style, setStyle] = useState<'text'|'images'|'advanced'>(savedForm?.style || 'text')
  const [subject, setSubject] = useState<string>(savedForm?.subject || parsedSlidesForInit?.metadata?.subject || '')
  const [teacher, setTeacher] = useState<string>(savedForm?.teacher || parsedSlidesForInit?.metadata?.teacher || '')
  const [logoUrl, setLogoUrl] = useState<string>(savedForm?.logo || parsedSlidesForInit?.metadata?.logo || '')
  const [loading, setLoading] = useState(false)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)
  const [rawResponse, setRawResponse] = useState<string | null>(null)
  const [showDataManager, setShowDataManager] = useState(false)
  const [dataJsonText, setDataJsonText] = useState<string>('')
  const [dataError, setDataError] = useState<string | null>(null)

  const [slides, setSlides] = useState<Slide[] | null>(() => {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(slidesKey) : null
      if (!raw) return null
      const parsed = JSON.parse(raw)
      // if saved as just an array of slides
      if (Array.isArray(parsed)) {
        try {
          const normalized = parsed.map((s: Slide) => ({ ...s, videos: s.videos ? s.videos.map(v => toYouTubeEmbed(v)) : s.videos }))
          return normalized as Slide[]
        } catch {
          return parsed as Slide[]
        }
      }
      // if saved as wrapper { metadata, slides }
      if (parsed && typeof parsed === 'object' && Array.isArray(parsed.slides)) {
        try {
          const normalized = parsed.slides.map((s: Slide) => ({ ...s, videos: s.videos ? s.videos.map(v => toYouTubeEmbed(v)) : s.videos }))
          return normalized as Slide[]
        } catch {
          return parsed.slides as Slide[]
        }
      }
      // handle wrapped shape: { slides: [...] } or { data: [...] }
      if (parsed && typeof parsed === 'object') {
        const candidates = ['slides', 'items', 'data', 'result', 'results']
        for (const k of candidates) {
          if (parsed[k] && Array.isArray(parsed[k])) return parsed[k] as Slide[]
        }
        // if it's a single slide object, wrap it
        if (parsed.title || parsed.content) return [parsed as Slide]
      }
      return null
    } catch (e) { console.warn('No se pudo parsear slides en localStorage', e); return null }
  })

  const [apiKey, setApiKey] = useState<string | undefined>(() => {
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('groqApiKey') : null
    if (stored) return stored || undefined
    const envAny = (import.meta as unknown) as Record<string, string | undefined>
    return envAny.VITE_API_GROQ_KEY || envAny.NEXT_PUBLIC_API_GROQ_KEY || undefined
  })

  const [hasSavedKey, setHasSavedKey] = useState<boolean>(() => Boolean(typeof localStorage !== 'undefined' && localStorage.getItem('groqApiKey')))
  const [editingKey, setEditingKey] = useState<boolean>(false)

  // La vista previa ahora está disponible en /preview y toma los datos desde localStorage

  async function handleGenerate() {
    // validation: at least 2 non-empty topics
    if (!topics || topics.length < 2 || topics.some(t => !t || t.trim() === '')) {
      alert('Introduce al menos 2 temas válidos (no vacíos) antes de generar')
      return
    }

    // slidesCount is interpreted as number of slides per topic
    setLoading(true)
    try {
      // build cover slide as first slide (carátula)
      const cover: Slide = {
        title: subject || 'Portada',
        content: `${unit ? `Unidad temática: ${unit}\n` : ''}${teacher ? `Docente: ${teacher}` : ''}`,
        images: logoUrl ? [logoUrl] : undefined,
      }

      // start with cover and persist immediately so there's a saved state
      let accumulated: Slide[] = [cover]
      setSlides(accumulated)
      try {
        const wrapper = { metadata: { subject, teacher, logo: logoUrl, unit, topics, slidesCount, style }, slides: accumulated }
        localStorage.setItem(slidesKey, JSON.stringify(wrapper))
      } catch (e) { console.warn('No se pudo guardar slides (cover)', e) }

      for (let i = 0; i < topics.length; i++) {
        const topic = (topics[i] || '').trim()
        setInfoMessage(`Generando tema ${i + 1}/${topics.length}: ${topic} ...`)
        const promptForTopic = `${unit}${unit ? ' - ' : ''}${topic}`
        console.debug('[presentation] prompting for topic:', promptForTopic)

        try {
          const res = await generateSlides({ topic: promptForTopic, slides: slidesCount, style, apiKey })
          const normalizedBody: Slide[] = Array.isArray(res)
            ? res.map(s => ({
                title: s.title || '',
                content: s.content || '',
                images: Array.isArray(s.images) ? s.images : (s.images ? [s.images] : undefined),
                videos: s.videos ? (Array.isArray(s.videos) ? s.videos.map(v => toYouTubeEmbed(v)) : [toYouTubeEmbed(s.videos as unknown as string)]) : undefined,
                imagesPosition: (s as Partial<Slide>).imagesPosition || undefined,
              }))
            : []

          accumulated = [...accumulated, ...normalizedBody]
          setSlides(accumulated)

          // persist partial results after each topic
          try {
            const wrapper = { metadata: { subject, teacher, logo: logoUrl, unit, topics, slidesCount, style }, slides: accumulated }
            localStorage.setItem(slidesKey, JSON.stringify(wrapper))
            // also store last raw response for debugging
            try { localStorage.setItem('presentaciones.lastResponse', JSON.stringify(res)) } catch {console.error('No se pudo guardar lastResponse') }
          } catch (e) { console.warn('No se pudo persistir slides tras topic', e) }

          // detect stub-like slides per topic (heuristic)
          const isStub = Array.isArray(res) && res.length > 0 && typeof res[0].content === 'string' && res[0].content.startsWith('Contenido de ejemplo para')
          if (isStub) {
            setInfoMessage('Se ha usado el modo de ejemplo (stub) en alguna respuesta. Revisa la clave de API o la consola.')
            console.warn('[presentation] generateSlides returned stub-like content for topic', topic)
          }
        } catch (errTopic) {
          console.error('Error generando slides para topic', topic, errTopic)
          setInfoMessage(`Error generando tema ${topic}: ${errTopic instanceof Error ? errTopic.message : String(errTopic)}`)
        }

        // wait 30s between topics, except after the last one
        if (i < topics.length - 1) {
          // eslint-disable-next-line no-await-in-loop
          await new Promise(resolve => setTimeout(resolve, 30000))
        }
      }

      setInfoMessage('Generación completada')

      // persist form as well
      try { localStorage.setItem(formKey, JSON.stringify({ unit, topics, slidesCount, style, subject, teacher, logo: logoUrl })) } catch (e) { console.warn('No se pudo guardar form', e) }
    } catch (err) {
      console.error(err)
      alert('Error durante la generación de las diapositivas')
    } finally {
      setLoading(false)
    }
  }

  // persist form on changes so reload restores UI
  useEffect(() => {
    try { localStorage.setItem(formKey, JSON.stringify({ unit, topics, slidesCount, style, subject, teacher, logo: logoUrl })) } catch (err) { console.warn('No se pudo persistir form', err) }
  }, [unit, topics, slidesCount, style, subject, teacher, logoUrl])

  useEffect(() => {
    setHasSavedKey(Boolean(typeof localStorage !== 'undefined' && localStorage.getItem('groqApiKey')))
  }, [apiKey])

  // load pasted JSON into form/slides
  function handleLoadData() {
    setDataError(null)
    if (!dataJsonText || !dataJsonText.trim()) { setDataError('Pega aquí el JSON de la presentación'); return }
    try {
      const parsed = JSON.parse(dataJsonText)
      // expect wrapper { metadata, slides } or direct slides array
      let incomingSlides: Slide[] | null = null
  let incomingMeta: Meta | null = null
      if (Array.isArray(parsed)) incomingSlides = parsed as Slide[]
      else if (parsed && typeof parsed === 'object') {
        if (Array.isArray(parsed.slides)) {
          incomingSlides = parsed.slides as Slide[]
          incomingMeta = parsed.metadata || parsed.meta || parsed.metadata
        } else if (Array.isArray(parsed.data)) {
          incomingSlides = parsed.data as Slide[]
        } else if (parsed.title || parsed.content) {
          incomingSlides = [parsed as Slide]
        }
      }

      if (!incomingSlides) { setDataError('No encontré un array de diapositivas válido en el JSON'); return }

      // normalize videos to embed and ensure arrays
      const normalized = incomingSlides.map(s => ({
        title: s.title || '',
        content: s.content || '',
        images: Array.isArray(s.images) ? s.images : (s.images ? [s.images] : undefined),
        videos: Array.isArray(s.videos) ? s.videos.map(v => toYouTubeEmbed(v)) : (s.videos ? [toYouTubeEmbed(s.videos as unknown as string)] : undefined),
  imagesPosition: (s as Partial<Slide>).imagesPosition || undefined,
      })) as Slide[]

      setSlides(normalized)

      // if metadata present, populate form fields
      if (incomingMeta && typeof incomingMeta === 'object') {
        if (incomingMeta.unit) setUnit(incomingMeta.unit)
        if (incomingMeta.subject) setSubject(incomingMeta.subject)
        if (incomingMeta.teacher) setTeacher(incomingMeta.teacher)
        if (incomingMeta.logo) setLogoUrl(incomingMeta.logo)
        if (incomingMeta.topics && Array.isArray(incomingMeta.topics)) setTopics(incomingMeta.topics)
        if (incomingMeta.slidesCount) setSlidesCount(Number(incomingMeta.slidesCount) || normalized.length)
        if (incomingMeta.style && (incomingMeta.style === 'text' || incomingMeta.style === 'images' || incomingMeta.style === 'advanced')) {
          setStyle(incomingMeta.style)
        }
      }

      // persist wrapper
      try {
        const wrapper = { metadata: { subject, teacher, logo: logoUrl, unit, topics, slidesCount, style }, slides: normalized }
        localStorage.setItem(slidesKey, JSON.stringify(wrapper))
      } catch (e) { console.warn('No se pudo persistir slides al cargar JSON', e) }

      setInfoMessage('Datos cargados correctamente. Puedes editar las diapositivas abajo.')
      setShowDataManager(false)
    } catch (e: unknown) {
      console.error(e)
      setDataError('JSON inválido: ' + (e instanceof Error ? e.message : String(e)))
    }
  }

  return (
    <>
    <header className="max-w-4xl mx-auto mb-6 flex items-center justify-center">
          <div>
            <h1 className="text-2xl font-bold">Generador de Presentación de Clase</h1>
            
          </div>
          {/* <div>
            <Link to="/" className="text-sm text-blue-600 underline">Volver al generador</Link>
          </div> */}
        </header>
    <div className="space-y-6">
      {/* View selector & preview access */}
      {/* <div className="flex items-center gap-3 justify-end">
        <label className="text-sm text-gray-500">Ver como:</label>
        <select id="viewSelect" className="p-2 border rounded" onChange={e => setPreviewView(e.target.value)} value={previewView}>
          <option value="classic">Clásica</option>
          <option value="modern">Moderna</option>
          <option value="minimal">Minimal</option>
        </select>
        <button onClick={() => setShowPreview(s => !s)} className="px-3 py-1 bg-blue-600 text-white rounded">{showPreview ? 'Ocultar vista previa' : 'Abrir vista previa'}</button>
      </div> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="md:col-span-2">
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium">Nombre de la Asignatura</label>
              <input value={subject} onChange={e => setSubject(e.target.value)} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium">Docente</label>
              <input value={teacher} onChange={e => setTeacher(e.target.value)} className="w-full p-2 border rounded" />
            </div>
          </div>
          <label className="block text-sm font-medium">Unidad temática</label>
          <input value={unit} onChange={e => setUnit(e.target.value)} className="w-full p-2 border rounded" />
        <div>
          <label className="block text-sm font-medium">Diapositivas por tema</label>
          <input type="number" min={1} max={50} value={slidesCount} onChange={e => setSlidesCount(Number(e.target.value))} className="w-full p-2 border rounded" />
        </div>
          

          <div className="mt-3">
            <label className="block text-sm font-medium">Logo (URL)</label>
            <input value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="https://.../logo.png" className="w-full p-2 border rounded" />
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium">Temas (mínimo 2)</label>
            {topics.map((t, idx) => (
              <div key={idx} className="flex gap-2 mt-2">
                <input value={t} onChange={e => { const copy = [...topics]; copy[idx] = e.target.value; setTopics(copy) }} className="flex-1 p-2 border rounded" />
                <button disabled={topics.length <= 2} onClick={() => { if (topics.length > 2) setTopics(topics.filter((_,i) => i !== idx)) }} className="px-2 py-1 bg-red-100 rounded">Eliminar</button>
              </div>
            ))}
            <div className="mt-2">
              <button onClick={() => setTopics([...topics, `Tema ${topics.length + 1}`])} className="px-3 py-1 bg-gray-100 rounded">Agregar tema</button>
            </div>
          </div>
        </div>
        
      </div>

      {/* <SlideStyleSelector value={style} onChange={s => setStyle(s)} /> */}

      <div className="flex items-center gap-3">
      {hasSavedKey && !editingKey ? (
        <div className="flex items-center gap-2 flex-1">
          <div className="text-sm text-gray-600">Grok API Key guardada</div>
          <button onClick={() => {
            // iniciar edición: precargar valor desde localStorage
            try {
              const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('groqApiKey') : null
              setApiKey(stored || undefined)
            } catch { setApiKey(undefined) }
            setEditingKey(true)
          }} className="px-3 py-1 bg-gray-100 rounded text-sm">Editar</button>
          <button onClick={() => {
            if (!confirm('¿Eliminar la clave Grok guardada?')) return
            try { localStorage.removeItem('groqApiKey') } catch (e) { console.warn(e) }
            setHasSavedKey(false)
            setApiKey(undefined)
            alert('Clave eliminada')
          }} className="px-3 py-1 bg-red-100 rounded text-sm">Borrar</button>
        </div>
      ) : (
        <>
          <input placeholder="Grok API Key (opcional)" value={apiKey || ''} onChange={e => setApiKey(e.target.value || undefined)} className="p-2 border rounded flex-1" />
          {!hasSavedKey && <button onClick={() => { if (apiKey) { try { localStorage.setItem('groqApiKey', apiKey) } catch(e){console.warn(e)} setHasSavedKey(true); alert('Clave guardada localmente') } else { alert('Introduce una clave antes de guardar') } }} className="px-4 py-2 bg-gray-100 rounded">Guardar</button>}
          {editingKey && (
            <>
              <button onClick={() => { if (apiKey) { try { localStorage.setItem('groqApiKey', apiKey) } catch(e){console.warn(e)} setHasSavedKey(true); setEditingKey(false); alert('Clave actualizada') } else { alert('Introduce una clave') } }} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Guardar</button>
              <button onClick={() => { setEditingKey(false); try { const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('groqApiKey') : null; setApiKey(stored || undefined) } catch { setApiKey(undefined) } }} className="px-3 py-1 bg-gray-50 rounded text-sm">Cancelar</button>
            </>
          )}
        </>
      )}
            <button onClick={handleGenerate} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? 'Generando...' : 'Generar'}</button>
            <button onClick={() => {
          // Nuevo: limpiar formulario y persisted data (no borra apiKey)
          // además establecer por defecto Docente y Logo solicitados
          setUnit('')
          setTopics(['',''])
          setSlidesCount(5)
          setStyle('text')
          setSubject('')
          setTeacher('Ing. Mario Ibarra')
          setLogoUrl('https://res.cloudinary.com/dlyfncohn/image/upload/v1763085172/urlnext-images/ekjqpffg9sdky1hghdsz.jpg')
          setSlides(null)
          try { localStorage.removeItem(formKey) } catch (e) { console.warn('No se pudo eliminar form', e) }
          try { localStorage.removeItem(slidesKey) } catch (e) { console.warn('No se pudo eliminar slides', e) }
        }} className="px-3 py-2 bg-yellow-100 rounded">Nuevo</button>
      </div>

      {infoMessage && (
        <div className="p-2 bg-yellow-100 text-sm rounded">{infoMessage}</div>
      )}

      <div className="mt-2">
        <div className="flex gap-2 items-start">
        <button onClick={() => {
          try {
            const r = typeof localStorage !== 'undefined' ? localStorage.getItem('presentaciones.lastResponse') : null
            setRawResponse(r)
          } catch (e) { console.warn('No se pudo leer lastResponse', e); setRawResponse(null) }
        }} className="px-2 py-1 bg-gray-100 rounded text-sm">Mostrar respuesta cruda</button>
        <button onClick={() => setShowDataManager(s => !s)} className="px-2 py-1 bg-indigo-50 rounded text-sm">Gestor de datos</button>
        </div>
        {rawResponse !== null && (
          <pre className="mt-2 p-2 bg-black text-white text-xs overflow-auto max-h-48">{rawResponse}</pre>
        )}
      </div>

      {/* Data manager panel (desplegable) */}
      {showDataManager && (
        <div className="mt-4 p-3 border rounded bg-white shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">Pegar/Importar JSON de presentación</div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setDataJsonText(''); setDataError(null) }} className="px-2 py-1 text-sm bg-gray-100 rounded">Limpiar</button>
              <button onClick={() => setShowDataManager(false)} className="px-2 py-1 text-sm bg-gray-50 rounded">Cerrar</button>
            </div>
          </div>
          <textarea value={dataJsonText} onChange={e => setDataJsonText(e.target.value)} placeholder='Pega aquí el JSON exportado (wrapper { "metadata", "slides" } o array de slides)' rows={8} className="w-full p-2 border rounded font-mono text-sm" />
          {dataError && <div className="mt-2 text-sm text-red-600">{dataError}</div>}
          <div className="mt-2 flex items-center gap-2">
            <button onClick={handleLoadData} className="px-3 py-2 bg-green-600 text-white rounded">Cargar JSON</button>
            <label className="px-3 py-2 bg-gray-100 rounded cursor-pointer text-sm">
              Cargar archivo
              <input type="file" accept="application/json" onChange={e => {
                const f = e.target.files?.[0]
                if (!f) return
                const reader = new FileReader()
                reader.onload = () => {
                  const txt = String(reader.result || '')
                  setDataJsonText(txt)
                }
                reader.readAsText(f)
              }} style={{ display: 'none' }} />
            </label>
            <button onClick={() => {
              // try to load slides currently in localStorage into text area for quick export/edit
              try {
                const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(slidesKey) : null
                if (!raw) { setDataError('No hay datos guardados en localStorage bajo presentaciones.slides'); return }
                setDataJsonText(raw)
                setDataError(null)
              } catch (e) { setDataError('Error leyendo localStorage' + e); }
            }} className="px-3 py-2 bg-gray-100 rounded text-sm">Cargar desde localStorage</button>
            <button onClick={() => {
              // clear saved slides from localStorage
              try { localStorage.removeItem(slidesKey); setSlides(null); setInfoMessage('Datos en localStorage eliminados'); } catch (e) { setDataError('No se pudo eliminar de localStorage'+e) }
            }} className="px-3 py-2 bg-red-100 rounded text-sm">Borrar guardado</button>
          </div>
        </div>
      )}

      {slides && (
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium mb-2">Diapositivas generadas</h2>
            <button title="Borrar todas las diapositivas" onClick={() => {
              if (!confirm('¿Eliminar todas las diapositivas generadas? Esta acción no eliminará la metadata.')) return
              try {
                // keep metadata but clear slides
                const wrapper = { metadata: { subject, teacher, logo: logoUrl, unit, topics, slidesCount, style }, slides: [] }
                localStorage.setItem(slidesKey, JSON.stringify(wrapper))
              } catch (e) { console.warn('No se pudo actualizar localStorage al borrar slides', e) }
              setSlides([])
              setInfoMessage('Todas las diapositivas han sido eliminadas (metadata preservada)')
            }} className="px-2 py-1 bg-red-100 text-sm rounded flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H3a1 1 0 100 2h14a1 1 0 100-2h-2V3a1 1 0 00-1-1H6zm2 6a1 1 0 10-2 0v6a1 1 0 102 0V8zm4 0a1 1 0 10-2 0v6a1 1 0 102 0V8z" clipRule="evenodd" /></svg>
              Borrar diapositivas
            </button>
          </div>
          <SlideEditor slides={slides} onChange={(next) => {
            setSlides(next)
            try {
              const wrapper = { metadata: { subject, teacher, logo: logoUrl, unit, topics, slidesCount, style }, slides: next }
              localStorage.setItem(slidesKey, JSON.stringify(wrapper))
            } catch (e) { console.warn('No se pudo persistir slides tras edición', e) }
          }} />
          
            {/* La vista previa se abre en /preview y lee los datos desde localStorage */}
          
          <div className="mt-4 flex items-center gap-3">
            <button onClick={() => {
              try {
                // generate a numeric id at the moment of download
                const id = Date.now()

                // try to read visibility map saved by SlideEditor
                let visibility: { images?: Record<number, boolean>; videos?: Record<number, boolean> } | null = null
                try {
                  const rawVis = typeof localStorage !== 'undefined' ? localStorage.getItem('presentaciones.visibility') : null
                  if (rawVis) visibility = JSON.parse(rawVis)
                } catch (e) {
                  console.warn('No se pudo leer presentaciones.visibility', e)
                  visibility = null
                }

                // build exported slides: remove images/videos properties when visibility explicitly false for that slide
                const exportedSlides = (slides || []).map((s, idx) => {
                  const copy: Partial<Slide> = { ...s }
                  if (copy.images && visibility && visibility.images && visibility.images[idx] === false) {
                    delete copy.images
                  }
                  if (copy.videos && visibility && visibility.videos && visibility.videos[idx] === false) {
                    delete copy.videos
                  }
                  return copy
                })

                const wrapper = { metadata: { id, subject, teacher, logo: logoUrl, unit, topics, slidesCount, style }, slides: exportedSlides }
                const data = JSON.stringify(wrapper, null, 2)
                const blob = new Blob([data], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                const safeName = (subject || unit || (topics && topics.length ? topics.join('-') : 'presentation')).replace(/\s+/g,'-')
                a.download = `${safeName}-slides.json`
                a.click()
                URL.revokeObjectURL(url)
              } catch (e) { console.error('Error durante la descarga JSON', e); alert('No se pudo generar el archivo JSON') }
            }} className="px-3 py-2 bg-green-600 text-white rounded">Descargar JSON</button>

            <button onClick={() => { window.location.href = '/preview' }} className="px-3 py-2 bg-blue-600 text-white rounded">Vista Previa</button>
          </div>
        </div>
      )}
    </div>
    </>
  )
}
