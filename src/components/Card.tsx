import React from "react";
import { Job } from "../types";
import { Heart, X, Building2, MapPin } from "lucide-react";
import { useSwipeable } from "react-swipeable";

interface CardProps {
  job: Job;
  onSwipe: (direction: "left" | "right") => void;
  isActive?: boolean;
  forcedSwipe: "left" | "right" | null;
  saveJob: (job: Job) => Promise<void>;
}

// Array of gradient combinations
const gradients = [
  "bg-gradient-to-r from-violet-400 via-pink-500 to-orange-500",
  "bg-gradient-to-r from-emerald-400 via-teal-500 to-blue-500",
  "bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500",
  "bg-gradient-to-r from-amber-400 via-orange-500 to-red-500",
  "bg-gradient-to-r from-lime-400 via-green-500 to-teal-500",
  "bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500",
];

export const Card: React.FC<CardProps> = ({
  job,
  onSwipe,
  isActive = true,
  forcedSwipe,
  saveJob,
}) => {
  const [offset, setOffset] = React.useState(0);
  const [rotation, setRotation] = React.useState(0);
  const [isLeaving, setIsLeaving] = React.useState(false);

  // Generate a consistent gradient for each job based on its ID
  const gradientIndex =
    parseInt(job.id.replace(/\D/g, ""), 10) % gradients.length;
  const gradient = gradients[gradientIndex];

  React.useEffect(() => {
    if (forcedSwipe) {
      handleSwipeAnimation(forcedSwipe);
    }
  }, [forcedSwipe]);

  const handleSwipeAnimation = (direction: "left" | "right") => {
    setIsLeaving(true);
    if (direction === "left") {
      setOffset(-window.innerWidth * 1.5);
      setRotation(-45);
    } else {
      setOffset(window.innerWidth * 1.5);
      setRotation(45);
    }
  };

  const handlers = useSwipeable({
    onSwiping: (event) => {
      if (!isActive || isLeaving) return;
      setOffset(event.deltaX);
      setRotation(event.deltaX * 0.1);
    },
    onSwipedLeft: () => {
      if (!isActive || isLeaving) return;
      if (Math.abs(offset) >= window.innerWidth * 0.4) {
        handleSwipeAnimation("left");
        setTimeout(() => {
          onSwipe("left");
        }, 300);
      } else {
        setOffset(0);
        setRotation(0);
      }
    },
    onSwipedRight: () => {
      if (!isActive || isLeaving) return;
      if (Math.abs(offset) >= window.innerWidth * 0.4) {
        handleSwipeAnimation("right");
        setTimeout(() => {
          onSwipe("right");
          saveJob(job);
        }, 300);
      } else {
        setOffset(0);
        setRotation(0);
      }
    },
    onTouchEndOrOnMouseUp: () => {
      if (!isActive || isLeaving) return;
      if (Math.abs(offset) < window.innerWidth * 0.4) {
        setOffset(0);
        setRotation(0);
      }
    },
    trackMouse: true,
    trackTouch: true,
    preventDefaultTouchmoveEvent: true,
    delta: 100,
  });

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive || isLeaving) return;
      if (e.key === "ArrowLeft") {
        handleSwipeAnimation("left");
        setTimeout(() => {
          onSwipe("left");
        }, 300);
      }
      if (e.key === "ArrowRight") {
        handleSwipeAnimation("right");
        setTimeout(() => {
          onSwipe("right");
        }, 300);
      }
    };

    if (isActive) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive, isLeaving]);

  const opacity = Math.abs(offset) / 100;

  return (
    <div
      {...(isActive ? handlers : {})}
      className={`w-full h-full select-none ${
        isActive ? "cursor-grab active:cursor-grabbing" : ""
      }`}
      style={{
        transform: `translateX(${offset}px) rotate(${rotation}deg)`,
        transition:
          isLeaving || offset === 0 ? "transform 0.3s ease-out" : "none",
        pointerEvents: isLeaving ? "none" : "auto",
      }}
    >
      <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl bg-white dark:bg-gray-800 transition-colors">
        <div
          className={`h-40 sm:h-36 ${gradient} flex items-center justify-center relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/30" />
          <div className="relative z-10">
            {job.company_logo ? (
              <img
                src={job.company_logo}
                alt={job.company}
                className="h-28 sm:h-24 object-contain filter drop-shadow-lg"
              />
            ) : (
              <Building2 className="w-20 h-20 sm:w-16 sm:h-16 text-white drop-shadow-lg" />
            )}
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors">
            {job.title}
          </h2>

          <div className="flex items-center mt-2 text-gray-600 dark:text-gray-400 transition-colors">
            <Building2 className="w-4 h-4 mr-2" />
            <span>{job.company}</span>
          </div>

          <div className="flex items-center mt-2 text-gray-600 dark:text-gray-400 transition-colors">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{job.location}</span>
          </div>

          {job.salary && (
            <div className="mt-2 text-green-600 dark:text-green-400 font-semibold transition-colors">
              {job.salary}
            </div>
          )}

          <div className="mt-4 text-gray-600 dark:text-gray-300 line-clamp-4 transition-colors">
            {job.description}
          </div>
        </div>

        {isActive && offset !== 0 && (
          <>
            <div
              className="absolute top-8 right-8"
              style={{ opacity: offset > 0 ? opacity : 0 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-full p-4 shadow-lg">
                <Heart className="w-16 h-16 text-green-500" />
              </div>
            </div>
            <div
              className="absolute top-8 left-8"
              style={{ opacity: offset < 0 ? opacity : 0 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-full p-4 shadow-lg">
                <X className="w-16 h-16 text-red-500" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
