import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import NosMagasinsPage from './pages/NosMagasinsPage'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/nos-magasins" element={<NosMagasinsPage />} />
      </Route>
    </Routes>
  )
}

export default App