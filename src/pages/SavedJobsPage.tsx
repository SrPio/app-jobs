import React from 'react';
import { Job } from '../types';
import { Building2, ExternalLink } from 'lucide-react';

interface SavedJobsPageProps {
  jobs: Job[];
  onJobClick: (url: string) => void;
}

export const SavedJobsPage: React.FC<SavedJobsPageProps> = ({ jobs, onJobClick }) => {
  if (jobs.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <p className="text-gray-500 dark:text-gray-400">No tienes empleos guardados</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Empleos Guardados ({jobs.length})</h2>
      <div className="grid grid-cols-1 gap-4">
        {jobs.map((job, index) => (
          <button
            key={`${job.id}-${index}`}
            onClick={() => onJobClick(job.redirect_url)}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-all w-full text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                {job.company_logo ? (
                  <img
                    src={job.company_logo}
                    alt={job.company}
                    className="w-12 h-12 object-contain"
                  />
                ) : (
                  <Building2 className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                )}
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold text-lg text-gray-800 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 flex items-center gap-2">
                  {job.title}
                  <ExternalLink className="w-4 h-4" />
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{job.company}</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm">{job.location}</p>
                {job.salary && (
                  <p className="text-green-600 dark:text-green-400 font-medium text-sm mt-1">{job.salary}</p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};