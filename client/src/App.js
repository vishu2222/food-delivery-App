import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home.jsx'
import { Menu } from './pages/Menu.jsx'

function App() {
  return (
    <div id='app-container'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/menu/:restaurantId' element={<Menu />} />
          <Route path='*' element={<h1>Page not found</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
