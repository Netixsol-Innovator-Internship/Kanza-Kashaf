import { useStore } from '../store/useStore'
import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, Briefcase } from 'lucide-react'

const JobCard = ({ job }) => {
  const { addFilter } = useStore()
  const navigate = useNavigate()
  const filters = [job.role, job.level, ...job.languages, ...job.tools]

  const handleJobClick = () => {
    navigate(`/jobs/${job.id}`)
  }

  return (
    <div className={`job-card ${job.featured ? 'featured' : ''} flex flex-col md:flex-row md:items-center gap-4 md:gap-6`}>
      {/* Logo and company info */}
      <div className="flex items-start -mt-12 lg:mt-0 lg:pl-4">
        <img 
          src={job.logo} 
          alt={job.company} 
          className="w-14 h-14 lg:w-20 lg:h-20 rounded-lg object-contain border border-gray-200 dark:border-dark-600 p-1"
        />
      </div>
      
      {/* Job details */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-primary-600 font-bold text-sm lg:text-base">{job.company}</h3>
          <div className="flex gap-2">
            {job.new && <span className="tag-new text-xs">NEW!</span>}
            {job.featured && <span className="tag-featured text-xs">FEATURED</span>}
          </div>
        </div>
        
        <h2 
          className="text-base lg:text-lg font-bold cursor-pointer hover:text-primary-600 transition-colors mb-2 lg:mb-3"
          onClick={handleJobClick}
        >
          {job.position}
        </h2>
        
        <div className="flex flex-wrap items-center gap-3 text-gray-600 dark:text-gray-400 text-xs lg:text-sm mb-4 lg:mb-0">
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{job.postedAt}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Briefcase size={12} />
            <span>{job.contract}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <MapPin size={12} />
            <span>{job.location}</span>
          </div>
        </div>
      </div>
      
      {/* Filters - Now on left side for mobile, right for desktop */}
      <div className="border-t border-gray-200 dark:border-dark-700 pt-4 md:pt-0 md:border-t-0 flex flex-wrap gap-2 md:justify-end">
        {filters.map((filter, index) => (
          <button 
            key={index} 
            className="btn-filter text-xs lg:text-sm"
            onClick={() => addFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  )
}

export default JobCard