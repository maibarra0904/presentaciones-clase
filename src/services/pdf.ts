export function isPdfUrl(url?: string | null): boolean {
  if (!url) return false
  try {
    // strip query/hash when checking extension
    const u = url.split('?')[0].split('#')[0]
    return u.toLowerCase().endsWith('.pdf')
  } catch {
    return false
  }
}

/**
 * Returns an embed-friendly URL for an iframe. We prefer the original URL
 * (many servers serve PDFs directly) but caller can fallback to opening
 * in a new tab if embedding is blocked by X-Frame-Options/CSP.
 */
export function toPdfEmbedUrl(url: string): string {
  return url
}
