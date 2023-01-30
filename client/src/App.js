import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import RestaurantMenu from './pages/RestaurantMenu'

function App() {
  return (
    <div id='app-container'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/menu/:restaurantId' element={<RestaurantMenu />} />
          <Route path='*' element={<h1>Page not found</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
