import React from 'react';
import { User, Mail, MapPin, Briefcase } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  return (
    <div className="p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4 transition-colors">
            <User className="w-12 h-12 text-blue-500 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Tu Perfil</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
            <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="font-medium text-gray-800 dark:text-white">usuario@ejemplo.com</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
            <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Ubicación</p>
              <p className="font-medium text-gray-800 dark:text-white">Madrid, España</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
            <Briefcase className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Profesión</p>
              <p className="font-medium text-gray-800 dark:text-white">Desarrollador Full Stack</p>
            </div>
          </div>
        </div>

        <button className="w-full mt-6 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors">
          Editar Perfil
        </button>
      </div>
    </div>
  );
};