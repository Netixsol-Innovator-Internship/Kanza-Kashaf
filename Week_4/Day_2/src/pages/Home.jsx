import { useStore } from '../store/useStore'
import { jobsData } from '../data/jobsData'
import JobCard from '../components/JobCard'
import FilterBar from '../components/FilterBar'
import SearchBar from '../components/SearchBar'

const Home = () => {
  const { filters, searchQuery } = useStore()
  
  // Filter jobs based on active filters and search query
  const filteredJobs = jobsData.filter(job => {
    const matchesFilters = filters.length === 0 || 
      filters.every(filter => 
        [job.role, job.level, ...job.languages, ...job.tools].includes(filter)
      )
    
    // Search query, check if job matches search
    const matchesSearch = searchQuery === '' || 
      job.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      [job.role, job.level, ...job.languages, ...job.tools].some(item => 
        item.toLowerCase().includes(searchQuery.toLowerCase())
      )
    
    return matchesFilters && matchesSearch
  })

  return (
    <div className="container mx-auto sm:px-4 py-6">
      <SearchBar />
      <FilterBar />
      
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg lg:text-xl font-semibold text-gray-800 dark:text-white">
          {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
        </h2>
        
        {filters.length > 0 && (
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
          >
            Back to Top
          </button>
        )}
      </div>
      
      <div className="space-y-4 lg:space-y-6">
        {filteredJobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
      
      {filteredJobs.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-dark-800 rounded-lg shadow">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white mb-4">No jobs found</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-6 text-sm lg:text-base">
            Try adjusting your search query or filters. You can search by job title, company, or skills.
          </p>
          <button 
            onClick={() => {
              useStore.getState().clearFilters()
              useStore.getState().setSearchQuery('')
            }}
            className="px-5 py-2.5 lg:px-6 lg:py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors text-sm lg:text-base"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  )
}

export default Home