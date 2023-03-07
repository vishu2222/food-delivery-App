import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardBody, Image, Stack, Heading, Text } from '@chakra-ui/react'

function RestaurantCard({ restaurant }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/restaurant/${restaurant.restaurant_id}`)}
      className='border border-slate-200 hover:border-slate-700  transform hover:scale-105  transition duration-300 cursor-pointer'>
      <Card className=' flex w-full'>
        <CardBody>
          <Image src={restaurant.img} borderRadius='lg' alt='restaurantImg' className=' m-auto' />
          <div className='flex'>
            <Stack mt='6' spacing='3' m='a'>
              <Heading size='md'>{restaurant.restaurant_name}</Heading>
              <Text color='blue.600' fontSize='sm'>
                {restaurant.start_time}-{restaurant.close_time}
              </Text>
            </Stack>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default RestaurantCard

// transform hover:scale-105  transition duration-300
