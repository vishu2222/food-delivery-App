import React, { useEffect, useState } from 'react'
import { SiFoodpanda } from 'react-icons/si'
import { BiUserCircle } from 'react-icons/bi'
import { BsCart4 } from 'react-icons/bs'
import { useSelector } from 'react-redux'
import Cart from './cart/Cart'
import { useNavigate } from 'react-router-dom'
import { getAddressFromPosition } from './requests'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverCloseButton,
  Portal,
  Button
} from '@chakra-ui/react'

function Nav() {
  const cart = useSelector((state) => state.cart)
  const userSignedIn = useSelector((state) => state.userSigned)
  // const userName = useSelector((state) => state.userName)

  const [quantity, setQuantity] = useState(0)
  const [currentAddress, setCurrentAddress] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    console.log('cart:', cart, typeof cart, '')
    if (cart.length === 0) {
      setQuantity(0)
    }

    if (cart.length > 0) {
      setQuantity(cart.reduce((sum, item) => sum + item.quantity, 0))
    }
  }, [cart])

  const [lat, setLat] = useState(null)
  const [long, setLong] = useState(null)

  navigator.geolocation.getCurrentPosition(
    (position) => {
      setLat(position.coords.latitude)
      setLong(position.coords.longitude)
    },
    (error) => {
      console.log(error)
      //
    }
  )

  useEffect(() => {
    ;(async () => {
      const response = await getAddressFromPosition(lat, long)
      if (response === undefined) return
      setCurrentAddress(response.results[0].formatted_address)
    })()
  }, [lat, long])

  function goTOCheckOut() {
    if (!userSignedIn) {
      navigate('/login')
      return
    }
    navigate('/check-out')
  }

  function gotToLogin() {
    if (userSignedIn) {
      navigate('/orders')
      return
    }
    navigate('/login')
  }

  function goToHome() {
    navigate('/customer-Home')
  }

  return (
    <div className='flex mb-4 py-4 justify-between items-center bg-white'>
      <span className=' ml-64 cursor-pointer flex items-center'>
        <SiFoodpanda className='w-12 h-12 text-orange-300' onClick={goToHome} />
        <p className=' text-xs font-serif font-light p-1'>{currentAddress}</p>
      </span>

      <div className='flex justify-end mr-64'>
        <span>
          <Popover>
            <PopoverTrigger>
              <button>
                <BiUserCircle className='w-8 h-8 inline-block text-orange-300' />
              </button>
            </PopoverTrigger>
            <Portal>
              <PopoverContent>
                <PopoverCloseButton />
                <PopoverBody>
                  <Button onClick={gotToLogin} colorScheme='blue'>
                    {userSignedIn ? 'Your-Orders' : 'Sign In'}
                  </Button>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
        </span>

        <span>
          <Popover>
            <PopoverTrigger>
              <button>
                <BsCart4 className='w-8 h-8 inline-block text-orange-300' />
              </button>
            </PopoverTrigger>
            <Portal>
              <PopoverContent>
                <PopoverCloseButton />
                <PopoverBody>
                  <Cart />
                  <Button onClick={goTOCheckOut} colorScheme='blue'>
                    checkout
                  </Button>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>

          {quantity}
        </span>
      </div>
    </div>
  )
}

export default Nav

//  {/* <span className='cursor-pointer'>
//       <BiUserCircle className='w-8 h-8 text-orange-300' onClick={gotToLogin} />
//     </span> */}
