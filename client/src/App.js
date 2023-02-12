import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register'
import CustomerRegistration from './pages/customers/CustomerRegistration'
import RestaurantRegistration from './pages/restaurants/RestaurantRegistration'
import DelivaryPartnerRegistration from './pages/delivaryPartner/DelivaryPartnerRegistration'

function App() {
  return (
    <div id='app-container'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/register-customer' element={<CustomerRegistration />} />

          <Route path='/register-restaurant' element={<RestaurantRegistration />} />

          <Route path='/register-delivary-partner' element={<DelivaryPartnerRegistration />} />
          <Route path='*' element={<h1>Page not found</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
