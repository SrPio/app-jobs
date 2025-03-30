import React, { useState, useEffect } from "react";
import { Job } from "../types";
import { Building2, ExternalLink, X } from "lucide-react"; // X de Lucide
import { db } from "../firebase";
import { collection, getDocs, query, doc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null); // Empleo a eliminar

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

  const handleDeleteJob = async () => {
    if (jobToDelete) {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        try {
          await deleteDoc(
            doc(db, "users", user.uid, "savedJobs", jobToDelete.id)
          );
        } catch (error) {
          console.error("Error al eliminar el empleo:", error);
        }
      }

      // Animación fluida cuando se elimina un empleo
      setSavedJobs((prevJobs) =>
        prevJobs.filter((job) => job.id !== jobToDelete.id)
      );
      setIsModalOpen(false);
    }
  };

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
        <AnimatePresence>
          {savedJobs.map((job) => (
            <motion.div
              key={job.id}
              layout
              drag
              dragElastic={0.2}
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              onDragEnd={(event, info) => {
                event.target.style.transform = "translate(0px, 0px)";
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 8,
              }}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md cursor-grab active:cursor-grabbing" // 🔥 Aquí la magia
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
                <button
                  onClick={() => {
                    setJobToDelete(job);
                    setIsModalOpen(true);
                  }}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal de confirmación */}
      {isModalOpen && (
        <div
          id="popup-modal"
          className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 transition-colors">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-medium text-gray-800 dark:text-white">
                Confirmación
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="mt-4 text-gray-700 dark:text-gray-300">
              ¿Estás seguro de que deseas eliminar este empleo?
            </p>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={handleDeleteJob}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg"
              >
                Sí, eliminar
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg"
              >
                No, cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
