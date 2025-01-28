import React from 'react';
import { Job } from '../types';
import { Building2, ExternalLink } from 'lucide-react';

interface SavedJobsProps {
  jobs: Job[];
  onJobClick: (url: string) => void;
}

export const SavedJobs: React.FC<SavedJobsProps> = ({ jobs, onJobClick }) => {
  if (jobs.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
      <h3 className="text-lg font-semibold mb-3">Empleos guardados ({jobs.length})</h3>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {jobs.map((job) => (
          <button
            key={job.id}
            onClick={() => onJobClick(job.redirect_url)}
            className="flex-shrink-0 w-32 group focus:outline-none"
          >
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center group-hover:ring-2 group-hover:ring-blue-500 transition-all">
              {job.company_logo ? (
                <img
                  src={job.company_logo}
                  alt={job.company}
                  className="w-12 h-12 rounded-full object-contain"
                />
              ) : (
                <Building2 className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <p className="text-sm text-center mt-1 line-clamp-2 group-hover:text-blue-500">
              {job.title}
              <ExternalLink className="w-3 h-3 inline ml-1" />
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};