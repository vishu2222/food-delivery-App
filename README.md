# Food-delivery-App

Food delivery app for placing and managing orders, assigning and tracking delivery, notifying appropriate parties on change of order status. 

### To Run the app in local system

     - clone the app
     - cd server
     - npm install
     - Setup postgress server and database schema (/server/models/schema/schema.sql)
     - add env variables PORT(server port), DB_CONN_STRING, MAP_KEY(google maps key), NODE_ENV = 'development'
     - node server.js

### APP Features

     - login for customers, restaurants, delivery agents on the same page
     - session authorization
     - customers can select a restaurant add items to cart, select saved address or add current location and place order
     - restaurants get notifications
     - customers get notified when restaurant accepts, delivery-assigned, pick-up and delivery
     - delivery agent get notified on assignment, pickup and delivery
     - customer can track location of the delivery-agent on google maps.
     - works with multiple customers, delivery partners and restaurants
     - A delivery partner assigned for delivery will be unavailable for new assignents untill current order is delivered

### limitations

     - not suaitable for production
     - doesnt work with same client logging through multiple devices
     - didnt handle when customer adds food items from multiple restaurants for a single order on the front-end side
     - UI is not properly built for clients registration
     - when customers select their live address, his lat and long are saved in database as delivery location but not properly shown on the UI during        address selection
     - items added to cart are not saved on database but in local storage, so doesnt work with multiple devices.
     - Logout is not yet implemented. Navigate back to login page to login with different user role 

### Technologies:

     - React, tailwind, chakra-UI, google-maps, socket-io client, React-Redux, geolocation api
     - node, express, socket io server, postgressql
     - fake data loaded from faker.js

### screen shots

![Screenshot from 2023-03-13 20-51-10](https://user-images.githubusercontent.com/90732088/224750960-a5a436a2-c9ee-4c21-9518-5de844d74e1b.png)

![Screenshot from 2023-03-13 20-55-16](https://user-images.githubusercontent.com/90732088/224751004-0bc17b99-1d43-4da9-aa4b-393f8552f063.png)

![Screenshot from 2023-03-13 20-55-46](https://user-images.githubusercontent.com/90732088/224751068-b798f38f-183c-4c59-a1f8-8b0dbec126fc.png)

### References:

https://www.postgresql.org/docs/current/datatype-json.html
https://itnext.io/storing-json-in-postgres-using-node-js-c8ff50337013
https://www.npmjs.com/package/geolib?activeTab=readme
https://stackoverflow.com/questions/38511976/how-can-i-export-socket-io-into-other-modules-in-nodejs
https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition
(google map) https://tomchentw.github.io/react-google-maps/#marker
(google map) https://www.npmjs.com/package/@react-google-maps/api
(geoLocation) https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition
(Icons download)
https://icons8.com/icon/44603/home-address
https://icons8.com/icon/nemxCugEm0Sh/food-delivery
https://icons8.com/icon/HLc5UtMzkFym/restaurant
