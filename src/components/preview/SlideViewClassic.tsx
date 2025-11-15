import { useState } from 'react'
import 'katex/dist/katex.min.css'
import type { Slide } from '../../services/grok'
import { toYouTubeEmbed, getYouTubeThumbnail } from '../../services/media'
import { tokenizeTextWithMath } from '../../services/latex'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'

type Meta = { subject?: string; teacher?: string; logo?: string; unit?: string }

type Visibility = { images: Record<number, boolean>; videos: Record<number, boolean> }

type Props = { slide: Slide; index: number; metadata?: Meta; visibility?: Visibility; totalSlides?: number; contentHeight?: number; isMobile?: boolean }

export default function SlideViewClassic({ slide, index, metadata, visibility, totalSlides, contentHeight, isMobile = false }: Props) {
  const [openVideo, setOpenVideo] = useState<string | null>(null)

  // determine if slide is text-only (no visible images or videos)
  const hasVisibleImages = !!(slide.images && slide.images.length > 0 && visibility?.images?.[index])
  const hasVisibleVideos = !!(slide.videos && slide.videos.length > 0 && visibility?.videos?.[index])
  const isTextOnly = !hasVisibleImages && !hasVisibleVideos

  // cover slide: first slide is carátula
  if (index === 0) {
    // Cover: keep same header/footer structure but without texts so heights match other slides
    return (
      <div className={`w-full ${isMobile ? '' : 'max-w-3xl mx-auto'} rounded-lg mb-6 overflow-hidden shadow-xl`} style={{ background: 'linear-gradient(135deg, rgba(246,249,255,1) 0%, rgba(240,248,255,1) 100%)' }}>
        <div className="p-6 md:p-8">
          {/* Header placeholders to preserve spacing */}
          <div className={isMobile ? 'flex flex-col items-start gap-1 mb-4' : 'flex items-center justify-between mb-4'} aria-hidden>
            {/* On mobile we hide the small header placeholders and will render subject/unit in the main area for the cover */}
            <div className={isMobile ? 'text-base font-semibold text-blue-700' : 'text-sm text-blue-700 font-medium'}>{''}</div>
            <div className={isMobile ? 'text-sm text-gray-700 font-medium' : 'text-center text-sm text-gray-700 font-medium'}>{''}</div>
            {!isMobile ? <div>{/* keep space for logo slot */}</div> : null}
          </div>

          <div
            className={`bg-white/70 backdrop-blur-sm rounded-lg ${isMobile ? 'p-4' : 'p-6 md:px-12 md:py-12'} shadow-inner text-center flex flex-col items-center justify-center`}
            style={contentHeight ? { minHeight: `${contentHeight}px` } : undefined}
          >
            {/* Carátula content: on mobile hide logo and teacher and show subject/unit stacked for readability */}
            {!isMobile && metadata?.logo ? (
              <img src={metadata.logo} alt="logo" className="mx-auto w-40 h-40 md:w-48 md:h-48 object-contain mb-6" />
            ) : null}
            {metadata?.subject ? (
              <div className={`${isMobile ? 'text-3xl text-center' : 'text-4xl md:text-5xl'} font-extrabold mb-3 text-slate-800 leading-tight`}>{metadata.subject}</div>
            ) : null}
            {metadata?.unit ? (
              <div className={`${isMobile ? 'text-xl text-center' : 'text-2xl md:text-3xl'} text-gray-700 mb-3`}>{metadata.unit}</div>
            ) : null}
            {/* hide teacher on mobile as requested */}
            {!isMobile && metadata?.teacher ? (
              <div className={`${isMobile ? 'text-sm' : 'text-lg md:text-xl'} text-gray-600`}>{`Docente: ${metadata.teacher}`}</div>
            ) : null}
          </div>

          {/* Footer placeholders to preserve spacing */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">{''}</div>
              {/* hide inline page counter on mobile; presentation page will render a floating bubble instead */}
              {!isMobile ? (
                <div className="text-sm text-gray-600">{index + 1}{typeof totalSlides === 'number' ? `/${totalSlides}` : ''}</div>
              ) : <div />}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full ${isMobile ? '' : 'max-w-3xl mx-auto'} rounded-lg mb-6 overflow-hidden shadow-xl`} style={{ background: 'linear-gradient(135deg, rgba(246,249,255,1) 0%, rgba(240,248,255,1) 100%)' }}>
      <div className={isMobile ? 'p-4' : 'p-6 md:p-8'}>
        <div className={isMobile ? 'flex flex-col items-start gap-1 mb-4' : 'flex items-center justify-between mb-4'}>
          <div className={isMobile ? 'text-base font-semibold text-blue-700' : 'text-sm text-blue-700 font-medium'}>{metadata?.subject}</div>
          <div className={isMobile ? 'text-sm text-gray-700 font-medium' : 'text-center text-sm text-gray-700 font-medium'}>{metadata?.unit}</div>
          {isMobile && metadata?.teacher ? (
            <div className="text-sm text-gray-600">{`Docente: ${metadata.teacher}`}</div>
          ) : null}
          {!isMobile ? <div>{metadata?.logo ? <img src={metadata.logo} alt="logo" className="w-10 h-10 object-contain rounded" /> : null}</div> : null}
        </div>

  <div className={`bg-white/70 backdrop-blur-sm rounded-lg ${isMobile ? 'p-4' : 'p-6'} shadow-inner ${isTextOnly ? 'flex flex-col items-center justify-center text-center' : ''}`} style={contentHeight ? { minHeight: `${contentHeight}px` } : undefined}>
    {/* Title stays centered always; increase size when slide is text-only to reduce empty space */}
    <h2 className={`${isTextOnly ? (isMobile ? 'text-2xl' : 'text-3xl') + ' md:text-4xl' : (isMobile ? 'text-xl' : 'text-2xl') + ' md:text-3xl'} font-extrabold mb-4 text-center text-slate-800`}>{slide.title}</h2>

    {/* If there are images and the visibility flag is true and position is left/right, render side-by-side on md+; else render content then images below centered */}
          {slide.images && slide.images.length > 0 && (visibility?.images?.[index]) && (slide.imagesPosition === 'left' || slide.imagesPosition === 'right') ? (
            <div className={`flex flex-col md:flex-row items-start gap-6`}> 
              {slide.imagesPosition === 'left' ? (
                <div className="md:w-1/3 flex flex-col gap-3">
                  {slide.images.map((src, i) => (
                    <div key={i} className="w-full rounded overflow-hidden bg-gray-50 flex items-center justify-center">
                      <div className="w-full h-36 md:h-44 lg:h-52">
                        <img src={src} alt={`img-${i}`} className="w-full h-full object-contain" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="md:flex-1">
                <div className={`${isTextOnly ? (isMobile ? 'text-sm' : 'text-lg') + ' md:text-xl' : 'text-slate-600'} leading-relaxed`}>
                  {tokenizeTextWithMath(slide.content).map((seg, i) => (
                    seg.type === 'text' ? (
                      <span key={i} dangerouslySetInnerHTML={{ __html: seg.html }} />
                    ) : (
                      <span key={i} className={seg.display ? 'katex-display' : 'katex-inline'} dangerouslySetInnerHTML={{ __html: seg.html }} />
                    )
                  ))}
                </div>
              </div>

              {slide.imagesPosition === 'right' ? (
                <div className="md:w-1/3 flex flex-col gap-3">
                  {slide.images.map((src, i) => (
                    <div key={i} className="w-full rounded overflow-hidden bg-gray-50 flex items-center justify-center">
                      <div className="w-full h-36 md:h-44 lg:h-52">
                        <img src={src} alt={`img-${i}`} className="w-full h-full object-contain" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <div>
              <div className={`${isTextOnly ? (isMobile ? 'text-sm' : 'text-lg') + ' md:text-xl' : 'text-slate-600'} leading-relaxed`}>
                {tokenizeTextWithMath(slide.content).map((seg, i) => (
                  seg.type === 'text' ? (
                    <span key={i} dangerouslySetInnerHTML={{ __html: seg.html }} />
                  ) : (
                    <span key={i} className={seg.display ? 'katex-display' : 'katex-inline'} dangerouslySetInnerHTML={{ __html: seg.html }} />
                  )
                ))}
              </div>
              {/* images below, centered */}
              {slide.images && slide.images.length > 0 && (visibility?.images?.[index]) && (
                <div className="mt-4 flex justify-center gap-3">
                      {slide.images.map((src, i) => (
                        <div key={i} className="w-full max-w-md rounded overflow-hidden bg-gray-50 flex items-center justify-center">
                          <div className="w-full h-36 md:h-44 lg:h-52">
                            <img src={src} alt={`img-below-${i}`} className="w-full h-full object-contain" />
                          </div>
                        </div>
                      ))}
                </div>
              )}
            </div>
          )}

          {/* Videos: render thumbnail inside the slide box (same size as images). Clicking opens modal to play */}
          {slide.videos && slide.videos.length > 0 && (visibility?.videos?.[index]) && (
            <div className="mt-4 flex justify-center">
              {slide.videos.map((v, i) => {
                const thumb = getYouTubeThumbnail(v)
                return (
                  <div key={i} className="w-full max-w-md rounded overflow-hidden">
                    <button data-video-url={v} type="button" onClick={() => setOpenVideo(toYouTubeEmbed(v) + '?autoplay=1')} className="w-full bg-black rounded overflow-hidden">
                      <div className="w-full h-36 md:h-44 lg:h-52 relative flex items-center justify-center bg-black">
                        {thumb ? (
                          <img src={thumb} alt={`thumb-${i}`} className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 w-full h-full bg-gray-900" />
                        )}
                        <div className="relative z-10 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                              <polygon points="5 3 19 12 5 21 5 3" fill="#1f2937" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        {/* Video modal */}
        <Dialog open={!!openVideo} onClose={() => setOpenVideo(null)} maxWidth="lg" fullWidth>
          <DialogContent sx={{ p: 0, backgroundColor: '#000' }}>
            <div style={{ position: 'relative', paddingTop: '56.25%' }}>
              <iframe
                src={openVideo || ''}
                title="video-player"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <IconButton onClick={() => setOpenVideo(null)} aria-label="Cerrar" sx={{ position: 'absolute', right: 8, top: 8, color: '#fff' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </IconButton>
          </DialogContent>
        </Dialog>
      {/* Footer: show page counter always; on desktop also show teacher on the left */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className={isMobile ? 'flex items-center justify-center' : 'flex items-center justify-between'}>
          {!isMobile ? (
            <div className="text-sm text-gray-600">{metadata?.teacher ? `Docente: ${metadata.teacher}` : ''}</div>
          ) : <div />}
          {/* hide inline page counter on mobile; use floating bubble in PresentationPage */}
          {!isMobile ? (
            <div className="text-sm text-gray-600">{index + 1}{typeof totalSlides === 'number' ? `/${totalSlides}` : ''}</div>
          ) : <div />}
        </div>
      </div>
    </div>
    </div>
  )
}
