/* eslint-disable react/jsx-no-constructed-context-values */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'

import { Context, value } from './context/Context'
import 'normalize.css'
import './index.css'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <Router>
    <Context.Provider value={value}>
      <App />
    </Context.Provider>
  </Router>
)
