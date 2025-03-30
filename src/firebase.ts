import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBk7rDpELFriv6_npyfLLafx2NuG293xSQ",
  authDomain: "app-jobs-f8949.firebaseapp.com",
  projectId: "app-jobs-f8949",
  storageBucket: "app-jobs-f8949.firebasestorage.app",
  messagingSenderId: "395455938036",
  appId: "1:395455938036:web:65afe615f207bc4b878da1",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Autenticación
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Firestore
const db = getFirestore(app);

// Función para iniciar sesión con Google
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error al iniciar sesión con Google:", error);
    throw error;
  }
};

// Función para cerrar sesión
const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};

// Función para guardar un empleo en Firestore
const saveJob = async (userId: string, job: any) => {
  // userId es de tipo string
  try {
    const docRef = await addDoc(
      collection(db, `users/${userId}/savedJobs`),
      job
    );
    return docRef.id;
  } catch (error) {
    console.error("Error al guardar el empleo:", error);
    throw error;
  }
};

// Función para obtener los empleos guardados de un usuario
const getSavedJobs = async (userId: string) => {
  try {
    const querySnapshot = await getDocs(
      collection(db, `users/${userId}/savedJobs`)
    );
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error al obtener los empleos guardados:", error);
    throw error;
  }
};

// Función para eliminar un empleo guardado
const deleteJob = async (userId: string, jobId: string) => {
  try {
    await deleteDoc(doc(db, `users/${userId}/savedJobs/${jobId}`));
  } catch (error) {
    console.error("Error al eliminar el empleo:", error);
    throw error;
  }
};

export { auth, db, signInWithGoogle, logout, saveJob, getSavedJobs, deleteJob };
