import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './Home'
import BanglaTranslator from './pages/Translate'
import Correction from './pages/Correction'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/translate" element={<BanglaTranslator />} />
        <Route path="/correction" element={<Correction />} />
      </Routes>
    </Router>
  )
}

export default App
