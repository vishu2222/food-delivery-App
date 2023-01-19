import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Login } from './components/Login'
import { SignUp } from './components/SignUp'
import { Home } from './components/Home.jsx'

function App() {
  return (
    <div id='app-container'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='*' element={<h1>Page not found</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
