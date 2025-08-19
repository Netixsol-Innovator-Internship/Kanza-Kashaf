import { useStore } from '../store/useStore'
import Header from './Header'
import { useEffect } from 'react'

const Layout = ({ children }) => {
  const { darkMode } = useStore()

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 transition-colors">
      <Header />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}

export default Layout