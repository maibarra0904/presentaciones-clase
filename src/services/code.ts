import { tokenizeTextWithMath, type Segment as MathSegment } from './latex'

export type CodeSegment = { type: 'code'; lang?: string; code: string }
export type TextSegment = MathSegment // reuse math/text segments from latex service
export type Segment = TextSegment | CodeSegment

// detect fenced code blocks ```lang\n...``` and return mixed segments where non-code parts
// are tokenized with the existing math tokenizer so math and text still render correctly.
export function tokenizeTextWithCode(input: string | undefined): Segment[] {
  if (!input) return [{ type: 'text', html: '' }]
  const text = String(input)
  const segments: Segment[] = []
  let lastIndex = 0
  // Accept optional newline after the language token so blocks like ```js code ``` (single-line)
  // or the typical multi-line form ```js\n...\n``` are both supported.
  const re = /```(?:([a-zA-Z0-9_+-]+)\s*)?\n?([\s\S]*?)```/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    const idx = m.index
    const before = text.slice(lastIndex, idx)
    if (before) {
      // tokenize math inside before text
      const mathParts = tokenizeTextWithMath(before)
      for (const p of mathParts) segments.push(p)
    }

    const lang = m[1]
    const code = m[2] || ''
    segments.push({ type: 'code', lang: lang || undefined, code })

    lastIndex = idx + m[0].length
  }
  const tail = text.slice(lastIndex)
  if (tail) {
    const mathParts = tokenizeTextWithMath(tail)
    for (const p of mathParts) segments.push(p)
  }
  return segments
}

export function containsCode(input: string | undefined): boolean {
  if (!input) return false
  return /```[\s\S]*?```/.test(input)
}

export default { tokenizeTextWithCode, containsCode }
