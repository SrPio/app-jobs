import React, { useState, useEffect } from "react";
import { Job } from "../types";
import { Building2, ExternalLink } from "lucide-react";
import { db } from "../firebase";
import { collection, getDocs, query } from "firebase/firestore";
import { getAuth } from "firebase/auth";

interface SavedJobsPageProps {
  onJobClick: (url: string) => void;
  jobs: Job[];
}

export const SavedJobsPage: React.FC<SavedJobsPageProps> = ({
  onJobClick,
  jobs,
}) => {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        try {
          const q = query(collection(db, "users", user.uid, "savedJobs"));
          const querySnapshot = await getDocs(q);
          const firebaseJobs: Job[] = [];
          querySnapshot.forEach((doc) => {
            firebaseJobs.push(doc.data() as Job);
          });
          setSavedJobs(firebaseJobs);
        } catch (error) {
          console.error("Error al cargar los empleos guardados:", error);
          setSavedJobs([]);
        }
      } else {
        setSavedJobs(jobs);
        setShowToast(true); // Mostrar el toast si no está logueado
      }
    };

    fetchSavedJobs();
  }, [jobs]);

  useEffect(() => {
    if (showToast) {
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    }
  }, [showToast]);

  if (!savedJobs || savedJobs.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <p className="text-gray-500 dark:text-gray-400">
          No tienes empleos guardados
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {showToast && (
        <div
          className="fixed bottom-[calc(4rem+1rem)] left-1/2 transform -translate-x-1/2 
    w-[90%] max-w-md mx-auto p-4 text-gray-500 bg-white rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800 
    flex items-center space-x-4 opacity-100 transition-opacity duration-500 ease-in-out"
        >
          <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200">
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
            </svg>
            <span className="sr-only">Warning icon</span>
          </div>
          <div className="ms-3 text-sm font-normal">
            No se están guardando empleos hasta que inicies sesión.
          </div>
          <button
            type="button"
            className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
            aria-label="Close"
            onClick={() => setShowToast(false)} // Close button functionality
          >
            <span className="sr-only">Close</span>
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Empleos Guardados ({savedJobs.length})
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {savedJobs.map((job, index) => (
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
                <p className="text-gray-600 dark:text-gray-400">
                  {job.company}
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm">
                  {job.location}
                </p>
                {job.salary && (
                  <p className="text-green-600 dark:text-green-400 font-medium text-sm mt-1">
                    {job.salary}
                  </p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
