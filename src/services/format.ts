// Servicio para convertir marcadores inline simples a HTML seguro
// Reglas soportadas:
// - **texto** -> <strong>texto</strong>
// - *texto*    -> <em>texto</em>
// - __texto__  -> <u>texto</u>
// El servicio escapa HTML y conserva saltos de línea como <br/>

function escapeHtml(str: string) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Aplica formato inline sobre texto ya escapado. El orden importa: primero negrita, luego subrayado, luego cursiva.
export function formatInlineToHtml(input: string | undefined): string {
  if (!input) return ''
  // Escape inicial para evitar inyección
  let s = escapeHtml(String(input))

  // Normalize CRLF
  s = s.replace(/\r\n/g, '\n')

  // Bold: **text**
  s = s.replace(/\*\*([\s\S]+?)\*\*/g, (_m, p1) => `<strong>${p1}</strong>`)

  // Underline: __text__
  s = s.replace(/__([\s\S]+?)__/g, (_m, p1) => `<u>${p1}</u>`)

  // Italic: *text* (avoid matching already replaced **)
  s = s.replace(/\*([\s\S]+?)\*/g, (_m, p1) => `<em>${p1}</em>`)

  // Convert newlines to <br/>
  s = s.replace(/\n/g, '<br/>')

  return s
}

export default { formatInlineToHtml }
