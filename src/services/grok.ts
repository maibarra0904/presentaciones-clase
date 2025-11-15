// Groq service adapted from 29-guia-estudio
// Provides generateSlides(topic, slides, style, apiKey?) -> Slide[]
export type Slide = { title: string; content: string; images?: string[]; videos?: string[]; web?: string[]; imagesPosition?: 'left' | 'right' };

type GenerateParams = { topic: string; slides: number; style: 'text' | 'images' | 'advanced'; apiKey?: string };

export async function generateSlides({ topic, slides, style, apiKey }: GenerateParams): Promise<Slide[]> {
  const envAny = (import.meta as unknown) as Record<string, string | undefined>;
  const storedKey = typeof localStorage !== 'undefined' ? localStorage.getItem('groqApiKey') : null;
  const effectiveApiKey = apiKey || storedKey || envAny.VITE_API_GROQ_KEY || envAny.NEXT_PUBLIC_API_GROQ_KEY;

    const generateStub = (): Slide[] => {
    const out: Slide[] = [];
    for (let i = 1; i <= slides; i++) {
  out.push({ title: `${topic} — Diapositiva ${i}`, content: `Contenido de ejemplo para "${topic}" en la diapositiva ${i}. Puedes editar este texto más tarde.`, images: style !== 'text' ? [`https://via.placeholder.com/600x300?text=${encodeURIComponent(topic + ' ' + i)}`] : undefined, videos: undefined, web: style !== 'text' ? [`https://example.com/${encodeURIComponent(topic)}-${i}`] : undefined, imagesPosition: undefined });
    }
    return out;
  };

  if (!effectiveApiKey) {
    await new Promise((r) => setTimeout(r, 350));
    return generateStub();
  }

  const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
  const prompt = `Genera ${slides} diapositivas para el tema: "${topic}". Estilo: ${style}. Devuelve SOLO un JSON válido representando un array de objetos con las propiedades: title, content, opcionalmente images (array de URLs) y opcionalmente videos (array de URLs de YouTube). Las propiedades deben llamarse exactamente title, content, images y videos si existen. El content de cada diapositiva debe tener entre 50 y 70 palabras. Responde únicamente con el JSON solicitado, sin comentarios ni texto adicional.`;

  const body = { model: 'openai/gpt-oss-20b', messages: [{ role: 'system', content: 'Eres un asistente que genera contenido para presentaciones. Responde únicamente con el JSON solicitado cuando se indique.' }, { role: 'user', content: prompt }], max_tokens: 2000, temperature: 0.2 };

  try {
    const resp = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${effectiveApiKey}` }, body: JSON.stringify(body) });
    const data = await resp.json();
    if (!resp.ok) {
      let errMsg = 'Error en la API de Groq';
      if (data?.error) errMsg = JSON.stringify(data.error);
      throw new Error(errMsg);
    }

    const content = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || '';
    if (!content) throw new Error('No se recibió contenido de la API');
    // Persist raw response for debugging (localStorage key: presentaciones.lastResponse)
  try { if (typeof localStorage !== 'undefined') localStorage.setItem('presentaciones.lastResponse', content) } catch (e) { console.warn('grok: could not persist lastResponse', e) }
    // Log raw response for debugging (will show in browser console)
    try { console.debug('[grok] raw assistant content:', content); console.debug('[grok] full response:', data); } catch (e) { console.warn('grok: debug log failed', e) }

    const tryParse = (txt: string): unknown => {
      try { return JSON.parse(txt); } catch { return null }
    }

    let parsed: unknown = tryParse(content);

    // If direct parse failed, try to strip markdown fences
    if (!parsed) {
      const fence = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/im);
      if (fence && fence[1]) parsed = tryParse(fence[1].trim());
    }

    // If still not parsed, try to find the first JSON array
    if (!parsed) {
      const arrMatch = content.match(/\[[\s\S]*?\]/m);
      if (arrMatch) parsed = tryParse(arrMatch[0]);
    }

    // If still not, try to find first JSON object
    if (!parsed) {
      const objMatch = content.match(/\{[\s\S]*?\}/m);
      if (objMatch) parsed = tryParse(objMatch[0]);
    }

    // If parsed is an object that wraps slides, try common keys
    if (parsed && !Array.isArray(parsed) && typeof parsed === 'object') {
      const obj = parsed as Record<string, unknown>;
      const candidates = ['slides', 'items', 'data', 'result', 'results'];
      for (const k of candidates) {
        if (obj[k] && Array.isArray(obj[k])) {
          parsed = obj[k];
          break;
        }
      }
    }

    if (!parsed || (Array.isArray(parsed) && parsed.length === 0 && !content.includes('['))) {
      throw new Error(`No se pudo parsear JSON desde la respuesta de Groq. Contenido (primeros 300 chars): ${content.slice(0,300)}`);
    }

  const slidesParsed: Array<Record<string, unknown>> = Array.isArray(parsed) ? parsed as Array<Record<string, unknown>> : [parsed as Record<string, unknown>];
    const normalized = slidesParsed.map((s, idx) => ({
    title: (s && s['title']) ? String(s['title']) : `Diapositiva ${idx+1}`,
    content: (s && s['content']) ? String(s['content']) : (s && s['text']) ? String(s['text']) : '',
    images: Array.isArray(s['images']) ? (s['images'] as Array<unknown>).map(String) : undefined,
    videos: Array.isArray(s['videos']) ? (s['videos'] as Array<unknown>).map(String) : (s && s['video']) ? [String(s['video'])] : undefined,
    web: Array.isArray(s['web']) ? (s['web'] as Array<unknown>).map(String) : Array.isArray(s['website']) ? (s['website'] as Array<unknown>).map(String) : Array.isArray(s['sites']) ? (s['sites'] as Array<unknown>).map(String) : (s && s['web']) ? [String(s['web'])] : undefined,
  imagesPosition: (s && (s['imagesPosition'] === 'left' || s['imagesPosition'] === 'right')) ? String(s['imagesPosition']) as 'left' | 'right' : undefined,
  }));

  // Ensure we return exactly the requested number of slides: truncate or pad with stubs
  if (normalized.length >= slides) {
    return normalized.slice(0, slides);
  }

  const missing = slides - normalized.length;
  for (let j = 1; j <= missing; j++) {
    const i = normalized.length + j;
  normalized.push({ title: `${topic} — Diapositiva ${i}`, content: `Contenido de ejemplo para "${topic}" en la diapositiva ${i}. Puedes editar este texto más tarde.`, images: style !== 'text' ? [`https://via.placeholder.com/600x300?text=${encodeURIComponent(topic + ' ' + i)}`] : undefined, videos: undefined, web: style !== 'text' ? [`https://example.com/${encodeURIComponent(topic)}-${i}`] : undefined, imagesPosition: undefined });
  }

  return normalized;
  } catch (err) {
    console.error('generateSlides error', err);
    await new Promise((r) => setTimeout(r, 300));
    return generateStub();
  }
}

export default generateSlides;
