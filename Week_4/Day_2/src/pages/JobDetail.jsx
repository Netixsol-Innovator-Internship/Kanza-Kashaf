import { useParams, useNavigate } from 'react-router-dom'
import { jobsData } from '../data/jobsData'
import { ArrowLeft } from 'lucide-react'

const JobDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const job = jobsData.find(j => j.id === parseInt(id))

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-dark-cyan dark:text-white mb-4">Job not found</h2>
        <p className="text-dark-cyan dark:text-gray-300 mb-6">The job you're looking for doesn't exist.</p>
        <button 
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          Back to Job Listings
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto sm:px-4 py-6 max-w-4xl">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center text-primary font-bold mb-8 hover:underline dark:text-white"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to Job Listings
      </button>
      
      <div className="job-details bg-white dark:bg-very-dark-cyan rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <img 
              src={job.logo} 
              alt={job.company} 
              className="w-16 h-16"
            />
            <div>
              <h1 className="text-2xl font-bold dark:text-white">{job.position}</h1>
              <p className="text-primary font-medium mt-1">{job.company}</p>
              
              <div className="flex items-center gap-4 mt-4 text-dark-cyan dark:text-gray-300">
                <span>{job.postedAt}</span>
                <span>•</span>
                <span>{job.contract}</span>
                <span>•</span>
                <span>{job.location}</span>
              </div>
            </div>
            
            <button className="btn-primary md:ml-auto mt-6 md:mt-0">
              Apply Now
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-dark-cyan dark:text-gray-300 mb-6">{job.description}</p>
            
            <h2 className="text-xl font-bold dark:text-white mb-4">Requirements</h2>
            <ul className="list-disc pl-5 text-dark-cyan dark:text-gray-300 mb-8">
              {job.requirements.map((req, index) => (
                <li key={index} className="mb-2">{req}</li>
              ))}
            </ul>
            
            <h2 className="text-xl font-bold dark:text-white mb-4">Role Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div>
                <h3 className="font-semibold dark:text-white">Role</h3>
                <p className="text-dark-cyan dark:text-gray-300">{job.role}</p>
              </div>
              <div>
                <h3 className="font-semibold dark:text-white">Level</h3>
                <p className="text-dark-cyan dark:text-gray-300">{job.level}</p>
              </div>
              <div>
                <h3 className="font-semibold dark:text-white">Languages</h3>
                <p className="text-dark-cyan dark:text-gray-300">{job.languages.join(', ')}</p>
              </div>
              <div>
                <h3 className="font-semibold dark:text-white">Tools</h3>
                <p className="text-dark-cyan dark:text-gray-300">{job.tools.join(', ') || 'None'}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button className="btn-primary w-full md:w-auto">
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDetail