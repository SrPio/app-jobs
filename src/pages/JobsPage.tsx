import React from "react";
import { Card } from "../components/Card";
import { Job } from "../types";
import { Building2, Heart, X } from "lucide-react";
import { db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

interface JobsPageProps {
  jobs: Job[];
  savedJobs: Job[];
  currentIndex: number;
  loading: boolean;
  error: string | null;
  onSwipe: (direction: "left" | "right") => void;
}

export const JobsPage: React.FC<JobsPageProps> = ({
  jobs,
  savedJobs,
  currentIndex,
  loading,
  error,
  onSwipe,
}) => {
  const [swipeDirection, setSwipeDirection] = React.useState<
    "left" | "right" | null
  >(null);
  const [isAnimating, setIsAnimating] = React.useState(false);

  const handleButtonSwipe = (direction: "left" | "right") => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSwipeDirection(direction);
    setTimeout(() => {
      onSwipe(direction);
      saveJob(visibleJobs[0]);
      setSwipeDirection(null);
      setIsAnimating(false);
    }, 300);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-400 animate-pulse" />
          <p className="text-gray-600">Cargando empleos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center px-4">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const visibleJobs = jobs.slice(currentIndex, currentIndex + 3);

  const saveJob = async (job: Job) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const jobRef = doc(db, "users", user.uid, "savedJobs", job.id);
        await setDoc(jobRef, job);
        console.log("Trabajo guardado");
      }
    } catch (error) {
      console.error("Error al guardar el trabajo:", error);
    }
  };

  return (
    <div className="fixed inset-x-0 top-[4rem] bottom-[4rem] overflow-hidden py-6 px-4 sm:px-6">
      <div className="relative w-full h-full max-w-md mx-auto">
        {visibleJobs.length > 0 ? (
          <>
            <div className="relative w-full h-full">
              {visibleJobs.map((job, index) => {
                const isTop = index === 0;
                return (
                  <div
                    key={job.id}
                    className="absolute inset-0"
                    style={{
                      zIndex: visibleJobs.length - index,
                      transform: `scale(${1 - index * 0.05}) translateY(${
                        index * 8
                      }px)`,
                      transition: "all 0.3s ease-out",
                      pointerEvents: isTop && !isAnimating ? "auto" : "none",
                    }}
                  >
                    <Card
                      job={job}
                      onSwipe={isTop ? onSwipe : () => {}}
                      isActive={isTop && !isAnimating}
                      forcedSwipe={isTop ? swipeDirection : null}
                      saveJob={saveJob}
                    />
                  </div>
                );
              })}
            </div>

            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-8 z-50">
              <button
                onClick={() => handleButtonSwipe("left")}
                disabled={isAnimating}
                className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Rechazar"
              >
                <X className="w-8 h-8 text-white" />
              </button>
              <button
                onClick={() => {
                  if (visibleJobs.length > 0) {
                    handleButtonSwipe("right");
                  }
                }}
                disabled={isAnimating}
                className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Guardar"
              >
                <Heart className="w-8 h-8 text-white" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-xl text-gray-500">
              No hay más empleos disponibles
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
