import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookmarkCheck, User } from 'lucide-react';

export const Navigation: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around py-3">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center space-y-1 ${
                isActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`
            }
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Empleos</span>
          </NavLink>
          
          <NavLink
            to="/saved"
            className={({ isActive }) =>
              `flex flex-col items-center space-y-1 ${
                isActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`
            }
          >
            <BookmarkCheck className="w-6 h-6" />
            <span className="text-xs">Guardados</span>
          </NavLink>
          
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center space-y-1 ${
                isActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`
            }
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Perfil</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};