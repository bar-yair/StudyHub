import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import NavBar from './components/NavBar/NavBar'
import Home from './components/home/home'
import Login from './components/login/login'
import Chatupload from './components/chatupload/chatupload'
import Register from './components/register/register'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ width: '100%' }}>
      <NavBar />
      {/* <Home/> */}
      {/* <Chatupload /> */}
      {/* <Login /> */}
      {/* <Register /> */}
    </div>
  )
}

export default App
