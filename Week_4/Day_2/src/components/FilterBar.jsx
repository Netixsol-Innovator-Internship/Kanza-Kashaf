import { useStore } from '../store/useStore'
import { X } from 'lucide-react'

const FilterBar = () => {
  const { filters, removeFilter, clearFilters } = useStore()

  if (filters.length === 0) return null

  return (
    <div className="bg-white dark:bg-dark-800 shadow-lg rounded-lg p-4 lg:p-5 -mt-8 lg:-mt-10 mb-6 flex flex-wrap items-center gap-3">
      <div className="flex flex-wrap gap-2 flex-1">
        {filters.map((filter, index) => (
          <div key={index} className="flex overflow-hidden rounded-md shadow-sm">
            <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 font-medium py-1.5 px-3 text-sm">
              {filter}
            </span>
            <button 
              onClick={() => removeFilter(filter)}
              className="bg-primary-600 hover:bg-primary-700 text-white p-2 transition-colors flex items-center"
              aria-label={`Remove ${filter} filter`}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      
      <button 
        onClick={clearFilters}
        className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium hover:underline transition-colors text-sm"
      >
        Clear
      </button>
    </div>
  )
}

export default FilterBar