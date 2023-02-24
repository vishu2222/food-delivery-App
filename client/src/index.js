import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reduxStorePersister from './store/index.js'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={reduxStorePersister.store}>
    <PersistGate loading={null} persistor={reduxStorePersister.persistor}>
      <App />
    </PersistGate>
  </Provider>
)
