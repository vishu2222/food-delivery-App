import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from './components/Common/Login.jsx'
import Register from './components/Common/Register'
import Home from './components/Common/Home'

import CustomerHome from './components/customers/customer/CustomerHome'
import CustomerRegistration from './components/customers/customer/CustomerRegistration'
import Checkout from './components/customers/orders/Checkout'
import ShowRestaurant from './components/customers/restaurants/Restaurant'
import AddNewAddress from './components/customers/address/AddNewAddress'
import OrderDetails from './components/customers/orders/OrderDetails'
import MyOrders from './components/customers/orders/MyOrders'

import RestaurantHome from './components/restaurants/RestaurantHome'
import RestaurantRegistration from './components/restaurants/RestaurantRegistration'

import DelivaryPartnerHome from './components/delivaryPartner/DelivaryPartnerHome'
import DelivaryPartnerRegistration from './components/delivaryPartner/DelivaryPartnerRegistration'

function App() {
  return (
    <div id='app-container'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

          {/* customer request routes */}
          <Route path='/customer-Home' element={<CustomerHome />}></Route>
          <Route path='/restaurant/:restaurantId' element={<ShowRestaurant />} />
          <Route path='/check-out' element={<Checkout />}></Route>
          <Route path='/register-customer' element={<CustomerRegistration />} />
          <Route path='/add-address' element={<AddNewAddress />} />
          <Route path='/orders' element={<MyOrders />} />
          <Route path='/order-details/:orderId' element={<OrderDetails />} />

          {/* restaurants requests routes */}
          <Route path='/register-restaurant' element={<RestaurantRegistration />} />
          <Route path='/restaurant-Home' element={<RestaurantHome />}></Route>

          {/* partner requests routes */}
          <Route path='/register-delivary-partner' element={<DelivaryPartnerRegistration />} />
          <Route path='/delivery_partner-Home' element={<DelivaryPartnerHome />}></Route>

          <Route path='*' element={<h1>Page not found</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
