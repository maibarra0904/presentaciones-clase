// App entry for Presentaciones generator
import './App.css'
import { BrowserRouter,  Routes, Route } from 'react-router-dom'
import PresentationPage from './pages/PresentationPage'
import HomePage from './pages/HomePage'
import GeneratorPage from './pages/GeneratorPage'
import Header from './components/Header'

function App() {
  return (
    <BrowserRouter>
      {/* add top padding so content is not hidden behind the fixed header */}
      <div className="min-h-screen bg-gray-50 p-6 pt-20">
        <Header />

        <main className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/generador" element={<GeneratorPage />} />
            <Route path="/presentacion/:id" element={<PresentationPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
