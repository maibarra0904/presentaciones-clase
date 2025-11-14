import { renderToString } from 'katex'

// Escapa HTML para texto no-math
function escapeHtml(str: string) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Renderiza el texto mezclado con LaTeX ($...$ inline, $$...$$ display)
export function renderTextWithMath(input: string | undefined): string {
  if (!input) return ''
  const text = String(input)
  const parts: string[] = []
  let lastIndex = 0
  const re = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    const idx = m.index
    // push escaped text before match, converting newlines to <br>
    const before = text.slice(lastIndex, idx)
    parts.push(escapeHtml(before).replace(/\r?\n/g, '<br/>'))

    const display = m[1]
    const inline = m[2]
    const mathText = display ?? inline ?? ''
    const isDisplay = Boolean(display)
    try {
      const rendered = renderToString(mathText, { throwOnError: false, displayMode: isDisplay })
      // add 3 non-breaking spaces before and after the rendered math
      parts.push('&nbsp;&nbsp;&nbsp;')
      parts.push(rendered)
      parts.push('&nbsp;&nbsp;&nbsp;')
    } catch (e) {
      // fallback: show escaped original between delimiters
      console.error('KaTeX render error', e)
      parts.push('&nbsp;&nbsp;&nbsp;')
      parts.push(escapeHtml((isDisplay ? `$$${mathText}$$` : `$${mathText}$`)))
      parts.push('&nbsp;&nbsp;&nbsp;')
    }
    lastIndex = idx + m[0].length
  }
  // trailing text
  const tail = text.slice(lastIndex)
  parts.push(escapeHtml(tail).replace(/\r?\n/g, '<br/>'))
  return parts.join('')
}

// simple detector
export function containsLatex(input: string | undefined): boolean {
  if (!input) return false
  return /\$\$[\s\S]+?\$\$|\$[^$\n]+?\$/.test(input)
}

// Tokenize input into text/math segments. Text segments are escaped HTML with <br/>
export type Segment = { type: 'text'; html: string } | { type: 'math'; html: string; display: boolean }

export function tokenizeTextWithMath(input: string | undefined): Segment[] {
  if (!input) return [{ type: 'text', html: '' }]
  const text = String(input)
  const segments: Segment[] = []
  let lastIndex = 0
  const re = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    const idx = m.index
    const before = text.slice(lastIndex, idx)
    if (before) segments.push({ type: 'text', html: escapeHtml(before).replace(/\r?\n/g, '<br/>') })

    const display = m[1]
    const inline = m[2]
    const mathText = display ?? inline ?? ''
    const isDisplay = Boolean(display)
    try {
      const rendered = renderToString(mathText, { throwOnError: false, displayMode: isDisplay })
      // insert 3 non-breaking spaces before and after the maths segment
      segments.push({ type: 'text', html: '&nbsp;&nbsp;&nbsp;' })
      segments.push({ type: 'math', html: rendered, display: isDisplay })
      segments.push({ type: 'text', html: '&nbsp;&nbsp;&nbsp;' })
    } catch {
      segments.push({ type: 'text', html: '&nbsp;&nbsp;&nbsp;' })
      segments.push({ type: 'text', html: escapeHtml((isDisplay ? `$$${mathText}$$` : `$${mathText}$`)) })
      segments.push({ type: 'text', html: '&nbsp;&nbsp;&nbsp;' })
    }

    lastIndex = idx + m[0].length
  }
  const tail = text.slice(lastIndex)
  if (tail) segments.push({ type: 'text', html: escapeHtml(tail).replace(/\r?\n/g, '<br/>') })
  return segments
}
