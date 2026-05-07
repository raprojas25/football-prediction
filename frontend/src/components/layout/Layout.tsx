import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-betano-dark">
      <Navbar />
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  )
}
