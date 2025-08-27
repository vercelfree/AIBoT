import { Routes, Route } from 'react-router-dom'
import HomePage from './Home'
import BanglaTranslator from './pages/Translate'
import Correction from './pages/Correction'
import WordList from './pages/WordList'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/translate" element={<BanglaTranslator />} />
      <Route path="/correction" element={<Correction />} />
      <Route path="/wordlist" element={<WordList />} />
    </Routes>
  )
}

export default App
