import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'
import { BrowserRouter } from 'react-router-dom' // <--- This is the ONE Router you need

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* <--- Wraps the whole App */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
