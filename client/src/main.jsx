import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/global.css'

createRoot(document.getElementById('root')).render( // FROM CLIENT - RENDER INDEX

  <StrictMode>        {/*TODO: REMOVE BEFORE SHIPPING*/} {/* ACTIVATING REACT STRICT MODE */}
    <BrowserRouter>                                      {/* LINK INTERPRETER */}
      <App />                                            {/* APPLICATION */}
    </BrowserRouter>
  </StrictMode>,
)
