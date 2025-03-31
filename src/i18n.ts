import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import i18n from "i18next";

const resources = {
  en: {
    translation: {
      loadingJobs: "Loading jobs...",
      retry: "Retry",
      noMoreJobs: "No more jobs available",
      profile_title: "Your Profile",
      email: "Email",
      signInGoogle: "Sign in with Google",
      signOut: "Sign Out",
      confirmDelete: "Are you sure you want to delete this job?",
      yesDelete: "Yes, delete",
      noCancel: "No, cancel",
      noSavedJobs: "You have no saved jobs",
      notSavingJobs: "Jobs are not being saved until you sign in.",
      jobs: "Jobs",
      saved: "Saved",
      profile: "Profile",
      confirmation: "Confirmation",
    },
  },
  es: {
    translation: {
      loadingJobs: "Cargando empleos...",
      retry: "Reintentar",
      noMoreJobs: "No hay más empleos disponibles",
      profile_title: "Tu Perfil",
      email: "Email",
      signInGoogle: "Iniciar sesión con Google",
      signOut: "Cerrar sesión",
      confirmDelete: "¿Estás seguro de que deseas eliminar este empleo?",
      yesDelete: "Sí, eliminar",
      noCancel: "No, cancelar",
      noSavedJobs: "No tienes empleos guardados",
      notSavingJobs: "No se están guardando empleos hasta que inicies sesión.",
      jobs: "Empleos",
      saved: "Guardados",
      profile: "Perfil",
      confirmation: "Confirmación",
    },
  },
};

i18next.use(initReactI18next).init({
  resources,
  lng: navigator.language.startsWith("es") ? "es" : "en",
  interpolation: {
    escapeValue: false,
  },
});

if (typeof window !== "undefined") {
  (window as any).i18n = i18n;
}

export default i18next;
