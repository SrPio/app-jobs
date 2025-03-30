import React, { useState } from "react";
import { Search, X, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface SearchNavProps {
  onSearch: (query: string) => void;
}

export const SearchNav: React.FC<SearchNavProps> = ({ onSearch }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, toggleTheme } = useTheme();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearch("");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50 transition-colors">
      <div className="w-full max-w-3xl mx-auto px-4">
        <div className="h-16 flex items-center">
          <div className="flex-shrink-0 h-10">
            <img
              src="../../public/icons/Jooblin Logo.svg"
              alt="Logo Jooblin"
              className="h-full w-auto"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <div className="relative flex items-center gap-2">
              <div
                className={`
                  absolute right-[88px] transition-all duration-300 pointer-events-none
                  ${
                    isSearchOpen
                      ? "w-[200px] sm:w-[280px] opacity-100 pointer-events-auto mr-2"
                      : "w-0 opacity-0"
                  }
                `}
              >
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    type="text"
                    placeholder="Buscar empleos..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </form>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (isSearchOpen && searchQuery) {
                    handleSearch(new Event("submit") as any);
                  }
                  setIsSearchOpen(!isSearchOpen);
                }}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>

              <button
                onClick={toggleTheme}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label={
                  theme === "light"
                    ? "Activar modo oscuro"
                    : "Activar modo claro"
                }
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
