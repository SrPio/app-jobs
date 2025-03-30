import React from "react";
import { User, Mail } from "lucide-react";
import { auth, signInWithGoogle, logout } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export const ProfilePage: React.FC = () => {
  const [user] = useAuthState(auth);

  return (
    <div className="p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4 transition-colors">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Foto de perfil"
                className="w-24 h-24 rounded-full"
              />
            ) : (
              <User className="w-12 h-12 text-[#00bbaa] dark:text-[#00bbaa]" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {user ? user.displayName : "Tu Perfil"}
          </h2>
        </div>

        {user && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3  rounded-lg transition-colors">
              <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Email
                </p>
                <p className="font-medium text-gray-800 dark:text-white">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={user ? logout : signInWithGoogle}
          className={`w-full mt-6 py-2 px-4 rounded-lg flex items-center justify-center transition-colors ${
            user
              ? "bg-[#00bbaa] text-white hover:bg-[#00bbaa] dark:bg-[#00bbaa] dark:hover:bg-[#009988]"
              : "bg-gray-100 text-gray-600 dark:text-gray-300 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          {!user && (
            <img
              src="/icons/Google__G__logo.svg"
              alt="Google Logo"
              className="w-6 h-6 mr-2"
            />
          )}
          {user ? "Cerrar sesión" : "Iniciar sesión con Google"}
        </button>
      </div>
    </div>
  );
};
