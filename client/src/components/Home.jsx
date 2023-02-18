import React, { useEffect } from 'react'
import requests from '../requests'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    async function authorizeMe() {
      const [status, userType] = await requests.authorizeMe()
      if (status !== 200) {
        navigate('/login')
        return
      }

      switch (userType) {
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

  return <></>
}

export default Home
