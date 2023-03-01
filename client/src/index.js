import React from 'react'
import './index.css'
import ReactDOM from 'react-dom/client'
import App from './App'
import reduxStorePersister from './store/index.js'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ChakraProvider } from '@chakra-ui/react'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={reduxStorePersister.store}>
    <PersistGate loading={null} persistor={reduxStorePersister.persistor}>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </PersistGate>
  </Provider>
)
