import { Routes, Route } from 'react-router-dom'
import HomePage from './Home'
import BanglaTranslator from './pages/Translate'
import Correction from './pages/Correction'
import WordList from './pages/WordList'

function App() {
  return (
    <div className="min-h-screen w-full bg-white relative">
  {/* Noise Texture (Darker Dots) Background */}
  <div
    className="absolute inset-0 z-0"
    style={{
      background: "#ffffff",
      backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.35) 1px, transparent 0)",
      backgroundSize: "20px 20px",
    }}
  />
     {/* Your Content/Components */}
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/translate" element={<BanglaTranslator />} />
      <Route path="/correction" element={<Correction />} />
      <Route path="/wordlist" element={<WordList />} />
    </Routes>
</div>
  )
}

export default App
