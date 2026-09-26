// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestaore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBSASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBSASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBSASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBSASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBSASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBSASE_APP_ID
};

if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId || !firebaseConfig.storageBucket || !firebaseConfig.messagingSenderId || !firebaseConfig.appId) {
  console.error("Falta de configuración de Firebase. Por favor, asegúrate de que todas las variables de entorno estén definidas correctamente.");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestaore(app);