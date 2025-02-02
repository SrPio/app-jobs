import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBk7rDpELFriv6_npyfLLafx2NuG293xSQ",
    authDomain: "app-jobs-f8949.firebaseapp.com",
    projectId: "app-jobs-f8949",
    storageBucket: "app-jobs-f8949.firebasestorage.app",
    messagingSenderId: "395455938036",
    appId: "1:395455938036:web:65afe615f207bc4b878da1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        return user; // Devuelve los datos del usuario
    } catch (error) {
        console.error("Error al iniciar sesión con Google:", error);
        throw error;
    }
};

const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
};

export { auth, signInWithGoogle, logout };
