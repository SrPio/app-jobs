import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { SearchNav } from "./components/SearchNav";
import { JobsPage } from "./pages/JobsPage";
import { SavedJobsPage } from "./pages/SavedJobsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ThemeProvider } from "./context/ThemeContext";
import { Job } from "./types";
import { signInWithGoogle, logout } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { AuthProvider } from "./context/AuthContext";
import { User } from "firebase/auth";

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("software developer");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const encodedQuery = encodeURIComponent(searchQuery);
        const response = await fetch(
          `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=04f8cc15&app_key=d5eec17969b3c5f8e909cfadf4f5b6fc&results_per_page=20&what=${encodedQuery}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error al cargar los empleos");
        }

        const formattedJobs: Job[] = data.results.map((job: any) => ({
          id: job.id,
          company: job.company.display_name,
          title: job.title,
          description: job.description,
          company_logo: job.company_logo || "",
          location: job.location.display_name,
          salary: job.salary_min
            ? `£${job.salary_min.toLocaleString()} - £${job.salary_max.toLocaleString()}`
            : "Salary not specified",
          redirect_url: job.redirect_url,
        }));

        setJobs(formattedJobs);
        setCurrentIndex(0);
        setLoading(false);
      } catch (err) {
        setError(
          "Error al cargar los empleos. Por favor, intenta de nuevo más tarde."
        );
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query || "software developer");
  };

  const handleSwipe = (direction: "left" | "right") => {
    const currentJob = jobs[currentIndex];

    if (direction === "right" && currentJob) {
      if (!savedJobs.some((job) => job.id === currentJob.id)) {
        setSavedJobs((prev) => [...prev, currentJob]);
      }
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const handleJobClick = (url: string) => {
    window.open(url, "_blank");
  };

  const handleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      setUser(user);
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
            <SearchNav onSearch={handleSearch} />
            <div className="max-w-screen-lg mx-auto pb-20 pt-16 h-[100dvh]">
              <Routes>
                <Route
                  path="/"
                  element={
                    <JobsPage
                      jobs={jobs}
                      currentIndex={currentIndex}
                      loading={loading}
                      error={error}
                      onSwipe={handleSwipe}
                      savedJobs={savedJobs}
                    />
                  }
                />
                <Route
                  path="/saved"
                  element={
                    <SavedJobsPage
                      jobs={savedJobs}
                      onJobClick={handleJobClick}
                    />
                  }
                />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </div>
            <Navigation />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
