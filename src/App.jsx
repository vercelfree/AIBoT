import { Routes, Route } from 'react-router-dom'
import HomePage from './Home'
import BanglaTranslator from './pages/Translate'
import Correction from './pages/Correction'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/translate" element={<BanglaTranslator />} />
      <Route path="/correction" element={<Correction />} />
    </Routes>
  )
}

export default App
