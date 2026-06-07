import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import SpaceDetail from './pages/SpaceDetail'
import ItemDetail from './pages/ItemDetail'
import Search from './pages/Search'
import Family from './pages/Family'
import Settings from './pages/Settings'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="spaces/:id" element={<SpaceDetail />} />
        <Route path="items/:id" element={<ItemDetail />} />
        <Route path="search" element={<Search />} />
        <Route path="family" element={<Family />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
