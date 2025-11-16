import { useMemo, useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Fab from '@mui/material/Fab'
import Tooltip from '@mui/material/Tooltip'
import CircularProgress from '@mui/material/CircularProgress'
import SlideViewClassic from '../components/preview/SlideViewClassic'
import { tokenizeTextWithCode, type CodeSegment, type TextSegment } from '../services/code'
import type { Slide } from '../services/grok'
import { jsPDF as JsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

type Presentation = { metadata?: { subject?: string; teacher?: string; logo?: string; unit?: string }; slides?: Slide[] }

export default function PreviewPage() {
  // read slides wrapper from localStorage
  const slidesWrapper = useMemo(() => {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('presentaciones.slides') : null
      if (!raw) return null
      const parsed = JSON.parse(raw) as Presentation
      return parsed
    } catch {
      return null
    }
  }, [])

  const pres = slidesWrapper || undefined
  const slides = useMemo(() => (pres?.slides || []) as Slide[], [pres])
  const metadata = pres?.metadata

  // Estimate maximum content height (px) across slides before rendering preview.
  const estimatedMaxHeight = useMemo(() => {
    if (!slides || slides.length === 0) return undefined
    const avgCharsPerLine = 60
    const lineHeight = 20 // px
    const imageMediaHeight = 208 // px (lg:h-52 tailwind ~13rem = 208px)
    const base = 220 // title + paddings + header/footer estimate

    const estimateFor = (s: Slide) => {
      // Build a plain-text approximation excluding Python code blocks (they are shown in modal)
      let plain = ''
      if (s.title) plain += s.title + ' '
      const segs = tokenizeTextWithCode(s.content)
      for (const seg of segs) {
        if (seg.type === 'code') {
          const cseg = seg as CodeSegment
          const langLower = String(cseg.lang || '').toLowerCase()
          if (langLower.startsWith('py')) {
            // ignore Python code entirely for height estimation
            continue
          }
          const codeText = String(cseg.code || '')
          const codePreview = codeText.split('\n').slice(0, 5).join(' ')
          plain += ' ' + codePreview
        } else {
          const tseg = seg as TextSegment
          const html = tseg.html || ''
          const stripped = String(html).replace(/<[^>]+>/g, ' ')
          plain += ' ' + stripped
        }
      }

      const text = plain.trim()
      const textLines = Math.max(1, Math.ceil(text.length / avgCharsPerLine))
      const textHeight = textLines * lineHeight
      let mediaHeight = 0
      if (s.images && s.images.length > 0) {
        mediaHeight = imageMediaHeight
        if (s.images.length > 1) mediaHeight += Math.floor(imageMediaHeight * 0.35)
      }
      if (s.videos && s.videos.length > 0) {
        mediaHeight = Math.max(mediaHeight, imageMediaHeight)
        if (s.videos.length > 1) mediaHeight += Math.floor(imageMediaHeight * 0.35)
      }
      return base + textHeight + mediaHeight
    }

    let max = 0
    for (const s of slides) {
      const h = estimateFor(s)
      if (h > max) max = h
    }
    return Math.ceil(max + 40)
  }, [slides])

  const [index, setIndex] = useState(0)
  const exportRef = useRef<HTMLDivElement | null>(null)
  const [exporting, setExporting] = useState(false)
  const thumbsRef = useRef<HTMLDivElement | null>(null)
  const [cardWidth, setCardWidth] = useState<number | null>(null)
  const [fontSizePx, setFontSizePx] = useState<number | null>(null)
  const slideBoxRef = useRef<HTMLDivElement | null>(null)


  // default visibility: show all media
  const visibility = useMemo(() => {
    const images: Record<number, boolean> = {}
    const videos: Record<number, boolean> = {}
    const web: Record<number, boolean> = {}
    slides.forEach((_, i) => {
      images[i] = true
      videos[i] = true
      web[i] = true
    })
    return { images, videos, web }
  }, [slides])

  useEffect(() => {
    function compute() {
      const visible = Math.min(5, slides.length || 1)
      const parent = slideBoxRef.current
      const parentWidth = parent ? parent.clientWidth : Math.min(1024, window.innerWidth - 40)
      const w = Math.floor(parentWidth / visible)
      setCardWidth(w)
      const f = Math.max(11, Math.min(18, Math.floor(w * 0.12)))
      setFontSizePx(f)
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [slides.length])

  const trackTranslate = useMemo(() => {
    if (!cardWidth) return '0px'
    const visible = Math.min(5, slides.length)
    const totalWidth = slides.length * cardWidth
    const viewportWidth = visible * cardWidth
    const centerOffset = (index - (visible - 1) / 2) * cardWidth
    const maxOffset = Math.max(0, totalWidth - viewportWidth)
    const clamped = Math.max(0, Math.min(centerOffset, maxOffset))
    return `${clamped}px`
  }, [index, cardWidth, slides.length])

  const [isMobile, setIsMobile] = useState<boolean>(false)
  const mobileScale = 0.92
  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth < 640)
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  if (!pres) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-2">No hay datos de vista previa</h2>
        <p className="text-gray-600 mb-4">Guarda o importa una presentación en el generador y luego pulsa "Vista Previa".</p>
        <Link to="/generador" className="text-blue-600 underline">Volver al generador</Link>
      </div>
    )
  }

  return (
    <>
      <div className="px-0 sm:px-6">
        {!isMobile && (
          <div className="flex items-center justify-end gap-2 mb-3">
            <Tooltip title={exporting ? 'Generando PDF...' : 'Descargar en PDF'}>
              <span>
                <Fab
                  onClick={async () => {
                    if (!exportRef.current) return
                    setExporting(true)
                    const doc = new JsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
                    const pdfWidth = doc.internal.pageSize.getWidth()
                    const pdfHeight = doc.internal.pageSize.getHeight()

                    const nodes = Array.from(exportRef.current.children) as HTMLElement[]
                    for (let i = 0; i < nodes.length; i++) {
                      const node = nodes[i]
                      const originalWidth = node.style.width
                      node.style.width = '1024px'

                      const nodeRect = node.getBoundingClientRect()
                      const nodeWidthPx = nodeRect.width || 1024
                      const nodeHeightPx = nodeRect.height || nodeWidthPx * 0.75
                      const videoEls = Array.from(node.querySelectorAll('[data-video-url]')) as HTMLElement[]
                      const videosInfo = videoEls.map((el) => {
                        const r = el.getBoundingClientRect()
                        return {
                          url: el.getAttribute('data-video-url') || undefined,
                          left: r.left - nodeRect.left,
                          top: r.top - nodeRect.top,
                          width: r.width,
                          height: r.height,
                        }
                      })

                      const canvas = await html2canvas(node, { scale: 2, useCORS: true })
                      node.style.width = originalWidth

                      const imgData = canvas.toDataURL('image/jpeg', 0.95)
                      const imgProps = doc.getImageProperties(imgData) as { width: number; height: number }
                      let imgWidth = pdfWidth
                      let imgHeight = (imgProps.height * pdfWidth) / imgProps.width
                      const margin = 10
                      if (imgHeight > pdfHeight - margin * 2) {
                        imgHeight = pdfHeight - margin * 2
                        imgWidth = (imgProps.width * imgHeight) / imgProps.height
                      }

                      const x = (pdfWidth - imgWidth) / 2
                      const y = margin
                      if (i > 0) doc.addPage()
                      doc.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight)

                      if (videosInfo.length > 0) {
                        const scaleX = imgWidth / nodeWidthPx
                        const scaleY = imgHeight / nodeHeightPx

                        videosInfo.forEach((vInfo) => {
                          if (!vInfo.url) return
                          const linkX = x + vInfo.left * scaleX
                          const linkY = y + vInfo.top * scaleY
                          const linkW = vInfo.width * scaleX
                          const linkH = vInfo.height * scaleY
                          try {
                            doc.link(linkX, linkY, linkW, linkH, { url: vInfo.url })
                          } catch (e) {
                            console.error('Error adding link to PDF:', e)
                            doc.setTextColor(0, 0, 255)
                            const txtY = y + imgHeight + 5
                            doc.text(vInfo.url, x + 5, txtY)
                          }
                        })
                      }
                    }

                    doc.save(`presentacion-preview.pdf`)
                    setExporting(false)
                  }}
                  size="medium"
                  disabled={exporting}
                  sx={{
                    background: 'linear-gradient(135deg,#e11d48 0%,#ef4444 100%)',
                    color: '#fff',
                    boxShadow: '0 6px 18px rgba(239,68,68,0.25)',
                  }}
                  aria-label="Descargar en PDF"
                >
                  {exporting ? (
                    <CircularProgress size={20} sx={{ color: '#fff' }} />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <path d="M14 2v6h6" />
                      <text x="7" y="16" fill="#fff" fontSize="6" fontWeight="700">PDF</text>
                    </svg>
                  )}
                </Fab>
              </span>
            </Tooltip>
          </div>
        )}

        <div className="mb-4 text-center"></div>

        <div className="relative">
          {/* Floating nav buttons (icon-only) positioned relative to the slide box */}
          <Tooltip title={index === 0 ? 'Inicio' : 'Anterior'}>
            <Fab
              aria-label="Anterior"
              onClick={() => setIndex((s) => Math.max(0, s - 1))}
              size="medium"
              disabled={index === 0}
              sx={{
                position: { xs: 'fixed', md: 'absolute' },
                left: { xs: 12, md: -12 },
                top: { xs: '50%', md: '50%' },
                transform: 'translateY(-50%)',
                zIndex: 1200,
                background: 'linear-gradient(135deg,#4f46e5 0%,#06b6d4 100%)',
                color: '#fff',
                boxShadow: index === 0 ? 'none' : '0 6px 18px rgba(79,70,229,0.35)',
                width: { xs: 32, md: 44 },
                height: { xs: 32, md: 44 },
                opacity: index === 0 ? 0.5 : 1,
                cursor: index === 0 ? 'not-allowed' : 'pointer',
                '&:hover': index === 0 ? {} : { boxShadow: '0 8px 22px rgba(6,182,212,0.25)', transform: 'translateY(-50%) scale(1.03)' },
                borderRadius: '9999px',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </Fab>
          </Tooltip>

          <Tooltip title={index === slides.length - 1 ? 'Fin' : 'Siguiente'}>
            <Fab
              aria-label="Siguiente"
              onClick={() => setIndex((s) => Math.min(slides.length - 1, s + 1))}
              size="medium"
              disabled={index === slides.length - 1}
              sx={{
                position: { xs: 'fixed', md: 'absolute' },
                right: { xs: 12, md: -12 },
                top: { xs: '50%', md: '50%' },
                transform: 'translateY(-50%)',
                zIndex: 1200,
                background: 'linear-gradient(135deg,#ef4444 0%,#f97316 100%)',
                color: '#fff',
                boxShadow: index === slides.length - 1 ? 'none' : '0 6px 18px rgba(244,63,94,0.35)',
                width: { xs: 32, md: 44 },
                height: { xs: 32, md: 44 },
                opacity: index === slides.length - 1 ? 0.5 : 1,
                cursor: index === slides.length - 1 ? 'not-allowed' : 'pointer',
                '&:hover': index === slides.length - 1 ? {} : { boxShadow: '0 8px 22px rgba(249,115,22,0.25)', transform: 'translateY(-50%) scale(1.03)' },
                borderRadius: '9999px',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Fab>
          </Tooltip>

          <div ref={slideBoxRef} className="relative w-full sm:max-w-3xl sm:mx-auto px-0">
            <div
              style={
                isMobile
                  ? { transform: `scale(${mobileScale})`, transformOrigin: 'top center', width: `${100 / mobileScale}%` }
                  : undefined
              }
            >
              <SlideViewClassic isMobile={isMobile} slide={slides[index]} index={index} metadata={metadata} visibility={visibility} totalSlides={slides.length} contentHeight={estimatedMaxHeight} />
            </div>
          </div>
        </div>

        <div ref={exportRef} style={{ position: 'absolute', left: -9999, top: 0, width: 1024 }} aria-hidden>
          {slides.map((s, i) => (
            <div key={`pdf-${i}`} style={{ width: '1024px', padding: '24px', boxSizing: 'border-box', background: '#f8fafc' }}>
              <SlideViewClassic isMobile={false} slide={s} index={i} metadata={metadata} visibility={visibility} totalSlides={slides.length} contentHeight={estimatedMaxHeight} />
            </div>
          ))}
        </div>

        {(!isMobile && slides.length > 1) ? (
          <div className="mt-4 px-2 sm:px-0 flex justify-center">
            <div className="overflow-hidden" style={{ width: cardWidth ? `${cardWidth * Math.min(5, slides.length)}px` : undefined }}>
              <div
                ref={thumbsRef}
                className="flex"
                style={{ width: cardWidth ? `${cardWidth * slides.length}px` : undefined, transform: cardWidth ? `translateX(-${trackTranslate})` : undefined, transition: 'transform 320ms ease' }}
              >
                {slides.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`flex-shrink-0 p-2 border rounded text-center transition-all ${i === index ? 'scale-105' : ''}`}
                    style={{ width: cardWidth ? `${cardWidth}px` : undefined, background: i === index ? '#fff8dc' : undefined }}
                    aria-current={i === index}
                    title={s.title}
                  >
                    <div className={`font-semibold leading-tight break-words`} style={{ fontSize: fontSizePx ? `${fontSizePx}px` : undefined, color: i === index ? '#111827' : undefined }}>{s.title}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {isMobile && slides.length > 0 ? (
          <Fab aria-label="Página" sx={{ position: 'fixed', right: { xs: 12 }, bottom: { xs: 12 }, zIndex: 1300, background: 'linear-gradient(135deg,#06b6d4 0%,#6366f1 100%)', boxShadow: '0 6px 18px rgba(99,102,241,0.22)', width: 40, height: 40, padding: 0, borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1, userSelect: 'none' }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: 'rgba(255,255,255,0.98)', lineHeight: 1 }}>{index + 1}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', lineHeight: 1, marginTop: 2 }}>{slides.length}</div>
            </div>
          </Fab>
        ) : null}
      </div>
    </>
  )
}
