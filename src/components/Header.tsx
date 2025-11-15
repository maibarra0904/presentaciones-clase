export default function Header() {
  return (
  // fixed header so it never moves while scrolling; very high z to sit above floating action buttons
  <header className="fixed left-0 right-0 top-0 w-full bg-white/90 backdrop-blur-sm shadow-sm z-[9999]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <img src="/classdeck.png" alt="ClassDeck" className="w-10 h-10 rounded-md object-cover shadow-sm" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-extrabold text-slate-900 leading-tight">ClassDeck</h1>
              <div className="text-xs text-slate-500 -mt-0.5">Presentaciones y recursos para clase</div>
            </div>
          </div>

          {/* Removed top navigation links (Inicio / Generador / Vista) as requested */}
          <div className="flex items-center gap-3">
            <div className="sm:hidden text-slate-700 font-semibold">ClassDeck</div>
          </div>
        </div>
      </div>
    </header>
  )
}
