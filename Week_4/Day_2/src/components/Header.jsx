import { useStore } from '../store/useStore'
import { Sun, Moon } from 'lucide-react'

const Header = () => {
  const { darkMode, toggleDarkMode } = useStore()

  return (
    <header className="bg-gradient-to-r from-primary-600 to-secondary-600 pb-20 pt-6 lg:pt-8 lg:pb-24">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8 lg:mb-12">
          <h1 className="text-2xl lg:text-3xl font-bold text-white">JobFinder</h1>
          <button 
            onClick={toggleDarkMode}
            className="p-2 lg:p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors flex items-center gap-1 lg:gap-2"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <>
                <Sun size={16} className="lg:w-5 lg:h-5" />
              </>
            ) : (
              <>
                <Moon size={16} className="lg:w-5 lg:h-5" />
              </>
            )}
          </button>
        </div>
        
        <div className="text-center">
          <h2 className="text-xl lg:text-2xl font-bold text-white mb-3 lg:mb-4">Find Your Dream Job</h2>
          <p className="text-primary-100 max-w-2xl mx-auto text-sm lg:text-base">
            Browse through thousands of job listings and find the perfect match for your skills and experience.
          </p>
        </div>
      </div>
    </header>
  )
}

export default Header