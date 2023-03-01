import React, { useEffect, useState } from 'react'
import { SiFoodpanda } from 'react-icons/si'
import { BiUserCircle } from 'react-icons/bi'
import { BsCart4 } from 'react-icons/bs'
import { useSelector } from 'react-redux'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  // PopoverHeader,
  PopoverBody,
  // PopoverFooter,
  // PopoverArrow,
  PopoverCloseButton,
  Portal,
  Button
} from '@chakra-ui/react'
import Cart from './cart/Cart'
import { useNavigate } from 'react-router-dom'
// import { getAddressFromPosition } from './requests'

function Nav() {
  const cart = useSelector((state) => state.cart)
  const userSignedIn = useSelector((state) => state.userSigned)
  // const userName = useSelector((state) => state.userName)

  const [quantity, setQuantity] = useState(0)
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

  // const [lat, setLat] = useState(null)
  // const [long, setLong] = useState(null)

  // navigator.geolocation.getCurrentPosition(
  //   (position) => {
  //     setLat(position.coords.latitude)
  //     setLong(position.coords.longitude)
  //   },
  //   (error) => {
  //     console.log(error)
  //     //
  //   }
  // )

  // useEffect(() => {
  //   getAddressFromPosition(lat, long)
  // }, [lat, long])

  function goTOCheckOut() {
    navigate('/check-out')
  }

  function gotToLogin() {
    if (userSignedIn) {
      return
    }
    navigate('/login')
  }

  return (
    <div className='flex mb-4 py-4 justify-between items-center bg-white'>
      <span className=' ml-64'>
        <SiFoodpanda className='w-12 h-12 text-orange-300' />
      </span>

      <div className='flex justify-end mr-64'>
        <span className='cursor-pointer'>
          <BiUserCircle className='w-8 h-8 text-orange-300' onClick={gotToLogin} />
        </span>

        {!userSignedIn && (
          <p onClick={gotToLogin} className=' text-sm mr-6'>
            Sign In
          </p>
        )}

        <span>
          <Popover>
            <PopoverTrigger>
              <button>
                <BsCart4 className='w-8 h-8 inline-block text-orange-300' />
              </button>
            </PopoverTrigger>
            <Portal>
              <PopoverContent>
                {/* <PopoverArrow /> */}
                {/* <PopoverHeader>Header</PopoverHeader> */}
                <PopoverCloseButton />
                <PopoverBody>
                  <Cart />
                  <Button onClick={goTOCheckOut} colorScheme='blue'>
                    checkout
                  </Button>
                </PopoverBody>
                {/* <PopoverFooter>This is the footer</PopoverFooter> */}
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
