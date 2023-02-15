import React from 'react'
import requests from '../requests'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    async function authorizeMe() {
      const [status, userRole] = await requests.authorizeMe()
      if (status !== 200) {
        navigate('/login')
        return
      }

      switch (userRole) {
        case 'customer':
          navigate('/customer-Home')
          break
        case 'restaurant':
          navigate('/restaurant-Home')
          break
        case 'delivery_partner':
          navigate('/delivery_partner-Home')
          break

        default:
          navigate('/login')
      }
    }

    authorizeMe()
  }, [navigate])

  return <div>Home</div>
}

export default Home
