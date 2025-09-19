import { Outlet } from 'react-router'
import './App.css'
import Navbar from './components/common/Navbar'

function App() {

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default App
