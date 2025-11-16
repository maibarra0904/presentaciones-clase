import { renderToString } from 'katex'
import { formatInlineToHtml } from './format'

// Renderiza el texto mezclado con LaTeX ($...$ inline, $$...$$ display)
// Ahora aplica también formato inline (negrita, cursiva, subrayado) sobre los fragmentos de texto no-math.
export function renderTextWithMath(input: string | undefined): string {
  if (!input) return ''
  const text = String(input)
  const parts: string[] = []
  let lastIndex = 0
  const re = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    const idx = m.index
    // push formatted text before match (formatting + escaping + <br/>)
    const before = text.slice(lastIndex, idx)
    parts.push(formatInlineToHtml(before))

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
      parts.push(formatInlineToHtml(isDisplay ? `$$${mathText}$$` : `$${mathText}$`))
      parts.push('&nbsp;&nbsp;&nbsp;')
    }
    lastIndex = idx + m[0].length
  }
  // trailing text
  const tail = text.slice(lastIndex)
  parts.push(formatInlineToHtml(tail))
  return parts.join('')
}

// simple detector
export function containsLatex(input: string | undefined): boolean {
  if (!input) return false
  return /\$\$[\s\S]+?\$\$|\$[^$\n]+?\$/.test(input)
}

// Tokenize input into text/math segments. Text segments contain formatted HTML produced by formatInlineToHtml
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
    if (before) segments.push({ type: 'text', html: formatInlineToHtml(before) })

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
      segments.push({ type: 'text', html: formatInlineToHtml(isDisplay ? `$$${mathText}$$` : `$${mathText}$`) })
      segments.push({ type: 'text', html: '&nbsp;&nbsp;&nbsp;' })
    }

    lastIndex = idx + m[0].length
  }
  const tail = text.slice(lastIndex)
  if (tail) segments.push({ type: 'text', html: formatInlineToHtml(tail) })
  return segments
}
