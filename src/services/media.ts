// Utilities to normalize media URLs (YouTube embed etc.)

export function toYouTubeEmbed(url?: string): string {
  if (!url) return ''
  try {
    const u = url.trim()
    // If already embed, ensure https
    if (u.includes('youtube.com/embed/')) {
      return ensureHttps(u)
    }
    // match youtu.be short links
  const m = u.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/) || u.match(/[?&]v=([A-Za-z0-9_-]{6,})/)
  const id = m ? m[1] : null
    if (id) return `https://www.youtube.com/embed/${id}`
    // fallback: try to parse URL and extract last path segment
    try {
      const parsed = new URL(u.startsWith('http') ? u : `https://${u}`)
      const parts = parsed.pathname.split('/').filter(Boolean)
      const maybe = parts[parts.length - 1]
      if (maybe && maybe.length >= 6) return `https://www.youtube.com/embed/${maybe}`
    } catch {
      // ignore
    }
    return ensureHttps(u)
  } catch {
    return url || ''
  }
}

function ensureHttps(s: string) {
  if (s.startsWith('http://')) return s.replace('http://', 'https://')
  if (!s.startsWith('http')) return `https://${s}`
  return s
}

export default { toYouTubeEmbed }

export function getYouTubeId(url?: string): string | null {
  if (!url) return null
  const u = url.trim()
  const m1 = u.match(/(?:youtube\.com\/watch\?v=|[?&]v=)([A-Za-z0-9_-]{6,})/)
  const m2 = u.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/)
  const m3 = u.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/)
  return (m1 && m1[1]) || (m2 && m2[1]) || (m3 && m3[1]) || null
}

export function getYouTubeThumbnail(url?: string): string | null {
  const id = getYouTubeId(url)
  if (!id) return null
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`
}
