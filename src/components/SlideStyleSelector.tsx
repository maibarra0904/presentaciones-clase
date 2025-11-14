// SlideStyleSelector: select the output style for generated slides

type Props = {
  value: 'text' | 'images' | 'advanced'
  onChange: (v: 'text' | 'images' | 'advanced') => void
}

export default function SlideStyleSelector({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Estilo de diapositiva</label>
      <div className="flex items-center gap-3">
        <label className={`cursor-pointer px-3 py-1 rounded border ${value === 'text' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
          <input className="sr-only" type="radio" name="style" checked={value === 'text'} onChange={() => onChange('text')} />
          <div className="text-sm">Texto</div>
          <div className="text-xs text-gray-500">Solo texto (por defecto)</div>
        </label>

        <label className={`cursor-pointer px-3 py-1 rounded border ${value === 'images' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
          <input className="sr-only" type="radio" name="style" checked={value === 'images'} onChange={() => onChange('images')} />
          <div className="text-sm">Imágenes + Texto</div>
          <div className="text-xs text-gray-500">Incluye imágenes sugeridas</div>
        </label>

        <label className={`cursor-pointer px-3 py-1 rounded border ${value === 'advanced' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
          <input className="sr-only" type="radio" name="style" checked={value === 'advanced'} onChange={() => onChange('advanced')} />
          <div className="text-sm">Plantilla avanzada</div>
          <div className="text-xs text-gray-500">Diseño y multimedia (próximamente)</div>
        </label>
      </div>
    </div>
  )
}
