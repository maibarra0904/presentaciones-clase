import { useState, useEffect } from 'react'
import type { Slide } from '../services/grok'
import { toYouTubeEmbed, getYouTubeThumbnail } from '../services/media'

type Props = {
  slides?: Slide[];
  onChange?: (slides: Slide[]) => void;
}

export default function SlideEditor({ slides, onChange }: Props) {
  // unified visibility state to avoid cascading renders when syncing from storage
  const [visibility, setVisibility] = useState<{ images: Record<number, boolean>; videos: Record<number, boolean>; web: Record<number, boolean> }>(() => {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('presentaciones.visibility') : null
      if (raw) {
        const parsed = JSON.parse(raw)
        return { images: parsed?.images || {}, videos: parsed?.videos || {}, web: parsed?.web || {} }
      }
    } catch { /* ignore */ }
    return { images: {}, videos: {}, web: {} }
  })
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // when slides prop changes (for example after loading JSON), sync visibility
  // Prefer persisted visibility; otherwise derive defaults and persist them.
  useEffect(() => {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('presentaciones.visibility') : null
      if (raw) {
        const parsed = JSON.parse(raw)
        // defer setState to avoid synchronous setState inside effect (prevents cascading renders)
        setTimeout(() => setVisibility({ images: parsed?.images || {}, videos: parsed?.videos || {}, web: parsed?.web || {} }), 0)
        return
      }
    } catch { /* ignore */ }

    // derive and persist a single visibility object to avoid cascading setState calls
    try {
      const images: Record<number, boolean> = {}
      const videos: Record<number, boolean> = {}
      const web: Record<number, boolean> = {}
      ;(slides ?? []).forEach((sl: Slide, idx: number) => {
        images[idx] = !!(sl.images && sl.images.length > 0)
        videos[idx] = !!(sl.videos && sl.videos.length > 0)
        web[idx] = !!(sl.web && sl.web.length > 0)
      })
  const next = { images, videos, web }
  // defer setState to avoid synchronous setState inside effect (prevents cascading renders)
  setTimeout(() => setVisibility(next), 0)
  try { localStorage.setItem('presentaciones.visibility', JSON.stringify(next)) } catch { /* ignore */ }
    } catch { /* ignore */ }
  }, [slides])

  // note: visibility maps default to empty (all false). They remain local UI state and do not mutate slide data.

  // This component is controlled: `slides` comes from props. Edits call onChange.

  function updateSlide(idx: number, changes: Partial<Slide>) {
    const base = slides || []
    const copy = base.slice()
    copy[idx] = { ...copy[idx], ...changes }
    onChange?.(copy)
  }

  return (
    <>
    <div className="space-y-4">
  {(slides ?? []).map((s, i) => (
        <div key={i} className="border rounded p-3">
          <input value={s.title} onChange={e => updateSlide(i, { title: e.target.value })} className="w-full font-semibold text-lg p-1 mb-2" />
          <textarea value={s.content} onChange={e => updateSlide(i, { content: e.target.value })} className="w-full p-2 h-24" />
          <div className="mt-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600">Imágenes</div>
                {/* Include checkbox: when checked, images are shown (default: unchecked) */}
                <label className="inline-flex items-center text-sm text-gray-600">
                  <input type="checkbox" className="mr-2" checked={!!visibility.images[i]} onChange={e => {
                    const next = { ...visibility, images: { ...(visibility.images || {}), [i]: e.target.checked } }
                    setVisibility(next)
                    try { localStorage.setItem('presentaciones.visibility', JSON.stringify(next)) } catch (err) { console.warn('No se pudo persistir visibilidad', err) }
                  }} />
                  Incluir imágenes
                </label>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600 mr-2">Posición imagen:</div>
                <div className="inline-flex rounded bg-gray-100 p-1">
                  <button onClick={() => updateSlide(i, { imagesPosition: undefined })} className={`px-2 py-1 text-sm ${!s?.imagesPosition ? 'bg-blue-600 text-white rounded' : 'text-gray-700'}`}>Por defecto</button>
                  <button onClick={() => updateSlide(i, { imagesPosition: 'left' })} className={`px-2 py-1 text-sm ${s?.imagesPosition === 'left' ? 'bg-blue-600 text-white rounded' : 'text-gray-700'}`}>Izquierda</button>
                  <button onClick={() => updateSlide(i, { imagesPosition: 'right' })} className={`px-2 py-1 text-sm ${s?.imagesPosition === 'right' ? 'bg-blue-600 text-white rounded' : 'text-gray-700'}`}>Derecha</button>
                </div>
              </div>
              <button onClick={() => {
                const base = slides || []
                const copy = base.slice()
                const arr = copy[i].images ? [...copy[i].images] : []
                arr.push('')
                copy[i] = { ...copy[i], images: arr }
                onChange?.(copy)
              }} className="px-2 py-1 text-xs bg-gray-100 rounded">Agregar imagen</button>
            </div>

            {s.images && s.images.length > 0 ? (
              <div className="space-y-2">
                {s.images.map((img, ii) => (
                  <div key={ii} className="flex items-center gap-2">
                    <input value={img} onChange={e => {
                      const base = slides || []
                      const copy = base.slice()
                      const arr = copy[i].images ? [...copy[i].images!] : []
                      arr[ii] = e.target.value
                      copy[i] = { ...copy[i], images: arr }
                      onChange?.(copy)
                    }} className="flex-1 p-2 border rounded" />
                    <button onClick={() => {
                      const base = slides || []
                      const copy = base.slice()
                      const arr = copy[i].images ? [...copy[i].images!] : []
                      arr.splice(ii, 1)
                      copy[i] = { ...copy[i], images: arr.length ? arr : undefined }
                      onChange?.(copy)
                    }} className="px-2 py-1 bg-red-100 rounded">Eliminar</button>
                  </div>
                ))}

                {visibility.images[i] ? (
                  <div className="grid grid-cols-2 gap-2">
                    {s.images.map((src, ii) => (
                      <img key={ii} src={src || undefined} alt={`slide-${i}-img-${ii}`} className="w-full h-32 object-cover rounded" />
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Imágenes disponibles (ocultas). Marca "Incluir imágenes" para verlas.</div>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-500">No hay imágenes. Usa "Agregar imagen" para añadir una URL.</div>
            )}
          </div>
          {/* Videos section */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600">Videos (YouTube)</div>
                <label className="inline-flex items-center text-sm text-gray-600">
                  <input type="checkbox" className="mr-2" checked={!!visibility.videos[i]} onChange={e => {
                    const next = { ...visibility, videos: { ...(visibility.videos || {}), [i]: e.target.checked } }
                    setVisibility(next)
                    try { localStorage.setItem('presentaciones.visibility', JSON.stringify(next)) } catch (err) { console.warn('No se pudo persistir visibilidad', err) }
                  }} />
                  Incluir videos
                </label>
              </div>
              <button onClick={() => {
                const base = slides || []
                const copy = base.slice()
                const arr = copy[i].videos ? [...copy[i].videos] : []
                arr.push('')
                copy[i] = { ...copy[i], videos: arr }
                onChange?.(copy)
              }} className="px-2 py-1 text-xs bg-gray-100 rounded">Agregar video</button>
            </div>

                {s.videos && s.videos.length > 0 ? (
              <div className="space-y-2">
                {s.videos.map((vid, ii) => (
                  <div key={ii} className="flex items-center gap-2">
                    <input value={vid} onChange={e => {
                      const base = slides || []
                      const copy = base.slice()
                      const arr = copy[i].videos ? [...copy[i].videos!] : []
                      arr[ii] = e.target.value
                      copy[i] = { ...copy[i], videos: arr }
                      onChange?.(copy)
                    }} className="flex-1 p-2 border rounded" />
                    <button onClick={() => {
                      const base = slides || []
                      const copy = base.slice()
                      const arr = copy[i].videos ? [...copy[i].videos!] : []
                      arr.splice(ii, 1)
                      copy[i] = { ...copy[i], videos: arr.length ? arr : undefined }
                      onChange?.(copy)
                    }} className="px-2 py-1 bg-red-100 rounded">Eliminar</button>
                  </div>
                ))}

                {visibility.videos[i] ? (
                  <div className="grid grid-cols-1 gap-2">
                    {s.videos.map((src, ii) => {
                      const thumb = getYouTubeThumbnail(src)
                      return (
                        <div key={ii} className="w-full bg-black rounded overflow-hidden">
                          {src ? (
                            <div className="space-y-1">
                              <div className="w-full h-40">
                                <iframe className="w-full h-full" src={toYouTubeEmbed(src)} title={`video-${i}-${ii}`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
                              </div>
                              <div className="flex items-center gap-2 p-2 bg-gray-900 text-white">
                                {thumb ? <img src={thumb} alt="thumb" className="w-24 h-14 object-cover rounded" /> : null}
                                <a href={src.startsWith('http') ? src : `https://${src}`} target="_blank" rel="noreferrer" className="text-sm underline">Abrir en YouTube</a>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-40 text-white text-sm">URL de YouTube vacía</div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Videos disponibles (ocultos). Marca "Incluir videos" para verlos.</div>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-500">No hay videos. Usa "Agregar video" para añadir una URL de YouTube.</div>
            )}
          </div>
          {/* Web sites section */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600">Sitios web</div>
                <label className="inline-flex items-center text-sm text-gray-600">
                  <input type="checkbox" className="mr-2" checked={!!visibility.web[i]} onChange={e => {
                    const next = { ...visibility, web: { ...(visibility.web || {}), [i]: e.target.checked } }
                    setVisibility(next)
                    try { localStorage.setItem('presentaciones.visibility', JSON.stringify(next)) } catch (err) { console.warn('No se pudo persistir visibilidad', err) }
                  }} />
                  Incluir sitios
                </label>
              </div>
              <button onClick={() => {
                const base = slides || []
                const copy = base.slice()
                const arr = copy[i].web ? [...copy[i].web] : []
                arr.push('')
                copy[i] = { ...copy[i], web: arr }
                onChange?.(copy)
              }} className="px-2 py-1 text-xs bg-gray-100 rounded">Agregar sitio</button>
            </div>

            {s.web && s.web.length > 0 ? (
              <div className="space-y-2">
                {s.web.map((w, wi) => (
                  <div key={wi} className="flex items-center gap-2">
                    <input value={w} onChange={e => {
                      const base = slides || []
                      const copy = base.slice()
                      const arr = copy[i].web ? [...copy[i].web!] : []
                      arr[wi] = e.target.value
                      copy[i] = { ...copy[i], web: arr }
                      onChange?.(copy)
                    }} className="flex-1 p-2 border rounded" />
                    <button onClick={() => {
                      const base = slides || []
                      const copy = base.slice()
                      const arr = copy[i].web ? [...copy[i].web!] : []
                      arr.splice(wi, 1)
                      copy[i] = { ...copy[i], web: arr.length ? arr : undefined }
                      onChange?.(copy)
                    }} className="px-2 py-1 bg-red-100 rounded">Eliminar</button>
                  </div>
                ))}

                {visibility.web[i] ? (
                  <div className="space-y-2">
                    {s.web.map((src, wi) => {
                      const safeUrl = src ? (src.startsWith('http') ? src : `https://${src}`) : ''
                      let hostname = ''
                      try { hostname = safeUrl ? new URL(safeUrl).hostname : '' } catch { hostname = safeUrl }
                      return (
                        <div key={wi} className="w-full bg-black rounded overflow-hidden">
                          {src ? (
                            <div className="relative cursor-pointer" onClick={() => setPreviewUrl(safeUrl)}>
                              <img src={`https://s.wordpress.com/mshots/v1/${encodeURIComponent(safeUrl)}?w=800`} alt={safeUrl} className="w-full h-40 object-cover" />
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="bg-white/90 rounded-full p-2">
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 p-2 bg-gray-900 text-white">
                                <img src={`https://s2.googleusercontent.com/s2/favicons?domain=${encodeURIComponent(hostname)}`} alt="favicon" className="w-6 h-6 rounded" />
                                <a href={safeUrl} target="_blank" rel="noreferrer" className="text-sm truncate">{safeUrl}</a>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-40 text-white text-sm">URL vacía</div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Sitios disponibles (ocultos). Marca "Incluir sitios" para verlos.</div>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-500">No hay sitios. Usa "Agregar sitio" para añadir una URL del sitio.</div>
            )}
          </div>
        </div>
      ))}
    </div>
    {previewUrl ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60" onClick={() => setPreviewUrl(null)} />
        <div className="relative w-11/12 md:w-3/4 h-4/5 bg-white rounded shadow-lg overflow-hidden z-10">
          <div className="flex items-center justify-between p-2 border-b">
            <div className="text-sm font-medium">Vista previa del sitio</div>
            <div className="flex items-center gap-2">
              <a href={previewUrl} target="_blank" rel="noreferrer" className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Abrir en pestaña</a>
              <button onClick={() => setPreviewUrl(null)} className="px-3 py-1 bg-gray-200 rounded">Cerrar</button>
            </div>
          </div>
          <div className="h-full">
            <iframe src={previewUrl || undefined} title="preview-frame" className="w-full h-full" frameBorder="0" />
          </div>
        </div>
      </div>
    ) : null}
    </>
  )
}

// keep visibility in sync with slides prop: when slides change (for example after loading JSON),
// ensure visibility entries exist for indices that contain media
// Note: we place effect after component definition to avoid linting/ordering issues


